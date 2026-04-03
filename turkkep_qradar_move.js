#!/usr/bin/env node
/**
 * Mevcut qradar maillerini işle:
 * - Kritik olanlar → bayrak
 * - Diğerleri → qradar klasörüne taşı
 */
import fs from 'node:fs';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const clientId = process.env.TURKKEP_MS_CLIENT_ID;
const tenantId = process.env.TURKKEP_MS_TENANT_ID;
const clientSecret = process.env.TURKKEP_MS_CLIENT_SECRET;
const mailbox = process.env.TURKKEP_MAILBOX_UPN;

const CRITICAL_KEYWORDS = [
  'Critical', 'High Severity', 'P1',
  'Ransomware', 'Data Exfiltration', 'Exfiltration',
  'Privilege Escalation', 'Lateral Movement',
  'Command and Control', 'Persistence',
  'TA0010', 'TA0011', 'TA0008', 'TA0004', 'TA0005', 'TA0040',
];

function isCritical(subject) {
  return CRITICAL_KEYWORDS.some(kw => subject?.toLowerCase().includes(kw.toLowerCase()));
}

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token hatası: ${json.error}`);
  return json.access_token;
}

async function graph(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(json?.error)}`);
  return json;
}

const token = await getToken();

// qradar klasörünü bul
const folders = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders?$top=50`);
const qradarFolder = (folders.value || []).find(f => f.displayName.toLowerCase() === 'qradar');
if (!qradarFolder) { console.error('qradar klasörü bulunamadı!'); process.exit(1); }
console.log(`qradar klasörü bulundu: ${qradarFolder.id}\n`);

// Inbox'taki qradar maillerini işle
let nextLink = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages?$filter=from/emailAddress/address eq 'qradar@turkkep.com.tr'&$top=50&$select=id,subject,flag`;
let movedCount = 0, flaggedCount = 0;

while (nextLink) {
  const page = await graph(token, nextLink);
  const messages = page.value || [];
  if (messages.length === 0 && movedCount === 0 && flaggedCount === 0) {
    console.log('Inbox\'ta qradar maili bulunamadı.');
  }

  for (const msg of messages) {
    if (isCritical(msg.subject)) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ flag: { flagStatus: 'flagged' } }),
      });
      flaggedCount++;
      console.log(`🚩 Bayrak: ${msg.subject?.slice(0, 80)}`);
    } else {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`, {
        method: 'POST',
        body: JSON.stringify({ destinationId: qradarFolder.id }),
      });
      movedCount++;
      console.log(`📁 Taşındı: ${msg.subject?.slice(0, 80)}`);
    }
  }
  nextLink = page['@odata.nextLink'] || null;
}

console.log(`\n=== TAMAMLANDI ===`);
console.log(`📁 Taşınan (kritik olmayan): ${movedCount}`);
console.log(`🚩 Bayrak eklenen (kritik):  ${flaggedCount}`);
