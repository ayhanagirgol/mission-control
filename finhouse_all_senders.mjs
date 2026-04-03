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

// Otomatik/sistem adresleri filtrele
const SKIP_PATTERNS = [
  /no.?reply/i, /donotreply/i, /noreply/i,
  /notifications@/i, /drive-shares/i, /infoemails/i,
  /myactivecampaign/i, /substack\.com/i,
  /godaddy/i, /apple\.com/i, /microsoft\.com/i,
  /bilgi\.ito/i, /members\./i, /o=exchangelabs/i,
  /crowdcasts@/i, /publishing@/i,
  /^team@learn\./i, /^team@marketing\./i,
];

const SKIP_EXACT = new Set([
  'ayhan.agirgol@finhouse.com.tr',
  'ayhan.agirgol@gmail.com',
]);

const token = await getToken();
const senders = {};
let url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/messages?$select=from,toRecipients,subject&$top=999&$orderby=receivedDateTime desc`;

let pages = 0;
while (url && pages < 5) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  for (const m of data.value || []) {
    const addr = m.from?.emailAddress?.address?.toLowerCase().trim();
    const name = m.from?.emailAddress?.name;
    if (!addr) continue;
    if (SKIP_EXACT.has(addr)) continue;
    if (SKIP_PATTERNS.some(p => p.test(addr))) continue;
    if (!senders[addr]) senders[addr] = name || addr;
  }
  url = data['@odata.nextLink'] || null;
  pages++;
}

// Gönderilen adresleri de kontrol edelim (TO alanı)
url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/mailFolders/SentItems/messages?$select=toRecipients,subject&$top=999`;
pages = 0;
while (url && pages < 3) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  for (const m of data.value || []) {
    for (const r of m.toRecipients || []) {
      const addr = r.emailAddress?.address?.toLowerCase().trim();
      const name = r.emailAddress?.name;
      if (!addr) continue;
      if (SKIP_EXACT.has(addr)) continue;
      if (SKIP_PATTERNS.some(p => p.test(addr))) continue;
      if (!senders[addr]) senders[addr] = name || addr;
    }
  }
  url = data['@odata.nextLink'] || null;
  pages++;
}

console.log(JSON.stringify(senders, null, 2));
console.error(`Toplam: ${Object.keys(senders).length} kişi`);
