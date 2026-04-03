#!/usr/bin/env python3
"""
BIST Çoklu Zaman Dilimi (MTF) Stratejisi
Hisseler: GARAN, KCHOL, TUPRS

Mantık:
  - SAATLIK RSI eğimi → trend filtresi (yukarı eğim = long izni)
  - 5 DAKİKALIK RSI → al/sat sinyali + hacim + gap filtresi
  - RSI 85 acil çıkış

Not: yfinance 5dk veri = 60 gün limit, 1h = 730 gün
"""

import yfinance as yf
import pandas as pd
import numpy as np

# ─── PARAMETRELER ────────────────────────────────────────────
HISSELER = ['GARAN.IS', 'KCHOL.IS', 'TUPRS.IS']
BASLANGIC_SERMAYE = 100_000  # TL

# Saatlik (trend filtresi)
RSI_1H_PERIYOT = 14
RSI_1H_EGIM_PERIYOT = 3      # Son 3 saatlik RSI değişimi pozitif mi?

# 5 Dakikalık (sinyal)
RSI_5M_PERIYOT = 14
RSI_ASIRI_SATIS = 35
RSI_AL_ESIGI = 40
RSI_ASIRI_ALIS = 65
RSI_SAT_ESIGI = 60
RSI_ACIL_CIKIS = 85

STOP_LOSS = 0.03         # %3 stop loss

# Zaman bazlı filtre — UTC (TR = UTC+3)
AL_BASLANGIC  = "14:00"  # 17:00 TR = 14:00 UTC
AL_BITIS      = "14:30"  # 17:30 TR = 14:30 UTC
SAT_BASLANGIC = "07:00"  # 10:00 TR = 07:00 UTC
SAT_BITIS     = "08:30"  # 11:30 TR = 08:30 UTC

HACIM_PERIYOT = 20
HACIM_KATSAYI = 1.3
GAP_ESIGI = 0.02        # %2

# ─── RSI HESAPLAMA ───────────────────────────────────────────
def rsi_hesapla(close, periyot=14):
    delta = close.diff()
    kazanc = delta.clip(lower=0)
    kayip = -delta.clip(upper=0)
    ort_kazanc = kazanc.ewm(com=periyot-1, adjust=True).mean()
    ort_kayip = kayip.ewm(com=periyot-1, adjust=True).mean()
    rs = ort_kazanc / ort_kayip
    return 100 - (100 / (1 + rs))

# ─── BACKTEST FONKSİYONU ─────────────────────────────────────
def backtest(ticker):
    print(f"\n{'='*50}")
    print(f"📊 {ticker} MTF Backtest başlıyor...")

    # 5 Dakikalık veri (60 gün limit)
    df_5m = yf.download(ticker, period="60d", interval="5m", auto_adjust=True, progress=False)
    if df_5m.empty:
        print(f"❌ {ticker} 5dk veri alınamadı!")
        return None
    df_5m.columns = [c[0] if isinstance(c, tuple) else c for c in df_5m.columns]
    df_5m = df_5m[['Open','High','Low','Close','Volume']].copy()
    df_5m.index = pd.to_datetime(df_5m.index)

    # Saatlik veri (trend filtresi için)
    df_1h = yf.download(ticker, period="60d", interval="1h", auto_adjust=True, progress=False)
    if df_1h.empty:
        print(f"❌ {ticker} 1h veri alınamadı!")
        return None
    df_1h.columns = [c[0] if isinstance(c, tuple) else c for c in df_1h.columns]
    df_1h = df_1h[['Close']].copy()
    df_1h.index = pd.to_datetime(df_1h.index)

    # Saatlik RSI ve eğim hesapla
    df_1h['RSI_1H'] = rsi_hesapla(df_1h['Close'], RSI_1H_PERIYOT)
    df_1h['RSI_Egim'] = df_1h['RSI_1H'].diff(RSI_1H_EGIM_PERIYOT)  # pozitif = yukarı eğim
    df_1h = df_1h[['RSI_1H','RSI_Egim']].dropna()

    # Dow Jones Futures verisi çek (^DJIA veya YM=F)
    dj = yf.download('YM=F', period="60d", interval="5m", auto_adjust=True, progress=False)
    if not dj.empty:
        dj.columns = [c[0] if isinstance(c, tuple) else c for c in dj.columns]
        dj.index = pd.to_datetime(dj.index)
        dj['DJ_Close'] = dj['Close']
        dj['DJ_Degisim'] = dj['Close'].pct_change(12)  # Son 1 saatlik DJ değişimi
        dj = dj[['DJ_Close','DJ_Degisim']]
    
    # 5dk DataFrame'e saatlik RSI eğimini eşleştir (forward fill)
    df_5m = df_5m.join(df_1h, how='left', rsuffix='_1h')
    df_5m[['RSI_1H','RSI_Egim']] = df_5m[['RSI_1H','RSI_Egim']].ffill()
    
    # DJ verisini ekle
    if not dj.empty:
        df_5m = df_5m.join(dj, how='left', rsuffix='_dj')
        df_5m[['DJ_Close','DJ_Degisim']] = df_5m[['DJ_Close','DJ_Degisim']].ffill()
    else:
        df_5m['DJ_Degisim'] = 0

    # 5dk göstergeler
    df_5m['RSI'] = rsi_hesapla(df_5m['Close'], RSI_5M_PERIYOT)
    df_5m['Hacim_Ort'] = df_5m['Volume'].rolling(HACIM_PERIYOT).mean()
    df_5m['Gap'] = abs(df_5m['Open'] - df_5m['Close'].shift(1)) / df_5m['Close'].shift(1)
    df_5m.dropna(inplace=True)

    # Sadece borsa saatleri: 10:00-18:00 TR = 07:00-15:00 UTC
    df_5m = df_5m.between_time('07:00', '14:55')
    df = df_5m.copy()

    # Backtest
    sermaye = BASLANGIC_SERMAYE
    pozisyon = 0
    giris_fiyat = 0
    giris_tarihi = None
    dip_gordu = False
    zirve_gordu = False

    islemler = []
    equity_curve = []

    for i in range(1, len(df)):
        row = df.iloc[i]
        prev = df.iloc[i-1]
        tarih = df.index[i]
        fiyat = float(row['Close'])
        rsi = float(row['RSI'])
        prev_rsi = float(prev['RSI'])
        hacim_guclu = float(row['Volume']) > float(row['Hacim_Ort']) * HACIM_KATSAYI
        gap_var = float(row['Gap']) > GAP_ESIGI

        # RSI hafıza
        if rsi < RSI_ASIRI_SATIS:
            dip_gordu = True
        if rsi > RSI_AL_ESIGI + 10:
            dip_gordu = False

        if rsi > RSI_ASIRI_ALIS:
            zirve_gordu = True
        if rsi < RSI_SAT_ESIGI - 10:
            zirve_gordu = False

        # Saatlik trend filtresi — RSI eğimi pozitif mi?
        egim_pozitif = float(row.get('RSI_Egim', 0)) > 0

        # Zaman filtresi
        saat = tarih.strftime('%H:%M')
        al_zamani  = AL_BASLANGIC <= saat <= AL_BITIS      # 17:00-17:30 AL penceresi
        sat_zamani = SAT_BASLANGIC <= saat <= SAT_BITIS    # 10:00-11:30 SAT penceresi (ertesi sabah)

        # DJ filtresi — 17:00-17:30'da DJ futures pozitif mi?
        dj_pozitif = float(row.get('DJ_Degisim', 0)) > 0

        # AL sinyali — basit: 17:00-17:30 + DJ pozitif + RSI aşırı alımda değil + hacim
        al = (al_zamani and
              dj_pozitif and
              rsi < 65 and          # aşırı alımda değil
              rsi > 35 and          # aşırı satışta değil (çok düşük hisse alma)
              hacim_guclu and
              not gap_var)

        # Normal SAT — ertesi sabah 10:00-11:30 penceresi, zaman bazlı çıkış
        sat_normal = (pozisyon > 0 and sat_zamani)
        sat_acil = (prev_rsi < RSI_ACIL_CIKIS and rsi >= RSI_ACIL_CIKIS)
        # %3 Stop Loss
        sat_stop = pozisyon > 0 and fiyat < giris_fiyat * (1 - STOP_LOSS)
        sat = sat_normal or sat_acil or sat_stop

        # İşlem mantığı
        if al and pozisyon == 0:
            lot = sermaye / fiyat
            pozisyon = lot
            giris_fiyat = fiyat
            giris_tarihi = tarih
            dip_gordu = False

        elif sat and pozisyon > 0:
            cikis_fiyat = fiyat
            getiri = (cikis_fiyat - giris_fiyat) / giris_fiyat * 100
            kar = pozisyon * (cikis_fiyat - giris_fiyat)
            sermaye += kar
            sure = (tarih - giris_tarihi).days
            islemler.append({
                'Giriş': giris_tarihi.strftime('%Y-%m-%d'),
                'Çıkış': tarih.strftime('%Y-%m-%d'),
                'Giriş Fiyat': round(giris_fiyat, 2),
                'Çıkış Fiyat': round(cikis_fiyat, 2),
                'Getiri %': round(getiri, 2),
                'Süre (gün)': sure,
                'Tür': 'Stop' if sat_stop else ('Acil' if sat_acil else 'Normal')
            })
            pozisyon = 0
            giris_fiyat = 0
            zirve_gordu = False

        # Equity curve
        portfoy = sermaye + (pozisyon * fiyat if pozisyon > 0 else 0)
        equity_curve.append(portfoy)

    # Açık pozisyon varsa kapat
    if pozisyon > 0:
        son_fiyat = float(df.iloc[-1]['Close'])
        getiri = (son_fiyat - giris_fiyat) / giris_fiyat * 100
        kar = pozisyon * (son_fiyat - giris_fiyat)
        sermaye += kar
        islemler.append({
            'Giriş': giris_tarihi.strftime('%Y-%m-%d'),
            'Çıkış': 'AÇIK',
            'Giriş Fiyat': round(giris_fiyat, 2),
            'Çıkış Fiyat': round(son_fiyat, 2),
            'Getiri %': round(getiri, 2),
            'Süre (gün)': (df.index[-1] - giris_tarihi).days,
            'Tür': 'Açık'
        })

    # Sonuçlar
    if not islemler:
        print(f"⚠️  {ticker}: Hiç işlem sinyali üretilmedi!")
        return None

    islem_df = pd.DataFrame(islemler)
    toplam_getiri = (sermaye - BASLANGIC_SERMAYE) / BASLANGIC_SERMAYE * 100
    kapali = islem_df[islem_df['Çıkış'] != 'AÇIK']
    kazanan = len(kapali[kapali['Getiri %'] > 0])
    kazanma_orani = kazanan / len(kapali) * 100 if len(kapali) > 0 else 0

    # Max drawdown
    eq = pd.Series([BASLANGIC_SERMAYE] + equity_curve)
    tepe = eq.cummax()
    drawdown = (eq - tepe) / tepe * 100
    max_dd = drawdown.min()

    # En iyi / en kötü
    if len(kapali) > 0:
        en_iyi = kapali.loc[kapali['Getiri %'].idxmax()]
        en_kotu = kapali.loc[kapali['Getiri %'].idxmin()]
        en_uzun = kapali['Süre (gün)'].max()
    else:
        en_iyi = en_kotu = None
        en_uzun = 0

    print(f"\n✅ {ticker} SONUÇLARI:")
    print(f"  Başlangıç:      100,000 TL")
    print(f"  Bitiş:          {sermaye:,.0f} TL")
    print(f"  Toplam Getiri:  {toplam_getiri:+.1f}%")
    print(f"  İşlem Sayısı:   {len(islemler)}")
    print(f"  Kazanma Oranı:  {kazanma_orani:.0f}%")
    print(f"  Max Drawdown:   {max_dd:.1f}%")
    print(f"  En Uzun Pozis.: {en_uzun} gün")
    if en_iyi is not None:
        print(f"  En İyi İşlem:   {en_iyi['Giriş']} → {en_iyi['Çıkış']} ({en_iyi['Getiri %']:+.1f}%)")
        print(f"  En Kötü İşlem: {en_kotu['Giriş']} → {en_kotu['Çıkış']} ({en_kotu['Getiri %']:+.1f}%)")

    print(f"\n  Tüm İşlemler:")
    print(islem_df.to_string(index=False))

    return {
        'ticker': ticker,
        'toplam_getiri': toplam_getiri,
        'islem_sayisi': len(islemler),
        'kazanma_orani': kazanma_orani,
        'max_drawdown': max_dd,
        'en_uzun': en_uzun,
        'son_sermaye': sermaye
    }

# ─── ÇALIŞTIR ─────────────────────────────────────────────────
if __name__ == '__main__':
    print("🚀 BIST MTF Backtest — 60 Gün (5dk sinyal + 1h trend filtresi)")
    print(f"AL: 5dk RSI dip<{RSI_ASIRI_SATIS}→{RSI_AL_ESIGI} + 1h RSI eğimi YUKARI + hacim {HACIM_KATSAYI}x + gap<%{GAP_ESIGI*100:.0f}")
    print(f"SAT: 5dk RSI zirve>{RSI_ASIRI_ALIS}→{RSI_SAT_ESIGI} | Acil: RSI≥{RSI_ACIL_CIKIS}")
    print(f"Gap filtresi: >%{GAP_ESIGI*100:.0f} atla | Hacim: {HACIM_KATSAYI}x ortalama")

    sonuclar = []
    for ticker in HISSELER:
        s = backtest(ticker)
        if s:
            sonuclar.append(s)

    print(f"\n{'='*50}")
    print("📋 ÖZET KARŞILAŞTIRMA")
    print(f"{'='*50}")
    print(f"{'Hisse':<12} {'Getiri':>8} {'İşlem':>7} {'Kazanma':>8} {'MaxDD':>8}")
    print(f"{'-'*50}")
    for s in sonuclar:
        print(f"{s['ticker']:<12} {s['toplam_getiri']:>7.1f}% {s['islem_sayisi']:>7} {s['kazanma_orani']:>7.0f}% {s['max_drawdown']:>7.1f}%")
