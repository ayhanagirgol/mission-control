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

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));
  const clientId = process.env.MS_CLIENT_ID;
  const tenantId = process.env.MS_TENANT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const mailbox = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
  const token = await getToken(tenantId, clientId, clientSecret);

  const base = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`;
  const existing = await graph(token, `${base}?$top=200`);
  const found = (existing.value || []).find(r => (r.displayName || '') === 'Delete Netflix Mail');
  if (found) {
    console.log(JSON.stringify({ status: 'exists', id: found.id, displayName: found.displayName }, null, 2));
    return;
  }

  const rule = {
    displayName: 'Delete Netflix Mail',
    sequence: 1,
    isEnabled: true,
    conditions: {
      senderContains: ['info@members.netflix.com']
    },
    actions: {
      delete: true,
      stopProcessingRules: true
    }
  };

  const created = await graph(token, base, { method: 'POST', body: JSON.stringify(rule) });
  console.log(JSON.stringify({ status: 'created', id: created.id, displayName: created.displayName }, null, 2));
}

main().catch(err => { console.error(String(err?.message || err)); process.exit(1); });
