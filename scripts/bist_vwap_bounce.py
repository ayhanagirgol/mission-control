#!/usr/bin/env python3
"""
BIST VWAP Bounce Stratejisi
Hisseler: GARAN, KCHOL, TUPRS, ASELS

Mantık:
- VWAP (Hacim Ağırlıklı Ortalama Fiyat) her gün sıfırlanır
- Fiyat VWAP'ın altına düşer + RSI oversold bölgesine girer → AL sinyali
- Fiyat VWAP'ı yukarı geçer + hacim güçlü → SAT sinyali
- 4H RSI eğimi pozitif ise AL filtresi (trend onayı)
- Stop loss: %3
- Acil çıkış: RSI ≥ 85
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime

HISSELER       = ['GARAN.IS', 'KCHOL.IS', 'TUPRS.IS', 'ASELS.IS']
BASLANGIC      = 100_000

# VWAP parametreleri
VWAP_BAND_ALT  = -0.005   # VWAP'ın %0.5 altı → AL bölgesi
VWAP_BAND_UST  = 0.003    # VWAP'ın %0.3 üstü → SAT bölgesi

# RSI parametreleri
RSI_5M_PERIYOT = 14
RSI_OS         = 40       # Oversold eşiği (altında AL hazırlığı)
RSI_OB         = 60       # Overbought eşiği (üstünde SAT hazırlığı)
RSI_ACIL       = 85       # Acil çıkış

# 4H trend filtresi
RSI_4H_PERIYOT = 14
RSI_4H_EGIM    = 2        # Son 2 saatte RSI eğimi pozitif mi?

# Hacim
HACIM_PERIYOT  = 20
HACIM_KATSAYI  = 1.2

# Risk
STOP_LOSS      = 0.03     # %3


def rsi_hesapla(close, p=14):
    d = close.diff()
    k = d.clip(lower=0).ewm(com=p-1, adjust=True).mean()
    l = (-d.clip(upper=0)).ewm(com=p-1, adjust=True).mean()
    rs = k / l
    return 100 - (100 / (1 + rs))


def vwap_hesapla(df):
    """Gün içi VWAP — her gün sıfırlanır"""
    df = df.copy()
    # Tarih bazında gruplama (UTC'den TR'ye çevir)
    df['Date'] = (df.index.tz_convert('Europe/Istanbul') 
                  if df.index.tz else df.index).date
    
    # Tipik fiyat
    df['TP'] = (df['High'] + df['Low'] + df['Close']) / 3
    df['TPV'] = df['TP'] * df['Volume']
    
    # Her gün için kümülatif VWAP
    df['CumTPV'] = df.groupby('Date')['TPV'].cumsum()
    df['CumVol'] = df.groupby('Date')['Volume'].cumsum()
    df['VWAP'] = df['CumTPV'] / df['CumVol']
    
    return df


def backtest(ticker):
    print(f"\n{'='*65}")
    print(f"📊 {ticker} — VWAP Bounce Stratejisi")

    # 5dk veri
    df5 = yf.download(ticker, period='60d', interval='5m',
                      auto_adjust=True, progress=False)
    if df5.empty:
        print(f"  ❌ 5dk veri alınamadı")
        return None
    df5.columns = [c[0] if isinstance(c, tuple) else c for c in df5.columns]
    df5.index = pd.to_datetime(df5.index)

    # Sadece borsa saatleri (07:00–14:55 UTC = 10:00–17:55 TR)
    df5 = df5.between_time('07:00', '14:55')

    # VWAP hesapla
    df5 = vwap_hesapla(df5)

    # 5dk RSI ve hacim
    df5['RSI5M']    = rsi_hesapla(df5['Close'], RSI_5M_PERIYOT)
    df5['HacimOrt'] = df5['Volume'].rolling(HACIM_PERIYOT).mean()
    
    # VWAP bandları
    df5['VWAP_Alt'] = df5['VWAP'] * (1 + VWAP_BAND_ALT)
    df5['VWAP_Ust'] = df5['VWAP'] * (1 + VWAP_BAND_UST)

    # 4H RSI eğimi
    df4h = yf.download(ticker, period='60d', interval='1h',
                       auto_adjust=True, progress=False)
    if not df4h.empty:
        df4h.columns = [c[0] if isinstance(c, tuple) else c for c in df4h.columns]
        df4h.index = pd.to_datetime(df4h.index)
        df4h['RSI4H']      = rsi_hesapla(df4h['Close'], RSI_4H_PERIYOT)
        df4h['RSI4H_Egim'] = df4h['RSI4H'].diff(RSI_4H_EGIM)
        df5 = df5.join(df4h[['RSI4H', 'RSI4H_Egim']], how='left').ffill()
    else:
        df5['RSI4H'] = 50
        df5['RSI4H_Egim'] = 0

    df5.dropna(inplace=True)

    # ─── BACKTEST ────────────────────────────────────────────────
    nakit       = BASLANGIC
    pozisyon    = 0.0
    giris_f     = 0.0
    giris_t     = None
    dip_gordu   = False
    islemler    = []
    equity      = []

    for i in range(1, len(df5)):
        row      = df5.iloc[i]
        prev     = df5.iloc[i-1]
        tarih    = df5.index[i]
        fiyat    = float(row['Close'])
        vwap     = float(row['VWAP'])
        vwap_alt = float(row['VWAP_Alt'])
        vwap_ust = float(row['VWAP_Ust'])
        rsi5m    = float(row['RSI5M'])
        prev_rsi = float(prev['RSI5M'])
        rsi4h    = float(row.get('RSI4H', 50))
        egim     = float(row.get('RSI4H_Egim', 0))
        hacim_ok = float(row['Volume']) > float(row['HacimOrt']) * HACIM_KATSAYI
        egim_ok  = egim > 0

        # RSI dip hafızası
        if rsi5m < RSI_OS:
            dip_gordu = True
        if rsi5m > RSI_OS + 15:
            dip_gordu = False

        # ─── AL koşulları ─────────────────────────────────────────
        # 1. Fiyat VWAP'ın altında (bounce bölgesi)
        # 2. RSI dip gördü ve toparlanıyor (dip_gordu + crossover)
        # 3. 4H RSI eğimi pozitif (trend yukarı)
        # 4. Hacim güçlü
        # 5. Pozisyon yok
        al = (
            pozisyon == 0 and
            fiyat <= vwap_alt and           # VWAP altında
            dip_gordu and
            prev_rsi < RSI_OS and rsi5m >= RSI_OS and  # RSI toparlanıyor
            egim_ok and                     # 4H trend yukarı
            hacim_ok                        # Hacim güçlü
        )

        # ─── SAT koşulları ────────────────────────────────────────
        # 1. Fiyat VWAP'ı geçti (hedef tutuldu)
        # 2. RSI overbought bölgesine girdi
        # 3. Hacim güçlü
        sat_normal = (
            pozisyon > 0 and
            fiyat >= vwap_ust and           # VWAP üstünde
            rsi5m >= RSI_OB and             # RSI yüksek
            hacim_ok
        )
        sat_stop  = pozisyon > 0 and fiyat < giris_f * (1 - STOP_LOSS)
        sat_acil  = pozisyon > 0 and rsi5m >= RSI_ACIL

        # ─── İşlem mantığı ────────────────────────────────────────
        if al:
            pozisyon  = nakit / fiyat
            giris_f   = fiyat
            giris_t   = tarih
            nakit     = 0
            dip_gordu = False

        elif sat_normal or sat_stop or sat_acil:
            getiri = (fiyat - giris_f) / giris_f * 100
            kar    = pozisyon * (fiyat - giris_f)
            sure   = (tarih - giris_t).days if giris_t else 0
            nakit  = pozisyon * fiyat
            tur    = '🔥Acil' if sat_acil else ('🛑Stop' if sat_stop else '✅Normal')

            islemler.append({
                'Giriş':    giris_t.strftime('%m-%d %H:%M'),
                'Çıkış':    tarih.strftime('%m-%d %H:%M'),
                'G.Fiyat':  round(giris_f, 2),
                'Ç.Fiyat':  round(fiyat, 2),
                'VWAP':     round(vwap, 2),
                'RSI5M':    round(rsi5m, 1),
                'RSI4H':    round(rsi4h, 1),
                'Getiri%':  round(getiri, 2),
                'Süre':     sure,
                'Tür':      tur
            })
            pozisyon = 0
            giris_f  = 0

        # Equity curve
        pv = nakit + pozisyon * fiyat
        equity.append(pv)

    # Açık pozisyon varsa kapat
    if pozisyon > 0:
        son_f  = float(df5['Close'].iloc[-1])
        getiri = (son_f - giris_f) / giris_f * 100
        nakit  = pozisyon * son_f
        islemler.append({
            'Giriş': giris_t.strftime('%m-%d %H:%M'),
            'Çıkış': 'AÇIK',
            'G.Fiyat': round(giris_f, 2),
            'Ç.Fiyat': round(son_f, 2),
            'VWAP': '-',
            'RSI5M': '-',
            'RSI4H': '-',
            'Getiri%': round(getiri, 2),
            'Süre': (df5.index[-1] - giris_t).days,
            'Tür': '📂Açık'
        })

    toplam   = nakit
    getiri_t = (toplam - BASLANGIC) / BASLANGIC * 100

    # İstatistikler
    kapali   = [x for x in islemler if x['Tür'] != '📂Açık']
    kazanan  = len([x for x in kapali if x['Getiri%'] > 0])
    kaz_oran = kazanan / len(kapali) * 100 if kapali else 0
    ort_kar  = np.mean([x['Getiri%'] for x in kapali]) if kapali else 0
    ort_sure = np.mean([x['Süre'] for x in kapali]) if kapali else 0

    # Max drawdown
    if equity:
        eq = pd.Series([BASLANGIC] + equity)
        dd = ((eq - eq.cummax()) / eq.cummax() * 100).min()
    else:
        dd = 0

    stop_sayi = len([x for x in kapali if '🛑Stop' in x['Tür']])
    acil_sayi = len([x for x in kapali if '🔥Acil' in x['Tür']])

    print(f"\n  ✅ SONUÇLAR:")
    print(f"  Başlangıç Sermaye:  {BASLANGIC:>12,.0f} TL")
    print(f"  Bitiş Sermaye:      {toplam:>12,.0f} TL")
    print(f"  Toplam Getiri:      {getiri_t:>+11.2f}%")
    print(f"  Max Drawdown:       {dd:>+11.2f}%")
    print(f"  ─────────────────────────────────")
    print(f"  İşlem Sayısı:       {len(islemler):>12}")
    print(f"  Kazanma Oranı:      {kaz_oran:>11.0f}%")
    print(f"  Ort. Getiri/İşlem:  {ort_kar:>+11.2f}%")
    print(f"  Ort. Pozisyon Süresi:{ort_sure:>10.1f} gün")
    print(f"  Stop Tetikleme:     {stop_sayi:>12}x")
    print(f"  Acil Çıkış:         {acil_sayi:>12}x")

    if islemler:
        print(f"\n  Tüm İşlemler:")
        df_i = pd.DataFrame(islemler)
        print(df_i[['Giriş','Çıkış','G.Fiyat','Ç.Fiyat','VWAP','RSI5M','RSI4H','Getiri%','Tür']].to_string(index=False))

    return {
        'ticker':    ticker,
        'getiri':    getiri_t,
        'islem':     len(islemler),
        'kaz_oran':  kaz_oran,
        'ort_kar':   ort_kar,
        'dd':        dd,
        'stop':      stop_sayi,
        'portfoy':   toplam
    }


if __name__ == '__main__':
    print("🚀 BIST VWAP Bounce Stratejisi — 60 Gün Backtest")
    print(f"AL:  Fiyat ≤ VWAP×{1+VWAP_BAND_ALT:.3f} + RSI5M dip→{RSI_OS} + 4H RSI eğimi↑ + Hacim {HACIM_KATSAYI}x")
    print(f"SAT: Fiyat ≥ VWAP×{1+VWAP_BAND_UST:.3f} + RSI5M ≥ {RSI_OB} + Hacim | Stop: %{STOP_LOSS*100:.0f} | Acil: RSI≥{RSI_ACIL}")

    sonuclar = []
    for t in HISSELER:
        s = backtest(t)
        if s:
            sonuclar.append(s)

    print(f"\n{'='*65}")
    print("📋 ÖZET KARŞILAŞTIRMA — VWAP Bounce")
    print(f"{'='*65}")
    print(f"{'Hisse':<12} {'Getiri':>8} {'İşlem':>7} {'Kazanma':>8} {'Ort.Kâr':>8} {'MaxDD':>7} {'Stop':>5}")
    print(f"{'-'*65}")
    for s in sonuclar:
        print(f"{s['ticker']:<12} {s['getiri']:>7.2f}% {s['islem']:>7} "
              f"{s['kaz_oran']:>7.0f}% {s['ort_kar']:>7.2f}% {s['dd']:>6.1f}% {s['stop']:>5}")

    print(f"\n💡 Önceki Strateji Karşılaştırması:")
    print(f"   RSI Bot    → GARAN: +2.6% | KCHOL: +1.0% | TUPRS: -1.8%")
    print(f"   Hibrit Grid→ GARAN: -1.9% | KCHOL: +1.1%")
    print(f"   VWAP Bounce→ yukarıdaki sonuçlar")
