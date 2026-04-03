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

const outDir = '/Users/baykus/.openclaw/workspace/tmp/finhouse-nevruz';
fs.mkdirSync(outDir, { recursive: true });

console.log('Görsel oluşturuluyor...');

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-image-1',
    prompt: 'Professional corporate holiday greeting banner for Finhouse, a Turkish fintech and AI company. Spring Nevruz / Nowruz celebration. Modern elegant design, soft spring palette (gold, teal, white, light green). Abstract flowing lines suggesting financial data and nature growth. Cherry blossoms and tulips subtly integrated. Clean minimalist corporate style. No text. Landscape format.',
    n: 1,
    size: '1536x1024',
    quality: 'high',
    output_format: 'png',
  })
});

const j = await res.json();
if (!res.ok) throw new Error(`API hatası: ${JSON.stringify(j.error)}`);

const b64 = j.data?.[0]?.b64_json;
if (!b64) throw new Error('b64_json boş geldi: ' + JSON.stringify(j));

const outPath = path.join(outDir, 'nevruz_banner.png');
fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
console.log(`✅ Görsel kaydedildi: ${outPath}`);
