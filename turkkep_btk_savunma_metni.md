# TÜRKKEP A.Ş. — BTK'YA SUNULACAK RESMİ SAVUNMA METNİ

## TASLAK — Avukat ve Yönetim Onayı Gereklidir

---

**Bilgi Teknolojileri ve İletişim Kurumu (BTK)**
Bilgi Güvenliği Dairesi Başkanlığı'na

**Konu:** Şubat 2026 Tarihinde Yaşanan Veri Güvenliği Olayına İlişkin Bilgi ve Savunma Metni

---

## 1. GİRİŞ VE ŞİRKET TANITIMI

Türkkep Kayıtlı Elektronik Posta Hizmetleri A.Ş. (bundan böyle "Türkkep" olarak anılacaktır), Bilgi Teknolojileri ve İletişim Kurumu tarafından yetkilendirilmiş Kayıtlı Elektronik Posta (KEP) hizmet sağlayıcısı olarak faaliyetlerini sürdürmekte olup bu alandaki kritik konumu ve hizmet yükümlülüklerinin bilincindedir.

Şirketimiz, faaliyetleri boyunca yürürlükteki mevzuata uyum, veri güvenliği ve hizmet sürekliliği konularını en öncelikli kurumsal hedefler arasında değerlendirmiş; bu doğrultuda ISO 27001 Bilgi Güvenliği Yönetim Sistemi sertifikasını almış, sürekli iyileştirme anlayışıyla kapsamlı güvenlik yatırımları gerçekleştirmiştir.

İşbu savunma metni; Şubat 2026 tarihi itibarıyla sistemlerimizde tespit edilen yetkisiz erişim olayını tüm boyutlarıyla açıklamak, olaya verilen kurumsal yanıtı belgelemek, sınırlı etki kapsamını ortaya koymak ve olay sonrasında alınan güçlendirme tedbirlerini Sayın Kurumun bilgisine sunmak amacıyla hazırlanmıştır.

---

## 2. OLAYIN TESPİTİ VE İLK MÜDAHALENİN SEYRI

### 2.1 İlk Tespit

Şirketimizin güvenlik izleme mekanizmaları ve 7/24 SOC (Güvenlik Operasyon Merkezi) hizmeti çerçevesinde, 15 Şubat 2026 tarihinde saat 06:00 civarında bir güvenlik bildirimi alınmıştır. Gerçekleştirilen ilk teknik analizler; sızmanın tahminen 10 Şubat 2026 tarihinde, destek portal uygulamasını kullanan bir kullanıcının bilgisayarı üzerinden gerçekleştirildiğine işaret etmiştir. Şüpheli işlemde doğrudan veritabanı erişimi gözlemlenmemiş; saldırı vektörünün, kullanıcı kimlik bilgilerinin ele geçirilmesi ya da söz konusu bilgisayardan yetkisiz sorgu atılması yoluyla veri elde edilmesi şeklinde gerçekleştiği teknik olarak tespit edilmiştir.

### 2.2 Kriz Komitesinin Kurulması

Tespit anından itibaren saatler içinde yönetim kurulu düzeyinde bir kriz komitesi oluşturulmuş ve tüm bileşenler tek bir koordinasyon hattında toplanmıştır. Bilgi güvenliği, BT altyapısı, hukuki danışmanlık ve uyum ekipleri eş zamanlı olarak krize dahil edilmiştir. Uyum biriminin sürece katılımıyla birlikte 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun öngördüğü 72 saatlik bildirim yükümlülüğü kapsamındaki hazırlık süreci de derhal başlatılmıştır.

15 Şubat saat 18:38'de gerçekleştirilen ileri teknik analizler sonucunda sızma ihtimali olan veriler net biçimde belirlenmiştir: e-Defter ve e-Saklama hizmetlerine ait müşteri e-posta adresleri, telefon numaraları ve sisteme son giriş tarihleri içeren iki adet Excel dosyası. Bu tespiti müteakip, uyum ekibinin koordinasyonuyla kişisel veri ihlali bildirim sürecine ilişkin hazırlık çalışmaları hızlandırılmıştır.

### 2.3 Hukuki Sürecin Başlatılması

16 Şubat 2026 akşamı, kötü niyetli aktörlerin "türkkep" ibaresi içeren sahte alan adları üzerinden ele geçirilen verileri yayımlama tehdidinde bulunduğu öğrenilmiştir. Bu gelişme üzerine kurumun hukuki danışmanı derhal sürece dahil edilmiş; sahte alan adlarına ilişkin marka ihlali hukuku ve sözleşmeden doğan hukuki haklar kapsamında değerlendirme yapılmıştır.

### 2.4 USOM'a Bildirim

20 Şubat 2026 tarihinde Ulusal Siber Olaylara Müdahale Merkezi'ne (USOM) resmi bildirim gerçekleştirilmiş; söz konusu bildirim 15 dakika içinde işleme alınarak saldırganların verileri barındırdığı siteye erişim engeli uygulanmıştır. Erişimin tekrar görünür hale gelmesi üzerine ikinci bir bildirim yapılmış ve süreç kesintisiz izlenmiştir.

---

## 3. ALINAN TEKNİK VE ORGANİZASYONEL ÖNLEMLER

### 3.1 Acil Müdahale Önlemleri (İlk 72 Saat)

Tespitin ardından gecikmeksizin hayata geçirilen acil önlemler şu şekilde özetlenebilir:

Kriz yönetimi açısından yönetim kurulu düzeyinde koordinasyon sağlanmış, uyum birimi KVKK bildirimi için harekete geçirilmiş, hukuki danışman ve marka vekili sürece dahil edilmiştir. Teknik müdahale kapsamında Platin Bilişim bünyesindeki SOC (Güvenlik Operasyon Merkezi) ekibi yüksek destek moduna geçirilmiş ve saldırılar kanalında blokaj uygulanmıştır. Yurt dışına yönelik şüpheli erişimler tespit edilen iki çalışanın bilgisayarı derhal karantinaya alınmış, adı geçen çalışanlara yeni cihazlar tahsis edilmiştir. Saldırı yüzeyi azaltma tedbirleri çerçevesinde e-Saklama uygulaması kritik yazılım açıkları kapatılana dek, Türkkep Bulut uygulaması ise güvenli altyapıya taşınana kadar geçici olarak devre dışı bırakılmıştır.

### 3.2 Kısa Vadeli Güçlendirme Çalışmaları (İlk 4 Hafta)

İlk müdahalenin akabinde yürütülen sistematik güçlendirme sürecinde şu adımlar atılmıştır:

SOC ve SIEM kapsamı genişletilerek saldırıların algılanması ve engellenmesi mekanizmaları güçlendirilmiş; 21 Şubat gecesi yaşanan en yoğun DDoS saldırısı koruma sistemleri aşılamadan savuşturulmuştur. Kod güvenliği analizi kapsamında e-Saklama ve e-Defter ürünleri Fortify aracıyla statik analize tabi tutulmuş, tespit edilen açıkların giderilmesine yönelik yazılım geliştirme çalışmaları başlatılmıştır. Sızma testi kapsamı genişletilerek API erişimleri de teste dahil edilmiştir. DLP (Veri Kaybı Önleme) çözümünün devreye alınması için teknik hazırlık süreci başlatılmıştır. Adres sahteciliği (e-posta spoofing) saldırısı tespit edilmiş ve gerekli e-posta güvenlik politikaları devreye alınmıştır. 25 Şubat 2026 itibarıyla sahte türkkep.org alan adı etkisiz hâle getirilmiş ve tehdit vektörü bu yönüyle bertaraf edilmiştir.

### 3.3 Orta Vadeli Güçlendirme Çalışmaları (1–6 Ay)

Uzun vadeli güvenlik yol haritası kapsamında şu tedbirler kararlaştırılmış ve uygulamaya konulmuştur:

CyberFirstAid Siber Güvenlik firması tarafından 24 Şubat – 3 Mart 2026 tarihleri arasında kapsamlı dijital adli inceleme gerçekleştirilmiş; 5 Mart 2026 tarihinde adli inceleme raporu tamamlanmış, 6 aylık siber güvenlik güçlendirme yol haritası şirketimize sunulmuştur. Gebze veri merkezi firewall yenileme projesi için 80.000 USD bütçe ayrılmıştır. FORTİNAC (Ağ Erişim Kontrolü) ve Bitdefender Gravityzone güvenlik katmanları aktif tutulmakta olup kullanımları sürdürülmektedir. 2026 BT bütçesinde güvenlik kalemlerine yaklaşık 12 milyon TL ve üzeri ödenek tahsis edilmiştir. Web sitesi ayrı bir hosting sağlayıcısına taşınarak CRM bağlantısı devre dışı bırakılmış; bu sayede web sitesi üzerinden gerçekleştirilecek saldırıların iç sistemlere yönelme riski elimine edilmiştir. Bayram ve uzun tatil dönemlerine özgü nöbet planı oluşturularak teknik ekip hazır bulundurulmuştur.

---

## 4. ETKİ ANALİZİ VE SINIRLI KAPSAM DEĞERLENDİRMESİ

Yaşanan olayın kapsamı ve etkisi dikkatli biçimde değerlendirilmiş olup aşağıdaki bulgular belgelenmiştir:

**Etkilenen veriler:** Yalnızca e-Defter ve e-Saklama müşterilerine ait e-posta adresleri, telefon numaraları ve sisteme son giriş tarihleri söz konusudur. Bu veriler iki adet Excel dosyası biçiminde sızdırılmıştır.

**Veritabanına doğrudan erişim tespit edilmemiştir:** Teknik adli inceleme ve SOC log analizleri, saldırganların veritabanı altyapısına doğrudan erişim sağladığına dair herhangi bir bulguya ulaşamamıştır.

**KEP içeriği ve hizmet altyapısı etkilenmemiştir:** Kayıtlı Elektronik Posta içerikleri, KEP gönderim/alım altyapısı ve buna ilişkin tüm şifreli iletişim kayıtları bu olaydan tamamen bağımsız kalmıştır. Şirketimizin temel hizmet işlevi hiçbir aşamada kesintiye uğramamıştır.

**Ödeme bilgisi veya kimlik belgesi sızmamıştır:** Olayın kapsamı kesinlikle finansal veri, kimlik belgesi ya da sözleşme içeriğini kapsamamaktadır.

**SOCAR başta olmak üzere iş ortaklarına iletilen yanıt:** Kritik iş ortaklarının güvenlik bilgilendirme talepleri incelenmiş; e-posta ve telefon verilerinin ötesine geçen herhangi bir kurumsal bilgi ihlaline ilişkin bulguya ulaşılmamıştır.

Bu kapsamlı değerlendirmeler ışığında olayın, KEP hizmet altyapısına ve müşterilerin iletişim içeriklerine yönelik değil; yalnızca destek portalı katmanında sınırlı müşteri iletişim bilgilerini hedef alan daraltılmış bir siber saldırı niteliği taşıdığı anlaşılmaktadır.

---

## 5. MEVCUT GÜVENLİK YATIRIMLARI VE KURUMSAL HAZIRLIK

Şirketimizin olaydan önce ve olay sürecinde sahip olduğu güvenlik altyapısı, kurumsal hazırlık düzeyini teyit etmektedir:

**ISO 27001 Sertifikasyonu:** Şirketimiz, uluslararası Bilgi Güvenliği Yönetim Sistemi standardı olan ISO 27001 kapsamında sertifikalandırılmış olup yönetim, süreç ve teknik kontroller bu standarda uygun biçimde işletilmektedir.

**7/24 SOC Hizmeti ve QRadar SIEM:** Platin Bilişim ortaklığıyla yürütülen L1–L2 SOC hizmeti, QRadar tabanlı güvenlik bilgi ve olay yönetimi ile sürekli tehdit izleme kapasitesi sağlanmaktadır. Nitekim en yoğun DDoS atağının gerçekleştiği 20–21 Şubat 2026 gecesi, sistemler hiçbir müdahale imkânı tanınmadan saldırıları savuşturmuştur.

**Ağ Erişim Kontrolü (NAC) ve Uç Nokta Koruması:** FORTİNAC ürünü ağ erişim denetimi için aktif olarak kullanılmakta; Bitdefender Gravityzone ile uç nokta güvenliği sağlanmaktadır.

**Periyodik Sızma Testleri:** Lostar ile sürdürülen iş ilişkisi kapsamında düzenli sızma testleri gerçekleştirilmekte; bu olay sürecinde test kapsamı API erişimlerini de kapsayacak biçimde genişletilmiştir.

**Güvenlik Bütçesi:** 2026 yılı BT bütçesinde güvenlik yatırımlarına yaklaşık 12 milyon TL ve üzerinde kaynak ayrılmış olup Gebze veri merkezi firewall yenileme projesi bu kalemde yer almaktadır.

Tüm bu yatırımların olayın tespit ve müdahale sürecinde somut katkı sağladığı değerlendirilmektedir. Saldırı tespiti ve USOM bildirimi beş gün içinde, yönetim kurulu düzeyinde koordinasyonun kurulması ise saatler içinde gerçekleştirilmiştir.

---

## 6. İKİNCİ DALGA SALDIRIYA BAŞARILI MÜDAHALE: ÖNLEMLERİN ETKİNLİĞİNİN KANITI

17 Mart 2026 tarihinde saat 23:16 itibarıyla 13 farklı ülkeden eş zamanlı bir ikinci dalga saldırı tespit edilmiştir. Güvenlik ekibine anında bildirim yapılmış; koruma sistemleri devreye girerek saldırı kanalları kısa sürede kapatılmıştır. Gerçekleştirilen log ve trafik analizleri, bu saldırı dalgasında herhangi bir veri çıkışı yaşanmadığını teyit etmiştir.

Bu gelişme, Şubat ayı olay müdahalesi sonrasında alınan kapsamlı güvenlik tedbirlerinin etkinliğini bağımsız biçimde kanıtlamaktadır. Birinci olaydan yaklaşık bir ay sonra gerçekleşen daha koordineli ve çok kaynaklı ikinci saldırı dalgasının veri çıkışı yaşanmadan savuşturulması, kurumsal güvenlik kapasitesinin fiilen güçlendirildiğini ortaya koymaktadır.

---

## 7. CYBERFİRSTAİD ADLİ İNCELEME RAPORU

24 Şubat – 3 Mart 2026 tarihleri arasında, bağımsız siber güvenlik firması CyberFirstAid tarafından kapsamlı bir dijital adli inceleme yürütülmüştür. 5 Mart 2026 tarihinde tamamlanan rapor ile birlikte altı aylık güvenlik güçlendirme yol haritası da şirketimize sunulmuştur.

CyberFirstAid adli inceleme raporu, Sayın Kurum'un talep etmesi hâlinde ilgili gizlilik değerlendirmeleri gözetilerek ek olarak sunulabilecektir. Söz konusu rapor; saldırı vektörlerini, etkilenen sistemleri ve önerilen teknik iyileştirmeleri bağımsız bir uzman perspektifinden belgelemekte olup şirketimizin savunma sürecinde güçlü bir destekleyici delil niteliği taşımaktadır.

---

## 8. KVKK SÜRECİ VE YASAL YÜKÜMLÜLÜKLERE UYUM

Olayın tespitinin hemen ardından, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 12. maddesi uyarınca 72 saatlik bildirim yükümlülüğü kapsamında hazırlık süreci başlatılmıştır. Uyum birimi, veri ihlali kapsamının belirlenmesi, bildirim raporunun hazırlanması ve yasal süreçlerin takibi amacıyla olay anından itibaren kriz yönetimine dahil edilmiştir.

26 Mart 2026 tarihinde Kişisel Verileri Koruma Kurumu'ndan bilgi ve belge talebi alınmış olup ilgili değerlendirme ve yanıt hazırlık süreci devam etmektedir.

---

## 9. SONUÇ VE TALEP

Türkkep A.Ş., yaşanan olayı tüm ciddiyetiyle ele almış ve kurumsal sorumluluğunun bilinciyle hareket etmiştir. Özetle:

- Olay, tespit edilmesinin ardından saatler içinde yönetim kurulu düzeyinde koordine edilmiştir.
- USOM bildirimi zamanında yapılmış, erişim engeli sağlanmıştır.
- Sınırlı etki kapsamı teknik adli incelemeyle teyit edilmiş; KEP içeriği, ödeme bilgisi ve kimlik verisi bu olaydan etkilenmemiştir.
- Kapsamlı teknik güçlendirme önlemleri derhal hayata geçirilmiş; bağımsız bir adli inceleme yürütülmüştür.
- İkinci dalga saldırı başarıyla savuşturulmuş ve önlemlerin etkinliği kanıtlanmıştır.
- Mevcut güvenlik altyapısı ISO 27001 sertifikası, SOC/SIEM, NAC ve uç nokta korumasını kapsamaktadır.

Şirketimiz, Bilgi Teknolojileri ve İletişim Kurumu'nun değerlendirmelerine ve talep edebileceği ek bilgi ve belgelere her türlü katkıyı sağlamaya hazır olduğunu saygıyla arz eder.

---

**Türkkep Kayıtlı Elektronik Posta Hizmetleri A.Ş.**

Adres: Nova Baran Plaza, İstanbul

---

### EKLER

1. CyberFirstAid Dijital Adli İnceleme Raporu (24 Şubat – 3 Mart 2026) *(talep üzerine sunulacaktır)*
2. CyberFirstAid 6 Aylık Siber Güvenlik Güçlendirme Yol Haritası (5–6 Mart 2026)
3. USOM'a Yapılan Bildirime İlişkin Yazışmalar (20 Şubat 2026)
4. 20 Şubat 2026 Tarihli İç Durum Raporu (12 maddelik teknik eylem planı)
5. 2026 BT Güvenlik Giderleri Özet Tablosu
6. ISO 27001 Sertifikası
7. KVKK Bilgi ve Belge Talebi (26 Mart 2026) — Yanıt sürecindedir

---

*Bu metin TASLAK niteliğindedir. Hukuki danışman ve üst yönetimin inceleme ve onayı sonrasında BTK'ya sunulacak nihai savunma metnine dönüştürülecektir.*

*Hazırlayan: OpenClaw AI Asistan (Ayhan Ağırgöl adına)*
*Tarih: 30 Mart 2026*
