#!/usr/bin/env python3
"""
BIST ORB Canlı Sinyal Üretici
Her sabah 10:35'te çalışır, opening range'i hesaplar, breakout varsa bildirir.

Çıktı: JSON formatında sinyal (cron agent tarafından WhatsApp'a iletilir)
"""

import yfinance as yf
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

HISSELER = ['KCHOL.IS', 'ASELS.IS', 'ASTOR.IS', 'TUPRS.IS', 'GARAN.IS', 'ISCTR.IS', 'YKBNK.IS']

RSI_4H_PERIYOT = 14
RSI_4H_EGIM    = 2
HACIM_PERIYOT  = 20
HACIM_KATSAYI  = 1.2
BREAKOUT_BUF   = 0.001
STOP_LOSS      = 0.03


def rsi_hesapla(close, p=14):
    d = close.diff()
    k = d.clip(lower=0).ewm(com=p-1, adjust=True).mean()
    l = (-d.clip(upper=0)).ewm(com=p-1, adjust=True).mean()
    return 100 - (100 / (1 + k/l))


def sinyal_uret(ticker):
    # 5dk veri (bugün dahil)
    df = yf.download(ticker, period='5d', interval='5m', auto_adjust=True, progress=False)
    if df.empty:
        return None
    df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
    df.index = pd.to_datetime(df.index)
    
    # 4H RSI eğimi
    df4h = yf.download(ticker, period='30d', interval='1h', auto_adjust=True, progress=False)
    egim_ok = False
    rsi4h_val = 50
    if not df4h.empty:
        df4h.columns = [c[0] if isinstance(c, tuple) else c for c in df4h.columns]
        df4h.index = pd.to_datetime(df4h.index)
        df4h['RSI4H'] = rsi_hesapla(df4h['Close'], RSI_4H_PERIYOT)
        df4h['RSI4H_Egim'] = df4h['RSI4H'].diff(RSI_4H_EGIM)
        if len(df4h) > 0:
            egim_ok = float(df4h['RSI4H_Egim'].iloc[-1]) > 0
            rsi4h_val = float(df4h['RSI4H'].iloc[-1])

    # Hacim ortalaması
    df['HacimOrt'] = df['Volume'].rolling(HACIM_PERIYOT).mean()

    # Bugünün verisini al
    if df.index.tz:
        bugun = df.index.tz_convert('Europe/Istanbul').date[-1]
        df['Date'] = df.index.tz_convert('Europe/Istanbul').date
    else:
        bugun = df.index.date[-1]
        df['Date'] = df.index.date
    
    bugun_df = df[df['Date'] == bugun]
    
    # Opening Range (07:00-07:30 UTC = 10:00-10:30 TR)
    orb = bugun_df.between_time('07:00', '07:30')
    if len(orb) < 2:
        return None

    orb_high = float(orb['High'].max())
    orb_low  = float(orb['Low'].min())
    orb_range = orb_high - orb_low
    son_fiyat = float(bugun_df['Close'].iloc[-1])
    son_hacim = float(bugun_df['Volume'].iloc[-1])
    hacim_ort = float(bugun_df['HacimOrt'].iloc[-1]) if not pd.isna(bugun_df['HacimOrt'].iloc[-1]) else 0
    hacim_ok  = son_hacim > hacim_ort * HACIM_KATSAYI

    hisse = ticker.replace('.IS', '')
    stop_fiyat = round(son_fiyat * (1 - STOP_LOSS), 2)
    
    # Breakout kontrolü
    if son_fiyat > orb_high * (1 + BREAKOUT_BUF) and egim_ok and hacim_ok:
        return {
            'hisse': hisse,
            'sinyal': 'AL',
            'fiyat': round(son_fiyat, 2),
            'orb_high': round(orb_high, 2),
            'orb_low': round(orb_low, 2),
            'orb_range': round(orb_range, 2),
            'stop': stop_fiyat,
            'hedef': round(son_fiyat * 1.02, 2),  # +%2 hedef
            'rsi4h': round(rsi4h_val, 1),
            'egim': '↑' if egim_ok else '↓',
            'hacim': '💪' if hacim_ok else '😴',
            'mesaj': f"📈 AL Sinyali: {hisse}\n"
                     f"Fiyat: {son_fiyat:.2f} TL (ORB High {orb_high:.2f} kırıldı!)\n"
                     f"ORB Range: {orb_low:.2f} - {orb_high:.2f}\n"
                     f"4H RSI: {rsi4h_val:.1f} (eğim ↑) | Hacim: güçlü\n"
                     f"🛑 Stop: {stop_fiyat:.2f} TL (%3)\n"
                     f"🎯 Hedef: {son_fiyat*1.02:.2f} TL (+%2)\n"
                     f"⏰ Gün sonu 17:30'da kapat"
        }
    
    # Breakdown — açık pozisyon varsa uyar
    elif son_fiyat < orb_low:
        return {
            'hisse': hisse,
            'sinyal': 'BREAKDOWN',
            'fiyat': round(son_fiyat, 2),
            'orb_low': round(orb_low, 2),
            'mesaj': f"📉 BREAKDOWN: {hisse}\n"
                     f"Fiyat: {son_fiyat:.2f} TL (ORB Low {orb_low:.2f} kırıldı!)\n"
                     f"Açık pozisyon varsa çık!"
        }
    
    else:
        return {
            'hisse': hisse,
            'sinyal': 'BEKLİYOR',
            'fiyat': round(son_fiyat, 2),
            'orb_high': round(orb_high, 2),
            'orb_low': round(orb_low, 2),
            'rsi4h': round(rsi4h_val, 1),
            'egim': '↑' if egim_ok else '↓',
            'hacim': '💪' if hacim_ok else '😴',
            'mesaj': f"⏳ {hisse}: Breakout bekleniyor\n"
                     f"Fiyat: {son_fiyat:.2f} | ORB: {orb_low:.2f}-{orb_high:.2f}\n"
                     f"4H RSI: {rsi4h_val:.1f} ({('↑' if egim_ok else '↓')}) | Hacim: {'güçlü' if hacim_ok else 'zayıf'}"
        }


if __name__ == '__main__':
    print("🔔 BIST ORB Canlı Sinyal — " + datetime.now().strftime('%Y-%m-%d %H:%M'))
    
    sinyaller = []
    al_var = False
    
    for t in HISSELER:
        s = sinyal_uret(t)
        if s:
            sinyaller.append(s)
            print(s['mesaj'])
            print('---')
            if s['sinyal'] == 'AL':
                al_var = True
    
    # Özet
    if al_var:
        al_listesi = [s for s in sinyaller if s['sinyal'] == 'AL']
        print("\n🚨 AKTİF AL SİNYALLERİ:")
        for s in al_listesi:
            print(f"  {s['hisse']}: {s['fiyat']} TL → Stop: {s['stop']} TL | Hedef: {s['hedef']} TL")
    else:
        print("\n⏳ Henüz breakout yok. Beklemedeyiz.")
