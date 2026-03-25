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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadDotEnv(path.join(process.cwd(), '.env'));

const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const mailboxUpn = 'ayhan.agirgol@finhouse.com.tr';

if (!clientId || !tenantId || !clientSecret) {
  throw new Error('Missing MS_CLIENT_ID / MS_TENANT_ID / MS_CLIENT_SECRET in environment/.env');
}

const subject = 'HayHay & Orbina | Ürün Tanıtımı';
const to = ['dilara.kaplan@orbina.ai'];
const cc = ['adem.aykin@hayhay.com', 'orkun.akyuz@orbina.ai', 'ayhan.agirgol@finhouse.ai'];

const bodyText = `Dilara merhaba,\n\nHayHay Genel Müdürü Adem Aykın Bey ile görüştüm. Orbina çözümlerini tanıtmanız için uygun buluyorlar. Adem Bey'i CC'ye aldım, doğrudan iletişime geçebilirsiniz.\n\nİyi çalışmalar,\nAyhan Ağırgöl\n\n---\nhttps://www.orbina.ai | https://finhouse.com.tr`;

async function getToken() {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Token error ${res.status}: ${JSON.stringify({ error: json.error, error_description: json.error_description })}`);
  if (!json.access_token) throw new Error('Token response missing access_token');
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Graph error ${res.status}: ${text.slice(0, 2000)}`);
  return text;
}

const token = await getToken();
const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailboxUpn)}/sendMail`;
const payload = {
  message: {
    subject,
    body: { contentType: 'Text', content: bodyText },
    toRecipients: to.map(address => ({ emailAddress: { address } })),
    ccRecipients: cc.map(address => ({ emailAddress: { address } })),
  },
  saveToSentItems: true,
};

await graph(token, url, { method: 'POST', body: JSON.stringify(payload) });
console.log(JSON.stringify({ ok: true, mailboxUpn, to, cc, subject }));
