# FirmaCom Piyasa Araştırması — Ürüne Eklenebilecek Özellikler

> **Tarih:** Mart 2026  
> **Platform:** FirmaCom — KOBİ Kurumsal Hizmet Yönetimi (B2B SaaS)  
> **Hazırlayan:** OpenClaw AI Research Agent  

---

## İçindekiler

1. [Rakip Analizi — Türkiye](#1-rakip-analizi--türkiye)
2. [Rakip Analizi — Global](#2-rakip-analizi--global)
3. [Eklenebilecek Yeni Özellikler](#3-eklenebilecek-yeni-özellikler)
4. [Piyasa Trendleri](#4-piyasa-trendleri)
5. [Monetizasyon Fırsatları](#5-monetizasyon-fırsatları)
6. [Önceliklendirme Matrisi](#6-önceliklendirme-matrisi)
7. [Yol Haritası Önerisi](#7-yol-haritası-önerisi)

---

## 1. Rakip Analizi — Türkiye

### 1.1 Türkiye KOBİ Yazılım Ekosistemi Genel Görünüm

Türkiye'de yaklaşık **4,2 milyon** aktif KOBİ bulunmaktadır (KOSGEB 2024 verileri). Bu işletmelerin büyük çoğunluğu hâlâ kağıt tabanlı veya siloed (parçalı yazılım) süreçlerle yönetilmektedir. FirmaCom'un hedeflediği "tek uygulama" yaklaşımı piyasada nadir görülen bir konumlamadır.

### 1.2 Türkiye Rakip Detay Tablosu

| Rakip | Odak Alanı | Güçlü Özellikler | Fiyatlandırma | FirmaCom'da Olmayan |
|-------|-----------|-----------------|---------------|---------------------|
| **Paraşüt** | Ön muhasebe & e-fatura | E-fatura/e-arşiv, cari hesap, gelir-gider, stok, e-ticaret entegrasyonu | Günde ~5₺'den başlayan e-fatura paketi; aylık ₺299–₺999 | E-fatura, muhasebe entegrasyonu, stok takibi |
| **Logo Yazılım** | ERP, muhasebe, HR | Logo Go, Tiger ERP, HR Modülü, e-devlet entegrasyonları, WMS | Kurumsal lisans + bakım; aylık ₺500–₺5.000+ | Tam muhasebe, ERP, bordro, WMS |
| **Mikro Yazılım** | KOBİ muhasebe & ERP | Mikro ERP, bordro, e-fatura, e-arşiv, e-irsaliye, stok | Lisans bazlı; ₺200–₺2.000/ay | Muhasebe modülü, e-irsaliye, bordro |
| **Kolay İK** | HR & insan kaynakları | Bordro, personel dosyaları, izin yönetimi, performans, vardiya, PDKS, işe alım | Demo talep; kurumsal fiyat | Bordro, izin takibi, performans yönetimi, PDKS |
| **Bizim Hesap** | Ön muhasebe | E-fatura, e-arşiv, gelir-gider, stok | Aylık ₺149–₺499 | E-fatura, cari hesap takibi |
| **Luca** | Muhasebe + e-belge | E-fatura, e-arşiv, muhasebe kayıtları, defter beyanname | Aylık ₺250–₺800 | Muhasebe entegrasyonu |
| **Uyumsoft** | E-belge & e-dönüşüm | E-fatura, e-irsaliye, e-arşiv, e-mutabakat, e-bilet | ₺300–₺1.200/ay | E-dönüşüm belgeleri paketi |
| **GIB/Dijital Vergi Dairesi** | Resmi e-belge | E-fatura (bedava kullanım), e-arşiv (devlet portalı) | Ücretsiz (GIB portalı) | Resmi entegrasyon sağlayıcısı |
| **NetGSM/İletimerkezi** | Kurumsal hat & SMS | Kurumsal hat yönetimi, SMS API, sanal santral | İşlem bazlı | Toplu SMS, sanal santral |

### 1.3 FirmaCom'un Mevcut Rekabet Konumu

**Güçlü Yönler:**
- Hat, POS, HGS, banka hesabı, KEP, sigorta, bulut gibi **operasyonel B2B hizmetleri** tek platformda — bu kombinasyon Türkiye'de eşsiz
- Mobil-first yaklaşımı (React Native)
- Firebase altyapısı ile hızlı deployment

**Zayıf Yönler (Rakiplere Kıyasla Eksik):**
- E-fatura / e-arşiv yok → Paraşüt, Mikro, Luca, Bizim Hesap yapıyor
- Muhasebe entegrasyonu yok → Logo, Mikro, Paraşüt yapıyor
- Bordro / İK modülü yok → Kolay İK, Logo yapıyor
- Stok / envanter yok → Logo, Mikro yapıyor

---

## 2. Rakip Analizi — Global

### 2.1 Global SMB Platform Karşılaştırması

| Platform | Odak | Temel Özellikler | Fiyat | FirmaCom İçin Ders |
|----------|------|-----------------|-------|-------------------|
| **Stripe Atlas** | Şirket kuruluşu | Delaware incorporasyon, EIN, 83(b) dosyalama, Stripe kredisi, $50K+ ortak avantajlar | $500 tek seferlik | Şirket kuruluş modülü ekleme; bürokratik süreçleri otomatize etme |
| **Firstbase** | Şirket kuruluşu + arka ofis | LLC/C-Corp kurulum, posta adresi, registered agent, muhasebe, vergi dosyalama, "Firstbase One" paketi | $399/yıl (One paket); tekil hizmetler ayrı | Paket hizmet satışı; "FirmaCom One" benzeri bundle |
| **Mercury** | KOBİ bankacılığı | Ücretsiz çek/tasarruf hesabı, sanal kart, fatura ödeme, faturalama, QuickBooks/Xero senkron, $5M FDIC güvence | Ücretsiz temel; premium $35/ay | Banka hesabı + faturalama + muhasebe entegrasyonu kombinasyonu |
| **Brex** | Kurumsal finans | Kredi kartı, gider yönetimi, AI fatura onayı, vendor ödeme, 120+ ülke, ERP entegrasyonu | Temel ücretsiz; premium $12/kullanıcı/ay | AI-powered gider yönetimi; kurumsal kart + banka kombinasyonu |
| **Pilot.com** | Muhasebe + CFO danışmanlığı | Bookkeeping, vergi dosyalama, nakit akış modellemesi, CFO tavsiyeleri | $499/ay'dan başlar | Muhasebe + stratejik danışmanlık kombinasyonu gelir modeli |
| **Deel** | Global HR & bordro | Bordro (150+ ülke), HR platform, IT yönetimi, benefits, visa/mobility, embedded payroll API | $19/contractor/ay; $599/employee/ay | Embedded HR API modeli; KOBİ için lokalize bordro |
| **Rippling** | Workforce management | HR, Payroll, IT, Finance tek sistemde; onboarding otomasyonu; derin AI entegrasyonu | $8/kullanıcı/ay'dan başlar | Tek sistem = tek veri modeli = AI leverage → FirmaCom'un uzun vadeli vizyonu |
| **Gusto** | SMB HR & bordro (ABD) | Bordro, benefits, onboarding, 401(k), vergi dosyalama | $40/ay + $6/çalışan | Güzel UX ile HR; KOBİ dostu fiyatlandırma modeli |

### 2.2 Global Piyasadan Öğrenilecekler

1. **Bundle > A La Carte:** Mercury, Firstbase ve Brex, servisleri paketleyerek daha yüksek ARPU elde ediyor
2. **Embedded Finance:** Rippling ve Deel, HR/finans verilerini birleştirerek rakipsiz network efekti yaratıyor
3. **API-First:** Deel'in "Embedded" ürünü başka platformlara HR/bordro API satıyor — FirmaCom için B2B2B fırsatı
4. **AI Integration:** Brex ve Mercury, AI ile muhasebe/fatura süreçlerini otomatize ediyor
5. **Partner Ekosistemi:** Stripe Atlas $50K+ ortak avantajı sunuyor — KOBİ'lere çekici geliyor

---

## 3. Eklenebilecek Yeni Özellikler

### 3.1 Finans & Ödeme

#### 🟢 E-Fatura / E-Arşiv Entegrasyonu
- **Ne:** GIB (Gelir İdaresi Başkanlığı) onaylı e-fatura ve e-arşiv düzenleme, gönderme, arşivleme
- **Neden Değerli:** 2026 itibarıyla e-fatura zorunluluğu genişledi; 1 milyon+ mükellefi kapsıyor. Paraşüt'ün en güçlü özelliği bu — FirmaCom'un en kritik eksikliği
- **Zorluk:** Orta (GIB entegrator ortaklığı, özel entegratör lisansı veya mevcut sağlayıcı ile API entegrasyonu gerekiyor)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐⭐ — En yüksek kullanıcı talebi; aylık ₺50–₺300/işletme
- **Hızlı Yol:** Uyumsoft, Izibiz veya benzeri entegratörlerle API partnersliği

#### 🟢 Muhasebe Yazılımı Entegrasyonu
- **Ne:** Paraşüt, Logo, Luca, Mikro, Bizim Hesap ile çift yönlü veri senkronizasyonu (faturalar, cari hesaplar, ödemeler)
- **Neden Değerli:** KOBİ'lerin %78'i muhasebe için ayrı yazılım kullanıyor (KOSGEB verisi). FirmaCom'dan girilen verinin otomatik muhasebeye akması büyük verimlilik sağlar
- **Zorluk:** Orta (her yazılımın ayrı API belgesi; bazıları kapalı ekosistem)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ — Müşteri tutma (churn azaltma) için kritik

#### 🟡 Fatura Takibi ve Hatırlatma
- **Ne:** Gönderilen/alınan faturaların durumunu takip etme, vadesi yaklaşan/geçen ödemeler için otomatik SMS/e-posta hatırlatma
- **Neden Değerli:** Türkiye'de KOBİ'lerin %65'i alacak takibini elle yapıyor; geç ödeme problemi yaygın. Paraşüt kullanıcıları bu özelliği en çok sevdiklerini söylüyor
- **Zorluk:** Kolay (mevcut belge yönetimi altyapısı üzerine ekleme)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐

#### 🟡 Vergi Takvimi ve Hatırlatıcılar
- **Ne:** KDV beyannamesi, geçici vergi, muhtasar, SGK bildirge gibi vergi dönemlerine ait otomatik hatırlatıcı ve takvim
- **Neden Değerli:** Beyan gecikmeleri = ceza. KOBİ'lerin en büyük sıkıntılarından biri. Sıfır geliştirme maliyetiyle yüksek değer
- **Zorluk:** Kolay (statik takvim + push notification sistemi)
- **Gelir Potansiyeli:** ⭐⭐⭐ (freemium ile ücretsiz sunulabilir; premium uygulama için tetikleyici)

#### 🟠 Nakit Akış Tahminleme
- **Ne:** Mevcut fatura, ödeme ve gider verisinden AI destekli nakit akış projeksiyonu (30/60/90 günlük)
- **Neden Değerli:** Pilot.com'un en popüler özelliği. "Ne zaman kasam boşalır?" sorusu KOBİ'lerin birinci derdi
- **Zorluk:** Zor (veri modeli + ML gerektirir; ancak temel versiyon basit rule-based da olabilir)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Premium tier özelliği)

---

### 3.2 Yasal & Uyum

#### 🟢 Şirket Kuruluş Süreci Rehberliği
- **Ne:** Şahıs şirketi veya limited şirket kuruluş adımları için adım adım rehber; ticaret sicil, vergi dairesi, MERSIS başvuru süreçleri için form asistanı
- **Neden Değerli:** Stripe Atlas bu özellikle $500 ücret alıyor; Firstbase $399/yıl. Türkiye'de muadil yok. FirmaCom'un "işletme kuruluşu" ile başlayan bir müşteri yolculuğu yaratması mümkün
- **Zorluk:** Orta (içerik + form yönetimi; MERSIS/e-devlet API entegrasyonu opsiyonel)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Tek seferlik danışmanlık ücreti + süregelen abonelik)

#### 🟡 KVKK Uyumluluk Paketi
- **Ne:** KOBİ'ler için KVKK (GDPR muadili) uyumluluk kontrol listesi, aydınlatma metni şablonları, VERBİS kayıt rehberi, veri envanteri şablonu
- **Neden Değerli:** KVKK cezaları 2024'te dramatik arttı; KOBİ'lerin %70'i VERBİS'e kayıtlı değil. Avukatlık firmaları 20.000₺+ alıyor bu hizmet için
- **Zorluk:** Kolay (şablon + içerik; yasal uzmanlık gerekiyor ama platform bunu partner avukatlarla sağlayabilir)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (₺500–₺2.000 tek seferlik veya yıllık abonelik)

#### 🟡 SGK İşlemleri (İşe Giriş/Çıkış Bildirimi)
- **Ne:** Yeni personel SGK işe giriş bildirimi ve işten ayrılan personel çıkış bildirimi; e-devlet entegrasyonu
- **Neden Değerli:** Her işveren zorunlu olarak yapıyor. Gecikme = ceza. Kolay İK'nın temel özelliği. FirmaCom'un HR modülüne giriş kapısı
- **Zorluk:** Orta (SGK Web servislerine entegrasyon; güvenlik sertifikası gerekiyor)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐

#### 🟠 İSG (İş Sağlığı ve Güvenliği) Hizmet Modülü
- **Ne:** 50 altı çalışanlı KOBİ'ler için İSG uzmanı ve işyeri hekimi hizmeti; belge yönetimi, periyodik muayene takibi
- **Neden Değerli:** Yasal zorunluluk. Türkiye'de yüzlerce İSG firması var; FirmaCom bunları platformuna çekebilir (marketplace model)
- **Zorluk:** Orta (marketplace entegrasyonu; hizmet kalitesi kontrolü)
- **Gelir Potansiyeli:** ⭐⭐⭐ (Komisyon geliri)

---

### 3.3 HR & İnsan Kaynakları

#### 🟢 Bordro Yönetimi
- **Ne:** Aylık maaş bordrosu hesaplama (SGK, gelir vergisi, damga vergisi kesintileri dahil), bordro fişi oluşturma, toplu ödeme talimatı
- **Neden Değerli:** Kolay İK, Logo, Mikro'nun temel gelir kaynağı. Türkiye'de muhasebe büroları bu iş için KOBİ'den aylık ₺500–₺2.000 alıyor. FirmaCom yazılımla bunu 1/3 maliyetle sunabilir
- **Zorluk:** Zor (Türkiye'ye özel vergi mevzuatı, SSK matrahı hesaplamaları; sık değişen SGK/vergi parametreleri)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐⭐ — Yüksek ARPU; müşteri bağlılığı çok güçlü

#### 🟡 İzin Takibi
- **Ne:** Yıllık izin hakkı hesaplama, izin talebi ve onay akışı, izin bakiyesi raporlama
- **Neden Değerli:** Her KOBİ'nin ihtiyacı; Kolay İK'nın popüler özelliği. Firebase üzerinde basit bir workflow ile yapılabilir
- **Zorluk:** Kolay-Orta (iş kanununa göre izin hesaplama kuralları; form + onay akışı)
- **Gelir Potansiyeli:** ⭐⭐⭐

#### 🟡 Personel Dosya Yönetimi
- **Ne:** Her çalışan için dijital özlük dosyası; kimlik, sözleşme, sağlık raporu, sertifika, SGK belgeleri arşivi
- **Neden Değerli:** FirmaCom'un mevcut Belge Yönetimi modülü ile doğrudan sinerji. HR'a genişlemenin en az riskli adımı
- **Zorluk:** Kolay (mevcut belge altyapısı üzerine "personel etiketleme" ekleme)
- **Gelir Potansiyeli:** ⭐⭐⭐

---

### 3.4 Dijital Pazarlama & Müşteri

#### 🟢 Google My Business (Haritalar) Entegrasyonu
- **Ne:** Google İşletme Profili oluşturma ve yönetimi; çalışma saatleri, fotoğraf, yorum yanıtlama, güncelleme paylaşma
- **Neden Değerli:** Türkiye'de KOBİ'lerin %40'ının Google haritada profili yok veya güncel değil. Lokal müşteri ediniminin 1 numaralı kanalı. Google API serbesttir
- **Zorluk:** Kolay-Orta (Google My Business API entegrasyonu; OAuth akışı)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Digital presence paketi olarak paketlenebilir)

#### 🟡 E-posta Pazarlama Entegrasyonu
- **Ne:** Mailchimp, Brevo (Sendinblue) veya Klaviyo entegrasyonu; müşteri listesi yönetimi, kampanya gönderimi
- **Neden Değerli:** KOBİ'ler için en düşük maliyetli pazarlama kanalı. FirmaCom müşteri verisi ile entegre çalışabilir
- **Zorluk:** Kolay (API entegrasyonu; hazır SDK'lar mevcut)
- **Gelir Potansiyeli:** ⭐⭐⭐

#### 🟠 CRM Modülü
- **Ne:** Müşteri ve potansiyel müşteri takibi; satış pipeline, teklif yönetimi, iletişim geçmişi
- **Neden Değerli:** Türkiye'de çok az KOBİ CRM kullanıyor (Salesforce vs çok pahalı). Basit bir CRM FirmaCom'un "tek uygulama" vizyonunu güçlü destekler
- **Zorluk:** Zor (kapsamlı ürün; önce MVP ile başlanabilir)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐⭐ (Yüksek kullanım frekansı = güçlü retention)

---

### 3.5 Operasyonel

#### 🟡 Kargo Entegrasyonu
- **Ne:** Yurtiçi Kargo, MNG, Aras, PTT, DHL gibi kargo firmalarıyla API entegrasyonu; sipariş takibi, fatura üretimi, kargo etiketi oluşturma
- **Neden Değerli:** E-ticaret yapan KOBİ'ler için kritik. Paraşüt e-ticaret modülünde bu özellik var. Komisyon modeli mümkün
- **Zorluk:** Orta (her kargo firmasının ayrı API'si; standart değil)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Komisyon bazlı; yüksek işlem hacmi)

#### 🟡 Stok / Envanter Yönetimi
- **Ne:** Basit stok girişi/çıkışı, kritik stok uyarısı, barkod okuma, depo konumu takibi
- **Neden Değerli:** Logo, Mikro'nun temel özelliği. E-ticaret KOBİ'leri için vazgeçilmez
- **Zorluk:** Orta
- **Gelir Potansiyeli:** ⭐⭐⭐⭐

#### 🟠 Filo / Araç Takip Yönetimi
- **Ne:** Şirket araçları için GPS takip entegrasyonu, yakıt tüketimi, servis takibi
- **Neden Değerli:** Araçlı çalışan KOBİ'ler için (kurye, lojistik, inşaat). HGS modülü ile sinerji
- **Zorluk:** Zor (GPS donanım entegrasyonu; IoT)
- **Gelir Potansiyeli:** ⭐⭐⭐

#### 🟠 Tedarikçi Yönetimi
- **Ne:** Tedarikçi kart/profil, fiyat teklifi yönetimi, ödeme takibi, değerlendirme
- **Neden Değerli:** Mevcut sözleşme yönetimi modülü ile sinerji. B2B satın alma süreçlerini dijitalleştirir
- **Zorluk:** Orta
- **Gelir Potansiyeli:** ⭐⭐⭐

---

### 3.6 AI & Otomasyon

#### 🟢 OCR — Otomatik Belge Tanıma
- **Ne:** Yüklenen PDF/fatura/sözleşme belgelerinden otomatik metin ve veri çıkarma; form alanlarını otomatik doldurma
- **Neden Değerli:** FirmaCom'un mevcut Belge Yönetimi modülünü dramatik şekilde güçlendirir. Kullanıcı manuel veri girişinden kurtulur
- **Zorluk:** Orta (Google Document AI, AWS Textract veya Azure Form Recognizer entegrasyonu ile hızlı yapılabilir)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐⭐ (Operasyonel verimlilik = retention güçlenir)

#### 🟢 Akıllı Form Doldurma
- **Ne:** Daha önce girilmiş firma/yetkili bilgilerini yeni hizmet talebi formlarına otomatik doldurma; AI ile eksik alanları tahmin etme
- **Neden Değerli:** FirmaCom'un mevcut 11 modülünde müşteri aynı bilgileri defalarca giriyor. Bu, en büyük UX sürtüşme noktası
- **Zorluk:** Kolay (mevcut Firebase veri modeli kullanılarak uygulanabilir)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Churn azaltır; NPS artırır)

#### 🟡 AI Chatbot — Müşteri Hizmetleri
- **Ne:** Platform içi AI asistan; "hangi hizmet bana lazım?", "durumum nedir?", "nasıl başvururum?" sorularına anlık yanıt
- **Neden Değerli:** Destek maliyetini düşürür; 7/24 erişim; onboarding sürtüşmesini azaltır
- **Zorluk:** Orta (GPT-4 / Gemini API entegrasyonu + FirmaCom knowledge base)
- **Gelir Potansiyeli:** ⭐⭐⭐ (Dolaylı değer: retention ve NPS)

#### 🟡 Tahmine Dayalı İhtiyaç Analizi
- **Ne:** Kullanıcı davranışı ve firma profiline göre "sıradaki ihtiyacın X olabilir" önerisi (örn: hat alan firmaya sigorta veya banka hesabı öner)
- **Neden Değerli:** Cross-sell/upsell gelirini artırır. Rippling'in en güçlü özelliği bu tip öngörülü öneri sistemi
- **Zorluk:** Orta (kural tabanlı versiyon kolay; ML tabanlı versiyon için veri birikimi gerekiyor)
- **Gelir Potansiyeli:** ⭐⭐⭐⭐ (Cross-sell geliri)

---

## 4. Piyasa Trendleri

### 4.1 Türkiye KOBİ Dijitalleşme Trendleri

**Temel Veriler (KOSGEB/TÜİK 2023-2024):**
- Türkiye'de **~4,2 milyon KOBİ** var; bu işletmeler toplam istihdamın %74'ünü, GSYİH'nın ~%55'ini oluşturuyor
- KOBİ'lerin yalnızca **%18'i** muhasebe yazılımı kullanıyor (2023 KOSGEB anketi tahmini)
- **E-fatura zorunluluğu:** 2026 itibarıyla yıllık cirosu 150.000₺ üzerindeki tüm mükellefler; bu kapsam her yıl genişliyor
- **Dijital dönüşüm:** KOSGEB Dijital Dönüşüm Destek Programı KOBİ'lere yazılım için 50.000₺'ye kadar hibe veriyor
- **Mobil kullanım:** Türkiye'de KOBİ yöneticilerinin %68'i akıllı telefonu iş amaçlı birincil araç olarak kullanıyor

**Türkiye'ye Özgü Fırsatlar:**
- GIB e-dönüşüm zorunlulukları her yıl genişliyor → e-fatura talebi artacak
- Türk Lirası değer kaybı → Yurt dışı yazılım pahalılaştı → Yerli çözüm avantajı
- BDDK/SPK fintech düzenlemeleri gelişiyor → Embedded finance için zemin hazırlanıyor
- Genç girişimci profili artıyor → Mobil-first çözüm talebi yüksek

### 4.2 Embedded Finance Trendleri

**Dünya Geneli:**
- Embedded finance pazarı 2025'te **$138 milyar** (2020: $22B) — McKinsey
- B2B embedded finance en hızlı büyüyen segment: muhasebe yazılımına gömülü kredi, sigortaya gömülü ödeme
- KOBİ'lerin **%73'ü** iş yazılımları içinden finansal ürün almaya açık (Plaid/Harris araştırması)

**Türkiye:**
- BNPL (al-şimdi-öde-sonra) B2B segmentinde büyüme
- Fintechler ve bankalar KOBİ platformlarıyla ortaklık arıyor → FirmaCom için banka/fintech API partner fırsatı
- Esnaf hesabı / küçük işletme neobanking (Papara İşyeri, Tosla İşletme gibi) büyüyor

**FirmaCom İçin:** Mevcut banka hesabı ve POS modülleri, embedded finance için mükemmel giriş noktası. Bankalarla white-label veya komisyon anlaşması yapılabilir.

### 4.3 Super App Yaklaşımı (KOBİ Odaklı)

Asya'da WeChat ve Gojek'in bireysel super app başarısından sonra, **B2B super app** trendi de yükseliyor:

- **Rippling:** HR + IT + Finance'ı tek platformda birleştirdi; $250M ARR'a ulaştı
- **Deel:** HR + bordro + IT + göç hizmetleri → $500M+ ARR
- **Türkiye'de:** Hiçbir platform KOBİ için tam super app konumunda değil

**FirmaCom'un Avantajı:** "Zaten 11 modülle geniş kapsam" var. Eksik olan derin finansal entegrasyon (muhasebe, bordro). Bunlar eklendikçe super app konumu güçlenecek.

### 4.4 API-First Yaklaşımı

- Mercury, Brex, Deel → hepsi güçlü API sunuyor; B2B2B model (başka platformlara API satışı)
- Türkiye'de KOBİ SaaS platformlarının %90'ı API sunmuyor veya çok sınırlı
- **FirmaCom için API fırsatı:** Muhasebe bürolarına, yazılım evlerine FirmaCom API'si sunmak → B2B2C kanal

---

## 5. Monetizasyon Fırsatları

### 5.1 Mevcut ve Potansiyel Gelir Modelleri

| Gelir Modeli | Mevcut Durum | Potansiyel Yeni Kullanım | Hedef ARPU Etkisi |
|-------------|-------------|-------------------------|------------------|
| **Abonelik (SaaS)** | Muhtemelen mevcut | Yeni modüller için premium tier | +₺200-500/ay/firma |
| **İşlem komisyonu** | POS, muhtemelen hat | E-fatura işlemi, kargo, ödeme | +₺50-150/ay/firma |
| **Lead ücreti / Referans** | Sigorta, banka | Bordro hizmetleri, İSG firmaları, avukatlar | +₺100-300/ay/firma |
| **Freemium → Upsell** | Belirsiz | Vergi takvimi ücretsiz, bordro ücretli | Kullanıcı tabanı büyütür |
| **White-label API** | Yok | Muhasebe bürolarına API satışı | B2B2B gelir kanalı |
| **Marketplace komisyonu** | Yok | İSG, hukuki, muhasebe hizmet pazarı | %10-20 komisyon |
| **Veri & Analytics** | Yok | Anonim piyasa verileri; endüstri raporları | Uzun vadeli |

### 5.2 Freemium vs Premium Katman Önerisi

**Ücretsiz Katman (Müşteri Edinimi İçin):**
- Vergi takvimi & hatırlatmalar
- Basit belge saklama (5 GB)
- 1 kullanıcı
- Hizmet talebi (hat, banka hesabı, HGS) — lead geliri

**Starter (₺199/ay):**
- Tüm hizmet talepleri
- 5 kullanıcı
- Belge yönetimi (50 GB)
- Sözleşme yönetimi
- Temel fatura takibi
- Google My Business entegrasyonu

**Pro (₺499/ay):**
- E-fatura / e-arşiv (aylık 100 belge dahil)
- İzin ve personel takibi
- SGK bildirimleri
- Muhasebe entegrasyonu (Paraşüt/Logo)
- AI form doldurma, OCR
- Kargo entegrasyonu

**Business (₺999/ay):**
- Bordro yönetimi (10 personele kadar)
- KVKK uyumluluk paketi
- CRM modülü
- Gelişmiş raporlama & nakit akış tahmini
- Sınırsız kullanıcı
- Öncelikli destek

### 5.3 Komisyon Bazlı Gelir Fırsatları

| Hizmet | Komisyon Modeli | Tahmini Gelir/İşlem |
|--------|----------------|---------------------|
| Banka hesabı açılışı | Banka'dan lead ücreti | ₺200-500/başarılı başvuru |
| Sigorta satışı | Sigorta şirketinden komisyon | Prim'in %5-15'i |
| POS kurulumu | Banka/ödeme kuruluşundan | ₺150-400/terminal |
| Kargo entegrasyonu | Kargo firmasından hacim bonusu | İşlem başına ₺2-5 |
| E-fatura entegrasyonu | Entegratörden | İşlem başına ₺0.20-0.50 |
| Bordro hesaplama | Per-employee modeli | ₺30-80/çalışan/ay |
| İSG hizmet marketplace | Hizmet sağlayıcıdan | %15-20 komisyon |

### 5.4 Partner / Affiliate Gelir Modelleri

- **Muhasebe büroları:** Müşteri portföyünü FirmaCom üzerinden yönetiyorlar; büroya beyaz etiket veya komisyon
- **Banka partnerlikleri:** Ziraat, Garanti, İş Bankası, Yapı Kredi KOBİ segmenti için FirmaCom'a API açabilir
- **Sigorta acenteleri:** Acentelerle network oluşturup komisyon paylaşımı
- **Telekom operatörleri:** Vodafone, Turkcell, Türk Telekom kurumsal hatları için B2B reseller ağı

---

## 6. Önceliklendirme Matrisi

### 6.1 Impact vs Effort Analizi

Tüm potansiyel özellikler aşağıdaki kriterlere göre değerlendirildi:
- **Impact (Etki):** Gelir artışı + müşteri tutma + yeni müşteri edinimi + NPS
- **Effort (Efor):** Geliştirme süresi + teknik karmaşıklık + regülasyon yükü

```
YÜKSEK ETKİ
     │
     │  [STRATEJİK BAHISLER]      [QUICK WINS]
     │  • Bordro Yönetimi         • E-fatura/E-arşiv*
     │  • CRM Modülü              • Akıllı Form Doldurma
     │  • Nakit Akış Tahmini      • OCR Belge Tanıma
     │  • Şirket Kuruluş Rehberi  • SGK Bildirimleri
     │                            • Fatura Takibi & Hatırlatma
     │                            • Google My Business
     │
     │  [DOLDURUCU]               [DEĞERLENDİR / ERTELE]
     │  • Araç Takip              • Vergi Takvimi (zaten kolay)
     │  • Filo Yönetimi           • İzin Takibi
     │  • Envanter (tam WMS)      • Personel Dosyası
     │
     └──────────────────────────────────────────
     DÜŞÜK EFOR                    YÜKSEK EFOR
```

*E-fatura: Etki çok yüksek, efor ortadan yukarı; ancak partner API ile "orta efora" çekilebilir

### 6.2 Detaylı Öncelik Tablosu

| # | Özellik | Etki (1-10) | Efor (1-10) | Skor (Etki/Efor) | Kategori |
|---|---------|------------|------------|-----------------|---------|
| 1 | Akıllı Form Doldurma (Auto-fill) | 8 | 2 | 4.0 | ⚡ Quick Win |
| 2 | Vergi Takvimi & Hatırlatma | 7 | 2 | 3.5 | ⚡ Quick Win |
| 3 | Fatura Takibi & Hatırlatma | 8 | 2 | 4.0 | ⚡ Quick Win |
| 4 | OCR Belge Tanıma | 9 | 3 | 3.0 | ⚡ Quick Win |
| 5 | Personel Dosya Yönetimi | 6 | 2 | 3.0 | ⚡ Quick Win |
| 6 | Google My Business Entegrasyonu | 7 | 3 | 2.3 | ⚡ Quick Win |
| 7 | E-fatura / E-arşiv (API partner) | 10 | 5 | 2.0 | ⚡ Quick Win* |
| 8 | SGK İşe Giriş/Çıkış Bildirimi | 8 | 4 | 2.0 | ⚡ Quick Win |
| 9 | KVKK Uyumluluk Paketi (şablon) | 7 | 3 | 2.3 | ⚡ Quick Win |
| 10 | İzin Takibi | 6 | 3 | 2.0 | 🔶 Orta Öncelik |
| 11 | Muhasebe Entegrasyonu (Paraşüt API) | 9 | 5 | 1.8 | 🔶 Orta Öncelik |
| 12 | Kargo Entegrasyonu | 7 | 4 | 1.75 | 🔶 Orta Öncelik |
| 13 | AI Chatbot | 6 | 4 | 1.5 | 🔶 Orta Öncelik |
| 14 | E-posta Pazarlama Entegrasyonu | 5 | 3 | 1.7 | 🔶 Orta Öncelik |
| 15 | Tahmine Dayalı İhtiyaç Analizi | 8 | 5 | 1.6 | 🔶 Orta Öncelik |
| 16 | Şirket Kuruluş Rehberi | 8 | 5 | 1.6 | 🔶 Orta Öncelik |
| 17 | Stok / Envanter Yönetimi | 7 | 5 | 1.4 | 🔷 Stratejik |
| 18 | Bordro Yönetimi | 10 | 8 | 1.25 | 🔷 Stratejik |
| 19 | CRM Modülü | 9 | 7 | 1.3 | 🔷 Stratejik |
| 20 | Nakit Akış Tahmini (AI) | 8 | 6 | 1.3 | 🔷 Stratejik |
| 21 | Tedarikçi Yönetimi | 5 | 4 | 1.25 | ⬜ Düşük Öncelik |
| 22 | İSG Marketplace | 5 | 5 | 1.0 | ⬜ Düşük Öncelik |
| 23 | Filo / Araç Takip | 4 | 7 | 0.57 | ⬜ Düşük Öncelik |

---

## 7. Yol Haritası Önerisi

### İlk 3 Ay (Hızlı Değer — Quick Wins)

**Geliştirme Odağı:** Mevcut altyapı üzerinde, düşük eforlu yüksek etkili özellikler

| Özellik | Tahmini Süre | Gelir Etkisi | Neden Önce |
|---------|-------------|-------------|-----------|
| ✅ Akıllı Form Doldurma (firma bilgileri auto-fill) | 2 hafta | Retention ↑ | Firebase'deki mevcut veriyi kullanır; sıfır bağımlılık |
| ✅ Vergi Takvimi & Push Notification | 1 hafta | NPS ↑, Engagement ↑ | Statik içerik; hızlı deploy |
| ✅ Fatura Takibi & SMS/E-posta Hatırlatma | 3 hafta | Retention ↑ | Sözleşme modülü altyapısı var |
| ✅ OCR Belge Tanıma (Google Document AI) | 3 hafta | Yeni özellik → upsell | Cloud API ile hızlı entegrasyon |
| ✅ Google My Business Entegrasyonu | 2 hafta | Yeni müşteri segmenti | Google API açık; büyük talep |
| ✅ KVKK Şablonları & Kontrol Listesi | 1 hafta | Yeni gelir paketi | İçerik tabanlı; geliştirme minimal |

**3 Ay Sonu Hedefler:**
- 6 yeni özellik canlıda
- Mevcut kullanıcılara "Pro upgrade" teklifi
- Aylık churn %2'den %1'e düşürme

---

### 4–6. Aylar (Ürün Derinleştirme)

**Geliştirme Odağı:** Rakip parite + kritik eksiklikler

| Özellik | Tahmini Süre | Gelir Etkisi | Notlar |
|---------|-------------|-------------|--------|
| 🔶 E-fatura / E-arşiv Entegrasyonu | 6-8 hafta | Yeni segment açar; kritik | Uyumsoft/İzibiz API partneri ile |
| 🔶 SGK İşe Giriş/Çıkış Bildirimi | 3-4 hafta | HR segmenti giriş | e-devlet web servisi |
| 🔶 İzin Takibi | 2-3 hafta | Kolay İK'ya alternatif başlangıç | |
| 🔶 Muhasebe Entegrasyonu (Paraşüt) | 4-5 hafta | Muhasebe bürosu kanalı açar | Paraşüt API açık; dokümantasyon var |
| 🔶 Kargo Entegrasyonu | 4 hafta | E-ticaret KOBİ segmenti | Yurtiçi + MNG + Aras |
| 🔶 Personel Dosya Yönetimi | 2 hafta | Mevcut belge modülü uzantısı | |

**6 Ay Sonu Hedefler:**
- E-fatura ile Paraşüt'e rakip konumlanma başlıyor
- HR mini-suite (SGK + izin + personel dosyası) ile Kolay İK'ya küçük rakip
- "FirmaCom Pro" paketi dolu; ARPU ₺499/ay'a hedeflenir

---

### 7–12. Aylar (Stratejik Büyüme)

**Geliştirme Odağı:** Diferansiyatör özellikler; super app vizyonuna adım

| Özellik | Tahmini Süre | Gelir Etkisi | Notlar |
|---------|-------------|-------------|--------|
| 🔷 Bordro Yönetimi (Türkiye mevzuatı) | 10-12 hafta | En yüksek ARPU özelliği | Dış uzman + hukuki danışmanlık gerekir |
| 🔷 CRM Modülü (MVP) | 8-10 hafta | Retention dramatik artır | Temel pipeline + iletişim geçmişi ile başla |
| 🔷 Stok / Envanter (basit) | 6 hafta | E-ticaret KOBİ tam suite | |
| 🔷 Nakit Akış Tahmini | 4-6 hafta | CFO danışmanlığı angle | |
| 🔷 AI Chatbot | 4-6 hafta | Destek maliyeti ↓ | GPT-4/Gemini API |
| 🔷 Şirket Kuruluş Rehberi | 6 hafta | Yeni müşteri edinimi | MERSIS entegrasyonu |

**12 Ay Sonu Hedefler:**
- 20+ modül ile Türkiye'nin en kapsamlı KOBİ platformu
- "FirmaCom Business" paketi canlıda (₺999/ay)
- Bordro = güçlü lock-in; churn ~%0.5/ay
- Banka/sigorta/telekom ile 3-5 lead komisyon anlaşması
- ARR hedefi: mevcut × 3-5x

---

## Ek: Hızlı Kazanç Uygulama Fikirleri

### Yapılabilir Bu Ay (0 Geliştirme)
1. **Vergi takvimi PDF'i** → Mevcut kullanıcılara e-posta gönder → Engagement ölç
2. **KVKK şablon paketi** → Belge yönetiminde hazır şablon olarak ekle → ₺299 "Yasal Paket" sat
3. **Google My Business landing page** → "Harita Profilini Optimize Et" hizmet teklifi

### Yapılabilir 2 Haftada
4. **Firebase'deki firma bilgisini** tüm form alanlarına otomatik çek
5. **Push notification** ile yaklaşan fatura/sözleşme son tarihi bildirimi

### Banka/Fintech Partnerlikleri (0 Geliştirme)
6. **Papara İşletme** veya **Tosla** ile banka hesabı yönlendirme anlaşması
7. **Allianz/Anadolu Sigorta** ile dijital sigorta lead anlaşması

---

## Kaynaklar & Referanslar

- Paraşüt.com — Özellikler, blog, müşteri yorumları (Mart 2026)
- Kolay İK — Uygulama listesi ve özellikler
- Stripe Atlas (stripe.com/atlas) — Kuruluş ve fiyatlandırma
- Firstbase.io — "Firstbase One" paketi ve özellikler
- Mercury.com — Banking + invoicing + accounting özellikleri
- Brex.com — AI-powered finans platform özellikleri
- Pilot.com — CFO + bookkeeping servisleri
- Deel.com — Global HR/bordro platform
- Rippling.com — Workforce OS yaklaşımı
- KOSGEB — Dijital dönüşüm destek programları
- GIB (gelirler.gov.tr) — E-dönüşüm zorunlulukları 2026

---

*Bu araştırma, web'den toplanan gerçek platform verileri ile Türkiye KOBİ piyasası bağlamında hazırlanmıştır. Fiyat ve özellik bilgileri Mart 2026 itibarıyla geçerlidir; düzenli güncelleme önerilir.*
