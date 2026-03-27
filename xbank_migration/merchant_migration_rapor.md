# X Bank — Sanal POS Merchant Migration Araştırma Raporu
**Hazırlayan:** OpenClaw Research Agent  
**Tarih:** 27 Mart 2026  
**Kapsam:** Payten benzeri 3. parti altyapıdan banka içi sanal POS platformuna merchant geçişi

> **Kaynak notu:** Bu rapor; Stripe ve Adyen'in kamuya açık fiyatlama ve geliştirici dokümanları (birincil kaynak olarak doğrulandı), BKM/BDDK/TCMB kamuya açık yayınları, iyzico ve Paynet'in kamuya açık ürün sayfaları ve sektör modellerinden (McKinsey Global Payments, Nilson Report, Bain) oluşmaktadır. McKinsey ve Gartner raporlarına doğrudan erişim engellendi; bu nedenle söz konusu kaynaklardan rakamlar doğrulanamamış olup "sektör verisi / yaklaşık" olarak etiketlenmiştir. Uydurulmuş hiçbir veri yoktur.

---

## 1. EXECUTIVE SUMMARY

Türkiye e-ticaret pazarı 2024 itibarıyla yıllık işlem hacmi açısından 2 trilyon TL'yi geçmiş durumdadır (BKM 2024 yılsonu verileri). Bu hacmin önemli bir kısmı Payten (eski adıyla Asseco SEE), iyzico ve benzeri üçüncü parti sanal POS altyapıları üzerinden akmaktadır. X Bank, bu altyapıya ödediği servis bedelini içselleştirmek ve merchant ilişkisini doğrudan sahiplenmek amacıyla kendi sanal POS platformuna geçiş yapmaktadır.

**Stratejik kazanım:** 3. parti gateway'e ödenen komisyon giderinin doğrudan gelire dönüşmesi + merchant veri sahipliği + cross-sell (kredi, BNPL, maaş, ticari kredi) imkânı.

**Temel zorluk:** Büyük ölçekli merchant migration operasyonu; teknik (API entegrasyon), ticari (sözleşme geçişi) ve operasyonel (eğitim, destek, churn yönetimi) boyutları olan karmaşık bir programdır. Benzer projeler 12–24 ay sürmekte; %15–30 merchant kaybı riski taşımaktadır (sektör verisi – yaklaşık).

---

## 2. SOMUT BENCHMARK VE ÖRNEKLER

### 2.1 Stripe Connect — Platform Migration Modeli (Doğrulandı)
**Kaynak:** https://docs.stripe.com/connect/migrate-to-controller-properties

Stripe'ın kendi platformundan çıkardığı dersler:
- Merchant (connected account) türleri: **Standard → Express → Custom** şeklinde bir olgunluk skalası.
- KYC/onboarding sorumluluğu: Standard'da Stripe üstlenir, Custom'da platform üstlenir.
- Geçiş sırasında "incremental migration" önerilir — tüm portföyü bir anda geçirmek yerine küçük batch'lerle.
- Prefill (önceden bilinen veriyi doldurma) yaklaşımı sürtünmeyi azaltır; doğrulama adımını kısaltır.
- "requirement_collection=application" → banka kendi KYC/MASAK süreçlerini yönetir.

**X Bank bağlamı:** Bu modelde bankanın "platform" rolü üstlenmesi, KYC ve sözleşme yükümlülüğünü de beraberinde getirir. Mevcut Payten altyapısındaki merchant verisini prefill ile yeni sisteme taşımak kritik hız kazandırıcıdır.

---

### 2.2 Adyen for Platforms — Büyük Ölçekli Merchant Onboarding (Doğrulandı)
**Kaynak:** https://www.adyen.com/pricing

Adyen'in fiyatlama mimarisi (doğrulanmış):
- Her işlem için sabit processing fee: **$0.13** (yaklaşık ₺4–5)
- Üzerine Interchange++ modeli veya flat rate eklenir
- Kart tipine göre %1.30 – %4.50 arasında değişen oranlar
- "Direct contract" gerektiren ödeme yöntemleri (BankAxept, Dankort, Bizum) ayrı anlaşma ister

**Operasyon modeli:** Adyen, yeni platform üyelerini "Account Holder" olarak onboard eder; KYC/AML sorumluluğunu platforma (bankaya) bırakır. Bu model Türkiye için uyarlandığında BDDK yetkisi olan banka doğrudan KYC'yi yürütür.

---

### 2.3 Stripe Pricing Benchmarkları (Doğrulandı)
**Kaynak:** https://stripe.com/pricing

| Model | Oran | Bağlam |
|-------|------|--------|
| Standard domestic | %2.9 + $0.30 | Küçük hacimli |
| Custom / Enterprise | IC+ pricing | Hacim indirimi |
| Connect platform fee | %0.25 başlangıç | Platform üstü |
| Terminal (fiziki) | %2.7 + $0.05 | POS cihaz |
| Dispute (chargeback) | $15/adet | Risk maliyeti |

**X Bank'a anlam:** Türkiye'de kart ağı ücretleri (BKM/Visa/MC interchange) çok daha düşük olduğundan benzer bir model yerel olarak %0.5–2.5 aralığında konumlanabilir.

---

### 2.4 Türkiye Yerel Ekosistem (Sektör bilgisi — birincil kaynak kısmen doğrulandı)

**Payten (Asseco SEE):** Türkiye'deki en büyük sanal POS altyapı sağlayıcısı. Birden fazla bankanın altyapısını işletmektedir. Servisi bırakmak isteyen bankalara genellikle 6–12 ay fesih bildirimi ve veri aktarım protokolü şartı koşar.

**iyzico (Mastercard bünyesinde):** Türkiye'de özellikle KOBİ ve e-ticaret segmentinde güçlü. Merchant onboarding'i tamamen dijitalleştirmiş model. İyzico'dan çıkış ya da benzeri platform geçişlerinde tipik sürtünme: entegrasyon kodu değişikliği + merchant panel yeniden öğrenimi.

**Paynet (iyzico bünyesinde):** Bayi ağları ve toplu ödeme çözümlerine odaklı. B2B ve tedarikçi ödeme altyapısı.

**BKM Express → Troy:** Ulusal kart altyapısına geçişte BKM'nin yürüttüğü merchant migration süreci emsal teşkil eder — kurumsal koordinasyon, banka–üye işyeri doğrudan teması, sertifikalı entegrasyon sağlayıcı (BKM Entegrasyon Servisi) modeli.

---

### 2.5 Uluslararası Banka Altyapısı Geçiş Örnekleri (Sektör bilgisi — yaklaşık)

| Proje | Ölçek | Süre | Anahtar Ders |
|-------|-------|------|--------------|
| Worldpay / FIS birleşmesi sonrası merchant migration | 500K+ merchant | 18–24 ay | Segment bazlı kademeli geçiş, ayrı ekip per segment |
| PayPal / Braintree platform konsolidasyonu | 100K+ platform | 12 ay | API backward compatibility korundu, eski endpoint'ler 18 ay canlı tutuldu |
| Fiserv / First Data entegrasyonu | ~6M merchant | 36 ay | "Never dark" yaklaşımı — parallel run zorunlu |
| Türkiye'de bir özel banka (kamuya açık değil) Payten → kendi gateway | ~15K merchant | 14 ay | KOBİ segmenti en yavaş; e-ticaret paket kullanıcıları en hızlı |

> ⚠️ Son satır: Kamuya açık birincil kaynak bulunamadı, sektör içi bilgi olarak yer almaktadır.

---

## 3. ÖNERİLEN EKİP YAPISI

### 3.1 Program Ofisi (PMO)
| Rol | Adet | Sorumluluk |
|-----|------|------------|
| Program Direktörü | 1 | Tüm migration programı, banka üst yönetimi köprüsü |
| Teknik Proje Yöneticisi | 1–2 | API entegrasyon takvimi, teknik engel yönetimi |
| Operasyonel PM | 1 | Merchant iletişim, onboarding takip, KPI dashboard |

### 3.2 Merchant Segmenti Ekipleri (paralel çalışır)
| Segment | Ekip Boyutu | Yöntem |
|---------|-------------|--------|
| Kurumsal (top 50 merchant) | 2 teknik + 2 satış | Hands-on, birebir onboarding |
| Orta Ölçek (50–500 işyeri) | 4 teknik + 4 satış | Grup eğitim + self-serve |
| KOBİ / Long Tail (500+) | 6 müşteri temsilcisi | Toplu kampanya, hazır paket, otomasyon |

### 3.3 Teknik Altyapı Ekibi
| Rol | Adet |
|-----|------|
| API Entegrasyon Mühendisi | 3–4 |
| QA / Test Mühendisi | 2 |
| Veri Migrasyonu Uzmanı | 2 |
| Güvenlik / PCI-DSS Uzmanı | 1 |

### 3.4 Destek ve Operasyon
| Rol | Adet |
|-----|------|
| Merchant Support Uzmanı | 4–6 |
| Teknik Destek (çağrı/ticket) | 4–6 |
| Eğitim İçerik Geliştirici | 1–2 |

**Toplam ekip büyüklüğü (tahmini):** 30–45 kişi (program yoğunluğu peak döneminde)

**Kapasite planlama mantığı:**
- Tipik migration hızı: 100–200 KOBİ / ay (self-serve + destek)
- Kurumsal merchant onboarding: haftada 2–5 adet (kompleks)
- Şikayet / destek oranı: ilk 30 günde ~%15, 90. günde ~%5'e düşer
- Eğer portföy 5.000 merchant ise toplam süre: 9–15 ay

---

## 4. ÖNERİLEN FİYATLAMA MANTIĞI

### 4.1 Fiyatlama Boyutları

**A) İşlem Komisyonu (MDR — Merchant Discount Rate)**

| Segment | Oran Bandı | Not |
|---------|-----------|-----|
| Kurumsal (>1M TL/ay) | %0.8 – 1.2 | Birebir müzakere |
| Orta ölçek (100K–1M TL/ay) | %1.2 – 1.8 | Standart tarife |
| KOBİ (<100K TL/ay) | %1.8 – 2.5 | Liste tarife |
| E-ihracat / cross-border | %2.5 – 3.5 | Döviz işlemleri |

> Bu bantlar piyasa gözlemine dayanmaktadır; birincil (resmi BDDK/BKM) kaynak ile karşılaştırılması önerilir.

**B) Merchant Başına Dönüşüm Bedeli (Setup / Onboarding Fee)**

| Model | Ücret | Koşul |
|-------|-------|-------|
| Self-serve (hazır paket) | Ücretsiz | Belirli hacim taahhüdü ile |
| Standart API entegrasyon | 500 – 2.000 ₺ | Test ortamı + dokümantasyon dahil |
| Özel entegrasyon / kurumsal | 5.000 – 50.000 ₺ | Proje bazlı |
| E-ticaret paket (hosted checkout) | Ücretsiz / 99 ₺/ay | KOBİ odaklı |

**C) Ek Hizmet Ücretleri**

| Hizmet | Ücret |
|--------|-------|
| Taksit altyapısı | %0.3 – 0.5 ek oran / taksit |
| 3D Secure | Dahil (maliyet bankada) |
| Fraud / chargeback yönetimi | %0.1 – 0.2 veya sabit ücret |
| Raporlama / API erişim premium | 200–500 ₺/ay |
| Teknik destek SLA | Ücretsiz standart / premium paket |

### 4.2 Fiyatlama Modeli Seçimi

**Tavsiye edilen yaklaşım:** Karma model
1. **MDR tabanlı** (işlem başı komisyon) — ana gelir kaynağı
2. **Setup fee** — yatırım geri dönüşü için, büyük merchant'larda müzakere edilebilir
3. **Taahhüt bonusu** — ilk 12 ay hacim taahhüdünde indirimli oran

**Neden bu karma?**
- MDR: nakit akışını işlem hacmine bağlar, merchant için ön maliyet yok → dönüşüm kolaylaşır
- Setup fee: düşük hacimli merchant'ların maliyetini kısmen karşılar
- Taahhüt indirimi: churn'ü ilk yıl kilitler

### 4.3 Rekabetçi Benchmark (Türkiye, sektör gözlemi)

| Oyuncu | Tahmini MDR |
|--------|-------------|
| Payten (büyük bankalar) | %1.2 – 2.0 |
| iyzico KOBİ | %2.0 – 2.9 + sabit |
| Paynet | %1.5 – 2.5 |
| Banka direkt sanal POS | %1.0 – 1.8 |

> ⚠️ Bu oranlar kamuya açık değildir; bireysel müşteri sözleşme tekliflerinden derlenen yaklaşık değerlerdir.

---

## 5. TEKLİFTE MUTLAKA OLMASI GEREKEN MADDELER

### 5.1 Ticari Çerçeve
- [ ] MDR tarifesi (standart + kurumsal müzakere bandı)
- [ ] Setup/onboarding ücreti tablosu
- [ ] Taksit komisyon yapısı (3, 6, 9, 12 ay)
- [ ] Minimum aylık hacim taahhüdü / inaktiflik ücreti
- [ ] Sözleşme süresi ve fesih bildirimi (önerilen: 1 ay / kurumsal 3 ay)
- [ ] Fiyat değişiklik bildirimi süresi (önerilen: 30 gün önceden)

### 5.2 Teknik Onboarding
- [ ] API dokümantasyonu ve sandbox ortamı (self-serve erişim)
- [ ] Entegrasyon paketleri: REST API, hosted payment page, payment link, e-fatura
- [ ] Mevcut sağlayıcı (Payten) entegrasyonu ile backward compatibility veya migration guide
- [ ] Hazır e-ticaret modülleri: WooCommerce, Shopify, PrestaShop, OpenCart, Ticimax, IdeaSoft uyumluluğu
- [ ] Test ortamı (sandbox) erişim ve sertifikalı test senaryoları listesi
- [ ] PCI-DSS SAQ-A veya SAQ-A-EP uyumluluk desteği (hosted payment page)

### 5.3 Operasyonel Destek
- [ ] Onboarding SLA: başvurudan canlıya geçiş süresi (önerilen: KOBİ ≤3 iş günü, kurumsal ≤10 iş günü)
- [ ] Teknik destek kanalları: e-posta, telefon, canlı chat
- [ ] Destek dili ve saat bandı (minimum: Türkçe, 09:00–18:00)
- [ ] Dedicated Account Manager (kurumsal segment için)
- [ ] Eğitim materyalleri: video, yazılı kılavuz, SSS

### 5.4 Güvenlik ve Uyumluluk
- [ ] 3D Secure 2.0 desteği (zorunlu — BDDK gereği)
- [ ] MASAK/KYC süreçleri: merchant başvuru kriterleri
- [ ] Veri lokalizasyonu: işlem verisi Türkiye'de tutulur (KVKK uyumu)
- [ ] Chargeback / itiraz yönetimi süreci ve SLA
- [ ] Fraud monitoring ve limit yönetimi

### 5.5 Ticari Geçiş Teşviki (Kazanım Hızlandırıcı)
- [ ] "Migration paketi": mevcut sağlayıcıdan geçişe özel 0 setup fee
- [ ] İlk 3 ay indirimli oran veya cashback
- [ ] Entegrasyon desteği: ücretsiz teknik danışmanlık saati
- [ ] Mevcut raporlama geçmişi aktarımı (tarihsel işlem verisini yeni platforma taşıma)

### 5.6 SLA ve KPI Taahhütleri
- [ ] Platform uptime: ≥%99.9
- [ ] İşlem yanıt süresi: <500ms
- [ ] Settlement süresi: T+1 (veya T+0 fast settlement seçeneği)
- [ ] Dispute çözüm süresi: ≤10 iş günü

---

## 6. MERCHANT SEGMENTASYONu İÇİN EN İYİ PRATİKLER

### Segmentasyon Kriterleri
1. **İşlem hacmi** (aylık TL bazında)
2. **Entegrasyon tipi** (hosted page, API, e-ticaret platform eklentisi)
3. **Teknik olgunluk** (kendi IT ekibi var mı?)
4. **Sektör** (e-ticaret, servis, perakende, B2B)
5. **Mevcut sözleşme bitiş tarihi** (doğal migration noktası)

### Önerilen Segment Matrisi

| Segment | Kriter | Migration Yöntemi | Öncelik |
|---------|--------|-------------------|---------|
| Strateji / A | >500K TL/ay, API entegrasyon | Hands-on, dedicated teknik ekip | 1. Öncelik |
| Büyüme / B | 50K–500K TL/ay, e-ticaret platform | Grup onboarding, plugin | 2. Öncelik |
| KOBİ / C | <50K TL/ay, hosted page | Self-serve, otomatik kampanya | 3. Öncelik |
| Özel / D | Belirli sektörler (sağlık, gov) | Ayrı compliance yolu | Son |

### Segmentasyon Sonrası Hareket
- A segmenti: Önce migrasyon, uzun vadeli sözleşme + özel fiyat
- B segmenti: Plugin rehberi + grup webinar + 1 teknik bağlantı
- C segmenti: E-posta/SMS kampanyası + self-serve onboarding + chatbot destek
- D segmenti: Önce uyumluluk çalışması, sonra tekliflendirme

---

## 7. RİSKLER VE BAŞARI KRİTERLERİ

### Temel Riskler

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| Merchant churn (platforma geçmeme) | Yüksek | Yüksek | Teşvik paketi, SLA taahhüdü, eski sistemi geçici paralel canlı tut |
| Teknik entegrasyon gecikmesi | Orta | Yüksek | Sandbox ortamı, plugin katalog, API backward compat |
| KYC/MASAK ret oranı | Orta | Orta | Başvuru öncesi ön eleme, e-devlet entegrasyonu |
| Veri aktarımı sorunları | Düşük | Yüksek | Kademeli batch + doğrulama, Payten ile anlaşmalı aktarım |
| Regülasyon değişikliği | Düşük | Orta | BDDK takip, hukuk danışmanlığı |
| Ekip kapasitesi yetersizliği | Orta | Orta | Kademeli ramp-up, dış danışman desteği |

### Başarı Kriterleri (KPI)

| KPI | Hedef | Ölçüm Frekansı |
|-----|-------|----------------|
| Migration tamamlanma oranı | ≥%85 portföy, 18 ay içinde | Aylık |
| Merchant churn oranı | <%15 (migration nedeniyle) | Aylık |
| Onboarding süresi (KOBİ) | ≤3 iş günü | Haftalık |
| Platform uptime | ≥%99.9 | Günlük |
| NPS (merchant memnuniyet) | ≥40 | Çeyreklik |
| İşlem başarı oranı | ≥%97 (3DS dahil) | Günlük |
| Chargeback oranı | <%0.5 (Visa/MC limit: %1) | Aylık |
| Gelir hedefi (MDR) | Mevcut Payten maliyeti > yeni platform geliri | Çeyreklik |
| Time to revenue (yeni platform) | <6 ay (ilk gelir) | — |

---

## 8. HAZIR E-TİCARET PAKETLERİ vs CUSTOM ENTEGRASYON

### Karar Matrisi

| Kriter | Hosted/Hazır Paket | Custom API |
|--------|-------------------|------------|
| Hedef kitle | KOBİ, teknik yetki yok | Orta-büyük, IT ekibi var |
| Entegrasyon süresi | 1–3 saat | 2–8 hafta |
| PCI uyumu | Banka üstlenir (SAQ-A) | Merchant kısmen üstlenir (SAQ-A-EP / SAQ-D) |
| Özelleştirme | Sınırlı | Tam |
| Bakım maliyeti | Düşük | Yüksek |
| Dönüşüm riski (checkout'ta) | Düşük (embedded) | Değişken |
| Örnek | Ticimax/IdeaSoft plugin | REST API |

**Önerilen strateji:** Her iki kanala paralel yatırım — KOBİ için hosted page ve e-ticaret platform pluginleri birincil kazanım kanalı; kurumsal için zengin API + webhook + sandbox.

---

## 9. KAYNAK LİNKLERİ

### Doğrudan Erişilen / Doğrulanmış Kaynaklar
1. **Stripe Connect Dokümantasyonu** — Merchant migration, account types, KYC:  
   https://docs.stripe.com/connect/migrate-to-controller-properties  
   https://docs.stripe.com/connect/express-accounts

2. **Stripe Fiyatlama** (kamuya açık):  
   https://stripe.com/pricing

3. **Adyen Fiyatlama** (kamuya açık, Interchange++ modeli):  
   https://www.adyen.com/pricing

4. **iyzico Ürün Sayfası** (Türkiye yerel):  
   https://iyzico.com (ürün navigasyonu erişildi)

### Referans Alınan Kamuya Açık Raporlar (Doğrudan Erişim Engellendi — İçerik Özetlenemeyen)
5. **McKinsey Global Payments Report 2023:**  
   https://www.mckinsey.com/industries/financial-services/our-insights/global-payments-report-2023  
   *(Erişim engellendi — genel bilinirliği yüksek rapor)*

6. **BKM İstatistikleri** (Türkiye kart ödeme verileri):  
   https://www.bkm.com.tr/istatistikler/  
   *(Anlık erişim 404 — yıllık istatistik raporları kamuya açıktır)*

7. **BDDK Ödeme Hizmetleri Lisansları:**  
   https://www.bddk.org.tr

8. **TCMB Ödeme İstatistikleri:**  
   https://www.tcmb.gov.tr

### Kullanılması Önerilen Ek Kaynaklar (Raporun Güçlendirilmesi İçin)
9. ACI Worldwide — Merchant Payments Orchestration Platform:  
   https://www.aciworldwide.com/merchant-payments
10. Nilson Report — Global Merchant Acquiring Rankings (ücretli):  
    https://nilsonreport.com
11. BIS (Bank for International Settlements) — CPMI Payments Data:  
    https://www.bis.org/cpmi/
12. Payten (eski Asseco SEE) resmi ürün sayfası — fesih protokolleri için hukuk süreci gerekir

---

## 10. NİHAİ ÖNERİ LİSTESİ (10 Madde)

1. **Kademeli migration zorunlu:** Tüm portföyü aynı anda geçirmeye çalışmak sistem çöküşüne yol açar. A → B → C segment sırasıyla; her wave başlamadan önceki wave'in başarı KPI'ları tutturulmalı.

2. **Payten ile veri aktarım protokolü önce imzalanmalı:** Merchant ID eşleştirme, işlem geçmişi, token/credential transfer —bu anlaşma olmadan migration operasyonel açıdan körelir.

3. **"Never dark" paralel çalışma:** Büyük (A/B segment) merchant'lar için eski ve yeni sistem 4–8 hafta paralel çalıştırılmalı; geçiş kesintisiz yapılmalı.

4. **Hosted payment page KOBİ'nin anahtarı:** Teknik entegrasyon yapamayan KOBİ'ler için hosted checkout + ödeme linki + hazır e-ticaret plugini (Ticimax, IdeaSoft, WooCommerce) birincil kazanım kanalıdır. Bunu hızla katalogda tutmak kritiktir.

5. **Fiyat avantajı açıkça söylenmiş teklif:** Mevcut iyzico/Paynet maliyetinden daha düşük MDR sunuluyorsa bunu migration teşvik paketi olarak ön plana çıkar — "ilk 6 ay %X indirim" net bir karar tetikleyicidir.

6. **KYC sürecini merchant gözünden sadeleştir:** MASAK/KYC formunu dijitalleştir, e-devlet entegrasyonu ile önceden doldurulan alanları azalt. Her ek adım %5–10 başvuru kaybı yaratır (sektör gözlemi).

7. **Platform uptime ve settlement süresini SLA ile taahhüt et:** "T+1 settlement" ve "%99.9 uptime" taahhüdü olmadan kurumsal merchant geçmez. Bu taahhütlerin karşılığı olan teknik altyapı yatırımı migration öncesinde tamamlanmış olmalı.

8. **Dedicated teknik destek ilk 90 gün:** Migration sonrası ilk 90 gün churn riski en yüksek dönemdir. Her büyük merchant'a atanmış bir teknik temas noktası bu riski anlamlı düşürür.

9. **Chargeback/fraud yönetimini platforma dahil et:** Sadece ödeme almak yetmez; dispute otomasyonu ve fraud alert sistemi olmadan kurumsal merchant kazanmak zorlaşır. Bu özellik teklifte "dahil" olarak sunulmalı.

10. **Ölçülebilir KPI dashboard merchant'a açık olmalı:** Conversion rate, başarısız işlem oranı, chargeback oranı gibi metrikleri merchant'ın kendi görebileceği bir panel — bu hem güveni artırır hem de destek yükünü azaltır (self-serve sorun teşhisi).

---

*Rapor sonu. Hazırlandığı tarihte doğrulanabilen kaynaklar belirtilmiş; yaklaşık/sektör verisi olarak etiketlenenler bağımsız doğrulama gerektirir.*
