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

const events = [
  {
    subject: '[Türkkep] Ercan Bey Ziyareti',
    body: { contentType: 'Text', content: 'Ercan Bey Türkkep ofisine ziyaret.' },
    start: { dateTime: '2026-04-01T16:00:00', timeZone: 'Turkey Standard Time' },
    end:   { dateTime: '2026-04-01T17:00:00', timeZone: 'Turkey Standard Time' },
    location: { displayName: 'Türkkep Ofisi' },
  },
  {
    subject: 'Tahsin Bey & Hakan Gürsoy Görüşmesi',
    body: { contentType: 'Text', content: 'Tahsin Ağırman ve Hakan Gürsoy ile stratejik görüşme.' },
    start: { dateTime: '2026-04-01T13:30:00', timeZone: 'Turkey Standard Time' },
    end:   { dateTime: '2026-04-01T14:30:00', timeZone: 'Turkey Standard Time' },
    location: { displayName: 'DT Cloud Genel Müdürlük - Kavacık' },
  },
];

for (const event of events) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await res.json();
  if (data.id) {
    console.log('✅ Eklendi:', event.subject, '@', event.start.dateTime.slice(11,16));
  } else {
    console.log('❌ Hata:', event.subject, JSON.stringify(data).slice(0,200));
  }
}
