# Türkkep Mailbox Taraması - Yapılacaklar & İş Durumu Raporu

Tarih: 2026-03-25 14:25 (GMT+3)
Kapsam: Son 10 günlük Türkkep mailbox taraması (özellikle 2026-03-16 → 2026-03-25)
Yöntem: Microsoft Graph üzerinden mailbox mesajları çekildi; gürültü oluşturan otomatik alarm/backup/qradar mailleri büyük ölçüde hariç tutularak konu, gönderen, tarih ve mail önizlemeleri üzerinden aksiyon çıkarıldı.

Not: Aşağıdaki maddeler yalnızca mailbox'ta görülen gerçek yazışmalara dayanır. Emin olunmayan yerde varsayım eklenmedi.

---

## Genel Durum Özeti

Son 10 günde mailbox'ta yüksek hacimli operasyon trafiği var. Aksiyon yoğunluğu özellikle şu başlıklarda toplanıyor:

- **AI / ürün / entegrasyon tarafı:** Orbina AI, Co-One, Callie, veri saklama altyapısı, CRM chatbot / doğal dilden SQL
- **Satış / iş ortaklığı tarafı:** Halkbank KEP canlıya geçiş, SMS hizmet sağlayıcı iş ortaklığı, CallTurk regülasyon uyum çözümü, TechSign toplantısı
- **Teknik / altyapı tarafı:** Netlore sızma testi, SQL upgrade ihtiyacı, vCenter log seviyesi, CRM'e düşmeyen başvurular için yeni mail adresi
- **Yönetim / karar tarafı:** Enlighty yıllık platform teklifi, Servicecore CI 2738 geliştirmesi, kamu toplantısı notları, Datassist süreci sahipliği

Aşağıda kategori bazlı yapılacaklar yer alıyor.

---

## 📋 Cevap Bekleyen Mailler

### 1) Orbina - Türkkep Mobil kaynak ihtiyacı
- **Kim:** Dilara Kaplan (orbina.ai)
- **Konu:** `Re: Türkkep Mobil - Kaynak İhtiyacı`
- **Ne istiyor:** Atanacak kişinin **tam olarak ne yapmasının beklendiğini** soruyor.
- **Son mail:** 2026-03-25 12:38 civarı
- **Durum:** Karşı taraf açıklama bekliyor.
- **Yapılacak:** Görev tanımı netleştirilmeli:
  - mobil tarafta beklenecek iş kalemleri
  - süre / kapasite
  - AI tarafında "doküman düzenleme / inceleme" beklentisinin sınırı

### 2) Netlore - sızma testi için firewall IP bilgisi
- **Kim:** Alkım Coşkun (netloresecurity.com)
- **Konu:** `RE: TÜRKKEP / Netlore - Sızma Testi Teknik Yazışmalar - 2026`
- **Ne istiyor:** Aynı akşam 23:00'te başlayacak test öncesi **firewall IP adres(ler)i** talep ediyor.
- **Son mail:** 2026-03-25 09:40 civarı
- **Durum:** Net dış cevap/aksiyon bekliyor.
- **Yapılacak:** Okan/Cemal hattında IP bilgisi iletilmeli veya güvenlik nedeniyle paylaşım yöntemi netleştirilmeli.

### 3) Callie - teklif ve soru-cevap seti sonrası iç değerlendirme bekleniyor
- **Kim:** Sırma Eren / İpek Tatar
- **Konu:** `Re: Türkkep - Callie online toplantı`
- **Ne geldi:** Güncel teklif + dakika fiyatı + önceki soruların cevapları paylaşıldı.
- **Son dış mail:** 2026-03-24 15:19 civarı
- **Durum:** Mail thread'de dış taraf topu Türkkep'e bırakmış görünüyor.
- **Yapılacak:**
  - teklifin iş/operasyon/teknik uygunluğu değerlendirilmeli
  - PoC için gönderilecek soru-cevap seti ve karşılama/sonlandırma mesajları netleştirilmeli
  - dil kapsamı (TR + EN + AR) maliyet etkisi karar altına alınmalı

### 4) CallTurk - erişim izin formları sonrası süreç takibi
- **Kim:** Murat Topçu (callturk.com.tr)
- **Konu:** `Re: CALLTURK - TÜRKKEP - e-İmza / KEP Entegre Regülasyon Uyum Çözümü`
- **Ne istiyor:** 23 Mart'ta iletilen erişim izin formlarının durumu soruluyor.
- **Son dış mail:** 2026-03-24 13:16 civarı
- **Durum:** Müşteri beklemede; içerde acil yönlendirme ihtiyacı doğmuş.
- **İç yazışma:** Zeliha Çolak 25 Mart'ta Hülya'dan müşteriyi hızlı arayacak bir ekip üyesi atamasını istiyor; İclal Dilercan destek verebileceğini iletiyor.
- **Yapılacak:**
  - müşteriye teknik/satış destek kişisi resmi olarak atanmalı
  - erişim izin formu durumu net cevaplanmalı
  - telefonla hızlı dönüş yapılmalı

### 5) Co-One - teklif dönüşü bekleniyor
- **Kim:** Gülsevim Dinler (co-one.co)
- **Konu:** `Re: Türkkep x Co-one: Sürecin Devamı Hk.`
- **Ne durumu var:** Aykut Bey 24 Mart'ta CRM veri şemasının gecikeceğini, buna karşılık **CRM dışındaki madde 3 ve 4 için teklif** istedi. Gülsevim Hanım 25 Mart'ta "çalışıp dönelim" dedi.
- **Durum:** Dış tarafta çalışma var; yakın takip gerekli.
- **Yapılacak:** Teklif gelmezse follow-up atılmalı.

### 6) SQL upgrade konusu - dış danışman teknik yön doğrulaması yaptı
- **Kim:** Ekrem Önsoy
- **Konu:** `Re: Sql Upgrade Hk.`
- **Ne dedi:** Test ortamı SQL Server 2019'a alınmalı; aksi halde test-canlı birebir yansımayabilir.
- **Son mail:** 2026-03-25 11:28 civarı
- **Durum:** Dış taraf teknik önerisini verdi; sıra iç planlamada.
- **Yapılacak:** Muratcan/Okan/Cemal tarafında upgrade planı, bakım penceresi ve risk değerlendirmesi oluşturulmalı.

### 7) Enlighty - revize teklif gelmiş, karar bekliyor
- **Kim:** Hülya Dündar (enlighty.ai)
- **Konu:** `Re: Türkkep & Enlighty Ai Yıllık Platform Tekliflendirme`
- **Ne durumu var:** Revize teklif iletilmiş; onay sonrası **3 Nisan Cuma** ilk çeyrek raporu paylaşılabilecek.
- **Durum:** İç karar bekleniyor.
- **Yapılacak:** kapsam/fiyat/değer analizi sonrası karar verilmesi gerekiyor.

---

## 🔧 Teknik Projeler / Açık Aksiyonlar

### A) Netlore sızma testi
**Durum özeti:**
- Sosyal mühendislik testi başlatılmış.
- DDoS testi için 24 Mart akşamı Okan Yıldırım tarafından onay verildi.
- 25 Mart sabahı Netlore aynı gece 23:00 başlangıç ve firewall IP bilgisi istedi.

**Açık aksiyonlar:**
- Firewall IP bilgisinin paylaşılması / güvenli kanalın belirlenmesi
- Test öncesi son koordinasyon
- Test sonrası raporun ve bulguların takibi

**Risk notu:** Zaman kritik; aynı gece test planı var.

### B) SQL Server sürüm uyumsuzluğu / upgrade ihtiyacı
**Mail bulgusu:**
- Muratcan Eğri, INVDB3402 canlı ortam ile SRVANKEFTEST test ortamı arasında **kritik sürüm uyumsuzluğu** tespit etti.
- Ekrem Önsoy, test ortamının SQL Server 2019'a yükseltilmesini uygun buluyor.

**Açık aksiyonlar:**
- canlı/test sürüm farkının resmi etkisini netleştir
- upgrade planı çıkar
- bakım zamanı belirle
- bağımlı uygulamalar/test senaryolarını listele

**Etkilediği alan:** Veritabanı test doğruluğu ve canlı öncesi güven.

### C) CRM chatbot / doğal dilden SQL / veri şeması
**Mail bulgusu:**
- Aykut Kutlusan, Co-One ile CRM veritabanı üzerinde doğal dilden SQL çalışacak AI ajanı görüşüyor.
- Cemal Doğan tüm DB erişimi yerine ihtiyaç duyulan tabloları açmayı tercih ediyor.
- Aykut Bey, tam DB erişimi değil ama **şema / tablo ilişkilerinin görülmesi** gerektiğini söylüyor.

**Açık aksiyonlar:**
- paylaşılabilir veri şeması kapsamı belirlenmeli
- güvenlik sınırları netleşmeli
- teklif hazırlanabilmesi için Co-One'a minimum teknik bilgi paketi verilmeli

**Yönetim notu:** Bu iş doğrudan ürün/AI yol haritasına bağlı; teknik güvenlik ve hız dengesi gerekiyor.

### D) SMS Hizmet Sağlayıcı iş ortaklığı entegrasyonu
**Mail bulgusu:**
- 23 Mart ve 25 Mart notlarında SMS hizmet sağlayıcı iş ortaklığı için süreçler toparlanıyor.
- 23 Mart'ta Cemal Doğan, **Türkkep web sitesi ile CRM arasındaki servis yöntemi kapatılıp mail yöntemine geçileceğini**, CRM tarafında ekstra kod çalışması yapılmayacağını yazıyor.
- 25 Mart toplantı notunda **Posta Güvercini ürününe KEP paketi eklenmesi**, başvuru linklerinin hazırlanması ve farklı iş ortaklığı akışları yer alıyor.

**Açık aksiyonlar:**
- başvuru/link akışı sonlandırılmalı
- CRM yerine mail tabanlı akış devreye alınmalıysa operasyon sahipliği netleştirilmeli
- iş ortaklığı sözleşme + entegrasyon + başvuru süreçleri birleştirilmeli

### E) Halkbank KEP canlıya geçiş hazırlığı
**Mail bulgusu:**
- Özlem Sarı'nın ilettiği maile göre, Halkbank müşteri KEP'leştirmesi projesinde sona gelinmiş durumda.
- Banka tarafı bilgiye göre **Nisan'ın 2. haftasında** tüm şubelerde eş zamanlı KEP adresi satışına başlanacak.

**Açık aksiyonlar:**
- Türkkep tarafındaki son hazırlık kontrol listesi çıkarılmalı
- operasyon/satış/destek hazır mı teyit edilmeli
- şube ölçeğinde eş zamanlı yük için kapasite kontrolü yapılmalı

**Risk notu:** Net tarih penceresi var; canlı hazırlık tamamlanmalı.

### F) REST servis sızma testi talebi (İNG Bank müşteri tarafı)
**Mail bulgusu:**
- Onur Kayıcı, İNG Bank müşterisinin entegrasyon suit KEP alım-gönderim servisleri için canlı öncesi sızma testi yapmak istediğini iletiyor.
- Okan Yıldırım 25 Mart'ta bunun gerekçesini ve taahhüt/OWASP tarafını sorguluyor.

**Açık aksiyonlar:**
- müşteri test kapsamı onaylanacak mı?
- test ortamı sınırları ve sorumluluklar netleşecek mi?
- sözleşmesel/güvenlik taahhütleri gözden geçirilmeli

### G) Veri saklama altyapısı görüşmesi
**Mail bulgusu:**
- 25 Mart'ta Ayhan Bey tarafından dış tarafa veri saklama altyapısı çözümü için toplantı talebi gönderildi.

**Açık aksiyonlar:**
- karşı taraf müsaitlik dönüşü beklenmeli
- toplantı öncesi ihtiyaç seti hazırlanmalı
- TransferChain benzeri yaklaşım mı, alternatif mimari mi bakılacağı netleştirilmeli

### H) vCenter log seviyesi
**Mail bulgusu:**
- Okan Yıldırım çok yüksek günlük log hacmi nedeniyle log seviyesinin `Information`dan `Warning`e çekilmesini istedi.
- Tan Kocabıyık bu değişikliğin yapıldığını doğruladı.

**Durum:** Tamamlanmış aksiyon.
**Takip:** Sonraki günlerde olay görünürlüğü düşüyor mu izlenmeli.

### I) CRM'e düşmeyen başvurular için mail adresi açılması
**Mail bulgusu:**
- Cemal Doğan, müşteri kayıtlarının CRM'e düşmediğini ve kod çalışması için mail adresi istedi.
- `isortagibasvuru@mailgw.turkkep.com.tr` açıldı; şifre Teams'ten iletildi.

**Durum:** Teknik ön koşul tamam.
**Takip:** CRM tarafındaki kod/entegrasyon çalışması yapıldı mı ayrıca izlenmeli.

---

## 🤝 İş Geliştirme / Toplantı / Görüşme Gerektiren Konular

### 1) TechSign toplantısı organize edildi
- **Durum:** 1 Nisan 2026 11:00-12:00 toplantı daveti kabul edilmiş görünüyor.
- **Katılım:** Mehmet Nuri Aybayar kabul etmiş; Aykut Kutlusan ve Zeliha Çolak tarafında da kabul var.
- **Yapılacak:** Toplantı öncesi amaç/çıktı listesi hazırlanmalı.

### 2) Orbina AI çözümleri görüşmesi
- **Durum:** 25 Mart 16:30-17:30 slotunda IDP PoC, kapalı çevrim ChatGPT gösterimi ve diğer çözüm önerileri başlıkları konuşulacak şekilde planlama var.
- **Yapılacak:**
  - IDP PoC beklentileri netleştirilmeli
  - GM personeli için kapalı çevrim ChatGPT kullanım senaryosu somutlaştırılmalı
  - mobil kaynak ihtiyacı sorusuna net cevap hazırlanmalı

### 3) Callie çağrı merkezi AI / PoC
- **Durum:** NDA akışı tamamlanmış, güncel teklif gelmiş, dakika fiyatı paylaşılmış.
- **Yapılacak:**
  - PoC veri seti hazırlanmalı
  - kullanım senaryoları (ürün/hizmet vs destek) netleştirilmeli
  - çok dil maliyeti değerlendirmesi yapılmalı

### 4) Co-One
- **Durum:** CRM chatbot / sales AI agent / çağrı merkezi performans ölçümü başlıkları canlı.
- **Yapılacak:**
  - CRM dışı madde 3-4 için teklif bekleniyor
  - veri şeması paylaşımı için iç karar gerekli

### 5) CallTurk regülasyon uyum çözümü
- **Durum:** müşteri tarafı süreç takibinde; içerde hızlı assign ihtiyacı ortaya çıkmış.
- **Yapılacak:**
  - müşteri ilişkisi sıcak tutulmalı
  - teknik destek kişisi atanmalı
  - erişim izin süreci kapatılmalı

### 6) Kamu görüşmesi / yatırımcı tarafı notlar
- **Mail:** `24 Mart Kamu Toplantısı Görüşme Notları`
- **Katılımcılar arasında:** Pelin Karamış, Büşra Altunay ve Türkkep yöneticileri geçiyor.
- **Durum:** Toplantı notları yorum/eğerlendirme için dağıtılmış.
- **Yapılacak:** Yönetim ekibi notları gözden geçirip ekleme/yorum yapmalı.

### 7) Veri saklama altyapısı
- **Durum:** Yeni potansiyel teknoloji görüşmesi başlatıldı.
- **Yapılacak:** toplantı tarihi gelince teknik değerlendirme seti hazırlanmalı.

---

## ⚠️ Risk / Acil / Deadline Olan Maddeler

### 1) Netlore testi - çok yakın zamanlı
- Aynı gün gece testi başlıyor bilgisi var.
- Firewall IP paylaşımı veya test koordinasyonu gecikirse süreç aksar.

### 2) Halkbank KEP canlı geçişi - Nisan 2. hafta hedefi
- Şube bazlı eş zamanlı satış planı verildi.
- Operasyonel hazırlık eksikse canlıda sorun çıkabilir.

### 3) SQL test-canlı sürüm uyumsuzluğu
- Test sonuçlarının canlıyı doğru temsil etmeme riski var.
- Özellikle DB değişikliği/upgrade planı gecikirse teknik borç büyür.

### 4) CallTurk müşteri beklemesi
- 23 Mart formları sonrası müşteri 24 Mart'ta takip etti.
- İçerde "acil destek verecek kişi" arayışı var; gecikme ticari riske dönebilir.

### 5) Callie teklif kararı / PoC hazırlığı
- Teklif geldi; ama iç değerlendirme uzarsa momentum kaybolabilir.

### 6) Enlighty teklifi
- Onay sonrası ilk teslim tarihi 3 Nisan olarak ifade edilmiş.
- Karar gecikirse ilk çeyrek rapor başlangıcı kayabilir.

### 7) CRM veri şeması paylaşımı
- Teknik güvenlik hassasiyeti ile AI proje hızı arasında tıkanma riski var.
- Sahiplik ve kapsam netleşmezse Co-One işi sürüncemede kalabilir.

---

## 📊 Yönetimsel Karar Gerektiren Konular

### 1) Co-One ile hangi kapsamda ilerlenmeli?
Karar noktaları:
- CRM veritabanı şeması ne seviyede paylaşılacak?
- Öncelik CRM chatbot mu, sales AI agent mı, çağrı merkezi analitiği mi?
- Güvenlik sınırı nasıl çizilecek?

### 2) Callie için PoC + teklif kabul seviyesi
Karar noktaları:
- PoC'ye hangi kapsamla girilecek?
- Çok dilli kurgu gerekli mi?
- Dakika bazlı maliyet kabul edilebilir mi?

### 3) Enlighty yıllık platform teklifi
Karar noktaları:
- Kapsam/fiyat uygun mu?
- Doğrudan rakip + e-dönüşüm oyuncuları kapsamı yeterli mi?
- 2026 boyunca çeyreklik rapor modeli onaylanacak mı?

### 4) Halkbank projesi için canlı öncesi yönetim checkpoint'i
Karar noktaları:
- Kurum içi son sorumluluk matrisi tamam mı?
- Destek/satış/operasyon ölçeklenmesi hazır mı?

### 5) SQL upgrade önceliği
Karar noktaları:
- Test ortamı SQL 2019 upgrade ne zaman yapılacak?
- Bu iş acil operasyon planına alınacak mı?

### 6) Servicecore CI 2738 geliştirmesi
- Aykut Bey 17 Mart ve 24 Mart'ta ilerleme sordu.
- Dış taraftan görünür bir ilerleme cevabı mailbox'ta yok.
- Yönetim tarafında takip/escalation gerektirebilir.

### 7) Datassist süreci sahipliği
- Kemal Gür aksiyon yöntemi öneriyor.
- Cemal Doğan sürecin baştan hatalı ilerlediğini, sonradan dahil olmasının doğru olmayacağını söylüyor; Aykut Bey uygun görürse Kemal'in yürütmesini belirtiyor.
- Bu, açık sahiplik / yönetişim kararı gerektiriyor.

---

## Proje Bazlı Durum Özeti

## 1) Orbina AI entegrasyonu
- 25 Mart toplantı gündeminde IDP PoC + kapalı çevrim ChatGPT gösterimi var.
- Ayrıca mobil tarafta kaynak ihtiyacı için Orbina'dan kişi talep edildi.
- Şu an açık nokta: istenen kaynağın görev tanımı net değil.

**Durum:** Aktif, ama kapsam netleştirme gerekiyor.

## 2) Halkbank KEP
- Canlıya alım yaklaşmış durumda.
- Nisan 2. hafta tüm şubelerde satış hedefi var.

**Durum:** Kritik canlı öncesi hazırlık fazı.

## 3) TransferChain / veri saklama altyapısı
- Doğrudan "TransferChain" isimli mail görmedim; fakat **veri saklama altyapısı çözümü** için 25 Mart'ta yeni dış görüşme başlatılmış.

**Durum:** Keşif / değerlendirme fazı.

## 4) SMS hizmet sağlayıcı projesi
- İş ortaklığı modeli ilerliyor.
- Posta Güvercini + KEP paketi, başvuru linkleri, entegrasyon süreçleri ve CRM yerine mail akışı öne çıkıyor.

**Durum:** Aktif operasyonel tasarım / entegrasyon fazı.

## 5) Netlore sızma testi
- Sosyal mühendislik testi yürümüş.
- DDoS testi için 25 Mart gecesi pencere açılmış.

**Durum:** Aktif ve zaman kritik.

## 6) Callie çağrı merkezi AI
- NDA tamam, güncel teklif geldi, PoC bilgi seti hazırlanması bekleniyor.

**Durum:** Teklif + PoC tasarım aşaması.

## 7) Service Core ITIL / Servicecore
- Çok sayıda görev/istek ataması var; bunların çoğu operasyonel routing.
- Ancak **CI 2738 geliştirme çalışması** ayrıca takip edilen bir geliştirme işi ve durum yanıtı görünmüyor.

**Durum:** Operasyonel kullanım aktif; geliştirme işinde durum belirsiz.

## 8) PostgreSQL / MySQL / SQL bakım
- PostgreSQL/MySQL bakım-destek sözleşmesi imzalanmış görünüyor.
- SQL Server tarafında ayrıca sürüm uyumsuzluğu ve upgrade ihtiyacı doğmuş.

**Durum:** Danışmanlık hattı açılmış; iç teknik iş listesi büyüyor.

## 9) SugarCRM / CRM genel
- CRM veritabanı şeması üzerinden AI kullanım senaryosu hazırlanıyor.
- Bazı kayıtların CRM'e düşmemesi nedeniyle mail tabanlı yeni akış açılmış.

**Durum:** Hem ürün geliştirme hem operasyonel tamir modunda.

---

## 2026-04-03 Sabah Güncellemesi (08:30)

### 🔴 Kritik / Yeni Aksiyonlar

#### BUGÜN 14:30 — Patika.dev Claude Code Eğitmen Tanışması 🔴
- **Kimler:** Tolga Yüce (Patika.dev), Pınar Karabakla, Aykut Kutlusan, Ayhan Ağırgöl
- **Platform:** Google Meet
- **Yapılacak:** Toplantıya hazır olunmalı; Claude Code eğitim kapsamı ve müfredat konuşulacak

#### Yeni GMY — Erçin Tunca Türerer (Satış/Pazarlama) 🟢✨
- **Tarih:** 2 Nisan 2026
- **İçerik:** Satış, Pazarlama Bölümüne Genel Müdür Yardımcısı olarak katıldı
- **Yapılacak:** Tanışma/onboarding; iş geliştirme hattında yeni koordinasyon noktası

#### TÜBİSAD Güven Çalıştayı — Bilgilendirme Notu Hazır 🟢
- **Gönderen:** Büşra Altunay (02.04 15:36)
- **İçerik:** EIDAS kapsamında atılacak adımlara altyapı oluşturacak bilgilendirme notu ekte
- **Yapılacak:** Not incelenmeli, çalıştaya katkı planlanmalı

#### MS SQL Veritabanı Ayrıştırma Projesi — İPTAL KARARI ✅
- **Gönderen:** Zeynep Oran → Ayhan onayladı (02.04)
- **İçerik:** Melikşah Bey'in teknik/operasyonel değerlendirmesi sonucu yüksek efor/düşük fayda; proje iptal
- **Koşul:** Ayhan belirli şartların takibini rica etti
- **Durum:** Kapatıldı (koşullu)

#### Orbina — Fatih Kıyıkçı Toplantı Planlaması 🟡
- **Konu:** Bilgi talebi — Elvan Hanım ile toplantı
- **Tarih:** Pazartesi 10:30-14:30 arası uygun
- **Yapılacak:** Toplantı saati netleştirilmeli

#### FortiNAC Sorunu — F1 Teknoloji ile Çalışma Planlanıyor 🟡
- **Gönderen:** Okan Yıldırım (02.04 19:36)
- **İçerik:** 9 Mart'tan beri sorun devam ediyor; belgelendirme denetimi nedeniyle gecikti; F1 Teknoloji (Kemal/Ferhat Bey) ile çalışma planlanıyor
- **Yapılacak:** Takip — ne zaman başlıyor?

#### HSBC TPSA Denetim Bulgusu — Kapanış Belirsiz 🟡
- **Gönderen:** Okan Yıldırım (02.04 19:31)
- **İçerik:** Son toplantıda ekran görüntüleriyle kapanacağı söylenmişti; Okan yarın HSBC'den Nurgül ve Özlem Hanım'ı arayacak
- **Yapılacak:** Okan'ın dönüşü beklenmeli

#### Patch Deployment — KÖTÜLEŞME ⚠️🔴
- **03.04 00:16 raporu:** 75 makine / 7 tamamlandı / **16 başarısız / 45 eksik yama / 7 devam ediyor**
- **Trend:** 2 Nisan: 24 başarısız → 3 Nisan: 16 başarısız (iyileşme) AMA eksik yama 37→45 (kötüleşme)
- **Yapılacak:** BT ekibi acil müdahale; FortiNAC + Microsoft Update Service sorunuyla bağlantılı olabilir

#### DLP Yavaşlık — SearchInform Debug Modu 🟡
- **Gönderen:** Emre Cicek (SearchInform) → Okan (02.04 13:20) [HIGH importance]
- **İçerik:** Debug modunu aktif edip kullanıcıdan sorunu tekrar etmesi istenmeli
- **Yapılacak:** Okan'ın uygulaması beklenmeli

#### IIS Log Path Düzeltme — Okan Erişim Yetkisi İstiyor 🟡
- **Gönderen:** Okan Yıldırım (02.04 14:42)
- **İçerik:** 7 sunucuya lokal admin yetkisi gerekiyor; SIEM log gelmiyor
- **Yapılacak:** Change talebi 56 açık; yetki verilmeli

#### AI İş Geliştirme Firması — Toplantı Organizasyonu 🟢
- **Gönderen:** Ayhan → Aykut (02.04 19:42)
- **İçerik:** Hüseyin Bey önerisiyle AI iş geliştirme firması ile tanışma toplantısı; Dilek Hanım'da detay var
- **Yapılacak:** Aykut/Dilek koordinasyonu bekleniyor

#### TechSign Toplantısı Sonrası — Aksiyon Planı Soruldu 🟡
- **Gönderen:** Ayhan → Aykut (02.04 19:23)
- **İçerik:** 1 Nisan TechSign toplantısı sonrası aksiyon planı istendi
- **Yapılacak:** Aykut'tan dönüş bekleniyor

#### İki Yaka Yazılım — İşbirliği Toplantısı 🟢
- **Gönderen:** Aykut Kutlusan (02.04 13:57)
- **İçerik:** Teams toplantı daveti
- **Yapılacak:** Toplantı detayları değerlendirilmeli

#### Ayyıldız Telco — Fiyat Onayı 🟢
- **Gönderen:** Dilek Akyürek (02.04 12:34)
- **İçerik:** 100K indirimli fiyat önerisi — dün aynı büyüklükte firma kabul etti
- **Yapılacak:** Zeliha süreci ilerletiyor

#### AİDEA Pro — NDA İmzalandı ✅🟢
- **Gönderen:** Ebru Zeybek (02.04 12:30)
- **İçerik:** İmzalı NDA + sirküler ekte; teklif aşamasına geçilecek

#### İş Teklifi — İbrahim Bey'e Gönderildi ✅
- **Gönderen:** Elif Nur Üçeyler (02.04 15:36)
- **İçerik:** İbrahim Bey'e iş teklifi gönderildi

#### BT Altyapı Müdürü Görev Tanımı — Güncelleme İstendi 🟢
- **Gönderen:** Ayhan → Elif Nur (02.04 18:44)
- **İçerik:** İşe alım ve risk yönetimi maddelerinin eklenmesi istendi

#### Medya Takip — 03.04 Günlük Rapor 📰
- **Gönderen:** MTM (03.04 04:07)
- **Durum:** Okunmamış — sabah kontrol edilmeli

---

## 2026-04-02 Sabah Güncellemesi (08:30)

### 🔴 Kritik / Yeni Aksiyonlar

#### Enlighty YK Onayı Alındı — Sözleşme Sürecine Geçildi ✅🔴
- **Durum:** Aykut Bey 1 Nisan'da Hülya Hanım'a YK onayı geldiğini iletti, sözleşme taslağı istedi
- **Yapılacak:** Sözleşme taslağı bekleniyor; geldikçe hukuk/yönetim incelemeli

#### Co-One Guardrail Servisi — Detay Toplantısı Bekleniyor 🟡
- **Durum:** Aykut Bey Gülsevim Hanım'dan Guardrail Servisi hakkında doküman veya toplantı istedi (1 Nisan)
- **Yapılacak:** Karşı taraf dönüşü bekleniyor; Co-One tarafından takip edilmeli

#### Orbina — n8n Streaming Entegrasyonu Onaylandı 🟢
- **Durum:** Onur Cünedioğlu (Orbina), n8n streaming entegrasyonunun mümkün olduğunu ve Fatih Bey ile ilerlenebileceğini yazdı (02.04 00:32)
- **Yapılacak:** Aykut / Fatih Bey arasında koordinasyon; widget güncelleme detayları netleşmeli

#### Orbina — Chatbot Mobil İmza Yanıtı 🟢
- **Durum:** Onur Cünedioğlu "mobil imza" gibi belirsiz sorgularda direkt cevap yerine kullanıcıdan ek bilgi istenmesi gerektiğini açıkladı (02.04 00:14)
- **Yapılacak:** Chatbot prompt/UX stratejisi bu bulgu doğrultusunda revize edilmeli

#### NPM Güvenlik Riski — SOME DUYURUSU DY-26040113001 🟡
- **Gönderen:** Okan Yıldırım (01.04 13:07)
- **İçerik:** Belirli NPM paketlerinde güvenlik açığı; domain/IP erişimi yok ama IOC'lar Bitdefender'a girildi; Otomatik Update kapatılıp kontrollü yapılması öneriliyor
- **Yapılacak:** Geliştirici ekip 3 paket adını kontrol etmeli; bağımlılık listesi gözden geçirilmeli

#### Gold Mesaj — e-İmza Entegrasyonu Ürün Tanımı 🟡
- **Gönderen:** Zeliha Çolak → Dilek Akyürek (01.04 14:05)
- **İçerik:** Gold Mesaj firması için e-imza entegrasyonu ürün tanımı yapılması gerekiyor
- **Yapılacak:** Dilek Akyürek ürün tanımı için aksiyona geçmeli

#### IDDA — Türkkep e-Highway Toplantısı 🟢
- **Gönderen:** Zeliha Çolak (01.04 13:24)
- **İçerik:** IDDA (Azerbaycan) ile e-Highway toplantısı; Pelin Karamış da dahil
- **Yapılacak:** Toplantı gündem ve hazırlığı; IDDA ile uluslararası iş geliştirme sinyali

#### AİDEA Pro — Gizlilik Sözleşmesi İmzalandı → Teklif Geliyor 🟢
- **Gönderen:** Ebru Zeybek (aideapro.ai) → Sibel (01.04 13:25)
- **İçerik:** NDA tamamlanmış; teklif gönderilecek
- **Yapılacak:** Teklif geldikten sonra değerlendirme yapılmalı

#### Ekran SYSTEM — Lisans 30.12.2025'te Sona Erdi ⚠️
- **Gönderen:** Okan Yıldırım → Melikşah (01.04 15:15)
- **İçerik:** Kullanıcı yönetim/izleme uygulamasının lisansı bitmiş; neden yenilenmedi soruluyor
- **Yapılacak:** Melikşah Canol lisans yenileme durumunu açıklamalı; acil ise yenilenmeli

#### GitLab Hesap Talebi — DevOps 🟢
- ServiceCore 4335 numaralı görev: GitLab hesap talebi gruba atıldı (01.04 15:32)

#### Patch Deployment — 24 Başarısız, 37 Yama Eksik (devam ediyor) 🟡
- Sabah 08:14 raporunda: 74 makine / 10 tamamlandı / **24 başarısız / 37 eksik** (dün geceden artış)
- **Yapılacak:** BT ekibi başarısız cihazları belirleyip manuel müdahale yapmalı; Microsoft Update Service sorunuyla bağlantılı olabilir (Melikşah 01.04'te bildirdi)

---

## 2026-04-01 Sabah Güncellemesi (08:30)

### 🔴 Kritik / Yeni Aksiyonlar

#### TÜBİSAD Çalıştay — Güven Servisleri Görüş Talebi 🔴
- **Gönderen:** Hüseyin Karayağız → Ayhan Ağırgöl, Aykut, Hülya, Büşra, Faruk, Murat Bey'e iletildi
- **Konu:** TÜBİSAD yönetiminde "Güven Servisleri" konulu çalıştay planlanıyor; TÜRKKEP'ten görüş ve yönlendirme bekleniyor
- **Pelin Karamış** ekledi: "Dilek'i de ekleyelim ltf"
- **Durum:** OKUNMADI — Hüseyin Bey bizzat Ayhan'a iletmiş; yanıt ve katkı bekliyor
- **Yapılacak:** Güven Servisleri çalıştayı için görüş/yorum hazırlanmalı, Dilek dahil edilmeli

#### Trellix Product Grant Letter — Yüksek Öncelik 🔴
- **Gönderen:** grant@orders.trellix.com [HIGH importance]
- **Konu:** Product Grant Letter 18002698 Final — Account 2530691, PO: 260331_FIELD_TURKKEP
- **Durum:** OKUNMADI — Ürün lisansı grant'ı finalize olmuş görünüyor
- **Yapılacak:** Grant detayları incelenmeli, gerekli onay/kayıt işlemi yapılmalı

#### KEP Assist Yavaşlık — Yarın 15:00 Toplantısı 🟡
- **Aykut Kutlusan** — Onur Bey ile değerlendirme toplantısı: **2 Nisan Perşembe 15:00**
- **Durum:** Toplantı onaylandı; Ayhan'ın katılması/hazırlık yapması gerekebilir

#### YZ Destekli Belge ve Yazışma Sistemi Projesi 🟡
- **Aykut Kutlusan** → Ayhan Bey ve Oğuz Bey'e iletti
- Ürün Yönetimi 19 Şubat'ta PYO'ya teslim ettiği gereksinim dokümanı üzerinden **gelecek hafta toplantı** planlanıyor
- **Yapılacak:** Dokümanı incelemek, toplantıya hazır olmak

#### Patika.dev AI Eğitim Teklifi 🟡
- Aykut Bey, Patika.dev'den "YZ Destekli Uygulama Geliştirme" eğitimi için teklif aldı
- **Oğuz Göven** inceleyecek; eğitmen ve müfredat (MCP vurgulu) uygun görünüyor
- **Yapılacak:** Oğuz'un geri bildirimi bekleniyor; uygunsa eğitmenle tanışma toplantısı

#### Patch Deployment Raporu — 24 Başarısız, 34 Eksik Yama 🟡
- **Rapor:** 74 bilgisayar / 9 tamamlandı / **24 başarısız / 34 yama eksik / 7 devam ediyor**
- **Güvenlik riski:** Eksik yamalar kritik güvenlik açığı yaratabilir
- **Yapılacak:** BT ekibi (Cemal/Melikşah) başarısız cihazları belirlemelidir

#### SQL Orphaned Users + 924GB Kullanılmayan Tablolar 🟡
- **invdb3402:** 9 orphaned DB kullanıcısı tespit edildi
- 924.43 GB kullanılmayan tablolar bulundu (186 günlük istatistik)
- **Yapılacak:** DB temizleme planı yapılmalı; sahipsiz kullanıcılar kaldırılmalı

#### turkkep.com.tr Server Taşıma Teklifi 🟢
- Özge Erkan, Turhost'tan gelen server taşıma teklifini Tan Bey'e iletti
- Emre Bey'in uyarısı: hizmet desteği riski var
- **Yapılacak:** Tan Bey teklife bakacak; değerlendirme bekliyor

#### İntranet İçerik Süreci 🟢
- Özge Erkan, YK toplantısı sonrası Tan ve Emre'ye yöneldi
- İntranet için içerik ihtiyacının netleştirilmesi gerekiyor

#### BT Altyapı Uzman Yardımcısı Adayları — Melikşah Dönmedi 🟢
- Elif Nur Üçeyler 3 ayrı hatırlatma maili gönderdi (gece yarısı!)
- **Melikşah Canol** aday hakkında Elif Nur'a dönmedi
- **Yapılacak:** Cemal Bey veya Melikşah adaylar hakkında Elif Nur'a dönmeli

---

## Önceliklendirilmiş Yapılacaklar Listesi

## P0 — 31 Mart Salı (BUGÜN) — Kritik
0a. **e-Defter Planlı Bakım** — bugün (31.03) saat XX:XX'de bakım var; müşteri iletişim hazırlığı yapıldı mı?
0b. **1 Nisan YK toplantısı hazırlığı** — AI ürün stratejisi sunumu hazır mı? (Aykut birebir görüşmeleri tamamladı mı?)
0c. **TechSign toplantısı (1 Nisan 11:00)** — gündem ve çıktı listesi hazırlandı mı?
0d. **Orbina yeni teklifi değerlendir** — Dilara Kaplan 30 Mart 12:32'de iki aşamalı teklif gönderdi
0e. **Co-One On-Premise Guardrail Servisi teklifi incele** — Gülsevim Dinler 30 Mart 15:54'te yeni teklif gönderdi
0f. **BTK savunma metni** — Ayhan 30 Mart 13:48'de doküman hazırladı; dağıtım ve son kontrol yapıldı mı?

## P1 — Bu hafta
1. **YENİ KEPHS BAŞVURUSU takibi** — E-güven'in BTK'ya yeni KEPHS lisansı başvurusu. Hüseyin "bize yarar ama pazarı büyütmez" diyor. Sektör etkisi değerlendirilmeli.
2. **Enlighty teklifine evet/hayır/revizyon kararı ver** — 3 Nisan deadline
3. **Halkbank canlı geçiş — son hazırlık checkpoint** — Nisan 2. hafta hedefi yaklaşıyor
4. **eMarka e-İmza NDA** — Zeliha / Serkan Başoğlu thread'i aktif; sonraki adım netleşmeli
5. **Corvass Telekom e-İmza Entegrasyonu** — IP formu geldi; entegrasyon süreci başlatılıyor
6. **Sahara Telekom e-İmza Entegrasyonu** — IP formu iletildi; takip gerekli
7. **SQL 2019 upgrade planlama** — envanter hazırlandı mı?
8. **TLS 8 Nisan geçişi** — etkilenen bağımlılıklar kontrol edildi mi?
9. **PostgreSQL/MySQL Kick-Off** — Emre katılamayacak; toplantı koordinasyonu hazır mı?

## P2 — Bu hafta / devam
10. **Orbina mobil kaynak görev tanımı** — yeni teklif bağlamında netleşmeli
11. **Co-One veri şeması paylaşım sınırı** — on-premise guardrail teklifiyle birlikte değerlendir
12. **Callie teklifini değerlendir; PoC kapsamını yazılı hale getir**
13. **IDENFIT ve CERTI POC follow-up**
14. **Servicecore CI 2738 durumu sor**

## P3 — Yönetim / stratejik takip
15. **Kıbrıs ziyaret notları** — Pelin "eksiksiz bilgilendirme" dedi; aksiyon maddesi var mı?
16. **Datassist sürecinde sahipliği resmileştir**
17. **CRM AI güvenlik sınırı + veri erişim modeli kararı**
18. **Enlighty 3 Nisan deadline**
19. **İş teklifi — Serhat Çelik (Yazılım Geliştirme Uzman Yardımcısı)** — Elif Nur 30 Mart'ta Ayhan'a iletti; karar bekleniyor

---

## 2026-03-30 Sabah Güncellemesi

### Son 24 saat mailbox taraması
Pazar günü olması nedeniyle düşük iş trafiği. Anlamlı sinyaller:

#### 🔴 YK Toplantısı - Salı öğleden sonra (1 Nisan)
- **Hüseyin Karayağız** (YK Başkanı): "Bu Salı öğleden sonra YK yapacağız gibi gözüküyor" dedi.
- **Konu:** TÜRKKEP AI Ürün Grupları 2026-2029 stratejisi
- **Aykut Kutlusan** detaylı hazırlık maili göndermiş: ETCBase toplantısı sonrası iş bölümleriyle birebir AI ihtiyaç görüşmeleri yapılıyor, Teknoloji Çözüm Merkezi, Satış/Pazarlama vb. birimlerden talepler toplanıyor.
- **Yapılacak:** Salı YK öncesi AI ürün/uygulama ihtiyaç özeti hazır olmalı.

#### 🟡 Platin SOC - Medium Severity Incident #79033
- UDP scan sinyali gelmiş. Kontrol edilmeli.

#### 🟡 Kıbrıs Ziyaret Notları
- **Murat Faruk Öztürk** detaylı Kıbrıs ziyaret notlarını paylaştı: KKTC Dijital Devlet Kurumu Başkanlığı temasları, Mesut Ener ile görüşme.
- **Dilek Akyürek** ile birlikte hazırlanmış.
- İş geliştirme / kamu tarafında değerlendirilmeli.

#### 🟡 Ayyıldız Telco teklifi
- **Zeliha Çolak**: Firmanın önceliği Entegrasyon Suite konumlandırması; daha önce Burcu/Emre ile süreç ilerlememiş.
- **Dilek Akyürek**: OK vermiş.

#### 🟢 İK - BT Altyapı Uzman Yardımcısı
- Elif Nur Üçeyler iki ayrı aday CV'si iletti Cemal Bey'e.

#### 🟢 Ar-Ge Danışmanlık Bedeli
- Aykut Kutlusan, 2026 danışmanlık hizmet bedeli yazışmasını (Focus Consulting, 27.500 TL + KDV Ar-Ge kısmı) Ayhan Bey'e iletti.

#### ⚠️ GİB KDV Oran Kontrolü ERTELENDİ
- 27 Mart GİB duyurusu: 1 Nisan'da devreye alınacak KDV oran kontrolü **ertelendi**.
- Müşteri iletişim/destek planları revize edilmeli.

### Güncel öncelik sırası
1. **Salı YK toplantısı hazırlığı - AI ürün stratejisi**
2. **GİB KDV oran kontrolü ertelenmesi - iç/dış iletişim**
3. **Platin SOC UDP scan incident kontrolü**
4. **Kıbrıs ziyaret notları değerlendirmesi**
5. **Ayyıldız Telco - Entegrasyon Suite süreci**
6. **Halkbank canlı geçiş hazırlığı (devam)**
7. **Enlighty teklif onayı (3 Nisan deadline)**

---

## 2026-03-31 Sabah Güncellemesi (08:30)

### Son 24 saatte tespit edilen yeni sinyaller

#### 🔴 YK & Stratejik
- **YENİ KEPHS BAŞVURUSU** — E-güven/Dilek tarafı BTK'ya yeni KEPHS lisansı başvurusunda bulunmuş. Murat Faruk bildirdi. Hüseyin "en çok bize yarar ama pazarı büyütmez" dedi. Pelin: "Teşekkürler Faruk." **→ Sektör rakip analizi yapılmalı.**
- **Kıbrıs ziyaret notları** — Pelin "Eksiksiz bilgilendirme; tek ilavem yeminler mevzuatı..." dedi. Thread kapatılıyor gibi ama YK toplantısında konuşulması bekleniyor.

#### 🔴 Teklifler / Acil
- **Orbina yeni teklif (30.03 12:32)** — Dilara Kaplan iki aşamalı teklif iletti. **Okunmamış.** Yanıt bekleniyor.
- **Co-One On-Premise Guardrail Servisi teklifi (30.03 15:54)** — Gülsevim Dinler yeni teklif gönderdi. CRM dışı madde 3-4 kapsamında büyük ihtimalle. **Okundu; aksiyon yok.**

#### 🟡 Operasyonel
- **e-Defter bakım (31.03.2026 Salı)** — Ürün yönetimi dün 15:26'da çalışanları uyardı. Bakım bugün! Müşteri bildirimi yapıldı mı kontrol edilmeli.
- **BTK savunma metni** — Ayhan 30 Mart 13:48'de dağıttı; takip/onay gerekiyor.
- **Aykut — Haftalık Uzaktan Çalışma Planlaması** — PYO ekibi için dönüşümlü uzaktan çalışma önerisi Sibel/Cemal'e iletildi. İç karar bekleniyor.
- **PostgreSQL/MySQL Kick-Off toplantısı** — Emre katılamayacak; Sinan ve ekip hazır olacak.

#### 🟢 e-İmza entegrasyon akışları (rutin ilerliyor)
- **Corvass Telekom** — IP erişim formu iletildi (Suat Akdumanlar, GM). Süreç ilerliyor.
- **Sahara Telekom** — IP formu geldi; işleme alınıyor.
- **eMarka** — NDA thread'i aktif; Serkan Başoğlu dönüş yaptı.
- **Bölgesel_Satış Teams ekibi** — Meliksah Canol yeni üyeler ekledi.

#### 🟢 İK
- **Serhat Çelik — Yazılım Geliştirme Uzman Yardımcısı** — Elif Nur teklif için Ayhan'ın onayını bekliyor. **Okunmamış.**

---

## Sabah Güncellemesi (26 Mart 08:30)

### 🔴 Netlore DDoS/Sızma Testi - HÂLÂ BEKLEMEDE
- Alkım Coşkun 25 Mart 09:40'tan beri firewall IP/adreslerini bekliyor
- DDoS testi 27 Mart Cuma 23:00'e alındı (Okan Bey ile telefon sonrası)
- **Durum:** Dış cevap hâlâ yok - bugün kesinlikle dönülmeli

### 🟡 Orbina Mobil Kaynak - Görev Tanımı Bekleniyor
- Dilara Kaplan net görev tanımı bekliyor (mobil tarafta ne yapacak kişi?)
- **Durum:** Açık

### ✅ CallTurk - İyileşme
- İclal Dilercan müşteriyle görüşüp ilk soruları yanıtlamış
- Dünkü kadar kritik değil ama takip sürmeli

---

## Ek Görevler

### Türkkep 18. Kat Kira Bilgisi
- 18. kat için ne kadar kira ödendiği öğrenilecek
- Muhasebe / Mali İşler tarafından sorulacak (Murat Özturk veya Elif Nur)
- Kaynak: mailbox'ta bilgi yok, doğrudan sorulması gerekiyor

---

## Kısa Sonuç

Türkkep mailbox'ta son 10 günde en kritik açık alanlar şunlar:
- **Netlore sızma testi koordinasyonu**
- **Halkbank canlı hazırlığı**
- **SQL sürüm uyumsuzluğu ve upgrade ihtiyacı**
- **CallTurk müşteri beklemesi**
- **Orbina / Co-One / Callie ekseninde AI proje kapsamlarının netleştirilmesi**

Özellikle teknik ve ticari konular aynı anda akıyor; bu yüzden en çok fayda sağlayacak şey, bu başlıkları **tek bir yönetim takip ekranına** dönüştürmek olur.

---

## 2026-03-26 Sabah Güncellemesi

### Son 24 saatte teyit edilen hareketler
- **Netlore / DDoS testi:** Alkım Coşkun, 25 Mart 09:40 mailinde test öncesi **firewall IP adreslerini** tekrar istedi. 25 Mart 16:59'da Okan Yıldırım aynı thread'de Cuma akşamı bilgilendirme yapılacağını yazmış; ancak mailbox görünümünde firewall IP bilgisinin dışarı iletildiği net görünmüyor.
- **CallTurk:** Dünkü "müşteri bekliyor / kim atanacak?" riski kısmen kapandı. İclal Dilercan müşteriyle telefon görüşmesi yapıp ilk soruları yanıtladığını, ek ihtiyaç olursa destek vereceğini yazdı.
- **Orbina mobil kaynak:** Dilara Kaplan hâlâ atanacak kişinin tam olarak ne yapacağını soruyor. Konu açık.
- **Destek Portal 2.2:** Ürün yönetimi, 24 Mart canlı geçişinin tamamlandığını duyurdu; e-belge süreçlerinde iyileştirme sinyali var.
- **Güvenlik/operasyon gürültüsü:** QRadar lockout alarmları ve firewall configuration change mailleri devam ediyor; ayrı bir alarm hijyeni konusu olarak izlenmeli.

### Revize öncelik sırası
1. **Netlore firewall IP / test koordinasyon kapanışı**
2. **Orbina'ya görev tanımı dönüşü**
3. **Halkbank canlı öncesi hazırlık checkpoint'i**
4. **SQL 2019 upgrade planı**
5. **CallTurk'te ilk görüşme sonrası yazılı kapanış / sahiplik netliği**

---

## 2026-03-27 Sabah Güncellemesi

### Son 24 saatte çıkan yeni anlamlı aksiyonlar
- **Halkbank Kep'leştirme Projesi:** Aykut Kutlusan, banka tarafına başvuru alındığını ancak **Türkkep tarafındaki ilerleme statülerinin bankaya iletilemediğini** yazdı. Ayrıca prod ortamda Halkbank'ın verdiği endpoint'e erişim sorunu ihtimali inceleniyor. Aynı gün 16:00 civarı bireysel + kurumsal hesap açılışı gösterimi planlandı. **Durum: kritik entegrasyon açığı / canlı öncesi risk.**
- **SRVANKEFTEST SQL Server 2019 geçişi:** Muratcan Eğri, test ortamının SQL Server 2014'ten 2019'a yükseltilmesi için uygulama/veritabanı envanteri istedi. Kullanılmayan ve sahipsiz DB'lerin ayrıştırılması talep edildi. **Durum: aktif teknik hazırlık.**
- **KVKK bilgi ve belge talebi:** Talha Deniz Hatip, KVKK'dan gelen dosyayı iç ekiplere iletti. **Durum: resmi yanıt hazırlığı gerektirebilir.**
- **Enlighty revize teklifi:** Hülya Dündar, 4. kapsamı düşük doğruluk nedeniyle dışarıda bırakarak onay sonrası **3 Nisan 2026** teslimi tekrar teyit etti. **Durum: iç onay bekliyor.**
- **CERTI / Makers-Edge POC:** Bora Tosun, ücretli POC kararı için follow-up yaptı; Aykut onay süreci işletildiğini yazdı. **Durum: karar bekliyor.**
- **IDENFIT:** Zeynep Oran, 17 Mart toplantısı sonrası POC + teklif paketi için karşı taraftan dönüş istedi. **Durum: follow-up açık.**
- **Orbina / n8n / mobil chatbot:** Aykut, self-hosted n8n hazırlığının yapıldığını; Türkkep Mobil için ayrı workflow + stream yaklaşımının değerlendirildiğini yazdı. **Durum: teknik kurulum ve kapsam netleşmesi sürüyor.**
- **TLS güvenlik geçiş tarihi revizesi:** Sibel Aka üzerinden yayılan iç duyuruda geçiş tarihi **8 Nisan** olarak paylaşıldı. Etkilenen entegrasyon ve sertifika bağımlılıkları için kontrol gerekebilir.

### Güncel öncelik sırası
1. **Halkbank prod endpoint / statü iletim sorununun kapanışı**
2. **KVKK bilgi-belge talebinin sahipliği ve son tarihinin netleştirilmesi**
3. **SQL 2019 geçiş envanterinin toplanması**
4. **Enlighty teklif onayı (3 Nisan deadline)**
5. **IDENFIT ve CERTI POC karar/follow-up hattı**
6. **Orbina mobil workflow + n8n self-hosted kurulum planı**
7. **TLS 8 Nisan geçiş etkilerinin teknik check'i**
