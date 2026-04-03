import fs from 'node:fs';
import path from 'node:path';

const dotenvPath = '/Users/baykus/.openclaw/workspace/.env';
for (const line of fs.readFileSync(dotenvPath, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let val = m[2] ?? '';
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = val;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY bulunamadı!');

const outDir = '/Users/baykus/.openclaw/workspace/tmp/finhouse-ramazan';
fs.mkdirSync(outDir, { recursive: true });

console.log('Ramazan Bayramı görseli oluşturuluyor...');

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-image-1',
    prompt: 'A friendly and cute AI robot with a warm glowing chest panel, smiling and offering a beautiful tray of colorful Turkish sweets and candies (lokum, baklava, chocolate). The robot is wearing a small crescent moon and star badge. Background is warm golden and purple tones with subtle crescent moons, stars and geometric Islamic patterns. Festive Eid al-Fitr / Ramazan Bayram celebration mood. Corporate yet warm and charming illustration style. No text.',
    n: 1,
    size: '1536x1024',
    quality: 'high',
    output_format: 'png',
  })
});

const j = await res.json();
if (!res.ok) throw new Error(`API hatası: ${JSON.stringify(j.error)}`);

const b64 = j.data?.[0]?.b64_json;
if (!b64) throw new Error('b64_json boş: ' + JSON.stringify(j));

const outPath = path.join(outDir, 'ramazan_banner.png');
fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
console.log(`✅ Görsel kaydedildi: ${outPath}`);
