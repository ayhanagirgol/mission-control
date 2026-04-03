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

const html = fs.readFileSync('/Users/baykus/.openclaw/workspace/tmp/finhouse-ramazan/ramazan_tebrik_mail.html', 'utf8');
const banner = fs.readFileSync('/Users/baykus/.openclaw/workspace/tmp/finhouse-ramazan/ramazan_banner.png');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', port: 465, secure: true,
  auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
});

await transporter.sendMail({
  from: `"Finhouse" <${GMAIL_EMAIL}>`,
  to: 'ayhan.agirgol@finhouse.com.tr',
  subject: '🌙 [ÖNIZLEME] Ramazan Bayramı Tebrik Kartı — Finhouse',
  html,
  attachments: [{
    filename: 'ramazan_banner.png',
    content: banner,
    cid: 'ramazan_banner'
  }]
});

console.log('✅ Önizleme maili gönderildi → ayhan.agirgol@finhouse.com.tr');
