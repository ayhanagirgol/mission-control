/**
 * hisse_tracker.mjs
 * BIST hisse senedi günlük takip scripti
 * Yahoo Finance API üzerinden fiyat çeker
 * Günlük >%2 hareket → WhatsApp bildirimi
 * 
 * Cron: Hafta içi 18:30 (borsa kapanış sonrası) + 11:00 (gün içi)
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

const PORTFOY_PATH = '/Users/baykus/.openclaw/workspace/data/portfoy.json';
const CSV_PATH = '/Users/baykus/.openclaw/workspace/data/hisse_takip.csv';
const STATE_PATH = '/Users/baykus/.openclaw/workspace/data/hisse_state.json';

const UYARI_ESIGI = 2.0; // %2 hareket eşiği

// Yahoo Finance'den hisse fiyatı çek
function fetchYahooPrice(symbol) {
  return new Promise((resolve) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
    const options = {
      hostname: 'query1.finance.yahoo.com',
      path: `/v8/finance/chart/${symbol}?interval=1d&range=2d`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = json.chart?.result?.[0];
          if (!result) return resolve(null);

          const meta = result.meta;
          const currentPrice = meta.regularMarketPrice;
          const prevClose = meta.previousClose || meta.chartPreviousClose;
          const changePercent = prevClose ? ((currentPrice - prevClose) / prevClose * 100) : 0;
          const currency = meta.currency || 'TRY';

          resolve({
            symbol,
            price: currentPrice,
            prevClose,
            changePercent: parseFloat(changePercent.toFixed(2)),
            currency,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          console.error(`${symbol} parse hatası:`, e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error(`${symbol} fetch hatası:`, e.message);
      resolve(null);
    });
  });
}

function loadPortfoy() {
  const raw = fs.readFileSync(PORTFOY_PATH, 'utf8');
  return JSON.parse(raw);
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return { son_bildirim: {} };
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function saveToCSV(results) {
  const today = new Date().toISOString().slice(0, 10);
  const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'Tarih,Saat,Sembol,Ad,Fiyat (TRY),Günlük %,Hedef Fiyat,Mod\n');
  }

  const portfoy = loadPortfoy();
  const hisseler = portfoy.hisseler || [];

  for (const r of results) {
    if (!r) continue;
    const hisse = hisseler.find(h => h.sembol === r.symbol);
    const ad = hisse?.ad || r.symbol;
    const hedef = hisse?.hedef_fiyat || '-';
    const mod = hisse?.mod || '-';

    const line = `${today},${time},${r.symbol},${ad},${r.price?.toFixed(2)},${r.changePercent},${hedef},${mod}\n`;
    fs.appendFileSync(CSV_PATH, line);
  }
}

function formatMessage(results, portfoy) {
  const hisseler = portfoy.hisseler || [];
  const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul' });
  const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

  let msg = `📊 *Hisse Günlük Rapor* — ${today} ${time}\n\n`;

  for (const r of results) {
    if (!r) continue;
    const hisse = hisseler.find(h => h.sembol === r.symbol);
    const ad = hisse?.ad || r.symbol;
    const hedef = hisse?.hedef_fiyat ? `🎯 Hedef: ${hisse.hedef_fiyat} TRY` : '📌 Hedef: belirlenmedi';
    const trend = r.changePercent > 0 ? '🟢' : r.changePercent < 0 ? '🔴' : '⚪';
    const sign = r.changePercent > 0 ? '+' : '';

    msg += `${trend} *${r.symbol.replace('.IS', '')}* — ${ad}\n`;
    msg += `   Fiyat: ${r.price?.toFixed(2)} TRY\n`;
    msg += `   Günlük: ${sign}${r.changePercent}%\n`;
    msg += `   ${hedef}\n\n`;
  }

  return msg.trim();
}

function formatAlertMessage(r, hisse) {
  const ad = hisse?.ad || r.symbol;
  const sign = r.changePercent > 0 ? '+' : '';
  const emoji = r.changePercent > 0 ? '🚀' : '⚠️';

  return `${emoji} *Önemli Hisse Hareketi!*\n\n` +
    `*${r.symbol.replace('.IS', '')}* — ${ad}\n` +
    `Fiyat: ${r.price?.toFixed(2)} TRY\n` +
    `Günlük Değişim: ${sign}${r.changePercent}%\n` +
    `_(Eşik: >%${UYARI_ESIGI})_`;
}

async function main() {
  const portfoy = loadPortfoy();
  const hisseler = portfoy.hisseler || [];

  if (hisseler.length === 0) {
    console.log('Takip edilecek hisse yok.');
    return;
  }

  console.log(`⏳ ${hisseler.length} hisse takip ediliyor...`);

  const results = await Promise.all(
    hisseler.map(h => fetchYahooPrice(h.sembol))
  );

  // CSV'ye kaydet
  saveToCSV(results);

  // State yükle
  const state = loadState();
  const today = new Date().toISOString().slice(0, 10);
  const alerts = [];

  for (const r of results) {
    if (!r) continue;
    const hisse = hisseler.find(h => h.sembol === r.symbol);
    const absChange = Math.abs(r.changePercent);

    // >%2 hareket ve bugün henüz bildirim gönderilmediyse
    if (absChange >= UYARI_ESIGI) {
      const lastNotif = state.son_bildirim?.[r.symbol];
      if (lastNotif !== today) {
        alerts.push({ r, hisse });
        state.son_bildirim = state.son_bildirim || {};
        state.son_bildirim[r.symbol] = today;
      }
    }
  }

  saveState(state);

  // Günlük özet çıktısı
  const summary = formatMessage(results, portfoy);
  console.log(summary);

  // Uyarılar varsa WhatsApp'a gönder
  if (alerts.length > 0) {
    console.log(`\n🔔 ${alerts.length} uyarı gönderilecek...`);
    for (const { r, hisse } of alerts) {
      const alertMsg = formatAlertMessage(r, hisse);
      console.log(`WHATSAPP_ALERT: ${alertMsg}`);
    }
  }
}

main().catch(console.error);
