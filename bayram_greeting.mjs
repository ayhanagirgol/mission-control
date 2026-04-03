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

// Filtrelenecek otomatik/no-reply adresleri
const SKIP_PATTERNS = [
  /no.?reply/i, /donotreply/i, /noreply/i,
  /marketing@/i, /bulten@/i, /newsletter/i,
  /notifications@/i, /hello@em\./i, /info@members\./i,
  /azure@/i, /publishing@/i, /crowdcasts@/i,
  /feedback@/i, /team@learn\./i, /team@marketing\./i,
  /drive-shares/i, /infoemails/i, /myactivecampaign/i,
  /substack\.com/i, /atmmarketplace/i, /mckinsey/i,
  /godaddy/i, /apple\.com/i, /microsoft\.com/i,
  /bilgi\.ito/i, /sistemglobal/i, /egeyapi/i,
  /moderntreasury/i, /monday\.com/i, /pixasoftware/i,
  /ikas\.com/i, /uyumsoftmail/i, /reclaim\.ai/i,
  /binalyze/i, /complyadvantage/i, /netflix/i,
  /edanisman/i, /hello\.design/i, /fathom\.video/i,
  /spaceship\.com/i, /members\./i,
  /o=exchangelabs/i, // internal exchange
];

const allRecipients = [
  // Finhouse mailbox'tan çekilen gerçek kişiler
  { name: 'Luis', email: 'luiscordes0102@gmail.com' },
  { name: 'Paul Walker', email: 'paul.walker@spl-group.com' },
  { name: 'Scott Sullivan', email: 'scott.sul@sourcedefense.com' },
  { name: 'Ekber Hasanzade', email: 'ekber.hasanzade@finhouse.com.tr' },
  { name: 'Hülya Dundar', email: 'hulya.dundar@enlighty.ai' },
  { name: 'Aytekin Çelebi', email: 'acelebi3@burgan.com.tr' },
  { name: 'Nafiye Öztürk', email: 'nafiye.ozturk@verisoft.com' },
  { name: 'Nef Solution', email: 'info@nefsolution.com' },
  { name: 'Robusta AI', email: 'info@robusta.ai' },
  { name: 'Cansu Arslan', email: 'c.arslan@searchinform.com' },
  { name: 'Finteo', email: 'info@ileti-finteo.com.tr' },
  { name: 'Salim Büge', email: 'salim.buge@dokuz.io' },
  { name: 'Sırma Eren', email: 'sirma.eren@cloudandcloud.net' },
  { name: 'Onur Arabacı', email: 'oarabaci@liderfaktoring.com.tr' },
  { name: 'Orkun Akyüz', email: 'orkun.akyuz@orbina.ai' },
  { name: 'Onur Cünedioğlu', email: 'onur.cunedioglu@orbina.ai' },
  { name: 'İlayda Aladağ', email: 'ilayda.aladag@bosporuslojistik.com.tr' },
  { name: 'Seda Mutlu', email: 'info@futureprocurementsummit.com' },
  { name: 'Mehmet Nuri Aybayar', email: 'mehmetnuri.aybayar@techsign.com.tr' },
  { name: 'Finteo Destek', email: 'destek@finteo.com.tr' },
  { name: 'Sarah Collins', email: 'sarah.collins@cybercyte.uk' },
  { name: 'Oltan Dere', email: 'oltan@skymod.tech' },
  { name: 'George', email: 'george@trevorlabs.com' },
  { name: 'Tabnine Enterprise', email: 'enterprise@tabnine.com' },
  { name: 'Sevda Ersoy', email: 'sevda.ersoy@cloudandcloud.net' },
  { name: 'Büşra Eşkara', email: 'busra@turkiye.ai' },
  // Ek alıcılar
  { name: 'Ertuğrul Ağar', email: 'ertugrul.agar@finhouse.ai' },
  { name: 'Gökhan Ağırgöl', email: 'gokhanagirgol@gmail.com' },
];

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

let sent = 0;
let failed = 0;

for (const r of allRecipients) {
  try {
    await transporter.sendMail({
      from: `"Ayhan Ağırgöl" <${GMAIL_EMAIL}>`,
      to: `"${r.name}" <${r.email}>`,
      subject,
      html: htmlBody,
    });
    console.log(`✅ Gönderildi: ${r.name} <${r.email}>`);
    sent++;
    await new Promise(res => setTimeout(res, 300)); // rate limit
  } catch (e) {
    console.error(`❌ Hata: ${r.email} — ${e.message}`);
    failed++;
  }
}

console.log(`\n📊 Sonuç: ${sent} gönderildi, ${failed} hata`);
