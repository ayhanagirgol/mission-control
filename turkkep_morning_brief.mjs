/**
 * Türkkep Sabah Günlük Task Raporu
 * - Son 24 saatteki maillerden CTO için actionable taskları çıkarır
 * - Gmail SMTP ile ayhan.agirgol@finhouse.com.tr'ye mail gönderir
 * - WhatsApp custom-1 kanalına kısa özet gönderir
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

const TURKKEP_CLIENT_ID     = process.env.TURKKEP_MS_CLIENT_ID;
const TURKKEP_TENANT_ID     = process.env.TURKKEP_MS_TENANT_ID;
const TURKKEP_CLIENT_SECRET = process.env.TURKKEP_MS_CLIENT_SECRET;
const TURKKEP_MAILBOX       = process.env.TURKKEP_MAILBOX_UPN;
const GMAIL_EMAIL           = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASSWORD    = process.env.GMAIL_APP_PASSWORD;
const REPORT_TO             = 'ayhan.agirgol@finhouse.com.tr';

// Noise kaynakları (CTO için task çıkartılmaz)
const SKIP_SENDERS = [
  'qradar@turkkep.com.tr',
  'endpoint@turkkep.com.tr',
  'dcmonitoring@ms6.turkkep.com.tr',
  'gebzefw_backup@turkkep.com.tr',
  'ankarafw_backup@turkkep.com.tr',
  'destekportal@mailgw.turkkep.com.tr',
  'E-FaturaSQLAlert@turkkep.com.tr',
  'muratcan.egri@turkkep.com.tr',
  'nafiye.ozturk@verisoft.com',
  'c.cetin@searchinform.com',
];

// Onay isteği pattern (sadece CTO onayı gerektiren talepler)
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
  /sızma testi/i, /penetration/i,
  /entegrasyon/i, /integration/i,
  /proje/i, /project/i,
  /yanıt/i, /reply/i, /cevap/i,
  /ddos/i, /güvenlik bildirimi/i,
];
const isActionable = (subject, preview) => {
  const text = `${subject} ${preview}`;
  return TASK_PATTERNS.some(p => p.test(text));
};

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${TURKKEP_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: TURKKEP_CLIENT_ID, client_secret: TURKKEP_CLIENT_SECRET, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
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
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(TURKKEP_MAILBOX)}/messages?$top=100&$select=subject,from,receivedDateTime,isRead,bodyPreview,importance&$orderby=receivedDateTime desc`;

while (next) {
  const res = await graph(token, next);
  const msgs = (res.value || []).filter(m => {
    if (SKIP_SENDERS.includes(m.from?.emailAddress?.address)) return false;
    // Kendi gönderdiğim mailler hariç
    if (m.from?.emailAddress?.address === TURKKEP_MAILBOX) return false;
    if (m.receivedDateTime < since) return false;
    return true;
  });
  mails.push(...msgs);
  const last = res.value?.[res.value.length - 1];
  if (last && last.receivedDateTime < since) break;
  next = res['@odata.nextLink'] || null;
}

// ── 2. Task sınıflandırma ────────────────────────────────────────────────────
const approvals = [];
const actionable = [];
const fyi = [];

for (const m of mails) {
  const subj = m.subject || '';
  const prev = m.bodyPreview || '';
  const sender = m.from?.emailAddress?.address || '';
  const senderName = m.from?.emailAddress?.name || sender;
  const item = { subject: subj, from: senderName, date: m.receivedDateTime?.slice(0,16).replace('T',' ') };

  if (isApprovalRequest(subj, prev)) {
    approvals.push(item);
  } else if (isActionable(subj, prev)) {
    actionable.push(item);
  } else {
    fyi.push(item);
  }
}

const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

// ── 3. Mail içeriği ──────────────────────────────────────────────────────────
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

const html = `
<html><body style="font-family:Arial,sans-serif;max-width:800px;margin:auto">
  <h1>📬 Türkkep Günlük Mail Özeti — ${today}</h1>
  <p>Son 24 saatte <strong>${mails.length}</strong> okunması gereken mail tespit edildi.</p>
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
  subject: `📬 Türkkep Günlük Task Özeti — ${today}`,
  html,
});
console.log(`Mail gönderildi → ${REPORT_TO}`);

// ── 5. WhatsApp özet ─────────────────────────────────────────────────────────
const waText = `📬 *Türkkep Günlük Özeti* — ${today}

${approvals.length > 0 ? `🔴 *Onay Bekleyen (${approvals.length}):*\n${approvals.map(i => `• ${i.subject} (${i.from})`).join('\n')}\n` : ''}${actionable.length > 0 ? `🟡 *Aksiyon Gerektiren (${actionable.length}):*\n${actionable.map(i => `• ${i.subject} (${i.from})`).join('\n')}\n` : ''}${fyi.length > 0 ? `🟢 *Bilgi Amaçlı:* ${fyi.length} mail\n` : ''}
Detaylı rapor finhouse mailine gönderildi.`;

console.log('--- WhatsApp Mesajı ---');
console.log(waText);
console.log('--- END ---');

// WhatsApp gönderim için çıktıyı kaydet
fs.writeFileSync('/tmp/turkkep_wa_brief.txt', waText, 'utf8');
console.log('WhatsApp mesajı /tmp/turkkep_wa_brief.txt dosyasına kaydedildi.');
