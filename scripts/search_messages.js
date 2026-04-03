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

const term = process.argv[2];
if (!term) {
  console.error('Usage: search_messages.js <search term>');
  process.exit(1);
}
const searchValue = term.startsWith('"') ? term : `"${term}"`;

const {
  MS_CLIENT_ID,
  MS_TENANT_ID,
  MS_CLIENT_SECRET,
} = process.env;
const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS_CLIENT_ID/MS_TENANT_ID/MS_CLIENT_SECRET');
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
  if (!res.ok) throw new Error(`Token error ${res.status}: ${JSON.stringify(json)}`);
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

function formatDate(value) {
  return value ? new Date(value).toISOString() : '';
}

(async () => {
  const token = await getToken();
  let url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages`);
  url.searchParams.set('$top', '25');
  url.searchParams.set('$select', 'id,subject,from,receivedDateTime,parentFolderId');
  url.searchParams.set('$search', searchValue);

  const json = await graph(token, url.toString(), { method: 'GET', headers: { 'ConsistencyLevel': 'eventual' } });
  const items = json?.value || [];
  for (const m of items) {
    console.log(`${formatDate(m.receivedDateTime)} | ${m.from?.emailAddress?.address || 'unknown'} | ${m.subject || ''} | ${m.id}`);
  }
})();
