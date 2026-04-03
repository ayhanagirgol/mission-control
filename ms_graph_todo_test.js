#!/usr/bin/env node
/**
 * Microsoft Graph To Do API test (client credentials).
 * Attempts to list the first 5 To Do lists for a given user.
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

loadDotEnv(path.join(process.cwd(), '.env'));

const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET } = process.env;
const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS_CLIENT_ID/MS_TENANT_ID/MS_CLIENT_SECRET in environment (or .env).');
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
  return json.access_token;
}

async function graph(token, url) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  return { ok: res.ok, status: res.status, json, text: text?.slice(0, 800) };
}

const token = await getToken();
const url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/todo/lists`);
url.searchParams.set('$top', '5');
url.searchParams.set('$select', 'id,displayName');

const out = await graph(token, url.toString());
if (!out.ok) {
  const err = out.json?.error ? { code: out.json.error.code, message: out.json.error.message } : out.text;
  console.error(`To Do test failed (${out.status}): ${JSON.stringify(err)}`);
  process.exit(1);
}

const lists = out.json?.value || [];
console.log(`To Do lists for ${MAILBOX_UPN}: ${lists.length}`);
for (const l of lists) {
  console.log(`- ${l.displayName} (${String(l.id).slice(0, 10)}...)`);
}
