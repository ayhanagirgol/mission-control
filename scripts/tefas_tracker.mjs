import https from 'https';
import fs from 'fs';
import path from 'path';

const CSV_PATH = path.resolve('/Users/baykus/.openclaw/workspace/data/fon_takip.csv');

const getFundInfo = (fundCode) => {
  return new Promise((resolve, reject) => {
    https.get(`https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${fundCode}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const priceMatch = data.match(/Son Fiyat \(TL\)[\s\S]*?<span>([\d,.]+)<\/span>/);
          const returnMatch = data.match(/Günlük Getiri \(%\)[\s\S]*?<span>([^<]+)<\/span>/);
          const monthlyMatch = data.match(/Son 1 Ay Getirisi[\s\S]*?<span[^>]*>([^<]+)<\/span>/);

          const price = priceMatch ? priceMatch[1] : '';
          const dailyReturn = returnMatch ? returnMatch[1] : '';
          const monthlyReturn = monthlyMatch ? monthlyMatch[1] : '';
          
          resolve({ fundCode, price, dailyReturn, monthlyReturn });
        } catch (e) {
          resolve({ fundCode, price: '', dailyReturn: '', monthlyReturn: '' });
        }
      });
    }).on('error', reject);
  });
};

function saveToCSV(tly, dfi) {
  const today = new Date().toISOString().slice(0, 10);
  
  // CSV yoksa başlık ekle
  if (!fs.existsSync(CSV_PATH)) {
    fs.mkdirSync(path.dirname(CSV_PATH), { recursive: true });
    fs.writeFileSync(CSV_PATH, 'Tarih,TLY Fiyat (TL),TLY Günlük %,TLY Aylık %,DFI Fiyat (TL),DFI Günlük %,DFI Aylık %\n');
  }

  // Bugünkü satır zaten varsa güncelle, yoksa ekle
  const existing = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = existing.trim().split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);
  
  const newLine = `${today},${tly.price},${tly.dailyReturn},${tly.monthlyReturn},${dfi.price},${dfi.dailyReturn},${dfi.monthlyReturn}`;
  
  const todayIndex = dataLines.findIndex(l => l.startsWith(today));
  if (todayIndex >= 0) {
    dataLines[todayIndex] = newLine;
  } else {
    dataLines.push(newLine);
  }
  
  fs.writeFileSync(CSV_PATH, [header, ...dataLines].join('\n') + '\n');
}

async function check() {
  const tly = await getFundInfo('TLY');
  const dfi = await getFundInfo('DFI');
  
  // CSV'ye kaydet
  saveToCSV(tly, dfi);
  
  console.log(`📈 *TLY ve DFI Fon Günlük Takip Raporu*\n\n*TLY (Tera Portföy Serbest Fon):*\nFiyat: ${tly.price} TL\nGünlük Getiri: ${tly.dailyReturn}\nAylık Getiri: ${tly.monthlyReturn}\n\n*DFI (Deniz Portföy Serbest Fon):*\nFiyat: ${dfi.price} TL\nGünlük Getiri: ${dfi.dailyReturn}\nAylık Getiri: ${dfi.monthlyReturn}`);
}
check();
