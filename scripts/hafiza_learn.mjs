#!/usr/bin/env node
/**
 * Hafıza Agent — Sürekli Öğrenme Motoru
 * Tüm agent'lardan, memory dosyalarından ve proje notlarından öğrenir.
 * Kullanıcıyı ve işleri zamanla daha iyi tanır.
 */

import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/baykus/.openclaw/workspace';
const OUTPUT_FILE = path.join(WORKSPACE, 'hafiza_knowledge.md');
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'gemma3:4b';
const OLLAMA_TIMEOUT_MS = 90000; // 90 saniye

function readFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch (e) {}
  return '';
}

function readTruncated(filePath, maxChars = 2000) {
  const content = readFile(filePath);
  if (content.length > maxChars) return content.slice(0, maxChars) + '\n[...kısaltıldı]';
  return content;
}

function getRecentMemoryFiles(days = 7) {
  const memDir = path.join(WORKSPACE, 'memory');
  if (!fs.existsSync(memDir)) return [];
  return fs.readdirSync(memDir)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort().reverse().slice(0, days)
    .map(f => ({ name: f, content: readFile(path.join(memDir, f)) }));
}

function getAllKnowledgeSources() {
  const sources = {};

  // === KİŞİSEL HAFIZA ===
  sources['MEMORY.md'] = readTruncated(path.join(WORKSPACE, 'MEMORY.md'), 4000);
  sources['USER.md'] = readTruncated(path.join(WORKSPACE, 'USER.md'), 1500);

  // === AGENT KNOWLEDGE DOSYALARI ===
  const knowledgeFiles = [
    'bulut_knowledge.md',
    'orbina_knowledge.md',
    'coone_knowledge.md',
    'turkkep_satis_bayi_knowledge.md',
  ];
  for (const f of knowledgeFiles) {
    const content = readTruncated(path.join(WORKSPACE, f), 1500);
    if (content) sources[f] = content;
  }

  // === PİPELİNE & PROSPECT DOSYALARI ===
  const pipelineFiles = [
    'orbina_pipeline.md',
    'coone_pipeline.md',
    'orbina_prospects.md',
    'coone_prospects.md',
    'kep_todo.md',
  ];
  for (const f of pipelineFiles) {
    const content = readTruncated(path.join(WORKSPACE, f), 1000);
    if (content) sources[f] = content;
  }

  // === TURKKEP ÖZEL ===
  const turkkepFiles = [
    'turkkep_people.md',
    'turkkep_sector_intel.md',
    'turkkep_mobile_stats.md',
  ];
  for (const f of turkkepFiles) {
    const content = readTruncated(path.join(WORKSPACE, f), 1000);
    if (content) sources[f] = content;
  }

  // === SON 7 GÜNLÜK NOTLAR ===
  const recentFiles = getRecentMemoryFiles(7);
  for (const f of recentFiles) {
    if (f.content.trim()) {
      sources[`memory/${f.name}`] = f.content.slice(0, 1000);
    }
  }

  return sources;
}

async function analyzeWithOllama(prompt) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, prompt, stream: false }),
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = await res.json();
    return data.response || null;
  } catch (e) {
    if (e.name === 'AbortError') {
      console.log('⚠️ Ollama timeout — fallback moda geçiliyor');
    } else {
      console.log('⚠️ Ollama bağlantı hatası — fallback moda geçiliyor:', e.message);
    }
    return null;
  }
}

function buildFallbackSummary(sources) {
  // Mevcut hafiza_knowledge.md varsa koru, sadece güncelleme notu ekle
  const existing = readFile(OUTPUT_FILE);
  const memSections = sources['MEMORY.md']?.split(/^## /m).filter(s => s.trim()) || [];
  const sectionTitles = memSections.map(s => s.split('\n')[0]).filter(Boolean);

  const recentKeys = Object.keys(sources).filter(k => k.startsWith('memory/'));
  let recentSummary = '';
  for (const k of recentKeys.slice(0, 3)) {
    const lines = sources[k].split('\n').filter(l => l.trim() && !l.startsWith('#'));
    recentSummary += `\n**${k}:**\n${lines.slice(0, 4).join('\n')}\n`;
  }

  return `## Yapılandırılmış Özet (Fallback — Ollama yanıt vermedi)

### MEMORY.md Ana Başlıklar
${sectionTitles.map(t => `- ${t}`).join('\n')}

### Son Günlük Notlar
${recentSummary || 'Son notlarda içerik bulunamadı.'}

### Mevcut Agent Dosyaları
${Object.keys(sources).filter(k => k.includes('knowledge') || k.includes('pipeline')).map(k => `- ${k}`).join('\n')}
${existing ? '\n> Önceki Ollama analizi korundu (yukarıda).' : ''}
`;
}

async function main() {
  console.log('🧠 Hafıza Agent — Sürekli Öğrenme başlatıldı...');

  const sources = getAllKnowledgeSources();
  const sourceCount = Object.keys(sources).length;
  console.log(`📚 ${sourceCount} kaynak yüklendi`);

  // Kaynak metnini oluştur
  let sourceText = '';
  for (const [name, content] of Object.entries(sources)) {
    if (content && content.trim()) {
      sourceText += `\n\n=== ${name} ===\n${content}`;
    }
  }

  // Mevcut hafıza varsa — delta öğrenme: ne değişti?
  const existingKnowledge = readFile(OUTPUT_FILE);
  const deltaNote = existingKnowledge
    ? '\n\nÖnemli: Daha önce oluşturulmuş bir hafıza dosyası var. Önceki bilgileri koru, yeni öğrendiklerini ekle ve çelişkili/güncel olmayan bilgileri güncelle.'
    : '';

  const prompt = `Sen Ayhan Ağırgöl'ün kişisel AI asistanısın. Aşağıdaki tüm bilgileri analiz ederek kapsamlı ve kullanışlı bir hafıza özeti oluştur.

GÖREV: Şu başlıklarda Türkçe, özlü ve bilgi yoğun bir özet çıkar:

1. **Ayhan Hakkında** — Kim, ne iş yapıyor, rolleri, çalışma tarzı tercihleri
2. **Aktif İş Hatları** — Türkkep (CTO), Beyttürk danışmanlık, Finhouse/finhouse.ai, Orbina, Co-one
3. **Önemli Kişiler** — İsimler, roller, ilişkiler
4. **Açık Projeler & Görevler** — Pipeline'daki önemli işler, bekleyen kararlar
5. **Agent Ekosistemi** — Hangi agent ne biliyor, ne takip ediyor
6. **Öğrenilen Tercihler** — Çalışma şekli, araçlar, iletişim tercihleri
7. **Dikkat Edilecekler** — Riskler, takip edilmesi gereken konular${deltaNote}

KAYNAKLAR (${sourceCount} dosya):
${sourceText.slice(0, 8000)}`;

  console.log('🤖 Ollama analiz yapıyor...');
  let analysis = await analyzeWithOllama(prompt);
  let mode = `Ollama (${MODEL})`;

  if (!analysis) {
    analysis = buildFallbackSummary(sources);
    mode = 'Fallback (dosya bazlı)';
  }

  const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  const sourceList = Object.keys(sources).join(', ');

  const output = `# Hafıza Özeti — Ayhan Ağırgöl
> Son güncelleme: ${now}
> Mod: ${mode}
> Kaynak sayısı: ${sourceCount} dosya
> Kaynaklar: ${sourceList}

---

${analysis}
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  const lines = output.split('\n').length;
  const chars = output.length;
  console.log(`✅ hafiza_knowledge.md güncellendi — ${lines} satır / ${chars} karakter`);
  console.log(`📍 Mod: ${mode} | Kaynaklar: ${sourceCount} dosya`);
}

main().catch(e => {
  console.error('❌ Kritik hata:', e.message);
  process.exit(1);
});
