# X Bank Merchant Migration — Maliyet Bütçe Modeli (Araştırma Versiyonu)

> **Doküman Amacı:** Teklif öncesi iç değerlendirme. Kesin bütçe değildir; yön tayini ve savunulabilir aralık belirleme içindir.  
> **Versiyon:** v1.0 — 2026-03  
> **Referans:** maliyet_modeli.md (kaba model, Mart 2026)

---

## ⚠️ Önceki Modele Eleştiri

İlk kaba model mantık olarak doğru kurulmuş; ancak şu zayıflıkları var:

| Sorun | Açıklama |
|---|---|
| Ekip boyutu sabit tutulmuş | Tüm 12 ay boyunca aynı ekip varsayımı gerçekçi değil; keşif/pilot ile yoğun migrasyon dönemlerinde kadro farklılaşır |
| Tek senaryo | Sadece bir maliyet tahmini var; teklif öncesi aralık bilinmeli |
| Personel maliyetleri açıklanmamış | "Fully loaded" ne içeriyor? SGK işveren payı, sigorta, yemek, ulaşım, ekipman payı? |
| Risk rezervi yetersiz | %3'ün altında risk tamponu kaba modelde yetersiz |
| Kur riski göz ardı edilmiş | Proje TL cinsinden yürütülecek ama gelir USD; kur hareketi ciddi risk |
| Merchant kalite segmentasyonu yok | 18.000 merchant homojen varsayılmış; gerçekte segment bazlı farklı iş yükleri var |

---

## 1. Temel Varsayımlar

### 1.1 Program Varsayımları

| Parametre | Değer |
|---|---|
| Toplam portföy | 18.000 merchant |
| Program süresi | 12 ay |
| Faz 1 (Keşif + Pilot + Kurulum) | Ay 1–2 |
| Faz 2 (Yoğun Migrasyon) | Ay 3–11 |
| Faz 3 (Hypercare + Kapanış) | Ay 12 |
| Başarı kriteri | Canlı ilk başarılı işlem |
| Migrasyon modeli | Dalga bazlı (wave-based), segment öncelikli |

### 1.2 Merchant Segmantasyon Varsayımı

Migration yükü merchant türüne göre önemli ölçüde farklılaşır:

| Segment | Tahmini Pay | İş Yükü Çarpanı | Açıklama |
|---|---:|---:|---|
| Hazır Paket (Ticimax, IdeaSoft, WooCommerce, Shopify vb.) | %40 | 1x | Plugin/entegrasyon adaptörü varsa düşük iş yükü |
| Standart API Entegrasyonu | %35 | 2x | Manuel teknik destek + test gerektirir |
| Custom/Ajans Bağımlı | %20 | 4x | Üçüncü taraf ajans koordinasyonu, uzun döngü |
| Legacy / Offline Yönlendirme | %5 | 1.5x | Fiziksel iletişim + rehberlik ağırlıklı |

> **Not:** Bu segmentasyon X Bank'tan doğrulanmadan varsayımdır. Gerçek dağılım teklife doğrudan etki eder.

### 1.3 Finansal Varsayımlar

| Parametre | Değer | Açıklama |
|---|---|---|
| Kur varsayımı | 38 TL/USD | Bütçeleme kuru; kur riski için +%10 tampon önerilir |
| Kur riski tamponu | 41,8 TL/USD | ~%10 yukarı senaryo |
| SGK işveren payı | Brüt maaşın %20,5'i | 2026 tahmini |
| Fully loaded çarpanı | Brüt x 1,35–1,45 | SGK + yan hak + ekipman payı + genel gider |
| Proje genel gider yükü | %8–10 | Finhouse şirket overhead payı |

---

## 2. Rol Bazlı Ekip Yapısı ve Maliyet (Baz Senaryo)

### 2.1 Fully Loaded Maliyet Tanımı

"Fully loaded" = Brüt maaş + SGK işveren payı (%20,5) + yan haklar (yemek, ulaşım, sağlık sigortası, yıllık izin karşılığı) + ekipman amortismanı payı + tahsis edilen genel gider payı.

Pratik çarpan: **brüt maaş x 1,38** (ihtiyatlı ortalama)

### 2.2 Baz Senaryo Ekip Tablosu

| Rol | Ay 1–2 | Ay 3–11 | Ay 12 | Birim Fully Loaded TL/ay | Not |
|---|---:|---:|---:|---:|---|
| Program Manager | 1 | 1 | 1 | 240.000 | Tam zamanlı, proje sahibi |
| Project / Stream Lead | 1 | 2 | 1 | 175.000 | Ay 3'te 2'ye çıkar |
| Solution Architect | 1 | 1 | 0,5 | 210.000 | Ay 12'de yarı zamanlı |
| Senior Payment Consultant | 1 | 1 | 0,5 | 195.000 | Eski platform uzmanı kritik |
| Technical Integration Specialist | 3 | 5 | 2 | 128.000 | Segment mix'e göre ölçeklenir |
| Merchant Migration Specialist | 2 | 9 | 4 | 88.000 | Wave'e göre aşamalı çıkış |
| PMO / Reporting Specialist | 1 | 2 | 1 | 95.000 | |
| QA / Process Control | 1 | 2 | 1 | 92.000 | |
| Support / Hypercare Specialist | 1 | 3 | 2 | 83.000 | Ay 12 hypercare yoğun |

### 2.3 Faz Bazlı Aylık Personel Maliyeti (Baz Senaryo)

**Faz 1 — Ay 1–2 (Keşif + Pilot)**

| Rol | Adet | Birim (TL) | Aylık Toplam (TL) |
|---|---:|---:|---:|
| Program Manager | 1 | 240.000 | 240.000 |
| Project / Stream Lead | 1 | 175.000 | 175.000 |
| Solution Architect | 1 | 210.000 | 210.000 |
| Senior Payment Consultant | 1 | 195.000 | 195.000 |
| Technical Integration Spec. | 3 | 128.000 | 384.000 |
| Merchant Migration Spec. | 2 | 88.000 | 176.000 |
| PMO / Reporting | 1 | 95.000 | 95.000 |
| QA / Process Control | 1 | 92.000 | 92.000 |
| Support Specialist | 1 | 83.000 | 83.000 |
| **Faz 1 Aylık Toplam** | | | **1.650.000** |
| **Faz 1 Toplam (2 ay)** | | | **3.300.000** |

**Faz 2 — Ay 3–11 (Yoğun Migrasyon)**

| Rol | Adet | Birim (TL) | Aylık Toplam (TL) |
|---|---:|---:|---:|
| Program Manager | 1 | 240.000 | 240.000 |
| Project / Stream Lead | 2 | 175.000 | 350.000 |
| Solution Architect | 1 | 210.000 | 210.000 |
| Senior Payment Consultant | 1 | 195.000 | 195.000 |
| Technical Integration Spec. | 5 | 128.000 | 640.000 |
| Merchant Migration Spec. | 9 | 88.000 | 792.000 |
| PMO / Reporting | 2 | 95.000 | 190.000 |
| QA / Process Control | 2 | 92.000 | 184.000 |
| Support Specialist | 3 | 83.000 | 249.000 |
| **Faz 2 Aylık Toplam** | | | **3.050.000** |
| **Faz 2 Toplam (9 ay)** | | | **27.450.000** |

**Faz 3 — Ay 12 (Hypercare + Kapanış)**

| Rol | Adet | Birim (TL) | Aylık Toplam (TL) |
|---|---:|---:|---:|
| Program Manager | 1 | 240.000 | 240.000 |
| Project / Stream Lead | 1 | 175.000 | 175.000 |
| Solution Architect | 0,5 | 210.000 | 105.000 |
| Senior Payment Consultant | 0,5 | 195.000 | 97.500 |
| Technical Integration Spec. | 2 | 128.000 | 256.000 |
| Merchant Migration Spec. | 4 | 88.000 | 352.000 |
| PMO / Reporting | 1 | 95.000 | 95.000 |
| QA / Process Control | 1 | 92.000 | 92.000 |
| Support Specialist | 2 | 83.000 | 166.000 |
| **Faz 3 Toplam (1 ay)** | | | **1.578.500** |

### 2.4 Toplam Personel Maliyeti (Baz Senaryo)

| Faz | Süre | Toplam (TL) |
|---|---|---:|
| Faz 1 | 2 ay | 3.300.000 |
| Faz 2 | 9 ay | 27.450.000 |
| Faz 3 | 1 ay | 1.578.500 |
| **Toplam Personel** | **12 ay** | **32.328.500** |

---

## 3. Personel Dışı Gider Kalemleri

### 3.1 Operasyonel Giderler

| Kalem | Aylık Tahmini (TL) | 12 Aylık (TL) | Varsayım |
|---|---:|---:|---|
| Ofis / koşam giderleri | 100.000 | 1.200.000 | Paylaşımlı ofis, Finhouse genel gider payı |
| CRM / ticketing / proje yönetim araçları | 45.000 | 540.000 | Jira, Salesforce veya eşdeğer, ~15 lisans |
| İletişim araçları (Teams, Slack, vs.) | 15.000 | 180.000 | |
| Telefon / SMS / e-posta bildirimleri | 80.000 | 960.000 | 18K merchant iletişim kanalı; SMS başına ~0,18 TL varsayımı |
| Arama merkezi / dış destek hattı | 90.000 | 1.080.000 | Gerekirse outsource CC desteği |
| Seyahat / saha ziyareti | 40.000 | 480.000 | Ağırlıklı Faz 2; uzak merchant grupları |
| Eğitim / onboarding içerikleri | 30.000 | 360.000 | Video, dokümantasyon, merchant kılavuzu |
| Hukuki / sözleşme danışmanlığı | 25.000 | 300.000 | SLA, veri işleme, sözleşme revizyonları |
| Yazılım lisansları / test ortamı | 35.000 | 420.000 | Sandbox, API test araçları |

**Toplam operasyonel giderler: 5.520.000 TL / yıl**

### 3.2 Risk ve Tampon Kalemleri

| Kalem | Tutar (TL) | Oran | Açıklama |
|---|---:|---:|---|
| Yönetim rezervi | 1.900.000 | ~%5 | Toplam maliyetin yaklaşık %5'i |
| Kur riski tamponu | 1.200.000 | — | USD cinsinden gelir, TL gider; ~%3 kur sapması tampon |
| Segment kaynaklı yük artışı | 800.000 | — | Custom/ajans merchant beklenenden fazla çıkarsa |

**Toplam tampon: 3.900.000 TL**

### 3.3 Personel Dışı Toplam

| Kalem | Tutar (TL) |
|---|---:|
| Operasyonel giderler | 5.520.000 |
| Risk ve tampon | 3.900.000 |
| **Personel Dışı Toplam** | **9.420.000** |

---

## 4. Senaryo Analizi

### 4.1 Üç Senaryo Özeti

| Kalem | Agresif (Optimize) | Baz | Koruyucu |
|---|---:|---:|---:|
| Personel maliyeti (TL) | 27.500.000 | 32.328.500 | 39.500.000 |
| Personel dışı gider (TL) | 6.500.000 | 9.420.000 | 13.000.000 |
| **Toplam maliyet (TL)** | **34.000.000** | **41.748.500** | **52.500.000** |
| Merchant başı maliyet (TL) | 1.889 | 2.319 | 2.917 |
| Merchant başı maliyet (USD, 38 TL) | **~49,7 USD** | **~61,0 USD** | **~76,8 USD** |

### 4.2 Agresif (Optimize) Senaryo Koşulları

Bu senaryo ancak şu koşulların tamamında mümkündür:

- [ ] Hazır paket merchant oranı ≥ %50 (Ticimax, IdeaSoft vb. için adaptör hazır)
- [ ] Banka tarafından temiz, segmentli merchant listesi teslim ediliyor
- [ ] Self-service onboarding portalı çalışır durumda (banka tarafından)
- [ ] Custom/ajans bağımlı merchant oranı ≤ %10
- [ ] Migration specialist ekip aynı anda birden fazla dalga yönetebilecek araçlara sahip
- [ ] Kur sabit veya kontrollü (38 TL bandı)

> Bu koşullar proje başında kesinleşmeden "agresif senaryo" teklife dahil edilmemeli.

### 4.3 Baz Senaryo Koşulları

- Merchant dağılımı makul (bölüm 1.2 segmentasyon tablosuna uygun)
- Banka tarafında iyi bir proje koordinatörü atanmış
- Veri kalitesi orta-iyi seviyede
- API entegrasyon dökümanları hazır ve güncel
- Kur 38–40 TL bandında seyrediyor

### 4.4 Koruyucu Senaryo Koşulları

Bu senaryo için fazladan bütçe şunlardan kaynaklanır:
- Merchant veri kalitesi düşük, temizleme gerekiyor
- Custom merchant oranı beklenenden yüksek (%30+)
- Banka kaynaklı gecikmeler nedeniyle proje uzuyor
- Kur %10+ yükseliyor (41 TL üzeri)
- İkinci yılda hypercare devam ediyor

---

## 5. Aylık ve Yıllık Gider Tablosu (Baz Senaryo)

| Ay | Personel (TL) | Ops Giderleri (TL) | Tampon Pay (TL) | Toplam Ay (TL) | Kümülatif (TL) |
|---|---:|---:|---:|---:|---:|
| 1 | 1.650.000 | 460.000 | 325.000 | 2.435.000 | 2.435.000 |
| 2 | 1.650.000 | 460.000 | 325.000 | 2.435.000 | 4.870.000 |
| 3 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 8.705.000 |
| 4 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 12.540.000 |
| 5 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 16.375.000 |
| 6 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 20.210.000 |
| 7 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 24.045.000 |
| 8 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 27.880.000 |
| 9 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 31.715.000 |
| 10 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 35.550.000 |
| 11 | 3.050.000 | 460.000 | 325.000 | 3.835.000 | 39.385.000 |
| 12 | 1.578.500 | 460.000 | — | 2.038.500 | 41.423.500 |
| **Toplam** | **32.328.500** | **5.520.000** | **3.575.000** | **41.423.500** | — |

> Not: Tampon kalemleri aylık düz dağıtım yerine proje bitimine yakın kullanılabilir; tabloda yönetim kolaylığı için aylık paylaştırılmıştır.

---

## 6. Merchant Başı Maliyet Analizi

### 6.1 Maliyet Hesabı (Baz Senaryo, 18.000 merchant)

| Bileşen | Tutar (TL) | USD (38 TL kur) |
|---|---:|---:|
| Personel maliyeti | 32.328.500 | 851.276 |
| Ops giderleri | 5.520.000 | 145.263 |
| Risk tamponu | 3.900.000 | 102.632 |
| **Toplam** | **41.748.500** | **1.099.171** |
| **Merchant başı maliyet** | **2.319 TL** | **~61,1 USD** |

### 6.2 Segment Bazlı Ağırlıklı Maliyet

Farklı segment gruplarının farklı iş yükü oluşturduğu dikkate alındığında:

| Segment | Oranı | Maliyet Çarpanı | Ağırlıklı Birim (USD) |
|---|---:|---:|---:|
| Hazır Paket | %40 | 0,5x | ~30 |
| Standart API | %35 | 1,0x | ~61 |
| Custom/Ajans | %20 | 2,5x | ~153 |
| Legacy/Offline | %5 | 0,8x | ~49 |
| **Ağırlıklı Ortalama** | | | **~65–70 USD** |

> Bu analiz, segment dağılımına bağlı olarak gerçek ortalama maliyetin 65–70 USD bandında oluşabileceğini göstermektedir.

---

## 7. 60–65 USD Bandının Hangi Koşullarda Mümkün Olduğu

### 7.1 Kritik Başarı Faktörleri

Merchant başı maliyetin 60–65 USD bandına inebilmesi için şu koşulların **en az 4–5 tanesi** birlikte sağlanmalıdır:

| # | Koşul | Maliyet Etkisi (USD) | Güvenilirlik |
|---|---|---:|---|
| 1 | Hazır paket merchant oranı ≥ %45 | -5 ile -8 | Yüksek (doğrulanabilir) |
| 2 | Banka tarafından self-service portal açılması | -3 ile -5 | Orta (banka taahhüdü gerektirir) |
| 3 | Temiz, segmentli merchant verisi teslimi | -2 ile -4 | Orta |
| 4 | Custom merchant oranının ≤ %15 tutulması | -4 ile -7 | Orta |
| 5 | Banka koordinatörünün aktif rol alması | -2 ile -3 | Orta |
| 6 | İlk 2 ayın discovery bedeli ayrıca fiyatlanması | -4 ile -6 | Banka onayına bağlı |
| 7 | Ekip verimliliğinin beklenen seviyede kalması | -2 ile -4 | Düşük-Orta |

> **Sonuç:** Tüm koşullar sağlandığında 60–65 USD bandı ulaşılabilir. Ancak hiçbir koşul garanti edilemediğinden teklif bu bandın altına kesilmemeli.

### 7.2 Kur Hassasiyeti

| Kur (TL/USD) | Baz Senaryo Maliyet (USD) | Değişim |
|---|---:|---|
| 36 | 64,0 | Kur düşerse maliyet USD bazında yükselir |
| 38 | 61,1 | Baz |
| 40 | 58,1 | Kur yükselirse maliyet USD bazında düşer ama gelir değişmez |
| 42 | 55,4 | Risk: gelir azalmaz ama TL yükümlülük artar |

> **Kur riski notu:** Gelir USD, maliyet TL yapısında, TL'nin güçlenmesi projeyi zarara sokabilir. Bu nedenle teklif sözleşmesinde kur güvence maddesi önerilir.

---

## 8. Teklife Nasıl Yansıtılmalı

### 8.1 Önerilen Fiyatlandırma Yapısı

Sadece "merchant başı sabit ücret" yerine katmanlı yapı önerilir:

```
Teklif Yapısı = Keşif Bedeli + Migrasyon Bedeli + İşlem Geliri
```

| Bileşen | Tutar / Oran | Açıklama |
|---|---|---|
| **Faz 1 — Keşif & Pilot Sabit Bedeli** | 150.000–250.000 USD | İlk 2 ay için sabit; risk keşfi, segment analizi, pilot dalgası (500 merchant) |
| **Merchant Başı Migrasyon Ücreti** | 65 USD (hazır/standart) | Faz 2–3 kapsamı |
| **Merchant Başı — Custom Segment** | 120–150 USD | Ajans bağımlı / custom entegrasyon |
| **İşlem Bazlı Gelir** | Binde 1,5–2,0 | Migrate edilen merchant hacmi üzerinden; 3. aydan itibaren |

### 8.2 Segment Ayrımının Sözleşmeye Yansıması

- Teklifte "standart merchant" ve "custom merchant" tanımı açıkça yapılmalı
- Custom merchant tanımı: üçüncü taraf geliştirici gereksinimi, banka dışı API bağımlılığı, veya entegrasyon belgesi eksikliği
- Custom merchant ücreti standart ücretin 2x'i olarak teklif edilmeli

### 8.3 SLA ve Risk Paylaşımı Maddeleri

Teklife dahil edilmesi önerilen koruyucu maddeler:

| Madde | Açıklama |
|---|---|
| Veri kalitesi şartı | Banka, migration başlamadan önce %90 doğruluğunda merchant verisi sağlar |
| Proje uzama prosedürü | 12 ayı aşarsa aylık sabit ek bedel uygulanır |
| Kur güvence maddesi | Kur 38 TL'den ±%15'in üzerine çıkarsa fiyat revize edilir |
| Banka koordinatörü şartı | Banka tarafından tam yetkili proje koordinatörü atanması |
| Migrasyon başarı tanımı | "Başarılı ilk işlem" metriği, iptal edilemeyen işlemler için net tanım |

### 8.4 Teklif Dili Önerileri

Bankaya sunumda kullanılabilecek savunulabilir cümleler:

> *"Bu fiyatlandırma 18.000 merchant portföyü için hazır paket ağırlıklı dağılım varsayımına dayanmaktadır. Segment analizi tamamlandıktan sonra fiyat ±%15 aralığında yeniden değerlendirilebilir."*

> *"Custom entegrasyon gerektiren merchant'lar standart ücretin 2 katı olarak ayrıca fiyatlandırılmaktadır; bu ayrım sektör standardıdır."*

> *"Keşif fazı için ayrıca fiyatlanan 2 aylık ön analiz, gerçek segment dağılımını ortaya koyacak ve nihai migrasyon bütçesini netleştirecektir."*

---

## 9. Önceki Model ile Karşılaştırma

| Kriter | Önceki Model | Bu Model |
|---|---|---|
| Toplam maliyet | ~47 milyon TL | ~41,7 milyon TL (baz) |
| Merchant başı maliyet | ~69 USD | ~61 USD (baz), 49–77 USD (aralık) |
| Senaryo sayısı | 1 (+ optimize versiyon) | 3 (agresif / baz / koruyucu) |
| Ekip yapısı | Sabit 12 ay | Faz bazlı, gerçekçi ölçekleme |
| Segment analizi | Yok | Var, maliyet çarpanlı |
| Kur riski | Yer almıyor | Dahil |
| Risk rezervi | 1,5 milyon TL (%3,2) | 3,9 milyon TL (%9,3) |
| Teklif yapısı önerisi | Kısmen | Detaylı, 3 bileşenli |

---

## 10. Yönetici Özeti (1 Sayfa)

---

### 📋 X Bank Merchant Migration — Yönetici Özeti

**Proje:** 18.000 merchant'ın üçüncü parti sanal POS'tan X Bank'ın kendi platformuna taşınması  
**Süre:** 12 ay | **Bütçeleme kuru:** 38 TL/USD

---

#### Maliyet Aralığı

| Senaryo | Toplam Maliyet | Merchant Başı (USD) | Ne Zaman Geçerli |
|---|---:|---:|---|
| Agresif | ~34 milyon TL | ~50 USD | Yüksek otomasyon + temiz veri + bank desteği |
| **Baz (Önerilen)** | **~41,7 milyon TL** | **~61 USD** | Makul koşullar, standart ekip |
| Koruyucu | ~52,5 milyon TL | ~77 USD | Veri sorunu + kur riski + uzama |

---

#### 60–65 USD Bandı Mümkün mü?

**Evet — ancak koşullu.**

Mümkün olabilmesi için:
✅ Hazır paket merchant oranı ≥ %45  
✅ Custom merchant oranı ≤ %15  
✅ Banka'dan temiz veri ve aktif koordinatör  
✅ Keşif fazının ayrıca fiyatlandırılması  
✅ İşlem gelirinin sözleşmeye eklenmesi  

Bu koşullar karşılanmadan **65 USD altında teklif verilmesi risk taşır.**

---

#### Önerilen Teklif Yapısı

| Bileşen | Tutar |
|---|---|
| Keşif & Pilot Sabit Bedeli | 150.000–250.000 USD (sabit) |
| Standart Merchant Başı Migrasyon | 65 USD |
| Custom Merchant Başı Migrasyon | 120–150 USD |
| İşlem Bazlı Gelir (3. aydan) | Binde 1,5–2,0 |

Bu yapı hem riski dengeler hem de X Bank'a şeffaf, savunulabilir bir fiyatlandırma sunar.

---

#### Kritik Riskler

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Kur hareketi (TL güçlenmesi) | Orta | Yüksek | Sözleşmede kur güvence maddesi |
| Custom merchant oranının yüksek çıkması | Orta | Yüksek | Segment bazlı fiyatlama |
| Banka veri kalitesi düşük | Orta | Orta | Faz 1 keşif fazı zorunlu |
| Proje uzaması (12 ay aşımı) | Düşük-Orta | Orta | Aylık uzama bedeli maddesi |

---

#### Tavsiye

**Baz senaryo üzerine kurulu, segment ayrımlı, keşif faz bedeli içeren ve kur güvence maddesi olan bir teklif** hem X Bank açısından makul görünecek hem de Finhouse için savunulabilir bir marj bırakacaktır.

Yalnızca merchant başı sabit ücretle gitmek (özellikle 65 USD altında) mevcut varsayımlarla sınırda veya negatif sonuç verebilir. İşlem gelirinin sözleşmeye eklenmesi **stratejik zorunluluktur.**

---

*Bu doküman teklif öncesi iç değerlendirme içindir. Nihai rakamlar keşif fazı tamamlandıktan sonra güncellenmelidir.*

---

**Dosya:** `/Users/baykus/.openclaw/workspace/xbank_migration/maliyet_butce_arastirma.md`  
**Hazırlayan:** OpenClaw Assistant  
**Tarih:** Mart 2026
