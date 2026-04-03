#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TARGET_FOLDER_NAME = 'Elektrikli Araç Ödemeleri';
const KEYWORDS = [
  'elektrikli araç',
  'elektrikli arac',
  'ev ödeme',
  'araç ödemesi',
  'araç ödeme',
  'zeplin'
];
const PAGE_SIZE = 50;
const MAX_PAGES = 12;
const SEARCH_PAGE_SIZE = 25;
const SEARCH_MAX_PAGES = 4;
const SEARCH_TERMS = ['from:zeplin'];

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

const dotenvPath = path.join(process.cwd(), '.env');
loadDotEnv(dotenvPath);

const {
  MS_CLIENT_ID,
  MS_TENANT_ID,
  MS_CLIENT_SECRET,
} = process.env;

const MAILBOX_UPN = process.env.MAILBOX_UPN || 'ayhan.agirgol@finhouse.com.tr';

if (!MS_CLIENT_ID || !MS_TENANT_ID || !MS_CLIENT_SECRET) {
  console.error('Missing MS_CLIENT_ID/MS_TENANT_ID/MS_CLIENT_SECRET in environment (or .env).');
  process.exit(2);
}

async function getToken() {
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(MS_TENANT_ID)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: MS_CLIENT_ID,
    client_secret: MS_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Token error ${res.status}: ${JSON.stringify({ error: json.error, error_description: json.error_description })}`);
  }
  if (!json.access_token) throw new Error('Token response missing access_token');
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!res.ok) {
    const errBody = json?.error ? { code: json.error.code, message: json.error.message } : (text?.slice(0, 500) || '');
    throw new Error(`Graph error ${res.status}: ${JSON.stringify(errBody)}`);
  }
  return json;
}

async function ensureFolder(token) {
  const listUrl = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/mailFolders`);
  listUrl.searchParams.set('$top', '100');
  listUrl.searchParams.set('$select', 'id,displayName');
  const json = await graph(token, listUrl.toString(), { method: 'GET' });
  const folders = json?.value || [];
  const existing = folders.find(f => f.displayName?.toLowerCase() === TARGET_FOLDER_NAME.toLowerCase());
  if (existing) return existing.id;

  const createUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/mailFolders`;
  const created = await graph(token, createUrl, {
    method: 'POST',
    body: JSON.stringify({ displayName: TARGET_FOLDER_NAME }),
  });
  return created.id;
}

async function fetchMessages(token) {
  let url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages`);
  url.searchParams.set('$top', String(PAGE_SIZE));
  url.searchParams.set('$orderby', 'receivedDateTime desc');
  url.searchParams.set('$select', 'id,subject,from,receivedDateTime,parentFolderId,bodyPreview');

  const all = [];
  let nextLink = url.toString();
  for (let page = 0; page < MAX_PAGES && nextLink; page++) {
    const json = await graph(token, nextLink, { method: 'GET' });
    const items = json?.value || [];
    all.push(...items);
    nextLink = json['@odata.nextLink'] || null;
  }
  return all;
}

async function searchMessagesByKeyword(token, keyword) {
  const searchValue = `"${keyword}"`;
  let url = new URL(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages`);
  url.searchParams.set('$search', searchValue);
  url.searchParams.set('$top', String(SEARCH_PAGE_SIZE));
  url.searchParams.set('$select', 'id,subject,from,receivedDateTime,parentFolderId,bodyPreview');

  const results = [];
  let nextLink = url.toString();
  for (let page = 0; page < SEARCH_MAX_PAGES && nextLink; page++) {
    const json = await graph(token, nextLink, {
      method: 'GET',
      headers: { 'ConsistencyLevel': 'eventual' },
    });
    const items = json?.value || [];
    results.push(...items);
    nextLink = json['@odata.nextLink'] || null;
  }
  return results;
}

function matchesKeywords(msg) {
  const subject = msg.subject?.toLowerCase() || '';
  const preview = msg.bodyPreview?.toLowerCase() || '';
  const sender = (msg.from?.emailAddress?.address || msg.from?.emailAddress?.name || '').toLowerCase();
  return KEYWORDS.some(kw => subject.includes(kw) || preview.includes(kw) || sender.includes(kw));
}

async function moveMessage(token, messageId, destinationId) {
  const moveUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX_UPN)}/messages/${messageId}/move`;
  return await graph(token, moveUrl, {
    method: 'POST',
    body: JSON.stringify({ destinationId }),
  });
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  const token = await getToken();
  const folderId = await ensureFolder(token);
  const messages = await fetchMessages(token);
  const matchMap = new Map();

  for (const msg of messages) {
    if (matchesKeywords(msg)) {
      matchMap.set(msg.id, msg);
    }
  }

  for (const term of [...KEYWORDS, ...SEARCH_TERMS]) {
    const found = await searchMessagesByKeyword(token, term);
    for (const msg of found) {
      if (!matchMap.has(msg.id)) {
        matchMap.set(msg.id, msg);
      }
    }
  }

  const matches = Array.from(matchMap.values()).sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

  const summary = [];
  for (const msg of matches) {
    let status = 'Zaten klasörde';
    if (msg.parentFolderId !== folderId) {
      await moveMessage(token, msg.id, folderId);
      status = 'Taşındı';
    }
    summary.push({
      receivedDateTime: msg.receivedDateTime,
      from: msg.from?.emailAddress?.address || msg.from?.emailAddress?.name || 'Bilinmiyor',
      subject: msg.subject || '(konu yok)',
      status,
    });
  }

  const tableRows = summary.map(row => `| ${formatDate(row.receivedDateTime)} | ${row.from} | ${row.subject.replace(/\|/g, '/')} | ${row.status} |`).join('\n');
  const table = summary.length
    ? `| Tarih | Gönderen | Konu | Durum |\n| --- | --- | --- | --- |\n${tableRows}`
    : 'Elektrikli araç ödemeleri anahtar kelimeleriyle eşleşen e-posta bulunamadı.';

  const outPath = path.join(process.cwd(), 'reports', 'elektrikli-arac-odemeleri.md');
  ensureDir(outPath);
  fs.writeFileSync(outPath, `# Elektrikli Araç Ödemeleri\n\n${table}\n`, 'utf8');

  console.log(`Target folder: ${TARGET_FOLDER_NAME} (${folderId})`);
  console.log(`Toplam taranan e-posta: ${messages.length}`);
  console.log(`Eşleşen e-posta: ${summary.length}`);
  console.log(table);
})();
