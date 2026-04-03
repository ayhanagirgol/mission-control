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

async function getToken(tenantId, clientId, clientSecret) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`token ${res.status}: ${JSON.stringify(json)}`);
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
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) throw new Error(`graph ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function ensureFolder(token, mailbox, displayName) {
  const base = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders`;
  const list = await graph(token, `${base}?$top=200&$select=id,displayName`);
  const existing = (list.value || []).find(f => (f.displayName || '').toLowerCase() === displayName.toLowerCase());
  if (existing) return existing;
  return await graph(token, base, {
    method: 'POST',
    body: JSON.stringify({ displayName }),
  });
}

async function findMessages(token, mailbox, sender) {
  const results = [];
  let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=100&$select=id,subject,receivedDateTime,from&$orderby=receivedDateTime desc`;
  while (url) {
    const page = await graph(token, url);
    for (const m of (page.value || [])) {
      const from = m.from?.emailAddress?.address || '';
      if (from.toLowerCase() === sender.toLowerCase()) results.push(m);
    }
    url = page['@odata.nextLink'] || null;
    if (results.length >= 500) break;
  }
  return results;
}

async function copyMessage(token, mailbox, messageId, destinationId) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${encodeURIComponent(messageId)}/copy`;
  return await graph(token, url, {
    method: 'POST',
    body: JSON.stringify({ destinationId }),
  });
}

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));
  const profile = 'TURKKEP';
  const clientId = process.env[`${profile}_MS_CLIENT_ID`];
  const tenantId = process.env[`${profile}_MS_TENANT_ID`];
  const clientSecret = process.env[`${profile}_MS_CLIENT_SECRET`];
  const mailbox = process.env[`${profile}_MAILBOX_UPN`] || process.env.MAILBOX_UPN;
  if (!clientId || !tenantId || !clientSecret || !mailbox) throw new Error('Missing TURKKEP Graph env vars');

  const folderName = process.argv[2] || 'QRadar';
  const sender = process.argv[3] || 'qradar@turkkep.com.tr';

  const token = await getToken(tenantId, clientId, clientSecret);
  const folder = await ensureFolder(token, mailbox, folderName);
  const messages = await findMessages(token, mailbox, sender);

  let copied = 0;
  const errors = [];
  for (const m of messages) {
    try {
      await copyMessage(token, mailbox, m.id, folder.id);
      copied += 1;
    } catch (err) {
      errors.push({ id: m.id, subject: m.subject, error: String(err?.message || err) });
    }
  }

  console.log(JSON.stringify({
    folder: { id: folder.id, displayName: folder.displayName },
    sender,
    found: messages.length,
    copied,
    errors,
  }, null, 2));
}

main().catch(err => {
  console.error(String(err?.message || err));
  process.exit(1);
});
