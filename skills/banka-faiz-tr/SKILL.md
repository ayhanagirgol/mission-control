---
name: banka-faiz-tr
description: Türkiye banka mevduat faiz oranları karşılaştırması ve vadeli mevduat getiri hesaplayıcı. TL, döviz ve altın mevduat faizleri. Günlük, haftalık, aylık, 3 aylık, 6 aylık ve yıllık vade seçenekleri. Stopaj hesaplama, net getiri, banka karşılaştırma. Ziraat, Garanti, İş Bankası, Akbank, Yapı Kredi, Enpara, katılım bankaları. Use when asked about Turkish bank interest rates, mevduat faizi, vadeli mevduat, deposit rates, faiz karşılaştırma, or savings account rates in Turkey.
version: 1.0.0
updated: 2026-03-29
---

# 🏦 Banka Mevduat Faiz Oranları — Türkiye

## Amaç

Bu skill; Türkiye'deki bankaların TL/döviz/altın mevduat faiz oranlarını karşılaştırmanı, vade bazlı net getiri hesaplamanı ve tasarruf stratejisi oluşturmanı sağlar.

> ⚠️ **Yatırım tavsiyesi değildir.** Faiz oranları sürekli değişir; karar vermeden önce ilgili bankayı doğrula.  
> 💼 **Kurumsal nakit yönetimi danışmanlığı:** [finhouse.ai](https://finhouse.ai)

---

## Referans Dosyalar

| Dosya | İçerik |
|-------|--------|
| `references/tl_mevduat_faiz.md` | TL vadeli mevduat oranları — tüm bankalar × tüm vadeler |
| `references/doviz_mevduat_faiz.md` | USD/EUR mevduat oranları |
| `references/katilim_kar_payi.md` | Katılım bankası kar payı oranları |
| `references/stopaj_ve_vergi.md` | Stopaj oranları, net faiz hesaplama formülleri |
| `references/tcmb_faiz.md` | TCMB politika faizi, karar takvimi |
| `references/tasarruf_stratejileri.md` | Merdiven yöntemi, portföy dağılımı, stratejiler |

## Hesaplayıcı Script

```bash
python3 scripts/faiz_hesapla.py [seçenekler]
```

### Kullanım Örnekleri

```bash
# Tüm bankalarda 3 aylık getiri karşılaştırma
python3 scripts/faiz_hesapla.py --tutar 100000 --vade 3ay

# Ziraat'te tüm vadelerde getiri tablosu
python3 scripts/faiz_hesapla.py --banka ziraat --tutar 500000

# Seçili bankalar yan yana (6 ay, 200K TL)
python3 scripts/faiz_hesapla.py --karsilastir ziraat,garanti,akbank --vade 6ay --tutar 200000

# En yüksek faiz veren banka sıralaması
python3 scripts/faiz_hesapla.py --en-yuksek --vade 1yil

# USD mevduat karşılaştırma
python3 scripts/faiz_hesapla.py --doviz usd --tutar 10000 --vade 3ay

# Merdiven stratejisi önerisi (500K TL)
python3 scripts/faiz_hesapla.py --merdiven 500000
```

---

## Hızlı Bilgi

### TCMB Politika Faizi (Mart 2026)
- **Politika faizi:** %42.50
- Faiz indirim döngüsü: Haziran 2024'te başladı (%50 → %42.50)
- Sonraki PPK toplantısı: Bkz. `references/tcmb_faiz.md`

### Stopaj Özeti
| Vade | Stopaj Oranı |
|------|-------------|
| 6 aya kadar | %15 |
| 6 ay - 1 yıl | %12 |
| 1 yıl üzeri | %10 |
| Döviz hesabı | %18–20 |

### En Yüksek TL Faiz (3 Aylık, Mart 2026 tahmini)
1. 🥇 Enpara — ~%46–48
2. 🥈 Fibabanka — ~%46–47
3. 🥉 QNB Finansbank — ~%45–47
4. Papara — ~%45–46
5. Kamu bankaları — ~%42–44

---

## Güncelleme Talimatı

Faiz oranları her 1–4 haftada değişebilir. Oranları güncellemek için:
1. `references/tl_mevduat_faiz.md` içindeki tabloyu güncelle
2. `scripts/faiz_hesapla.py` içindeki `BANKALAR` sözlüğünü güncelle
3. Bu dosyanın `updated:` alanını güncelle

**Kaynaklar:**
- [TCMB](https://www.tcmb.gov.tr)
- [Enpara Oranlar](https://www.enpara.com/oranlar-ve-kurlar/)
- [hangikredi.com](https://www.hangikredi.com)
- Bankaların kendi internet şubeleri
