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

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`graph ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));

  const index = Math.max(1, Number(process.argv[2] || '1'));
  const profile = 'TURKKEP';
  const clientId = process.env[`${profile}_MS_CLIENT_ID`];
  const tenantId = process.env[`${profile}_MS_TENANT_ID`];
  const clientSecret = process.env[`${profile}_MS_CLIENT_SECRET`];
  const mailbox = process.env[`${profile}_MAILBOX_UPN`] || process.env.MAILBOX_UPN;

  if (!clientId || !tenantId || !clientSecret || !mailbox) {
    throw new Error('Missing TURKKEP Graph env vars');
  }

  const token = await getToken(tenantId, clientId, clientSecret);
  const list = await graph(
    token,
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=${index}&$orderby=receivedDateTime%20desc&$select=id,subject,from,receivedDateTime,bodyPreview`
  );

  const msg = list.value?.[index - 1];
  if (!msg) throw new Error(`No message found at index ${index}`);

  const full = await graph(
    token,
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${encodeURIComponent(msg.id)}?$select=subject,from,receivedDateTime,body,bodyPreview`
  );

  console.log(JSON.stringify({
    receivedDateTime: full.receivedDateTime,
    from: full.from?.emailAddress?.address,
    subject: full.subject,
    bodyPreview: full.bodyPreview,
    bodyType: full.body?.contentType,
    body: full.body?.content,
  }, null, 2));
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exit(1);
});
