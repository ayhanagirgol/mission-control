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
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
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

  let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=50&$select=id,subject,receivedDateTime,from&$orderby=receivedDateTime desc`;
  const matches = [];
  while (url && matches.length < 50) {
    const page = await graph(token, url);
    for (const m of (page.value || [])) {
      const from = (m.from?.emailAddress?.address || '').toLowerCase();
      const subject = (m.subject || '').toLowerCase();
      if (from.includes('netflix') || subject.includes('netflix')) matches.push(m);
    }
    url = page['@odata.nextLink'] || null;
    if (!page.value?.length) break;
  }

  const deleted = [];
  const errors = [];
  for (const m of matches) {
    try {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${encodeURIComponent(m.id)}`, { method: 'DELETE' });
      deleted.push({ subject: m.subject, from: m.from?.emailAddress?.address, receivedDateTime: m.receivedDateTime });
    } catch (err) {
      errors.push({ subject: m.subject, error: String(err?.message || err) });
    }
  }

  console.log(JSON.stringify({ found: matches.length, deleted, errors }, null, 2));
}

main().catch(err => { console.error(String(err?.message || err)); process.exit(1); });
