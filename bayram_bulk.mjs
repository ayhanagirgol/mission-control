import fs from 'node:fs';
import nodemailer from 'nodemailer';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
});

// Daha önce gönderilenleri atla
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

// Otomatik/sistem/marketing adresleri filtrele
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
  /^noreply@/i, /^bounce/i, /^mailer/i,
  /unsubscribe/i, /^postmaster/i, /^abuse@/i,
  /activecampaign/i, /sendgrid/i, /mailchimp/i,
  /e\.egeyapi/i, /em\.ikas/i, /erp\.uyumsoftmail/i,
  /bulten\./i, /^billing@/i, /^support@/i,
  /ileti-/i, /^info@ileti/i,
  /turkkep\.com\.tr/i,
  /batronenerji\.com/i,
];

const SKIP_EXACT = new Set([
  'ayhan.agirgol@finhouse.com.tr', 'ayhan.agirgol@gmail.com',
  'info@nefsolution.com', // zaten gönderildi
]);

const allSenders = JSON.parse(fs.readFileSync('/tmp/all_senders.json', 'utf8'));

const recipients = [];
for (const [addr, name] of Object.entries(allSenders)) {
  if (ALREADY_SENT.has(addr)) continue;
  if (SKIP_EXACT.has(addr)) continue;
  if (SKIP_PATTERNS.some(p => p.test(addr))) continue;
  // Gerçek kişi gibi görünen adresler — @ öncesi nokta/harf içeriyor
  const local = addr.split('@')[0];
  if (local.length < 3) continue;
  recipients.push({ name, email: addr });
}

// Manuel ek alıcılar (all_senders.json dışında)
const extraRecipients = [
  { name: 'Togan Özsöz', email: 'togan.ozsoz@qnb.com.tr' },
];
for (const r of extraRecipients) {
  if (!ALREADY_SENT.has(r.email)) recipients.push(r);
}

console.log(`📋 Gönderilecek: ${recipients.length} kişi\n`);

const subject = 'Ramazan Bayramınız Kutlu Olsun 🌙';
const htmlBody = `
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #333; max-width: 600px;">
  <p>Merhaba,</p>
  <p>
    Ramazan Bayramı'nın size ve sevdiklerinize sağlık, huzur ve mutluluk getirmesini dilerim. 
    Bu özel günde birlikte geçirdiğimiz çalışmalardan aldığım güç ve ilhamla dolu bir bayram geçirmenizi temenni ederim. 
  </p>
  <p>Bayramınız kutlu olsun. 🌙✨</p>
  <br>
  <p style="margin: 0;">Saygılarımla,</p>
  <p style="margin: 0;"><strong>Ayhan Ağırgöl</strong></p>
  <p style="margin: 0; color: #666; font-size: 13px;">CTO | Finhouse</p>
  <p style="margin: 0; color: #666; font-size: 13px;">ayhan.agirgol@finhouse.com.tr</p>
</div>
`;

let sent = 0, failed = 0;
const failedList = [];

for (const r of recipients) {
  try {
    await transporter.sendMail({
      from: `"Ayhan Ağırgöl" <${GMAIL_EMAIL}>`,
      to: `"${r.name}" <${r.email}>`,
      subject,
      html: htmlBody,
    });
    console.log(`✅ ${r.name} <${r.email}>`);
    sent++;
    await new Promise(res => setTimeout(res, 400));
  } catch (e) {
    console.error(`❌ ${r.email} — ${e.message}`);
    failedList.push(r.email);
    failed++;
  }
}

console.log(`\n📊 Sonuç: ${sent} gönderildi, ${failed} hata`);
if (failedList.length) console.log('Hatalılar:', failedList.join(', '));
