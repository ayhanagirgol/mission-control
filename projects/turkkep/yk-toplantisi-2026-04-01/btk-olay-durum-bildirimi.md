# BTK'YA SUNULMAK ÜZERE
## GÜVENLİK OLAYI DURUM BİLDİRİM YAZISI — TASLAK

---

**T.C.**  
**BİLGİ TEKNOLOJİLERİ VE İLETİŞİM KURUMU**  
**Elektronik Haberleşme Genel Müdürlüğü**  

**Konu:** Yetkisiz Erişim Türü Siber Güvenlik Olayı — Durum Bildirimi

---

Sayın Yetkili,

TÜRKKEP Kayıtlı Elektronik Posta Hizmetleri A.Ş. ("Şirket"), Şubat 2026 döneminde yaşanan yetkisiz erişim türü siber güvenlik olayına ilişkin aşağıdaki durum bildirimini Bilgi Teknolojileri ve İletişim Kurumu'na ("BTK") saygıyla sunmaktadır.

---

## 1. OLAYA GENEL BAKIŞ

Şirketimiz, destek portal altyapısına yönelik yetkisiz erişim niteliğinde bir güvenlik olayıyla karşılaşmıştır. Yapılan adli inceleme bulguları ışığında olayın tahminen **10 Şubat 2026** tarihinde gerçekleştiği tespit edilmiştir.

| Bilgi | Detay |
|---|---|
| **Olay Türü** | Yetkisiz Erişim (Unauthorized Access) |
| **Tahmini Başlangıç Tarihi** | 10 Şubat 2026 |
| **Tespit Tarihi** | 15 Şubat 2026 |
| **İlk Müdahale Tarihi** | 15 Şubat 2026 (aynı gün) |
| **USOM Bildirimi** | 20 Şubat 2026 (mail ile, 15 dakika içinde işleme alındı) |
| **Olayın Kapatılması** | Sistem güvenlik katmanları 21 Şubat 2026 itibarıyla güçlendirilmiş; saldırılar bloke edilmiştir |

---

## 2. OLAYIN DETAYLI TANIMI

### 2.1 Saldırı Vektörü

Adli inceleme bulgularına göre olay, **e-Saklama ve e-Defter uygulamalarında tespit edilen SQL Injection açığının istismar edilmesi** yoluyla gerçekleştirilmiştir. Saldırgan, söz konusu güvenlik açığı aracılığıyla uygulama veritabanına yetkisiz sorgular göndererek müşteri verilerini çekmiştir.

### 2.2 Etkilenen Veri Kapsamı

Adli inceleme raporuna göre, ele geçirildiği değerlendirilen veriler şunlardır:

- e-Defter ve e-Saklama hizmet müşterilerine ait **e-posta adresleri**
- **Telefon numaraları**
- **Sisteme son giriş tarihleri**

**Etkilenmeyen veri türleri:**
- Veritabanlarına doğrudan erişim tespit edilmemiştir
- KEP mesaj içerikleri etkilenmemiştir
- Ödeme bilgileri, kimlik belgesi veya kişisel sağlık verisi etkilenmemiştir
- Şifreli kriptografik imza verileri etkilenmemiştir

### 2.3 Tehdit Aktörü

Kimliği tam olarak belirlenemeyen tehdit aktörü/aktörleri, ele geçirildiğini iddia ettikleri verileri "türkkep" ibaresini içeren sahte alan adları üzerinden yayımlamakla tehdit etmiştir. Söz konusu sahte alan adı üzerindeki içerik, Ulusal Siber Olaylara Müdahale Merkezi (USOM) koordinasyonuyla **20 Şubat 2026** tarihinde erişime kapatılmıştır.

---

## 3. ALINAN ACİL ÖNLEMLER

Olay tespit edildiğinden itibaren aşağıdaki acil müdahale adımları uygulanmıştır:

1. **Kriz Yönetim Ekibi Aktivasyonu (15 Şubat 2026):** Yönetim Kurulu düzeyinde kriz yönetimi başlatılmış; Teknik, Hukuki ve Uyum ekipleri devreye alınmıştır.

2. **USOM Bildirimi (20 Şubat 2026):** Ulusal Siber Olaylara Müdahale Merkezi'ne yazılı bildirim yapılmış, 15 dakika içinde işleme alınmıştır.

3. **Etkilenen Sistemlerin Geçici Kapatılması:** e-Saklama ve Türkkep Bulut uygulamaları, güvenlik açıkları kapatılana kadar hizmet dışı bırakılmıştır.

4. **Adli İnceleme:** CyberFirstAid Bilgi Teknolojileri San. ve Tic. A.Ş. tarafından **24 Şubat – 3 Mart 2026** tarihleri arasında dijital adli inceleme yürütülmüştür.

5. **Karantina Uygulaması:** Yurt dışı bağlantı aktivitesi tespit edilen 2 çalışana ait bilgisayar karantinaya alınmış, yeni ekipman tahsis edilmiştir.

6. **SOC Güçlendirmesi:** Platin Bilişim ile mevcut SOC L1-L2/SIEM (QRadar) hizmeti genişletilmiş, yüksek destek modeline geçilmiştir.

7. **DDoS Saldırısına Müdahale:** 17 Şubat 2026'da gerçekleştirilen DDoS saldırısı Platin SOC tarafından bloke edilmiştir.

8. **Sahte Alan Adına Müdahale:** "Türkkep" markasını içeren sahte alan adına marka ihlali gerekçesiyle hukuki süreç başlatılmış; alan adı erişime kapatılmıştır.

---

## 4. ORTA VADELİ GÜVENLİK GÜÇLENDIRME ÇALIŞMALARI

Olay sonrasında, güvenlik altyapısını kalıcı olarak güçlendirmeye yönelik aşağıdaki teknik önlemler hayata geçirilmektedir:

| Önlem | Durum |
|---|---|
| Fortify ile statik kod güvenlik analizi (e-Saklama, e-Defter) | Tamamlandı |
| FORTİNAC NAC entegrasyonu | Aktif |
| Bitdefender Gravityzone güvenlik yazılımı yükseltmesi | Aktif |
| Gebze veri merkezi firewall yenileme | Devam ediyor |
| DLP (Veri Kaybı Önleme) çözümü devreye alımı | Devam ediyor |
| MS365 altyapısına geçiş (Zimbra güvenlik açığı) | Devam ediyor |
| Sızma testi kapsamı genişletildi (API dahil) | Tamamlandı |
| Web sitesinin CRM'den ayrıştırılması ve harici hosting'e taşınması | Tamamlandı |
| 6 aylık siber güvenlik danışmanlık yol haritası (CyberFirstAid) | Devam ediyor |

---

## 5. MEVCUT DURUM

**30 Mart 2026 itibarıyla:**

- e-Saklama ve Türkkep Bulut uygulamaları yazılım güvenlik açıkları kapatıldıktan sonra hizmete geri alınmıştır.
- 17 Mart 2026'da gerçekleştirilen ikinci dalga siber saldırı (13 farklı kaynaktan) başarıyla savunulmuş; veri çıkışı gözlemlenmemiştir.
- Süregelen ataklar Platin SOC tarafından etkin biçimde bloke edilmektedir.
- Şirket, ISO 27001 sertifikasını sürdürmekte ve BTK denetimine tabi olmaya devam etmektedir.

---

## 6. SONUÇ VE TAAHHÜT

TÜRKKEP A.Ş., müşteri güvenini ve kişisel verilerin korunmasını kurumsal değerlerinin merkezine almaktadır. Yaşanan olay karşısında en hızlı ve en kapsamlı müdahale gerçekleştirilmiş, yetkili mercilere zamanında bildirim yapılmıştır.

Şirketimiz, BTK tarafından talep edilecek ilave bilgi ve belgeler ile inceleme süreçlerine tam iş birliği sağlamaya hazır olduğunu taahhüt eder.

Saygılarımızla,

---

**TÜRKKEP Kayıtlı Elektronik Posta Hizmetleri A.Ş.**

**Ayhan Ağırgöl**  
Genel Müdür Yardımcısı / CTO  
E-posta: ayhan.agirgol@turkkep.com.tr  
Tel: +90 212 368 60 00

19 Mayıs Mahallesi, 19 Mayıs Caddesi No:4, Nova-Baran Plaza Kat 18, 34360 Şişli / İSTANBUL

---

**Ekler:**
1. CyberFirstAid Dijital Adli İnceleme Raporu (24/02–03/03/2026)
2. USOM Bildirim Kaydı (20/02/2026)
3. Güvenlik Güçlendirme Takvim Planı
4. İlgili Teknik Kanıtlar (talep halinde)

---

> **⚠️ TASLAK — Avukat ve Yönetim onayı gereklidir.**
> Bu metin hukuki denetimden geçirilmeden BTK'ya gönderilemez.
> Hazırlayan: OpenClaw AI Asistan / 30 Mart 2026
