import fs from 'fs';
import { execSync } from 'child_process';
import https from 'https';

const STATE_FILE = '/Users/baykus/.openclaw/workspace/memory/last_cihat_video.txt';

const fetchXML = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

async function check() {
  const xml = await fetchXML('https://www.youtube.com/feeds/videos.xml?channel_id=UCHExW8VqaE0a3W0kwSe_BXg');
  
  const entryRegex = /<entry>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link rel="alternate" href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"/g;
  
  let match = entryRegex.exec(xml);
  if (!match) return; // No entry found
  
  const latestTitle = match[1];
  const latestUrl = match[2];

  let lastSeen = '';
  if (fs.existsSync(STATE_FILE)) {
    lastSeen = fs.readFileSync(STATE_FILE, 'utf8').trim();
  }

  // Debug için ilk seferde çalıştığını göstermek adına dosyaya mevcut videoyu yazalım 
  // ama eğer dosya yoksa yine de bildirimi atalım diyeceğiz, 
  // KULLANICI hemen bildirim almak istemeyebilir ama "yeni videolara abone ol" dedi.
  // İlerideki yeni videoları atması daha mantıklı. İlk çalışmada son videoyu State olarak kaydedelim.
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, latestUrl);
    console.log(`✅ Cihat E. Çiçek kanal takibi başlatıldı. En son video hafızaya alındı:\n${latestTitle}`);
    return;
  }

  if (latestUrl === lastSeen) {
    return; // Yeni video yok
  }

  try {
    const summary = execSync(`gemini "Şu videoyu finansal etkileri açısından 3-4 maddede özetle: ${latestUrl}"`, { encoding: 'utf8' });
    fs.writeFileSync(STATE_FILE, latestUrl);
    console.log(`🚨 *Cihat E. Çiçek'ten Yeni Video!*\n\n*Başlık:* ${latestTitle}\n*Link:* ${latestUrl}\n\n🤖 *Gemini Özeti:*\n${summary.trim()}`);
  } catch (err) {
    fs.writeFileSync(STATE_FILE, latestUrl);
    console.log(`🚨 *Cihat E. Çiçek'ten Yeni Video!*\n\n*Başlık:* ${latestTitle}\n*Link:* ${latestUrl}\n\n(Not: Gemini API kotası/yoğunluğu nedeniyle otomatik özet alınamadı.)`);
  }
}

check();
