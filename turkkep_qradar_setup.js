#!/usr/bin/env node
/**
 * Türkkep QRadar Mail Düzenleme
 * 1. "qradar" klasörü oluştur
 * 2. Gelen kutusu kuralları tanımla (kritik → bayrak, diğerleri → qradar klasörü)
 * 3. Mevcut qradar maillerini işle
 *
 * Kritik sayılan anahtar kelimeler (konu başlığında):
 * Critical, High Severity, P1, Ransomware, Data Exfiltration,
 * Privilege Escalation, Lateral Movement, Exfiltration, Command and Control
 * MITRE taktikleri: TA0010, TA0011, TA0008, TA0004, TA0005, TA0040
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

// Kritik anahtar kelimeler
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

// --- Auth ---
async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Token hatası: ${json.error} - ${json.error_description}`);
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
console.log('Token alındı ✓\n');

// --- 1. qradar klasörünü bul veya oluştur ---
console.log('[1] "qradar" klasörü kontrol ediliyor...');
const folders = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders?$top=50`);
let qradarFolder = (folders.value || []).find(f => f.displayName.toLowerCase() === 'qradar');

if (qradarFolder) {
  console.log(`  Klasör zaten var: ${qradarFolder.id}`);
} else {
  qradarFolder = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders`, {
    method: 'POST',
    body: JSON.stringify({ displayName: 'qradar' }),
  });
  console.log(`  Klasör oluşturuldu ✓ (id: ${qradarFolder.id})`);
}

// --- 2. Mevcut kuralları kontrol et / temizle ---
console.log('\n[2] Mevcut qradar kuralları kontrol ediliyor...');
const rulesRes = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`);
const existingRules = rulesRes.value || [];

for (const rule of existingRules) {
  if (rule.displayName?.startsWith('QRadar')) {
    await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules/${rule.id}`, { method: 'DELETE' });
    console.log(`  Eski kural silindi: ${rule.displayName}`);
  }
}

// --- 3. Kural 1: Kritik qradar mailleri → Bayrak ---
console.log('\n[3] Kural oluşturuluyor: Kritik QRadar → Bayrak...');
await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`, {
  method: 'POST',
  body: JSON.stringify({
    displayName: 'QRadar - Kritik Bayrak',
    sequence: 1,
    isEnabled: true,
    conditions: {
      senderContains: ['qradar@turkkep.com.tr'],
      subjectContains: CRITICAL_KEYWORDS,
    },
    actions: {
      markAsRead: false,
      flagMessage: { flagStatus: 'flagged' },
    },
  }),
});
console.log('  Kural oluşturuldu ✓');

// --- 4. Kural 2: Diğer qradar mailleri → qradar klasörü ---
console.log('\n[4] Kural oluşturuluyor: QRadar (diğer) → qradar klasörü...');
await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messageRules`, {
  method: 'POST',
  body: JSON.stringify({
    displayName: 'QRadar - Klasöre Taşı',
    sequence: 2,
    isEnabled: true,
    conditions: {
      senderContains: ['qradar@turkkep.com.tr'],
    },
    actions: {
      moveToFolder: qradarFolder.id,
      markAsRead: false,
    },
  }),
});
console.log('  Kural oluşturuldu ✓');

// --- 5. Mevcut qradar maillerini işle ---
console.log('\n[5] Mevcut qradar mailleri işleniyor...');

let nextLink = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages?$filter=from/emailAddress/address eq 'qradar@turkkep.com.tr'&$top=50&$select=id,subject,flag`;
let movedCount = 0, flaggedCount = 0;

while (nextLink) {
  const page = await graph(token, nextLink);
  const messages = page.value || [];

  for (const msg of messages) {
    if (isCritical(msg.subject)) {
      // Bayrak ekle
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ flag: { flagStatus: 'flagged' } }),
      });
      flaggedCount++;
      console.log(`  🚩 Bayrak: ${msg.subject?.slice(0, 70)}`);
    } else {
      // qradar klasörüne taşı
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`, {
        method: 'POST',
        body: JSON.stringify({ destinationId: qradarFolder.id }),
      });
      movedCount++;
      console.log(`  📁 Taşındı: ${msg.subject?.slice(0, 70)}`);
    }
  }

  nextLink = page['@odata.nextLink'] || null;
}

console.log(`\n=== TAMAMLANDI ===`);
console.log(`📁 qradar klasörüne taşınan: ${movedCount}`);
console.log(`🚩 Bayrak eklenen (kritik):   ${flaggedCount}`);
console.log(`\nKritik kural önce çalışır (sequence:1), ardından taşıma kuralı (sequence:2).`);
