/**
 * Türkkep mailbox'ından son mailleri çek,
 * konu + gönderici listele (task analizi için)
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

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token hatası: ${json.error}`);
  return json.access_token;
}

const token = await getToken();

const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=30&$orderby=receivedDateTime desc&$select=subject,from,receivedDateTime,isRead,bodyPreview`;
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const json = await res.json();
const msgs = (json.value || []).filter(m => m.from?.emailAddress?.address !== 'qradar@turkkep.com.tr');

console.log(JSON.stringify(msgs.map(m => ({
  date: m.receivedDateTime?.slice(0,10),
  from: m.from?.emailAddress?.address,
  subject: m.subject,
  preview: m.bodyPreview?.slice(0, 300),
  isRead: m.isRead,
})), null, 2));
