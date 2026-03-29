import fs from 'fs';

// Load .env
for (const line of fs.readFileSync('./.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}

const mailboxType = arg('mailbox', 'turkkep');
let clientId, tenantId, clientSecret, mailboxUpn;

if (mailboxType === 'finhouse') {
  clientId = process.env.MS_CLIENT_ID;
  tenantId = process.env.MS_TENANT_ID;
  clientSecret = process.env.MS_CLIENT_SECRET;
  mailboxUpn = 'ayhan.agirgol@finhouse.com.tr';
} else {
  clientId = process.env.TURKKEP_MS_CLIENT_ID;
  tenantId = process.env.TURKKEP_MS_TENANT_ID;
  clientSecret = process.env.TURKKEP_MS_CLIENT_SECRET;
  mailboxUpn = process.env.TURKKEP_MAILBOX_UPN || 'ayhan.agirgol@turkkep.com.tr';
}

const query = arg('query', '');
const fromAddr = arg('from', '');
const limit = parseInt(arg('limit', '25'));
const output = arg('output', '');
const bodyFlag = args.includes('--body');

async function getToken() {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(j));
  return j.access_token;
}

async function graphGet(token, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Prefer: 'outlook.body-content-type="text"' } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Graph ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function getMailBody(token, mailId) {
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailboxUpn)}/messages/${mailId}?$select=body`;
  const res = await graphGet(token, url);
  return res.body?.content || '';
}

(async () => {
  const token = await getToken();

  // Use $search for combined from+subject search (no $orderby allowed with $search)
  let searchParts = [];
  if (fromAddr) searchParts.push(`from:${fromAddr}`);
  if (query) searchParts.push(query);
  const searchStr = searchParts.length ? `&$search="${searchParts.join(' ')}"` : '';

  const topN = Math.min(limit, 50);
  const selectFields = 'id,subject,from,receivedDateTime,bodyPreview,hasAttachments,importance';
  let url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailboxUpn)}/messages?$top=${topN}&$select=${selectFields}${searchStr}`;

  let all = [];
  while (url && all.length < limit) {
    const res = await graphGet(token, url);
    all.push(...(res.value || []));
    url = res['@odata.nextLink'] || null;
  }
  all = all.slice(0, limit);

  // Print summary
  for (const m of all) {
    const from = m.from?.emailAddress?.address || '?';
    const date = m.receivedDateTime?.substring(0, 16) || '?';
    console.log(`[${date}] ${from} — ${m.subject}`);
    if (m.bodyPreview) console.log(`  ${m.bodyPreview.substring(0, 300)}`);
    console.log('');
  }
  console.log(`Toplam: ${all.length} mail`);

  // Optionally fetch full body
  if (bodyFlag && all.length > 0) {
    for (let i = 0; i < all.length; i++) {
      all[i]._fullBody = await getMailBody(token, all[i].id);
    }
  }

  if (output) {
    await fs.promises.writeFile(output, JSON.stringify(all, null, 2));
    console.log(`Saved to ${output}`);
  }
})();
