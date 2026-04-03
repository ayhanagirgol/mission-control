/**
 * Ramazan Bayramı Tebrik Kartı — Toplu Gönderim
 * Gönderen: ayhan.agirgol@finhouse.com.tr (Microsoft Graph API)
 * İçerik: ramazan_tebrik_mail.html + ramazan_banner.png
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
  if (!data.access_token) throw new Error('Token alınamadı: ' + JSON.stringify(data));
  return data.access_token;
}

// HTML ve banner oku
const htmlBody = fs.readFileSync('/Users/baykus/.openclaw/workspace/tmp/finhouse-ramazan/ramazan_tebrik_mail.html', 'utf8');
const bannerBase64 = fs.readFileSync('/Users/baykus/.openclaw/workspace/tmp/finhouse-ramazan/ramazan_banner.png').toString('base64');

// Filtreler
const SKIP_PATTERNS = [
  /no.?reply/i, /donotreply/i, /noreply/i,
  /notifications@/i, /drive-shares/i, /infoemails/i,
  /myactivecampaign/i, /substack\.com/i,
  /godaddy/i, /apple\.com/i, /microsoft\.com/i,
  /\.ito\.org/i, /members\./i, /o=exchangelabs/i,
  /crowdcasts@/i, /publishing@email\./i,
  /^team@learn\./i, /^team@marketing\./i,
  /marketing@/i, /newsletter/i, /bulten@/i,
  /^info@em\./i, /^hello@em\./i, /\.wixemails\./i,
  /^noreply@/i, /^bounce/i, /^mailer-daemon/i,
  /unsubscribe/i, /^postmaster/i, /^abuse@/i,
  /activecampaign/i, /sendgrid/i, /mailchimp/i,
  /e\.egeyapi/i, /em\.ikas/i, /erp\.uyumsoftmail/i,
  /bulten\./i, /^billing@/i,
  /ileti-/i,
  /turkkep\.com\.tr/i,
  /batronenerji\.com/i,
  /privaterelay\.appleid/i,
  /zapiermail/i, /taskronbin/i,
  /trigger@recipe/i,
  /luma-mail/i,
];

const SKIP_EXACT = new Set([
  'ayhan.agirgol@finhouse.com.tr',
  'ayhan.agirgol@gmail.com',
]);

// Daha önce bayram_greeting.mjs ile gönderilenleri atla
const ALREADY_SENT = new Set([
  'luiscordes0102@gmail.com', 'paul.walker@spl-group.com', 'scott.sul@sourcedefense.com',
  'ekber.hasanzade@finhouse.com.tr', 'hulya.dundar@enlighty.ai', 'acelebi3@burgan.com.tr',
  'nafiye.ozturk@verisoft.com', 'info@nefsolution.com', 'info@robusta.ai',
  'c.arslan@searchinform.com', 'info@ileti-finteo.com.tr', 'salim.buge@dokuz.io',
  'sirma.eren@cloudandcloud.net', 'oarabaci@liderfaktoring.com.tr',
  'orkun.akyuz@orbina.ai', 'onur.cunedioglu@orbina.ai', 'ilayda.aladag@bosporuslojistik.com.tr',
  'info@futureprocurementsummit.com', 'mehmetnuri.aybayar@techsign.com.tr',
  'destek@finteo.com.tr', 'sarah.collins@cybercyte.uk', 'oltan@skymod.tech',
  'george@trevorlabs.com', 'enterprise@tabnine.com', 'sevda.ersoy@cloudandcloud.net',
  'busra@turkiye.ai', 'ertugrul.agar@finhouse.ai', 'gokhanagirgol@gmail.com',
]);

// Listeyi oku
const allSenders = JSON.parse(fs.readFileSync('/tmp/all_senders.json', 'utf8'));

const recipients = [];
for (const [addr, name] of Object.entries(allSenders)) {
  if (ALREADY_SENT.has(addr)) continue;
  if (SKIP_EXACT.has(addr)) continue;
  if (SKIP_PATTERNS.some(p => p.test(addr))) continue;
  const local = addr.split('@')[0];
  if (local.length < 3) continue;
  recipients.push({ name, email: addr });
}

// Manuel ekler
const extras = [
  { name: 'Togan Özsöz', email: 'togan.ozsoz@qnb.com.tr' },
];
for (const r of extras) {
  if (!ALREADY_SENT.has(r.email) && !recipients.find(x => x.email === r.email)) {
    recipients.push(r);
  }
}

console.log(`📋 Gönderilecek: ${recipients.length} kişi\n`);

const token = await getToken();

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function sendMailWithRetry(to, toName, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const result = await sendMail(to, toName);
    if (result !== 'throttled') return result;
    const wait = (i + 1) * 10000; // 10s, 20s, 30s
    console.log(`  ⏳ Rate limit, ${wait/1000}s bekleniyor...`);
    await sleep(wait);
  }
  throw new Error('Max retry aşıldı');
}

async function sendMail(to, toName) {
  const payload = {
    message: {
      subject: 'Ramazan Bayramınız Kutlu Olsun 🌙',
      body: {
        contentType: 'HTML',
        content: htmlBody,
      },
      toRecipients: [{ emailAddress: { address: to, name: toName } }],
      attachments: [{
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: 'ramazan_banner.png',
        contentType: 'image/png',
        contentBytes: bannerBase64,
        contentId: 'ramazan_banner',
        isInline: true,
      }],
    },
    saveToSentItems: true,
  };

  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${MAILBOX}/sendMail`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 202) return true;
  if (res.status === 429) return 'throttled';
  const err = await res.text();
  throw new Error(`HTTP ${res.status}: ${err}`);
}

let sent = 0, failed = 0;

for (const r of recipients) {
  try {
    await sendMailWithRetry(r.email, r.name);
    console.log(`✅ ${r.name} <${r.email}>`);
    sent++;
    await sleep(2000); // 2 saniye bekle — rate limit önlemi
  } catch (e) {
    console.error(`❌ ${r.email} — ${e.message.slice(0, 80)}`);
    failed++;
  }
}

console.log(`\n📊 Sonuç: ${sent} gönderildi, ${failed} hata`);
