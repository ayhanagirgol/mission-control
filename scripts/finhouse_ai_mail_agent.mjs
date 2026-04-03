/**
 * finhouse.ai Mail Agent
 * info@finhouse.ai'yi kontrol et, mailleri sınıflandır ve işle.
 */

import * as fs from 'fs';
import { execFileSync } from 'child_process';
import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';

// .env yükle
const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const EMAIL    = process.env.FINHOUSE_AI_EMAIL;
const PASSWORD = process.env.FINHOUSE_AI_PASSWORD;
const SMTP_HOST = process.env.FINHOUSE_AI_SMTP_HOST;
const SMTP_PORT = parseInt(process.env.FINHOUSE_AI_SMTP_PORT || '465');

const AYHAN_EMAILS = [
  'ayhan.agirgol@gmail.com',
  'ayhan.agirgol@finhouse.com.tr',
  'ayhan.agirgol@turkkep.com.tr',
];

const DEMO_KEYWORDS = ['demo', 'bilgi', 'teklif', 'fiyat', 'görüşme', 'toplantı',
  'iletişim', 'request', 'info', 'randevu', 'sunum', 'tanitim', 'tanıtım'];
const IMPORTANT_KEYWORDS = ['fatura', 'invoice', 'hukuk', 'legal', 'dava', 'ihtar', 'şikayet', 'sikayet', 'complaint', 'kvkk', 'kisisel veri', 'kişisel veri'];
const MAIN_SESSION = 'agent:main:main';

const normalize = (s) => (s || '').toLowerCase();

const isDemoRequest = (subject, body) => {
  const text = normalize((subject || '') + ' ' + (body || ''));
  return DEMO_KEYWORDS.some(k => text.includes(k));
};

const isImportantMail = (subject, body) => {
  const text = normalize((subject || '') + ' ' + (body || ''));
  return IMPORTANT_KEYWORDS.some(k => text.includes(k));
};

const sendToMainSession = (message) => {
  try {
    execFileSync('openclaw', ['sessions-send', MAIN_SESSION, message], { stdio: 'pipe' });
    console.log(`  ↗️ Ana session'a iletildi`);
    return true;
  } catch (e) {
    console.log(`  ⚠️ sessions_send başarısız: ${e.message}`);
    return false;
  }
};

fs.mkdirSync('/Users/baykus/.openclaw/workspace/logs', { recursive: true });
const LOG_FILE = '/Users/baykus/.openclaw/workspace/logs/finhouse_ai_inbox.jsonl';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, port: SMTP_PORT, secure: true,
  auth: { user: EMAIL, pass: PASSWORD },
});

// ─── IMAP: tüm okunmamış mailleri çek (envelope only, hızlı) ───────────────
const client = new ImapFlow({
  host: 'mail.spacemail.com', port: 993, secure: true,
  auth: { user: EMAIL, pass: PASSWORD },
  logger: false,
});

// Hard kill guard
const killTimer = setTimeout(() => process.exit(0), 30000);

await client.connect();
const lock = await client.getMailboxLock('INBOX');

let uids = [];
try {
  const result = await client.search({ seen: false }, { uid: true });
  uids = result || [];
  console.log(`Search sonucu UIDs: ${JSON.stringify(uids)}`);
} finally {
  lock.release();
}

if (uids.length === 0) {
  console.log('Yeni mail yok.');
  try { await client.logout(); } catch {}
  clearTimeout(killTimer);
  process.exit(0);
}

console.log(`${uids.length} okunmamış mail bulundu: UIDs=${uids.join(',')}`);

// Her UID için ayrı fetch
const messages = [];
for (const uid of uids) {
  const lock2 = await client.getMailboxLock('INBOX');
  try {
    for await (const msg of client.fetch([uid], { envelope: true, flags: true, source: true, bodyStructure: true }, { uid: true })) {
      const from = msg.envelope?.from?.[0];
      const fromEmail = from?.address?.toLowerCase() || '';
      const fromName  = from?.name || fromEmail;
      const subject   = msg.envelope?.subject || '(konu yok)';
      const msgId     = msg.envelope?.messageId || '';
      const date      = msg.envelope?.date || new Date();
      const sourceText = Buffer.isBuffer(msg.source) ? msg.source.toString('utf8') : String(msg.source || '');
      const bodySnippet = sourceText.slice(0, 20000);

      messages.push({
        uid,
        from: fromEmail,
        fromName,
        subject,
        messageId: msgId,
        date: date.toISOString(),
        isFromAyhan: AYHAN_EMAILS.includes(fromEmail),
        bodySnippet,
      });
    }
    // Okundu işaretle
    await client.messageFlagsAdd([uid], ['\\Seen'], { uid: true });
  } finally {
    lock2.release();
  }
}

try { await client.logout(); } catch {}
clearTimeout(killTimer);

// ─── Mailleri işle ─────────────────────────────────────────────────────────
const results = { ayhan: 0, demo: 0, other: 0, important: 0 };

for (const msg of messages) {
  console.log(`\n📧 UID ${msg.uid}: from=${msg.from} | ${msg.subject}`);
  const demo = isDemoRequest(msg.subject, msg.bodySnippet);
  const important = isImportantMail(msg.subject, msg.bodySnippet);
  fs.appendFileSync(LOG_FILE, JSON.stringify({ ...msg, demo, important, processedAt: new Date().toISOString() }) + '\n');

  // Kendi adresimizden gelen (otomatik yanıt loopu) — atla
  if (msg.from === EMAIL.toLowerCase()) {
    console.log(`  → Kendi adresimizden, atlanıyor.`);
    continue;
  }

  if (msg.isFromAyhan) {
    results.ayhan++;
    console.log(`  → 📥 Ayhan'dan — ana session'a bildiriliyor`);
    sendToMainSession(`📧 finhouse.ai — Ayhan'dan yeni mail: ${msg.subject} / ${msg.from}`);

  } else if (demo) {
    results.demo++;
    console.log(`  → 🔔 Demo talebi — otomatik yanıt gönderiliyor...`);
    try {
      await transporter.sendMail({
        from: `"Finhouse.ai Ekibi" <${EMAIL}>`,
        to: msg.from,
        subject: `Re: ${msg.subject}`,
        inReplyTo: msg.messageId,
        text: `Merhaba,\n\nFinhouse.ai'yi tercih ettiğiniz için teşekkür ederiz.\n\nTalebinizi aldık. Ekibimiz en kısa sürede sizinle iletişime geçecektir.\n\nBizi tercih ettiğiniz için teşekkür ederiz.\n\nSaygılarımızla,\nFinhouse.ai Ekibi\ninfo@finhouse.ai`,
      });
      console.log(`  ✉️  Yanıt gönderildi: ${msg.from}`);
    } catch (e) {
      console.log(`  ❌ Yanıt gönderilemedi: ${e.message}`);
    }
    sendToMainSession(`🔔 Demo/İletişim talebi: ${msg.fromName || msg.from} — Konu: ${msg.subject} — ${msg.date}. Takip gerekebilir!`);

  } else {
    results.other++;
    console.log(`  → Diğer — loglandı`);
    if (important) {
      results.important++;
      sendToMainSession(`⚠️ finhouse.ai önemli mail: ${msg.fromName || msg.from} <${msg.from}> — Konu: ${msg.subject} — ${msg.date}`);
    }
  }
}

console.log(`\n=== ÖZET ===`);
console.log(`Ayhan'dan: ${results.ayhan} | Demo talebi: ${results.demo} | Diğer: ${results.other} | Önemli: ${results.important}`);

const ayhanMsgs = messages.filter(m => m.isFromAyhan);
const demoMsgs  = messages.filter(m => !m.isFromAyhan && isDemoRequest(m.subject, m.bodySnippet));
const otherMsgs = messages.filter(m => !m.isFromAyhan && !isDemoRequest(m.subject, m.bodySnippet));
const importantMsgs = otherMsgs.filter(m => isImportantMail(m.subject, m.bodySnippet));

console.log('OUTPUT_JSON:' + JSON.stringify({
  total: messages.length,
  fromAyhan: ayhanMsgs,
  demoRequests: demoMsgs,
  other: otherMsgs,
  important: importantMsgs,
}));

process.exit(0);
