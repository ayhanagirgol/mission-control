# TÜRKKEP Veri İhlali Olay Analizi ve BTK Savunma Dokümanı

## TASLAK — Ayhan Bey onayı gereklidir

---

## 1. Olay Özeti

| Başlık | Detay |
|---|---|
| **Olay tipi** | Yetkisiz Erişim ve Veri Sızdırma |
| **Tespit tarihi** | 15 Şubat 2026 (saat 06:00 civarı — Elvan'a bildirim) |
| **Tahmini sızma tarihi** | 10 Şubat 2026 |
| **Olay süresi** | ~10 Şubat – 03 Mart 2026 (aktif tehdit dönemi) |
| **Etkilenen veriler** | e-Defter ve e-Saklama müşteri e-posta adresleri, telefon numaraları, sisteme son giriş tarihleri (Excel formatında iki dosya) |
| **Etkilenen sistemler** | Destek portal uygulaması (kullanıcı bilgisayarından sorgu atılarak veri çekilmiş) |
| **Veritabanı erişimi** | Tespit EDİLMEDİ — Doğrudan veritabanı erişimi gözlemlenmedi |
| **Saldırı vektörü** | Destek portal kullanıcısının bilgisayarından yetkisiz sorgu / kullanıcı bilgisi ele geçirilerek veri sızdırılması |
| **Tehdit aktörü** | Kimliği belirlenemeyen grup — "türkkep" içeren sahte web siteleri üzerinden veri yayınlama tehdidi |
| **BTK bildirim** | Yapılacak (bu doküman hazırlık amaçlıdır) |
| **KVKK bildirim** | 72 saat kuralı kapsamında uyum ekibi tarafından hazırlığa başlandı (17 Şubat) |
| **USOM bildirim** | 20 Şubat 2026 tarihinde mail ile yapıldı, 15 dakika içinde işleme alındı |
| **Dijital adli inceleme** | CyberFirstAid tarafından yürütüldü (24/02 – 03/03/2026) |
| **SOC desteği** | Platin Bilişim (SOC L1-L2, QRadar, Log analiz) |

---

## 2. Olay Zaman Çizelgesi

### Faz 1: Tespit ve İlk Müdahale (10–17 Şubat 2026)

| Tarih | Olay |
|---|---|
| **~10 Şubat** | Veri sızıntısının gerçekleştiği tahmin edilen tarih |
| **15 Şubat 06:00** | Elvan'a bildirim geldi — olay ilk kez tespit edildi |
| **15 Şubat 15:19** | YK düzeyinde "Veri Güvenlik TÜRKKEP YK" WhatsApp kriz grubu oluşturuldu (Hüseyin Karayağız) |
| **15 Şubat 15:26** | Ayhan Ağırgöl durumu gruba raporladı: "10 Şubat tarihinde veri sızdırılmış, veritabanlarına erişim yok, şahsi durum olabilir" |
| **15 Şubat 17:20** | Ön tespit: "İçeriye sızmadan çok bir kullanıcı makinesinden sorgu atılmış gibi duruyor" |
| **15 Şubat 17:45** | Destek portal uygulamasına yoğunlaşıldı — kullanıcı bilgisayarından atak veya kullanıcı bilgisi çalınarak sızma ihtimali |
| **15 Şubat 18:38** | Sızma ihtimali olan veriler belirlendi: e-Defter ve e-Saklama müşteri e-posta, telefon, son giriş tarihi |
| **15 Şubat 18:39** | Uyum ekibi krize dahil edildi — KVKK 72 saat bildirim süreci başlatıldı |
| **16 Şubat 22:06** | Avukat Ali Gökhan Yıldırım kriz grubuna eklendi |
| **16 Şubat 22:08** | Tehdit aktörünün "türkkep" içeren sahte siteler kurarak veri yayınlama tehdidi yapıldığı bildirildi |
| **16 Şubat 22:13** | Avukat: marka ihlali kapsamında müdahale edilebileceği değerlendirmesini yaptı |
| **17 Şubat 08:43** | Şimdilik yeni tehdit mesajı gelmemiş |
| **17 Şubat 11:35** | Saldırganlar verileri gösterdikleri siteyi kapatmış |
| **17 Şubat 11:37** | Platin güvenlik ekibi geldi, eksikler gideriliyor |
| **17 Şubat 11:37** | 2-3 aylık yüksek destek modeline geçiş kararı |
| **17 Şubat 11:38** | DDoS saldırısı tespit edildi |
| **17 Şubat 11:42** | KVKK bildirim raporu gün sonunda hazırlanacak |

### Faz 2: Stabilizasyon ve Güçlendirme (18–25 Şubat 2026)

| Tarih | Olay |
|---|---|
| **18 Şubat** | Bölge müdürleri grubunda tartışma — müşteri tarafında farkındalık arttı |
| **19 Şubat** | Adres kopyalama (spoofing) atağı tespit edildi — sahte adresle mail gönderiliyordu |
| **20 Şubat 12:41** | 12 maddelik kapsamlı durum raporu yayınlandı (Ayhan): |
| | 1. Platin ile saldırılar bloklanıyor |
| | 2. Ulaşan saldırılar çok azaldı |
| | 3. TBM'lerdeki 340 PC için MS365 geçişi planlandı (Zimbra'da açık) |
| | 4. Türkkep Bulut uygulaması kapatıldı (güvenlik taşınmasına kadar) |
| | 5. e-Saklama uygulaması kapatıldı (kritik yazılım açıkları) |
| | 6. Soteryan ile PoC çalışması planlandı |
| | 7. DLP devreye alınacak |
| | 8. e-Saklama ve e-Defter kod güvenlik analizi yapıldı, açıklar tespit, kapatma çalışması başladı |
| | 9. Diğer ürünlerde güvenlik testi başlatılacak |
| | 10. TBM'ler için Surf ürünü PoC |
| | 11. İki personelin bilgisayarı karantinaya alındı (yurt dışı erişim tespiti) |
| | 12. Sızma testi kapsamı genişletildi (API erişimleri eklendi) |
| **20 Şubat 22:26** | **USOM'a bildirim yapıldı** — 15 dakikada işleme alındı |
| **20 Şubat 22:35** | USOM erişim engeli koydu, site üzerinden veriler görünmez oldu |
| **20 Şubat 22:49** | Veriler tekrar görünür oldu — ikinci USOM bildirimi yapıldı |
| **21 Şubat 10:43** | "En yoğun atak dün gece oldu — koruma sistemlerini aşamadılar" |
| **24 Şubat 10:43** | İlk ataksız gece — stabilizasyon başladı |
| **24 Şubat** | Takasbank API bağlantısı nedeniyle güvenlik sorusu geldi |
| **25 Şubat 12:01** | Karşı operasyon: türkkep.org sahte sitesi etkisiz hale getirildi |

### Faz 3: Adli İnceleme ve Dış İlişkiler (26 Şubat – Mart 2026)

| Tarih | Olay |
|---|---|
| **24/02 – 03/03** | CyberFirstAid dijital adli inceleme yürüttü |
| **26 Şubat** | SOCAR'dan "ACİL ve SÜRELİ: Veri İhlal Bildirimi" talebi geldi |
| **26 Şubat** | Sibel Aka yönlendirme istedi: "Socar'a daha önce etkilenen kullanıcı olmadığını bildirdik, tekrar rapor istiyorlar" |
| **2 Mart** | Sibel: "Teknik raporu bekliyorduk, firma yönetimi tekrar sormuş" |
| **3 Mart** | "Okan Bey ile görüşme sonrası Çarşamba günü sonrası verileceği iletildi" |
| **5 Mart** | CyberFirstAid dijital adli inceleme raporu tamamlandı — yol haritası önerisi sunuldu |
| **6 Mart** | CyberFirstAid 6 aylık danışmanlık yol haritası eklendi |
| **17 Mart 23:16** | **İkinci dalga saldırı**: 13 farklı kaynaktan atak — farklı ülkelerden |
| **17 Mart 23:27** | Saldırı kanalları kapatıldı, veri çıkışı gözlemlenmedi |
| **19 Mart** | Web sitesi farklı hosting sağlayıcısına taşınacak, CRM bağlantısı kesilecek |
| **19 Mart** | Bayram nöbet planı oluşturuldu |
| **26 Mart** | KVKK bilgi ve belge talebi şirkete ulaştı (Deniz Hatip bildirdi) |

---

## 3. Alınan Teknik Önlemler

### Acil Müdahale (İlk 72 saat)
1. Kriz komitesi ve WhatsApp savaş odası oluşturuldu (YK düzeyi)
2. Uyum ekibi devreye alındı — KVKK bildirim süreci başlatıldı
3. Platin SOC ekibi yüksek destek moduna geçti
4. İki personel bilgisayarı karantinaya alındı (yurt dışı erişim)
5. USOM'a bildirim yapıldı ve erişim engeli sağlandı
6. Avukat (Ali Gökhan Yıldırım) marka ihlali ve sözleşme değerlendirmesi için devreye alındı

### Kısa Vadeli Güçlendirme (1-4 hafta)
1. Platin ile SOC/SIEM kapsamı genişletildi, saldırı bloklaması etkinleştirildi
2. e-Saklama ve Türkkep Bulut uygulamaları güvenlik taşımasına kadar kapatıldı
3. DLP (Data Loss Prevention) ürünü devreye alınmaya başlandı
4. Kod güvenlik analizi (statik analiz) başlatıldı — Fortify ile açık tespit ve kapatma
5. Sızma testi kapsamı genişletildi — API erişimleri dahil edildi
6. SiberTürk adli analiz için ofiste çalışma başlattı
7. Zimbra'dan MS365'e geçiş planlandı (güvenlik açığı nedeniyle)
8. Web sitesi + CRM bağlantısı ayrıştırılacak, site ayrı hosting'e taşınacak

### Orta Vadeli Güçlendirme (1-6 ay)
1. CyberFirstAid 6 aylık siber güvenlik danışmanlık yol haritası alındı
2. FORTİNAC (NAC) lisansı aktif — ağ erişim kontrolü
3. Gebze veri merkezi firewall yenileme (80.000 USD bütçe ayrıldı)
4. Bitdefender Gravityzone lisansı aktif
5. Felaket kurtarma senaryoları güçlendirilecek (Ankara veri merkezi)
6. Bayram/tatil dönemleri için nöbet sistemi kuruldu

---

## 4. Müşteri İletişimi ve Dış Bildirimler

| Kurum | Durum |
|---|---|
| **USOM** | 20 Şubat'ta bildirildi — erişim engeli konuldu |
| **KVKK** | Bildirim hazırlığı başlatıldı (72 saat kuralı) |
| **BTK** | Bu doküman hazırlık amacıyla oluşturuldu |
| **SOCAR** | "Etkilenen kullanıcı bulunmamaktadır" yanıtı verildi; teknik rapor talep ettiler |
| **Takasbank** | API bağlantısı nedeniyle güvenlik sorusu geldi |
| **KVKK (26 Mart)** | Bilgi ve belge talebi ulaştı — değerlendirme aşamasında |
| **Müşteriler (genel)** | Bölge müdürleri grubu üzerinden farkındalık — bireysel bildirim durumu belirlenmeli |

---

## 5. Savunma Argümanları (BTK'ya Sunulmak Üzere)

### 5.1 Hızlı Tespit ve Müdahale
- Olay 10 Şubat'ta gerçekleşmiş, 15 Şubat sabahı tespit edilmiştir (5 gün içinde).
- Tespitten saatler içinde YK düzeyinde kriz ekibi kurulmuş, KVKK bildirim süreci başlatılmıştır.
- USOM'a bildirim yapılmış, erişim engeli sağlanmıştır.

### 5.2 Sınırlı Etki Alanı
- Veritabanlarına doğrudan erişim tespit edilmemiştir.
- Etkilenen veriler: müşteri e-posta, telefon ve son giriş tarihi — ödeme bilgisi, kimlik dokümanı veya KEP içeriği sızmamıştır.
- KEP hizmeti ve altyapısı doğrudan etkilenmemiştir.

### 5.3 Mevcut Güvenlik Yatırımları
- ISO 27001 sertifikasına sahip kurum
- SOC L1-L2 hizmeti (Platin Bilişim) + QRadar SIEM aktif
- NAC (FORTİNAC) ve Bitdefender Gravityzone koruma katmanları
- Periyodik sızma testleri (Lostar ile devam eden ilişki)
- DLP PoC ve devreye alma süreci olaydan önce planlanmıştı

### 5.4 Olaya Verilen Yanıtın Kapsamlılığı
- CyberFirstAid tarafından dijital adli inceleme yürütülmüştür
- Kod güvenlik analizi (Fortify) başlatılmıştır
- Etkilenen uygulamalar açıklar kapatılana kadar kapatılmıştır
- 6 aylık güçlendirme yol haritası alınmıştır
- 2026 BT bütçesinde güvenlik kalemlerine ~12M TL+ ayrılmıştır

### 5.5 İkinci Dalga Saldırıya Başarılı Müdahale
- 17 Mart'ta 13 farklı kaynaktan ikinci dalga saldırı gelmiş, saldırı kanalları kapatılmış, veri çıkışı gözlemlenmemiştir.
- Bu, alınan önlemlerin etkinliğini göstermektedir.

---

## 6. Açık Kalan Aksiyonlar

1. [ ] BTK'ya resmi savunma metninin gönderilmesi
2. [ ] KVKK bilgi ve belge talebine yanıt hazırlanması (26 Mart talebi)
3. [ ] SOCAR'a teknik rapor iletilmesi
4. [ ] Avukat ekibinden BTK savunma metni için hukuki görüş alınması
5. [ ] CyberFirstAid adli inceleme raporunun BTK'ya ek olarak sunulup sunulmayacağının kararı
6. [ ] Müşteri bilgilendirme politikasının belirlenmesi (bireysel bildirim gerekiyor mu?)
7. [ ] DLP tam devreye alma durumunun kontrolü
8. [ ] Web sitesi hosting taşıması durumu

---

## 7. Ekler

- CyberFirstAid Dijital Adli İnceleme Raporu (24/02–03/03/2026)
- CyberFirstAid 6 Aylık Yol Haritası (5 Mart 2026)
- 20 Şubat 2026 tarihli 12 maddelik iç durum raporu
- BT Giderler 2026 Özet tablosu (güvenlik yatırımları bölümü)
- KVKK Bilgi ve Belge Talebi (26 Mart 2026)

---

*Bu doküman TASLAK niteliğindedir. Avukat ekibi ve ilgili yönetimin incelemesi/onayı sonrası BTK'ya sunulacak nihai metne dönüştürülecektir.*

*Hazırlayan: OpenClaw AI Asistan (Ayhan Ağırgöl adına)*
*Tarih: 29 Mart 2026*
