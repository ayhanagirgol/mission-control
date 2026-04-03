/**
 * Türkkep Gelen Kutu Kuralları
 * 1. Kritik qradar → Bayrak
 * 2. Diğer qradar → qradar klasörüne taşı
 * 3. platinbilisim.com.tr → Platin kategorisi
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
  const res = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

const token = await getToken();

// qradar klasörünü bul
const fRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders?$top=50`);
const qFolder = (fRes.value||[]).find(f => f.displayName.toLowerCase() === 'qradar');
if (!qFolder) { console.error('qradar klasörü bulunamadı!'); process.exit(1); }

// Mevcut QRadar kurallarını temizle
const rulesRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`);
for (const rule of (rulesRes.value||[])) {
  if (rule.displayName?.startsWith('QRadar') || rule.displayName?.startsWith('Platin')) {
    await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules/${rule.id}`, { method: 'DELETE' });
    console.log(`  Eski kural silindi: ${rule.displayName}`);
  }
}

// Kural 1: Kritik QRadar → Bayrak (High/Critical severity olanlar)
console.log('\n[1] Kritik QRadar → Bayrak kuralı...');
await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`, {
  method: 'POST',
  body: JSON.stringify({
    displayName: 'QRadar - Kritik Bayrak',
    sequence: 1,
    isEnabled: true,
    conditions: {
      senderContains: ['qradar@turkkep.com.tr'],
      subjectContains: ['Critical','High Severity','Ransomware','Exfiltration','Lateral Movement','TA0010','TA0011'],
    },
    actions: {
      markImportance: 'high',
    },
  }),
});
console.log('  ✅ Oluşturuldu');

// Kural 2: Diğer QRadar → qradar klasörü
console.log('\n[2] QRadar → qradar klasörü kuralı...');
await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`, {
  method: 'POST',
  body: JSON.stringify({
    displayName: 'QRadar - Klasöre Taşı',
    sequence: 2,
    isEnabled: true,
    conditions: {
      senderContains: ['qradar@turkkep.com.tr'],
    },
    actions: {
      moveToFolder: qFolder.id,
    },
  }),
});
console.log('  ✅ Oluşturuldu');

// Kural 3: Platin → Kategori
console.log('\n[3] Platin → Kategori kuralı...');
await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`, {
  method: 'POST',
  body: JSON.stringify({
    displayName: 'Platin - Kategori',
    sequence: 3,
    isEnabled: true,
    conditions: {
      senderContains: ['platinbilisi.com.tr', 'platinbilisim.com.tr'],
    },
    actions: {
      assignCategories: ['Platin'],
    },
  }),
});
console.log('  ✅ Oluşturuldu');

console.log('\n=== TAMAMLANDI ===');
console.log('Artık launchd otomasyonu yerine Outlook kuralları devreye girdi.');
console.log('Mailleri manuel taşıma gerektirmez.');
