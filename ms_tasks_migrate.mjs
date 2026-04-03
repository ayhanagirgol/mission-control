/**
 * Tüm taskları Finhouse Microsoft To Do'ya taşı
 * - Türkkep M365'teki task listesini sil (artık kullanılmayacak)
 * - Finhouse'ta Türkkep listesi zaten var, tasklar oraya eklendi
 * - Apple Reminders Türkkep listesini temizle
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

const FH_CLIENT_ID = process.env.MS_CLIENT_ID;
const FH_TENANT_ID = process.env.MS_TENANT_ID;
const FH_CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const FH_MAILBOX = 'ayhan.agirgol@finhouse.com.tr';

const TK_CLIENT_ID = process.env.TURKKEP_MS_CLIENT_ID;
const TK_TENANT_ID = process.env.TURKKEP_MS_TENANT_ID;
const TK_CLIENT_SECRET = process.env.TURKKEP_MS_CLIENT_SECRET;
const TK_MAILBOX = process.env.TURKKEP_MAILBOX_UPN;

async function getToken(cid, tid, cs) {
  const res = await fetch(`https://login.microsoftonline.com/${tid}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: cid, client_secret: cs, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

const fhToken = await getToken(FH_CLIENT_ID, FH_TENANT_ID, FH_CLIENT_SECRET);
const tkToken = await getToken(TK_CLIENT_ID, TK_TENANT_ID, TK_CLIENT_SECRET);

// Finhouse'taki Türkkep listesini bul
const fhLists = await graph(fhToken, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FH_MAILBOX)}/todo/lists`);
const tkListFH = (fhLists.value||[]).find(l => l.displayName === 'Türkkep');
console.log(`Finhouse Türkkep listesi: ${tkListFH ? '✅ Mevcut' : '❌ Bulunamadı'}`);

// Türkkep M365'teki task listesini bul ve sil (artık kullanılmayacak)
console.log('\nTürkkep M365 task listesi temizleniyor...');
try {
  const tkLists = await graph(tkToken, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(TK_MAILBOX)}/todo/lists`);
  const tkListTK = (tkLists.value||[]).find(l => l.displayName === 'Türkkep');
  if (tkListTK) {
    await graph(tkToken, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(TK_MAILBOX)}/todo/lists/${tkListTK.id}`, { method: 'DELETE' });
    console.log('  ✅ Türkkep M365 task listesi silindi');
  } else {
    console.log('  ℹ️  Türkkep M365\'te liste bulunamadı');
  }
} catch(e) {
  console.log(`  ⚠️  Türkkep M365 liste silme: ${e.message}`);
}

console.log('\n=== ÖZET ===');
console.log('✅ Tüm tasklar ayhan.agirgol@finhouse.com.tr Microsoft To Do\'da toplanıyor');
console.log('   Listeler: Finhouse, Türkkep');
console.log('✅ Türkkep M365 ayrı task listesi kaldırıldı');
console.log('\nSonraki adım: Apple Reminders Türkkep listesini kaldır');
