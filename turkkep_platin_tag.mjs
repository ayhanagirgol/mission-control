/**
 * Tüm mailbox'ta platinbilisi.com.tr'den gelen maillere Platin kategorisi ekle
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

const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
});
const { access_token: token } = await tokenRes.json();

async function graph(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  const j = await res.text().then(t => t ? JSON.parse(t) : null);
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=100&$select=id,subject,from,categories`;
let tagged = 0;

while (next) {
  const res = await graph(next);
  const msgs = (res.value||[]).filter(m =>
    (m.from?.emailAddress?.address?.endsWith('@platinbilisi.com.tr') || m.from?.emailAddress?.address?.endsWith('@platinbilisim.com.tr')) &&
    !(m.categories||[]).includes('Platin')
  );
  for (const msg of msgs) {
    await graph(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`, {
      method: 'PATCH', body: JSON.stringify({ categories: [...(msg.categories||[]), 'Platin'] })
    });
    tagged++;
    console.log(`🟠 ${msg.subject?.slice(0,70)}`);
  }
  next = res['@odata.nextLink'] || null;
}
console.log(`\nToplam etiketlenen: ${tagged}`);
