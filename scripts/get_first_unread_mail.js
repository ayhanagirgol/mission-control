#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2] ?? '';
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv(path.join(process.cwd(), '.env'));

const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET } = process.env;
const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS_CLIENT_ID/MS_TENANT_ID/MS_CLIENT_SECRET in environment (.env).');
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

(async () => {
  const token = await getToken();
  const listUrl = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages`);
  listUrl.searchParams.set('$filter', 'isRead eq false');
  listUrl.searchParams.set('$orderby', 'receivedDateTime desc');
  listUrl.searchParams.set('$top', '1');
  listUrl.searchParams.set('$select', 'id,subject,from,receivedDateTime,isRead');

  const listJson = await graph(token, listUrl.toString());
  const first = listJson?.value?.[0];
  if (!first) {
    console.log('No unread messages.');
    return;
  }

  const detailUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages/${first.id}?$select=subject,from,receivedDateTime,bodyPreview,body,webLink`; 
  const detailJson = await graph(token, detailUrl);
  const bodyContent = detailJson?.body?.content || '';

  const output = {
    id: first.id,
    subject: detailJson?.subject || '',
    from: detailJson?.from?.emailAddress?.address || '',
    receivedDateTime: detailJson?.receivedDateTime || '',
    webLink: detailJson?.webLink || '',
    bodyPreview: detailJson?.bodyPreview || '',
    body: bodyContent,
  };

  console.log(JSON.stringify(output, null, 2));
})();
