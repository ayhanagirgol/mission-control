#!/usr/bin/env node
import { execSync } from 'node:child_process';

const START_DATE = new Date('2026-01-01T00:00:00Z');
const FROM_PATTERNS = [
  '@trugo',
  'trugo.com',
  '@zes',
  'zes.net',
  'zes.com',
  '@esarj',
  'esarj.com',
  'esarj.com.tr',
  'eşarj',
  'e-şarj',
];
const PAGE_SIZE = 50;
const MAX_PAGES = 200;
const TARGET_FOLDER = 'Elektrikli Araç Ödemeleri';
const SOURCE_FOLDERS = ['INBOX', '[Gmail]/Tüm Postalar', '[Gmail]/All Mail'];

function run(cmd) {
  const output = execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, HIMALAYA_PAGER: 'cat' },
  });
  return output.trim();
}

function fetchPage(folder, page) {
  console.error(`Scanning ${folder} page ${page}`);
  const cmd = `himalaya --quiet envelope list --folder "${folder}" --output json --page ${page} --page-size ${PAGE_SIZE}`;
  const raw = run(cmd);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse JSON for folder', folder, 'page', page);
    console.error(raw);
    throw err;
  }
}

function normalizeDate(value) {
  if (!value) return null;
  const idx = value.indexOf(' ');
  if (idx === -1) return new Date(value);
  const normalized = value.replace(' ', 'T');
  return new Date(normalized);
}

function matchesSender(address) {
  const lower = (address || '').toLowerCase();
  return FROM_PATTERNS.some(pattern => lower.includes(pattern));
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

const allMatches = [];
const folderStats = [];

for (const folder of SOURCE_FOLDERS) {
  let scanned = 0;
  let stop = false;
  for (let page = 1; page <= MAX_PAGES && !stop; page++) {
    const items = fetchPage(folder, page);
    if (!items.length) break;
    scanned += items.length;
    let pageHasOlder = false;
    for (const item of items) {
      const date = normalizeDate(item.date);
      if (date && date < START_DATE) {
        pageHasOlder = true;
        break;
      }
      if (date && date >= START_DATE && matchesSender(item.from?.addr)) {
        allMatches.push({
          id: item.id,
          date: date.toISOString(),
          from: item.from?.addr || '',
          subject: item.subject || '',
          folder,
        });
      }
    }
    if (pageHasOlder) {
      stop = true;
    }
  }
  folderStats.push({ folder, scanned });
}

if (allMatches.length) {
  const byFolder = new Map();
  for (const match of allMatches) {
    if (!byFolder.has(match.folder)) byFolder.set(match.folder, []);
    byFolder.get(match.folder).push(match.id);
  }
  for (const [folder, ids] of byFolder.entries()) {
    const chunks = chunk(ids, 10);
    for (const chunkIds of chunks) {
      const cmd = `himalaya --quiet message move "${TARGET_FOLDER}" ${chunkIds.join(' ')} -f "${folder}"`;
      run(cmd);
    }
  }
}

console.log(JSON.stringify({ folderStats, matches: allMatches }, null, 2));
