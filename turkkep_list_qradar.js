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
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
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
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`token ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`graph ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

function classify(subject = '') {
  const s = subject.toLowerCase();
  if (s.includes('locked out') || s.includes('account was locked out')) return 'high';
  if (s.includes('failed') || s.includes('authentication') || s.includes('bruteforce') || s.includes('attack')) return 'high';
  if (s.includes('fired')) return 'medium';
  return 'low';
}

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));
  const p = 'TURKKEP';
  const clientId = process.env[`${p}_MS_CLIENT_ID`];
  const tenantId = process.env[`${p}_MS_TENANT_ID`];
  const clientSecret = process.env[`${p}_MS_CLIENT_SECRET`];
  const mailbox = process.env[`${p}_MAILBOX_UPN`] || process.env.MAILBOX_UPN;
  const sender = (process.argv[2] || 'qradar@turkkep.com.tr').toLowerCase();
  const limit = Math.max(1, Number(process.argv[3] || '30'));
  const token = await getToken(tenantId, clientId, clientSecret);
  let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=100&$select=id,subject,receivedDateTime,from,bodyPreview&$orderby=receivedDateTime desc`;
  const out = [];
  while (url && out.length < limit) {
    const page = await graph(token, url);
    for (const m of (page.value || [])) {
      const from = (m.from?.emailAddress?.address || '').toLowerCase();
      if (from === sender) {
        out.push({
          receivedDateTime: m.receivedDateTime,
          from,
          subject: m.subject,
          bodyPreview: m.bodyPreview,
          severityGuess: classify(m.subject),
        });
        if (out.length >= limit) break;
      }
    }
    url = page['@odata.nextLink'] || null;
  }
  console.log(JSON.stringify(out, null, 2));
}

main().catch(err => { console.error(String(err?.message || err)); process.exit(1); });
