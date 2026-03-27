# X Bank Sanal POS Merchant Migration — Proje Sunumu

## Slayt 1 — Başlık
**X Bank Sanal POS Merchant Migration Programı**  
Payten altyapısından X Bank yeni sanal POS platformuna kontrollü geçiş modeli

---

## Slayt 2 — Yönetici Özeti
- X Bank kendi sanal POS platformunu devreye aldı
- İlk 60 merchant geçişi tamamlandı
- Sıradaki hedef yaklaşık **18.000 merchant**
- Bu dönüşüm yalnızca teknik entegrasyon değil; uçtan uca **merchant migration operasyonu**
- Finhouse bu projeyi **migration factory** yaklaşımıyla üstlenebilir

---

## Slayt 3 — Stratejik Fırsat
- Payten’e ödenen dış servis maliyetinin içselleştirilmesi
- Merchant ilişkisinin doğrudan sahiplenilmesi
- Cross-sell fırsatları
  - kredi
  - BNPL
  - tahsilat çözümleri
  - ticari bankacılık ürünleri
- Merchant verisi ve davranış içgörüsü üzerinde kontrol

---

## Slayt 4 — Problemin Gerçek Doğası
- Merchant’ların önemli kısmında teknik ekip yok
- Bazıları hazır paket kullanıyor (Ticimax, IdeaSoft vb.)
- Bazıları ajans veya dış yazılım firmalarıyla çalışıyor
- Müşteriler bu işe çoğu zaman öncelik vermiyor
- Toplu duyuru ile migration gerçekleşmiyor

**Sonuç:** Bu iş bir yazılım projesi değil, yüksek hacimli bir dönüşüm operasyonudur.

---

## Slayt 5 — Geçmiş Deneyimden Ders
**QNB, 2020 benzeri migration deneyimi**
- Payten’den banka içi yapıya geçiş
- ~2.000 merchant geçişi
- Merchant’ların tek tek aranması gerekti
- Teknik heterojenlik en büyük zorluktu
- Başarının anahtarı operasyon disiplini oldu

---

## Slayt 6 — Araştırma Bulguları
- Benzer programlar dünyada **wave bazlı** yürütülüyor
- Büyük merchant’larda **parallel run / never dark** yaklaşımı kullanılıyor
- KOBİ tarafında en güçlü kaldıraç:
  - hosted payment page
  - plugin/adaptör
  - self-service onboarding
- Plugin ve platform desteği migration hızını ciddi artırıyor

---

## Slayt 7 — Merchant Segmentasyonu
### Segment A — Hazır paket kullananlar
- Ticimax, IdeaSoft, T-Soft, İkas
- toplu enablement fırsatı

### Segment B — Standart API kullananlar
- teknik onboarding gerekir

### Segment C — Ajans / dış yazılım bağımlı olanlar
- takip daha zor

### Segment D — Teknik kapasitesi düşük KOBİ’ler
- operasyon yükü yüksek

### Segment E — Düşük hacimli / pasif merchant’lar
- dalga sonu veya hafif model

---

## Slayt 8 — Önerilen Operasyon Modeli
**Migration Factory**
- Program yönetimi
- Merchant operasyon masası
- Teknik onboarding ekibi
- QA / süreç kontrol
- Raporlama ve KPI takibi
- Hypercare destek penceresi

---

## Slayt 9 — Süreç Akışı
1. Veri ve merchant envanteri
2. Segmentasyon
3. Önceliklendirme
4. İletişim kampanyası
5. Teknik readiness
6. Test
7. Canlı geçiş
8. Hypercare
9. Kapanış ve raporlama

---

## Slayt 10 — X Bank’tan İstenecek Fizibilite Verileri
- Merchant master data
- son 12 ay işlem hacmi ve adetleri
- platform / entegrasyon tipi
- teknik ve iş kontakları
- ilk 60 merchant’tan öğrenimler
- ürün/sandbox/test olgunluğu
- hedef takvim ve başarı kriteri

---

## Slayt 11 — Ekip Yapısı
### Çekirdek başlangıç ekibi
- 1 Program Manager
- 2 Project/Stream Lead
- 1 Solution Architect
- 1 Senior Payment Consultant
- 5 Technical Integration Specialist
- 10 Merchant Migration Specialist
- 2 PMO / Reporting
- 2 QA / Process Control
- 3 Support / Hypercare

### Toplam
**~27 kişi** başlangıç modeli

---

## Slayt 12 — Maliyet Görünümü
### Baz senaryo
- 12 aylık toplam operasyon maliyeti: **~46,98 milyon TL**
- Merchant başı maliyet: **~2.610 TL**
- USD karşılığı: **~68,7 USD / merchant**

### Sonuç
Sadece 60–65 USD setup fee ile çalışmak sınırda olabilir.

---

## Slayt 13 — Gelir Modeli Seçenekleri
### Seçenek 1
- Merchant başı dönüşüm bedeli
- işlem başı binde 2 gelir

### Seçenek 2
- Discovery + pilot sabit ücret
- merchant başı dönüşüm bedeli
- işlem geliri

### Seçenek 3
- Segment bazlı fiyatlama
  - hazır paket
  - standart API
  - custom merchant

**Öneri:** hibrit model

---

## Slayt 14 — Örnek Gelir-Gider Tablosu
### Korumalı senaryo
- Discovery + pilot: **6,0 milyon TL**
- Setup fee: **37,05 milyon TL**
- İşlem geliri: **24,0 milyon TL**
- Toplam gelir: **67,05 milyon TL**
- Toplam maliyet: **46,98 milyon TL**
- Brüt katkı: **20,07 milyon TL**

---

## Slayt 15 — Riskler
- veri kalitesinin düşük olması
- merchant kontak bilgisinin eski olması
- banka ürün olgunluğunun eksik olması
- custom merchant oranının beklenenden yüksek çıkması
- ilk 90 günde yoğun destek ihtiyacı

---

## Slayt 16 — Başarı İçin Kritik Şartlar
- segmentasyon
- pilot öğrenimlerinin doğru kullanımı
- plugin / hazır platform stratejisi
- net başarı kriteri: canlı ilk başarılı işlem
- dedicated teknik destek
- görünür KPI dashboard

---

## Slayt 17 — Neden Finhouse?
- ödeme sistemleri saha deneyimi
- QNB benzeri migration geçmişi
- operasyon + teknik enablement birleşik yaklaşımı
- banka dilini ve merchant gerçekliğini birlikte okuma kabiliyeti

---

## Slayt 18 — Sonraki Adım
1. X Bank discovery toplantısı
2. veri setinin alınması
3. 100–300 merchant pilot planı
4. kapasite ve fiyatın netleştirilmesi
5. nihai teklif ve SOW
