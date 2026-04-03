/**
 * Kallen Roth'tan gelen tüm mailleri sil ve inbox kuralı oluştur (gelecekteki mailleri otomatik sil)
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
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
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
console.log('Token alındı ✓');

// ── 1. Tüm klasörlerdeki Kallen Roth mailleri ara ──────────────────────────
console.log('\n"Kallen Roth" aranıyor...');
const searchRes = await graph(token,
  `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$search="Kallen Roth"&$top=100&$select=id,subject,from,receivedDateTime`
);

const msgs = searchRes.value || [];
console.log(`${msgs.length} mesaj bulundu.`);

// Gönderen adreslerini topla
const senderAddresses = new Set();
for (const msg of msgs) {
  const addr = msg.from?.emailAddress?.address;
  const name = msg.from?.emailAddress?.name;
  if (addr) senderAddresses.add(addr);
  console.log(`  📧 ${name} <${addr}> — ${msg.subject?.slice(0,60)}`);
}

if (msgs.length === 0) {
  console.log('Kallen Roth\'tan hiç mail bulunamadı. İsim farklı olabilir.');
  process.exit(0);
}

console.log(`\nTespit edilen adresler: ${[...senderAddresses].join(', ')}`);

// ── 2. Tüm mailleri sil ────────────────────────────────────────────────────
console.log('\nMailler siliniyor...');
let deleted = 0;
for (const msg of msgs) {
  await graph(token,
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`,
    { method: 'DELETE' }
  );
  deleted++;
}
console.log(`✅ ${deleted} mail silindi.`);

// ── 3. Her adres için inbox kuralı oluştur (gelecekteki mailleri otomatik sil) ──
console.log('\nBlok kuralları oluşturuluyor...');
for (const addr of senderAddresses) {
  try {
    const rule = await graph(token,
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`,
      {
        method: 'POST',
        body: JSON.stringify({
          displayName: `BLOK: ${addr}`,
          sequence: 1,
          isEnabled: true,
          conditions: { senderContains: [addr] },
          actions: { delete: true }
        })
      }
    );
    console.log(`🚫 Kural oluşturuldu: ${addr} (id: ${rule.id})`);
  } catch(e) {
    console.warn(`⚠️ Kural oluşturulamadı (${addr}): ${e.message}`);
  }
}

console.log('\n=== TAMAMLANDI ===');
console.log(`🗑️  Silinen mail: ${deleted}`);
console.log(`🚫 Blok kuralı: ${senderAddresses.size} adres`);
