/**
 * Türkkep Mailbox Otomasyonu (saatlik çalışır)
 * 1. qradar maillerini sınıflandır (kritik → bayrak, diğerleri → qradar klasörü)
 * 2. platinbilisi.com.tr'den gelen maillere "Platin" kategorisi (turuncu) ata
 */
import fs from 'node:fs';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const clientId = process.env.TURKKEP_MS_CLIENT_ID;
const tenantId = process.env.TURKKEP_MS_TENANT_ID;
const clientSecret = process.env.TURKKEP_MS_CLIENT_SECRET;
const mailbox = process.env.TURKKEP_MAILBOX_UPN;

const CRITICAL_KEYWORDS = [
  'Critical','High Severity','P1','Ransomware','Data Exfiltration',
  'Exfiltration','Privilege Escalation','Lateral Movement',
  'Command and Control','Persistence',
  'TA0010','TA0011','TA0008','TA0004','TA0005','TA0040',
];
const isCritical = s => CRITICAL_KEYWORDS.some(k => s?.toLowerCase().includes(k.toLowerCase()));

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) }
  });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status} ${url}: ${JSON.stringify(j?.error)}`);
  return j;
}

const token = await getToken();
console.log(`[${new Date().toISOString()}] Türkkep Otomasyonu Başladı\n`);

// ── 1. qradar klasörünü bul/oluştur ──────────────────────────────────────────
const fRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders?$top=50`);
let qFolder = (fRes.value||[]).find(f => f.displayName.toLowerCase() === 'qradar');
if (!qFolder) {
  qFolder = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders`,
    { method: 'POST', body: JSON.stringify({ displayName: 'qradar' }) });
  console.log('qradar klasörü oluşturuldu ✓');
}

// ── 2. "Platin" kategorisini bul/oluştur (turuncu) ───────────────────────────
let platinCategory = null;
try {
  const catRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/outlook/masterCategories`);
  platinCategory = (catRes.value||[]).find(c => c.displayName === 'Platin');
  if (!platinCategory) {
    platinCategory = await graph(token,
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/outlook/masterCategories`,
      { method: 'POST', body: JSON.stringify({ displayName: 'Platin', color: 'preset2' }) } // preset2 = turuncu
    );
    console.log('Platin kategorisi oluşturuldu (turuncu) ✓');
  }
} catch(e) {
  console.warn(`Kategori işlemi atlandı: ${e.message}`);
}

// ── 3. Inbox'ı tara ve işle ───────────────────────────────────────────────────
console.log('\nInbox taranıyor...');
let qMoved = 0, qFlagged = 0, platinTagged = 0, serviceDeleted = 0;

// Service Desk gürültü filtresi: "grubunuza açılmıştır" içeren mailler silinir
const isServiceNoise = subject => {
  const s = subject?.toLowerCase() || '';
  return s.includes('grubunuza açılmıştır') || s.includes('grubunuza acilmistir');
};

let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages?$top=100&$select=id,subject,flag,from,categories`;

while (next) {
  const res = await graph(token, next);
  const msgs = res.value || [];

  for (const msg of msgs) {
    const sender = msg.from?.emailAddress?.address || '';

    // Service Desk gürültü: "grubunuza açılmıştır" içeren mailleri sil
    if (isServiceNoise(msg.subject)) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`,
        { method: 'DELETE' });
      serviceDeleted++;
      console.log(`🗑️  Service Desk silindi: ${msg.subject?.slice(0,70)}`);
      continue;
    }

    // qradar maili
    if (sender === 'qradar@turkkep.com.tr') {
      if (isCritical(msg.subject)) {
        await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`,
          { method: 'PATCH', body: JSON.stringify({ flag: { flagStatus: 'flagged' } }) });
        qFlagged++;
        console.log(`🚩 QRadar kritik: ${msg.subject?.slice(0,70)}`);
      } else {
        await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
          { method: 'POST', body: JSON.stringify({ destinationId: qFolder.id }) });
        qMoved++;
        console.log(`📁 QRadar taşındı: ${msg.subject?.slice(0,70)}`);
      }
      continue;
    }

    // Platin maili
    if ((sender.endsWith('@platinbilisi.com.tr') || sender.endsWith('@platinbilisim.com.tr')) && platinCategory) {
      const alreadyTagged = (msg.categories||[]).includes('Platin');
      if (!alreadyTagged) {
        const existing = msg.categories || [];
        await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`,
          { method: 'PATCH', body: JSON.stringify({ categories: [...existing, 'Platin'] }) });
        platinTagged++;
        console.log(`🟠 Platin etiketlendi: ${msg.subject?.slice(0,70)}`);
      }
    }
  }

  next = res['@odata.nextLink'] || null;
}

console.log(`\n=== ÖZET ===`);
console.log(`📁 QRadar taşınan:   ${qMoved}`);
console.log(`🚩 QRadar bayrak:    ${qFlagged}`);
console.log(`🟠 Platin etiketli: ${platinTagged}`);
console.log(`🗑️  Service Desk silinen: ${serviceDeleted}`);
console.log(`[${new Date().toISOString()}] Tamamlandı.`);
