#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2] ?? '';
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv(path.join(process.cwd(), '.env'));

const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET } = process.env;
const TO_ADDRESS = process.argv[2];
const SUBJECT = process.argv[3];
const BODY_PATH = process.argv[4];

if (!TO_ADDRESS || !SUBJECT || !BODY_PATH) {
  console.error('Usage: send_mail.js <toAddress> <subject> <bodyFile>');
  process.exit(2);
}

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS Graph credentials.');
  process.exit(2);
}

const bodyContent = fs.readFileSync(BODY_PATH, 'utf8');

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(MS_TENANT_ID)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: MS_CLIENT_ID,
      client_secret: MS_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'https://graph.microsoft.com/.default',
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Token error ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function sendMail() {
  const token = await getToken();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/sendMail`;
  const payload = {
    message: {
      subject: SUBJECT,
      body: { contentType: 'Text', content: bodyContent },
      toRecipients: [{ emailAddress: { address: TO_ADDRESS } }],
    },
    saveToSentItems: true,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Send mail failed ${res.status}: ${text}`);
  }
  console.log('Mail sent.');
}

sendMail().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
