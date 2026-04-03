/**
 * Takvim Senkronizasyonu
 * Türkkep + Gmail → Finhouse (tek yönlü)
 * Tekrar önleme: ~/.openclaw/workspace/logs/calendar_sync_state.json
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const STATE_FILE = '/Users/baykus/.openclaw/workspace/logs/calendar_sync_state.json';
const FINHOUSE_MAILBOX = 'ayhan.agirgol@finhouse.com.tr';
const TURKKEP_MAILBOX = process.env.TURKKEP_MAILBOX_UPN;
const GMAIL_ACCOUNT = process.env.GMAIL_EMAIL;

// State: hangi event ID'leri zaten senkronize edildi
let state = { synced: {} };
if (fs.existsSync(STATE_FILE)) {
  try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch {}
}

function saveState() {
  fs.mkdirSync('/Users/baykus/.openclaw/workspace/logs', { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── Graph Token ──────────────────────────────────────────────────────────────
async function getGraphToken(clientId, tenantId, clientSecret) {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Prefer: 'outlook.timezone="Turkey Standard Time"', ...(opts.headers||{}) } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

// ── Finhouse token ───────────────────────────────────────────────────────────
const finhouseToken = await getGraphToken(
  process.env.MS_CLIENT_ID, process.env.MS_TENANT_ID, process.env.MS_CLIENT_SECRET
);

// ── Türkkep token ────────────────────────────────────────────────────────────
const turkkepToken = await getGraphToken(
  process.env.TURKKEP_MS_CLIENT_ID, process.env.TURKKEP_MS_TENANT_ID, process.env.TURKKEP_MS_CLIENT_SECRET
);

// Sonraki 30 günlük pencere
const now = new Date();
const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const from = now.toISOString();
const to = future.toISOString();

let added = 0;
let skipped = 0;

// ── Finhouse'a event ekle ────────────────────────────────────────────────────
async function addToFinhouse(event, sourceId, sourceLabel) {
  const key = `${sourceLabel}:${sourceId}`;
  if (state.synced[key]) { skipped++; return; }

  const payload = {
    subject: `[${sourceLabel}] ${(event.subject || event.summary || '(başlıksız)').replace(/^\[.*?\]\s*/, '')}`,
    body: { contentType: 'Text', content: event.body?.content || event.description || '' },
    start: {
      dateTime: event.start?.dateTime || `${event.start?.date}T00:00:00`,
      timeZone: event.start?.timeZone || 'Turkey Standard Time',
    },
    end: {
      dateTime: event.end?.dateTime || `${event.end?.date}T23:59:59`,
      timeZone: event.end?.timeZone || 'Turkey Standard Time',
    },
    location: { displayName: event.location?.displayName || event.location || '' },
    isAllDay: !!(event.start?.date && !event.start?.dateTime),
  };

  try {
    await graph(finhouseToken, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FINHOUSE_MAILBOX)}/events`, {
      method: 'POST', body: JSON.stringify(payload),
    });
    state.synced[key] = new Date().toISOString();
    added++;
    console.log(`✅ [${sourceLabel}] ${payload.subject.slice(0, 70)}`);
  } catch(e) {
    console.error(`❌ [${sourceLabel}] ${payload.subject.slice(0, 50)}: ${e.message}`);
  }
}

// ── 1. Türkkep takviminden etkinlikleri çek ──────────────────────────────────
console.log('\n[1] Türkkep takvimi okunuyor...');
try {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(TURKKEP_MAILBOX)}/calendarView?startDateTime=${from}&endDateTime=${to}&$top=50&$select=id,subject,start,end,location,body`;
  const res = await graph(turkkepToken, url);
  const events = res.value || [];
  console.log(`  ${events.length} etkinlik bulundu`);
  for (const e of events) {
    await addToFinhouse(e, e.id, 'Türkkep');
  }
} catch(e) {
  console.error(`Türkkep takvim hatası: ${e.message}`);
}

// ── 2. Gmail/Google Calendar'dan etkinlikleri çek ───────────────────────────
console.log('\n[2] Google Calendar okunuyor...');
try {
  const gogFrom = from.slice(0, 19) + 'Z';
  const gogTo = to.slice(0, 19) + 'Z';
  const gogOut = execSync(
    `gog calendar events primary --from ${gogFrom} --to ${gogTo} --account ${GMAIL_ACCOUNT} --json 2>/dev/null`,
    { encoding: 'utf8', timeout: 30000 }
  ).trim();

  let events = [];
  if (gogOut) {
    const parsed = JSON.parse(gogOut);
    events = Array.isArray(parsed) ? parsed : (parsed.items || parsed.events || []);
  }
  console.log(`  ${events.length} etkinlik bulundu`);
  for (const e of events) {
    await addToFinhouse(e, e.id, 'Gmail');
  }
} catch(e) {
  console.error(`Google Calendar hatası: ${e.message?.slice(0, 100)}`);
}

saveState();
console.log(`\n=== ÖZET ===`);
console.log(`✅ Eklenen : ${added}`);
console.log(`⏭️  Atlanan : ${skipped} (zaten senkronize)`);
console.log(`[${new Date().toISOString()}] Tamamlandı.`);
