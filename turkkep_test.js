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

const clientId = process.env.TURKKEP_MS_CLIENT_ID;
const tenantId = process.env.TURKKEP_MS_TENANT_ID;
const clientSecret = process.env.TURKKEP_MS_CLIENT_SECRET;
const mailbox = process.env.TURKKEP_MAILBOX_UPN;

console.log('=== Türkkep M365 Erişim Testi ===');
console.log(`Client ID : ${clientId}`);
console.log(`Tenant ID : ${tenantId}`);
console.log(`Mailbox   : ${mailbox}`);

// 1. Token al
console.log('\n[1] Token alınıyor...');
const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const body = new URLSearchParams({
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
  scope: 'https://graph.microsoft.com/.default',
});

let token;
try {
  const res = await fetch(tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const json = await res.json();
  if (!res.ok) {
    console.error(`Token HATASI: ${json.error} - ${json.error_description}`);
    process.exit(1);
  }
  token = json.access_token;
  console.log('Token alındı ✓');
} catch (e) {
  console.error(`Token isteği başarısız: ${e.message}`);
  process.exit(1);
}

// 2. Mail listele
console.log('\n[2] Son 5 mail listeleniyor...');
try {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages?$top=5&$orderby=receivedDateTime desc&$select=subject,from,receivedDateTime,isRead`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok) {
    console.error(`Mail HATASI ${res.status}: ${JSON.stringify(json?.error)}`);
  } else {
    const msgs = json.value || [];
    if (msgs.length === 0) {
      console.log('Hiç mail bulunamadı.');
    } else {
      for (const m of msgs) {
        const read = m.isRead ? '✓' : '●';
        console.log(`${read} ${m.receivedDateTime?.slice(0,10)} | ${m.from?.emailAddress?.address || 'bilinmiyor'} | ${m.subject || '(konu yok)'}`);
      }
    }
  }
} catch (e) {
  console.error(`Mail okuma hatası: ${e.message}`);
}

// 3. Takvim listele
console.log('\n[3] Yaklaşan takvim etkinlikleri listeleniyor...');
try {
  const now = new Date().toISOString();
  const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/calendarView?startDateTime=${now}&endDateTime=${end}&$top=10&$select=subject,start,end,organizer&$orderby=start/dateTime`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok) {
    console.error(`Takvim HATASI ${res.status}: ${JSON.stringify(json?.error)}`);
  } else {
    const events = json.value || [];
    if (events.length === 0) {
      console.log('Yaklaşan etkinlik bulunamadı.');
    } else {
      for (const e of events) {
        console.log(`📅 ${e.start?.dateTime?.slice(0,16).replace('T',' ')} | ${e.subject || '(başlık yok)'}`);
      }
    }
  }
} catch (e) {
  console.error(`Takvim okuma hatası: ${e.message}`);
}
