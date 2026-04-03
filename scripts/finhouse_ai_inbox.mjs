#!/usr/bin/env node
/**
 * info@finhouse.ai IMAP inbox reader
 * Reads unread emails, outputs JSON array
 * Usage: node finhouse_ai_inbox.mjs [--mark-read] [--limit N]
 */
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const markRead = process.argv.includes('--mark-read');
const limitIdx = process.argv.indexOf('--limit');
const limit = limitIdx !== -1 ? parseInt(process.argv[limitIdx + 1]) || 10 : 10;

const imapConfig = {
  user: process.env.FINHOUSE_AI_EMAIL,
  password: process.env.FINHOUSE_AI_PASSWORD,
  host: process.env.FINHOUSE_AI_IMAP_HOST,
  port: parseInt(process.env.FINHOUSE_AI_IMAP_PORT) || 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

if (!imapConfig.user || !imapConfig.password || !imapConfig.host) {
  console.error('Missing FINHOUSE_AI_* env vars');
  process.exit(1);
}

function fetchMails() {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const results = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', !markRead, (err, box) => {
        if (err) return reject(err);

        imap.search(['UNSEEN'], (err, uids) => {
          if (err) return reject(err);
          if (!uids || uids.length === 0) {
            imap.end();
            return resolve([]);
          }

          const fetchUids = uids.slice(-limit);
          const f = imap.fetch(fetchUids, {
            bodies: '',
            struct: true,
            markSeen: markRead,
          });

          f.on('message', (msg, seqno) => {
            let raw = '';
            msg.on('body', (stream) => {
              stream.on('data', (chunk) => { raw += chunk.toString('utf8'); });
            });
            msg.once('attributes', (attrs) => {
              msg._uid = attrs.uid;
            });
            msg.once('end', () => {
              simpleParser(raw).then((parsed) => {
                results.push({
                  uid: msg._uid,
                  from: parsed.from?.text || '',
                  to: parsed.to?.text || '',
                  subject: parsed.subject || '',
                  date: parsed.date?.toISOString() || '',
                  text: (parsed.text || '').slice(0, 3000),
                  hasAttachments: (parsed.attachments || []).length > 0,
                  attachmentNames: (parsed.attachments || []).map(a => a.filename).filter(Boolean),
                });
              }).catch(() => {});
            });
          });

          f.once('end', () => {
            setTimeout(() => {
              imap.end();
              resolve(results);
            }, 500);
          });

          f.once('error', reject);
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

try {
  const mails = await fetchMails();
  console.log(JSON.stringify(mails, null, 2));
} catch (e) {
  console.error('IMAP Error:', e.message);
  process.exit(1);
}
