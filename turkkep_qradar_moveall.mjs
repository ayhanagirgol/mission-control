/**
 * Tüm inbox'taki qradar maillerini taşı (sayfalama sınırı yok)
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
  if (!res.ok) throw new Error(j.error);
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
console.log(`qradar klasörü bulundu ✓\n`);

let moved = 0, flagged = 0;
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages?$top=100&$select=id,subject,flag,from`;

while (next) {
  const res = await graph(token, next);
  const qMails = (res.value||[]).filter(m => m.from?.emailAddress?.address === 'qradar@turkkep.com.tr');

  for (const msg of qMails) {
    if (isCritical(msg.subject)) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`,
        { method: 'PATCH', body: JSON.stringify({ flag: { flagStatus: 'flagged' } }) });
      flagged++;
      console.log(`🚩 ${msg.subject?.slice(0,80)}`);
    } else {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: qFolder.id }) });
      moved++;
      console.log(`📁 ${msg.subject?.slice(0,80)}`);
    }
  }

  next = res['@odata.nextLink'] || null;
}

console.log(`\n=== TAMAMLANDI ===`);
console.log(`📁 Taşınan: ${moved}`);
console.log(`🚩 Bayrak:  ${flagged}`);
if (moved === 0 && flagged === 0) console.log('Inbox\'ta kalan qradar maili yok.');
