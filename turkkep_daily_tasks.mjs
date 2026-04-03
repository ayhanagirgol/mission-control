/**
 * Türkkep Daily Task Extractor
 * Son 24 saatteki mailleri çeker, task çıkartmak için yapılandırılmış çıktı verir.
 * Çıktı: JSON (stdout)
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

// Skip senders (noise)
const SKIP_SENDERS = ['qradar@turkkep.com.tr'];

// Son 24 saat
const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
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

const token = await getToken();

// Son 24 saatteki mailleri al (tüm mailbox, qradar hariç)
let mails = [];
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=100&$select=subject,from,receivedDateTime,isRead,bodyPreview,importance,flag&$orderby=receivedDateTime desc`;

while (next) {
  const res = await graph(token, next);
  const msgs = (res.value || []).filter(m => {
    const sender = m.from?.emailAddress?.address || '';
    if (SKIP_SENDERS.includes(sender)) return false;
    if (m.receivedDateTime < since) return false;
    return true;
  });
  mails.push(...msgs);
  // Eğer sayfanın son maili since'den önceyse dur
  const last = res.value?.[res.value.length - 1];
  if (last && last.receivedDateTime < since) break;
  next = res['@odata.nextLink'] || null;
}

const output = mails.map(m => ({
  date: m.receivedDateTime?.slice(0, 16).replace('T', ' '),
  from: m.from?.emailAddress?.address,
  fromName: m.from?.emailAddress?.name,
  subject: m.subject,
  preview: m.bodyPreview?.slice(0, 400),
  isRead: m.isRead,
  importance: m.importance,
  flagged: m.flag?.flagStatus === 'flagged',
}));

console.log(JSON.stringify(output, null, 2));
