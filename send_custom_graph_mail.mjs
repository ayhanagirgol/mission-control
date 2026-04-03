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

function getProfileConfig(profileName) {
  const profile = (profileName || '').trim();
  if (!profile) {
    return {
      profile: 'default',
      clientId: process.env.MS_CLIENT_ID,
      tenantId: process.env.MS_TENANT_ID,
      clientSecret: process.env.MS_CLIENT_SECRET,
      mailboxUpn: process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr',
      testTo: process.env.TEST_TO || 'ayhan.agirgol@gmail.com',
    };
  }
  const prefix = `${profile.toUpperCase()}_`;
  return {
    profile,
    clientId: process.env[`${prefix}MS_CLIENT_ID`],
    tenantId: process.env[`${prefix}MS_TENANT_ID`],
    clientSecret: process.env[`${prefix}MS_CLIENT_SECRET`],
    mailboxUpn: process.env[`${prefix}MAILBOX_UPN`] || process.env.MAILBOX_UPN,
    testTo: process.env[`${prefix}TEST_TO`] || process.env.TEST_TO || 'ayhan.agirgol@gmail.com',
  };
}

const dotenvPath = path.join(process.cwd(), '.env');
loadDotEnv(dotenvPath);
const profile = process.env.MAIL_PROFILE || 'default';
const cfg = getProfileConfig(process.env.MAIL_PROFILE);
const to = process.env.MAIL_TO || cfg.testTo;
const subject = process.env.MAIL_SUBJECT || 'Haftalık Fintech Raporu | 9–15 Mart 2026';
const htmlPath = process.env.MAIL_HTML_PATH;
if (!htmlPath) throw new Error('MAIL_HTML_PATH is required');
const html = fs.readFileSync(htmlPath, 'utf8');

async function getToken() {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Token error ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Graph error ${res.status}: ${text.slice(0, 1000)}`);
  return text;
}

const token = await getToken();
const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.mailboxUpn)}/sendMail`;
const payload = {
  message: {
    subject,
    body: { contentType: 'HTML', content: html },
    toRecipients: [{ emailAddress: { address: to } }],
  },
  saveToSentItems: true,
};
await graph(token, url, { method: 'POST', body: JSON.stringify(payload) });
console.log(JSON.stringify({ ok: true, profile, mailbox: cfg.mailboxUpn, to, subject }));
