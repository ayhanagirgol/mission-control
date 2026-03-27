# X Bank Merchant Migration — Örnek Maliyet Modeli

## 1. Amaç
Bu doküman, Finhouse’un X Bank merchant migration projesini yüklenici olarak üstlenmesi durumunda oluşabilecek yaklaşık operasyon maliyetlerini ve örnek gelir-gider yapısını göstermek için hazırlanmıştır.

Bu tablo kesin bütçe değildir; teklif öncesi yön tayini içindir.

---

## 2. Ana Varsayımlar

### Program varsayımları
- Toplam portföy: **18.000 merchant**
- Hedef program süresi: **12 ay**
- Başarı kriteri: **canlı ilk başarılı işlem**
- Dönüşüm modeli: dalga bazlı migration
- İlk 2 ay: discovery + pilot + operasyon kurulumu
- Sonraki 10 ay: yoğun migration dönemi

### Ticari varsayımlar
- X Bank beklentisi: **merchant başı 60–65 USD**
- Çalışma varsayımı: **65 USD / merchant**
- İşlem başı hizmet bedeli: **binde 2**
- Ortalama USD/TL kur varsayımı: **1 USD = 38 TL**

Bu durumda:
- Merchant başı dönüşüm geliri ≈ **2.470 TL**
- 18.000 merchant tam dönüşümde toplam setup geliri ≈ **44.460.000 TL**

> Not: Bu model yalnızca merchant başı dönüşüm gelirini baz alır. İşlem hacmi komisyon geliri ayrıca yukarı yönlü potansiyel yaratır.

---

## 3. Önerilen Çekirdek Ekip ve Aylık Maliyet Varsayımı

Aşağıdaki rakamlar "fully loaded" kaba maliyet mantığıyla düşünülmüştür (maaş + yan hak + SGK + ekipman/paylaşılan genel gider payı).

| Rol | Adet | Birim Aylık Maliyet (TL) | Aylık Toplam (TL) |
|---|---:|---:|---:|
| Program Manager | 1 | 250.000 | 250.000 |
| Project / Stream Lead | 2 | 180.000 | 360.000 |
| Solution Architect | 1 | 220.000 | 220.000 |
| Senior Payment Consultant | 1 | 200.000 | 200.000 |
| Technical Integration Specialist | 5 | 130.000 | 650.000 |
| Merchant Migration Specialist | 10 | 90.000 | 900.000 |
| PMO / Reporting Specialist | 2 | 95.000 | 190.000 |
| QA / Process Control | 2 | 95.000 | 190.000 |
| Support / Hypercare Specialist | 3 | 85.000 | 255.000 |

### Aylık toplam personel maliyeti
**3.215.000 TL / ay**

### Yıllık personel maliyeti (12 ay)
**38.580.000 TL**

---

## 4. Personel Dışı Gider Varsayımı

| Kalem | Aylık (TL) | 12 Aylık (TL) |
|---|---:|---:|
| Ofis / operasyon genel gider payı | 180.000 | 2.160.000 |
| Yazılım / CRM / ticket / iletişim araçları | 120.000 | 1.440.000 |
| Telefon / arama merkezi / SMS | 150.000 | 1.800.000 |
| Seyahat / müşteri ziyareti / toplantı | 75.000 | 900.000 |
| Eğitim / dokümantasyon / onboarding içerikleri | 50.000 | 600.000 |
| Yönetim rezervi / beklenmeyen gider | 125.000 | 1.500.000 |

### Toplam personel dışı gider
**8.400.000 TL / yıl**

---

## 5. Toplam Program Maliyeti

| Kalem | Tutar (TL) |
|---|---:|
| Personel maliyeti | 38.580.000 |
| Personel dışı giderler | 8.400.000 |
| **Toplam operasyon maliyeti** | **46.980.000** |

---

## 6. Merchant Başı Maliyet

18.000 merchant varsayımıyla:

- Toplam maliyet: **46.980.000 TL**
- Merchant başı maliyet: **2.610 TL**
- USD karşılığı (38 TL kurla): **~68,7 USD / merchant**

## İlk yorum
Bu kaba modele göre yalnızca **65 USD setup fee** ile çalışmak sınırda hatta hafif negatif olabilir.

Bu yüzden teklifte şu korumalardan biri gerekir:
1. discovery/pilot için ayrıca sabit ücret,
2. segment bazlı fiyatlama,
3. binde 2 işlem gelirinin net şekilde eklenmesi,
4. hazır paket merchant’lar için yüksek otomasyonla maliyet düşürme.

---

## 7. Daha Verimli Senaryo (Optimize Model)

Eğer aşağıdakiler sağlanırsa maliyet düşer:
- hazır paket oranı yüksekse,
- self-service onboarding varsa,
- Ticimax / IdeaSoft / WooCommerce plugin/adaptörleri hazırsa,
- banka veri kalitesi yüksekse,
- ilk seviyede merchant operasyon ekibi daha verimli çalışırsa.

Bu durumda ekip örneği:
- Merchant Migration Specialist: 10 yerine 8
- Technical Integration Specialist: 5 yerine 4
- Support Specialist: 3 yerine 2
- bazı genel giderler daha kontrollü

Bu optimize modelde yaklaşık toplam maliyet:
- **40–42 milyon TL bandına** inebilir
- merchant başı maliyet ≈ **58–61 USD** seviyesine yaklaşır

Bu senaryo, bankanın beklediği 60–65 USD bandını daha savunulabilir hale getirir.

---

## 8. Gelir Senaryosu — Sadece Setup Fee

| Senaryo | Merchant Sayısı | Birim Gelir (USD) | Toplam Gelir (USD) | Toplam Gelir (TL) |
|---|---:|---:|---:|---:|
| Düşük | 12.000 | 60 | 720.000 | 27.360.000 |
| Orta | 15.000 | 65 | 975.000 | 37.050.000 |
| Tam Hedef | 18.000 | 65 | 1.170.000 | 44.460.000 |

### Yorum
Sadece merchant başı dönüşüm geliri ile:
- düşük senaryo zayıf,
- orta senaryo riskli,
- tam hedefte bile marj çok sınırlı olabilir.

---

## 9. Gelir Senaryosu — Setup Fee + İşlem Geliri

Örnek varsayım:
- migrate edilen aktif merchant sayısı: **15.000**
- merchant başına aylık ortalama işlem hacmi: **300.000 TL**
- toplam aylık hacim: **4,5 milyar TL**
- hizmet bedeli: **binde 2**

Bu durumda:
- aylık işlem geliri = **9.000.000 TL**
- yıllık işlem geliri = **108.000.000 TL**

> Bu rakam kaba örnek modeldir. Gerçek hacim dağılımı çok daha heterojen olacaktır. Ama şunu gösterir: asıl ekonomik motor setup fee değil, **işlem hacmine dayalı gelir** olabilir.

---

## 10. Örnek Gelir-Gider Tablosu

### Senaryo A — Korumalı teklif
- Discovery + pilot sabit gelir: **6.000.000 TL**
- Setup fee geliri (15.000 merchant x 2.470 TL): **37.050.000 TL**
- İşlem geliri (ihtiyatlı, yıllık): **24.000.000 TL**

#### Toplam gelir
**67.050.000 TL**

#### Toplam maliyet
**46.980.000 TL**

#### Brüt katkı
**20.070.000 TL**

#### Brüt katkı oranı
**~%30**

---

### Senaryo B — Sadece setup fee, tam hedef
- Setup fee geliri: **44.460.000 TL**
- Toplam maliyet: **46.980.000 TL**
- Sonuç: **-2.520.000 TL**

Bu senaryo tek başına cazip değil.

---

### Senaryo C — Optimize operasyon + setup fee
- Optimize maliyet: **41.000.000 TL**
- Setup fee geliri: **44.460.000 TL**
- Brüt katkı: **3.460.000 TL**

Marj var ama zayıf.

---

## 11. Stratejik Sonuç
En sağlıklı teklif mantığı şu olmalı:

### Önerilen teklif yapısı
1. **Discovery & pilot için sabit başlangıç bedeli**
2. **Merchant başı dönüşüm bedeli**
3. **İşlem hacmine bağlı binde 2 gelir modeli**
4. Gerekirse **segment bazlı ek ücret**
   - hazır paket merchant
   - standart API
   - custom/ajans bağımlı merchant

### Neden?
Çünkü:
- setup fee tek başına operasyonu zor kurtarıyor,
- gerçek kârlılık işlem geliri ve doğru segmentasyonla oluşuyor,
- discovery ücreti ilk 2-3 ay yatırım yükünü dengeliyor.

---

## 12. Yönetici Özeti
- 18.000 merchant / 12 ay / orta yoğunluklu modelde toplam operasyon maliyeti yaklaşık **47 milyon TL** seviyesinde görünüyor.
- Bu da merchant başına yaklaşık **69 USD** maliyet anlamına geliyor.
- Dolayısıyla yalnızca **60–65 USD merchant başı ücret** ile çalışmak riskli.
- Teklifin kârlı olması için:
  - discovery fee,
  - işlem bazlı gelir,
  - segment bazlı fiyatlama,
  - hazır platform otomasyonu
  birlikte düşünülmeli.
