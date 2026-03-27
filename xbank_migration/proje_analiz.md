# X Bank Sanal POS Merchant Migration Projesi — Analiz Dokümanı

## 1) Yönetici Özeti
X Bank, daha önce Payten sanal POS altyapısı üzerinden merchant’lara hizmet verirken artık kendi geliştirdiği sanal POS platformuna geçiş yapmaktadır. İlk 60 müşteri yeni ortama alınmıştır. Sıradaki hedef yaklaşık 18.000 merchant’ın kontrollü ve operasyonel olarak yeni platforma geçirilmesidir.

Bu proje yalnızca teknik entegrasyon değil; aynı zamanda yüksek hacimli müşteri iletişimi, segment bazlı geçiş planlama, merchant readiness analizi, test/sertifikasyon, canlıya geçiş koordinasyonu ve geçiş sonrası destek gerektiren kapsamlı bir dönüşüm programıdır.

Finhouse olarak bu projeyi yüklenici modelinde ele alabilir; operasyon, proje yönetimi, merchant iletişimi, teknik analiz koordinasyonu ve geçiş fabrikası yaklaşımıyla ölçeklenebilir bir model sunabiliriz.

---

## 2) Arka Plan
- Eski yapı: Merchant’lar kendi web siteleri / e-ticaret yazılımları üzerinden Payten sanal POS altyapısını kullanıyor.
- Yeni yapı: X Bank kendi sanal POS uygulamasını geliştirdi.
- Mevcut durum: 60 müşteri migrate edildi.
- Yeni hedef: 18.000 merchant’ın yeni ortama taşınması.
- Ticari beklenti:
  - Banka bugün Payten’e yıllık müşteri başına 80 USD işletim bedeli ödüyor.
  - Ayrıca işlem başına binde 3 komisyon ödüyor.
  - Yeni yüklenici modelinde beklenti:
    - müşteri başına 60–65 USD dönüşüm bedeli
    - işlem başına binde 2 hizmet bedeli

---

## 3) Projenin Gerçek Zorluğu
Bu işin temel riski teknik geliştirmeden çok merchant dönüşüm operasyonudur.

Sahadaki tipik gerçekler:
- Merchant’ların önemli bir kısmında özel yazılım ekibi yoktur.
- Bazıları hazır paket kullanır (ör. Ticimax benzeri altyapılar).
- Bazılarında ajans / dış yazılım firması entegrasyonu yapmıştır.
- Merchant tarafı bu işe öncelik vermeyebilir.
- Teknik doküman olsa bile geçiş kendi kendine olmaz; aktif takip gerekir.
- Banka tarafında da kampanya, fiyatlandırma, sertifika, fraud ve destek süreçleri eşzamanlı ilerlemelidir.

Bu nedenle proje başarısı için “müşteriye dokunan operasyon + teknik koordinasyon + merkezi proje ofisi” üçlüsü şarttır.

---

## 4) Önceki Deneyimden Çıkan Dersler (QNB, 2020)
Kullanıcının 2020’de QNB’de benzer bir Payten → banka içi sanal POS geçiş projesinde yaklaşık 2.000 müşterinin dönüşümünde yer almış olması bu teklif için ciddi referans değeridir.

Sahadan çıkan kritik dersler:
1. Merchant geçişi toplu e-posta ile çözülmez; aktif arama ve birebir takip gerekir.
2. Merchant teknik kapasitesi heterojendir; tek tip plan başarısız olur.
3. Segmentasyon yapılmadan ekip verimi düşer.
4. Hazır paket kullanan merchant’lar için entegratör/partner kanalı ayrıca yönetilmelidir.
5. Geçiş takvimi kadar “müşteri karar alma hızı” da kritik darboğazdır.
6. Geçiş sonrası ilk gün/ilk hafta destek penceresi başarı için kritiktir.

Bu proje yaklaşımı bu gerçeklik üzerine kurulmalıdır.

---

## 5) Merchant Segmentasyonu Önerisi
18.000 merchant tek bir havuz değil, en az 5 ana segmente ayrılmalıdır:

### Segment A — Hazır e-ticaret paketleri
Örnek: Ticimax, IdeaSoft, T-Soft benzeri altyapılar
- Entegrasyon çoğu zaman platform/partner üzerinden çözülür
- Toplu enablement yapılabilir
- En verimli geçiş segmentidir

### Segment B — Kendi yazılım ekibi olan orta/kurumsal merchant’lar
- API / callback / 3D / hash / sertifika gibi konularda teknik koordinasyon gerekir
- Dokümantasyon + test ortamı + canlı geçiş checklist’i gerekir

### Segment C — Dış ajans/yazılım firması ile çalışan merchant’lar
- Merchant yerine çoğu zaman tedarikçi firma ile çalışılır
- İletişim zinciri uzar
- Takip ve SLA ihtiyacı yükselir

### Segment D — Teknik kapasitesi düşük küçük işletmeler
- En çok operasyon yükü burada oluşur
- Arama, anlatma, yönlendirme, tekrar takip gerekir
- Bazen ekran paylaşımı / adım adım destek gerekir

### Segment E — Düşük hacimli / pasif merchant’lar
- Önceliklendirme gerekir
- Ticari olarak işlem hacmi düşük olanlar için daha hafif model uygulanabilir

---

## 6) Gerekli Bilgi ve Yetkinlik Alanları
Bu projeyi almak için ihtiyaç duyulacak bilgi seti yalnızca sanal POS API bilgisi değildir.

### A. İş ve ürün bilgisi
- Sanal POS işleyişi
- 3D Secure akışları
- MPI / ACS / yönlendirme mantığı
- Provizyon, iade, iptal, post-auth, partial refund süreçleri
- Callback / webhook / hash doğrulama akışları
- Taksit, BIN, kart şemaları, fraud, risk kuralları

### B. Teknik bilgi
- API entegrasyonu
- Test ortamı / UAT yönetimi
- Merchant teknik onboarding
- Sertifika / IP whitelist / endpoint değişikliği yönetimi
- Hata kodları ve troubleshooting
- Paket platformlarla entegrasyon farkları

### C. Operasyon bilgisi
- Merchant arama scriptleri
- Segment bazlı geçiş playbook’u
- Ticket yönetimi
- Randevu / takip / yeniden arama akışları
- KPI takibi

### D. Proje yönetimi bilgisi
- Migration wave planlama
- Kapasite planlama
- Risk-log / issue-log / dependency tracking
- Haftalık steering / günlük operasyon raporu

### E. Ticari ve sözleşmesel bilgi
- Ücret modeli
- Başarı kriterleri
- SLA / sorumluluk ayrımı
- Banka / yüklenici / merchant rol matrisi

---

## 7) Önerilen Operasyon Modeli
Öneri: “Migration Factory” modeli

### 7.1 Çekirdek yapı
1. PMO / Program Yönetimi
2. Merchant Operasyon Ekibi
3. Teknik Enablement Ekibi
4. L2/L3 Uzman Havuzu
5. Raporlama & Kalite Yönetimi

### 7.2 Süreç akışı
1. Merchant envanterinin alınması
2. Segmentasyon
3. Önceliklendirme (hacim / kritik müşteri / teknik zorluk)
4. İletişim kampanyası (mail + SMS + çağrı)
5. Teknik readiness kontrolü
6. Test entegrasyonu
7. Canlı geçiş randevusu
8. Hypercare / post-go-live destek
9. Kapanış ve raporlama

---

## 8) İlk Tahmini Kaynak Planı
Aşağıdaki plan ilk kaba tahmindir; net sayı merchant segment dağılımı, hedef süre ve bankanın iç destek düzeyine göre revize edilir.

### Senaryo varsayımı
- 18.000 merchant
- 12 ay hedef program süresi
- Merchant’ların önemli bölümü aktif temas gerektiriyor
- Aylık hedef: ortalama 1.500 merchant

### Önerilen ekip
#### 1) Program / proje yönetimi
- 1 Program Manager
- 2 Project Manager / Stream Lead

#### 2) Merchant operasyon
- 8–12 Merchant Migration Specialist
  - çağrı, takip, randevu, merchant onboarding, checklist yönetimi

#### 3) Teknik onboarding
- 4–6 Technical Integration Specialist
  - API, test, hata analizi, teknik yönlendirme

#### 4) Kıdemli uzman / çözüm mimarisi
- 1 Solution Architect
- 1 Senior Payment Consultant

#### 5) Raporlama / kalite / MIS
- 2 PMO Analyst / Reporting Specialist

#### 6) Destek & kalite güvence
- 2 QA / Process Control

### Toplam başlangıç ekibi
- Minimum: 18 kişi
- Sağlıklı ölçek: 22–26 kişi

Bu ölçekte bir operasyon, 18.000 merchant’ı dalgalar halinde yönetmek için daha gerçekçidir. Eğer banka daha agresif takvim isterse 30+ kişilik kapasite gerekebilir.

---

## 9) Neden 60–65 USD Tek Başına Riskli Olabilir?
Banka beklentisi anlaşılır; ancak aşağıdaki faktörler maliyet baskısı yaratır:
- Merchant başına çoklu temas ihtiyacı
- Teknik destek yoğunluğu
- Hazır paket / ajans / özel geliştirme farkları
- No-show / dönüş yapmayan merchant’lar
- Tekrar test ve tekrar geçiş ihtiyaçları
- Post-go-live hata yönetimi

Bu nedenle teklif modeli şu şekilde kurgulanabilir:

### Model 1 — Basit fiyat
- Merchant başı dönüşüm: 65 USD
- İşlem başı hizmet bedeli: binde 2

### Model 2 — Segment bazlı fiyat
- Hazır paket merchant: daha düşük
- Özel entegrasyon merchant: daha yüksek
- Teknik destek yoğun merchant: premium

### Model 3 — Hibrit model (önerilen)
- Baz dönüşüm bedeli + başarı primi + işlem komisyonu
- Böylece hem banka maliyeti optimize edilir hem operasyon riski dengelenir

---

## 10) Kritik Sorular (Teklif öncesi netleştirilmeli)
1. 18.000 merchant’ın segment dağılımı nedir?
2. Aktif/pasif merchant oranı nedir?
3. Hazır paket kullanan merchant sayısı nedir?
4. Banka merchant iletişim verisini ne kadar temiz sağlayabiliyor?
5. Teknik dokümantasyon ve sandbox hazır mı?
6. Bankanın iç ekipleri hangi seviyede destek verecek?
7. Go-live sonrası L1/L2 destek kimde olacak?
8. Hedef tamamlanma süresi nedir? (6 ay / 9 ay / 12 ay / 18 ay)
9. Başarı kriteri “müşteri arandı” mı, “test tamamlandı” mı, “canlı işlem geçti” mi?
10. Binde 2 komisyon tüm hacim için mi, yalnızca migrate edilen merchant hacmi için mi?

---

## 11) Önerilen Fazlar
### Faz 0 — Discovery (2-4 hafta)
- Envanter analizi
- Segmentasyon
- Süreç tasarımı
- Pilot tasarımı
- KPI seti

### Faz 1 — Pilot (100-300 merchant)
- 3-5 segmentte pilot
- Arama scriptleri ve teknik playbook doğrulama
- Ortalama çevrim süresi ölçümü

### Faz 2 — Wave bazlı yayılım
- Haftalık/aylık merchant dalgaları
- Kapasite planı
- Raporlama ve issue yönetimi

### Faz 3 — Hypercare & closure
- Geçiş sonrası destek
- Retrospective
- Operasyon devri

---

## 12) KPI Önerileri
- Aranan merchant sayısı
- Temas kurulan merchant oranı
- Teknik readiness tamamlanan merchant sayısı
- Testi geçen merchant sayısı
- Canlıya geçen merchant sayısı
- İlk denemede başarı oranı
- Ortalama geçiş süresi
- Merchant başına ortalama temas sayısı
- Açık issue sayısı
- Geçiş sonrası ilk 7 gün hata oranı

---

## 13) Sonuç
Bu proje klasik bir yazılım entegrasyon işi değil, yüksek hacimli bir ödeme sistemleri dönüşüm operasyonudur. Başarı için doğru model:
- güçlü segmentasyon,
- saha gerçekliğini bilen operasyon ekibi,
- teknik enablement,
- disiplinli PMO,
- ölçülebilir KPI yönetimi.

Finhouse’un teklifi, QNB benzeri geçmiş saha tecrübesini kullanarak bankaya sadece kaynak değil; hazır migration metodolojisi, operasyon kası ve ölçülebilir sonuç modeli sunmalıdır.
