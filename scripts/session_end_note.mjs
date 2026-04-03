#!/usr/bin/env node
/**
 * Session Bitiş Notu — Her önemli konuşmanın sonunda çalıştırılır.
 * Son N saatin önemli olaylarını günlük memory dosyasına yazar.
 * 
 * Kullanım: node scripts/session_end_note.mjs [--summary "özet metin"]
 */

import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/baykus/.openclaw/workspace';

function getTodayFile() {
  const now = new Date();
  const tz = 'Europe/Istanbul';
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: tz }).format(now);
  const memDir = path.join(WORKSPACE, 'memory');
  if (!fs.existsSync(memDir)) fs.mkdirSync(memDir, { recursive: true });
  return path.join(memDir, `${date}.md`);
}

function appendToDaily(content) {
  const file = getTodayFile();
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const timestamp = new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
  const entry = `\n## Session Notu — ${timestamp}\n${content}\n`;
  fs.writeFileSync(file, existing + entry, 'utf8');
  console.log(`✅ Session notu kaydedildi: ${file}`);
}

const args = process.argv.slice(2);
const summaryIdx = args.indexOf('--summary');
const summary = summaryIdx !== -1 ? args[summaryIdx + 1] : null;

if (summary) {
  appendToDaily(summary);
} else {
  console.log('Kullanım: node session_end_note.mjs --summary "konuşma özeti"');
}
