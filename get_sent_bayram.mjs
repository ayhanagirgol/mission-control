/**
 * Gmail sent items'tan bugün gönderilen bayram maillerinin alıcılarını çeker
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

const TENANT_ID = process.env.MS_TENANT_ID;
const CLIENT_ID = process.env.MS_CLIENT_ID;
const CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const MAILBOX = 'ayhan.agirgol@finhouse.com.tr';

// Önce Finhouse sent items'a bakalım (bayram_kart_bulk zaten buradan gönderdi)
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

// Sent items'tan bugün gönderilen "Ramazan Bayramınız" başlıklı mailleri çek
const today = new Date().toISOString().split('T')[0];
const url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/mailFolders/SentItems/messages?$filter=subject eq 'Ramazan Bayramınız Kutlu Olsun 🌙' and receivedDateTime ge ${today}T00:00:00Z&$select=toRecipients,subject,receivedDateTime&$top=999`;

const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const data = await res.json();

const sent = new Set();
for (const m of data.value || []) {
  for (const r of m.toRecipients || []) {
    const addr = r.emailAddress?.address?.toLowerCase().trim();
    if (addr) sent.add(addr);
  }
}

console.log(`Finhouse sent: ${sent.size} kişi`);

// Ayrıca Gmail sent items'a da bakalım (bayram_bulk.mjs Gmail SMTP kullandı)
// gog ile Gmail API kullan
const { execSync } = await import('child_process');
try {
  const gmailSent = execSync('gog gmail list --folder sent --limit 300 --json 2>/dev/null', { encoding: 'utf8' });
  const gmailData = JSON.parse(gmailSent);
  for (const m of gmailData || []) {
    if (m.subject && m.subject.includes('Ramazan')) {
      const to = m.to || '';
      const addrs = to.match(/[\w.+%-]+@[\w.-]+\.[a-zA-Z]{2,}/g) || [];
      for (const a of addrs) sent.add(a.toLowerCase());
    }
  }
} catch(e) {
  // gog yoksa atla
}

console.log(`Toplam gönderilmiş (tüm kanallar): ${sent.size} kişi`);

// Dosyaya yaz
fs.writeFileSync('/tmp/already_sent_bayram.json', JSON.stringify([...sent], null, 2));
console.log('Yazıldı: /tmp/already_sent_bayram.json');
