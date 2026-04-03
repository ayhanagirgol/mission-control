#!/usr/bin/env node
// Türkkep mailboxında "güvenlik bildirimi" konulu mailleri bul ve sil

const https = require('https');
const querystring = require('querystring');

const CLIENT_ID = 'c0babc68-dd56-4982-8f7c-435203f73c80';
const TENANT_ID = '059adf35-102b-4384-9263-fdccb7b53e1a';
const CLIENT_SECRET = 'C5c8Q~ceeY5ButYlz4oVx7V2t~nfT6cWOMS.cbWI';
const MAILBOX = 'ayhan.agirgol@turkkep.com.tr';

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getToken() {
  const body = querystring.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  });

  const res = await httpsRequest({
    hostname: 'login.microsoftonline.com',
    path: `/${TENANT_ID}/oauth2/v2.0/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  const data = JSON.parse(res.body);
  if (!data.access_token) throw new Error('Token alınamadı: ' + JSON.stringify(data));
  return data.access_token;
}

async function getMessages(token) {
  // Try with $search first (OData search on subject)
  const searchTerm = encodeURIComponent('"güvenlik bildirimi"');
  const path = `/v1.0/users/${encodeURIComponent(MAILBOX)}/messages?$search=${searchTerm}&$select=id,subject,receivedDateTime&$top=50`;
  
  const res = await httpsRequest({
    hostname: 'graph.microsoft.com',
    path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ConsistencyLevel': 'eventual'
    }
  });

  const data = JSON.parse(res.body);
  if (data.error) {
    console.error('Search error:', JSON.stringify(data.error));
    // Fallback: try $filter
    return await getMessagesFilter(token);
  }
  
  let messages = data.value || [];
  
  // Filter to only subject matches (search might return body matches too)
  messages = messages.filter(m => 
    m.subject && m.subject.toLowerCase().includes('güvenlik bildirimi')
  );
  
  return messages;
}

async function getMessagesFilter(token) {
  // Use $filter with contains on subject
  const filterStr = encodeURIComponent("contains(tolower(subject),'güvenlik bildirimi')");
  const path = `/v1.0/users/${encodeURIComponent(MAILBOX)}/messages?$filter=${filterStr}&$select=id,subject,receivedDateTime&$top=50`;
  
  const res = await httpsRequest({
    hostname: 'graph.microsoft.com',
    path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ConsistencyLevel': 'eventual'
    }
  });

  const data = JSON.parse(res.body);
  if (data.error) {
    console.error('Filter error:', JSON.stringify(data.error));
    return [];
  }
  return data.value || [];
}

async function deleteMessage(token, messageId) {
  const path = `/v1.0/users/${encodeURIComponent(MAILBOX)}/messages/${messageId}`;
  
  const res = await httpsRequest({
    hostname: 'graph.microsoft.com',
    path,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return res.status === 204;
}

async function main() {
  console.log('=== Türkkep Güvenlik Bildirimi Mail Silici ===\n');
  
  console.log('1. Token alınıyor...');
  const token = await getToken();
  console.log('   ✓ Token alındı\n');

  console.log('2. "güvenlik bildirimi" konulu mailler aranıyor...');
  const messages = await getMessages(token);
  console.log(`   ✓ ${messages.length} mail bulundu\n`);

  if (messages.length === 0) {
    console.log('Silinecek mail yok. İşlem tamamlandı.');
    return;
  }

  console.log('Bulunan mailler:');
  messages.forEach((m, i) => {
    console.log(`  ${i+1}. [${m.receivedDateTime}] ${m.subject}`);
  });
  console.log();

  console.log('3. Mailler siliniyor...');
  let deleted = 0;
  let failed = 0;

  for (const msg of messages) {
    const ok = await deleteMessage(token, msg.id);
    if (ok) {
      console.log(`   ✓ Silindi: ${msg.subject}`);
      deleted++;
    } else {
      console.log(`   ✗ Silinemedi: ${msg.subject}`);
      failed++;
    }
  }

  console.log(`\n=== SONUÇ ===`);
  console.log(`Bulunan: ${messages.length} mail`);
  console.log(`Silinen: ${deleted} mail`);
  if (failed > 0) console.log(`Başarısız: ${failed} mail`);
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
