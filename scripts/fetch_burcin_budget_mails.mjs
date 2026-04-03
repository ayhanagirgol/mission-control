import fs from 'fs';
const dotenvPath = './.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}
const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const mailbox = process.env.MAILBOX_UPN;
async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(j));
  return j.access_token;
}
async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${text}`);
  return j;
}
(async () => {
  const token = await getToken();
  let all = [];
  let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=50&$filter=from/emailAddress/address eq 'burcin.tolga@finhouse.com.tr' and contains(subject,'bütçe')&$orderby=receivedDateTime desc`;
  while (next) {
    const res = await graph(token, next);
    const vals = (res.value || []).filter(m => m.subject);
    all.push(...vals);
    const last = vals[vals.length - 1];
    if (!last) break;
    next = res['@odata.nextLink'] || null;
  }
  await fs.promises.writeFile('burcin_budget_mails.json', JSON.stringify(all, null, 2));
  console.log(`Mail çekildi. Sayı: ${all.length}`);
})();
