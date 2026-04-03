import fs from 'node:fs';
const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}
const clientId = process.env.MS_CLIENT_ID;
const tenantId = process.env.MS_TENANT_ID;
const clientSecret = process.env.MS_CLIENT_SECRET;
const mailbox = 'ayhan.agirgol@finhouse.com.tr';

const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
});
const { access_token: token } = await tokenRes.json();

// Get today's events
const today = new Date('2026-04-01T00:00:00');
const end = new Date('2026-04-02T00:00:00');
const url = `https://graph.microsoft.com/v1.0/users/${mailbox}/calendarView?startDateTime=${today.toISOString()}&endDateTime=${end.toISOString()}&$select=id,subject,start,organizer&$top=20`;
const res = await fetch(url, {headers:{Authorization:`Bearer ${token}`, Prefer:'outlook.timezone="Turkey Standard Time"'}});
const data = await res.json();

// Find the event we created (organizer = finhouse, subject = Tahsin Bey)
const toDelete = data.value?.find(e => e.subject === 'Tahsin Bey & Hakan Gürsoy Görüşmesi');
if (!toDelete) {
  console.log('Etkinlik bulunamadı'); process.exit(1);
}

console.log('Siliniyor:', toDelete.subject, '@', toDelete.start.dateTime.slice(0,16));
const delRes = await fetch(`https://graph.microsoft.com/v1.0/users/${mailbox}/events/${toDelete.id}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
});
if (delRes.status === 204) {
  console.log('✅ Silindi');
} else {
  const err = await delRes.text();
  console.log('❌ Hata:', err.slice(0,200));
}
