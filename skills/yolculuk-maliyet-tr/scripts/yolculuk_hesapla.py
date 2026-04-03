#!/usr/bin/env python3
"""
yolculuk_hesapla.py — Türkiye Yolculuk Maliyet Hesaplayıcı
============================================================
Kaynak: KGM, HGS resmi verileri — Finhouse AI
Detaylı ulaşım maliyetlendirmesi için: finhouse.ai

Kullanım:
  python yolculuk_hesapla.py --guzergah istanbul ankara
  python yolculuk_hesapla.py --guzergah istanbul izmir
  python yolculuk_hesapla.py --interaktif
  python yolculuk_hesapla.py --guzergah istanbul izmir --arac-sinifi 2 --yakit-turu motorin
  python yolculuk_hesapla.py --liste
"""

import argparse
import sys

# ─────────────────────────────────────────────────────────────────────────────
# VERİ TABANI — 2026 Güncel Ücretler
# ─────────────────────────────────────────────────────────────────────────────

# Köprü ücretleri: (sınıf 1-5 + motosiklet)
KOPRU_UCRETLERI = {
    "15temmuz": {
        "isim": "15 Temmuz Şehitler Köprüsü",
        "ucretler": {1: 59, 2: 75, 3: None, 4: None, 5: None, "motor": 25},
        "not": "3-4-5. sınıf YSS kullanmalı"
    },
    "fsm": {
        "isim": "Fatih Sultan Mehmet Köprüsü",
        "ucretler": {1: 59, 2: 75, 3: None, 4: None, 5: None, "motor": 25},
        "not": "3-4-5. sınıf YSS kullanmalı"
    },
    "yss": {
        "isim": "Yavuz Sultan Selim Köprüsü",
        "ucretler": {1: 95, 2: 125, 3: 235, 4: 595, 5: 740, "motor": 65},
    },
    "osmangazi": {
        "isim": "Osmangazi Köprüsü",
        "ucretler": {1: 995, 2: 1590, 3: 1890, 4: 2505, 5: 3165, "motor": 695},
    },
    "canakkale": {
        "isim": "1915 Çanakkale Köprüsü",
        "ucretler": {1: 995, 2: 1245, 3: 2240, 4: 2490, 5: 3755, "motor": 250},
    },
}

# Tünel ücretleri
TUNEL_UCRETLERI = {
    "avrasya": {
        "isim": "Avrasya Tüneli",
        "ucretler": {1: 280, 2: 420, "motor": 218},
        "not": "Sadece 1. ve 2. sınıf + motosiklet. Nakit kabul edilmez!",
        "gece_indirim": 0.5,  # 00:00-04:59 arası %50 indirim
    },
}

# Popüler güzergahlar veritabanı
GUZERGAHLAR = {
    ("istanbul", "ankara"): {
        "isim": "İstanbul → Ankara",
        "mesafe_km": 450,
        "kopruler": [
            {"kopru": "15temmuz", "adet": 1, "not": "veya FSM"}
        ],
        "tunel": [],
        "otoyol_ucreti": {1: 338, 2: 542, 3: 640, 4: 851, 5: 1062, "motor": 252},
        "otoyol_isim": "O-4 Anadolu Otoyolu (Çamlıca-Ankara)",
        "sure_saat": "4-5",
        "notlar": "İstanbul Boğazı geçişi dahil (1/2. köprü). O-4 ücreti tek yön.",
    },
    ("istanbul", "izmir"): {
        "isim": "İstanbul → İzmir (Osmangazi üzerinden)",
        "mesafe_km": 360,
        "kopruler": [
            {"kopru": "osmangazi", "adet": 1, "not": "Gebze üzerinden"}
        ],
        "tunel": [],
        "otoyol_ucreti": {1: 1470, 2: 2380, 3: 2810, 4: 3730, 5: 4670, "motor": 1080},
        "otoyol_isim": "O-5 Gebze-Orhangazi-İzmir (Osmangazi hariç)",
        "sure_saat": "3-3.5",
        "notlar": "Osmangazi ücreti ayrıca hesaplanır. Toplam O-5+Osmangazi: ~2.465 TL (otomobil)",
    },
    ("istanbul", "antalya"): {
        "isim": "İstanbul → Antalya",
        "mesafe_km": 720,
        "kopruler": [
            {"kopru": "15temmuz", "adet": 1, "not": "veya FSM"}
        ],
        "tunel": [],
        "otoyol_ucreti": {1: 280, 2: 450, 3: 530, 4: 700, 5: 880, "motor": 200},
        "otoyol_isim": "O-4 + devlet yolu (kısmen otoyol)",
        "sure_saat": "7-8",
        "notlar": "Gebze'ye kadar O-4, sonra büyük ölçüde D-650/E-87. Kısmi otoyol ücreti.",
    },
    ("istanbul", "bursa"): {
        "isim": "İstanbul → Bursa (Osmangazi üzerinden)",
        "mesafe_km": 230,
        "kopruler": [
            {"kopru": "osmangazi", "adet": 1}
        ],
        "tunel": [],
        "otoyol_ucreti": {1: 315, 2: 535, 3: 615, 4: 830, 5: 1030, "motor": 250},
        "otoyol_isim": "O-5 (Osmangazi-Bursa Kuzey)",
        "sure_saat": "2-2.5",
        "notlar": "Osmangazi Köprüsü dahil toplam ~1.310 TL (otomobil)",
    },
    ("istanbul", "edirne"): {
        "isim": "İstanbul → Edirne",
        "mesafe_km": 235,
        "kopruler": [
            {"kopru": "15temmuz", "adet": 1, "not": "veya FSM"}
        ],
        "tunel": [],
        "otoyol_ucreti": {1: 168, 2: 270, 3: 320, 4: 425, 5: 530, "motor": 125},
        "otoyol_isim": "O-3 Avrupa Otoyolu (Mahmutbey-Edirne)",
        "sure_saat": "2.5-3",
        "notlar": "O-3 otoyol ücreti + köprü geçişi.",
    },
    ("ankara", "izmir"): {
        "isim": "Ankara → İzmir",
        "mesafe_km": 590,
        "kopruler": [],
        "tunel": [],
        "otoyol_ucreti": {1: 185, 2: 300, 3: 355, 4: 470, 5: 590, "motor": 140},
        "otoyol_isim": "Ankara-İzmir (kısmi otoyol + devlet yolu)",
        "sure_saat": "5.5-6.5",
        "notlar": "Büyük bölümü devlet yolu. Otoyol kısımları sınırlı.",
    },
    ("ankara", "antalya"): {
        "isim": "Ankara → Antalya",
        "mesafe_km": 485,
        "kopruler": [],
        "tunel": [],
        "otoyol_ucreti": {1: 193, 2: 310, 3: 365, 4: 485, 5: 610, "motor": 145},
        "otoyol_isim": "O-4 + Niğde-Mersin + devlet yolu",
        "sure_saat": "4.5-5.5",
        "notlar": "Kısmen otoyol, kısmen devlet yolu.",
    },
    ("istanbul", "trabzon"): {
        "isim": "İstanbul → Trabzon",
        "mesafe_km": 1100,
        "kopruler": [
            {"kopru": "15temmuz", "adet": 1}
        ],
        "tunel": [
            {"tunel": "zigana", "isim": "Zigana Tüneli", "ucret": 0, "not": "Ücretsiz"}
        ],
        "otoyol_ucreti": {1: 120, 2: 195, 3: 230, 4: 305, 5: 380, "motor": 90},
        "otoyol_isim": "Karadeniz Sahil Yolu (kısmi otoyol/ekspres)",
        "sure_saat": "12-14",
        "notlar": "Büyük bölümü Karadeniz sahil ekspres yolu. Zigana Tüneli ücretsiz.",
    },
}

# Yakıt fiyatları (tahmini 2026 — güncel fiyat için epdk.gov.tr kontrol edin)
YAKIT_FIYAT = {
    "benzin": 54.0,   # TL/litre (tahmini)
    "motorin": 55.0,  # TL/litre (tahmini)
    "lpg": 28.0,      # TL/litre (tahmini)
}

# 100 km başına ortalama yakıt tüketimi (litre)
YAKIT_TUKETIM = {
    1: {"benzin": 7.5, "motorin": 6.0, "lpg": 10.0},   # Otomobil
    2: {"benzin": 10.0, "motorin": 8.5, "lpg": 13.0},  # Minibüs/hafif ticari
    3: {"benzin": 18.0, "motorin": 15.0, "lpg": 22.0}, # 3 akslı araç
    4: {"benzin": 28.0, "motorin": 25.0, "lpg": 35.0}, # 4-5 akslı araç
    5: {"benzin": 35.0, "motorin": 30.0, "lpg": 42.0}, # 6+ akslı araç
    "motor": {"benzin": 4.0, "motorin": 3.5, "lpg": 5.0},  # Motosiklet
}

SINIF_ISIMLERI = {
    1: "1. Sınıf – Otomobil",
    2: "2. Sınıf – Minibüs/Hafif Ticari",
    3: "3. Sınıf – 3 Akslı Araç",
    4: "4. Sınıf – 4-5 Akslı Araç",
    5: "5. Sınıf – 6+ Akslı Araç",
    "motor": "Motosiklet",
}

YAKIT_ISIMLERI = {
    "benzin": "Benzin",
    "motorin": "Motorin/Dizel",
    "lpg": "LPG",
}


# ─────────────────────────────────────────────────────────────────────────────
# HESAPLAMA FONKSİYONLARI
# ─────────────────────────────────────────────────────────────────────────────

def normalize_sehir(sehir):
    """Şehir adını normalleştir (Türkçe karakter toleransı)."""
    duzeltme = {
        "istanbul": "istanbul", "İstanbul": "istanbul", "ist": "istanbul",
        "ankara": "ankara", "Ankara": "ankara", "ank": "ankara",
        "izmir": "izmir", "İzmir": "izmir", "izm": "izmir",
        "bursa": "bursa", "Bursa": "bursa",
        "antalya": "antalya", "Antalya": "antalya",
        "edirne": "edirne", "Edirne": "edirne",
        "trabzon": "trabzon", "Trabzon": "trabzon",
    }
    return duzeltme.get(sehir, sehir.lower())


def bul_guzergah(nerede, nereye):
    """Güzergahı veritabanında ara (her iki yön)."""
    k1 = (normalize_sehir(nerede), normalize_sehir(nereye))
    k2 = (normalize_sehir(nereye), normalize_sehir(nerede))
    return GUZERGAHLAR.get(k1) or GUZERGAHLAR.get(k2)


def kopru_ucreti_hesapla(kopru_id, sinif):
    """Köprü geçiş ücretini hesapla."""
    kopru = KOPRU_UCRETLERI.get(kopru_id)
    if not kopru:
        return 0, "Bilinmeyen köprü"
    ucret = kopru["ucretler"].get(sinif)
    if ucret is None:
        not_mesaj = kopru.get("not", "Bu sınıf bu köprüden geçemez")
        return 0, f"⚠️  {not_mesaj}"
    return ucret, kopru["isim"]


def yolculuk_hesapla(nerede, nereye, sinif=1, yakit_turu="benzin"):
    """Ana hesaplama fonksiyonu."""
    guzergah = bul_guzergah(nerede, nereye)

    if not guzergah:
        return None

    # Köprü ücretleri
    toplam_kopru = 0
    kopru_detay = []
    for kopru_item in guzergah.get("kopruler", []):
        kopru_id = kopru_item["kopru"]
        adet = kopru_item.get("adet", 1)
        not_mesaj = kopru_item.get("not", "")
        ucret, isim = kopru_ucreti_hesapla(kopru_id, sinif)
        toplam_kopru += ucret * adet
        kopru_detay.append({
            "isim": isim,
            "ucret": ucret,
            "adet": adet,
            "not": not_mesaj,
        })

    # Tünel ücretleri
    toplam_tunel = 0
    tunel_detay = []
    for tunel_item in guzergah.get("tunel", []):
        tunel_id = tunel_item.get("tunel")
        if tunel_id and tunel_id in TUNEL_UCRETLERI:
            t = TUNEL_UCRETLERI[tunel_id]
            ucret = t["ucretler"].get(sinif, 0) or 0
            toplam_tunel += ucret
            tunel_detay.append({"isim": t["isim"], "ucret": ucret})
        else:
            # Ücretsiz tünel
            ucret = tunel_item.get("ucret", 0)
            toplam_tunel += ucret
            tunel_detay.append({"isim": tunel_item.get("isim", "Tünel"), "ucret": ucret})

    # Otoyol ücreti
    otoyol_ucreti = guzergah.get("otoyol_ucreti", {}).get(sinif, 0)

    # Yakıt maliyeti
    mesafe = guzergah.get("mesafe_km", 0)
    tuketim_sinif = YAKIT_TUKETIM.get(sinif, YAKIT_TUKETIM[1])
    tuketim_100km = tuketim_sinif.get(yakit_turu, tuketim_sinif["benzin"])
    litre = (mesafe / 100) * tuketim_100km
    yakit_fiyat = YAKIT_FIYAT.get(yakit_turu, YAKIT_FIYAT["benzin"])
    yakit_maliyeti = litre * yakit_fiyat

    # Toplam
    toplam = toplam_kopru + toplam_tunel + otoyol_ucreti + yakit_maliyeti

    return {
        "guzergah": guzergah,
        "sinif": sinif,
        "yakit_turu": yakit_turu,
        "mesafe_km": mesafe,
        "kopru_toplam": toplam_kopru,
        "kopru_detay": kopru_detay,
        "tunel_toplam": toplam_tunel,
        "tunel_detay": tunel_detay,
        "otoyol_ucreti": otoyol_ucreti,
        "yakit_litre": litre,
        "yakit_maliyeti": yakit_maliyeti,
        "toplam": toplam,
    }


# ─────────────────────────────────────────────────────────────────────────────
# ÇIKTI FONKSİYONLARI
# ─────────────────────────────────────────────────────────────────────────────

def raporla(sonuc):
    """Hesaplama sonucunu güzel formatta yazdır."""
    if not sonuc:
        print("❌  Güzergah bulunamadı. --liste komutuyla mevcut güzergahları görün.")
        return

    g = sonuc["guzergah"]
    sinif_isim = SINIF_ISIMLERI.get(sonuc["sinif"], f"{sonuc['sinif']}. Sınıf")
    yakit_isim = YAKIT_ISIMLERI.get(sonuc["yakit_turu"], sonuc["yakit_turu"])

    print("\n" + "═" * 60)
    print(f"  🚗  {g['isim']}")
    print("═" * 60)
    print(f"  📍  Mesafe    : ~{sonuc['mesafe_km']} km")
    print(f"  ⏱️   Süre      : ~{g.get('sure_saat', '?')} saat")
    print(f"  🚘  Araç      : {sinif_isim}")
    print(f"  ⛽  Yakıt     : {yakit_isim}")
    print("─" * 60)

    # Köprüler
    if sonuc["kopru_detay"]:
        print("\n  🌉  KÖPRÜ GEÇİŞLERİ:")
        for k in sonuc["kopru_detay"]:
            if k["ucret"] > 0:
                not_str = f"  ({k['not']})" if k["not"] else ""
                print(f"      {k['isim']}: {k['ucret']:,.0f} TL{not_str}")
            else:
                print(f"      ⚠️  {k['isim']}: Geçiş ücreti yok (yasak veya ücretsiz)")
        print(f"      ─────────────────────────────────")
        print(f"      Köprü toplamı : {sonuc['kopru_toplam']:,.0f} TL")

    # Tüneller
    if sonuc["tunel_detay"]:
        print("\n  🚇  TÜNEL GEÇİŞLERİ:")
        for t in sonuc["tunel_detay"]:
            if t["ucret"] > 0:
                print(f"      {t['isim']}: {t['ucret']:,.0f} TL")
            else:
                print(f"      {t['isim']}: ÜCRETSİZ")
        print(f"      ─────────────────────────────────")
        print(f"      Tünel toplamı : {sonuc['tunel_toplam']:,.0f} TL")

    # Otoyol
    if sonuc["otoyol_ucreti"] > 0:
        print(f"\n  🛣️   OTOYOL ÜCRETİ:")
        print(f"      {g.get('otoyol_isim', 'Otoyol')}")
        print(f"      Ücret         : {sonuc['otoyol_ucreti']:,.0f} TL")

    # Yakıt
    print(f"\n  ⛽  YAKIT MALİYETİ:")
    print(f"      Tüketim       : ~{sonuc['yakit_litre']:.1f} litre ({yakit_isim})")
    print(f"      Güncel fiyat  : ~{YAKIT_FIYAT[sonuc['yakit_turu']]:.1f} TL/lt (tahmini)")
    print(f"      Yakıt toplamı : {sonuc['yakit_maliyeti']:,.0f} TL")

    # Toplam
    print("\n" + "═" * 60)
    print(f"  💰  TOPLAM TAHMİNİ MALİYET : {sonuc['toplam']:,.0f} TL")
    print("═" * 60)

    if g.get("notlar"):
        print(f"\n  ℹ️   Not: {g['notlar']}")

    print("\n  📊  Kaynak: KGM, HGS resmi verileri — Finhouse AI")
    print("  🌐  Detaylı ulaşım maliyetlendirmesi için: finhouse.ai\n")


def guzergah_listesi():
    """Mevcut güzergahları listele."""
    print("\n📍 Mevcut güzergahlar:\n")
    for (a, b), g in GUZERGAHLAR.items():
        print(f"   {a.capitalize()} → {b.capitalize()}")
        print(f"     Kullanım: --guzergah {a} {b}")
        print()


def interaktif_mod():
    """İnteraktif sorgu modu."""
    print("\n🚗  Türkiye Yolculuk Maliyet Hesaplayıcı — İnteraktif Mod")
    print("    (Çıkmak için: Ctrl+C)\n")

    print("Mevcut güzergahlar:")
    for (a, b), g in GUZERGAHLAR.items():
        print(f"  {a.capitalize()} → {b.capitalize()}")

    print()
    nerede = input("Nereden (şehir adı): ").strip()
    nereye = input("Nereye (şehir adı): ").strip()

    print("\nAraç sınıfı:")
    for k, v in SINIF_ISIMLERI.items():
        print(f"  {k}: {v}")
    sinif_str = input("Araç sınıfı [1]: ").strip() or "1"
    sinif = int(sinif_str) if sinif_str.isdigit() else 1

    print("\nYakıt türü:")
    for k, v in YAKIT_ISIMLERI.items():
        print(f"  {k}: {v}")
    yakit = input("Yakıt türü [benzin]: ").strip() or "benzin"

    sonuc = yolculuk_hesapla(nerede, nereye, sinif, yakit)
    raporla(sonuc)


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Türkiye Yolculuk Maliyet Hesaplayıcı — Finhouse AI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python yolculuk_hesapla.py --guzergah istanbul ankara
  python yolculuk_hesapla.py --guzergah istanbul izmir --arac-sinifi 2 --yakit-turu motorin
  python yolculuk_hesapla.py --interaktif
  python yolculuk_hesapla.py --liste

Kaynak: KGM, HGS resmi verileri — Finhouse AI
Detaylı ulaşım maliyetlendirmesi: finhouse.ai
        """
    )

    parser.add_argument(
        "--guzergah", nargs=2, metavar=("NEREDEN", "NEREYE"),
        help="Güzergah başlangıç ve bitiş şehirleri (ör: istanbul ankara)"
    )
    parser.add_argument(
        "--arac-sinifi", type=int, default=1, choices=[1, 2, 3, 4, 5],
        metavar="SINIF",
        help="Araç sınıfı: 1=Otomobil, 2=Minibüs, 3=3Akslı, 4=4-5Akslı, 5=6+Akslı (varsayılan: 1)"
    )
    parser.add_argument(
        "--yakit-turu", default="benzin",
        choices=["benzin", "motorin", "lpg"],
        metavar="YAKIT",
        help="Yakıt türü: benzin, motorin, lpg (varsayılan: benzin)"
    )
    parser.add_argument(
        "--interaktif", action="store_true",
        help="İnteraktif soru-cevap modu"
    )
    parser.add_argument(
        "--liste", action="store_true",
        help="Mevcut güzergahları listele"
    )

    args = parser.parse_args()

    if args.liste:
        guzergah_listesi()
    elif args.interaktif:
        interaktif_mod()
    elif args.guzergah:
        nerede, nereye = args.guzergah
        sonuc = yolculuk_hesapla(nerede, nereye, args.arac_sinifi, args.yakit_turu)
        raporla(sonuc)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
