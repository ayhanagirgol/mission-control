/**
 * GoDaddy maillerini "GoDaddy" klasörüne taşı (Finhouse mailbox)
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

const CLIENT_ID     = process.env.MS_CLIENT_ID;
const TENANT_ID     = process.env.MS_TENANT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const MAILBOX       = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
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

// ── 1. GoDaddy klasörünü bul veya oluştur ────────────────────────────────────
const fRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/mailFolders?$top=100`);
let folder = (fRes.value || []).find(f => f.displayName.toLowerCase() === 'godaddy');
if (!folder) {
  folder = await graph(token,
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/mailFolders`,
    { method: 'POST', body: JSON.stringify({ displayName: 'GoDaddy' }) }
  );
  console.log('📁 GoDaddy klasörü oluşturuldu ✓');
} else {
  console.log('📁 GoDaddy klasörü zaten var ✓');
}

// ── 2. Tüm GoDaddy maillerini bul ve taşı ─────────────────────────────────────
let moved = 0;
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/messages?$top=100&$select=id,subject,from`;

while (next) {
  const res = await graph(token, next);
  const msgs = res.value || [];

  for (const msg of msgs) {
    const addr = msg.from?.emailAddress?.address || '';
    if (addr.toLowerCase().includes('godaddy') || addr.toLowerCase().endsWith('@godaddy.com')) {
      await graph(token,
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: folder.id }) }
      );
      moved++;
      console.log(`📨 Taşındı: ${msg.subject?.slice(0,70)} (${addr})`);
    }
  }
  next = res['@odata.nextLink'] || null;
}

console.log(`\n✅ Toplam ${moved} GoDaddy maili taşındı → GoDaddy klasörü`);
