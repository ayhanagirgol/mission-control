#!/usr/bin/env node
/**
 * Microsoft Graph To Do helper (delegated auth via device code flow).
 *
 * To Do API only supports delegated permissions — client credentials won't work.
 * This script uses device code flow for initial auth, then persists a refresh token.
 *
 * Required Azure/Entra app setup:
 *   1. Same app registration (MS_CLIENT_ID) or a new one
 *   2. Add delegated permission: Tasks.ReadWrite
 *   3. Enable "Allow public client flows" in Authentication settings
 *   4. Admin consent for Tasks.ReadWrite (delegated)
 *
 * Env vars (from .env):
 *   MS_CLIENT_ID, MS_TENANT_ID
 *   (MS_CLIENT_SECRET is NOT used for device code flow)
 *
 * Usage:
 *   node ms_graph_todo.mjs login          # One-time device code auth
 *   node ms_graph_todo.mjs lists          # List all To Do lists
 *   node ms_graph_todo.mjs tasks [listId] # List tasks (default: first list or "Tasks")
 *   node ms_graph_todo.mjs add "title" [listId] [--due YYYY-MM-DD]
 *   node ms_graph_todo.mjs complete <taskId> [listId]
 *   node ms_graph_todo.mjs search "query"
 */

import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE = process.cwd();
const TOKEN_FILE = path.join(WORKSPACE, '.todo_tokens.json');
const SCOPES = 'Tasks.ReadWrite Tasks.Read offline_access';

// ─── .env loader ───
function loadDotEnv(p) {
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2] ?? '';
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadDotEnv(path.join(WORKSPACE, '.env'));

const CLIENT_ID = process.env.MS_CLIENT_ID;
const TENANT_ID = process.env.MS_TENANT_ID;

if (!CLIENT_ID || !TENANT_ID) {
  console.error('Missing MS_CLIENT_ID or MS_TENANT_ID in .env');
  process.exit(2);
}

// ─── Token persistence ───
function loadTokens() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf8');
}

// ─── Device Code Flow ───
async function deviceCodeLogin() {
  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/devicecode`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, scope: SCOPES }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Device code request failed:', JSON.stringify(data));
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 Microsoft To Do - Cihaz Kodu ile Giriş');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n1. Şu adrese git: ${data.verification_uri}`);
  console.log(`2. Bu kodu gir: ${data.user_code}`);
  console.log(`\n${data.message}\n`);

  // Poll for token
  const interval = (data.interval || 5) * 1000;
  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  while (true) {
    await new Promise(r => setTimeout(r, interval));
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: data.device_code,
      }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.access_token) {
      const tokens = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: Date.now() + (tokenData.expires_in || 3600) * 1000,
      };
      saveTokens(tokens);
      console.log('✅ Giriş başarılı! Token kaydedildi.');
      return tokens;
    }

    if (tokenData.error === 'authorization_pending') continue;
    if (tokenData.error === 'slow_down') {
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }
    if (tokenData.error === 'expired_token') {
      console.error('⏰ Süre doldu, tekrar deneyin: node ms_graph_todo.mjs login');
      process.exit(1);
    }
    console.error('Token polling error:', JSON.stringify(tokenData));
    process.exit(1);
  }
}

// ─── Refresh Token ───
async function refreshAccessToken(refreshToken) {
  const url = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: SCOPES,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Refresh failed: ${JSON.stringify(data.error_description || data.error || data)}`);
  }
  const tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  };
  saveTokens(tokens);
  return tokens;
}

// ─── Get valid access token ───
async function getAccessToken() {
  let tokens = loadTokens();
  if (!tokens || !tokens.refresh_token) {
    console.error('Henüz giriş yapılmamış. Önce çalıştır: node ms_graph_todo.mjs login');
    process.exit(1);
  }
  // Refresh if expired or about to expire (5 min buffer)
  if (!tokens.access_token || Date.now() > (tokens.expires_at || 0) - 300_000) {
    tokens = await refreshAccessToken(tokens.refresh_token);
  }
  return tokens.access_token;
}

// ─── Graph helper ───
async function graphGet(token, urlPath) {
  const url = urlPath.startsWith('http') ? urlPath : `https://graph.microsoft.com/v1.0${urlPath}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) throw new Error(`Graph ${res.status}: ${json?.error?.message || text.slice(0, 300)}`);
  return json;
}

async function graphPost(token, urlPath, body) {
  const url = urlPath.startsWith('http') ? urlPath : `https://graph.microsoft.com/v1.0${urlPath}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) throw new Error(`Graph ${res.status}: ${json?.error?.message || text.slice(0, 300)}`);
  return json;
}

async function graphPatch(token, urlPath, body) {
  const url = urlPath.startsWith('http') ? urlPath : `https://graph.microsoft.com/v1.0${urlPath}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) throw new Error(`Graph ${res.status}: ${json?.error?.message || text.slice(0, 300)}`);
  return json;
}

// ─── To Do operations ───

async function listTodoLists(token) {
  const data = await graphGet(token, '/me/todo/lists');
  return data.value || [];
}

async function getDefaultListId(token) {
  const lists = await listTodoLists(token);
  // Prefer "Tasks" or "Görevler" (Turkish) or first list
  const defaultList = lists.find(l => l.wellknownListName === 'defaultList') ||
                      lists.find(l => /^(tasks|görevler)$/i.test(l.displayName)) ||
                      lists[0];
  return defaultList?.id;
}

async function listTasks(token, listId, filter) {
  let url = `/me/todo/lists/${listId}/tasks?$orderby=createdDateTime desc&$top=50`;
  if (filter) url += `&$filter=${encodeURIComponent(filter)}`;
  const data = await graphGet(token, url);
  return data.value || [];
}

async function addTask(token, listId, title, dueDate) {
  const body = { title };
  if (dueDate) {
    body.dueDateTime = {
      dateTime: `${dueDate}T00:00:00`,
      timeZone: 'Europe/Istanbul',
    };
  }
  return graphPost(token, `/me/todo/lists/${listId}/tasks`, body);
}

async function completeTask(token, listId, taskId) {
  return graphPatch(token, `/me/todo/lists/${listId}/tasks/${taskId}`, {
    status: 'completed',
    completedDateTime: {
      dateTime: new Date().toISOString(),
      timeZone: 'Europe/Istanbul',
    },
  });
}

async function searchTasks(token, query) {
  const lists = await listTodoLists(token);
  const results = [];
  for (const list of lists) {
    const tasks = await listTasks(token, list.id);
    for (const task of tasks) {
      if (task.title?.toLowerCase().includes(query.toLowerCase()) ||
          task.body?.content?.toLowerCase().includes(query.toLowerCase())) {
        results.push({ ...task, listName: list.displayName, listId: list.id });
      }
    }
  }
  return results;
}

// ─── CLI ───
const [,, cmd, ...args] = process.argv;

try {
  switch (cmd) {
    case 'login': {
      await deviceCodeLogin();
      break;
    }

    case 'lists': {
      const token = await getAccessToken();
      const lists = await listTodoLists(token);
      console.log(`\n📋 To Do Listeleri (${lists.length}):\n`);
      for (const l of lists) {
        const isDefault = l.wellknownListName === 'defaultList' ? ' ⭐' : '';
        console.log(`  ${l.displayName}${isDefault}`);
        console.log(`    ID: ${l.id}`);
      }
      break;
    }

    case 'tasks': {
      const token = await getAccessToken();
      const listId = args[0] || await getDefaultListId(token);
      if (!listId) { console.error('Liste bulunamadı.'); process.exit(1); }
      const tasks = await listTasks(token, listId);
      const pending = tasks.filter(t => t.status !== 'completed');
      const completed = tasks.filter(t => t.status === 'completed');
      console.log(`\n📝 Görevler (${pending.length} aktif, ${completed.length} tamamlanmış):\n`);
      for (const t of pending) {
        const due = t.dueDateTime ? ` 📅 ${t.dueDateTime.dateTime.split('T')[0]}` : '';
        const importance = t.importance === 'high' ? ' 🔴' : t.importance === 'low' ? ' 🔵' : '';
        console.log(`  ☐ ${t.title}${due}${importance}`);
        console.log(`    ID: ${t.id}`);
      }
      if (completed.length > 0) {
        console.log(`\n  ── Tamamlanan (son ${Math.min(5, completed.length)}) ──`);
        for (const t of completed.slice(0, 5)) {
          console.log(`  ☑ ${t.title}`);
        }
      }
      break;
    }

    case 'add': {
      const title = args[0];
      if (!title) { console.error('Kullanım: node ms_graph_todo.mjs add "görev başlığı" [listId] [--due YYYY-MM-DD]'); process.exit(1); }
      const dueIdx = args.indexOf('--due');
      const dueDate = dueIdx >= 0 ? args[dueIdx + 1] : null;
      const listIdArg = args[1] && !args[1].startsWith('--') ? args[1] : null;
      const token = await getAccessToken();
      const listId = listIdArg || await getDefaultListId(token);
      const task = await addTask(token, listId, title, dueDate);
      console.log(`✅ Görev eklendi: "${task.title}"`);
      if (dueDate) console.log(`   📅 Son tarih: ${dueDate}`);
      console.log(`   ID: ${task.id}`);
      break;
    }

    case 'complete': {
      const taskId = args[0];
      if (!taskId) { console.error('Kullanım: node ms_graph_todo.mjs complete <taskId> [listId]'); process.exit(1); }
      const token = await getAccessToken();
      const listId = args[1] || await getDefaultListId(token);
      await completeTask(token, listId, taskId);
      console.log('✅ Görev tamamlandı olarak işaretlendi.');
      break;
    }

    case 'search': {
      const query = args[0];
      if (!query) { console.error('Kullanım: node ms_graph_todo.mjs search "arama"'); process.exit(1); }
      const token = await getAccessToken();
      const results = await searchTasks(token, query);
      console.log(`\n🔍 Arama: "${query}" (${results.length} sonuç)\n`);
      for (const t of results) {
        const status = t.status === 'completed' ? '☑' : '☐';
        console.log(`  ${status} ${t.title} [${t.listName}]`);
      }
      break;
    }

    default: {
      console.log(`
Microsoft Graph To Do CLI
═════════════════════════

Komutlar:
  login              Cihaz kodu ile giriş yap (bir kere yeterli)
  lists              Tüm To Do listelerini göster
  tasks [listId]     Görevleri listele (varsayılan: ana liste)
  add "başlık" [listId] [--due YYYY-MM-DD]
                     Yeni görev ekle
  complete <taskId> [listId]
                     Görevi tamamla
  search "sorgu"     Görevlerde ara

İlk kullanım:
  1. Azure/Entra'da uygulama ayarlarında "Allow public client flows" açık olmalı
  2. Tasks.ReadWrite delegated permission eklenmiş olmalı
  3. node ms_graph_todo.mjs login
  4. Tarayıcıda kodu gir, onay ver
  5. Artık diğer komutları kullanabilirsin
`);
    }
  }
} catch (e) {
  console.error(`❌ Hata: ${e.message}`);
  process.exit(1);
}
