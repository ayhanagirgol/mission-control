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

const event = {
  subject: 'Salim Büge ile Görüşme – Bulutistan Kampüsü',
  body: {
    contentType: 'Text',
    content: 'Dokuz.io / Salim Büge ile tanışma ve finans sektörü potansiyel işbirliği görüşmesi.\n\nBulutistan iftarında tanışıldı, finans sektörüne çözümler konusunda işbirliği potansiyeli değerlendirilecek.',
  },
  start: {
    dateTime: '2026-03-26T10:00:00',
    timeZone: 'Turkey Standard Time',
  },
  end: {
    dateTime: '2026-03-26T11:00:00',
    timeZone: 'Turkey Standard Time',
  },
  location: {
    displayName: 'Bulutistan Kampüsü',
  },
  attendees: [
    {
      emailAddress: { address: 'salim.buge@dokuz.io', name: 'Salim Büge' },
      type: 'required',
    },
  ],
};

const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/events`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(event),
});
const j = await res.json();
if (!res.ok) {
  console.error(`Hata ${res.status}: ${JSON.stringify(j?.error)}`);
  process.exit(1);
}
console.log(`✅ Event oluşturuldu: ${j.subject}`);
console.log(`📅 ${j.start?.dateTime} – ${j.end?.dateTime}`);
console.log(`📍 ${j.location?.displayName}`);
console.log(`🔗 ${j.webLink}`);
