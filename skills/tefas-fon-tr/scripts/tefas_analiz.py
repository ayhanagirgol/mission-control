#!/usr/bin/env python3
"""
TEFAS Fon Analiz Aracı
======================
TEFAS (Türkiye Elektronik Fon Alım Satım Platformu) yatırım fonlarını
analiz eden, karşılaştıran ve portföy önerisi sunan araç.

⚠️  Yatırım tavsiyesi değildir. Bilgi amaçlıdır.
    SPK lisanslı yatırım danışmanına başvurun.
    Kurumsal yatırım danışmanlığı: finhouse.ai

Kaynak: tefas.gov.tr | SPK | Takasbank

Kullanım:
  python3 tefas_analiz.py --fon TLY
  python3 tefas_analiz.py --karsilastir TLY,DFI,PHE
  python3 tefas_analiz.py --tur serbest
  python3 tefas_analiz.py --risk orta
  python3 tefas_analiz.py --portfoy 100000 --risk orta
  python3 tefas_analiz.py --liste
"""

import argparse
import sys

# ─────────────────────────────────────────────────────────────────────────────
# FON VERİTABANI
# Veriler yaklaşık referans değerlerdir (2024-2025 dönemi).
# Güncel değerler için: tefas.gov.tr
#
# Alanlar:
#   ad          : Fon tam adı
#   kurucu      : Portföy yönetim şirketi
#   tur         : Fon türü (serbest|ppf|hisse|altin|katilim|borclanma|karma|byf|degisken)
#   risk        : SPK risk seviyesi 1-7
#   ter         : Yıllık toplam gider oranı (%)
#   getiri_1y   : Tahmini 1 yıllık getiri % (referans, geçmişe dayalı)
#   getiri_3y   : Tahmini 3 yıllık kümülatif getiri % (referans)
#   aum_mtl     : Yaklaşık fon büyüklüğü (Milyon TL)
#   yatirimci   : Yaklaşık yatırımcı sayısı
#   min_yatirim : Minimum yatırım (TL) — nitelikli serbest için 500000
#   nitelikli   : True = nitelikli yatırımcı gerektirir
#   stopaj      : Stopaj oranı (0 veya 0.10)
#   strateji    : Kısa strateji açıklaması
# ─────────────────────────────────────────────────────────────────────────────

FONLAR = {
    # ── SERBEST FONLAR ──────────────────────────────────────────────────────
    "TLY": {
        "ad": "Tera Portföy Yabancı Para Serbest Fon",
        "kurucu": "Tera Portföy",
        "tur": "serbest",
        "risk": 7,
        "ter": 2.19,
        "getiri_1y": 62.5,
        "getiri_3y": 285.0,
        "aum_mtl": 1850,
        "yatirimci": 8200,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Yabancı para, Eurobond, dövizli enstrümanlar",
    },
    "DFI": {
        "ad": "Deniz Portföy Serbest Fon",
        "kurucu": "Deniz Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.85,
        "getiri_1y": 55.2,
        "getiri_3y": 248.0,
        "aum_mtl": 920,
        "yatirimci": 4100,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Çok varlıklı aktif yönetim, dinamik tahsis",
    },
    "PHE": {
        "ad": "Ak Portföy Serbest Fon",
        "kurucu": "Ak Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.92,
        "getiri_1y": 51.8,
        "getiri_3y": 232.0,
        "aum_mtl": 780,
        "yatirimci": 3600,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Hisse + türev + sabit getirili karma",
    },
    "TTE": {
        "ad": "Tacirler Portföy Serbest Fon",
        "kurucu": "Tacirler Portföy",
        "tur": "serbest",
        "risk": 7,
        "ter": 2.10,
        "getiri_1y": 58.3,
        "getiri_3y": 262.0,
        "aum_mtl": 560,
        "yatirimci": 2800,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Global makro strateji, çoklu varlık",
    },
    "PBR": {
        "ad": "Azimut Portföy Serbest Fon",
        "kurucu": "Azimut Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.75,
        "getiri_1y": 48.5,
        "getiri_3y": 218.0,
        "aum_mtl": 420,
        "yatirimci": 2100,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Karma aktif yönetim",
    },
    "GAE": {
        "ad": "Garanti BBVA Portföy Serbest Fon",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.80,
        "getiri_1y": 50.4,
        "getiri_3y": 225.0,
        "aum_mtl": 1100,
        "yatirimci": 5200,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Çok stratejili, BBVA global görüşü",
    },
    "AK5": {
        "ad": "Ak Portföy 5. Serbest Fon",
        "kurucu": "Ak Portföy",
        "tur": "serbest",
        "risk": 7,
        "ter": 2.05,
        "getiri_1y": 56.7,
        "getiri_3y": 255.0,
        "aum_mtl": 650,
        "yatirimci": 3100,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Hisse ağırlıklı serbest, agresif büyüme",
    },
    "YAS": {
        "ad": "Yapı Kredi Portföy Serbest Fon",
        "kurucu": "YK Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.90,
        "getiri_1y": 49.8,
        "getiri_3y": 220.0,
        "aum_mtl": 890,
        "yatirimci": 4400,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Dinamik tahsis, çoklu varlık",
    },
    "IPJ": {
        "ad": "İş Portföy Serbest Fon",
        "kurucu": "İş Portföy",
        "tur": "serbest",
        "risk": 6,
        "ter": 1.95,
        "getiri_1y": 52.1,
        "getiri_3y": 238.0,
        "aum_mtl": 1250,
        "yatirimci": 6000,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Çok varlıklı, İş Bankası ekosistemi",
    },
    "MAC": {
        "ad": "Marmara Portföy Serbest Fon",
        "kurucu": "Marmara Portföy",
        "tur": "serbest",
        "risk": 7,
        "ter": 2.30,
        "getiri_1y": 65.8,
        "getiri_3y": 302.0,
        "aum_mtl": 380,
        "yatirimci": 1800,
        "min_yatirim": 500000,
        "nitelikli": True,
        "stopaj": 0.10,
        "strateji": "Agresif büyüme, türev kullanımı yüksek",
    },
    # ── PARA PİYASASI FONLARI ────────────────────────────────────────────────
    "TI2": {
        "ad": "Tera Portföy Para Piyasası Fonu",
        "kurucu": "Tera Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.19,
        "getiri_1y": 47.5,
        "getiri_3y": 195.0,
        "aum_mtl": 3200,
        "yatirimci": 85000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Aktif likit yönetim, repo + kısa DİBS",
    },
    "ZPP": {
        "ad": "Ziraat Portföy Para Piyasası Fonu",
        "kurucu": "Ziraat Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.10,
        "getiri_1y": 46.8,
        "getiri_3y": 190.0,
        "aum_mtl": 8500,
        "yatirimci": 320000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Devlet destekli, geniş kitle, düşük TER",
    },
    "ARP": {
        "ad": "Aktif Portföy Para Piyasası Fonu",
        "kurucu": "Aktif Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.15,
        "getiri_1y": 47.1,
        "getiri_3y": 192.0,
        "aum_mtl": 1800,
        "yatirimci": 45000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Repo + kısa vadeli DİBS",
    },
    "IPP": {
        "ad": "İş Portföy Para Piyasası Fonu",
        "kurucu": "İş Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.12,
        "getiri_1y": 47.2,
        "getiri_3y": 191.0,
        "aum_mtl": 6200,
        "yatirimci": 210000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Büyük AUM, istikrarlı PPF",
    },
    "GAP": {
        "ad": "Garanti BBVA Para Piyasası Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.13,
        "getiri_1y": 47.0,
        "getiri_3y": 190.5,
        "aum_mtl": 5800,
        "yatirimci": 195000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Geniş dağıtım, BBVA kökenli",
    },
    "YAP": {
        "ad": "Yapı Kredi Para Piyasası Fonu",
        "kurucu": "YK Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.11,
        "getiri_1y": 47.0,
        "getiri_3y": 191.0,
        "aum_mtl": 4100,
        "yatirimci": 138000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "UniCredit kökenli, güçlü banka",
    },
    "AK2": {
        "ad": "Ak Portföy Para Piyasası Fonu",
        "kurucu": "Ak Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.14,
        "getiri_1y": 47.3,
        "getiri_3y": 192.5,
        "aum_mtl": 4800,
        "yatirimci": 158000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Akbank kökenli, yüksek AUM",
    },
    "FPP": {
        "ad": "Finans Portföy Para Piyasası Fonu",
        "kurucu": "Finans Portföy",
        "tur": "ppf",
        "risk": 1,
        "ter": 0.15,
        "getiri_1y": 46.9,
        "getiri_3y": 190.0,
        "aum_mtl": 2200,
        "yatirimci": 72000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "QNB Finansbank kökenli PPF",
    },
    # ── HİSSE SENEDİ FONLARI ────────────────────────────────────────────────
    "AK1": {
        "ad": "Ak Portföy Hisse Senedi Fonu",
        "kurucu": "Ak Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.85,
        "getiri_1y": 38.5,
        "getiri_3y": 185.0,
        "aum_mtl": 2100,
        "yatirimci": 42000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Büyük cap BIST hisseleri, aktif seçim",
    },
    "ADA": {
        "ad": "Ada Portföy Hisse Senedi Fonu",
        "kurucu": "Ada Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.70,
        "getiri_1y": 42.1,
        "getiri_3y": 198.0,
        "aum_mtl": 680,
        "yatirimci": 18000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Aktif hisse seçim, büyüme odaklı",
    },
    "TI3": {
        "ad": "Tera Portföy Hisse Senedi Fonu",
        "kurucu": "Tera Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.75,
        "getiri_1y": 40.3,
        "getiri_3y": 190.0,
        "aum_mtl": 920,
        "yatirimci": 28000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "BIST büyüme odaklı aktif yönetim",
    },
    "YAY": {
        "ad": "Yapı Kredi Portföy Hisse Senedi Fonu",
        "kurucu": "YK Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.80,
        "getiri_1y": 37.8,
        "getiri_3y": 182.0,
        "aum_mtl": 1450,
        "yatirimci": 35000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "BIST-100 temelli, diversifiye",
    },
    "GAH": {
        "ad": "Garanti BBVA Portföy Hisse Senedi Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.75,
        "getiri_1y": 39.2,
        "getiri_3y": 187.0,
        "aum_mtl": 1850,
        "yatirimci": 48000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Büyük cap odaklı, BBVA analizi",
    },
    "ZPH": {
        "ad": "Ziraat Portföy Hisse Senedi Fonu",
        "kurucu": "Ziraat Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 0.85,
        "getiri_1y": 37.5,
        "getiri_3y": 180.0,
        "aum_mtl": 2800,
        "yatirimci": 95000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Devlet kökenli, geniş portföy, düşük TER",
    },
    "IPH": {
        "ad": "İş Portföy Hisse Senedi Fonu",
        "kurucu": "İş Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 1.65,
        "getiri_1y": 41.0,
        "getiri_3y": 195.0,
        "aum_mtl": 2200,
        "yatirimci": 58000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Uzun vadeli büyüme, temettü ağırlıklı",
    },
    "TIS": {
        "ad": "Tera Portföy BIST-30 Endeks Fonu",
        "kurucu": "Tera Portföy",
        "tur": "hisse",
        "risk": 6,
        "ter": 0.45,
        "getiri_1y": 35.8,
        "getiri_3y": 172.0,
        "aum_mtl": 480,
        "yatirimci": 22000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Pasif BIST-30 endeks takip, düşük TER",
    },
    # ── ALTIN FONLARI ───────────────────────────────────────────────────────
    "GLD": {
        "ad": "Garanti BBVA Portföy Altın Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 1.00,
        "getiri_1y": 45.2,
        "getiri_3y": 210.0,
        "aum_mtl": 3800,
        "yatirimci": 125000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Fiziksel altın bazlı, geniş dağıtım",
    },
    "GAL": {
        "ad": "Garanti BBVA Portföy Altın Katılım Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 0.95,
        "getiri_1y": 44.8,
        "getiri_3y": 208.0,
        "aum_mtl": 2100,
        "yatirimci": 68000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Altın + katılım prensipleri",
    },
    "AGA": {
        "ad": "Ak Portföy Altın Fonu",
        "kurucu": "Ak Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 1.05,
        "getiri_1y": 44.5,
        "getiri_3y": 207.0,
        "aum_mtl": 1650,
        "yatirimci": 52000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Aktif altın yönetimi",
    },
    "ZAL": {
        "ad": "Ziraat Portföy Altın Fonu",
        "kurucu": "Ziraat Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 0.60,
        "getiri_1y": 45.0,
        "getiri_3y": 208.5,
        "aum_mtl": 4200,
        "yatirimci": 165000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Düşük TER, devlet güvenceli kurum",
    },
    "TIA": {
        "ad": "Tera Portföy Altın Fonu",
        "kurucu": "Tera Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 0.80,
        "getiri_1y": 44.9,
        "getiri_3y": 207.5,
        "aum_mtl": 980,
        "yatirimci": 32000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Likit altın fonu",
    },
    "IPG": {
        "ad": "İş Portföy Altın Fonu",
        "kurucu": "İş Portföy",
        "tur": "altin",
        "risk": 4,
        "ter": 0.85,
        "getiri_1y": 44.7,
        "getiri_3y": 208.0,
        "aum_mtl": 2800,
        "yatirimci": 92000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Fiziksel altın ağırlıklı",
    },
    # ── KATILIM FONLARI ─────────────────────────────────────────────────────
    "KYA": {
        "ad": "Kuveyt Türk Portföy Katılım Fonu",
        "kurucu": "KT Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.75,
        "getiri_1y": 43.5,
        "getiri_3y": 182.0,
        "aum_mtl": 2400,
        "yatirimci": 78000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Sukuk + katılım mevduatı, faizsiz",
    },
    "TKF": {
        "ad": "Türkiye Finans Portföy Katılım Fonu",
        "kurucu": "TF Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.70,
        "getiri_1y": 43.2,
        "getiri_3y": 180.0,
        "aum_mtl": 1850,
        "yatirimci": 62000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Kira sertifikası ağırlıklı",
    },
    "ZKK": {
        "ad": "Ziraat Portföy Katılım Fonu",
        "kurucu": "Ziraat Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.50,
        "getiri_1y": 43.0,
        "getiri_3y": 179.0,
        "aum_mtl": 3200,
        "yatirimci": 105000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Devlet kira sertifikası, düşük TER",
    },
    "AKK": {
        "ad": "Ak Portföy Katılım Fonu",
        "kurucu": "Ak Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.70,
        "getiri_1y": 43.3,
        "getiri_3y": 181.0,
        "aum_mtl": 1400,
        "yatirimci": 45000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Sukuk odaklı katılım",
    },
    "IPK": {
        "ad": "İş Portföy Katılım Fonu",
        "kurucu": "İş Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.68,
        "getiri_1y": 43.1,
        "getiri_3y": 180.5,
        "aum_mtl": 1100,
        "yatirimci": 38000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Çeşitlendirilmiş katılım enstrümanları",
    },
    "GAK": {
        "ad": "Garanti BBVA Portföy Katılım Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "katilim",
        "risk": 2,
        "ter": 0.65,
        "getiri_1y": 43.4,
        "getiri_3y": 181.5,
        "aum_mtl": 1650,
        "yatirimci": 52000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Karma katılım, geniş çeşitlendirme",
    },
    # ── BORÇLANMA ARAÇLARI FONLARI ──────────────────────────────────────────
    "GAB": {
        "ad": "Garanti BBVA Portföy Borçlanma Araçları Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "borclanma",
        "risk": 3,
        "ter": 0.85,
        "getiri_1y": 44.2,
        "getiri_3y": 188.0,
        "aum_mtl": 2800,
        "yatirimci": 92000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "DİBS + özel sektör tahvil karışımı",
    },
    "AKB": {
        "ad": "Ak Portföy Borçlanma Araçları Fonu",
        "kurucu": "Ak Portföy",
        "tur": "borclanma",
        "risk": 3,
        "ter": 0.90,
        "getiri_1y": 44.8,
        "getiri_3y": 190.0,
        "aum_mtl": 1950,
        "yatirimci": 62000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Hazine tahvil ağırlıklı",
    },
    "TIT": {
        "ad": "Tera Portföy Tahvil Fonu",
        "kurucu": "Tera Portföy",
        "tur": "borclanma",
        "risk": 3,
        "ter": 0.75,
        "getiri_1y": 45.1,
        "getiri_3y": 191.0,
        "aum_mtl": 1200,
        "yatirimci": 38000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Uzun vadeli devlet tahvili",
    },
    "ZKB": {
        "ad": "Ziraat Portföy Borçlanma Araçları Fonu",
        "kurucu": "Ziraat Portföy",
        "tur": "borclanma",
        "risk": 2,
        "ter": 0.45,
        "getiri_1y": 43.8,
        "getiri_3y": 186.0,
        "aum_mtl": 4800,
        "yatirimci": 152000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Kamu kağıtları, düşük risk, düşük TER",
    },
    "FTI": {
        "ad": "Finans Portföy TÜFE Tahvil Fonu",
        "kurucu": "Finans Portföy",
        "tur": "borclanma",
        "risk": 3,
        "ter": 0.80,
        "getiri_1y": 46.5,
        "getiri_3y": 195.0,
        "aum_mtl": 980,
        "yatirimci": 32000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "TÜFE endeksli tahvil, enflasyon koruması",
    },
    "GAT": {
        "ad": "Garanti BBVA Portföy TÜFE Tahvil Fonu",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "borclanma",
        "risk": 3,
        "ter": 0.82,
        "getiri_1y": 46.2,
        "getiri_3y": 194.0,
        "aum_mtl": 1150,
        "yatirimci": 38000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Enflasyona endeksli devlet tahvili",
    },
    # ── KARMA / DENGELİ FONLAR ──────────────────────────────────────────────
    "AKM": {
        "ad": "Ak Portföy Karma Fon",
        "kurucu": "Ak Portföy",
        "tur": "karma",
        "risk": 4,
        "ter": 1.50,
        "getiri_1y": 40.8,
        "getiri_3y": 185.0,
        "aum_mtl": 1250,
        "yatirimci": 38000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "%40 hisse / %60 tahvil karma",
    },
    "TIK": {
        "ad": "Tera Portföy Karma Fon",
        "kurucu": "Tera Portföy",
        "tur": "karma",
        "risk": 4,
        "ter": 1.45,
        "getiri_1y": 41.2,
        "getiri_3y": 187.0,
        "aum_mtl": 850,
        "yatirimci": 28000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Dengeli karma, dinamik tahsis",
    },
    "YAK": {
        "ad": "YK Portföy Dengeli Karma Fon",
        "kurucu": "YK Portföy",
        "tur": "karma",
        "risk": 4,
        "ter": 1.55,
        "getiri_1y": 40.5,
        "getiri_3y": 183.0,
        "aum_mtl": 980,
        "yatirimci": 32000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "%50 hisse / %50 tahvil dengeli",
    },
    "IPD": {
        "ad": "İş Portföy Değişken Fon",
        "kurucu": "İş Portföy",
        "tur": "karma",
        "risk": 4,
        "ter": 1.60,
        "getiri_1y": 42.1,
        "getiri_3y": 190.0,
        "aum_mtl": 1850,
        "yatirimci": 58000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Esnek tahsis değişken fon",
    },
    "GAD": {
        "ad": "Garanti BBVA Portföy Dengeli Fon",
        "kurucu": "Garanti BBVA Portföy",
        "tur": "karma",
        "risk": 4,
        "ter": 1.52,
        "getiri_1y": 41.5,
        "getiri_3y": 188.0,
        "aum_mtl": 2200,
        "yatirimci": 72000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Dengeli büyüme, çok varlıklı",
    },
    # ── BYF (ETF) ───────────────────────────────────────────────────────────
    "GOLDIST": {
        "ad": "İstanbul Altın Borsası ETF (GOLDIST)",
        "kurucu": "İAB / Borsa İstanbul",
        "tur": "byf",
        "risk": 4,
        "ter": 0.49,
        "getiri_1y": 44.5,
        "getiri_3y": 207.0,
        "aum_mtl": 850,
        "yatirimci": 28000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.10,
        "strateji": "Altın ETF, BIST'te anlık işlem",
    },
    "DJIST": {
        "ad": "Dow Jones İstanbul 20 BYF",
        "kurucu": "Ak Portföy",
        "tur": "byf",
        "risk": 5,
        "ter": 0.45,
        "getiri_1y": 36.2,
        "getiri_3y": 170.0,
        "aum_mtl": 320,
        "yatirimci": 12000,
        "min_yatirim": 1,
        "nitelikli": False,
        "stopaj": 0.0,
        "strateji": "Seçili 20 hisse endeksi ETF",
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# PORTFÖY STRATEJİLERİ
# ─────────────────────────────────────────────────────────────────────────────

PORTFOY_STRATEJILERI = {
    "dusuk": {
        "ad": "Düşük Risk — Sermaye Koruma",
        "aciklama": "PPF ağırlıklı, güvenli varlıklar. Enflasyon koruması öncelikli.",
        "dagılım": [
            ("ppf",       60, "Para piyasası fonu — likidite ve güvenlik"),
            ("altin",     20, "Altın fonu — TL değer kaybı koruması"),
            ("borclanma", 20, "Borçlanma araçları fonu — sabit getiri"),
        ],
        "onerilen_fonlar": {
            "ppf":       ["ZPP", "IPP", "TI2"],
            "altin":     ["ZAL", "AGA"],
            "borclanma": ["ZKB", "FTI"],
        },
    },
    "orta": {
        "ad": "Orta Risk — Dengeli Büyüme",
        "aciklama": "Çeşitlendirilmiş portföy. Büyüme + koruma dengesi.",
        "dagılım": [
            ("ppf",    30, "Para piyasası fonu — likit tampon"),
            ("hisse",  30, "Hisse senedi fonu — büyüme"),
            ("altin",  20, "Altın fonu — çeşitlendirme"),
            ("serbest", 20, "Serbest fon — yüksek getiri (nitelikli ise)"),
        ],
        "onerilen_fonlar": {
            "ppf":     ["TI2", "IPP"],
            "hisse":   ["AK1", "ADA", "TI3"],
            "altin":   ["AGA", "ZAL"],
            "serbest": ["PHE", "GAE"],
        },
    },
    "yuksek": {
        "ad": "Yüksek Risk — Agresif Büyüme",
        "aciklama": "Yüksek getiri hedefli. Volatilite toleransı yüksek, uzun vadeli.",
        "dagılım": [
            ("serbest", 40, "Serbest fon — yüksek getiri (nitelikli yatırımcı)"),
            ("hisse",   30, "Hisse senedi fonu — BIST büyüme"),
            ("altin",   20, "Altın fonu — kur koruması"),
            ("ppf",     10, "Para piyasası — minimum likit tampon"),
        ],
        "onerilen_fonlar": {
            "serbest": ["TLY", "DFI", "TTE"],
            "hisse":   ["ADA", "IPH", "AK1"],
            "altin":   ["ZAL", "TIA"],
            "ppf":     ["TI2"],
        },
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# YARDIMCI FONKSİYONLAR
# ─────────────────────────────────────────────────────────────────────────────

def uyari_banner():
    print("=" * 70)
    print("⚠️  Yatırım tavsiyesi değildir. Bilgi amaçlıdır.")
    print("   SPK lisanslı yatırım danışmanına başvurun.")
    print("   Tüm fonlar SPK denetimine tabidir.")
    print("   Güncel değerler: tefas.gov.tr")
    print("   Kurumsal yatırım danışmanlığı: finhouse.ai")
    print("=" * 70)


def risk_yildiz(seviye: int) -> str:
    """Risk seviyesini 1-7 skalasında görsel olarak gösterir."""
    return "█" * seviye + "░" * (7 - seviye) + f"  {seviye}/7"


def stopaj_goster(oran: float) -> str:
    if oran == 0:
        return "%0 (Hisse Yoğun — Muaf)"
    return f"%{int(oran * 100)}"


def para_formatla(sayi: float, birim: str = "TL") -> str:
    if sayi >= 1000:
        return f"{sayi/1000:.1f}B {birim}"
    return f"{sayi:.0f}M {birim}"


def yatirimci_formatla(sayi: int) -> str:
    if sayi >= 1000:
        return f"{sayi/1000:.0f}K"
    return str(sayi)


# ─────────────────────────────────────────────────────────────────────────────
# FON DETAY
# ─────────────────────────────────────────────────────────────────────────────

def fon_detay(kod: str):
    kod = kod.upper().strip()
    if kod not in FONLAR:
        print(f"❌ '{kod}' kodu bulunamadı. Tüm fonları görmek için: --liste")
        return
    f = FONLAR[kod]
    print()
    print(f"{'─' * 60}")
    print(f"  📊 {kod} — {f['ad']}")
    print(f"{'─' * 60}")
    print(f"  Kurucu        : {f['kurucu']}")
    print(f"  Fon Türü      : {f['tur'].upper()}")
    print(f"  Risk Seviyesi : {risk_yildiz(f['risk'])}")
    print(f"  TER (Yön.Üc.) : %{f['ter']:.2f} / yıl")
    print(f"  Stopaj        : {stopaj_goster(f['stopaj'])}")
    print()
    print(f"  📈 Tahmini Getiri (Referans — geçmiş performans):")
    print(f"     1 Yıl      : %{f['getiri_1y']:.1f}")
    print(f"     3 Yıl (küm): %{f['getiri_3y']:.1f}")
    print()
    print(f"  💰 Fon Büyüklüğü : {para_formatla(f['aum_mtl'])}")
    print(f"  👥 Yatırımcı     : {yatirimci_formatla(f['yatirimci'])}")
    min_y = f['min_yatirim']
    if min_y >= 500000:
        print(f"  🔒 Min. Yatırım  : {min_y:,} TL (Nitelikli Yatırımcı)")
    else:
        print(f"  💵 Min. Yatırım  : {min_y} TL")
    print()
    print(f"  📋 Strateji : {f['strateji']}")
    print(f"{'─' * 60}")
    print()
    uyari_banner()


# ─────────────────────────────────────────────────────────────────────────────
# FON KARŞILAŞTIRMA
# ─────────────────────────────────────────────────────────────────────────────

def karsilastir(kodlar_str: str):
    kodlar = [k.strip().upper() for k in kodlar_str.split(",")]
    bulunanlar = []
    for k in kodlar:
        if k not in FONLAR:
            print(f"⚠️  '{k}' bulunamadı, atlanıyor.")
        else:
            bulunanlar.append(k)

    if not bulunanlar:
        print("❌ Hiç fon bulunamadı.")
        return

    print()
    print("📊 FON KARŞILAŞTIRMA")
    print()

    # Başlık satırı
    header = f"{'Kod':<8} {'Fon Adı':<42} {'1 Yıl':>7} {'3 Yıl':>8} {'TER':>6} {'Risk':>6} {'Stopaj':>8}"
    sep = "─" * len(header)
    print(sep)
    print(header)
    print(sep)

    for k in bulunanlar:
        f = FONLAR[k]
        ad = f["ad"][:41]
        print(
            f"{k:<8} {ad:<42} "
            f"{'%' + str(f['getiri_1y']):<7} "
            f"{'%' + str(f['getiri_3y']):<8} "
            f"{'%' + str(f['ter']):<6} "
            f"{f['risk']:>2}/7    "
            f"{stopaj_goster(f['stopaj'])}"
        )

    print(sep)
    print()
    print("📌 Notlar:")
    print("   • 1 Yıl / 3 Yıl getiriler TAHMINI ve geçmiş performansa dayalıdır")
    print("   • TER = Toplam Gider Oranı (yıllık yönetim ücreti %'si)")
    print("   • Güncel birim pay değerleri için: tefas.gov.tr")
    print()
    uyari_banner()


# ─────────────────────────────────────────────────────────────────────────────
# TÜRE GÖRE LİSTELE
# ─────────────────────────────────────────────────────────────────────────────

TUR_ISIMLERI = {
    "serbest":   "Serbest Fon",
    "ppf":       "Para Piyasası Fonu",
    "hisse":     "Hisse Senedi Fonu",
    "altin":     "Altın Fonu",
    "katilim":   "Katılım Fonu",
    "borclanma": "Borçlanma Araçları Fonu",
    "karma":     "Karma / Değişken Fon",
    "byf":       "BYF (ETF)",
}

def ture_gore_listele(tur: str):
    tur = tur.lower().strip()
    if tur not in TUR_ISIMLERI:
        print(f"❌ Geçersiz tür: '{tur}'")
        print(f"   Geçerli türler: {', '.join(TUR_ISIMLERI.keys())}")
        return

    eslesen = {k: v for k, v in FONLAR.items() if v["tur"] == tur}
    if not eslesen:
        print(f"Bu türde fon bulunamadı: {tur}")
        return

    # 1 yıllık getiriye göre sırala
    sirali = sorted(eslesen.items(), key=lambda x: x[1]["getiri_1y"], reverse=True)

    print()
    print(f"📋 {TUR_ISIMLERI[tur].upper()} — En İyi Performans Sıralaması")
    print()

    header = f"{'#':<3} {'Kod':<8} {'Fon Adı':<44} {'1 Yıl':>7} {'TER':>6} {'Risk':>6} {'AUM':>8}"
    sep = "─" * len(header)
    print(sep)
    print(header)
    print(sep)

    for i, (k, f) in enumerate(sirali, 1):
        ad = f["ad"][:43]
        nit = " 🔒" if f["nitelikli"] else "   "
        print(
            f"{i:<3} {k:<8} {ad:<44}{nit} "
            f"{'%' + str(f['getiri_1y']):<7} "
            f"{'%' + str(f['ter']):<6} "
            f"{f['risk']:>2}/7  "
            f"{para_formatla(f['aum_mtl']):>8}"
        )

    print(sep)
    if tur == "serbest":
        print("  🔒 = Nitelikli yatırımcı gerektirir (min. 500.000 TL)")
    print()
    print("📌 1 yıllık getiri tahmini ve geçmiş performansa dayalıdır.")
    print()
    uyari_banner()


# ─────────────────────────────────────────────────────────────────────────────
# RİSK PROFİLİ PORTFÖY ÖNERİSİ
# ─────────────────────────────────────────────────────────────────────────────

def risk_portfoy(risk_profili: str, toplam_tutar: float = None):
    risk_profili = risk_profili.lower().strip()
    if risk_profili not in PORTFOY_STRATEJILERI:
        print(f"❌ Geçersiz risk profili: '{risk_profili}'")
        print(f"   Geçerli değerler: dusuk, orta, yuksek")
        return

    strateji = PORTFOY_STRATEJILERI[risk_profili]

    print()
    print(f"{'═' * 65}")
    print(f"  💼 PORTFÖY ÖNERİSİ — {strateji['ad'].upper()}")
    print(f"{'═' * 65}")
    print(f"  {strateji['aciklama']}")
    print()

    if toplam_tutar:
        print(f"  💰 Toplam Yatırım: {toplam_tutar:,.0f} TL")
        print()

    print(f"  {'Varlık Sınıfı':<20} {'%':>5}  {'Açıklama'}")
    print(f"  {'─' * 60}")

    for tur, yuzde, aciklama in strateji["dagılım"]:
        tur_adi = TUR_ISIMLERI.get(tur, tur).ljust(20)
        if toplam_tutar:
            tutar = toplam_tutar * yuzde / 100
            print(f"  {tur_adi} {yuzde:>4}%  {aciklama}")
            print(f"  {'':20}       → {tutar:>12,.0f} TL")
        else:
            print(f"  {tur_adi} {yuzde:>4}%  {aciklama}")

    print()
    print(f"  {'─' * 60}")
    print(f"  📌 Önerilen Fonlar:")
    print()

    for tur, yuzde, _ in strateji["dagılım"]:
        oneriler = strateji["onerilen_fonlar"].get(tur, [])
        if oneriler:
            print(f"  {TUR_ISIMLERI.get(tur, tur)} ({yuzde}%):")
            for k in oneriler:
                if k in FONLAR:
                    f = FONLAR[k]
                    nit = " [NİTELİKLİ]" if f["nitelikli"] else ""
                    print(f"    • {k} — {f['ad'][:50]} | TER %{f['ter']}{nit}")
            print()

    if risk_profili == "yuksek":
        print("  🔒 Serbest fonlar nitelikli yatırımcı gerektirir (min. 500.000 TL).")
        print("     Bu kurala uymuyorsanız serbest fon yerine hisse/karma ekleyin.")
        print()

    print(f"{'═' * 65}")
    print()
    uyari_banner()


# ─────────────────────────────────────────────────────────────────────────────
# TÜM FONLARI LİSTELE
# ─────────────────────────────────────────────────────────────────────────────

def tum_fonlari_listele():
    print()
    print(f"📚 TEFAS FON VERİTABANI — {len(FONLAR)} Fon")
    print()

    # Türe göre grupla
    turler = {}
    for k, v in FONLAR.items():
        t = v["tur"]
        if t not in turler:
            turler[t] = []
        turler[t].append((k, v))

    for tur, fonlar in turler.items():
        print(f"  ── {TUR_ISIMLERI.get(tur, tur).upper()} ──")
        for k, f in sorted(fonlar, key=lambda x: x[1]["getiri_1y"], reverse=True):
            nit = " 🔒" if f["nitelikli"] else ""
            print(f"    {k:<8} {f['ad'][:50]}{nit}")
        print()

    print(f"  Toplam: {len(FONLAR)} fon")
    print(f"  Güncel veriler için: tefas.gov.tr")
    print()


# ─────────────────────────────────────────────────────────────────────────────
# ANA PROGRAM
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="TEFAS Fon Analiz Aracı — tefas.gov.tr | finhouse.ai",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python3 tefas_analiz.py --fon TLY
  python3 tefas_analiz.py --karsilastir TLY,DFI,PHE
  python3 tefas_analiz.py --tur serbest
  python3 tefas_analiz.py --tur ppf
  python3 tefas_analiz.py --risk orta
  python3 tefas_analiz.py --portfoy 100000 --risk yuksek
  python3 tefas_analiz.py --liste

⚠️  Yatırım tavsiyesi değildir. Kurumsal danışmanlık: finhouse.ai
        """,
    )

    parser.add_argument("--fon", metavar="KOD",
                        help="Fon kodu (örn: TLY, ZPP, AGA)")
    parser.add_argument("--karsilastir", metavar="KOD1,KOD2,...",
                        help="Virgülle ayrılmış fon kodları (örn: TLY,DFI,PHE)")
    parser.add_argument("--tur", metavar="TUR",
                        help="Fon türü (serbest|ppf|hisse|altin|katilim|borclanma|karma|byf)")
    parser.add_argument("--risk", metavar="PROFİL",
                        help="Risk profili (dusuk|orta|yuksek)")
    parser.add_argument("--portfoy", metavar="TUTAR", type=float,
                        help="Toplam yatırım tutarı (TL) — --risk ile birlikte kullanın")
    parser.add_argument("--liste", action="store_true",
                        help="Tüm fonları listele")

    args = parser.parse_args()

    if args.liste:
        tum_fonlari_listele()
    elif args.fon:
        fon_detay(args.fon)
    elif args.karsilastir:
        karsilastir(args.karsilastir)
    elif args.tur:
        ture_gore_listele(args.tur)
    elif args.risk:
        risk_portfoy(args.risk, args.portfoy)
    elif args.portfoy and not args.risk:
        print("⚠️  --portfoy ile birlikte --risk parametresi gereklidir.")
        print("   Örnek: python3 tefas_analiz.py --portfoy 100000 --risk orta")
    else:
        parser.print_help()
        print()
        print("─" * 70)
        print(f"  Veritabanında {len(FONLAR)} fon mevcut.")
        print(f"  Tümünü görmek için: python3 tefas_analiz.py --liste")
        print()
        uyari_banner()


if __name__ == "__main__":
    main()
