/**
 * Türkkep Inbox Klasörleme
 * - servicecore.com.tr + servicecore.app → Servicecore klasörü
 * - service.desk@turkkep.com.tr (onay olmayan) → Service-Desk klasörü
 * - destekportal@mailgw.turkkep.com.tr → Service-Desk klasörü
 * - dcmonitoring@ms6.turkkep.com.tr → System-Alerts klasörü
 * - E-FaturaSQLAlert@turkkep.com.tr → System-Alerts klasörü
 * - endpoint@turkkep.com.tr → System-Alerts klasörü
 * - ankarafw_backup@turkkep.com.tr → System-Alerts klasörü
 * - gebzefw_backup@turkkep.com.tr → System-Alerts klasörü
 * - SQL Server Job bildirimleri (subject match) → System-Alerts klasörü
 * - *fw_backup@turkkep.com.tr → System-Alerts klasörü
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

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status} ${url}: ${JSON.stringify(j?.error)}`);
  return j;
}

async function getOrCreateFolder(token, name) {
  const res = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders?$top=50`);
  let folder = (res.value || []).find(f => f.displayName === name);
  if (!folder) {
    folder = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders`,
      { method: 'POST', body: JSON.stringify({ displayName: name }) });
    console.log(`📁 Klasör oluşturuldu: ${name}`);
  }
  return folder.id;
}

// Onay bildirimi mi?
const isApproval = subject => {
  const s = subject?.toLowerCase() || '';
  return s.includes('onaylandı') || s.includes('onayınıza') || s.includes('onay bekliyor') ||
         s.includes('approved') || s.includes('onaylama') || s.includes('talebiniz onay');
};

const token = await getToken();
console.log(`[${new Date().toISOString()}] Türkkep Klasörleme Başladı\n`);

// Klasörleri oluştur
const servicecoreId = await getOrCreateFolder(token, 'Servicecore');
const serviceDeskId = await getOrCreateFolder(token, 'Service-Desk');
const systemAlertsId = await getOrCreateFolder(token, 'System-Alerts');

const stats = { servicecore: 0, serviceDesk: 0, systemAlerts: 0, skipped: 0 };

// Inbox'ı tara
let next = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/mailFolders/inbox/messages?$top=100&$select=id,subject,from`;

while (next) {
  const res = await graph(token, next);
  const msgs = res.value || [];

  for (const msg of msgs) {
    const sender = msg.from?.emailAddress?.address?.toLowerCase() || '';
    const subject = msg.subject || '';

    // servicecore → Servicecore klasörü
    if (sender.includes('@servicecore.com.tr') || sender.includes('@servicecore.app')) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: servicecoreId }) });
      stats.servicecore++;
      console.log(`📦 Servicecore: ${subject.slice(0, 70)}`);
      continue;
    }

    // service.desk — onay bildirimleri kalsın, diğerleri Service-Desk'e
    if (sender === 'service.desk@turkkep.com.tr') {
      if (isApproval(subject)) {
        stats.skipped++;
        continue; // inbox'ta kalsın
      }
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: serviceDeskId }) });
      stats.serviceDesk++;
      console.log(`🎫 Service-Desk: ${subject.slice(0, 70)}`);
      continue;
    }

    // destekportal → Service-Desk
    if (sender.includes('destekportal@mailgw.turkkep.com.tr')) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: serviceDeskId }) });
      stats.serviceDesk++;
      console.log(`🎫 Service-Desk (portal): ${subject.slice(0, 70)}`);
      continue;
    }

    // Sistem bildirimleri → System-Alerts
    const isSqlJob = subject.toLowerCase().includes('[the job succeeded.]') || subject.toLowerCase().includes('[the job failed.]') || subject.toLowerCase().includes('sql server job system');
    if (
      sender.includes('dcmonitoring@ms6.turkkep.com.tr') ||
      sender.includes('e-faturasqlalert@turkkep.com.tr') ||
      sender.includes('endpoint@turkkep.com.tr') ||
      sender.includes('ankarafw_backup@turkkep.com.tr') ||
      sender.includes('gebzefw_backup@turkkep.com.tr') ||
      sender.match(/fw_backup@turkkep\.com\.tr/) ||
      sender.includes('monitoring@') ||
      isSqlJob
    ) {
      await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/messages/${msg.id}/move`,
        { method: 'POST', body: JSON.stringify({ destinationId: systemAlertsId }) });
      stats.systemAlerts++;
      console.log(`🔔 System-Alerts: ${subject.slice(0, 70)}`);
      continue;
    }
  }

  next = res['@odata.nextLink'] || null;
}

console.log(`\n=== ÖZET ===`);
console.log(`📦 Servicecore taşınan:   ${stats.servicecore}`);
console.log(`🎫 Service-Desk taşınan:  ${stats.serviceDesk}`);
console.log(`🔔 System-Alerts taşınan: ${stats.systemAlerts}`);
console.log(`✅ Onay bildirimi (kaldı): ${stats.skipped}`);
console.log(`[${new Date().toISOString()}] Tamamlandı.`);
