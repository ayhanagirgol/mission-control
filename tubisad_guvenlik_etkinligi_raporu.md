# TÜBİSAD Güven Hizmetleri Çalıştayı – Değerlendirme ve Eylem Raporu

**Tarih:** 2 Nisan 2026
**Konu:** AB eIDAS Tüzüğü Kapsamında Türkiye'nin Güven Hizmetleri Altyapısının Uyumu ve Türkkep Stratejik Aksiyon Planı
**Hazırlayan:** OpenClaw & Kep Agent İşbirliği Özeti

---

## 1. Yönetici Özeti (Executive Summary)
TÜBİSAD Güven Hizmetleri Çalıştayı kapsamında hazırlanan görüş belgesi, Türkiye’deki e-imza ve güven hizmetleri (Trust Services) altyapısının Avrupa Birliği **eIDAS Tüzüğü** ve **Avrupa Dijital Kimlik Cüzdanı (EUDI Wallet)** standartlarıyla uyumlaştırılması gerekliliğini vurgulamaktadır. 

Mevcut durumda Türkiye'deki 5070 sayılı Elektronik İmza Kanunu, eIDAS'ın "Nitelikli Elektronik İmza (QES)" tanımını "Güvenli Elektronik İmza" olarak karşılamakta, ancak eIDAS'ın sunduğu üçlü kademeli yapıyı (basit, gelişmiş, nitelikli) ve sınır ötesi karşılıklı tanıma esnekliğini tam olarak sağlayamamaktadır. Türk Güven Hizmet Sağlayıcılarının (TSP) AB "Güvenilir Hizmet Sağlayıcı (Trusted List)" listelerinde yer almaması, üretilen belgelerin uluslararası delil değeri ve hukuki geçerliliği konusunda handikap yaratmaktadır.

---

## 2. Mevcut Durum Analizi ve Temel Farklar
*   **Mevzuat Uyumsuzluğu:** 5070 sayılı Kanun kademeli imza yapısı sunmamakta, eIDAS ise Basit, Gelişmiş (AES) ve Nitelikli (QES) olmak üzere risk seviyesine göre farklı çözümler sunmaktadır.
*   **Dijital Kimlik (EUDI Wallet):** AB, kimlik, ehliyet, diploma gibi belgeleri barındıran ve e-imza atabilen entegre Dijital Kimlik Cüzdanı yapısına geçmektedir. Türkiye'nin bu ekosisteme teknik entegrasyonu şarttır.
*   **Sınır Ötesi Tanınırlık:** Türkiye'deki Elektronik Sertifika Hizmet Sağlayıcılarının (ESHS) ürettiği sertifikalar AB'de otomatik tanınmamaktadır. Bunun için NIS2 Direktifi ve eIDAS standartlarında Akredite Uygunluk Değerlendirme Kuruluşları (CAB) tarafından denetim ve ikili anlaşmalar gereklidir.

---

## 3. Türkkep Stratejik Aksiyon Planı (CTO Perspektifi)

Bir KEP ve e-Dönüşüm pazar lideri olarak Türkkep'in teknoloji ve strateji yol haritasında atması gereken adımlar aşağıda özetlenmiştir:

### A. Teknik Altyapı ve Ürün Geliştirme
1.  **Kademeli İmza Çözümleri Hazırlığı:**
    *   Mevzuatın değişmesi ihtimaline karşı "Gelişmiş Elektronik İmza (AES)" standartlarında (daha düşük maliyetli, hızlı onboarding sağlayan) ürün mimarilerinin Ar-Ge'sine başlanması.
2.  **EUDI Wallet Entegrasyonu:**
    *   AB Dijital Kimlik Cüzdanı (European Digital Identity Wallet) protokollerinin (OIDC4VP, vb.) teknik analizi ve Türkkep sistemlerinin bu cüzdanlarla doğrulama (authentication) ve imzalama yapabilecek teknik esnekliğe kavuşturulması.
3.  **NIS2 Uyumluluğu:**
    *   Avrupa siber güvenlik direktifi NIS2 gereksinimlerinin Türkkep altyapısında (WAF, DLP, PAM, Incident Response) ne ölçüde karşılandığının gap analizi (qradar otomasyonlarının bu vizyonla genişletilmesi).

### B. Regülasyon ve Kamu İlişkileri (TÜBİSAD & BTK İletişimi)
1.  **Lobicilik Faaliyetleri:**
    *   5070 sayılı kanunun güncellenmesi sürecinde Türkkep'in TÜBİSAD üzerinden aktif rol alması.
    *   AB ile yapılacak "Karşılıklı Tanınma Anlaşmaları (Mutual Recognition Agreements)" süreçlerinde teknik danışman olarak kamuya (BTK/Ulaştırma Bakanlığı) destek verilmesi.
2.  **Uluslararası Akreditasyon (CAB Denetimleri):**
    *   AB tarafından akredite edilmiş bir Uygunluk Değerlendirme Kuruluşundan (CAB) ön denetim (pre-audit) hizmeti alınarak Türkkep altyapısının eIDAS standartlarına uyumunun belgelendirilmesi. Bu adım Türkkep'i global pazarda rakiplerinden ayrıştıracaktır.

---

## 4. Sonuç ve Öneriler
Türkkep'in mevcut kurumsal yapısı, ulusal bazda çok güçlü bir temel sunmaktadır. Ancak, dijital ticaretin sınır ötesine taşınmasıyla birlikte "Uluslararası Güven İnşası" Türkkep için yeni büyüme alanıdır. Çalıştayda alınan kararlar doğrultusunda, mevzuat değişikliklerini beklemeden teknik uyum (EUDI Wallet ve eIDAS standartları) süreçlerine Ar-Ge düzeyinde başlanması, Türkkep'i gelecekteki AB entegrasyonuna en hazır şirket konumuna getirecektir.