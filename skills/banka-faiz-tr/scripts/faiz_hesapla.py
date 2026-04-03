#!/usr/bin/env python3
"""
faiz_hesapla.py — Türkiye Banka Mevduat Faiz Hesaplayıcı
Son güncelleme: Mart 2026

⚠️  Yatırım tavsiyesi değildir.
    Oranlar gösterge niteliğindedir; bankayı doğrulayın.
💼  Kurumsal nakit yönetimi: finhouse.ai
"""

import argparse
import sys

# ─────────────────────────────────────────────────────────────
# BANKA VERİTABANI  (Mart 2026 gösterge oranları, yıllık brüt %)
# ─────────────────────────────────────────────────────────────
BANKALAR = {
    # KAMU BANKALARI
    "ziraat": {
        "ad": "Ziraat Bankası", "tur": "kamu",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.50, "3ay": 2.00, "6ay": 2.25, "1yil": 2.50},
    },
    "halkbank": {
        "ad": "Halkbank", "tur": "kamu",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 37.00, "1ay": 40.50, "3ay": 43.00, "6ay": 43.50, "1yil": 44.00},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.25, "3ay": 1.75, "6ay": 2.00, "1yil": 2.25},
    },
    "vakifbank": {
        "ad": "Vakıfbank", "tur": "kamu",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 37.00, "1ay": 40.50, "3ay": 43.00, "6ay": 43.50, "1yil": 44.00},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.25, "3ay": 1.75, "6ay": 2.00, "1yil": 2.25},
    },
    # ÖZEL BANKALAR
    "isbank": {
        "ad": "İş Bankası", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 42.00, "3ay": 44.00, "6ay": 44.50, "1yil": 45.00},
        "usd_faiz": {"1ay": 2.75, "3ay": 3.25, "6ay": 3.50, "1yil": 3.75},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "garanti": {
        "ad": "Garanti BBVA", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.50, "1ay": 42.00, "3ay": 44.00, "6ay": 44.50, "1yil": 45.00},
        "usd_faiz": {"1ay": 2.75, "3ay": 3.25, "6ay": 3.50, "1yil": 3.75},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "yapikredi": {
        "ad": "Yapı Kredi", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 42.00, "3ay": 44.00, "6ay": 44.50, "1yil": 45.00},
        "usd_faiz": {"1ay": 2.75, "3ay": 3.25, "6ay": 3.50, "1yil": 3.75},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "akbank": {
        "ad": "Akbank", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 42.00, "3ay": 44.00, "6ay": 44.50, "1yil": 45.00},
        "usd_faiz": {"1ay": 2.75, "3ay": 3.25, "6ay": 3.50, "1yil": 3.75},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "qnb": {
        "ad": "QNB Finansbank", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 39.00, "1ay": 43.00, "3ay": 46.00, "6ay": 46.50, "1yil": 47.00},
        "usd_faiz": {"1ay": 3.00, "3ay": 3.50, "6ay": 3.75, "1yil": 4.00},
        "eur_faiz": {"1ay": 2.00, "3ay": 2.50, "6ay": 2.75, "1yil": 3.00},
    },
    "denizbank": {
        "ad": "Denizbank", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 42.00, "3ay": 44.50, "6ay": 45.00, "1yil": 45.50},
        "usd_faiz": {"1ay": 2.75, "3ay": 3.25, "6ay": 3.50, "1yil": 3.75},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "teb": {
        "ad": "TEB", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 37.50, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.50, "3ay": 2.00, "6ay": 2.25, "1yil": 2.50},
    },
    "ing": {
        "ad": "ING Bank", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 37.00, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.50, "3ay": 2.00, "6ay": 2.25, "1yil": 2.50},
    },
    "hsbc": {
        "ad": "HSBC", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 36.00, "1ay": 40.00, "3ay": 42.50, "6ay": 43.00, "1yil": 43.50},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.25, "3ay": 1.75, "6ay": 2.00, "1yil": 2.25},
    },
    "sekerbank": {
        "ad": "Şekerbank", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 37.00, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.50, "3ay": 2.00, "6ay": 2.25, "1yil": 2.50},
    },
    "fibabanka": {
        "ad": "Fibabanka", "tur": "özel",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 40.00, "1ay": 44.00, "3ay": 46.50, "6ay": 47.00, "1yil": 47.50},
        "usd_faiz": {"1ay": 3.00, "3ay": 3.50, "6ay": 3.75, "1yil": 4.00},
        "eur_faiz": {"1ay": 2.00, "3ay": 2.50, "6ay": 2.75, "1yil": 3.00},
    },
    # DİJİTAL / NEO BANKALAR
    "enpara": {
        "ad": "Enpara (QNB)", "tur": "dijital",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 40.00, "1ay": 44.00, "3ay": 47.00, "6ay": 47.50, "1yil": 48.00},
        "usd_faiz": {"1ay": 3.00, "3ay": 3.75, "6ay": 4.00, "1yil": 4.25},
        "eur_faiz": {"1ay": 2.00, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
    },
    "papara": {
        "ad": "Papara", "tur": "dijital",
        "tl_faiz":  {"vadesiz": 30.00, "1hafta": 0.0, "1ay": 44.00, "3ay": 46.00, "6ay": 46.50, "1yil": 0.0},
        "usd_faiz": {},
        "eur_faiz": {},
    },
    "on": {
        "ad": "ON (Halkbank)", "tur": "dijital",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 38.00, "1ay": 42.00, "3ay": 44.50, "6ay": 45.00, "1yil": 45.50},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {},
    },
    # KATILIM BANKALARI
    "ziraatkatilim": {
        "ad": "Ziraat Katılım", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.25, "3ay": 1.75, "6ay": 2.00, "1yil": 2.25},
    },
    "vakifkatilim": {
        "ad": "Vakıf Katılım", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.25, "3ay": 1.75, "6ay": 2.00, "1yil": 2.25},
    },
    "kuveytturk": {
        "ad": "Kuveyt Türk", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 42.00, "3ay": 44.50, "6ay": 45.00, "1yil": 45.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "turkiyefinans": {
        "ad": "Türkiye Finans", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 42.00, "3ay": 44.50, "6ay": 45.00, "1yil": 45.50},
        "usd_faiz": {"1ay": 2.50, "3ay": 3.00, "6ay": 3.25, "1yil": 3.50},
        "eur_faiz": {"1ay": 1.75, "3ay": 2.25, "6ay": 2.50, "1yil": 2.75},
    },
    "albaraka": {
        "ad": "Albaraka Türk", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 41.50, "3ay": 44.00, "6ay": 44.50, "1yil": 45.00},
        "usd_faiz": {"1ay": 2.25, "3ay": 2.75, "6ay": 3.00, "1yil": 3.25},
        "eur_faiz": {"1ay": 1.50, "3ay": 2.00, "6ay": 2.25, "1yil": 2.50},
    },
    "emlakkatilim": {
        "ad": "Emlak Katılım", "tur": "katılım",
        "tl_faiz":  {"vadesiz": 0.0, "1hafta": 0.0, "1ay": 41.00, "3ay": 43.50, "6ay": 44.00, "1yil": 44.50},
        "usd_faiz": {"1ay": 2.00, "3ay": 2.50, "6ay": 2.75, "1yil": 3.00},
        "eur_faiz": {},
    },
}

# ─────────────────────────────────────────────────────────────
# STOPAJ ORANLARI
# ─────────────────────────────────────────────────────────────
STOPAJ_TL = {
    "vadesiz": 0.15, "1hafta": 0.15, "1ay": 0.15, "3ay": 0.15,
    "6ay": 0.12, "1yil": 0.10
}
STOPAJ_DOVIZ = 0.18   # USD ve EUR için

# Vade → gün sayısı eşlemesi
VADE_GUN = {
    "vadesiz": 1, "1hafta": 7, "1ay": 32, "3ay": 92, "6ay": 181, "1yil": 365
}

# ─────────────────────────────────────────────────────────────
# YARDIMCI FONKSİYONLAR
# ─────────────────────────────────────────────────────────────

def fmt_tl(x):
    """₺ formatı: 12.345,67"""
    return f"₺{x:>10,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

def fmt_usd(x):
    """$ formatı"""
    return f"${x:>10,.2f}"

def fmt_pct(x):
    return f"%{x:.2f}"

def hesapla(tutar, faiz_oran, vade, doviz=False):
    """Brüt faiz, stopaj ve net faiz hesapla."""
    gun = VADE_GUN.get(vade, 0)
    if gun == 0:
        return None
    if faiz_oran == 0:
        return (0.0, 0.0, 0.0)
    stopaj_oran = STOPAJ_DOVIZ if doviz else STOPAJ_TL.get(vade, 0.15)
    brut = tutar * (faiz_oran / 100) * (gun / 365)
    stopaj = brut * stopaj_oran
    net = brut - stopaj
    return (brut, stopaj, net)

def normalize_vade(v):
    """Kullanıcı girişini normalize et: '3ay' → '3ay', '1yil' → '1yil'"""
    v = v.lower().strip()
    mapping = {
        "vadesiz": "vadesiz",
        "1h": "1hafta", "1hafta": "1hafta", "hafta": "1hafta",
        "1a": "1ay", "1ay": "1ay", "ay": "1ay",
        "3a": "3ay", "3ay": "3ay",
        "6a": "6ay", "6ay": "6ay",
        "1y": "1yil", "1yil": "1yil", "yil": "1yil",
    }
    return mapping.get(v, v)

def get_faiz_dict(banka_data, doviz=None):
    if doviz == "usd":
        return banka_data.get("usd_faiz", {})
    elif doviz == "eur":
        return banka_data.get("eur_faiz", {})
    else:
        return banka_data.get("tl_faiz", {})

def para_birimi_symbol(doviz):
    if doviz == "usd":
        return ("$", fmt_usd)
    elif doviz == "eur":
        return ("€", lambda x: f"€{x:>10,.2f}")
    return ("₺", fmt_tl)

# ─────────────────────────────────────────────────────────────
# KOMUT 1: Tüm bankalarda tek vade karşılaştırma
# ─────────────────────────────────────────────────────────────

def karsilastir_tum_bankalar(tutar, vade, doviz=None):
    symbol, fmt = para_birimi_symbol(doviz)
    vade_n = normalize_vade(vade)
    stopaj_oran_bilgi = STOPAJ_DOVIZ * 100 if doviz else STOPAJ_TL.get(vade_n, 0.15) * 100
    print()
    print(f"💰 Vadeli Mevduat Karşılaştırma — {tutar:,.0f} {symbol} × {vade}")
    print(f"   Stopaj: %{stopaj_oran_bilgi:.0f} ({vade} vade{'  |  döviz hesabı' if doviz else ''})")
    print()
    print(f"{'Banka':<20} {'Tür':<10} {'Faiz %':>8} {'Brüt':>13} {'Stopaj':>13} {'Net':>13}")
    print("─" * 80)

    sonuclar = []
    for key, b in BANKALAR.items():
        fd = get_faiz_dict(b, doviz)
        oran = fd.get(vade_n, 0)
        if oran == 0:
            continue
        res = hesapla(tutar, oran, vade_n, doviz=bool(doviz))
        if res:
            brut, stop, net = res
            sonuclar.append((b["ad"], b["tur"], oran, brut, stop, net))

    sonuclar.sort(key=lambda x: -x[5])  # Net'e göre sırala

    for ad, tur, oran, brut, stop, net in sonuclar:
        print(f"{ad:<20} {tur:<10} {fmt_pct(oran):>8} {fmt(brut):>13} {fmt(stop):>13} {fmt(net):>13}")

    if not sonuclar:
        print("  Bu vade için veri bulunamadı.")
    print()
    _disclaimer()


# ─────────────────────────────────────────────────────────────
# KOMUT 2: Tek banka, tüm vadeler
# ─────────────────────────────────────────────────────────────

def banka_tum_vadeler(banka_key, tutar, doviz=None):
    symbol, fmt = para_birimi_symbol(doviz)
    key = banka_key.lower().strip()
    # Kısmi eşleşme
    matched = [k for k in BANKALAR if key in k or k in key]
    if not matched:
        print(f"❌ '{banka_key}' adında banka bulunamadı.")
        print(f"   Mevcut: {', '.join(BANKALAR.keys())}")
        return
    b = BANKALAR[matched[0]]
    fd = get_faiz_dict(b, doviz)
    print()
    print(f"🏦 {b['ad']} — {tutar:,.0f} {symbol} | Tüm Vadeler")
    print()
    print(f"{'Vade':<12} {'Faiz %':>8} {'Brüt':>13} {'Stopaj':>13} {'Net':>13} {'Net Oran':>10}")
    print("─" * 65)
    for vade in ["vadesiz", "1hafta", "1ay", "3ay", "6ay", "1yil"]:
        oran = fd.get(vade, 0)
        if oran == 0:
            continue
        res = hesapla(tutar, oran, vade, doviz=bool(doviz))
        if res:
            brut, stop, net = res
            s_oran = STOPAJ_DOVIZ if doviz else STOPAJ_TL.get(vade, 0.15)
            net_oran = oran * (1 - s_oran)
            print(f"{vade:<12} {fmt_pct(oran):>8} {fmt(brut):>13} {fmt(stop):>13} {fmt(net):>13} {fmt_pct(net_oran):>10}")
    print()
    _disclaimer()


# ─────────────────────────────────────────────────────────────
# KOMUT 3: Seçili bankalar yan yana
# ─────────────────────────────────────────────────────────────

def secili_bankalar_karsilastir(banka_listesi, vade, tutar, doviz=None):
    symbol, fmt = para_birimi_symbol(doviz)
    vade_n = normalize_vade(vade)
    bankalar = [b.strip() for b in banka_listesi.split(",")]
    print()
    print(f"📊 Seçili Banka Karşılaştırması — {tutar:,.0f} {symbol} × {vade}")
    print()
    print(f"{'Banka':<20} {'Faiz %':>8} {'Brüt':>13} {'Stopaj':>13} {'Net':>13}")
    print("─" * 70)
    for bk in bankalar:
        matched = [k for k in BANKALAR if bk.lower() in k or k in bk.lower()]
        if not matched:
            print(f"  ❌ '{bk}' bulunamadı")
            continue
        b = BANKALAR[matched[0]]
        fd = get_faiz_dict(b, doviz)
        oran = fd.get(vade_n, 0)
        if oran == 0:
            print(f"  ⚠️  {b['ad']:<18} bu vade için veri yok")
            continue
        res = hesapla(tutar, oran, vade_n, doviz=bool(doviz))
        if res:
            brut, stop, net = res
            print(f"{b['ad']:<20} {fmt_pct(oran):>8} {fmt(brut):>13} {fmt(stop):>13} {fmt(net):>13}")
    print()
    _disclaimer()


# ─────────────────────────────────────────────────────────────
# KOMUT 4: En yüksek faiz sıralaması
# ─────────────────────────────────────────────────────────────

def en_yuksek(vade, doviz=None, limit=10):
    symbol, _ = para_birimi_symbol(doviz)
    vade_n = normalize_vade(vade)
    print()
    print(f"🏆 En Yüksek Faiz — {vade} vade ({symbol})")
    print()
    print(f"{'#':<4} {'Banka':<22} {'Tür':<10} {'Brüt Faiz':>12} {'Net Faiz (eff)':>15}")
    print("─" * 65)
    sonuclar = []
    for key, b in BANKALAR.items():
        fd = get_faiz_dict(b, doviz)
        oran = fd.get(vade_n, 0)
        if oran == 0:
            continue
        s_oran = STOPAJ_DOVIZ if doviz else STOPAJ_TL.get(vade_n, 0.15)
        net_oran = oran * (1 - s_oran)
        sonuclar.append((b["ad"], b["tur"], oran, net_oran))
    sonuclar.sort(key=lambda x: -x[2])
    for i, (ad, tur, oran, net_oran) in enumerate(sonuclar[:limit], 1):
        medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f" {i}."
        print(f"{medal:<4} {ad:<22} {tur:<10} {fmt_pct(oran):>12} {fmt_pct(net_oran):>15}")
    print()
    _disclaimer()


# ─────────────────────────────────────────────────────────────
# KOMUT 5: Döviz mevduat karşılaştırma (alias — yukarıda ele alınıyor)
# ─────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────
# KOMUT 6: Merdiven stratejisi
# ─────────────────────────────────────────────────────────────

def merdiven_stratejisi(tutar, banka_key="enpara"):
    """Faiz merdivenini hesapla ve öner."""
    # En yüksek TL faizli banka seç
    dilimler = [
        ("1ay",  0.20, "Acil likidite rezervi"),
        ("3ay",  0.30, "Kısa vadeli getiri"),
        ("6ay",  0.25, "Orta vadeli kilit"),
        ("1yil", 0.25, "Uzun vade / faiz düşüşüne karşı sigorta"),
    ]
    print()
    print(f"🪜 Merdiven Stratejisi — {tutar:,.0f} TL")
    print(f"   Banka: En yüksek faizli seçenek (her vade için)")
    print()
    print(f"{'Basamak':<10} {'Tutar':>14} {'Vade':<8} {'Faiz %':>8} {'Net Getiri':>13} {'Açıklama'}")
    print("─" * 80)
    toplam_net = 0
    for vade, oran, aciklama in dilimler:
        dilim_tutar = tutar * oran
        # O vade için en yüksek oranı bul
        en_iyi = max(
            ((b["ad"], b["tl_faiz"].get(vade, 0)) for b in BANKALAR.values()),
            key=lambda x: x[1]
        )
        banka_ad, banka_faiz = en_iyi
        if banka_faiz == 0:
            continue
        res = hesapla(dilim_tutar, banka_faiz, vade)
        if res:
            brut, stop, net = res
            toplam_net += net
            print(f"{vade:<10} {fmt_tl(dilim_tutar):>14} {vade:<8} {fmt_pct(banka_faiz):>8} {fmt_tl(net):>13}  {aciklama}")
            print(f"{'':10} {'→ ' + banka_ad:<14}")
    print("─" * 80)
    print(f"{'TOPLAM':10} {fmt_tl(tutar):>14} {'':8} {'':8} {fmt_tl(toplam_net):>13}  Net Faiz Geliri")
    print(f"{'':10} {'Ağırlıklı yıllık net oran:':35} {fmt_pct(toplam_net / tutar * 100):>10}")
    print()
    print("💡 Strateji: Her basamak vadesi dolduğunda bir sonraki uygun vadeye yenile.")
    print("   Faiz düşüyorsa → uzun vadeye geç | Faiz yükseliyorsa → kısa vadede kal")
    print()
    _disclaimer()


# ─────────────────────────────────────────────────────────────
# DISCLAIMER
# ─────────────────────────────────────────────────────────────

def _disclaimer():
    print("─" * 55)
    print("⚠️  Oranlar gösterge niteliğindedir (Mart 2026).")
    print("   Gerçek oranlar için bankayı doğrulayın.")
    print("   Yatırım tavsiyesi değildir.")
    print("💼 Kurumsal nakit yönetimi: finhouse.ai")
    print()


# ─────────────────────────────────────────────────────────────
# ANA PARSER
# ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="🏦 Türkiye Banka Mevduat Faiz Hesaplayıcı — Mart 2026",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python3 faiz_hesapla.py --tutar 100000 --vade 3ay
  python3 faiz_hesapla.py --banka ziraat --tutar 500000
  python3 faiz_hesapla.py --karsilastir ziraat,garanti,akbank --vade 6ay --tutar 200000
  python3 faiz_hesapla.py --en-yuksek --vade 1yil
  python3 faiz_hesapla.py --doviz usd --tutar 10000 --vade 3ay
  python3 faiz_hesapla.py --merdiven 500000

⚠️  Yatırım tavsiyesi değildir | 💼 finhouse.ai
        """
    )
    parser.add_argument("--tutar", type=float, help="Mevduat tutarı (TL veya döviz)")
    parser.add_argument("--vade", type=str, help="Vade: vadesiz/1hafta/1ay/3ay/6ay/1yil")
    parser.add_argument("--banka", type=str, help="Banka adı/kısaltması (tüm vadeler için)")
    parser.add_argument("--karsilastir", type=str, help="Virgülle ayrılmış banka listesi")
    parser.add_argument("--en-yuksek", action="store_true", help="En yüksek faizli bankalar")
    parser.add_argument("--doviz", type=str, choices=["usd", "eur"], help="Döviz mevduatı")
    parser.add_argument("--merdiven", type=float, help="Merdiven stratejisi için tutar")
    parser.add_argument("--liste", action="store_true", help="Tüm bankaları listele")

    args = parser.parse_args()

    if args.liste:
        print("\n📋 Desteklenen Bankalar:")
        for k, v in BANKALAR.items():
            print(f"  {k:<20} → {v['ad']} ({v['tur']})")
        print()
        return

    if args.merdiven:
        merdiven_stratejisi(args.merdiven)
        return

    if args.en_yuksek:
        vade = normalize_vade(args.vade) if args.vade else "3ay"
        en_yuksek(vade, doviz=args.doviz)
        return

    if args.banka:
        tutar = args.tutar or 100000
        banka_tum_vadeler(args.banka, tutar, doviz=args.doviz)
        return

    if args.karsilastir:
        if not args.vade or not args.tutar:
            print("❌ --karsilastir için --vade ve --tutar gereklidir.")
            sys.exit(1)
        secili_bankalar_karsilastir(args.karsilastir, args.vade, args.tutar, doviz=args.doviz)
        return

    if args.tutar and args.vade:
        karsilastir_tum_bankalar(args.tutar, args.vade, doviz=args.doviz)
        return

    # Hiçbir argüman verilmezse: yardım göster
    parser.print_help()
    print("\n💡 Hızlı başlangıç: python3 faiz_hesapla.py --tutar 100000 --vade 3ay")


if __name__ == "__main__":
    main()
