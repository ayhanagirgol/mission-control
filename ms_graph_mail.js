#!/usr/bin/env node
/**
 * Microsoft Graph Mail helper (client credentials, multi-profile).
 *
 * Profiles are selected with MAIL_PROFILE=<name>.
 * Supported env layouts:
 *
 * Legacy single-profile:
 *   MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET
 *   MAILBOX_UPN, TEST_TO
 *
 * Named profiles:
 *   <PROFILE>_MS_CLIENT_ID
 *   <PROFILE>_MS_TENANT_ID
 *   <PROFILE>_MS_CLIENT_SECRET
 *   <PROFILE>_MAILBOX_UPN
 *   <PROFILE>_TEST_TO
 *
 * Examples:
 *   MAIL_PROFILE=finhouse node ms_graph_mail.js
 *   MAIL_PROFILE=turkkep node ms_graph_mail.js
 */

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

const config = getProfileConfig(process.env.MAIL_PROFILE);
const {
  profile,
  clientId,
  tenantId,
  clientSecret,
  mailboxUpn: MAILBOX_UPN,
  testTo: TEST_TO,
} = config;

if (!clientId || !tenantId || !clientSecret) {
  console.error(`Missing Graph credentials for profile '${profile}'. Expected ${profile === 'default' ? 'MS_CLIENT_ID/MS_TENANT_ID/MS_CLIENT_SECRET' : `${profile.toUpperCase()}_MS_CLIENT_ID/${profile.toUpperCase()}_MS_TENANT_ID/${profile.toUpperCase()}_MS_CLIENT_SECRET`} in environment (or .env).`);
  process.exit(2);
}

if (!MAILBOX_UPN) {
  console.error(`Missing mailbox for profile '${profile}'. Set ${profile === 'default' ? 'MAILBOX_UPN' : `${profile.toUpperCase()}_MAILBOX_UPN`}.`);
  process.exit(2);
}

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
  if (!res.ok) {
    throw new Error(`Token error ${res.status}: ${JSON.stringify({ error: json.error, error_description: json.error_description })}`);
  }
  if (!json.access_token) throw new Error('Token response missing access_token');
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    const errBody = json?.error ? { code: json.error.code, message: json.error.message } : (text?.slice(0, 500) || '');
    throw new Error(`Graph error ${res.status}: ${JSON.stringify(errBody)}`);
  }
  return json;
}

async function sendTestMail(token) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/sendMail`;
  const now = new Date().toISOString();
  const payload = {
    message: {
      subject: `OpenClaw Test (${now})`,
      body: { contentType: 'Text', content: `Merhaba, bu Microsoft Graph (client credentials) ile '${profile}' profili üzerinden gönderilmiş bir test e-postasıdır.` },
      toRecipients: [{ emailAddress: { address: TEST_TO } }],
    },
    saveToSentItems: true,
  };
  await graph(token, url, { method: 'POST', body: JSON.stringify(payload) });
}

async function listLastMessages(token, n = 5) {
  const url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages`);
  url.searchParams.set('$top', String(n));
  url.searchParams.set('$orderby', 'receivedDateTime desc');
  url.searchParams.set('$select', 'id,subject,from,receivedDateTime');

  const json = await graph(token, url.toString(), { method: 'GET' });
  const items = json?.value || [];
  return items.map(m => ({
    receivedDateTime: m.receivedDateTime,
    subject: m.subject,
    from: m.from?.emailAddress?.address,
    id: m.id,
  }));
}

try {
  const token = await getToken();
  console.log(`Using profile: ${profile}`);
  console.log(`Using mailbox: ${MAILBOX_UPN}`);
  console.log(`Sending test email to: ${TEST_TO} ...`);
  await sendTestMail(token);
  console.log('Sent.');
  console.log('Listing last 5 messages (metadata only):');
  const msgs = await listLastMessages(token, 5);
  for (const m of msgs) {
    console.log(`- ${m.receivedDateTime} | ${m.from || 'unknown'} | ${m.subject || ''} | ${m.id?.slice(0, 10) || ''}...`);
  }
} catch (e) {
  console.error(String(e?.message || e));
  process.exit(1);
}
