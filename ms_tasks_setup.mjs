/**
 * Microsoft Tasks kurulumu
 * - Finhouse ve Türkkep listeleri oluştur
 * - Mevcut actionable mailleri task olarak ekle
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

const FH_CLIENT_ID = process.env.MS_CLIENT_ID;
const FH_TENANT_ID = process.env.MS_TENANT_ID;
const FH_CLIENT_SECRET = process.env.MS_CLIENT_SECRET;
const FH_MAILBOX = 'ayhan.agirgol@finhouse.com.tr';

const TK_CLIENT_ID = process.env.TURKKEP_MS_CLIENT_ID;
const TK_TENANT_ID = process.env.TURKKEP_MS_TENANT_ID;
const TK_CLIENT_SECRET = process.env.TURKKEP_MS_CLIENT_SECRET;
const TK_MAILBOX = process.env.TURKKEP_MAILBOX_UPN;

async function getToken(clientId, tenantId, clientSecret) {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Token: ${j.error}`);
  return j.access_token;
}

async function graph(token, url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts.headers||{}) } });
  const text = await res.text();
  const j = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Graph ${res.status}: ${JSON.stringify(j?.error)}`);
  return j;
}

const fhToken = await getToken(FH_CLIENT_ID, FH_TENANT_ID, FH_CLIENT_SECRET);
const tkToken = await getToken(TK_CLIENT_ID, TK_TENANT_ID, TK_CLIENT_SECRET);

// ── Mevcut listeleri al veya oluştur ────────────────────────────────────────
async function getOrCreateList(token, mailbox, name) {
  const res = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/todo/lists`);
  const existing = (res.value||[]).find(l => l.displayName === name);
  if (existing) { console.log(`  Liste mevcut: ${name}`); return existing; }
  const created = await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/todo/lists`, {
    method: 'POST', body: JSON.stringify({ displayName: name }),
  });
  console.log(`  Liste oluşturuldu: ${name}`);
  return created;
}

async function addTask(token, mailbox, listId, title, body = '', dueDate = null) {
  const payload = {
    title,
    body: { content: body, contentType: 'text' },
    importance: 'normal',
    status: 'notStarted',
  };
  if (dueDate) {
    payload.dueDateTime = { dateTime: dueDate, timeZone: 'Turkey Standard Time' };
  }
  await graph(token, `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/todo/lists/${listId}/tasks`, {
    method: 'POST', body: JSON.stringify(payload),
  });
}

// ── Finhouse listesi ─────────────────────────────────────────────────────────
console.log('\n[1] Finhouse Tasks listesi kuruluyor...');
const fhList = await getOrCreateList(fhToken, FH_MAILBOX, 'Finhouse');

console.log('\n[2] Finhouse actionable tasklar ekleniyor...');
const fhTasks = [
  { title: 'Burgan Bank - Çek görüntüsü teknik sorusuna yanıt ver (Aytekin Çelebi)', body: 'Video yöntemi ile çek ön/arka yüz ilişkisi ve ciranta VKN/TCKN işleme konusunda teknik açıklama isteniyor.', due: '2026-03-23T17:00:00' },
  { title: 'Enlighty AI - Bankacılık mail örneği gönder (Hülya Dundar)', body: 'Odea Bank için bankacılık sektörüne yönelik mail örneği talep etti.', due: '2026-03-23T17:00:00' },
  { title: 'SPL Group - Bosporus Lojistik teslimat takibi (PI-2026-003)', body: 'Paul Walker ile hafta başı teslim alım ayarlanacak. Ekber takip ediyor.', due: '2026-03-23T10:00:00' },
  { title: 'Salim Büge (Dokuz.io) - Bulutistan görüşmesi', body: '26 Mart Perşembe 10:00 Bulutistan Kampüsü. Finans sektörü işbirliği.', due: '2026-03-26T10:00:00' },
  { title: 'HR Interview - Google Meet', body: '23 Mart Pazartesi 17:30-18:00. Calendly linki üzerinden katıl.', due: '2026-03-23T17:30:00' },
];

for (const t of fhTasks) {
  await addTask(fhToken, FH_MAILBOX, fhList.id, t.title, t.body, t.due);
  console.log(`  ✅ ${t.title.slice(0, 60)}`);
}

// ── Türkkep listesi ──────────────────────────────────────────────────────────
console.log('\n[3] Türkkep Tasks listesi kuruluyor...');
const tkList = await getOrCreateList(tkToken, TK_MAILBOX, 'Türkkep');

console.log('\n[4] Türkkep actionable tasklar ekleniyor...');
const tkTasks = [
  { title: 'PYO Projeler İlerleme Raporu (09-19 Mart) incelenmeli', body: 'Aykut Kutlusan\'dan gelen 3 Ar-Ge, 11 şirket içi proje raporu.', due: '2026-03-20T17:00:00' },
  { title: 'MutluCell e-İmza Entegrasyonu - API dokümantasyonu gönderilecek', body: 'Cevdet Öztürk API dokümanı talep etti. Zeliha Hanım üzerinden takip.', due: '2026-03-20T17:00:00' },
  { title: 'Callie toplantısı - PoC bilgileri ve güncel teklif (Sırma Eren)', body: 'Sırma Eren güncellenmiş teklifi Cuma\'ya kadar gönderecek. PoC için soru seti hazırlanacak.', due: '2026-03-27T17:00:00' },
  { title: 'Netlore Sızma Testi - DDoS güncelleme takibi', body: 'Alkım Coşkun sosyal mühendislik testini başlattı. DDoS konusunda güncelleme bekleniyor.', due: '2026-03-23T17:00:00' },
  { title: 'Datassist Proje Kapanış Toplantısı - Çarşamba 16:00', body: 'Zeynep Oran toplantı davetini iletecek. Yarım saatlik kapanış toplantısı.', due: '2026-03-25T16:00:00' },
  { title: 'MailboxSettings.ReadWrite izni - Azure admin onayı bekleniyor', body: 'Türkkep Azure uygulamasına MailboxSettings.ReadWrite izni eklenmesi gerekiyor. Gelen kutu kuralları için.', due: '2026-03-25T17:00:00' },
];

for (const t of tkTasks) {
  await addTask(tkToken, TK_MAILBOX, tkList.id, t.title, t.body, t.due);
  console.log(`  ✅ ${t.title.slice(0, 60)}`);
}

console.log('\n=== TAMAMLANDI ===');
console.log(`Finhouse Tasks → ${fhTasks.length} task eklendi`);
console.log(`Türkkep Tasks  → ${tkTasks.length} task eklendi`);
console.log('\nMicrosoft To Do / Agent uygulamasında görüntüleyebilirsiniz.');
