#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(dotenvPath) {
  if (!fs.existsSync(dotenvPath)) return;
  const lines = fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/);
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

const dotenvPath = path.join(process.cwd(), '.env');
loadDotEnv(dotenvPath);

const {
  MS_CLIENT_ID,
  MS_TENANT_ID,
  MS_CLIENT_SECRET,
  MAILBOX_UPN = 'ayhan.agirgol@finhouse.com.tr'
} = process.env;

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing Graph credentials in environment/.env');
  process.exit(2);
}

async function getToken() {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(MS_TENANT_ID)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: MS_CLIENT_ID,
    client_secret: MS_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Token error ${res.status}: ${JSON.stringify({ error: json.error, error_description: json.error_description })}`);
  }
  if (!json.access_token) throw new Error('Token response missing access_token');
  return json.access_token;
}

async function sendMail(token, { subject, body, to }) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/sendMail`;
  const payload = {
    message: {
      subject,
      body: { contentType: 'Text', content: body },
      toRecipients: [{ emailAddress: { address: to } }],
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
    throw new Error(`Mail send error ${res.status}: ${text}`);
  }
}

async function main() {
  const reportPath = 'reports/x-turkkep-2026-03-11.txt';
  const body = fs.readFileSync(reportPath, 'utf8');
  const subject = 'X Türkkep aylık rapor - 11 Mart 2026';
  const to = 'ayhan.agirgol@finhouse.com.tr';

  const token = await getToken();
  await sendMail(token, { subject, body, to });
  console.log(`Email sent to ${to}`);
}

main().catch(err => {
  console.error(err?.message || err);
  process.exit(1);
});
