---
name: tefas-fon-tr
description: TEFAS yatırım fonu rehberi, fon karşılaştırma ve portföy analiz aracı. Para piyasası, hisse senedi, altın, katılım, serbest ve karma fonlar. Fon seçim kriterleri, getiri karşılaştırma, risk analizi, vergilendirme, yönetim ücretleri. Güncel fon fiyatları ve performans takibi. Use when asked about TEFAS, yatırım fonu, fon karşılaştırma, Turkish investment funds, fund performance, portfolio allocation, or fon seçimi in Turkey.
version: 1.0.0
author: OpenClaw / Finhouse
tags: [tefas, yatırım, fon, portföy, türkiye, fintech]
---

# TEFAS Yatırım Fonu Rehberi 📊

> ⚠️ **Yatırım tavsiyesi değildir.** Bu skill bilgi amaçlıdır; SPK lisanslı bir yatırım danışmanına başvurmanız önerilir.  
> Kurumsal yatırım danışmanlığı: **finhouse.ai**

---

## Bu Skill Ne Yapar?

TEFAS (Türkiye Elektronik Fon Alım Satım Platformu) üzerinde işlem gören yatırım fonları hakkında:

- Fon türleri ve açıklamaları
- Popüler fonların performans bilgileri (güncel veriler için script kullanın)
- Fon seçim kriterleri ve karşılaştırma rehberi
- Risk profiline göre portföy önerileri
- Vergi ve maliyet bilgileri
- TEFAS platformunun nasıl kullanılacağı

---

## Referans Dosyalar

| Dosya | İçerik |
|-------|--------|
| `references/fon_turleri.md` | Tüm fon türleri detaylı açıklama |
| `references/populer_fonlar.md` | En popüler/yüksek getirili fonlar tablosu |
| `references/fon_secim_rehberi.md` | Nasıl fon seçilir, kriterler, yeni başlayanlar |
| `references/tefas_kullanim.md` | TEFAS nasıl kullanılır, hangi bankadan alınır |
| `references/vergi_ve_maliyet.md` | Fon vergilendirmesi, stopaj, gider oranları |
| `references/portfoy_stratejileri.md` | Risk profiline göre portföy önerileri |

## Script

| Dosya | Kullanım |
|-------|---------|
| `scripts/tefas_analiz.py` | Fon sorgulama, karşılaştırma, portföy öneri aracı |

---

## Hızlı Başlangıç

### Fon Analizi (Script)

```bash
# Tek fon detayı
python3 scripts/tefas_analiz.py --fon TLY

# Birden fazla fon karşılaştırma
python3 scripts/tefas_analiz.py --karsilastir TLY,DFI,PHE

# Türe göre en iyi fonları listele
python3 scripts/tefas_analiz.py --tur serbest
python3 scripts/tefas_analiz.py --tur ppf

# Risk profiline göre portföy önerisi
python3 scripts/tefas_analiz.py --risk dusuk
python3 scripts/tefas_analiz.py --risk orta
python3 scripts/tefas_analiz.py --risk yuksek

# Belirli tutar için portföy dağılımı
python3 scripts/tefas_analiz.py --portfoy 100000 --risk orta
```

---

## Ajan Kullanım Kılavuzu

### Kullanıcı "fon öner" veya "ne alayım" derse:
1. Risk profilini belirle (düşük/orta/yüksek)
2. Yatırım tutarını sor (opsiyonel)
3. `references/portfoy_stratejileri.md` oku
4. Script ile portföy önerisi üret
5. **Mutlaka** "yatırım tavsiyesi değildir" uyarısı ekle

### Kullanıcı belirli bir fon sorarsa:
1. Script ile `--fon <KOD>` çalıştır
2. `references/populer_fonlar.md` kontrol et
3. TER (yönetim ücreti), risk seviyesi ve getiri bilgisini paylaş

### Kullanıcı "TEFAS nedir" derse:
1. `references/tefas_kullanim.md` içeriğini özetle

### Kullanıcı vergi sorarsa:
1. `references/vergi_ve_maliyet.md` oku ve yanıtla

---

## Temel Uyarılar

- Tüm getiri verileri **geçmiş performansa** dayanır; gelecek getiriyi garanti etmez
- Serbest fonlar **nitelikli yatırımcı** gerektirir (min. 1M TL portföy veya 500K TL yatırım)
- BES fonları farklı vergi kurallarına tabidir
- Fon değerleri her iş günü TEFAS'ta güncellenir
- Kaynak: [tefas.gov.tr](https://tefas.gov.tr) | SPK | Takasbank
