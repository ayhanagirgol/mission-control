# Türkkep Mailbox Taraması — Yapılacaklar & İş Durumu Raporu

Tarih: 2026-03-25 14:25 (GMT+3)
Kapsam: Son 10 günlük Türkkep mailbox taraması (özellikle 2026-03-16 → 2026-03-25)
Yöntem: Microsoft Graph üzerinden mailbox mesajları çekildi; gürültü oluşturan otomatik alarm/backup/qradar mailleri büyük ölçüde hariç tutularak konu, gönderen, tarih ve mail önizlemeleri üzerinden aksiyon çıkarıldı.

Not: Aşağıdaki maddeler yalnızca mailbox’ta görülen gerçek yazışmalara dayanır. Emin olunmayan yerde varsayım eklenmedi.

---

## Genel Durum Özeti

Son 10 günde mailbox’ta yüksek hacimli operasyon trafiği var. Aksiyon yoğunluğu özellikle şu başlıklarda toplanıyor:

- **AI / ürün / entegrasyon tarafı:** Orbina AI, Co-One, Callie, veri saklama altyapısı, CRM chatbot / doğal dilden SQL
- **Satış / iş ortaklığı tarafı:** Halkbank KEP canlıya geçiş, SMS hizmet sağlayıcı iş ortaklığı, CallTurk regülasyon uyum çözümü, TechSign toplantısı
- **Teknik / altyapı tarafı:** Netlore sızma testi, SQL upgrade ihtiyacı, vCenter log seviyesi, CRM’e düşmeyen başvurular için yeni mail adresi
- **Yönetim / karar tarafı:** Enlighty yıllık platform teklifi, Servicecore CI 2738 geliştirmesi, kamu toplantısı notları, Datassist süreci sahipliği

Aşağıda kategori bazlı yapılacaklar yer alıyor.

---

## 📋 Cevap Bekleyen Mailler

### 1) Orbina — Türkkep Mobil kaynak ihtiyacı
- **Kim:** Dilara Kaplan (orbina.ai)
- **Konu:** `Re: Türkkep Mobil — Kaynak İhtiyacı`
- **Ne istiyor:** Atanacak kişinin **tam olarak ne yapmasının beklendiğini** soruyor.
- **Son mail:** 2026-03-25 12:38 civarı
- **Durum:** Karşı taraf açıklama bekliyor.
- **Yapılacak:** Görev tanımı netleştirilmeli:
  - mobil tarafta beklenecek iş kalemleri
  - süre / kapasite
  - AI tarafında “doküman düzenleme / inceleme” beklentisinin sınırı

### 2) Netlore — sızma testi için firewall IP bilgisi
- **Kim:** Alkım Coşkun (netloresecurity.com)
- **Konu:** `RE: TÜRKKEP / Netlore - Sızma Testi Teknik Yazışmalar - 2026`
- **Ne istiyor:** Aynı akşam 23:00’te başlayacak test öncesi **firewall IP adres(ler)i** talep ediyor.
- **Son mail:** 2026-03-25 09:40 civarı
- **Durum:** Net dış cevap/aksiyon bekliyor.
- **Yapılacak:** Okan/Cemal hattında IP bilgisi iletilmeli veya güvenlik nedeniyle paylaşım yöntemi netleştirilmeli.

### 3) Callie — teklif ve soru-cevap seti sonrası iç değerlendirme bekleniyor
- **Kim:** Sırma Eren / İpek Tatar
- **Konu:** `Re: Türkkep - Callie online toplantı`
- **Ne geldi:** Güncel teklif + dakika fiyatı + önceki soruların cevapları paylaşıldı.
- **Son dış mail:** 2026-03-24 15:19 civarı
- **Durum:** Mail thread’de dış taraf topu Türkkep’e bırakmış görünüyor.
- **Yapılacak:**
  - teklifin iş/operasyon/teknik uygunluğu değerlendirilmeli
  - PoC için gönderilecek soru-cevap seti ve karşılama/sonlandırma mesajları netleştirilmeli
  - dil kapsamı (TR + EN + AR) maliyet etkisi karar altına alınmalı

### 4) CallTurk — erişim izin formları sonrası süreç takibi
- **Kim:** Murat Topçu (callturk.com.tr)
- **Konu:** `Re: CALLTURK - TÜRKKEP – e-İmza / KEP Entegre Regülasyon Uyum Çözümü`
- **Ne istiyor:** 23 Mart’ta iletilen erişim izin formlarının durumu soruluyor.
- **Son dış mail:** 2026-03-24 13:16 civarı
- **Durum:** Müşteri beklemede; içerde acil yönlendirme ihtiyacı doğmuş.
- **İç yazışma:** Zeliha Çolak 25 Mart’ta Hülya’dan müşteriyi hızlı arayacak bir ekip üyesi atamasını istiyor; İclal Dilercan destek verebileceğini iletiyor.
- **Yapılacak:**
  - müşteriye teknik/satış destek kişisi resmi olarak atanmalı
  - erişim izin formu durumu net cevaplanmalı
  - telefonla hızlı dönüş yapılmalı

### 5) Co-One — teklif dönüşü bekleniyor
- **Kim:** Gülsevim Dinler (co-one.co)
- **Konu:** `Re: Türkkep x Co-one: Sürecin Devamı Hk.`
- **Ne durumu var:** Aykut Bey 24 Mart’ta CRM veri şemasının gecikeceğini, buna karşılık **CRM dışındaki madde 3 ve 4 için teklif** istedi. Gülsevim Hanım 25 Mart’ta “çalışıp dönelim” dedi.
- **Durum:** Dış tarafta çalışma var; yakın takip gerekli.
- **Yapılacak:** Teklif gelmezse follow-up atılmalı.

### 6) SQL upgrade konusu — dış danışman teknik yön doğrulaması yaptı
- **Kim:** Ekrem Önsoy
- **Konu:** `Re: Sql Upgrade Hk.`
- **Ne dedi:** Test ortamı SQL Server 2019’a alınmalı; aksi halde test-canlı birebir yansımayabilir.
- **Son mail:** 2026-03-25 11:28 civarı
- **Durum:** Dış taraf teknik önerisini verdi; sıra iç planlamada.
- **Yapılacak:** Muratcan/Okan/Cemal tarafında upgrade planı, bakım penceresi ve risk değerlendirmesi oluşturulmalı.

### 7) Enlighty — revize teklif gelmiş, karar bekliyor
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
- Ekrem Önsoy, test ortamının SQL Server 2019’a yükseltilmesini uygun buluyor.

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
- teklif hazırlanabilmesi için Co-One’a minimum teknik bilgi paketi verilmeli

**Yönetim notu:** Bu iş doğrudan ürün/AI yol haritasına bağlı; teknik güvenlik ve hız dengesi gerekiyor.

### D) SMS Hizmet Sağlayıcı iş ortaklığı entegrasyonu
**Mail bulgusu:**
- 23 Mart ve 25 Mart notlarında SMS hizmet sağlayıcı iş ortaklığı için süreçler toparlanıyor.
- 23 Mart’ta Cemal Doğan, **Türkkep web sitesi ile CRM arasındaki servis yöntemi kapatılıp mail yöntemine geçileceğini**, CRM tarafında ekstra kod çalışması yapılmayacağını yazıyor.
- 25 Mart toplantı notunda **Posta Güvercini ürününe KEP paketi eklenmesi**, başvuru linklerinin hazırlanması ve farklı iş ortaklığı akışları yer alıyor.

**Açık aksiyonlar:**
- başvuru/link akışı sonlandırılmalı
- CRM yerine mail tabanlı akış devreye alınmalıysa operasyon sahipliği netleştirilmeli
- iş ortaklığı sözleşme + entegrasyon + başvuru süreçleri birleştirilmeli

### E) Halkbank KEP canlıya geçiş hazırlığı
**Mail bulgusu:**
- Özlem Sarı’nın ilettiği maile göre, Halkbank müşteri KEP’leştirmesi projesinde sona gelinmiş durumda.
- Banka tarafı bilgiye göre **Nisan’ın 2. haftasında** tüm şubelerde eş zamanlı KEP adresi satışına başlanacak.

**Açık aksiyonlar:**
- Türkkep tarafındaki son hazırlık kontrol listesi çıkarılmalı
- operasyon/satış/destek hazır mı teyit edilmeli
- şube ölçeğinde eş zamanlı yük için kapasite kontrolü yapılmalı

**Risk notu:** Net tarih penceresi var; canlı hazırlık tamamlanmalı.

### F) REST servis sızma testi talebi (İNG Bank müşteri tarafı)
**Mail bulgusu:**
- Onur Kayıcı, İNG Bank müşterisinin entegrasyon suit KEP alım-gönderim servisleri için canlı öncesi sızma testi yapmak istediğini iletiyor.
- Okan Yıldırım 25 Mart’ta bunun gerekçesini ve taahhüt/OWASP tarafını sorguluyor.

**Açık aksiyonlar:**
- müşteri test kapsamı onaylanacak mı?
- test ortamı sınırları ve sorumluluklar netleşecek mi?
- sözleşmesel/güvenlik taahhütleri gözden geçirilmeli

### G) Veri saklama altyapısı görüşmesi
**Mail bulgusu:**
- 25 Mart’ta Ayhan Bey tarafından dış tarafa veri saklama altyapısı çözümü için toplantı talebi gönderildi.

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

### I) CRM’e düşmeyen başvurular için mail adresi açılması
**Mail bulgusu:**
- Cemal Doğan, müşteri kayıtlarının CRM’e düşmediğini ve kod çalışması için mail adresi istedi.
- `isortagibasvuru@mailgw.turkkep.com.tr` açıldı; şifre Teams’ten iletildi.

**Durum:** Teknik ön koşul tamam.
**Takip:** CRM tarafındaki kod/entegrasyon çalışması yapıldı mı ayrıca izlenmeli.

---

## 🤝 İş Geliştirme / Toplantı / Görüşme Gerektiren Konular

### 1) TechSign toplantısı organize edildi
- **Durum:** 1 Nisan 2026 11:00–12:00 toplantı daveti kabul edilmiş görünüyor.
- **Katılım:** Mehmet Nuri Aybayar kabul etmiş; Aykut Kutlusan ve Zeliha Çolak tarafında da kabul var.
- **Yapılacak:** Toplantı öncesi amaç/çıktı listesi hazırlanmalı.

### 2) Orbina AI çözümleri görüşmesi
- **Durum:** 25 Mart 16:30–17:30 slotunda IDP PoC, kapalı çevrim ChatGPT gösterimi ve diğer çözüm önerileri başlıkları konuşulacak şekilde planlama var.
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

### 1) Netlore testi — çok yakın zamanlı
- Aynı gün gece testi başlıyor bilgisi var.
- Firewall IP paylaşımı veya test koordinasyonu gecikirse süreç aksar.

### 2) Halkbank KEP canlı geçişi — Nisan 2. hafta hedefi
- Şube bazlı eş zamanlı satış planı verildi.
- Operasyonel hazırlık eksikse canlıda sorun çıkabilir.

### 3) SQL test-canlı sürüm uyumsuzluğu
- Test sonuçlarının canlıyı doğru temsil etmeme riski var.
- Özellikle DB değişikliği/upgrade planı gecikirse teknik borç büyür.

### 4) CallTurk müşteri beklemesi
- 23 Mart formları sonrası müşteri 24 Mart’ta takip etti.
- İçerde “acil destek verecek kişi” arayışı var; gecikme ticari riske dönebilir.

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
- PoC’ye hangi kapsamla girilecek?
- Çok dilli kurgu gerekli mi?
- Dakika bazlı maliyet kabul edilebilir mi?

### 3) Enlighty yıllık platform teklifi
Karar noktaları:
- Kapsam/fiyat uygun mu?
- Doğrudan rakip + e-dönüşüm oyuncuları kapsamı yeterli mi?
- 2026 boyunca çeyreklik rapor modeli onaylanacak mı?

### 4) Halkbank projesi için canlı öncesi yönetim checkpoint’i
Karar noktaları:
- Kurum içi son sorumluluk matrisi tamam mı?
- Destek/satış/operasyon ölçeklenmesi hazır mı?

### 5) SQL upgrade önceliği
Karar noktaları:
- Test ortamı SQL 2019 upgrade ne zaman yapılacak?
- Bu iş acil operasyon planına alınacak mı?

### 6) Servicecore CI 2738 geliştirmesi
- Aykut Bey 17 Mart ve 24 Mart’ta ilerleme sordu.
- Dış taraftan görünür bir ilerleme cevabı mailbox’ta yok.
- Yönetim tarafında takip/escalation gerektirebilir.

### 7) Datassist süreci sahipliği
- Kemal Gür aksiyon yöntemi öneriyor.
- Cemal Doğan sürecin baştan hatalı ilerlediğini, sonradan dahil olmasının doğru olmayacağını söylüyor; Aykut Bey uygun görürse Kemal’in yürütmesini belirtiyor.
- Bu, açık sahiplik / yönetişim kararı gerektiriyor.

---

## Proje Bazlı Durum Özeti

## 1) Orbina AI entegrasyonu
- 25 Mart toplantı gündeminde IDP PoC + kapalı çevrim ChatGPT gösterimi var.
- Ayrıca mobil tarafta kaynak ihtiyacı için Orbina’dan kişi talep edildi.
- Şu an açık nokta: istenen kaynağın görev tanımı net değil.

**Durum:** Aktif, ama kapsam netleştirme gerekiyor.

## 2) Halkbank KEP
- Canlıya alım yaklaşmış durumda.
- Nisan 2. hafta tüm şubelerde satış hedefi var.

**Durum:** Kritik canlı öncesi hazırlık fazı.

## 3) TransferChain / veri saklama altyapısı
- Doğrudan “TransferChain” isimli mail görmedim; fakat **veri saklama altyapısı çözümü** için 25 Mart’ta yeni dış görüşme başlatılmış.

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
- Bazı kayıtların CRM’e düşmemesi nedeniyle mail tabanlı yeni akış açılmış.

**Durum:** Hem ürün geliştirme hem operasyonel tamir modunda.

---

## Önceliklendirilmiş Yapılacaklar Listesi

## P1 — Bugün / çok kısa vadede
1. **Netlore’a firewall IP / test koordinasyon cevabı ver**
2. **Orbina’ya mobil kaynak için net görev tanımı dön**
3. **CallTurk müşterisine resmi destek kişisi ata ve erişim formlarının durumunu paylaş**
4. **Halkbank canlıya geçiş için son hazırlık checkpoint toplantısı planla**
5. **SQL upgrade için iç teknik karar toplantısı aç**

## P2 — Bu hafta
6. **Callie teklifini değerlendir; PoC kapsamını yazılı hale getir**
7. **Co-One için veri şeması paylaşım sınırını belirle**
8. **Enlighty teklifine evet/hayır/revizyon kararı ver**
9. **Servicecore CI 2738 geliştirmesi için net durum / ETA iste**
10. **SMS hizmet sağlayıcı akışında mail tabanlı yeni süreci uçtan uca sahipliklerle netleştir**

## P3 — Yönetim / stratejik takip
11. **Kamu toplantısı notlarını yönetimsel aksiyon maddelerine çevir**
12. **Datassist sürecinde sahipliği resmileştir**
13. **Veri saklama altyapısı görüşmesini teknik keşif oturumuna çevir**
14. **CRM AI / chatbot projesi için güvenlik sınırı + veri erişim modeli kararını çıkar**

---

## Kısa Sonuç

Türkkep mailbox’ta son 10 günde en kritik açık alanlar şunlar:
- **Netlore sızma testi koordinasyonu**
- **Halkbank canlı hazırlığı**
- **SQL sürüm uyumsuzluğu ve upgrade ihtiyacı**
- **CallTurk müşteri beklemesi**
- **Orbina / Co-One / Callie ekseninde AI proje kapsamlarının netleştirilmesi**

Özellikle teknik ve ticari konular aynı anda akıyor; bu yüzden en çok fayda sağlayacak şey, bu başlıkları **tek bir yönetim takip ekranına** dönüştürmek olur.
