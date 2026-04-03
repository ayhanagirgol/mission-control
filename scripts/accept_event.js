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

const SUBJECT_KEYWORD = process.argv[2];
const START_ISO = process.argv[3];
const END_ISO = process.argv[4];

if (!SUBJECT_KEYWORD || !START_ISO || !END_ISO) {
  console.error('Usage: accept_event.js <subjectKeyword> <startISO> <endISO>');
  process.exit(2);
}

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS Graph credentials.');
  process.exit(2);
}

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
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    throw new Error(`Graph error ${res.status}: ${text}`);
  }
  return json;
}

async function acceptEvent() {
  const token = await getToken();
  const viewUrl = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/calendarView`);
  viewUrl.searchParams.set('startDateTime', START_ISO);
  viewUrl.searchParams.set('endDateTime', END_ISO);
  viewUrl.searchParams.set('$select', 'id,subject,start,end,organizer');
  viewUrl.searchParams.set('$top', '50');

  const view = await graph(token, viewUrl.toString());
  const events = view?.value || [];
  const lower = SUBJECT_KEYWORD.toLowerCase();
  const match = events.find(evt => (evt.subject || '').toLowerCase().includes(lower));
  if (!match) {
    console.error('Event not found in given window.');
    process.exit(1);
  }
  const acceptUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/events/${match.id}/accept`;
  await graph(token, acceptUrl, {
    method: 'POST',
    body: JSON.stringify({
      comment: 'Katılımı onaylıyorum. Görüşmek üzere.',
      sendResponse: true,
    }),
  });
  console.log(`Accepted event '${match.subject}' (${match.id}).`);
}

acceptEvent().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
