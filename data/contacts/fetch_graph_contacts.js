#!/usr/bin/env node
/**
 * Read-only Graph API mail contact extractor.
 * Usage: MAIL_PROFILE=turkkep node fetch_graph_contacts.js [top] > contacts.csv
 * Profiles: (default)=finhouse, turkkep
 */
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

loadDotEnv(path.resolve(import.meta.dirname || '.', '../../.env'));

const profile = (process.env.MAIL_PROFILE || '').trim().toUpperCase();
const pfx = profile ? `${profile}_` : '';
const clientId = process.env[`${pfx}MS_CLIENT_ID`] || process.env.MS_CLIENT_ID;
const tenantId = process.env[`${pfx}MS_TENANT_ID`] || process.env.MS_TENANT_ID;
const clientSecret = process.env[`${pfx}MS_CLIENT_SECRET`] || process.env.MS_CLIENT_SECRET;
const mailbox = process.env[`${pfx}MAILBOX_UPN`] || process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';
const top = parseInt(process.argv[2] || '500', 10);

async function getToken() {
  const r = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials' }),
  });
  return (await r.json()).access_token;
}

async function fetchMessages(token, folder, top) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/${folder}/messages?$top=${top}&$orderby=receivedDateTime desc&$select=from,toRecipients,ccRecipients,receivedDateTime,subject`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) { console.error(`${folder}: ${r.status}`); return []; }
  return (await r.json()).value || [];
}

function esc(s) { return `"${(s || '').replace(/"/g, '""')}"`; }

(async () => {
  const token = await getToken();
  if (!token) { console.error('Auth failed'); process.exit(1); }

  const [inbox, sent] = await Promise.all([
    fetchMessages(token, 'inbox', top),
    fetchMessages(token, 'sentitems', top),
  ]);

  const contacts = {}; // email -> { name, directions, dates }

  function add(email, name, dir, date) {
    if (!email) return;
    const e = email.toLowerCase().trim();
    if (e === mailbox.toLowerCase()) return;
    if (!contacts[e]) contacts[e] = { name: name || '', dirs: new Set(), dates: [] };
    contacts[e].dirs.add(dir);
    if (name && name.length > (contacts[e].name || '').length) contacts[e].name = name;
    if (date) contacts[e].dates.push(date);
  }

  for (const m of inbox) {
    const d = m.receivedDateTime;
    add(m.from?.emailAddress?.address, m.from?.emailAddress?.name, 'from', d);
    for (const r of (m.toRecipients || [])) add(r.emailAddress?.address, r.emailAddress?.name, 'to', d);
    for (const r of (m.ccRecipients || [])) add(r.emailAddress?.address, r.emailAddress?.name, 'to', d);
  }
  for (const m of sent) {
    const d = m.receivedDateTime;
    for (const r of (m.toRecipients || [])) add(r.emailAddress?.address, r.emailAddress?.name, 'to', d);
    for (const r of (m.ccRecipients || [])) add(r.emailAddress?.address, r.emailAddress?.name, 'to', d);
  }

  console.log('email,name,domain,company_hint,direction,count,first_seen,last_seen,source_mailbox,notes');
  for (const [email, c] of Object.entries(contacts).sort((a, b) => b[1].dates.length - a[1].dates.length)) {
    const domain = email.split('@')[1] || '';
    const company = domain.replace(/\.(com|net|org|co|com\.tr|gov\.tr|edu\.tr|tr|io|ai|dev)(\..+)?$/i, '').split('.').pop() || '';
    const dirs = c.dirs.has('from') && c.dirs.has('to') ? 'both' : [...c.dirs][0];
    const sorted = c.dates.sort();
    console.log([esc(email), esc(c.name), esc(domain), esc(company), dirs, c.dates.length, sorted[0] || '', sorted[sorted.length - 1] || '', esc(mailbox), ''].join(','));
  }
})();
