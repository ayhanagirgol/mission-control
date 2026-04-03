# Kredi Maliyet Kalemleri — BSMV, KKDF, Dosya Masrafı

> Gerçek kredi maliyetini anlamak için tüm kalemleri bilmek şarttır.

## 1. BSMV (Banka ve Sigorta Muamele Vergisi)

- **Oran:** %15 (faiz tutarı üzerinden)
- **Kapsam:** Tüm banka kredi faizlerine uygulanır
- **İstisna:** Konut kredisi BSMV'den muaftır

**Örnek:**
- Aylık faiz: %3.00
- BSMV: %3.00 × %15 = %0.45
- BSMV dahil gerçek faiz: %3.45

> Bankalar faiz oranını genellikle BSMV dahil gösterir. Kontrol edin!

## 2. KKDF (Kaynak Kullanımı Destekleme Fonu)

| Kredi Türü | KKDF Oranı |
|------------|-----------|
| İhtiyaç kredisi | %15 |
| Taşıt kredisi | %15 |
| Konut kredisi | **%0 (muaf)** |
| Ticari/KOBİ kredisi (yurt içi) | %0 |
| İhracat kredisi | %0 |
| Kredi kartı nakit avansı | %15 |

**Örnek — İhtiyaç Kredisi 100.000 TL, 36 ay, aylık %3.00 faiz:**
- Toplam faiz: ~₺60,000
- KKDF (%15 faiz üzerinden): ~₺9,000 ek yük
- Gerçek toplam maliyet: faiz + KKDF + BSMV + dosya masrafı

> KKDF genellikle faize dahil olarak gösterilir — netin ne olduğunu bankadan sorun.

## 3. Dosya Masrafı / Tahsis Ücreti

**Yasal limit:** Kullandırılan kredi tutarının binde 5'i (%0.5) — BDDK düzenlemesi

| Banka | Uygulama |
|-------|----------|
| Ziraat, Halkbank, Vakıfbank | %0.5 (min ₺500) |
| Garanti BBVA | Kampanya dönemlerinde ₺0 |
| Akbank | ₺0 (çoğu dönem) |
| QNB Finansbank | ₺0 |
| Yapı Kredi | %0.5 |
| Denizbank | %0.5 |

Örnek: 200.000 TL kredi → dosya masrafı = 200.000 × %0.5 = ₺1.000

## 4. Hayat Sigortası

| Durum | Zorunluluk |
|-------|-----------|
| İhtiyaç kredisi | Zorunlu değil, banka talep edebilir |
| Konut kredisi | Zorunlu değil ama şiddetle önerilir |
| KOBİ kredisi | Banka politikasına göre |

**Maliyet:** Yaş, sağlık durumu ve kredi tutarına göre değişir.
- Genç, sağlıklı bireyler: Aylık ₺50–200
- 50+ yaş: Aylık ₺200–500+

## 5. Konut Kredisi Özel Masrafları

| Kalem | Tutar |
|-------|-------|
| Ekspertiz ücreti | ₺3.000–₺8.000 (konutun büyüklüğüne göre) |
| İpotek tesis (tapu harcı) | Konutun değerinin %0.227'si (alıcı + satıcı ayrı ayrı) |
| Döner sermaye ücreti | ~₺500–₺1.000 |
| DASK (Zorunlu Deprem) | ₺500–₺5.000/yıl (metrekare + bölge) |
| Konut sigortası | ₺1.000–₺5.000/yıl |

## 6. Toplam Maliyet Oranı (TMO / YMO / APR)

Yıllık Maliyet Oranı, faiz + BSMV + KKDF + tüm masrafları kapsayan gerçek yıllık maliyettir.

**Örnek — Garanti BBVA (Şubat 2025 verisi):**
- Kredi: 100.000 TL / 36 ay
- Yıllık nominal faiz: %5.24 (aylık ~%0.43)
- **YMO: %121.7961** — çünkü KKDF + BSMV + masraflar eklenince gerçek yıllık maliyet çok yüksek!

> YMO yüksek görünür çünkü bileşik faiz etkisi + tüm masraflar dahildir.

## Gerçek Maliyet Hesabı — Özet

```
Gerçek Aylık Maliyet = Aylık Faiz × (1 + BSMV)
İhtiyaç/Taşıt için KKDF: Ayrıca %15 faiz üzerinden
Konut için: BSMV + KKDF = 0

Aylık Taksit = Anapara × [r × (1+r)^n] / [(1+r)^n - 1]
r = net aylık faiz (BSMV dahil)
```

## Kısaltmalar Sözlüğü

| Kısaltma | Açıklama |
|----------|----------|
| BSMV | Banka ve Sigorta Muamele Vergisi (%15) |
| KKDF | Kaynak Kullanımı Destekleme Fonu (ihtiyaç/taşıt %15, konut %0) |
| LTV | Loan-to-Value / Kredi-Değer Oranı |
| YMO | Yıllık Maliyet Oranı (APR) |
| DASK | Doğal Afet Sigortaları Kurumu (Zorunlu Deprem Sigortası) |
| TMO | Toplam Maliyet Oranı |

---

💼 **KOBİ finansman danışmanlığı:** [finhouse.ai](https://finhouse.ai)
