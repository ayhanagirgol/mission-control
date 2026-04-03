#!/usr/bin/env python3
"""
BIST Pairs Trading — BIMAS-TUPRS Canlı Sinyal
Z-score bazlı: ±2 giriş, 0 çıkış
"""

import yfinance as yf
import numpy as np
import pandas as pd
import json, os
from datetime import datetime
from statsmodels.regression.linear_model import OLS
from statsmodels.tools import add_constant

T1, T2 = 'BIMAS.IS', 'TUPRS.IS'
ISIM = 'BIMAS-TUPRS'
PENCERE = 20
ZSCORE_GIRIS = 2.0
ZSCORE_CIKIS = 0.0
STATE_FILE = '/Users/baykus/.openclaw/workspace/data/pairs_bimas_tuprs_state.json'

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f: return json.load(f)
    return {'pozisyon': 0, 'giris_tarih': None, 'giris_zscore': 0, 'islem_sayisi': 0}

def save_state(s):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f: json.dump(s, f, indent=2)

def main():
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    print(f'🔬 {ISIM} Pairs Signal — {now}')

    d1 = yf.download(T1, period='60d', interval='1d', auto_adjust=True, progress=False)
    d2 = yf.download(T2, period='60d', interval='1d', auto_adjust=True, progress=False)
    if d1.empty or d2.empty:
        print('❌ Veri alınamadı')
        return

    d1.columns = [c[0] if isinstance(c, tuple) else c for c in d1.columns]
    d2.columns = [c[0] if isinstance(c, tuple) else c for c in d2.columns]

    df = pd.DataFrame({'A': np.log(d1['Close']), 'B': np.log(d2['Close'])}).dropna()

    # Rolling hedge ratio
    df['hedge'] = np.nan
    for i in range(PENCERE, len(df)):
        w = df.iloc[i-PENCERE:i]
        model = OLS(w['A'], add_constant(w['B'])).fit()
        df.iloc[i, df.columns.get_loc('hedge')] = model.params.iloc[1]

    df['spread'] = df['A'] - df['hedge'] * df['B']
    df['spread_mean'] = df['spread'].rolling(PENCERE).mean()
    df['spread_std'] = df['spread'].rolling(PENCERE).std()
    df['zscore'] = (df['spread'] - df['spread_mean']) / df['spread_std']
    df.dropna(inplace=True)

    z = float(df['zscore'].iloc[-1])
    z_prev = float(df['zscore'].iloc[-2])
    f_bimas = float(np.exp(df['A'].iloc[-1]))
    f_tuprs = float(np.exp(df['B'].iloc[-1]))
    hedge = float(df['hedge'].iloc[-1])

    state = load_state()
    poz = state['pozisyon']

    print(f'  BIMAS: {f_bimas:.2f} TL | TUPRS: {f_tuprs:.2f} TL')
    print(f'  Z-score: {z:.2f} (önceki: {z_prev:.2f}) | Hedge: {hedge:.3f}')
    print(f'  Pozisyon: {"YOK" if poz == 0 else ("Long Spread" if poz == 1 else "Short Spread")}')

    sinyal = None

    # Giriş sinyalleri
    if poz == 0:
        if z >= ZSCORE_GIRIS:
            sinyal = (f'📈 PAIRS AL SİNYALİ: {ISIM}\n'
                      f'Z-score: {z:.2f} (≥{ZSCORE_GIRIS})\n'
                      f'→ BIMAS SAT (short) @ {f_bimas:.2f} TL\n'
                      f'→ TUPRS AL (long) @ {f_tuprs:.2f} TL\n'
                      f'Hedge ratio: {hedge:.3f}\n'
                      f'Çıkış hedefi: Z-score → 0\n'
                      f'⏰ Onay bekleniyor')
            state['pozisyon'] = -1
            state['giris_tarih'] = now
            state['giris_zscore'] = z

        elif z <= -ZSCORE_GIRIS:
            sinyal = (f'📈 PAIRS AL SİNYALİ: {ISIM}\n'
                      f'Z-score: {z:.2f} (≤-{ZSCORE_GIRIS})\n'
                      f'→ BIMAS AL (long) @ {f_bimas:.2f} TL\n'
                      f'→ TUPRS SAT (short) @ {f_tuprs:.2f} TL\n'
                      f'Hedge ratio: {hedge:.3f}\n'
                      f'Çıkış hedefi: Z-score → 0\n'
                      f'⏰ Onay bekleniyor')
            state['pozisyon'] = 1
            state['giris_tarih'] = now
            state['giris_zscore'] = z

    # Çıkış sinyalleri
    elif poz != 0:
        if (poz == -1 and z <= ZSCORE_CIKIS) or (poz == 1 and z >= ZSCORE_CIKIS):
            sinyal = (f'✅ PAIRS ÇIKIŞ SİNYALİ: {ISIM}\n'
                      f'Z-score: {z:.2f} (→ 0 hedefine ulaştı)\n'
                      f'Giriş: {state["giris_tarih"]} (Z={state["giris_zscore"]:.2f})\n'
                      f'→ Tüm pozisyonları kapat!\n'
                      f'BIMAS: {f_bimas:.2f} TL | TUPRS: {f_tuprs:.2f} TL')
            state['pozisyon'] = 0
            state['islem_sayisi'] += 1

    save_state(state)

    if sinyal:
        print(f'\n🚨 {sinyal}')
    else:
        z_mesafe = min(abs(z - ZSCORE_GIRIS), abs(z + ZSCORE_GIRIS)) if poz == 0 else abs(z)
        print(f'\n⏳ Sinyal yok. Z-score: {z:.2f} | Giriş eşiğine mesafe: {z_mesafe:.2f}')

if __name__ == '__main__':
    main()
