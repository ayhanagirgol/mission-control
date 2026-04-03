#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Load .env
const dotenvPath = path.join(process.cwd(), '.env');
if (fs.existsSync(dotenvPath)) {
  for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2] ?? '';
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const mailbox = 'ayhan.agirgol@finhouse.com.tr';
const action = process.argv[2] || 'check'; // check | disable

// Token al
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const body = new URLSearchParams({
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
  scope: 'https://graph.microsoft.com/.default',
});

const tokenRes = await fetch(tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
const tokenJson = await tokenRes.json();
if (!tokenRes.ok) {
  console.error(`Token HATASI: ${tokenJson.error} - ${tokenJson.error_description}`);
  process.exit(1);
}
const token = tokenJson.access_token;

// Mailbox ayarlarını oku
const settingsUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailboxSettings`;
const settingsRes = await fetch(settingsUrl, { headers: { Authorization: `Bearer ${token}` } });
const settings = await settingsRes.json();

if (!settingsRes.ok) {
  console.error(`Mailbox ayarları okunamadı: ${JSON.stringify(settings?.error)}`);
  process.exit(1);
}

console.log('=== Mevcut Yönlendirme Ayarları ===');
console.log(`forwardingSmtpAddress   : ${settings.forwardingSmtpAddress || '(yok)'}`);
console.log(`automaticRepliesSetting : ${settings.automaticRepliesSetting?.status || '(yok)'}`);

if (action === 'disable') {
  console.log('\nYönlendirme kapatılıyor...');
  const patchRes = await fetch(settingsUrl, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ forwardingSmtpAddress: null }),
  });
  if (patchRes.ok || patchRes.status === 204) {
    console.log('Yönlendirme başarıyla kapatıldı ✓');
  } else {
    const errJson = await patchRes.json().catch(() => ({}));
    console.error(`Yönlendirme kapatılamadı ${patchRes.status}: ${JSON.stringify(errJson?.error)}`);
  }
}
