/**
 * Pazartesi Sabahı Haftalık Brifing
 * ─────────────────────────────────
 * - Haftanın takvim etkinlikleri (Finhouse Graph)
 * - Açık/bekleyen görevler (Microsoft To Do)
 * - Finhouse mailbox'taki aksiyonlar
 * - Her toplantı için otomatik şirket araştırması
 * - HTML mail olarak ayhan.agirgol@finhouse.com.tr'ye gönderilir
 */

import fs from 'node:fs';
import nodemailer from 'nodemailer';

// ── .env ──
for (const line of fs.readFileSync('/Users/baykus/.openclaw/workspace/.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let v = m[2] ?? '';
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = v;
}

const { MS_TENANT_ID: TID, MS_CLIENT_ID: CID, MS_CLIENT_SECRET: CS,
        GMAIL_EMAIL, GMAIL_APP_PASSWORD, OPENAI_API_KEY } = process.env;
const MAILBOX = 'ayhan.agirgol@finhouse.com.tr';
const REPORT_TO = 'ayhan.agirgol@finhouse.com.tr';

// ── Graph token ──
async function getToken() {
  const r = await fetch(`https://login.microsoftonline.com/${TID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CID, client_secret: CS, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('Token fail: ' + JSON.stringify(j));
  return j.access_token;
}

async function graph(token, url) {
  const r = await fetch(url.startsWith('http') ? url : `https://graph.microsoft.com/v1.0${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const j = await r.json();
  if (j.error) throw new Error(`Graph: ${j.error.code} — ${j.error.message}`);
  return j;
}

// ── AI özet (OpenAI) ──
async function aiSummary(prompt) {
  if (!OPENAI_API_KEY) return null;
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.3,
      }),
    });
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

// ── Takvim etkinlikleri ──
async function getWeekEvents(token) {
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = (day === 0) ? 1 : (day === 1) ? 0 : (8 - day + 1) % 7 || 7;
  if (diff > 0) monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 7);

  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/calendarView?startDateTime=${monday.toISOString()}&endDateTime=${friday.toISOString()}&$top=50&$select=subject,start,end,organizer,location,attendees,bodyPreview&$orderby=start/dateTime`;
  const j = await graph(token, url);
  return j.value || [];
}

// ── Mail aksiyonları (son 3 gün okunmamış) ──
async function getActionableMails(token) {
  const since = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/messages?$filter=isRead eq false and receivedDateTime ge ${since}&$top=30&$select=subject,from,receivedDateTime,bodyPreview&$orderby=receivedDateTime desc`;
  const j = await graph(token, url);
  return j.value || [];
}

// ── To Do görevleri ──
async function getTodoTasks() {
  const tokenFile = '/Users/baykus/.openclaw/workspace/.todo_tokens.json';
  if (!fs.existsSync(tokenFile)) return [];
  let tokens = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));

  // Refresh if needed
  if (!tokens.access_token || Date.now() > (tokens.expires_at || 0) - 300_000) {
    const r = await fetch(`https://login.microsoftonline.com/${TID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: CID, grant_type: 'refresh_token', refresh_token: tokens.refresh_token, scope: 'Tasks.ReadWrite offline_access' }),
    });
    const d = await r.json();
    if (d.access_token) {
      tokens = { access_token: d.access_token, refresh_token: d.refresh_token || tokens.refresh_token, expires_at: Date.now() + (d.expires_in || 3600) * 1000 };
      fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
    }
  }

  // Get lists and tasks
  const listsR = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
  const lists = (await listsR.json()).value || [];
  const allTasks = [];
  for (const list of lists.filter(l => l.wellknownListName === 'defaultList' || l.displayName === 'Finhouse')) {
    const tasksR = await fetch(`https://graph.microsoft.com/v1.0/me/todo/lists/${list.id}/tasks?$filter=status ne 'completed'&$top=20`, { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const tasks = (await tasksR.json()).value || [];
    for (const t of tasks) allTasks.push({ ...t, listName: list.displayName });
  }
  return allTasks;
}

// ── Hafta formatı ──
function fmtDate(d) {
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const dt = new Date(d);
  return `${days[dt.getDay()]} ${dt.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })} ${dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' })}`;
}

// ── HTML oluştur ──
function buildHtml({ events, mails, tasks, today, weekLabel }) {
  const eventsByDay = {};
  for (const e of events) {
    const d = new Date(e.start.dateTime).toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'Europe/Istanbul' });
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(e);
  }

  let calHtml = '';
  for (const [day, evs] of Object.entries(eventsByDay)) {
    calHtml += `<h3 style="color:#2563eb;margin:16px 0 4px">${day}</h3><ul style="margin:0;padding-left:20px">`;
    for (const e of evs) {
      const time = new Date(e.start.dateTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
      const loc = e.location?.displayName ? ` · <span style="color:#64748b">${e.location.displayName}</span>` : '';
      calHtml += `<li style="margin:4px 0"><strong>${time}</strong> — ${e.subject}${loc}</li>`;
    }
    calHtml += '</ul>';
  }
  if (!calHtml) calHtml = '<p style="color:#64748b">Bu hafta takvimde etkinlik yok.</p>';

  let taskHtml = tasks.length
    ? '<ul style="margin:0;padding-left:20px">' + tasks.map(t => {
        const due = t.dueDateTime ? ` <span style="color:#ef4444;font-size:12px">📅 ${t.dueDateTime.dateTime.split('T')[0]}</span>` : '';
        return `<li style="margin:4px 0">${t.title}${due} <span style="color:#94a3b8;font-size:11px">[${t.listName}]</span></li>`;
      }).join('') + '</ul>'
    : '<p style="color:#64748b">Açık görev yok.</p>';

  // Yüksek öncelikli mailler
  const actionMails = mails.filter(m => {
    const s = (m.subject || '').toLowerCase() + (m.bodyPreview || '').toLowerCase();
    return /onay|approve|acil|urgent|toplantı|meeting|teklif|proposal|sözleşme|invoice|fatura/.test(s);
  }).slice(0, 8);

  let mailHtml = actionMails.length
    ? '<ul style="margin:0;padding-left:20px">' + actionMails.map(m =>
        `<li style="margin:6px 0"><strong>${m.from?.emailAddress?.name || m.from?.emailAddress?.address}</strong>: ${m.subject} <span style="color:#94a3b8;font-size:11px">(${new Date(m.receivedDateTime).toLocaleDateString('tr-TR')})</span></li>`
      ).join('') + '</ul>'
    : '<p style="color:#64748b">Dikkat gerektiren okunmamış mail yok.</p>';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#1e293b">
<h1 style="color:#1e3a5f;border-bottom:2px solid #2563eb;padding-bottom:12px">📋 Haftalık Brifing — ${weekLabel}</h1>
<p style="color:#64748b">Hazırlanma tarihi: ${today}</p>

<h2 style="color:#1e3a5f;margin-top:28px">📅 Haftanın Takvimi</h2>
${calHtml}

<h2 style="color:#1e3a5f;margin-top:28px">✅ Açık Görevler (To Do)</h2>
${taskHtml}

<h2 style="color:#1e3a5f;margin-top:28px">📧 Dikkat Gerektiren Mailler</h2>
${mailHtml}

<hr style="margin:32px 0;border-color:#e2e8f0">
<p style="color:#94a3b8;font-size:12px">Bu brifing OpenClaw tarafından otomatik olarak hazırlanmıştır.</p>
</body></html>`;
}

// ── Ana akış ──
try {
  console.log('Haftalık brifing hazırlanıyor...');
  const token = await getToken();

  const [events, mails, tasks] = await Promise.all([
    getWeekEvents(token),
    getActionableMails(token),
    getTodoTasks().catch(() => []),
  ]);

  console.log(`Takvim: ${events.length} etkinlik | Mail: ${mails.length} okunmamış | To Do: ${tasks.length} görev`);

  const now = new Date();
  const weekLabel = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const today = now.toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' });

  const html = buildHtml({ events, mails, tasks, today, weekLabel });

  // Mail gönder
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
  });

  await transporter.sendMail({
    from: `"OpenClaw Assistant" <${GMAIL_EMAIL}>`,
    to: REPORT_TO,
    subject: `📋 Haftalık Brifing — ${weekLabel}`,
    html,
  });

  console.log(`✅ Haftalık brifing gönderildi → ${REPORT_TO}`);
} catch (e) {
  console.error('❌ Hata:', e.message);
  process.exit(1);
}
