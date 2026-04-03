import fs from 'node:fs';
const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}
const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const mailbox = 'ayhan.agirgol@finhouse.com.tr';

const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
});
const { access_token: token } = await tokenRes.json();

const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=30&$orderby=receivedDateTime desc&$select=subject,from,receivedDateTime,isRead,bodyPreview`;
const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const json = await res.json();
if (!res.ok) { console.error(JSON.stringify(json?.error)); process.exit(1); }
const msgs = json.value || [];
console.log(JSON.stringify(msgs.map(m => ({
  date: m.receivedDateTime?.slice(0,16).replace('T',' '),
  from: m.from?.emailAddress?.address,
  fromName: m.from?.emailAddress?.name,
  subject: m.subject,
  preview: m.bodyPreview?.slice(0, 250),
  isRead: m.isRead,
})), null, 2));
