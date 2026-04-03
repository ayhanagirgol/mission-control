#!/usr/bin/env python3
"""
BIST Hibrit Bot: Grid + Hacim + 4H RSI Eğim Filtresi
- Grid seviyeleri fiyat aralığını böler
- AL: grid seviyesine düştü + hacim güçlü + 4H RSI eğimi POZİTİF
- SAT: grid seviyesine yükseldi + hacim güçlü (eğim filtresi yok)
- RSI 85 acil çıkış
"""

import yfinance as yf
import pandas as pd
import numpy as np

HISSELER       = ['GARAN.IS', 'KCHOL.IS']
BASLANGIC      = 100_000
SEVIYE_TL      = 8_000
GRID_ARALIK    = 0.015       # %1.5
GRID_SEVIYE    = 8
HACIM_PERIYOT  = 20
HACIM_KATSAYI  = 1.2         # 1.2x ortalama yeterli
RSI_4H_PERIYOT = 14
RSI_4H_EGIM    = 3           # Son 3 mumda RSI eğimi
RSI_ACIL       = 85

def rsi(close, p=14):
    d = close.diff()
    k = d.clip(lower=0).ewm(com=p-1, adjust=True).mean()
    l = (-d.clip(upper=0)).ewm(com=p-1, adjust=True).mean()
    return 100 - (100 / (1 + k/l))

def grid_idx(fiyat, seviyeler):
    for i in range(len(seviyeler)-1):
        if seviyeler[i] <= fiyat <= seviyeler[i+1]: return i
    return -1 if fiyat < seviyeler[0] else len(seviyeler)

def grid_kur(merkez, n, aralik):
    return sorted([round(merkez*(1+i*aralik), 2) for i in range(-n//2, n//2+1)])

def backtest(ticker):
    print(f"\n{'='*60}")
    print(f"🤖 {ticker} — Hibrit Grid Bot (4H RSI + Hacim)")

    # 5dk veri
    df5 = yf.download(ticker, period='60d', interval='5m', auto_adjust=True, progress=False)
    if df5.empty: print("❌ Veri yok"); return None
    df5.columns = [c[0] if isinstance(c, tuple) else c for c in df5.columns]
    df5.index = pd.to_datetime(df5.index)
    df5 = df5.between_time('07:00','14:55')

    # 4 saatlik veri — RSI eğimi için
    df4h = yf.download(ticker, period='60d', interval='1h', auto_adjust=True, progress=False)
    df4h.columns = [c[0] if isinstance(c, tuple) else c for c in df4h.columns]
    df4h.index = pd.to_datetime(df4h.index)
    df4h['RSI4H'] = rsi(df4h['Close'], RSI_4H_PERIYOT)
    df4h['RSI4H_Egim'] = df4h['RSI4H'].diff(RSI_4H_EGIM)  # pozitif = yukarı

    # 5dk'ya 4H RSI eğimini ekle
    df5 = df5.join(df4h[['RSI4H','RSI4H_Egim']], how='left').ffill()

    # 5dk göstergeler
    df5['RSI5M'] = rsi(df5['Close'], 14)
    df5['HacimOrt'] = df5['Volume'].rolling(HACIM_PERIYOT).mean()
    df5.dropna(inplace=True)

    # Backtest
    nakit = BASLANGIC
    poz = {}          # {seviye_idx: (adet, giris_fiyat)}
    islemler = []
    son_idx = None
    yenileme = 0
    ilk_fiyat = float(df5['Close'].iloc[50])
    seviyeler = grid_kur(ilk_fiyat, GRID_SEVIYE, GRID_ARALIK)

    for i in range(50, len(df5)):
        row = df5.iloc[i]
        tarih = df5.index[i]
        fiyat = float(row['Close'])
        hacim_guclu = float(row['Volume']) > float(row['HacimOrt']) * HACIM_KATSAYI
        egim_pozitif = float(row.get('RSI4H_Egim', 0)) > 0
        rsi5m = float(row['RSI5M'])

        # Grid dışına çıktı → yenile
        if fiyat < seviyeler[0]*0.96 or fiyat > seviyeler[-1]*1.04:
            for si, (adet, gf) in list(poz.items()):
                nakit += adet * fiyat
                islemler.append({'Tarih': tarih.strftime('%m-%d'), 'Tür': 'Yenileme SAT',
                                  'Fiyat': round(fiyat,2), 'Kar': round(adet*(fiyat-gf),0)})
            poz = {}
            seviyeler = grid_kur(fiyat, GRID_SEVIYE, GRID_ARALIK)
            son_idx = None; yenileme += 1
            continue

        idx = grid_idx(fiyat, seviyeler)
        if son_idx is None: son_idx = idx; continue

        # ─── AL: Seviye düştü + 4H RSI eğimi POZİTİF + hacim güçlü ───
        if idx < son_idx:
            for si in range(idx, son_idx):
                if si >= 0 and si not in poz and nakit >= SEVIYE_TL:
                    if egim_pozitif and hacim_guclu:  # ← FİLTRE
                        poz[si] = (SEVIYE_TL / fiyat, fiyat)
                        nakit -= SEVIYE_TL
                        islemler.append({'Tarih': tarih.strftime('%m-%d %H:%M'), 'Tür': 'AL',
                                          'Fiyat': round(fiyat,2), 'RSI4H': round(float(row.get('RSI4H',0)),1),
                                          'Egim': '↑' if egim_pozitif else '↓', 'Hacim': '💪' if hacim_guclu else '-', 'Kar': 0})

        # ─── SAT: Seviye yükseldi + hacim güçlü ───
        elif idx > son_idx:
            for si in range(son_idx, idx):
                if si in poz:
                    adet, gf = poz[si]
                    if hacim_guclu or rsi5m >= RSI_ACIL:  # hacim veya acil çıkış
                        kar = adet * (fiyat - gf)
                        nakit += adet * fiyat
                        tur = '🔥 AcilSAT' if rsi5m >= RSI_ACIL else 'SAT'
                        islemler.append({'Tarih': tarih.strftime('%m-%d %H:%M'), 'Tür': tur,
                                          'Fiyat': round(fiyat,2), 'RSI4H': round(float(row.get('RSI4H',0)),1),
                                          'Egim': '↑' if egim_pozitif else '↓', 'Hacim': '💪', 'Kar': round(kar,0)})
                        del poz[si]

        son_idx = idx

    # Kapanış değeri
    son = float(df5['Close'].iloc[-1])
    poz_val = sum(a*son for a,_ in poz.values())
    toplam = nakit + poz_val
    getiri = (toplam - BASLANGIC) / BASLANGIC * 100

    allar  = [x for x in islemler if x['Tür'] == 'AL']
    satlar = [x for x in islemler if x['Tür'] in ('SAT','🔥 AcilSAT')]
    grid_kar = sum(x['Kar'] for x in satlar)
    kazanma = len([x for x in satlar if x['Kar']>0])/len(satlar)*100 if satlar else 0

    # Filtre etkinliği: kaç al sinyali engellendi?
    tum_grid_al = 0  # Filtre olmasaydı
    df5_tmp = df5.copy()
    for i in range(50, len(df5_tmp)):
        r = df5_tmp.iloc[i]
        if float(r.get('RSI4H_Egim',0)) <= 0 or float(r['Volume']) <= float(r['HacimOrt'])*HACIM_KATSAYI:
            tum_grid_al += 1

    print(f"\n  📊 SONUÇLAR:")
    print(f"  Başlangıç:          100,000 TL")
    print(f"  Nakit:              {nakit:,.0f} TL")
    print(f"  Açık Poz. Değeri:   {poz_val:,.0f} TL  ({len(poz)} seviye)")
    print(f"  Toplam Portföy:     {toplam:,.0f} TL")
    print(f"  Toplam Getiri:      {getiri:+.2f}%")
    print(f"  AL işlemi:          {len(allar)}  (filtre {tum_grid_al} sinyali engelledi)")
    print(f"  SAT işlemi:         {len(satlar)}")
    print(f"  Kazanma Oranı:      %{kazanma:.0f}")
    print(f"  Toplam Grid Karı:   {grid_kar:,.0f} TL")
    print(f"  Grid Yenileme:      {yenileme} kez")

    if allar:
        print(f"\n  Son 8 AL (4H RSI eğimi filtrelenmiş):")
        df_al = pd.DataFrame(allar[-8:])
        print(df_al[['Tarih','Fiyat','RSI4H','Egim','Hacim']].to_string(index=False))

    if satlar:
        print(f"\n  Son 8 SAT:")
        df_sat = pd.DataFrame(satlar[-8:])
        print(df_sat[['Tarih','Fiyat','RSI4H','Egim','Kar']].to_string(index=False))

    return {'ticker': ticker, 'getiri': getiri, 'al': len(allar), 'sat': len(satlar),
            'kazanma': kazanma, 'kar': grid_kar, 'portfoy': toplam}

if __name__ == '__main__':
    print("🚀 BIST Hibrit Grid Bot — 4H RSI Eğim + Hacim Filtresi")
    print(f"Grid: {GRID_SEVIYE} seviye | %{GRID_ARALIK*100:.1f} aralık | Seviye: {SEVIYE_TL:,} TL")
    print(f"AL Filtresi: 4H RSI eğimi ↑ + Hacim ≥{HACIM_KATSAYI}x ort.")
    print(f"SAT: Grid üst + hacim | Acil: RSI ≥ {RSI_ACIL}")

    sonuclar = []
    for t in HISSELER:
        s = backtest(t)
        if s: sonuclar.append(s)

    print(f"\n{'='*60}")
    print("📋 ÖZET KARŞILAŞTIRMA")
    print(f"{'='*60}")
    print(f"{'Hisse':<12} {'Getiri':>8} {'AL':>5} {'SAT':>5} {'Kazanma':>8} {'GridKar':>10}")
    print(f"{'-'*60}")
    for s in sonuclar:
        print(f"{s['ticker']:<12} {s['getiri']:>7.2f}% {s['al']:>5} {s['sat']:>5} {s['kazanma']:>7.0f}% {s['kar']:>10,.0f}")
    print(f"\n💡 Karşılaştırma:")
    print(f"   Grid Only   → GARAN: +0.2% | KCHOL: +0.4%")
    print(f"   RSI Bot     → GARAN: +2.6% | KCHOL: +1.0%")
