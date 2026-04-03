import fs from 'node:fs';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const TENANT_ID = process.env.MS_TENANT_ID;
const CLIENT_ID = process.env.MS_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const MAILBOX = 'ayhan.agirgol@finhouse.com.tr';

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

const token = await getToken();
const res = await fetch(
  `https://graph.microsoft.com/v1.0/users/${MAILBOX}/messages?$select=from,subject&$top=100&$orderby=receivedDateTime desc`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const data = await res.json();

const senders = {};
for (const m of data.value || []) {
  const addr = m.from?.emailAddress?.address?.toLowerCase();
  const name = m.from?.emailAddress?.name;
  if (addr) senders[addr] = name || addr;
}

console.log('=== Finhouse Mailbox — Son 100 Maildeki Gönderenler ===\n');
for (const [addr, name] of Object.entries(senders)) {
  console.log(`${name} <${addr}>`);
}
console.log(`\nToplam: ${Object.keys(senders).length} farklı gönderen`);
