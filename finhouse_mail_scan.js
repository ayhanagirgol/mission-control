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

function getProfileConfig(profileName) {
  const profile = (profileName || '').trim();
  const prefix = profile ? `${profile.toUpperCase()}_` : '';
  return {
    profile: profile || 'default',
    clientId: process.env[`${prefix}MS_CLIENT_ID`] || process.env.MS_CLIENT_ID,
    tenantId: process.env[`${prefix}MS_TENANT_ID`] || process.env.MS_TENANT_ID,
    clientSecret: process.env[`${prefix}MS_CLIENT_SECRET`] || process.env.MS_CLIENT_SECRET,
    mailboxUpn: process.env[`${prefix}MAILBOX_UPN`] || process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr',
  };
}

loadDotEnv(path.join(process.cwd(), '.env'));
const cfg = getProfileConfig(process.env.MAIL_PROFILE || 'finhouse');

async function getToken() {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });
  const res = await fetch(tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token error ${res.status}: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function graph(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph error ${res.status}: ${text}`);
  return json;
}

const token = await getToken();
const url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.mailboxUpn)}/messages`);
url.searchParams.set('$top', '15');
url.searchParams.set('$orderby', 'receivedDateTime desc');
url.searchParams.set('$select', 'subject,from,receivedDateTime,bodyPreview,importance,isRead,hasAttachments,webLink,categories');
const data = await graph(token, url.toString());
console.log(JSON.stringify({ mailbox: cfg.mailboxUpn, count: data.value?.length || 0, messages: data.value || [] }, null, 2));
