/**
 * Finhouse Sabah Günlük Mail Özeti
 * - Son 24 saatteki maillerden CTO için actionable taskları çıkarır
 * - Gmail SMTP ile ayhan.agirgol@finhouse.com.tr'ye mail gönderir
 */
import fs from 'node:fs';
import nodemailer from 'nodemailer';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const CLIENT_ID     = process.env.MS_CLIENT_ID;
const TENANT_ID     = process.env.MS_TENANT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const MAILBOX       = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
const GMAIL_EMAIL   = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const REPORT_TO     = 'ayhan.agirgol@finhouse.com.tr';

// Onay isteği pattern
const APPROVAL_PATTERNS = [
  /onay/i, /onayın/i, /onayınızı/i, /approve/i, /approval/i,
  /uygun musunuz/i, /görüşünüz/i, /karar/i, /yetkilendirme/i,
  /talep.*onay/i, /onay.*talep/i,
];
const isApprovalRequest = (subject, preview) => {
  const text = `${subject} ${preview}`;
  return APPROVAL_PATTERNS.some(p => p.test(text));
};

// Actionable pattern
const TASK_PATTERNS = [
  /aksiyon/i, /action/i, /takip/i, /follow.?up/i,
  /güncelle/i, /update/i, /gönder/i, /send/i,
  /toplantı/i, /meeting/i, /görüşme/i,
  /teklif/i, /proposal/i, /poc/i,
  /sözleşme/i, /contract/i,
  /entegrasyon/i, /integration/i,
  /proje/i, /project/i,
  /yanıt/i, /reply/i, /cevap/i,
  /ödeme/i, /payment/i, /fatura/i, /invoice/i,
  /demo/i, /sunum/i, /presentation/i,
  /acil/i, /urgent/i, /asap/i,
];
const isActionable = (subject, preview) => {
  const text = `${subject} ${preview}`;
  return TASK_PATTERNS.some(p => p.test(text));
};

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

// ── 1. Mailleri çek ─────────────────────────────────────────────────────────
const token = await getToken();
const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
let mails = [];
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/messages?$top=100&$select=subject,from,receivedDateTime,isRead,bodyPreview,importance&$orderby=receivedDateTime desc`;

while (next) {
  const res = await graph(token, next);
  const msgs = (res.value || []).filter(m => {
    // Kendi gönderdiğim mailler hariç
    if (m.from?.emailAddress?.address === MAILBOX) return false;
    if (m.receivedDateTime < since) return false;
    return true;
  });
  mails.push(...msgs);
  const last = res.value?.[res.value.length - 1];
  if (last && last.receivedDateTime < since) break;
  next = res['@odata.nextLink'] || null;
}

console.log(`Son 24 saatte ${mails.length} mail bulundu.`);

// ── 2. Task sınıflandırma ────────────────────────────────────────────────────
const approvals = [];
const actionable = [];
const fyi = [];

for (const m of mails) {
  const subj = m.subject || '';
  const prev = m.bodyPreview || '';
  const senderName = m.from?.emailAddress?.name || m.from?.emailAddress?.address || '';
  const item = { subject: subj, from: senderName, date: m.receivedDateTime?.slice(0,16).replace('T',' '), isRead: m.isRead };

  if (isApprovalRequest(subj, prev)) {
    approvals.push(item);
  } else if (isActionable(subj, prev)) {
    actionable.push(item);
  } else {
    fyi.push(item);
  }
}

const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

// ── 3. Takvim: bugünkü etkinlikler + çakışma tespiti ────────────────────────
let calendarHtml = '';
try {
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const calRes = await graph(token,
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/calendar/events` +
    `?$filter=start/dateTime ge '${todayStart.toISOString()}' and start/dateTime le '${todayEnd.toISOString()}'` +
    `&$orderby=start/dateTime&$top=20&$select=subject,start,end,location,isCancelled`
  );

  const events = (calRes.value || []).filter(e => !e.isCancelled);
  const conflicts = [];

  if (events.length === 0) {
    calendarHtml = '<p>Bugün takvimde etkinlik yok.</p>';
  } else {
    // Çakışma tespiti
    const conflicts = [];
    for (let i = 0; i < events.length - 1; i++) {
      const a = events[i];
      const b = events[i + 1];
      const aEnd   = new Date(a.end?.dateTime);
      const bStart = new Date(b.start?.dateTime);
      if (bStart < aEnd) {
        conflicts.push({ a: a.subject, b: b.subject, aEnd: aEnd.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'}), bStart: bStart.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'}) });
      }
    }

    const rows = events.map(e => {
      const s = new Date(e.start?.dateTime).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'});
      const en = new Date(e.end?.dateTime).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'});
      const loc = e.location?.displayName ? ` · ${e.location.displayName}` : '';
      return `<tr><td>${s}–${en}</td><td>${e.subject}</td><td>${loc}</td></tr>`;
    }).join('');

    calendarHtml = `
    <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
      <tr style="background:#4a90d9;color:#fff"><th>Saat</th><th>Toplantı</th><th>Konum</th></tr>
      ${rows}
    </table>`;

    if (conflicts.length > 0) {
      calendarHtml += `<div style="background:#fff3cd;border:1px solid #ffc107;padding:10px;margin-top:8px;border-radius:4px">
        <strong>⚠️ Çakışan Toplantılar:</strong><ul>
        ${conflicts.map(c => `<li><strong>${c.a}</strong> (${c.aEnd}) ile <strong>${c.b}</strong> (${c.bStart}) çakışıyor</li>`).join('')}
        </ul></div>`;
    }
  }
  console.log(`Takvim: ${events.length} etkinlik, ${conflicts.length} çakışma`);
} catch(e) {
  calendarHtml = `<p style="color:red">Takvim alınamadı: ${e.message}</p>`;
  console.warn('Takvim hatası:', e.message);
}

// ── 4. Mail içeriği ──────────────────────────────────────────────────────────
const htmlSections = [];

if (approvals.length > 0) {
  htmlSections.push(`
    <h2 style="color:#c0392b;">🔴 Onay Bekleyenler (${approvals.length})</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
      <tr style="background:#f2f2f2"><th>Gönderen</th><th>Konu</th><th>Tarih</th></tr>
      ${approvals.map(i => `<tr><td>${i.from}</td><td>${i.subject}</td><td>${i.date}</td></tr>`).join('')}
    </table>`);
}

if (actionable.length > 0) {
  htmlSections.push(`
    <h2 style="color:#e67e22;">🟡 Aksiyon Gerektiren (${actionable.length})</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
      <tr style="background:#f2f2f2"><th>Gönderen</th><th>Konu</th><th>Tarih</th></tr>
      ${actionable.map(i => `<tr><td>${i.from}</td><td>${i.subject}</td><td>${i.date}</td></tr>`).join('')}
    </table>`);
}

if (fyi.length > 0) {
  htmlSections.push(`
    <h2 style="color:#27ae60;">🟢 Bilgi Amaçlı (${fyi.length})</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
      <tr style="background:#f2f2f2"><th>Gönderen</th><th>Konu</th><th>Tarih</th></tr>
      ${fyi.map(i => `<tr><td>${i.from}</td><td>${i.subject}</td><td>${i.date}</td></tr>`).join('')}
    </table>`);
}

if (mails.length === 0) {
  htmlSections.push('<p>Son 24 saatte okunması gereken yeni mail bulunamadı. 🎉</p>');
}

const html = `
<html><body style="font-family:Arial,sans-serif;max-width:800px;margin:auto">
  <h1>📬 Finhouse Günlük Sabah Özeti — ${today}</h1>

  <h2>📅 Bugünkü Toplantılar</h2>
  ${calendarHtml}

  <hr>
  <h2>📧 Mail Özeti</h2>
  <p>Son 24 saatte <strong>${mails.length}</strong> mail tespit edildi.</p>
  ${htmlSections.join('<hr>')}
  <hr><p style="color:#888;font-size:12px">OpenClaw tarafından otomatik oluşturulmuştur.</p>
</body></html>`;

// ── 4. Gmail SMTP ile gönder ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', port: 465, secure: true,
  auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
});

await transporter.sendMail({
  from: `"OpenClaw" <${GMAIL_EMAIL}>`,
  to: REPORT_TO,
  subject: `📬 Finhouse Günlük Mail Özeti — ${today}`,
  html,
});
console.log(`Mail gönderildi → ${REPORT_TO}`);

// ── 5. Fatura tespiti → Muhasebe ekibine otomatik ilet ──────────────────────
const INVOICE_PATTERNS = [/fatura/i, /invoice/i, /receipt/i, /billing/i, /ödeme bildirimi/i];
const isInvoice = (subj, prev) => INVOICE_PATTERNS.some(p => p.test(`${subj} ${prev}`));
const MUHASEBE = (process.env.MUHASEBE_RECIPIENTS || 'iklime.guney@techsmmm.com,arzu.sancar@finhouse.com.tr').split(',');

const invoiceMails = mails.filter(m => isInvoice(m.subject || '', m.bodyPreview || ''));
if (invoiceMails.length > 0) {
  console.log(`\n${invoiceMails.length} fatura maili tespit edildi, muhasebe ekibine iletiliyor...`);
  for (const inv of invoiceMails) {
    const senderAddr = inv.from?.emailAddress?.address || '';
    const senderName = inv.from?.emailAddress?.name || senderAddr;
    const invBody = `Merhaba,\n\nAşağıdaki fatura otomatik olarak tespit edilmiş ve bilgilerinize iletilmektedir.\n\nGönderen: ${senderName} <${senderAddr}>\nKonu: ${inv.subject}\nTarih: ${inv.receivedDateTime?.slice(0,10)}\n\nÖzet:\n${inv.bodyPreview?.slice(0,400)}\n\nSaygılarımla,\nFinHouse A.Ş. — Otomatik İletim`;
    await transporter.sendMail({
      from: `"OpenClaw / FinHouse" <${GMAIL_EMAIL}>`,
      to: MUHASEBE,
      subject: `Fatura İletimi: ${inv.subject}`,
      text: invBody,
    });
    console.log(`  ✅ İletildi: ${inv.subject?.slice(0,60)} → muhasebe`);
  }
}
