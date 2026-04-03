#!/usr/bin/env python3
"""
sarj_maliyet.py — Türkiye EV Şarj Maliyet Hesaplayıcı
Kullanım:
    python3 sarj_maliyet.py --arac togg-t10x --mesafe 300
    python3 sarj_maliyet.py --batarya 77 --tuketim 18 --mesafe 300
    python3 sarj_maliyet.py --arac tesla-model-y --mesafe 500 --operator zes --sarj-tipi dc
    python3 sarj_maliyet.py --arac hyundai-ioniq6 --mesafe 400 --karsilastir

Son güncelleme: Mart 2026
Kaynak fiyatlar: ZES resmi (zes.net/tr/fiyatlandirma), operatör uygulamaları
"""

import argparse
import sys

# ─────────────────────────────────────────────
# ARAÇ VERİTABANI
# ─────────────────────────────────────────────
ARACLAR = {
    "togg-t10x": {
        "ad": "TOGG T10X (Long Range)",
        "batarya_kwh": 88.5,
        "menzil_km": 523,
        "tuketim_kwh_100km": 18.2,
        "max_dc_kw": 180,
        "ac_kw": 11,
    },
    "togg-t10x-std": {
        "ad": "TOGG T10X (Standard)",
        "batarya_kwh": 52.4,
        "menzil_km": 314,
        "tuketim_kwh_100km": 18.0,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "togg-t10f": {
        "ad": "TOGG T10F (Long Range)",
        "batarya_kwh": 88.5,
        "menzil_km": 500,
        "tuketim_kwh_100km": 18.5,
        "max_dc_kw": 180,
        "ac_kw": 11,
    },
    "tesla-model-y": {
        "ad": "Tesla Model Y (Long Range AWD)",
        "batarya_kwh": 82.0,
        "menzil_km": 533,
        "tuketim_kwh_100km": 16.0,
        "max_dc_kw": 250,
        "ac_kw": 11,
    },
    "tesla-model-y-rwd": {
        "ad": "Tesla Model Y (RWD)",
        "batarya_kwh": 57.5,
        "menzil_km": 440,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 170,
        "ac_kw": 11,
    },
    "tesla-model-3": {
        "ad": "Tesla Model 3 (Long Range AWD)",
        "batarya_kwh": 82.0,
        "menzil_km": 629,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 250,
        "ac_kw": 11,
    },
    "byd-atto3": {
        "ad": "BYD Atto 3",
        "batarya_kwh": 60.5,
        "menzil_km": 420,
        "tuketim_kwh_100km": 15.0,
        "max_dc_kw": 80,
        "ac_kw": 11,
    },
    "byd-seal": {
        "ad": "BYD Seal (Long Range)",
        "batarya_kwh": 82.5,
        "menzil_km": 570,
        "tuketim_kwh_100km": 15.0,
        "max_dc_kw": 150,
        "ac_kw": 11,
    },
    "byd-dolphin": {
        "ad": "BYD Dolphin",
        "batarya_kwh": 44.9,
        "menzil_km": 340,
        "tuketim_kwh_100km": 13.5,
        "max_dc_kw": 60,
        "ac_kw": 7,
    },
    "mg4": {
        "ad": "MG4 Electric (Long Range)",
        "batarya_kwh": 77.0,
        "menzil_km": 520,
        "tuketim_kwh_100km": 15.5,
        "max_dc_kw": 135,
        "ac_kw": 11,
    },
    "mg-zs": {
        "ad": "MG ZS EV (Uzun Menzil)",
        "batarya_kwh": 72.6,
        "menzil_km": 440,
        "tuketim_kwh_100km": 17.0,
        "max_dc_kw": 76,
        "ac_kw": 11,
    },
    "hyundai-ioniq5": {
        "ad": "Hyundai Ioniq 5 (LR 2WD)",
        "batarya_kwh": 77.4,
        "menzil_km": 507,
        "tuketim_kwh_100km": 16.5,
        "max_dc_kw": 220,
        "ac_kw": 11,
    },
    "hyundai-ioniq6": {
        "ad": "Hyundai Ioniq 6 (LR 2WD)",
        "batarya_kwh": 77.4,
        "menzil_km": 614,
        "tuketim_kwh_100km": 13.0,
        "max_dc_kw": 220,
        "ac_kw": 11,
    },
    "hyundai-kona": {
        "ad": "Hyundai Kona Electric",
        "batarya_kwh": 65.4,
        "menzil_km": 514,
        "tuketim_kwh_100km": 13.5,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "kia-ev6": {
        "ad": "Kia EV6 (Long Range 2WD)",
        "batarya_kwh": 77.4,
        "menzil_km": 528,
        "tuketim_kwh_100km": 15.5,
        "max_dc_kw": 220,
        "ac_kw": 11,
    },
    "kia-niro": {
        "ad": "Kia Niro EV",
        "batarya_kwh": 64.8,
        "menzil_km": 463,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "vw-id4": {
        "ad": "Volkswagen ID.4 (Pro S)",
        "batarya_kwh": 82.0,
        "menzil_km": 520,
        "tuketim_kwh_100km": 17.0,
        "max_dc_kw": 135,
        "ac_kw": 11,
    },
    "vw-id3": {
        "ad": "Volkswagen ID.3 (Pro S)",
        "batarya_kwh": 82.0,
        "menzil_km": 549,
        "tuketim_kwh_100km": 16.0,
        "max_dc_kw": 135,
        "ac_kw": 11,
    },
    "bmw-ix1": {
        "ad": "BMW iX1 xDrive30",
        "batarya_kwh": 64.7,
        "menzil_km": 440,
        "tuketim_kwh_100km": 16.0,
        "max_dc_kw": 130,
        "ac_kw": 11,
    },
    "bmw-ix3": {
        "ad": "BMW iX3",
        "batarya_kwh": 80.0,
        "menzil_km": 520,
        "tuketim_kwh_100km": 17.0,
        "max_dc_kw": 150,
        "ac_kw": 11,
    },
    "mercedes-eqa": {
        "ad": "Mercedes EQA 250",
        "batarya_kwh": 70.5,
        "menzil_km": 426,
        "tuketim_kwh_100km": 17.5,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "mercedes-eqb": {
        "ad": "Mercedes EQB 300",
        "batarya_kwh": 70.5,
        "menzil_km": 419,
        "tuketim_kwh_100km": 18.0,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "renault-megane": {
        "ad": "Renault Megane E-Tech",
        "batarya_kwh": 60.0,
        "menzil_km": 450,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 130,
        "ac_kw": 11,
    },
    "renault-zoe": {
        "ad": "Renault Zoe",
        "batarya_kwh": 52.0,
        "menzil_km": 395,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 50,
        "ac_kw": 22,
    },
    "volvo-ex30": {
        "ad": "Volvo EX30 (Single Motor ER)",
        "batarya_kwh": 69.0,
        "menzil_km": 476,
        "tuketim_kwh_100km": 15.5,
        "max_dc_kw": 153,
        "ac_kw": 11,
    },
    "volvo-xc40": {
        "ad": "Volvo XC40 Recharge",
        "batarya_kwh": 82.0,
        "menzil_km": 533,
        "tuketim_kwh_100km": 17.0,
        "max_dc_kw": 200,
        "ac_kw": 11,
    },
    "fiat-500e": {
        "ad": "Fiat 500e",
        "batarya_kwh": 42.0,
        "menzil_km": 320,
        "tuketim_kwh_100km": 14.0,
        "max_dc_kw": 85,
        "ac_kw": 11,
    },
    "peugeot-e208": {
        "ad": "Peugeot e-208",
        "batarya_kwh": 54.0,
        "menzil_km": 400,
        "tuketim_kwh_100km": 14.0,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
    "peugeot-e2008": {
        "ad": "Peugeot e-2008",
        "batarya_kwh": 54.0,
        "menzil_km": 406,
        "tuketim_kwh_100km": 14.5,
        "max_dc_kw": 100,
        "ac_kw": 11,
    },
}

# ─────────────────────────────────────────────
# OPERATÖR FİYATLARI (Mart 2026 — kWh bazlı, TL)
# Kaynak: zes.net (resmi), diğerleri yaklaşık
# ─────────────────────────────────────────────
OPERATORLER = {
    "zes-ac": {
        "ad": "ZES AC",
        "tip": "AC",
        "kwh": 11.49,
        "max_kw": 22,
        "notlar": "Üye fiyatı (~Ocak 2026)",
    },
    "zes-dc": {
        "ad": "ZES DC",
        "tip": "DC",
        "kwh": 14.49,
        "max_kw": 150,
        "notlar": "Üye fiyatı (~Ocak 2026)",
    },
    "zes-misafir": {
        "ad": "ZES Misafir",
        "tip": "DC",
        "kwh": 16.49,
        "max_kw": 150,
        "notlar": "Misafir (üyesiz) — resmi 07.01.2026 fiyatı",
    },
    "esarj-ac": {
        "ad": "Eşarj AC",
        "tip": "AC",
        "kwh": 11.00,
        "max_kw": 22,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "esarj-dc": {
        "ad": "Eşarj DC",
        "tip": "DC",
        "kwh": 15.00,
        "max_kw": 150,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "sharz-ac": {
        "ad": "Sharz.net AC",
        "tip": "AC",
        "kwh": 10.00,
        "max_kw": 22,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "sharz-dc": {
        "ad": "Sharz.net DC",
        "tip": "DC",
        "kwh": 14.00,
        "max_kw": 150,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "trugo-ac": {
        "ad": "Trugo AC",
        "tip": "AC",
        "kwh": 10.50,
        "max_kw": 22,
        "notlar": "Trumore üyeliği ile",
    },
    "trugo-dc": {
        "ad": "Trugo DC",
        "tip": "DC",
        "kwh": 14.50,
        "max_kw": 150,
        "notlar": "Trumore üyeliği ile",
    },
    "voltrun-ac": {
        "ad": "Voltrun AC",
        "tip": "AC",
        "kwh": 9.00,
        "max_kw": 22,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "voltrun-dc": {
        "ad": "Voltrun DC",
        "tip": "DC",
        "kwh": 13.00,
        "max_kw": 100,
        "notlar": "Üye fiyatı (~yaklaşık)",
    },
    "tesla-sc": {
        "ad": "Tesla Supercharger",
        "tip": "DC",
        "kwh": 16.00,
        "max_kw": 250,
        "notlar": "Tesla hesabı gerekli (~yaklaşık)",
    },
    "ev-sarj-gunduz": {
        "ad": "Ev Şarjı (Gündüz)",
        "tip": "AC",
        "kwh": 5.00,
        "max_kw": 11,
        "notlar": "EPDK konut tarifesi (~yaklaşık)",
    },
    "ev-sarj-gece": {
        "ad": "Ev Şarjı (Gece 22-06)",
        "tip": "AC",
        "kwh": 2.50,
        "max_kw": 11,
        "notlar": "EPDK gece/boş saat tarifesi (~yaklaşık)",
    },
}

# Benzin/motorin karşılaştırma (Mart 2026 tahmini)
BENZIN_FIYAT = 57.0      # TL/litre
MOTORIN_FIYAT = 53.0     # TL/litre
LPG_FIYAT = 18.0         # TL/litre
BENZIN_TUKETIM = 7.0     # L/100km (ortalama)
MOTORIN_TUKETIM = 5.5    # L/100km (ortalama)
LPG_TUKETIM = 10.0       # L/100km (ortalama)


def hesapla_sure(kwh: float, sarj_guc_kw: float) -> str:
    """Tahmini şarj süresi hesapla"""
    if sarj_guc_kw >= 150:
        sure_saat = kwh / (sarj_guc_kw * 0.9)  # %90 verimlilik
    elif sarj_guc_kw >= 50:
        sure_saat = kwh / (sarj_guc_kw * 0.85)
    else:
        sure_saat = kwh / (sarj_guc_kw * 0.95)

    dakika = sure_saat * 60
    if dakika < 60:
        return f"~{int(dakika)} dk"
    else:
        saat = int(dakika // 60)
        kalan_dk = int(dakika % 60)
        if kalan_dk > 0:
            return f"~{saat} saat {kalan_dk} dk"
        return f"~{saat} saat"


def yazdir_tablo(baslik: str, satirlar: list, kolonlar: list):
    """Tablo formatında çıktı ver"""
    # Kolon genişlikleri
    genislikler = [len(k) for k in kolonlar]
    for satir in satirlar:
        for i, hucre in enumerate(satir):
            if i < len(genislikler):
                genislikler[i] = max(genislikler[i], len(str(hucre)))

    ayrac = "┼".join("─" * (g + 2) for g in genislikler)
    ust = "┌" + "┬".join("─" * (g + 2) for g in genislikler) + "┐"
    alt = "└" + "┴".join("─" * (g + 2) for g in genislikler) + "┘"
    baslik_ayrac = "├" + "┼".join("─" * (g + 2) for g in genislikler) + "┤"

    def satir_yaz(hucreler, sol="│", sag="│", ayrac="│"):
        parca = []
        for i, h in enumerate(hucreler):
            genislik = genislikler[i] if i < len(genislikler) else 15
            parca.append(f" {str(h):<{genislik}} ")
        return sol + ayrac.join(parca) + sag

    print(f"\n{baslik}")
    print(ust)
    print(satir_yaz(kolonlar))
    print(baslik_ayrac)
    for i, satir in enumerate(satirlar):
        print(satir_yaz(satir))
    print(alt)


def main():
    parser = argparse.ArgumentParser(
        description="🔋 Türkiye EV Şarj Maliyet Hesaplayıcı",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python3 sarj_maliyet.py --arac togg-t10x --mesafe 300
  python3 sarj_maliyet.py --batarya 77 --tuketim 18 --mesafe 400
  python3 sarj_maliyet.py --arac hyundai-ioniq6 --mesafe 500 --operator zes-dc
  python3 sarj_maliyet.py --listele

Desteklenen araçlar: togg-t10x, tesla-model-y, byd-atto3, mg4, hyundai-ioniq5,
  hyundai-ioniq6, kia-ev6, vw-id4, bmw-ix1, volvo-ex30, ve daha fazlası
        """
    )

    parser.add_argument("--arac", type=str, help="Araç adı (örn: togg-t10x, tesla-model-y)")
    parser.add_argument("--batarya", type=float, help="Batarya kapasitesi kWh (manuel giriş)")
    parser.add_argument("--tuketim", type=float, help="Tüketim kWh/100km (manuel giriş)")
    parser.add_argument("--max-dc", type=float, help="Maksimum DC şarj hızı kW (manuel giriş)", dest="max_dc")
    parser.add_argument("--mesafe", type=float, help="Yolculuk mesafesi km", required=False)
    parser.add_argument("--operator", type=str, help="Belirli operatör (zes-dc, esarj-dc vb.)")
    parser.add_argument("--sarj-tipi", choices=["ac", "dc", "ultra", "hepsi"], default="hepsi",
                        help="Şarj tipi filtresi", dest="sarj_tipi")
    parser.add_argument("--listele", action="store_true", help="Desteklenen araçları listele")
    parser.add_argument("--karsilastir", action="store_true", help="Benzin/motorin karşılaştırması göster")

    args = parser.parse_args()

    # Araç listesi
    if args.listele:
        print("\n🚗 Desteklenen Araçlar:")
        print("-" * 65)
        for kod, bilgi in ARACLAR.items():
            print(f"  {kod:<22} → {bilgi['ad']}")
        print("-" * 65)
        print(f"\nToplam {len(ARACLAR)} araç")
        return

    # Araç bilgisi belirle
    if args.arac:
        arac_kodu = args.arac.lower()
        if arac_kodu not in ARACLAR:
            print(f"❌ Araç bulunamadı: {arac_kodu}")
            print("💡 --listele ile desteklenen araçları görün")
            sys.exit(1)
        arac = ARACLAR[arac_kodu]
        batarya = arac["batarya_kwh"]
        tuketim = arac["tuketim_kwh_100km"]
        max_dc = arac["max_dc_kw"]
        arac_adi = arac["ad"]
    elif args.batarya and args.tuketim:
        batarya = args.batarya
        tuketim = args.tuketim
        max_dc = args.max_dc or 100
        arac_adi = f"Özel Araç ({batarya} kWh, {tuketim} kWh/100km)"
        arac = {
            "batarya_kwh": batarya,
            "menzil_km": int(batarya / tuketim * 100 * 0.85),
            "tuketim_kwh_100km": tuketim,
            "max_dc_kw": max_dc,
            "ac_kw": 11,
        }
    else:
        parser.print_help()
        print("\n❌ --arac veya (--batarya + --tuketim) gerekli!")
        sys.exit(1)

    mesafe = args.mesafe or 100.0

    # Başlık
    print("\n" + "=" * 65)
    print(f"🔋 {arac_adi}")
    print("=" * 65)
    print(f"  Batarya    : {batarya:.1f} kWh")
    print(f"  WLTP Menzil: {arac.get('menzil_km', int(batarya/tuketim*100*0.85))} km")
    print(f"  Tüketim    : {tuketim:.1f} kWh/100km")
    print(f"  Max DC Şarj: {max_dc} kW")
    print(f"  Mesafe     : {mesafe:.0f} km")

    # Enerji ihtiyacı
    gereken_kwh = mesafe * tuketim / 100
    print(f"\n  ⚡ Gerekli enerji: {gereken_kwh:.1f} kWh")

    if gereken_kwh > batarya * 0.9:
        durak_sayisi = int(gereken_kwh / (batarya * 0.8)) + 1
        print(f"  ⚠️  Not: {mesafe:.0f} km için {durak_sayisi} şarj durağı gerekebilir!")
    print()

    # Operatör filtrele
    if args.operator:
        operatorler = {k: v for k, v in OPERATORLER.items() if k == args.operator or k.startswith(args.operator)}
        if not operatorler:
            print(f"❌ Operatör bulunamadı: {args.operator}")
            print("Geçerli operatörler: " + ", ".join(OPERATORLER.keys()))
            sys.exit(1)
    elif args.sarj_tipi == "ac":
        operatorler = {k: v for k, v in OPERATORLER.items() if v["tip"] == "AC"}
    elif args.sarj_tipi == "dc":
        operatorler = {k: v for k, v in OPERATORLER.items() if v["tip"] == "DC" and v["max_kw"] <= 150}
    elif args.sarj_tipi == "ultra":
        operatorler = {k: v for k, v in OPERATORLER.items() if v["max_kw"] >= 150}
    else:
        operatorler = OPERATORLER

    # Maliyet tablosu
    satirlar = []
    for kod, op in operatorler.items():
        kwh_fiyat = op["kwh"]
        toplam_tl = gereken_kwh * kwh_fiyat

        # Şarj gücü (aracın max DC veya AC hızıyla sınırla)
        if op["tip"] == "DC":
            efektif_kw = min(max_dc, op["max_kw"])
        else:
            efektif_kw = min(arac.get("ac_kw", 11), op["max_kw"])

        sure = hesapla_sure(gereken_kwh, efektif_kw)

        satirlar.append([
            op["ad"],
            f"₺{kwh_fiyat:.2f}",
            f"₺{toplam_tl:.2f}",
            sure,
        ])

    # Fiyata göre sırala
    satirlar.sort(key=lambda x: float(x[2].replace("₺", "").replace(",", ".")))

    yazdir_tablo(
        "Şarj Maliyeti Karşılaştırması:",
        satirlar,
        ["Operatör", "TL/kWh", "Toplam", "Süre"]
    )

    # Benzin karşılaştırması
    print("\nYakıt Karşılaştırması (aynı mesafe):")
    print(f"  🟢 Ev şarjı gece (₺2.50/kWh) : ₺{gereken_kwh * 2.50:.2f}")
    print(f"  🟡 Ev şarjı gündüz (₺5.00/kWh): ₺{gereken_kwh * 5.00:.2f}")

    benzin_maliyet = mesafe * BENZIN_TUKETIM / 100 * BENZIN_FIYAT
    motorin_maliyet = mesafe * MOTORIN_TUKETIM / 100 * MOTORIN_FIYAT
    lpg_maliyet = mesafe * LPG_TUKETIM / 100 * LPG_FIYAT

    print(f"  🔴 Benzinli (7L/100km, ₺{BENZIN_FIYAT:.0f}/L): ₺{benzin_maliyet:.2f}")
    print(f"  🟠 Dizel (5.5L/100km, ₺{MOTORIN_FIYAT:.0f}/L)  : ₺{motorin_maliyet:.2f}")
    print(f"  🔵 LPG (10L/100km, ₺{LPG_FIYAT:.0f}/L)     : ₺{lpg_maliyet:.2f}")

    ev_gece = gereken_kwh * 2.50
    tasarruf_benzin = ((benzin_maliyet - ev_gece) / benzin_maliyet) * 100
    tasarruf_motorin = ((motorin_maliyet - ev_gece) / motorin_maliyet) * 100

    print(f"\n✅ Ev (gece) vs Benzin  : %{tasarruf_benzin:.0f} tasarruf")
    print(f"✅ Ev (gece) vs Motorin : %{tasarruf_motorin:.0f} tasarruf")

    if args.karsilastir:
        print("\n" + "─" * 65)
        print("📊 Aylık Maliyet Senaryosu (bu araçla):")
        print(f"  (Mesafe: {mesafe:.0f} km/yolculuk → Ayda 20 sefer = {mesafe*20:.0f} km)")
        aylik_kwh = gereken_kwh * 20
        print(f"\n  Ev gece  : ₺{aylik_kwh * 2.50:.0f}/ay")
        print(f"  Ev gündüz: ₺{aylik_kwh * 5.00:.0f}/ay")
        print(f"  ZES DC   : ₺{aylik_kwh * 14.49:.0f}/ay")
        aylik_benzin = mesafe * 20 * BENZIN_TUKETIM / 100 * BENZIN_FIYAT
        print(f"  Benzin   : ₺{aylik_benzin:.0f}/ay")

    print("\n" + "─" * 65)
    print("⚠️  Fiyatlar yaklaşık olup değişkendir. Güncel fiyat için")
    print("   operatör uygulamasını kontrol edin.")
    print("   ZES resmi fiyat: https://zes.net/tr/fiyatlandirma")
    print("\n💼 Elektrikli araç filo yönetimi: finhouse.ai")
    print("─" * 65 + "\n")


if __name__ == "__main__":
    main()
