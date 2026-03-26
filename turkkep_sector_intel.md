# Türkkep Sector Intel — GİB Özel Entegratör Ekosistemi

Kaynak: `data/whatsapp_exports/gib-entegrator/_chat.txt`
Kapsam: Sektör oyuncuları, operasyonel ağrılar, düzenleme etkileri, teknik geçişler ve ekosistem davranışı

## 1) Genel okuma

Bu grup gerçek anlamda bir **sektör sinyal radarı**. Katılımcılar arasında çok sayıda özel entegratör, teknik yönetici, ürün/süreç sahibi ve sektör temsilcisi var. Türkkep için değeri şu:
- rakiplerin hangi konularda zorlandığını gösteriyor
- GİB tarafındaki sistemsel sorunların sektöre etkisini çıplak biçimde gösteriyor
- regülasyon / taslak tebliğ / ceza / bakım / geçiş dönemleri için erken uyarı kanalı gibi çalışıyor
- KamuSM, HSM, EC sertifika, schematron, zarf statüleri gibi teknik dönüşümlerin fiili etkisini gösteriyor

---

## 2) En önemli konu kümeleri

## A) 1000 statüsü / kuyruk problemi
Eylül 2024’te grup yoğun biçimde **1000 statüsünde bekleyen zarf/fatura** sorununu konuşuyor.

### Çıkan gerçekler
- Çok sayıda entegratörde belgeler 1000 statüsünde birikiyor
- Sektör bunu doğrudan “hata” değil, **GİB kuyruğunda bekleme** olarak yorumluyor
- Ancak teknik etkisi ağır: ERP’ler sürekli statü sorguluyor, servis yükü artıyor, entegrasyon zinciri bozuluyor, müşteri baskısı entegratöre dönüyor
- 8 Kasım 2024 sonrası bazı katılımcılar GİB bakımından sonra 1000’den çok daha hızlı 1200/1220 geçişi almaya başladıklarını söylüyor; bu da GİB tarafında arkada mimari iyileştirme yapıldığına işaret edebilir

### Türkkep için çıkarım
- GİB kuyruk sorunları yaşandığında müşteri bunu entegratör sorunu sanıyor
- Bu yüzden **müşteri iletişimi, statü eğitimi ve destek metinleri** hazır tutulmalı
- Teknik olarak da aşırı polling / sorgu yükü tarafı iyi yönetilmeli

---

## B) GİB ile ilişki: eleştiri mi, ekosistem işbirliği mi?
Grupta iki ana yaklaşım var:

### 1. Daha uzlaşmacı çizgi
- Hüseyin Şahin ve bazı isimler, GİB’in yoğun çalıştığını ve kamu kurumu olarak desteklenmesi gerektiğini savunuyor
- “Eleştirmek değil, birlikte göğüslemek” çizgisi var

### 2. Daha sert teknik/operasyon çizgisi
- Erdem Baş gibi isimler, lisans şartlarını sağlayan entegratörlerin karşılığında daha stabil sistem beklemekte haklı olduğunu açıkça söylüyor
- GİB’in SOAP zorunluluğu, kılavuza aykırı davranışlar ve gecikmeler nedeniyle sektöre maliyet yüklediği vurgulanıyor

### Türkkep için çıkarım
- Ekosistemde **GİB ile açık kavga değil, kontrollü ama güçlü savunuculuk** makbul görünüyor
- Sektör dili: “saygı + teknik netlik + taleplerin ortaklaştırılması”

---

## C) Özel entegratörlerin ortak sorun alanları

### 1. Schematron / kılavuz / ceza ilişkisi
- Aralık 2024’te e-fatura/e-defter tarafında ceza tebligatları konuşuluyor
- Bazı katılımcılar şematron kaynaklı hatalardan dolayı ceza geldiğini, bunun tüm sektöre yaygın olduğunu belirtiyor
- “Belge başına ceza kesilecekse sunucuları kapatmak daha kârlı olur” gibi sert tepkiler var

### 2. E-fatura / e-arşiv karmaşası
- E-fatura yerine e-arşiv düzenlenmesi halinde ceza doğup doğmayacağı, 509 taslak tebliğ etkileri, tevkifat iade faturası gibi spesifik operasyon soruları yoğun
- Bu grup, sektörün mevzuatın gri alanlarını sürekli birlikte yorumladığını gösteriyor

### 3. E-defter geçişi
- Kasım 2024’te bilanço esasına göre e-defter geçişi ve mükellef sayısı tartışılıyor
- Sektörde erteleme beklentisi ile fiili hazırlık arasında bir belirsizlik var

### 4. Portal / servis / URL / geçiş problemleri
- GİB servis adresleri, yeni başvuru URL’leri, eski zarf sorgularında 2004 dönüşü, veri tabanı geçişlerinden kaynaklı davranış değişiklikleri konuşuluyor
- Bu, sektörün yalnız mevzuat değil **operasyonel entegrasyon sürekliliği** açısından da kırılgan olduğunu gösteriyor

---

## D) KamuSM / EC 384 / HSM geçişi
Mayıs 2025’te KamuSM kaynaklı önemli bir geçiş sinyali görülüyor:
- RSA 2048’den **EC 384** geçiş zorunluluğu
- test sertifikalarının entegratörlere ulaştırılması
- HSM cihazlarında EC lisansı / desteği olup olmadığı
- GİB prod ortamında geçersiz imza / doğrulama sorunları

### Türkkep için çıkarım
- Bu tip kriptografik dönüşümler rakipleri de zorluyor; sadece Türkkep’e özel problem değil
- HSM, lisans, sertifika, test-prodakisyon farkı gibi başlıklarda erken hazırlık avantaj yaratır
- Teknik hazır olmanın yanında müşteri ve iç ekip iletişimi de kritik

---

## 3) Ekosistemde öne çıkan kişi tipleri

### Erdem Baş
- En yüksek mesaj hacmine sahip isimlerden
- Teknik ve net konuşuyor
- GİB’e gerektiğinde açık eleştiri getirebiliyor
- Ekosistemin “sert ama teknik olarak güçlü” seslerinden biri

### Denizhan Göçüm
- Operasyonel ve pratik
- GİB’den gelen dönüşleri aktarıyor, geçiş ve erişim sorunlarında saha bilgisi taşıyor
- “Şu an erişebilen var mı?” tarzı gerçek zamanlı koordinasyon rolü var

### Hüseyin Öztürk
- Teknik açıklayıcı, gözlemci, dengeleyici
- Kuyruk, bakım, servis davranışı, URL/portal değişimi gibi konularda sık bilgi veriyor
- Grubun güvenilir teknik yorumcularından biri gibi duruyor

### Ferzan Yalkut
- Ekosistem yönetişimi, çalıştay, TURMOB/SMMM/GİB aynı masa vizyonu tarafında aktif
- Teknik kadar temsil ve sektör organizasyonu tarafını da düşünüyor

### Hüseyin Şahin
- GİB ile daha uyumlu, kamu perspektifini koruyan çizgi
- Grupta tansiyonu düşürmeye çalışan kamusal/uzlaşmacı ses

### Uğur Saykılı
- Müşteri/SMMM eğitim tarafına vurgu yapıyor
- Her operasyonel problemin sektör içi grup büyütme ile değil, eğitim ve durum kodu okuryazarlığı ile çözülmesi gerektiğini savunuyor

---

## 4) Türkkep için stratejik anlamı

### A) Rakipler de ciddi şekilde zorlanıyor
- GİB kuyrukları
- schematron / ceza riski
- e-defter belirsizliği
- portal / endpoint / URL geçişleri
- EC / HSM / imza geçişleri

Bu, Türkkep’in bazı sorunlarının “piyasaya özgü” olduğunu gösterir; müşteriye anlatımda kullanılabilir.

### B) Fark yaratılabilecek alanlar
1. **Müşteri iletişimi ve eğitim**
   - durum kodları
   - GİB kaynaklı gecikme anlatısı
   - geçiş dönemleri için hazır duyurular
2. **Regülasyon erken okuma**
   - taslak tebliğleri hızlı yorumlama
   - müşteri etkisini erkenden ürüne/satışa yansıtma
3. **Operasyonel dayanıklılık**
   - kuyruk/polling yönetimi
   - servis davranışı değişimlerine karşı esnek mimari
4. **Kriptografik geçiş hazırlığı**
   - EC/HSM uyumluluğu
   - test/prod ayrımı

### C) Potansiyel satış / iş geliştirme sinyalleri
- Sektörde karmaşa yüksek olduğu için “daha iyi destek veren, daha iyi anlatan, daha iyi geçiş yöneten entegratör” öne çıkabilir
- Özellikle SMMM/TURMOB tarafında eğitim ve güven inşa eden oyuncu avantaj kazanabilir
- KamuSM / EC / güvenlik geçişleri danışmanlık ve migration hizmet fırsatı yaratabilir

---

## 5) Kısa sonuç

GİB Özel Entegratör grubu Türkkep için üç şey ifade ediyor:
1. **Sektör nabzı** — rakiplerin gerçek ağrıları görünür
2. **Erken uyarı sistemi** — regülasyon, bakım, geçiş, ceza sinyalleri erkenden geliyor
3. **Konumlandırma fırsatı** — destek kalitesi, açıklayıcı iletişim, teknik dayanıklılık ve mevzuat okuryazarlığı ile ayrışma imkânı var

Bu grup düzenli aralıklarla tekrar taranmalı. Özellikle:
- GİB bakım/duyuru sonrası etkiler
- ceza/tebligat dalgaları
- EC 384 / HSM / imza geçişleri
- e-defter/e-fatura zorunluluk değişiklikleri
ayrı radar başlığı olarak izlenmeli.
