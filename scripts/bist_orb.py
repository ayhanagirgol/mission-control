#!/usr/bin/env python3
"""
BIST Opening Range Breakout (ORB) Stratejisi
Hisseler: KCHOL, ASELS, ASTOR, TUPRS, GARAN

Mantık:
- 10:00-10:30 TR (07:00-07:30 UTC) aralığındaki HIGH ve LOW belirle
- HIGH kırılırsa AL (breakout yukarı)
- LOW kırılırsa → açık pozisyon varsa SAT
- Gün sonunda (17:30 TR) pozisyon kapatılır (intraday)
- Filtreler: Hacim güçlü + 4H RSI eğimi pozitif (AL için)
- Stop loss: %3
"""

import yfinance as yf
import pandas as pd
import numpy as np

HISSELER      = ['KCHOL.IS', 'ASELS.IS', 'ASTOR.IS', 'TUPRS.IS', 'GARAN.IS', 'ISCTR.IS']
BASLANGIC     = 100_000

# ORB parametreleri (UTC saatleri — TR-3)
ORB_BASLANGIC = '07:00'   # 10:00 TR
ORB_BITIS     = '07:30'   # 10:30 TR
GUN_SONU      = '14:50'   # 17:50 TR — kapanıştan 10dk önce çık

# Filtreler
HACIM_PERIYOT = 20
HACIM_KATSAYI = 1.2
RSI_4H_PERIYOT = 14
RSI_4H_EGIM   = 2

# Risk
STOP_LOSS     = 0.03
BREAKOUT_BUF  = 0.001     # %0.1 tampon — fake breakout filtresi


def rsi_hesapla(close, p=14):
    d = close.diff()
    k = d.clip(lower=0).ewm(com=p-1, adjust=True).mean()
    l = (-d.clip(upper=0)).ewm(com=p-1, adjust=True).mean()
    return 100 - (100 / (1 + k/l))


def backtest(ticker):
    print(f"\n{'='*65}")
    print(f"📊 {ticker} — ORB (Opening Range Breakout)")

    # 5dk veri
    df = yf.download(ticker, period='60d', interval='5m', auto_adjust=True, progress=False)
    if df.empty: print("  ❌ Veri yok"); return None
    df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
    df.index = pd.to_datetime(df.index)
    df = df.between_time('07:00', '14:55')

    # 4H RSI eğimi
    df4h = yf.download(ticker, period='60d', interval='1h', auto_adjust=True, progress=False)
    if not df4h.empty:
        df4h.columns = [c[0] if isinstance(c, tuple) else c for c in df4h.columns]
        df4h.index = pd.to_datetime(df4h.index)
        df4h['RSI4H'] = rsi_hesapla(df4h['Close'], RSI_4H_PERIYOT)
        df4h['RSI4H_Egim'] = df4h['RSI4H'].diff(RSI_4H_EGIM)
        df = df.join(df4h[['RSI4H', 'RSI4H_Egim']], how='left').ffill()
    else:
        df['RSI4H'] = 50; df['RSI4H_Egim'] = 0

    df['HacimOrt'] = df['Volume'].rolling(HACIM_PERIYOT).mean()
    df.dropna(inplace=True)

    # Günlere ayır
    if df.index.tz:
        df['Date'] = df.index.tz_convert('Europe/Istanbul').date
    else:
        df['Date'] = df.index.date
    gunler = df['Date'].unique()

    nakit     = BASLANGIC
    islemler  = []
    equity    = []

    for gun in gunler:
        gun_df = df[df['Date'] == gun].copy()
        if len(gun_df) < 10: continue  # Çok az veri, atla

        # ─── Opening Range (10:00-10:30 TR = 07:00-07:30 UTC) ─────
        orb = gun_df.between_time(ORB_BASLANGIC, ORB_BITIS)
        if len(orb) < 2: continue

        orb_high = float(orb['High'].max())
        orb_low  = float(orb['Low'].min())
        orb_range = orb_high - orb_low

        if orb_range < 0.01: continue  # Çok dar aralık, atla

        # ─── ORB sonrası işlem penceresi (10:35-17:50 TR = 07:35-14:50 UTC) ─
        trade_df = gun_df.between_time('07:35', GUN_SONU)
        if len(trade_df) < 2: continue

        pozisyon  = 0.0
        giris_f   = 0.0
        giris_t   = None
        gun_kar   = 0

        for i in range(len(trade_df)):
            row   = trade_df.iloc[i]
            tarih = trade_df.index[i]
            fiyat = float(row['Close'])
            high  = float(row['High'])
            low   = float(row['Low'])
            hacim_ok = float(row['Volume']) > float(row['HacimOrt']) * HACIM_KATSAYI
            egim_ok  = float(row.get('RSI4H_Egim', 0)) > 0
            saat     = tarih.strftime('%H:%M')

            # ─── AL: High ORB_HIGH'ı kırdı + filtreler ───────────
            if pozisyon == 0 and high > orb_high * (1 + BREAKOUT_BUF):
                if hacim_ok and egim_ok:
                    pozisyon = nakit / fiyat
                    giris_f  = fiyat
                    giris_t  = tarih
                    nakit    = 0

            # ─── SAT: Low ORB_LOW'u kırdı (breakdown) ────────────
            elif pozisyon > 0 and low < orb_low:
                getiri = (fiyat - giris_f) / giris_f * 100
                nakit  = pozisyon * fiyat
                islemler.append({
                    'Tarih': giris_t.strftime('%m-%d'),
                    'Giriş': giris_t.strftime('%H:%M'),
                    'Çıkış': tarih.strftime('%H:%M'),
                    'G.Fiyat': round(giris_f, 2),
                    'Ç.Fiyat': round(fiyat, 2),
                    'ORB_H': round(orb_high, 2),
                    'ORB_L': round(orb_low, 2),
                    'Getiri%': round(getiri, 2),
                    'Tür': '📉Breakdown'
                })
                pozisyon = 0; giris_f = 0

            # ─── STOP LOSS ────────────────────────────────────────
            elif pozisyon > 0 and fiyat < giris_f * (1 - STOP_LOSS):
                getiri = (fiyat - giris_f) / giris_f * 100
                nakit  = pozisyon * fiyat
                islemler.append({
                    'Tarih': giris_t.strftime('%m-%d'),
                    'Giriş': giris_t.strftime('%H:%M'),
                    'Çıkış': tarih.strftime('%H:%M'),
                    'G.Fiyat': round(giris_f, 2),
                    'Ç.Fiyat': round(fiyat, 2),
                    'ORB_H': round(orb_high, 2),
                    'ORB_L': round(orb_low, 2),
                    'Getiri%': round(getiri, 2),
                    'Tür': '🛑Stop'
                })
                pozisyon = 0; giris_f = 0

            # ─── GÜN SONU KAPAT (14:45-14:55 UTC = 17:45-17:55 TR) ─
            if pozisyon > 0 and saat >= '14:45':
                getiri = (fiyat - giris_f) / giris_f * 100
                nakit  = pozisyon * fiyat
                islemler.append({
                    'Tarih': giris_t.strftime('%m-%d'),
                    'Giriş': giris_t.strftime('%H:%M'),
                    'Çıkış': tarih.strftime('%H:%M'),
                    'G.Fiyat': round(giris_f, 2),
                    'Ç.Fiyat': round(fiyat, 2),
                    'ORB_H': round(orb_high, 2),
                    'ORB_L': round(orb_low, 2),
                    'Getiri%': round(getiri, 2),
                    'Tür': '🔔Kapanış'
                })
                pozisyon = 0; giris_f = 0
                break  # Gün bitti

        # Gün sonunda pozisyon açık kaldıysa (kapanış sinyali atlandı) → kapat
        if pozisyon > 0:
            fiyat = float(gun_df['Close'].iloc[-1])
            nakit = pozisyon * fiyat
            pozisyon = 0
            giris_f = 0

        equity.append(nakit)

    toplam = nakit
    getiri_t = (toplam - BASLANGIC) / BASLANGIC * 100

    kapali   = islemler
    kazanan  = len([x for x in kapali if x['Getiri%'] > 0])
    kaz_oran = kazanan / len(kapali) * 100 if kapali else 0
    ort_kar  = np.mean([x['Getiri%'] for x in kapali]) if kapali else 0

    # Max drawdown
    if equity:
        eq = pd.Series([BASLANGIC] + equity)
        dd = ((eq - eq.cummax()) / eq.cummax() * 100).min()
    else:
        dd = 0

    stop_n = len([x for x in kapali if '🛑Stop' in x['Tür']])
    kapn_n = len([x for x in kapali if '🔔Kapanış' in x['Tür']])
    brkd_n = len([x for x in kapali if '📉Breakdown' in x['Tür']])

    print(f"\n  ✅ SONUÇLAR:")
    print(f"  Başlangıç:          {BASLANGIC:>12,.0f} TL")
    print(f"  Bitiş:              {toplam:>12,.0f} TL")
    print(f"  Toplam Getiri:      {getiri_t:>+11.2f}%")
    print(f"  Max Drawdown:       {dd:>+11.2f}%")
    print(f"  ──────────────────────────────────")
    print(f"  İşlem Sayısı:       {len(islemler):>12}")
    print(f"  Kazanma Oranı:      {kaz_oran:>11.0f}%")
    print(f"  Ort. Getiri/İşlem:  {ort_kar:>+11.2f}%")
    print(f"  Stop: {stop_n}x | Kapanış: {kapn_n}x | Breakdown: {brkd_n}x")

    if islemler:
        print(f"\n  Tüm İşlemler:")
        df_i = pd.DataFrame(islemler)
        print(df_i.to_string(index=False))

    return {
        'ticker': ticker, 'getiri': getiri_t, 'islem': len(islemler),
        'kaz_oran': kaz_oran, 'ort_kar': ort_kar, 'dd': dd,
        'stop': stop_n, 'portfoy': toplam
    }


if __name__ == '__main__':
    print("🚀 BIST ORB (Opening Range Breakout) — 60 Gün")
    print(f"Açılış Aralığı: 10:00-10:30 TR | Breakout tampon: %{BREAKOUT_BUF*100:.1f}")
    print(f"Filtre: 4H RSI eğimi ↑ + Hacim {HACIM_KATSAYI}x | Stop: %{STOP_LOSS*100:.0f} | Gün sonu kapat")

    sonuclar = []
    for t in HISSELER:
        s = backtest(t)
        if s: sonuclar.append(s)

    print(f"\n{'='*65}")
    print("📋 ÖZET — ORB vs Diğer Stratejiler")
    print(f"{'='*65}")
    print(f"{'Hisse':<12} {'Getiri':>8} {'İşlem':>7} {'Kazanma':>8} {'Ort.Kâr':>8} {'MaxDD':>7}")
    print(f"{'-'*60}")
    for s in sonuclar:
        print(f"{s['ticker']:<12} {s['getiri']:>7.2f}% {s['islem']:>7} "
              f"{s['kaz_oran']:>7.0f}% {s['ort_kar']:>7.2f}% {s['dd']:>6.1f}%")

    print(f"\n💡 Tüm Stratejiler:")
    print(f"   RSI Bot     → GARAN: +2.6% | KCHOL: +1.0% | TUPRS: -1.8%")
    print(f"   Hibrit Grid → GARAN: -1.9% | KCHOL: +1.1%")
    print(f"   VWAP Bounce → GARAN: -3.3% | KCHOL: -0.1% | TUPRS: -1.4% | ASELS: -3.0%")
    print(f"   ORB         → yukarıdaki sonuçlar")
