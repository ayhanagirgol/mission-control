#!/usr/bin/env python3
"""
BIST Grid Bot Backtest
Hisseler: GARAN, KCHOL, TUPRS

Grid mantığı:
- Fiyat aralığını N eşit seviyeye böl
- Her seviyede sabit TL miktarı AL
- Bir üst seviyeye ulaşınca SAT
- Sürekli küçük karlar birikiyor
"""

import yfinance as yf
import pandas as pd
import numpy as np

# ─── PARAMETRELER ────────────────────────────────────────────
HISSELER = ['GARAN.IS', 'KCHOL.IS', 'TUPRS.IS']
BASLANGIC_SERMAYE = 100_000  # TL

GRID_SEVIYE_SAYISI = 10      # Kaç seviye
GRID_ARALIK_YUZDE = 0.02     # Her seviye arasındaki mesafe (%2)
SEVIYE_BASI_TUTAR = 8_000    # Her grid seviyesi için ayrılan TL

# ─── YARDIMCI FONKSİYONLAR ───────────────────────────────────
def grid_seviyeleri_olustur(merkez_fiyat, seviye_sayisi, aralik):
    """Merkez fiyat etrafında grid seviyeleri oluştur"""
    seviyeler = []
    for i in range(-seviye_sayisi//2, seviye_sayisi//2 + 1):
        seviyeler.append(round(merkez_fiyat * (1 + i * aralik), 2))
    return sorted(seviyeler)

def en_yakin_grid(fiyat, seviyeler):
    """Fiyata en yakın grid seviyesini bul"""
    return min(seviyeler, key=lambda x: abs(x - fiyat))

def grid_index(fiyat, seviyeler):
    """Fiyatın hangi grid aralığında olduğunu bul"""
    for i in range(len(seviyeler)-1):
        if seviyeler[i] <= fiyat <= seviyeler[i+1]:
            return i
    if fiyat < seviyeler[0]: return -1
    if fiyat > seviyeler[-1]: return len(seviyeler)
    return 0

# ─── GRID BOT BACKTEST ───────────────────────────────────────
def grid_backtest(ticker):
    print(f"\n{'='*55}")
    print(f"🤖 {ticker} Grid Bot Backtest")

    # Veri çek
    df = yf.download(ticker, period="60d", interval="5m", auto_adjust=True, progress=False)
    if df.empty:
        print(f"❌ Veri alınamadı!")
        return None
    df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
    df.index = pd.to_datetime(df.index)
    df = df.between_time('07:00', '14:55')  # Borsa saatleri (UTC)
    df.dropna(inplace=True)

    # Grid'i ilk fiyat üzerinden kur
    ilk_fiyat = float(df['Close'].iloc[50])  # 50. mumda başla (göstergeler için)
    seviyeler = grid_seviyeleri_olustur(ilk_fiyat, GRID_SEVIYE_SAYISI, GRID_ARALIK_YUZDE)

    print(f"  Başlangıç fiyatı: {ilk_fiyat:.2f} TL")
    print(f"  Grid alt: {seviyeler[0]:.2f} TL | Grid üst: {seviyeler[-1]:.2f} TL")
    print(f"  Seviye aralığı: %{GRID_ARALIK_YUZDE*100:.1f} | {len(seviyeler)} seviye")

    # Durum
    sermaye_nakit = BASLANGIC_SERMAYE
    pozisyonlar = {}   # {seviye_index: adet} — her seviyede ne kadar alındı
    islemler = []
    son_grid_index = None
    grid_yenileme_sayisi = 0

    for i in range(50, len(df)):
        row = df.iloc[i]
        tarih = df.index[i]
        fiyat = float(row['Close'])

        # Grid sınırlarını kontrol et — fiyat dışarı çıktıysa yenile
        if fiyat < seviyeler[0] * 0.97 or fiyat > seviyeler[-1] * 1.03:
            # Tüm pozisyonları kapat, grid'i yenile
            for sev_idx, adet in list(pozisyonlar.items()):
                if adet > 0:
                    gelir = adet * fiyat
                    sermaye_nakit += gelir
                    islemler.append({
                        'Tarih': tarih.strftime('%m-%d'),
                        'Tür': 'Grid Yenileme SAT',
                        'Fiyat': round(fiyat, 2),
                        'Adet': round(adet, 2),
                        'Tutar': round(gelir, 0),
                        'Kar': 0
                    })
            pozisyonlar = {}
            seviyeler = grid_seviyeleri_olustur(fiyat, GRID_SEVIYE_SAYISI, GRID_ARALIK_YUZDE)
            son_grid_index = None
            grid_yenileme_sayisi += 1
            continue

        guncel_idx = grid_index(fiyat, seviyeler)

        if son_grid_index is None:
            son_grid_index = guncel_idx
            continue

        # Fiyat bir seviye DÜŞTÜ → AL
        if guncel_idx < son_grid_index:
            for idx in range(guncel_idx, son_grid_index):
                if idx >= 0 and idx < len(seviyeler)-1:
                    if idx not in pozisyonlar and sermaye_nakit >= SEVIYE_BASI_TUTAR:
                        adet = SEVIYE_BASI_TUTAR / fiyat
                        pozisyonlar[idx] = adet
                        sermaye_nakit -= SEVIYE_BASI_TUTAR
                        islemler.append({
                            'Tarih': tarih.strftime('%m-%d'),
                            'Tür': 'AL',
                            'Fiyat': round(fiyat, 2),
                            'Adet': round(adet, 2),
                            'Tutar': round(SEVIYE_BASI_TUTAR, 0),
                            'Kar': 0
                        })

        # Fiyat bir seviye YUKARI ÇIKTI → SAT
        elif guncel_idx > son_grid_index:
            for idx in range(son_grid_index, guncel_idx):
                if idx in pozisyonlar:
                    adet = pozisyonlar[idx]
                    giris_fiyat = SEVIYE_BASI_TUTAR / adet
                    cikis_fiyat = fiyat
                    kar = adet * (cikis_fiyat - giris_fiyat)
                    gelir = adet * cikis_fiyat
                    sermaye_nakit += gelir
                    islemler.append({
                        'Tarih': tarih.strftime('%m-%d'),
                        'Tür': 'SAT',
                        'Fiyat': round(cikis_fiyat, 2),
                        'Adet': round(adet, 2),
                        'Tutar': round(gelir, 0),
                        'Kar': round(kar, 0)
                    })
                    del pozisyonlar[idx]

        son_grid_index = guncel_idx

    # Açık pozisyonları son fiyata göre değerle
    son_fiyat = float(df['Close'].iloc[-1])
    poz_degeri = sum(adet * son_fiyat for adet in pozisyonlar.values())
    toplam_portfoy = sermaye_nakit + poz_degeri
    toplam_getiri = (toplam_portfoy - BASLANGIC_SERMAYE) / BASLANGIC_SERMAYE * 100

    # İstatistikler
    sat_islemler = [x for x in islemler if x['Tür'] == 'SAT']
    toplam_kar = sum(x['Kar'] for x in sat_islemler)
    kazanan = len([x for x in sat_islemler if x['Kar'] > 0])
    kazanma_orani = kazanan / len(sat_islemler) * 100 if sat_islemler else 0

    print(f"\n  ✅ SONUÇLAR:")
    print(f"  Başlangıç:        100,000 TL")
    print(f"  Nakit:            {sermaye_nakit:,.0f} TL")
    print(f"  Açık Poz. Değeri: {poz_degeri:,.0f} TL")
    print(f"  Toplam Portföy:   {toplam_portfoy:,.0f} TL")
    print(f"  Toplam Getiri:    {toplam_getiri:+.2f}%")
    print(f"  Toplam Al İşlemi: {len([x for x in islemler if x['Tür']=='AL'])}")
    print(f"  Toplam Sat İşlemi:{len(sat_islemler)}")
    print(f"  Kazanma Oranı:    %{kazanma_orani:.0f}")
    print(f"  Toplam Grid Karı: {toplam_kar:,.0f} TL")
    print(f"  Grid Yenileme:    {grid_yenileme_sayisi} kez")
    print(f"  Açık Pozisyon:    {len(pozisyonlar)} seviye ({poz_degeri:,.0f} TL)")

    if sat_islemler:
        print(f"\n  SAT İşlemleri (son 10):")
        df_sat = pd.DataFrame(sat_islemler[-10:])
        print(df_sat[['Tarih','Fiyat','Adet','Kar']].to_string(index=False))

    return {
        'ticker': ticker,
        'toplam_getiri': toplam_getiri,
        'al_sayisi': len([x for x in islemler if x['Tür']=='AL']),
        'sat_sayisi': len(sat_islemler),
        'kazanma_orani': kazanma_orani,
        'toplam_kar': toplam_kar,
        'grid_yenileme': grid_yenileme_sayisi,
        'portfoy': toplam_portfoy
    }

# ─── ÇALIŞTIR ─────────────────────────────────────────────────
if __name__ == '__main__':
    print("🤖 BIST Grid Bot Backtest — 60 Gün")
    print(f"Grid: {GRID_SEVIYE_SAYISI} seviye | Aralık: %{GRID_ARALIK_YUZDE*100:.1f} | Seviye başı: {SEVIYE_BASI_TUTAR:,} TL")

    sonuclar = []
    for ticker in HISSELER:
        s = grid_backtest(ticker)
        if s:
            sonuclar.append(s)

    print(f"\n{'='*55}")
    print("📋 ÖZET — Grid Bot vs RSI Bot")
    print(f"{'='*55}")
    print(f"{'Hisse':<12} {'Getiri':>8} {'Al':>5} {'Sat':>5} {'Kazanma':>8} {'Kar TL':>10}")
    print(f"{'-'*55}")
    for s in sonuclar:
        print(f"{s['ticker']:<12} {s['toplam_getiri']:>7.2f}% {s['al_sayisi']:>5} {s['sat_sayisi']:>5} {s['kazanma_orani']:>7.0f}% {s['toplam_kar']:>10,.0f}")
