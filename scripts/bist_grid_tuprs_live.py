#!/usr/bin/env python3
"""
TUPRS Grid Bot — Canlı Sinyal
Hibrit: Grid seviyeleri + 4H RSI eğim filtresi + Hacim

Grid state'i dosyada tutulur (data/tuprs_grid_state.json)
"""

import yfinance as yf
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime

TICKER         = 'TUPRS.IS'
GRID_SEVIYE    = 10
GRID_ARALIK    = 0.02       # %2 seviye aralığı
SEVIYE_TL      = 10_000     # Seviye başı TL
HACIM_PERIYOT  = 20
HACIM_KATSAYI  = 1.2
RSI_4H_PERIYOT = 14
RSI_4H_EGIM    = 2
RSI_ACIL       = 85
STATE_FILE     = '/Users/baykus/.openclaw/workspace/data/tuprs_grid_state.json'


def rsi_hesapla(close, p=14):
    d = close.diff()
    k = d.clip(lower=0).ewm(com=p-1, adjust=True).mean()
    l = (-d.clip(upper=0)).ewm(com=p-1, adjust=True).mean()
    return 100 - (100 / (1 + k/l))


def grid_kur(merkez, n, aralik):
    return sorted([round(merkez*(1+i*aralik), 2) for i in range(-n//2, n//2+1)])


def grid_idx(fiyat, seviyeler):
    for i in range(len(seviyeler)-1):
        if seviyeler[i] <= fiyat <= seviyeler[i+1]: return i
    return -1 if fiyat < seviyeler[0] else len(seviyeler)


def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return None


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)


def main():
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    print(f"🤖 TUPRS Grid Bot — {now}")

    # Veri çek
    df = yf.download(TICKER, period='5d', interval='5m', auto_adjust=True, progress=False)
    if df.empty:
        print("❌ Veri alınamadı")
        return
    df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
    df.index = pd.to_datetime(df.index)

    fiyat = float(df['Close'].iloc[-1])

    # 4H RSI eğimi
    df4h = yf.download(TICKER, period='30d', interval='1h', auto_adjust=True, progress=False)
    egim_ok = False
    rsi4h = 50
    if not df4h.empty:
        df4h.columns = [c[0] if isinstance(c, tuple) else c for c in df4h.columns]
        df4h['RSI4H'] = rsi_hesapla(df4h['Close'], RSI_4H_PERIYOT)
        df4h['RSI4H_Egim'] = df4h['RSI4H'].diff(RSI_4H_EGIM)
        egim_ok = float(df4h['RSI4H_Egim'].iloc[-1]) > 0
        rsi4h = float(df4h['RSI4H'].iloc[-1])

    # Hacim
    df['HacimOrt'] = df['Volume'].rolling(HACIM_PERIYOT).mean()
    hacim_ok = float(df['Volume'].iloc[-1]) > float(df['HacimOrt'].iloc[-1]) * HACIM_KATSAYI

    # 5dk RSI
    df['RSI5M'] = rsi_hesapla(df['Close'], 14)
    rsi5m = float(df['RSI5M'].iloc[-1])

    # State yükle veya oluştur
    state = load_state()
    if state is None or abs(fiyat - state.get('merkez', 0)) / state.get('merkez', 1) > 0.10:
        # Yeni grid kur veya %10+ kayma varsa yenile
        seviyeler = grid_kur(fiyat, GRID_SEVIYE, GRID_ARALIK)
        state = {
            'merkez': fiyat,
            'seviyeler': seviyeler,
            'son_idx': grid_idx(fiyat, seviyeler),
            'pozisyonlar': {},  # {seviye_idx: giris_fiyat}
            'toplam_kar': 0,
            'islem_sayisi': 0,
            'kurulum': now
        }
        save_state(state)
        print(f"📐 Yeni grid kuruldu: {seviyeler[0]:.2f} — {seviyeler[-1]:.2f}")
        print(f"  Fiyat: {fiyat:.2f} | {len(seviyeler)} seviye")
        return

    seviyeler = state['seviyeler']
    son_idx = state['son_idx']
    pozisyonlar = state.get('pozisyonlar', {})
    guncel_idx = grid_idx(fiyat, seviyeler)

    sinyaller = []

    # Grid dışına çıktıysa yenile
    if fiyat < seviyeler[0]*0.96 or fiyat > seviyeler[-1]*1.04:
        # Açık pozisyonları kapat
        for si, gf in list(pozisyonlar.items()):
            kar = (fiyat - gf) / gf * 100
            sinyaller.append(f"🔄 Grid Yenileme SAT: TUPRS @ {fiyat:.2f} TL (giriş {gf:.2f}, {kar:+.1f}%)")
        state['seviyeler'] = grid_kur(fiyat, GRID_SEVIYE, GRID_ARALIK)
        state['merkez'] = fiyat
        state['pozisyonlar'] = {}
        state['son_idx'] = grid_idx(fiyat, state['seviyeler'])
        save_state(state)
        if sinyaller:
            for s in sinyaller: print(s)
        else:
            print(f"📐 Grid yenilendi: {state['seviyeler'][0]:.2f} — {state['seviyeler'][-1]:.2f}")
        return

    # RSI 85 acil çıkış
    if rsi5m >= RSI_ACIL and pozisyonlar:
        for si, gf in list(pozisyonlar.items()):
            kar = (fiyat - gf) / gf * 100
            sinyaller.append(f"🔥 ACİL SAT: TUPRS @ {fiyat:.2f} TL (RSI {rsi5m:.0f} ≥ 85! Giriş: {gf:.2f}, {kar:+.1f}%)")
            state['toplam_kar'] += (fiyat - gf)
            state['islem_sayisi'] += 1
        state['pozisyonlar'] = {}

    # Grid seviyeleri arası hareket
    elif guncel_idx != son_idx:
        # Fiyat DÜŞTÜ → AL (eğim + hacim filtresi)
        if guncel_idx < son_idx:
            for si in range(guncel_idx, son_idx):
                si_str = str(si)
                if si >= 0 and si_str not in pozisyonlar:
                    if egim_ok and hacim_ok:
                        pozisyonlar[si_str] = fiyat
                        sinyaller.append(
                            f"📈 GRID AL: TUPRS @ {fiyat:.2f} TL\n"
                            f"   Seviye: {si+1}/{len(seviyeler)} | 4H RSI: {rsi4h:.1f} (↑) | Hacim: 💪\n"
                            f"   Grid: {seviyeler[0]:.2f} — {seviyeler[-1]:.2f}"
                        )
                    else:
                        reason = []
                        if not egim_ok: reason.append("4H RSI eğimi ↓")
                        if not hacim_ok: reason.append("hacim zayıf")
                        # Sessiz — filtre engelledi

        # Fiyat YUKSELDI → SAT
        elif guncel_idx > son_idx:
            for si in range(son_idx, guncel_idx):
                si_str = str(si)
                if si_str in pozisyonlar:
                    gf = pozisyonlar[si_str]
                    kar = (fiyat - gf) / gf * 100
                    state['toplam_kar'] += (fiyat - gf)
                    state['islem_sayisi'] += 1
                    sinyaller.append(
                        f"✅ GRID SAT: TUPRS @ {fiyat:.2f} TL\n"
                        f"   Giriş: {gf:.2f} | Kâr: {kar:+.1f}% | Toplam: {state['islem_sayisi']} işlem"
                    )
                    del pozisyonlar[si_str]

    state['son_idx'] = guncel_idx
    state['pozisyonlar'] = pozisyonlar
    save_state(state)

    if sinyaller:
        for s in sinyaller:
            print(s)
            print('---')
    else:
        acik = len(pozisyonlar)
        print(f"⏳ TUPRS: {fiyat:.2f} TL | Grid seviye: {guncel_idx+1}/{len(seviyeler)} | Açık poz: {acik}")
        print(f"   4H RSI: {rsi4h:.1f} ({('↑' if egim_ok else '↓')}) | Hacim: {'💪' if hacim_ok else '😴'} | Toplam işlem: {state['islem_sayisi']}")


if __name__ == '__main__':
    main()
