#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(dotenvPath) {
  if (!fs.existsSync(dotenvPath)) return;
  for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2] ?? '';
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
}

async function getToken(tenantId, clientId, clientSecret) {
  const body = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' });
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const json = await res.json();
  if (!res.ok) throw new Error(`token ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  if (!res.ok) throw new Error(`graph ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

function wanted(subject='') {
  const s = subject.toLowerCase();
  return s.includes('openclaw test') || s.includes('türkkep') || s.includes('turkkep');
}

async function ensureFolder(token, mailbox, displayName) {
  const base = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders`;
  const list = await graph(token, `${base}?$top=200&$select=id,displayName`);
  const existing = (list.value || []).find(f => (f.displayName || '').toLowerCase() === displayName.toLowerCase());
  if (existing) return existing;
  return await graph(token, base, { method: 'POST', body: JSON.stringify({ displayName }) });
}

async function moveMessage(token, mailbox, messageId, destinationId) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${encodeURIComponent(messageId)}/move`;
  return await graph(token, url, { method: 'POST', body: JSON.stringify({ destinationId }) });
}

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));
  const clientId = process.env.MS_CLIENT_ID;
  const tenantId = process.env.MS_TENANT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const mailbox = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
  const token = await getToken(tenantId, clientId, clientSecret);
  const folder = await ensureFolder(token, mailbox, 'OpenClaw Tests & Türkkep Reports');

  let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=100&$select=id,subject,receivedDateTime,from,parentFolderId&$orderby=receivedDateTime desc`;
  const matches = [];
  while (url && matches.length < 200) {
    const page = await graph(token, url);
    for (const m of (page.value || [])) {
      if (m.parentFolderId === folder.id) continue;
      if (wanted(m.subject || '')) matches.push(m);
    }
    url = page['@odata.nextLink'] || null;
    if (!page.value?.length) break;
  }

  const moved = [];
  const errors = [];
  for (const m of matches) {
    try {
      await moveMessage(token, mailbox, m.id, folder.id);
      moved.push({ subject: m.subject, from: m.from?.emailAddress?.address, receivedDateTime: m.receivedDateTime });
    } catch (err) {
      errors.push({ subject: m.subject, error: String(err?.message || err) });
    }
  }

  console.log(JSON.stringify({ folder: { id: folder.id, displayName: folder.displayName }, found: matches.length, moved, errors }, null, 2));
}

main().catch(err => { console.error(String(err?.message || err)); process.exit(1); });
