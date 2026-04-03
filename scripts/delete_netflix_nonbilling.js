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

const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET } = process.env;
const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS Graph credentials.');
  process.exit(2);
}

const KEEP_KEYWORDS = ['ödeme', 'odeme', 'fatura', 'invoice', 'payment', 'billing'];

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

function shouldKeep(subject = '') {
  const lower = subject.toLowerCase();
  return KEEP_KEYWORDS.some(k => lower.includes(k));
}

async function deleteMessage(token, id) {
  // Move to deleted items first
  const moveUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages/${encodeURIComponent(id)}/move`;
  const moved = await graph(token, moveUrl, {
    method: 'POST',
    body: JSON.stringify({ destinationId: 'deleteditems' }),
  });
  const newId = moved?.id;
  if (!newId) {
    console.warn('Moved message but no id returned; skipping hard delete.');
    return { movedOnly: true };
  }
  const delUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/mailFolders('deleteditems')/messages/${encodeURIComponent(newId)}`;
  await graph(token, delUrl, { method: 'DELETE' });
  return { movedOnly: false };
}

(async () => {
  const token = await getToken();
  let deleted = 0;
  let skipped = 0;
  let movedOnly = 0;
  let pageUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages?$search="from:netflix"&$top=25&$select=id,subject,receivedDateTime`;
  while (pageUrl) {
    const res = await graph(token, pageUrl, {
      method: 'GET',
      headers: { 'ConsistencyLevel': 'eventual' },
    });
    const items = res?.value || [];
    for (const item of items) {
      if (shouldKeep(item.subject)) {
        skipped += 1;
        continue;
      }
      try {
        const result = await deleteMessage(token, item.id);
        deleted += 1;
        if (result.movedOnly) movedOnly += 1;
      } catch (err) {
        console.error(`Failed to delete ${item.id}: ${err.message || err}`);
      }
    }
    pageUrl = res['@odata.nextLink'] || null;
  }
  console.log(`Done. Deleted ${deleted} messages (hard delete succeeded for ${deleted - movedOnly}, moved-only ${movedOnly}). Skipped ${skipped} (billing-related).`);
})();
