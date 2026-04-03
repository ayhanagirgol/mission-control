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
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`token ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Prefer: 'outlook.timezone="Turkey Standard Time"' } });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`graph ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function main() {
  loadDotEnv(path.join(process.cwd(), '.env'));
  const clientId = process.env.MS_CLIENT_ID;
  const tenantId = process.env.MS_TENANT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const mailbox = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
  if (!clientId || !tenantId || !clientSecret || !mailbox) throw new Error('Missing Finhouse Graph env vars');

  const token = await getToken(tenantId, clientId, clientSecret);
  const start = new Date().toISOString();
  const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/calendar/calendarView?startDateTime=${encodeURIComponent(start)}&endDateTime=${encodeURIComponent(end)}&$top=10&$select=subject,start,end,organizer,location`;
  const json = await graph(token, url);
  const items = (json.value || []).map(ev => ({
    subject: ev.subject,
    start: ev.start?.dateTime,
    end: ev.end?.dateTime,
    timeZoneStart: ev.start?.timeZone,
    organizer: ev.organizer?.emailAddress?.address,
    location: ev.location?.displayName,
  }));
  console.log(JSON.stringify(items, null, 2));
}

main().catch(err => {
  console.error(String(err?.message || err));
  process.exit(1);
});
