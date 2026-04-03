#!/usr/bin/env python3
"""
BIMAS-TUPRS Pairs Trading Backtest (5dk, Mart 2026)
Koentegrasyon bazlı pairs trading stratejisi
"""

import yfinance as yf
import numpy as np
import pandas as pd
from statsmodels.regression.linear_model import OLS
from statsmodels.tools import add_constant
from datetime import timedelta
import warnings
warnings.filterwarnings('ignore')

# ── Parametreler ──
T1 = 'BIMAS.IS'
T2 = 'TUPRS.IS'
START = '2026-03-01'
END = '2026-04-01'
INTERVAL = '5m'
INITIAL_CAPITAL = 100_000
POSITION_PCT = 0.10  # toplam %10, her bacak %5
ROLL_WINDOW = 20
Z_ENTRY = 2.0
Z_EXIT = 0.0
Z_STOP = 4.0

# ── Veri Çekme ──
print("📥 Veri indiriliyor...")
d1 = yf.download(T1, start=START, end=END, interval=INTERVAL, progress=False)
d2 = yf.download(T2, start=START, end=END, interval=INTERVAL, progress=False)

# Flatten multi-level columns if present
if isinstance(d1.columns, pd.MultiIndex):
    d1.columns = d1.columns.get_level_values(0)
if isinstance(d2.columns, pd.MultiIndex):
    d2.columns = d2.columns.get_level_values(0)

print(f"  {T1}: {len(d1)} bar")
print(f"  {T2}: {len(d2)} bar")

# Ortak index
df = pd.DataFrame({
    'bimas': d1['Close'],
    'tuprs': d2['Close']
}).dropna()

print(f"  Ortak bar sayısı: {len(df)}")

if len(df) < ROLL_WINDOW + 5:
    print("❌ Yeterli veri yok!")
    exit(1)

# ── Log fiyatlar ──
df['log_bimas'] = np.log(df['bimas'])
df['log_tuprs'] = np.log(df['tuprs'])

# ── Rolling OLS hedge ratio ──
hedge_ratios = pd.Series(index=df.index, dtype=float)
intercepts = pd.Series(index=df.index, dtype=float)

for i in range(ROLL_WINDOW, len(df)):
    window = df.iloc[i - ROLL_WINDOW:i]
    X = add_constant(window['log_tuprs'].values)
    y = window['log_bimas'].values
    model = OLS(y, X).fit()
    intercepts.iloc[i] = model.params[0]
    hedge_ratios.iloc[i] = model.params[1]

df['hedge'] = hedge_ratios
df['intercept'] = intercepts

# ── Spread ve Z-score ──
df['spread'] = df['log_bimas'] - df['hedge'] * df['log_tuprs']
df['spread_mean'] = df['spread'].rolling(ROLL_WINDOW).mean()
df['spread_std'] = df['spread'].rolling(ROLL_WINDOW).std()
df['zscore'] = (df['spread'] - df['spread_mean']) / df['spread_std']

# NaN'ları temizle
df = df.dropna(subset=['zscore', 'hedge'])

print(f"  İşlem yapılabilir bar: {len(df)}")
print(f"  Z-score aralığı: [{df['zscore'].min():.2f}, {df['zscore'].max():.2f}]")
print()

# ── Backtest ──
capital = INITIAL_CAPITAL
position = 0  # 0: yok, 1: long spread, -1: short spread
trades = []
current_trade = None
equity_curve = []

for idx, row in df.iterrows():
    z = row['zscore']
    bimas_price = row['bimas']
    tuprs_price = row['tuprs']
    
    # Pozisyon boyutu hesapla
    leg_capital = capital * (POSITION_PCT / 2)  # her bacak %5
    
    if position == 0:
        # Giriş sinyalleri
        if z >= Z_ENTRY:
            # Short spread: BIMAS sat, TUPRS al
            position = -1
            bimas_shares = leg_capital / bimas_price
            tuprs_shares = leg_capital / tuprs_price
            current_trade = {
                'entry_time': idx,
                'entry_zscore': z,
                'direction': 'Short Spread',
                'bimas_entry': bimas_price,
                'tuprs_entry': tuprs_price,
                'bimas_shares': bimas_shares,
                'tuprs_shares': tuprs_shares,
                'leg_capital': leg_capital,
            }
        elif z <= -Z_ENTRY:
            # Long spread: BIMAS al, TUPRS sat
            position = 1
            bimas_shares = leg_capital / bimas_price
            tuprs_shares = leg_capital / tuprs_price
            current_trade = {
                'entry_time': idx,
                'entry_zscore': z,
                'direction': 'Long Spread',
                'bimas_entry': bimas_price,
                'tuprs_entry': tuprs_price,
                'bimas_shares': bimas_shares,
                'tuprs_shares': tuprs_shares,
                'leg_capital': leg_capital,
            }
    else:
        # Çıkış sinyalleri
        exit_signal = False
        exit_reason = ''
        
        if position == -1:  # Short spread pozisyonunda
            if z <= Z_EXIT:
                exit_signal = True
                exit_reason = 'Z→0'
            elif z >= Z_STOP:
                exit_signal = True
                exit_reason = 'Stop Loss'
        elif position == 1:  # Long spread pozisyonunda
            if z >= -Z_EXIT:
                exit_signal = True
                exit_reason = 'Z→0'
            elif z <= -Z_STOP:
                exit_signal = True
                exit_reason = 'Stop Loss'
        
        if exit_signal and current_trade is not None:
            # PnL hesapla
            if position == -1:
                # Short spread: BIMAS short, TUPRS long
                bimas_pnl = current_trade['bimas_shares'] * (current_trade['bimas_entry'] - bimas_price)
                tuprs_pnl = current_trade['tuprs_shares'] * (tuprs_price - current_trade['tuprs_entry'])
            else:
                # Long spread: BIMAS long, TUPRS short
                bimas_pnl = current_trade['bimas_shares'] * (bimas_price - current_trade['bimas_entry'])
                tuprs_pnl = current_trade['tuprs_shares'] * (current_trade['tuprs_entry'] - tuprs_price)
            
            total_pnl = bimas_pnl + tuprs_pnl
            pnl_pct = (total_pnl / (2 * current_trade['leg_capital'])) * 100
            duration = idx - current_trade['entry_time']
            
            capital += total_pnl
            
            trades.append({
                'entry_time': current_trade['entry_time'],
                'exit_time': idx,
                'direction': current_trade['direction'],
                'entry_zscore': current_trade['entry_zscore'],
                'exit_zscore': z,
                'bimas_entry': current_trade['bimas_entry'],
                'bimas_exit': bimas_price,
                'tuprs_entry': current_trade['tuprs_entry'],
                'tuprs_exit': tuprs_price,
                'pnl': total_pnl,
                'pnl_pct': pnl_pct,
                'duration': duration,
                'exit_reason': exit_reason,
                'capital_after': capital,
            })
            
            position = 0
            current_trade = None
    
    equity_curve.append({'time': idx, 'equity': capital})

# ── Sonuçlar ──
equity_df = pd.DataFrame(equity_curve).set_index('time')

print("=" * 90)
print("📊 BIMAS-TUPRS PAIRS TRADING BACKTEST — MART 2026 (5dk)")
print("=" * 90)

if len(trades) == 0:
    print("\n⚠️  Hiç işlem gerçekleşmedi! Z-score ±2 seviyesine ulaşmadı.")
    print(f"  Z-score aralığı: [{df['zscore'].min():.2f}, {df['zscore'].max():.2f}]")
else:
    trades_df = pd.DataFrame(trades)
    
    total_return = ((capital - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100
    win_trades = trades_df[trades_df['pnl'] > 0]
    win_rate = len(win_trades) / len(trades_df) * 100
    
    # Max drawdown
    eq = equity_df['equity']
    running_max = eq.cummax()
    drawdown = (eq - running_max) / running_max * 100
    max_dd = drawdown.min()
    
    # Ortalama işlem süresi
    avg_duration = trades_df['duration'].mean()
    
    print(f"\n{'Parametre':<25} {'Değer':>15}")
    print("-" * 42)
    print(f"{'Başlangıç Sermaye':<25} {'₺{:,.0f}'.format(INITIAL_CAPITAL):>15}")
    print(f"{'Son Sermaye':<25} {'₺{:,.0f}'.format(capital):>15}")
    print(f"{'Toplam Getiri':<25} {'{:.2f}%'.format(total_return):>15}")
    print(f"{'İşlem Sayısı':<25} {len(trades_df):>15}")
    print(f"{'Kazanan İşlem':<25} {len(win_trades):>15}")
    print(f"{'Kaybeden İşlem':<25} {len(trades_df) - len(win_trades):>15}")
    print(f"{'Kazanma Oranı':<25} {'{:.1f}%'.format(win_rate):>15}")
    print(f"{'Max Drawdown':<25} {'{:.2f}%'.format(max_dd):>15}")
    print(f"{'Ort. İşlem Süresi':<25} {str(avg_duration):>15}")
    print(f"{'Ort. Kâr/İşlem':<25} {'₺{:,.2f}'.format(trades_df['pnl'].mean()):>15}")
    print(f"{'Max Kâr':<25} {'₺{:,.2f}'.format(trades_df['pnl'].max()):>15}")
    print(f"{'Max Zarar':<25} {'₺{:,.2f}'.format(trades_df['pnl'].min()):>15}")
    
    print(f"\n\n{'─' * 90}")
    print("İŞLEM DETAYLARI")
    print(f"{'─' * 90}")
    
    for i, t in trades_df.iterrows():
        print(f"\n🔹 İşlem #{i+1} — {t['direction']} | {t['exit_reason']}")
        print(f"   Giriş : {t['entry_time']}  |  Z={t['entry_zscore']:.2f}")
        print(f"   Çıkış : {t['exit_time']}  |  Z={t['exit_zscore']:.2f}")
        print(f"   BIMAS : {t['bimas_entry']:.2f} → {t['bimas_exit']:.2f}")
        print(f"   TUPRS : {t['tuprs_entry']:.2f} → {t['tuprs_exit']:.2f}")
        print(f"   K/Z   : ₺{t['pnl']:,.2f} ({t['pnl_pct']:.2f}%)")
        print(f"   Süre  : {t['duration']}")
        print(f"   Sermaye: ₺{t['capital_after']:,.0f}")
    
    # Özet satır (sessions_send için)
    summary = f"📊 BIMAS-TUPRS Pairs 5dk Backtest (Mart 2026): {total_return:+.2f}% | {len(trades_df)} işlem | {win_rate:.0f}% kazanma oranı | Max DD: {max_dd:.2f}%"
    print(f"\n\n{'=' * 90}")
    print(summary)
    print(f"{'=' * 90}")
    
    # Sonucu dosyaya da yaz
    with open('/Users/baykus/.openclaw/workspace/scripts/bist_pairs_5m_result.txt', 'w') as f:
        f.write(summary + '\n')
        f.write(f"Sermaye: ₺{INITIAL_CAPITAL:,.0f} → ₺{capital:,.0f}\n")
        f.write(f"İşlem sayısı: {len(trades_df)}\n")
        f.write(f"Kazanma oranı: {win_rate:.1f}%\n")
        f.write(f"Max Drawdown: {max_dd:.2f}%\n")

print("\n✅ Backtest tamamlandı.")
