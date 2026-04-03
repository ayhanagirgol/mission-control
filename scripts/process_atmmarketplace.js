#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SENDER = 'news@atmmarketplace.com';

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
const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET, SUMMARY_TO } = process.env;
const SUMMARY_RECIPIENT = SUMMARY_TO || MAILBOX_UPN;

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS Graph credentials.');
  process.exit(2);
}

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

async function graph(token, url, options = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    throw new Error(`Graph error ${res.status}: ${text}`);
  }
  return json;
}

async function fetchMessages(token) {
  let pageUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages?$search="from:${SENDER}"&$top=50&$select=id,subject,receivedDateTime`;
  const messages = [];
  while (pageUrl) {
    const res = await graph(token, pageUrl, {
      method: 'GET',
      headers: { 'ConsistencyLevel': 'eventual' },
    });
    messages.push(...(res?.value || []));
    pageUrl = res['@odata.nextLink'] || null;
  }
  return messages;
}

function formatSummary(messages) {
  const fmt = new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const lines = messages.map(msg => {
    const dt = msg.receivedDateTime ? fmt.format(new Date(msg.receivedDateTime)) : 'tarih yok';
    return `- ${dt} — ${msg.subject || '(konu yok)'}`;
  });
  const header = `ATM Marketplace (${SENDER}) gelen kutusu özeti (${messages.length} mesaj)\n`;
  return header + lines.join('\n');
}

async function sendSummary(token, bodyText) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/sendMail`;
  const subject = `ATM Marketplace özeti (${new Date().toISOString().slice(0, 10)})`;
  const payload = {
    message: {
      subject,
      body: { contentType: 'Text', content: bodyText },
      toRecipients: [{ emailAddress: { address: SUMMARY_RECIPIENT } }],
    },
    saveToSentItems: true,
  };
  await graph(token, url, { method: 'POST', body: JSON.stringify(payload) });
}

async function deleteMessage(token, id) {
  const moveUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages/${encodeURIComponent(id)}/move`;
  const moved = await graph(token, moveUrl, {
    method: 'POST',
    body: JSON.stringify({ destinationId: 'deleteditems' }),
  });
  const newId = moved?.id;
  if (!newId) return;
  const delUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/mailFolders('deleteditems')/messages/${encodeURIComponent(newId)}`;
  await graph(token, delUrl, { method: 'DELETE' });
}

(async () => {
  const token = await getToken();
  const messages = await fetchMessages(token);
  if (!messages.length) {
    console.log('No messages from sender.');
    return;
  }
  const summary = formatSummary(messages);
  await sendSummary(token, summary);
  for (const msg of messages) {
    try {
      await deleteMessage(token, msg.id);
    } catch (err) {
      console.error(`Failed to delete ${msg.id}: ${err.message || err}`);
    }
  }
  console.log(`Summarized and deleted ${messages.length} messages.`);
})();
