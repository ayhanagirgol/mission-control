---
name: kredi-faiz-tr
description: Türkiye banka kredi faiz oranları karşılaştırması ve kredi hesaplayıcı. İhtiyaç kredisi, konut kredisi (mortgage), taşıt kredisi, KOBİ kredisi oranları. Aylık taksit hesaplama, toplam maliyet, BSMV, KKDF, dosya masrafı dahil gerçek maliyet. Findeks kredi notu rehberi. Ziraat, Garanti, İş Bankası, Akbank, Yapı Kredi ve diğer bankalar. Use when asked about Turkish loan rates, kredi faizi, mortgage rates, ihtiyaç kredisi, taksit hesaplama, kredi karşılaştırma, Findeks score, or bank loan comparison in Turkey.
version: 1.0.0
updated: 2026-03-29
---

# kredi-faiz-tr Skill

Türkiye'deki banka kredi faiz oranlarını karşılaştıran, aylık taksit ve toplam maliyeti hesaplayan skill.

## Kapsam

- **İhtiyaç kredisi** — 6-36 ay vade, tüm büyük bankalar
- **Konut kredisi (mortgage)** — 60-240 ay, LTV, sigorta maliyetleri
- **Taşıt kredisi** — sıfır/ikinci el fark, araç değerine göre LTV
- **KOBİ/ticari kredi** — işletme, yatırım, KOSGEB destekli
- **Kredi kartı** — aylık faiz, nakit avans, asgari ödeme simülasyonu
- **Maliyet kalemleri** — BSMV, KKDF, dosya masrafı, sigorta
- **Findeks kredi notu** — skor rehberi, iyileştirme yolları
- **Erken ödeme / yapılandırma** — yasal sınırlar, refinansman

## Referans Dosyalar

| Dosya | İçerik |
|-------|--------|
| `references/ihtiyac_kredisi.md` | İhtiyaç kredisi oranları — tüm bankalar, vade tablosu |
| `references/konut_kredisi.md` | Mortgage oranları, LTV, sigorta/DASK/ekspertiz |
| `references/tasit_kredisi.md` | Araç kredisi oranları, sıfır/2.el fark, araç yaşı |
| `references/kobi_kredisi.md` | KOBİ/ticari kredi, KOSGEB destekli krediler |
| `references/kredi_karti_faiz.md` | Kredi kartı faizleri, nakit avans, asgari ödeme |
| `references/maliyet_kalemleri.md` | BSMV, KKDF, dosya masrafı, gerçek maliyet hesabı |
| `references/findeks_rehberi.md` | Kredi notu (1-1900), skor aralıkları, iyileştirme |
| `references/erken_odeme.md` | Erken ödeme komisyonu, yapılandırma, refinansman |

## Hesaplayıcı Script

```bash
python3 scripts/kredi_hesapla.py [seçenekler]
```

### Kullanım Örnekleri

```bash
# İhtiyaç kredisi — tüm bankalar karşılaştırması
python3 scripts/kredi_hesapla.py --ihtiyac 100000 --vade 36

# Konut kredisi — LTV ile
python3 scripts/kredi_hesapla.py --konut 2000000 --vade 120 --deger 2500000

# Taşıt kredisi — sıfır araç
python3 scripts/kredi_hesapla.py --tasit 500000 --vade 48 --tip sifir

# Belirli banka detaylı hesap
python3 scripts/kredi_hesapla.py --banka garanti --tutar 200000 --vade 24

# Birden fazla banka yan yana
python3 scripts/kredi_hesapla.py --karsilastir ziraat,garanti,akbank --tutar 150000 --vade 36

# En düşük taksit sıralaması
python3 scripts/kredi_hesapla.py --en-ucuz --tutar 100000 --vade 24

# Kredi kartı asgari ödeme simülasyonu
python3 scripts/kredi_hesapla.py --kredi-karti 50000
```

## Temel Hesaplama Formülü

```
Aylık Taksit = Anapara × [r × (1+r)^n] / [(1+r)^n - 1]
r = aylık faiz oranı × 1.15 (BSMV dahil — ihtiyaç/taşıt için)
n = vade (ay)
Toplam Ödeme = Taksit × n
Toplam Faiz = Toplam Ödeme - Anapara
```

> **Not:** Konut kredisi BSMV ve KKDF'den muaftır.

## Güncel Oran Özeti (Mart 2026)

| Kredi Türü | En Düşük | Ortalama | En Yüksek |
|------------|----------|----------|-----------|
| İhtiyaç (aylık) | %1.99 (QNB) | %3.57 | %4.50+ |
| Konut (aylık) | %2.49 (QNB) | %3.57 | %3.42+ |
| Taşıt sıfır (aylık) | %2.99 (Ziraat) | %3.57 | %3.50+ |
| Kredi kartı (aylık) | %3.42 | %4.00 | %4.42 |

> **⚠️ Uyarı:** Oranlar bankalara ve müşteri profiline göre değişir.  
> Bu bilgiler genel rehber niteliğindedir. Kredi kullanmadan önce bankayı mutlaka doğrulayın.  
> **Bu skill kredi tavsiyesi değildir.**

## Faiz Oranı Nereden Güncellenebilir?

- https://www.hesapkurdu.com/ihtiyac-kredisi
- https://www.hangikredi.com/kredi/ihtiyac-kredisi
- Bankaların resmi web siteleri
- TCMB: https://www.tcmb.gov.tr

---

💼 **KOBİ finansman danışmanlığı:** [finhouse.ai](https://finhouse.ai)
