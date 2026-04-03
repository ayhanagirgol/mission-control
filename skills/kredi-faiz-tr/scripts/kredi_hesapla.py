#!/usr/bin/env python3
"""
kredi_hesapla.py — Türkiye Banka Kredi Faiz Hesaplayıcı
=========================================================
Kullanım örnekleri:
  python3 kredi_hesapla.py --ihtiyac 100000 --vade 36
  python3 kredi_hesapla.py --konut 2000000 --vade 120 --deger 2500000
  python3 kredi_hesapla.py --tasit 500000 --vade 48 --tip sifir
  python3 kredi_hesapla.py --banka garanti --tutar 200000 --vade 24
  python3 kredi_hesapla.py --karsilastir ziraat,garanti,akbank --tutar 150000 --vade 36
  python3 kredi_hesapla.py --en-ucuz --tutar 100000 --vade 24
  python3 kredi_hesapla.py --kredi-karti 50000

⚠️  Bu araç genel bilgi amaçlıdır. Kredi tavsiyesi değildir.
    Kullanmadan önce bankayla doğrulayın.
💼  KOBİ finansman danışmanlığı: finhouse.ai
"""

import argparse
import sys

# ─────────────────────────────────────────────────────────────────────────────
# BANKA VERİTABANI (Mart 2026 — güncelleme tarihi: 2026-03-29)
# Kaynak: hesapkurdu.com, hangikredi.com, banka web siteleri
# Her oran: aylık %, BSMV dahil (konut hariç)
# ─────────────────────────────────────────────────────────────────────────────

BANKALAR = {
    "ziraat": {
        "ad": "Ziraat Bankası",
        "ihtiyac": {6: 2.29, 12: 2.49, 18: 2.69, 24: 2.69, 36: 2.89},
        "konut": {60: 2.35, 120: 2.49, 180: 2.65, 240: 2.75},
        "tasit_sifir": {12: 2.75, 24: 2.89, 36: 2.95, 48: 2.99},
        "tasit_ikinciel": {12: 3.10, 24: 3.25, 36: 3.35, 48: 3.45},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "kamu",
    },
    "halkbank": {
        "ad": "Halkbank",
        "ihtiyac": {6: 2.35, 12: 2.55, 18: 2.75, 24: 2.75, 36: 2.95},
        "konut": {60: 2.45, 120: 2.63, 180: 2.75, 240: 2.85},
        "tasit_sifir": {12: 2.85, 24: 3.00, 36: 3.15, 48: 3.30},
        "tasit_ikinciel": {12: 3.20, 24: 3.35, 36: 3.45, 48: 3.55},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "kamu",
    },
    "vakifbank": {
        "ad": "Vakıfbank",
        "ihtiyac": {6: 2.40, 12: 2.60, 18: 2.80, 24: 2.80, 36: 2.99},
        "konut": {60: 2.50, 120: 2.65, 180: 2.80, 240: 2.90},
        "tasit_sifir": {12: 2.90, 24: 3.05, 36: 3.20, 48: 3.35},
        "tasit_ikinciel": {12: 3.25, 24: 3.40, 36: 3.50, 48: 3.60},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "kamu",
    },
    "isbank": {
        "ad": "İş Bankası",
        "ihtiyac": {6: 2.59, 12: 2.79, 18: 2.99, 24: 2.99, 36: 3.19},
        "konut": {60: 2.70, 120: 2.85, 180: 3.00, 240: 3.10},
        "tasit_sifir": {12: 2.95, 24: 3.05, 36: 3.10, 48: 3.05},
        "tasit_ikinciel": {12: 3.30, 24: 3.40, 36: 3.50, 48: 3.55},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "garanti": {
        "ad": "Garanti BBVA",
        "ihtiyac": {6: 2.89, 12: 3.09, 18: 3.19, 24: 3.19, 36: 3.29},
        "konut": {60: 2.75, 120: 2.89, 180: 3.00, 240: 3.10},
        "tasit_sifir": {12: 2.99, 24: 3.10, 36: 3.12, 48: 3.15},
        "tasit_ikinciel": {12: 3.35, 24: 3.45, 36: 3.55, 48: 3.65},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "akbank": {
        "ad": "Akbank",
        "ihtiyac": {6: 2.69, 12: 2.89, 18: 3.09, 24: 3.09, 36: 3.25},
        "konut": {60: 2.70, 120: 2.85, 180: 2.99, 240: 3.09},
        "tasit_sifir": {12: 3.00, 24: 3.15, 36: 3.20, 48: 3.25},
        "tasit_ikinciel": {12: 3.35, 24: 3.50, 36: 3.60, 48: 3.70},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "yapıkredi": {
        "ad": "Yapı Kredi",
        "ihtiyac": {6: 2.95, 12: 3.15, 18: 3.25, 24: 3.25, 36: 3.39},
        "konut": {60: 2.85, 120: 3.00, 180: 3.15, 240: 3.20},
        "tasit_sifir": {12: 3.10, 24: 3.25, 36: 3.32, 48: 3.39},
        "tasit_ikinciel": {12: 3.45, 24: 3.60, 36: 3.70, 48: 3.80},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "ozel",
    },
    "qnb": {
        "ad": "QNB Finansbank",
        "ihtiyac": {6: 1.99, 12: 1.99, 18: 2.49, 24: 2.49, 36: 2.99},
        "konut": {60: 2.35, 120: 2.49, 180: 2.65, 240: 2.75},
        "tasit_sifir": {12: 3.15, 24: 3.30, 36: 3.38, 48: 3.44},
        "tasit_ikinciel": {12: 3.50, 24: 3.65, 36: 3.75, 48: 3.85},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "denizbank": {
        "ad": "Denizbank",
        "ihtiyac": {6: 2.85, 12: 3.05, 18: 3.25, 24: 3.25, 36: 3.39},
        "konut": {60: 2.90, 120: 3.05, 180: 3.20, 240: 3.30},
        "tasit_sifir": {12: 3.10, 24: 3.25, 36: 3.32, 48: 3.39},
        "tasit_ikinciel": {12: 3.45, 24: 3.60, 36: 3.70, 48: 3.80},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "ozel",
    },
    "teb": {
        "ad": "TEB",
        "ihtiyac": {6: 2.90, 12: 3.10, 18: 3.25, 24: 3.25, 36: 3.40},
        "konut": {60: 2.90, 120: 3.05, 180: 3.20, 240: 3.30},
        "tasit_sifir": {12: 3.15, 24: 3.30, 36: 3.38, 48: 3.45},
        "tasit_ikinciel": {12: 3.50, 24: 3.65, 36: 3.75, 48: 3.85},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "ozel",
    },
    "ing": {
        "ad": "ING Bank",
        "ihtiyac": {6: 2.95, 12: 3.15, 18: 3.35, 24: 3.35, 36: 3.45},
        "konut": {60: 2.95, 120: 3.10, 180: 3.25, 240: 3.35},
        "tasit_sifir": {12: 3.20, 24: 3.35, 36: 3.43, 48: 3.50},
        "tasit_ikinciel": {12: 3.55, 24: 3.70, 36: 3.80, 48: 3.90},
        "kredi_karti": 3.42,
        "nakit_avans": 4.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "hsbc": {
        "ad": "HSBC",
        "ihtiyac": {6: 3.00, 12: 3.20, 18: 3.40, 24: 3.40, 36: 3.49},
        "konut": {60: 3.00, 120: 3.15, 180: 3.30, 240: 3.40},
        "tasit_sifir": {12: 3.25, 24: 3.40, 36: 3.48, 48: 3.55},
        "tasit_ikinciel": {12: 3.60, 24: 3.75, 36: 3.85, 48: 3.95},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "ozel",
    },
    "sekerbank": {
        "ad": "Şekerbank",
        "ihtiyac": {6: 3.05, 12: 3.25, 18: 3.45, 24: 3.45, 36: 3.55},
        "konut": {60: 3.10, 120: 3.25, 180: 3.40, 240: 3.50},
        "tasit_sifir": {12: 3.30, 24: 3.45, 36: 3.53, 48: 3.60},
        "tasit_ikinciel": {12: 3.65, 24: 3.80, 36: 3.90, 48: 4.00},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 500,
        "tip": "ozel",
    },
    "enpara": {
        "ad": "Enpara (QNB)",
        "ihtiyac": {6: 2.79, 12: 2.99, 18: 3.15, 24: 3.15, 36: 3.29},
        "konut": None,
        "tasit_sifir": None,
        "tasit_ikinciel": None,
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.0,
        "dosya_masrafi_min": 0,
        "tip": "dijital",
    },
    "kuveytturk": {
        "ad": "Kuveyt Türk",
        "ihtiyac": {6: 2.45, 12: 2.65, 18: 2.85, 24: 2.85, 36: 2.99},
        "konut": {60: 2.45, 120: 2.60, 180: 2.75, 240: 2.85},
        "tasit_sifir": {12: 2.95, 24: 3.10, 36: 3.15, 48: 3.20},
        "tasit_ikinciel": {12: 3.30, 24: 3.45, 36: 3.55, 48: 3.65},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "katilim",
    },
    "turkiyefinans": {
        "ad": "Türkiye Finans",
        "ihtiyac": {6: 2.55, 12: 2.75, 18: 2.95, 24: 2.95, 36: 3.10},
        "konut": {60: 2.50, 120: 2.65, 180: 2.80, 240: 2.90},
        "tasit_sifir": {12: 3.00, 24: 3.15, 36: 3.20, 48: 3.25},
        "tasit_ikinciel": {12: 3.35, 24: 3.50, 36: 3.60, 48: 3.70},
        "kredi_karti": 4.42,
        "nakit_avans": 5.00,
        "dosya_masrafi_oran": 0.005,
        "dosya_masrafi_min": 500,
        "tip": "katilim",
    },
}

# Banka adı eşleşmeleri (kısa isim → anahtar)
BANKA_ESLEME = {
    "ziraat": "ziraat", "halkbank": "halkbank", "halk": "halkbank",
    "vakifbank": "vakifbank", "vakıfbank": "vakifbank", "vakif": "vakifbank",
    "isbank": "isbank", "işbank": "isbank", "is": "isbank", "iş": "isbank",
    "garanti": "garanti", "garantibbva": "garanti", "garanti bbva": "garanti",
    "akbank": "akbank",
    "yapikredi": "yapıkredi", "yapıkredi": "yapıkredi", "yapi": "yapıkredi",
    "qnb": "qnb", "finansbank": "qnb", "qnbfinansbank": "qnb",
    "denizbank": "denizbank", "deniz": "denizbank",
    "teb": "teb",
    "ing": "ing", "ingbank": "ing",
    "hsbc": "hsbc",
    "sekerbank": "sekerbank", "şekerbank": "sekerbank", "seker": "sekerbank",
    "enpara": "enpara",
    "kuveytturk": "kuveytturk", "kuveyt": "kuveytturk", "kuveyt türk": "kuveytturk",
    "turkiyefinans": "turkiyefinans", "türkiyefinans": "turkiyefinans",
    "turkiye finans": "turkiyefinans", "türkiye finans": "turkiyefinans",
}


# ─────────────────────────────────────────────────────────────────────────────
# HESAPLAMA FONKSİYONLARI
# ─────────────────────────────────────────────────────────────────────────────

def taksit_hesapla(anapara: float, aylik_faiz_yuzde: float, vade: int) -> float:
    """Aylık eşit taksit hesapla (annuity formülü)."""
    if aylik_faiz_yuzde == 0:
        return anapara / vade
    r = aylik_faiz_yuzde / 100
    return anapara * (r * (1 + r) ** vade) / ((1 + r) ** vade - 1)


def dosya_masrafi_hesapla(banka: dict, tutar: float) -> float:
    """Dosya masrafı hesapla."""
    masraf = tutar * banka["dosya_masrafi_oran"]
    return max(masraf, banka["dosya_masrafi_min"])


def en_yakin_vade(vade_dict: dict, vade: int) -> int:
    """Verilen vadeye en yakın mevcut vadeyi döndür."""
    vadeler = sorted(vade_dict.keys())
    if vade in vadeler:
        return vade
    # Üste yuvarla, yoksa alta
    for v in vadeler:
        if v >= vade:
            return v
    return vadeler[-1]


def format_tl(tutar: float) -> str:
    """₺ formatında sayı göster."""
    return f"₺{tutar:,.0f}".replace(",", ".")


def format_yuzde(oran: float) -> str:
    """Yüzde formatında göster."""
    return f"%{oran:.2f}"


# ─────────────────────────────────────────────────────────────────────────────
# ÇIKTI FONKSİYONLARI
# ─────────────────────────────────────────────────────────────────────────────

def tablo_yazdir(baslik: str, satirlar: list, sutunlar: list, genislikler: list):
    """ASCII tablo çıktısı."""
    print(f"\n💰 {baslik}\n")

    # Başlık çizgisi
    ust = "┌" + "┬".join("─" * g for g in genislikler) + "┐"
    orta = "├" + "┼".join("─" * g for g in genislikler) + "┤"
    alt = "└" + "┴".join("─" * g for g in genislikler) + "┘"

    baslik_satiri = "│" + "│".join(f" {s:<{g-1}}" for s, g in zip(sutunlar, genislikler)) + "│"

    print(ust)
    print(baslik_satiri)
    print(orta)

    for satir in satirlar:
        satir_str = "│" + "│".join(f" {str(v):<{g-1}}" for v, g in zip(satir, genislikler)) + "│"
        print(satir_str)

    print(alt)


def uyari_yazdir():
    print("\n⚠️  Notlar:")
    print("   • BSMV %15 faize dahildir")
    print("   • Dosya masrafı toplam ödemeye eklenmiştir")
    print("   • Hayat sigortası hariç — bankaya göre zorunlu olabilir")
    print("   • Oranlar kişi profiline ve tarihe göre değişir — bankayı doğrulayın")
    print("   • Bu araç kredi tavsiyesi değildir")
    print("\n💼 KOBİ finansman danışmanlığı: finhouse.ai\n")


# ─────────────────────────────────────────────────────────────────────────────
# KOMUT FONKSİYONLARI
# ─────────────────────────────────────────────────────────────────────────────

def ihtiyac_hesapla(tutar: float, vade: int, banka_filtre=None):
    """Tüm bankalarda ihtiyaç kredisi karşılaştırması."""
    satirlar = []
    secilen_bankalar = banka_filtre if banka_filtre else list(BANKALAR.keys())

    for banka_key in secilen_bankalar:
        banka = BANKALAR.get(banka_key)
        if not banka or not banka.get("ihtiyac"):
            continue

        gercek_vade = en_yakin_vade(banka["ihtiyac"], vade)
        faiz = banka["ihtiyac"][gercek_vade]
        taksit = taksit_hesapla(tutar, faiz, gercek_vade)
        toplam = taksit * gercek_vade
        toplam_faiz = toplam - tutar
        masraf = dosya_masrafi_hesapla(banka, tutar)

        satirlar.append([
            banka["ad"],
            format_yuzde(faiz),
            format_tl(taksit),
            format_tl(toplam_faiz),
            format_tl(toplam + masraf),
            format_tl(masraf),
        ])

    # Taksit sırasına göre sırala
    satirlar.sort(key=lambda x: float(x[2].replace("₺", "").replace(".", "").replace(",", "")))

    sutunlar = ["Banka", "Faiz %", "Taksit", "Top.Faiz", "Top.Ödeme", "Masraf"]
    genislikler = [20, 10, 12, 12, 14, 10]

    tablo_yazdir(
        f"İhtiyaç Kredisi — {format_tl(tutar)} × {vade} Ay",
        satirlar, sutunlar, genislikler
    )
    uyari_yazdir()


def konut_hesapla(tutar: float, vade: int, konut_degeri: float = None):
    """Konut kredisi karşılaştırması."""
    if konut_degeri:
        ltv = tutar / konut_degeri * 100
        if ltv > 80:
            print(f"\n⚠️  LTV %{ltv:.1f} — yasal limit %80'i aşıyor! Kredi tutarını düşürün.")
            maks_kredi = konut_degeri * 0.80
            print(f"   Maks kredi tutarı: {format_tl(maks_kredi)}")
            return

    satirlar = []
    for banka_key, banka in BANKALAR.items():
        if not banka.get("konut"):
            continue

        gercek_vade = en_yakin_vade(banka["konut"], vade)
        faiz = banka["konut"][gercek_vade]
        taksit = taksit_hesapla(tutar, faiz, gercek_vade)
        toplam = taksit * gercek_vade
        toplam_faiz = toplam - tutar

        satirlar.append([
            banka["ad"],
            format_yuzde(faiz),
            format_tl(taksit),
            format_tl(toplam_faiz),
            format_tl(toplam),
        ])

    satirlar.sort(key=lambda x: float(x[2].replace("₺", "").replace(".", "").replace(",", "")))

    sutunlar = ["Banka", "Faiz %", "Taksit", "Top.Faiz", "Top.Ödeme"]
    genislikler = [20, 10, 14, 16, 16]

    ltv_str = f" | LTV: %{ltv:.1f}" if konut_degeri else ""
    tablo_yazdir(
        f"Konut Kredisi — {format_tl(tutar)} × {vade} Ay{ltv_str}",
        satirlar, sutunlar, genislikler
    )

    print("ℹ️  Konut kredisi BSMV ve KKDF'den muaftır — en avantajlı kredi türü!")
    print("   Ek masraflar: Ekspertiz ₺3.000–8.000 | DASK + Konut Sigortası | İpotek tapu harcı")
    uyari_yazdir()


def tasit_hesapla(tutar: float, vade: int, tip: str = "sifir"):
    """Taşıt kredisi karşılaştırması."""
    # LTV kontrolü
    if tutar <= 400000:
        maks_ltv = 0.70
        maks_vade = 48
    elif tutar <= 800000:
        maks_ltv = 0.50
        maks_vade = 36
    elif tutar <= 1200000:
        maks_ltv = 0.30
        maks_vade = 24
    else:
        maks_ltv = 0.20
        maks_vade = 12

    print(f"\nℹ️  Araç değerine göre maks LTV: %{maks_ltv*100:.0f} | Maks vade: {maks_vade} ay")
    if vade > maks_vade:
        print(f"   ⚠️  Girilen vade ({vade} ay) limiti ({maks_vade} ay) aşıyor — {maks_vade} ay kullanılacak.")
        vade = maks_vade

    alan = "tasit_sifir" if tip == "sifir" else "tasit_ikinciel"
    tip_str = "Sıfır" if tip == "sifir" else "İkinci El"

    satirlar = []
    for banka_key, banka in BANKALAR.items():
        if not banka.get(alan):
            continue

        gercek_vade = en_yakin_vade(banka[alan], vade)
        faiz = banka[alan][gercek_vade]
        taksit = taksit_hesapla(tutar, faiz, gercek_vade)
        toplam = taksit * gercek_vade
        toplam_faiz = toplam - tutar
        masraf = dosya_masrafi_hesapla(banka, tutar)

        satirlar.append([
            banka["ad"],
            format_yuzde(faiz),
            format_tl(taksit),
            format_tl(toplam_faiz),
            format_tl(toplam + masraf),
            format_tl(masraf),
        ])

    satirlar.sort(key=lambda x: float(x[2].replace("₺", "").replace(".", "").replace(",", "")))

    sutunlar = ["Banka", "Faiz %", "Taksit", "Top.Faiz", "Top.Ödeme", "Masraf"]
    genislikler = [20, 10, 12, 12, 14, 10]

    tablo_yazdir(
        f"Taşıt Kredisi ({tip_str}) — {format_tl(tutar)} × {vade} Ay",
        satirlar, sutunlar, genislikler
    )
    print("   Kasko sigortası banka tarafından zorunlu tutulabilir")
    uyari_yazdir()


def banka_detay(banka_adi: str, tutar: float, vade: int):
    """Belirli bir bankada detaylı kredi hesabı."""
    banka_key = BANKA_ESLEME.get(banka_adi.lower().replace(" ", "").replace("-", ""))
    if not banka_key:
        print(f"❌ '{banka_adi}' bankası bulunamadı.")
        print(f"   Mevcut bankalar: {', '.join(sorted(BANKA_ESLEME.keys())[:15])}...")
        return

    banka = BANKALAR[banka_key]
    print(f"\n🏦 {banka['ad']} — Detaylı Kredi Analizi")
    print(f"   Kredi tutarı: {format_tl(tutar)} | Vade: {vade} ay\n")

    kredi_turleri = [
        ("İhtiyaç Kredisi", "ihtiyac"),
        ("Konut Kredisi", "konut"),
        ("Taşıt Kredisi (Sıfır)", "tasit_sifir"),
        ("Taşıt Kredisi (2. El)", "tasit_ikinciel"),
    ]

    for baslik, alan in kredi_turleri:
        if not banka.get(alan):
            print(f"   {baslik}: Bu bankada mevcut değil\n")
            continue

        gercek_vade = en_yakin_vade(banka[alan], vade)
        faiz = banka[alan][gercek_vade]
        taksit = taksit_hesapla(tutar, faiz, gercek_vade)
        toplam = taksit * gercek_vade
        toplam_faiz = toplam - tutar
        masraf = dosya_masrafi_hesapla(banka, tutar)

        print(f"   📌 {baslik}")
        print(f"      Aylık Faiz: {format_yuzde(faiz)} ({gercek_vade} ay)")
        print(f"      Aylık Taksit: {format_tl(taksit)}")
        print(f"      Toplam Faiz: {format_tl(toplam_faiz)}")
        print(f"      Dosya Masrafı: {format_tl(masraf)}")
        print(f"      Toplam Ödeme: {format_tl(toplam + masraf)}\n")

    print(f"   💳 Kredi Kartı Faizi: Aylık {format_yuzde(banka['kredi_karti'])} | Nakit Avans: {format_yuzde(banka['nakit_avans'])}")
    uyari_yazdir()


def kredi_karti_simulasyon(borc: float, aylik_faiz_yuzde: float = 4.42):
    """Kredi kartı asgari ödeme simülasyonu.

    Gerçekçi model:
    - Her ay faiz işler
    - Asgari ödeme = kalan bakiyenin %20'si (en az ₺500)
    - Asgari ödeme düşük tutulduğunda bakiye çok yavaş kapanır
    """
    print(f"\n💳 Kredi Kartı Borcu: {format_tl(borc)} (Aylık faiz: {format_yuzde(aylik_faiz_yuzde)})")
    print("─" * 60)

    kalan = borc
    toplam_odeme = 0
    ay = 0
    r = aylik_faiz_yuzde / 100
    MAX_AY = 600

    while kalan > 100 and ay < MAX_AY:
        faiz = kalan * r
        toplam_borc = kalan + faiz
        # Gerçekçi asgari ödeme modeli:
        # Türk bankaları: genellikle bakiye+faizin ~%5'i (en az ₺200)
        # %5 minimum, %4.42 faiz → net anapara azalışı çok yavaş → uzun vade
        asgari = max(toplam_borc * 0.05, 200.0)
        asgari = min(asgari, toplam_borc)
        kalan = toplam_borc - asgari
        toplam_odeme += asgari
        ay += 1

    toplam_faiz = toplam_odeme - borc
    yil = ay // 12
    kalan_ay = ay % 12

    print(f"\nSadece asgari ödeme yaparsanız:")
    print(f"→ Toplam süre: {ay} ay ({yil} yıl {kalan_ay} ay!)")
    print(f"→ Toplam ödeme: {format_tl(toplam_odeme)}")
    faiz_katsayi = toplam_faiz / borc
    print(f"→ Toplam faiz: {format_tl(toplam_faiz)} (borcun {faiz_katsayi:.1f} katı!)")

    print(f"\n⚠️  Bu borcu ihtiyaç kredisi ile kapatırsanız:")

    # 36 ay ihtiyaç kredisi (Ziraat %2.89)
    for banka_key, banka in [("ziraat", BANKALAR["ziraat"]), ("garanti", BANKALAR["garanti"])]:
        for vade in [24, 36]:
            if vade not in banka["ihtiyac"]:
                continue
            faiz = banka["ihtiyac"][vade]
            taksit = taksit_hesapla(borc, faiz, vade)
            toplam = taksit * vade
            toplam_faiz_kr = toplam - borc
            tasarruf = toplam_faiz - toplam_faiz_kr

            print(f"\n   {banka['ad']} — {vade} ay ihtiyaç kredisi:")
            print(f"   → Aylık taksit: {format_tl(taksit)} (sabit)")
            print(f"   → Toplam süre: {vade} ay")
            print(f"   → Toplam faiz: {format_tl(toplam_faiz_kr)}")
            if tasarruf > 0:
                print(f"   → 💚 Tasarruf: {format_tl(tasarruf)}!")

    uyari_yazdir()


# ─────────────────────────────────────────────────────────────────────────────
# ANA PROGRAM
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Türkiye Banka Kredi Faiz Hesaplayıcı — Mart 2026",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  %(prog)s --ihtiyac 100000 --vade 36
  %(prog)s --konut 2000000 --vade 120 --deger 2500000
  %(prog)s --tasit 500000 --vade 48 --tip sifir
  %(prog)s --banka garanti --tutar 200000 --vade 24
  %(prog)s --karsilastir ziraat,garanti,akbank --tutar 150000 --vade 36
  %(prog)s --en-ucuz --tutar 100000 --vade 24
  %(prog)s --kredi-karti 50000

⚠️  Kredi tavsiyesi değildir. Bankayı doğrulayın.
💼  KOBİ finansman: finhouse.ai
        """
    )

    kredi_group = parser.add_mutually_exclusive_group()
    kredi_group.add_argument("--ihtiyac", type=float, metavar="TUTAR", help="İhtiyaç kredisi tutarı (TL)")
    kredi_group.add_argument("--konut", type=float, metavar="TUTAR", help="Konut kredisi tutarı (TL)")
    kredi_group.add_argument("--tasit", type=float, metavar="TUTAR", help="Taşıt kredisi tutarı (TL)")
    kredi_group.add_argument("--banka", type=str, metavar="AD", help="Belirli banka detay (örn: garanti)")
    kredi_group.add_argument("--karsilastir", type=str, metavar="BANKALAR", help="Virgülle ayrılmış banka listesi")
    kredi_group.add_argument("--en-ucuz", action="store_true", help="En düşük taksitli bankalar")
    kredi_group.add_argument("--kredi-karti", type=float, metavar="BORC", help="Kredi kartı borç simülasyonu (TL)")
    kredi_group.add_argument("--listele", action="store_true", help="Tüm bankaları listele")

    parser.add_argument("--vade", type=int, default=36, help="Vade (ay, varsayılan: 36)")
    parser.add_argument("--tutar", type=float, help="Kredi tutarı (--banka, --karsilastir, --en-ucuz ile)")
    parser.add_argument("--deger", type=float, help="Konut değeri (LTV hesabı için)")
    parser.add_argument("--tip", choices=["sifir", "ikinciel"], default="sifir", help="Taşıt tipi")
    parser.add_argument("--faiz", type=float, help="Kredi kartı aylık faizi (varsayılan: 4.42)")

    args = parser.parse_args()

    print("=" * 65)
    print("  🏦 Türkiye Banka Kredi Faiz Hesaplayıcı — Mart 2026")
    print("  Kaynak: hesapkurdu.com, hangikredi.com, banka web siteleri")
    print("=" * 65)

    if args.ihtiyac:
        ihtiyac_hesapla(args.ihtiyac, args.vade)

    elif args.konut:
        konut_hesapla(args.konut, args.vade, args.deger)

    elif args.tasit:
        tasit_hesapla(args.tasit, args.vade, args.tip)

    elif args.banka:
        if not args.tutar:
            print("❌ --banka ile birlikte --tutar gereklidir.")
            sys.exit(1)
        banka_detay(args.banka, args.tutar, args.vade)

    elif args.karsilastir:
        if not args.tutar:
            print("❌ --karsilastir ile birlikte --tutar gereklidir.")
            sys.exit(1)
        banka_listesi = [b.strip().lower() for b in args.karsilastir.split(",")]
        banka_keys = []
        for b in banka_listesi:
            key = BANKA_ESLEME.get(b)
            if key:
                banka_keys.append(key)
            else:
                print(f"⚠️  '{b}' bankası tanınmadı, atlandı.")
        if banka_keys:
            ihtiyac_hesapla(args.tutar, args.vade, banka_filtre=banka_keys)

    elif args.en_ucuz:
        if not args.tutar:
            print("❌ --en-ucuz ile birlikte --tutar gereklidir.")
            sys.exit(1)
        print(f"\n🏆 En Düşük Taksit Sıralaması — {format_tl(args.tutar)} × {args.vade} Ay")
        ihtiyac_hesapla(args.tutar, args.vade)

    elif args.kredi_karti is not None:
        faiz = args.faiz if args.faiz else 4.42
        kredi_karti_simulasyon(args.kredi_karti, faiz)

    elif args.listele:
        print("\n📋 Desteklenen Bankalar:\n")
        for key, banka in BANKALAR.items():
            print(f"  {key:<15} → {banka['ad']} ({banka['tip']})")
        print()

    else:
        parser.print_help()
        print("\nÖrnek: python3 kredi_hesapla.py --ihtiyac 100000 --vade 36")


if __name__ == "__main__":
    main()
