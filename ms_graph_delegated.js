#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

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
  if (!profile) {
    return {
      profile: 'default',
      clientId: process.env.MS_CLIENT_ID,
      tenantId: process.env.MS_TENANT_ID,
      clientSecret: process.env.MS_CLIENT_SECRET,
      mailboxUpn: process.env.MAILBOX_UPN,
    };
  }
  const prefix = `${profile.toUpperCase()}_`;
  return {
    profile,
    clientId: process.env[`${prefix}MS_CLIENT_ID`],
    tenantId: process.env[`${prefix}MS_TENANT_ID`],
    clientSecret: process.env[`${prefix}MS_CLIENT_SECRET`],
    mailboxUpn: process.env[`${prefix}MAILBOX_UPN`] || process.env.MAILBOX_UPN,
  };
}

function usage() {
  console.log(`Usage:\n  MAIL_PROFILE=turkkep node ms_graph_delegated.js auth\n  MAIL_PROFILE=turkkep node ms_graph_delegated.js list-mail\n  MAIL_PROFILE=turkkep node ms_graph_delegated.js list-calendar\n  MAIL_PROFILE=turkkep node ms_graph_delegated.js whoami\n`);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 1000)}`);
  return json;
}

const workspace = process.cwd();
loadDotEnv(path.join(workspace, '.env'));
const profile = process.env.MAIL_PROFILE || 'default';
const cfg = getProfileConfig(process.env.MAIL_PROFILE);
if (!cfg.clientId || !cfg.tenantId) {
  throw new Error(`Missing client/tenant for profile ${profile}`);
}
const tokenDir = path.join(workspace, '.tokens');
const tokenPath = path.join(tokenDir, `msgraph-${profile}.json`);
const redirectUri = process.env.MS_REDIRECT_URI || 'http://127.0.0.1:8765/callback';
const scopes = (process.env.MS_DELEGATED_SCOPES || 'offline_access User.Read Mail.Read Mail.ReadWrite Calendars.Read Calendars.ReadWrite Tasks.Read Tasks.ReadWrite').split(/\s+/).filter(Boolean);

function readTokenFile() {
  if (!fs.existsSync(tokenPath)) return null;
  return JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
}

function writeTokenFile(data) {
  fs.mkdirSync(tokenDir, { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify(data, null, 2));
}

async function exchangeCodeForToken(code) {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    scope: scopes.join(' '),
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  if (cfg.clientSecret) body.set('client_secret', cfg.clientSecret);
  return await fetchJson(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

async function refreshToken(refreshToken) {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    scope: scopes.join(' '),
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  if (cfg.clientSecret) body.set('client_secret', cfg.clientSecret);
  return await fetchJson(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

async function ensureAccessToken() {
  const existing = readTokenFile();
  if (existing?.access_token && existing?.expires_at && Date.now() < existing.expires_at - 60_000) {
    return existing.access_token;
  }
  if (existing?.refresh_token) {
    const refreshed = await refreshToken(existing.refresh_token);
    const merged = {
      ...existing,
      ...refreshed,
      expires_at: Date.now() + (refreshed.expires_in * 1000),
      obtained_at: new Date().toISOString(),
    };
    writeTokenFile(merged);
    return merged.access_token;
  }
  throw new Error(`No usable delegated token for profile ${profile}. Run auth first.`);
}

async function startAuth() {
  const state = crypto.randomBytes(16).toString('hex');
  const authUrl = new URL(`https://login.microsoftonline.com/${encodeURIComponent(cfg.tenantId)}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set('client_id', cfg.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_mode', 'query');
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const { hostname, port, pathname } = new URL(redirectUri);

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, `http://${req.headers.host}`);
      if (u.pathname !== pathname) {
        res.writeHead(404); res.end('Not found'); return;
      }
      if (u.searchParams.get('state') !== state) {
        res.writeHead(400); res.end('State mismatch');
        server.close();
        reject(new Error('OAuth state mismatch'));
        return;
      }
      const code = u.searchParams.get('code');
      if (!code) {
        res.writeHead(400); res.end('Missing code');
        server.close();
        reject(new Error('Missing authorization code'));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><body><h2>Microsoft login tamamlandı.</h2><p>Bu pencereyi kapatabilirsiniz.</p></body></html>');
      server.close();
      resolve(code);
    });
    server.listen(Number(port), hostname, () => {
      console.log(`Open this URL to sign in for profile '${profile}':\n${authUrl.toString()}\n`);
      try {
        const opener = process.platform === 'darwin' ? 'open' : 'xdg-open';
        spawn(opener, [authUrl.toString()], { stdio: 'ignore', detached: true }).unref();
      } catch {}
    });
    server.on('error', reject);
  });

  const token = await exchangeCodeForToken(code);
  const saved = {
    ...token,
    profile,
    scopes,
    tenant_id: cfg.tenantId,
    mailbox_upn: cfg.mailboxUpn,
    obtained_at: new Date().toISOString(),
    expires_at: Date.now() + (token.expires_in * 1000),
  };
  writeTokenFile(saved);
  console.log(`Saved delegated token: ${tokenPath}`);
}

async function graph(token, path) {
  const url = path.startsWith('http') ? path : `https://graph.microsoft.com/v1.0/${path}`;
  return await fetchJson(url, { headers: { Authorization: `Bearer ${token}` } });
}

async function main() {
  const cmd = process.argv[2];
  if (!cmd) { usage(); process.exit(1); }
  if (cmd === 'auth') return await startAuth();
  const token = await ensureAccessToken();
  if (cmd === 'whoami') {
    const me = await graph(token, 'me');
    console.log(JSON.stringify({ id: me.id, userPrincipalName: me.userPrincipalName, displayName: me.displayName }, null, 2));
    return;
  }
  if (cmd === 'list-mail') {
    const data = await graph(token, "me/messages?$top=5&$orderby=receivedDateTime%20desc&$select=subject,from,receivedDateTime");
    console.log(JSON.stringify(data.value || [], null, 2));
    return;
  }
  if (cmd === 'list-calendar') {
    const start = new Date();
    const end = new Date(Date.now() + 7 * 86400000);
    const qs = new URLSearchParams({ startDateTime: start.toISOString(), endDateTime: end.toISOString(), '$top': '10' });
    const data = await graph(token, `me/calendarView?${qs.toString()}`);
    console.log(JSON.stringify(data.value || [], null, 2));
    return;
  }
  usage();
  process.exit(1);
}

main().catch(err => {
  console.error(String(err?.message || err));
  process.exit(1);
});
