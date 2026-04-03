# FirmaCom — Ürün Yol Haritası
### Sürüm 1.0 · Mart 2026
### Yönetim Kurulu & Yatırımcı Sunumu

---

> **GİZLİLİK NOTU:** Bu doküman FirmaCom / FinHouse'a aittir. Yetkisiz dağıtım yasaktır.

---

## İÇİNDEKİLER

1. [Yönetici Özeti](#1-yönetici-özeti)
2. [Mevcut Durum Analizi](#2-mevcut-durum-analizi)
3. [Yeni Modüller ve Özellikler](#3-yeni-modüller-ve-özellikler)
4. [Faz Planı (Timeline)](#4-faz-planı-timeline)
5. [Monetizasyon Stratejisi](#5-monetizasyon-stratejisi)
6. [Teknik Gereksinimler](#6-teknik-gereksinimler)
7. [KPI ve Başarı Metrikleri](#7-kpi-ve-başarı-metrikleri)
8. [Risk Analizi](#8-risk-analizi)

---

## 1. YÖNETİCİ ÖZETİ

### 1.1 Vizyon ve Misyon

**Vizyon:** Türkiye'nin KOBİ'leri için tüm kurumsal ihtiyaçları tek platformda karşılayan, AI ile güçlendirilmiş "super app" olmak.

**Misyon:** 4,2 milyon Türk KOBİ'sinin günlük kurumsal işlemlerini — hat, banka, POS, sigorta, e-fatura, evrak, mevzuat takibinden AI destekli chatbot kurulumuna kadar — tek uygulamadan, minimum bürokratik sürtüşmeyle yönetmelerini sağlamak.

### 1.2 Neredeyiz?

FirmaCom, **pre-production aşamasında, işlevsel bir B2B SaaS ürünüdür.** React Native mobil + React/Vite web platformunda, Firebase tabanlı altyapıyla geliştirilmiştir. Platform şu anda 11 modülle çalışmakta olup canlıya çıkış öncesi kritik güvenlik ve backend bağlantı çalışmaları tamamlanmaktadır.

**Kritik Avantaj:** Türkiye'de hat, POS, HGS, banka hesabı, KEP, sigorta, bulut ve web sitesi gibi operasyonel B2B hizmetleri tek platformda sunan **rakipsiz bir kombinasyon** mevcuttur. Bu, FirmaCom'un üzerine inşa edeceği stratejik temeli oluşturmaktadır.

### 1.3 Hedef: KOBİ Super App

Asya'daki WeChat ve Gojek gibi bireysel "super app"lerin yolundan giderek, FirmaCom **Türkiye'nin ilk KOBİ odaklı B2B super app'i** olmayı hedeflemektedir. Global referanslar (Rippling, Deel, Mercury) bu yaklaşımın 100M$+ ARR ürettiğini kanıtlamaktadır.

**12 Aylık Hedef:** Mevcut 11 modülü 20+ modüle çıkarmak; AI entegrasyonu, e-fatura, teşvik bilgilendirme ve ticari duyurular modülleriyle tam kurumsal yaşam döngüsü platformunu hayata geçirmek.

---

## 2. MEVCUT DURUM ANALİZİ

### 2.1 Mevcut 11 Modül

| # | Modül | Durum | Öncelik Notu |
|---|-------|-------|-------------|
| 1 | Landing Page / Onboarding | ✅ Hazır | — |
| 2 | Kimlik Doğrulama (E-posta + Google OAuth) | ✅ Hazır | — |
| 3 | Dashboard (Ana Sayfa) | 🟡 Kısmi | Haber bölümü bağlanmamış |
| 4 | Belgeler | 🟡 Kısmi | Cloud Storage entegrasyonu eksik |
| 5 | Hat Talebi | 🟡 Kısmi | Backend'e yazım yapılmıyor |
| 6 | Banka Hesabı Talebi | 🟡 Kısmi | Backend'e yazım yapılmıyor |
| 7 | POS (Fiziksel/Sanal/Soft) | 🟡 Kısmi | Backend'e yazım yapılmıyor |
| 8 | HGS Talebi | 🟡 Kısmi | Backend'e yazım yapılmıyor |
| 9 | Sigorta / KEP / Bulut / Web Talebi | 🟡 Kısmi | Backend'e yazım yapılmıyor |
| 10 | Sözleşmeler | 🔴 Eksik | Firestore bağlantısı yok |
| 11 | Profil Yönetimi | 🟡 Kısmi | CSS hatası, kısmi işlevsellik |

### 2.2 Canlıya Çıkış Öncesi Kritik Eksikler

#### 🔴 BLOCKER Seviye Güvenlik Açıkları

| # | Sorun | Etki | Çözüm |
|---|-------|------|-------|
| S-1 | `users` koleksiyonunda `allow read: if true` — tüm kullanıcı e-postaları açık | KRİTİK | Kuralı kaldır; Firebase Auth `sendPasswordResetEmail` yeterli |
| S-2 | Debug App Check token'ı kaynak koduna gömülü (`3E3D12C3-...`) | KRİTİK | `.env` dosyasına taşı; production build'de kaldır |
| S-3 | `offers` koleksiyonu: giriş yapmış her kullanıcı kampanya ekleyebilir | YÜKSEK | `create/update` sadece admin yetkisi |
| S-4 | Firebase API key'leri düz metin (`firebase.config.js`) | YÜKSEK | Environment variable'a taşı |
| S-5 | Google Client ID açık kaynak kodda | ORTA | `.env` dosyasına taşı |

#### 🔴 BLOCKER Seviye İş Akışı Hataları

| # | Sorun | Etki |
|---|-------|------|
| B-1 | Talep gönderimi Firestore'a yazılmıyor — kullanıcı talep oluşturuyor ama kayıt yok | İş değeri sıfır |
| B-2 | `App.tsx` — `handleSplashFinish` farklı scope'ta tanımlı, uygulama çakışabilir | Crash riski |
| B-3 | Firebase Storage entegrasyonu yok — belgeler sadece local depolanıyor | Güvenli değil |
| B-4 | Admin paneli yok — haber/kampanya eklemek imkânsız | Platform yönetilemez |
| B-5 | Sözleşmeler modülü içeriksiz | Kullanıcı deneyimi bozuk |

### 2.3 Güçlü Yönler ve Fırsatlar

**Teknik Güçler:**
- ✅ Firebase ekosistemi: Auth, Firestore, App Check, Storage — tek backend
- ✅ Çift platform: Mobil (React Native 0.80) + Web (React 19 + Vite) aynı backend
- ✅ Belge şifreleme: CryptoJS AES tabanlı PDF şifreleme işlevsel
- ✅ Mevcut belge tarayıcı: `react-native-document-scanner-plugin` kurulu — OCR için hazır altyapı
- ✅ Firebase App Check: iOS + Android debug/production yapılandırması mevcut
- ✅ Güçlü auth validasyon + Google OAuth

**Piyasa Fırsatları:**
- 4,2 milyon Türk KOBİ'si — yalnızca %18'i muhasebe yazılımı kullanıyor
- E-fatura zorunluluğu 2026'da genişliyor → zorunlu talep artışı
- Türk lirası değer kaybı → yerli çözüm avantajı
- KOSGEB Dijital Dönüşüm desteği: KOBİ'lere 50.000₺ hibe
- Türkiye'de FirmaCom'un modül kombinasyonuna rakip yok

---

## 3. YENİ MODÜLLER VE ÖZELLİKLER

### 3.1 AI & OCR Entegrasyonu

#### Neden Kritik?
Piyasa araştırması OCR belge tanıma özelliğini **etki/efor oranında en yüksek** (skor: 3.0) özellik olarak belirlemiştir. Mevcut 11 modülde kullanıcılar aynı şirket bilgilerini defalarca girmektedir — bu en büyük UX sürtüşme noktasıdır.

#### Teknik Stack (Belirlenen Kararlar)

| Katman | Çözüm | Gerekçe |
|--------|-------|---------|
| **Mobil Ön Tarama** | ML Kit Text Recognition v2 | Ücretsiz, on-device, Firebase native, RN paketi hazır |
| **Kimlik/Pasaport OCR** | Azure Document Intelligence `prebuilt-idDocument` | TC Kimlik için hazır şema; key-value extraction |
| **Fatura OCR** | Azure Document Intelligence `prebuilt-invoice` | Fatura alanları (KDV, tutar, vade) otomatik çıkarma |
| **Vergi Levhası Parsing** | Google Cloud Vision API + Gemini Flash | Aynı GCP ekosistemi; düz metin → yapılandırılmış JSON |
| **Belge Sınıflandırma** | Gemini Flash multimodal | Görsel → "fatura/sözleşme/kimlik/vergi_levhası" |
| **AI Chatbot Framework** | Firebase Genkit + Gemini Flash | Firebase native; model-agnostic; tek SDK |
| **Karmaşık AI Görevler** | GPT-5.4 mini / Claude Haiku 3.5 | Form analizi ve sözleşme özetleme |

#### 4 Temel OCR Kullanım Senaryosu

**Senaryo A — Kimlik Tarama → Otomatik Form Doldurma**
```
Kullanıcı "Kimlik Tara" → Kamera (mevcut scanner plugin) → Firebase Storage
  → Cloud Function: Azure prebuilt-idDocument
  → Ad, Soyad, TC No, Doğum Tarihi otomatik doldurulur
  → Kullanıcı onaylar → Firestore /users/{uid}/profile/kyc
```

**Senaryo B — Vergi Levhası Tarama → Şirket Bilgileri**
```
"Şirket Ekle" akışında → Vision API metin çıkarma
  → Gemini Flash: "VKN, şirket adı, vergi dairesi, adres JSON olarak çıkar"
  → Tüm talep formlarına auto-fill
```

**Senaryo C — Fatura OCR → E-Muhasebe**
```
Belge Yönetimi → PDF/görsel yükle
  → Azure prebuilt-invoice: fatura no, tarih, tutar, KDV, tedarikçi
  → Muhasebe modülüne otomatik aktarım (Faz 3)
```

**Senaryo D — Belge Sınıflandırma**
```
Yüklenen her belge → Gemini Flash multimodal
  → Otomatik klasörleme: fatura / sözleşme / kimlik / vergi levhası / diğer
  → Güven skoru ile birlikte Firestore'a kayıt
```

#### 4 AI Chatbot Senaryosu

- **Form Yardımcısı:** "Hangi POS tipini seçmeliyim?" → Gemini Flash + FirmaCom sistem prompt'u
- **Sözleşme Özetleme:** Uzun sözleşme metni → Claude Haiku 3.5 → Türkçe özet + risk uyarıları
- **SSS & Yönlendirme:** Intent detection → Bilinen SSS Firestore → Akıllı yanıt + modül yönlendirme
- **İhtiyaç Tahmini:** Firma profili → Gemini → "Bu sektördeki KOBİ'ler genellikle şu hizmetleri alıyor" cross-sell

#### Aylık AI Altyapı Maliyeti

| Kullanıcı Sayısı | Tahmini Aylık Maliyet |
|-----------------|----------------------|
| 100 aktif | ~$0.45 |
| 1.000 aktif | ~$18 |
| 10.000 aktif | ~$215 |

> **Not:** ML Kit on-device OCR sınırsız ücretsizdir. Maliyet optimizasyonu: önce ML Kit kalite kontrolü, yeterli ise cloud API atla.

---

### 3.2 E-Fatura / E-Arşiv (Wyse Entegrasyonu)

#### Neden Kritik?
Piyasa araştırmasında **etki skoru 10/10** (en yüksek). 2026 itibarıyla yıllık cirosu 150.000₺ üzerindeki tüm mükellefler e-fatura kapsamında. Paraşüt'ün en güçlü özelliği bu — FirmaCom'un en kritik eksikliği. Rakip platform Paraşüt günde ~5₺'den başlayan paketlerle bu segmentten gelir elde etmektedir.

#### Kapsam

| Özellik | Detay |
|---------|-------|
| E-Fatura Kesme | GIB onaylı e-fatura oluşturma ve gönderme |
| E-Arşiv | GIB portalına entegre arşiv yönetimi |
| E-İrsaliye | Sevk irsaliyesi dijital düzenlemesi |
| Fatura Takibi | Gönderilen/alınan fatura durumu |
| Otomatik Hatırlatma | Vadesi yaklaşan ödemeler için SMS/push |

#### Entegrasyon Yaklaşımı: Wyse API Partnersliği
- **Model:** Wyse (GIB onaylı entegratör) ile API partnersliği
- **Avantaj:** GIB özel entegratör lisansı edinmeden hızlı çıkış; Wyse altyapısı üzerinden GIB bağlantısı
- **Süre:** ~6-8 hafta (API entegrasyonu + test + GIB onayı)

#### Kullanıcı Akışı
```
FirmaCom Fatura Modülü → Fatura bilgileri girişi (ya da OCR ile otomatik)
  → Wyse API → GIB UBL formatı dönüşümü
  → GIB onayı → Alıcıya gönderim (e-posta + portal)
  → Firestore: fatura durumu kaydı → Kullanıcıya bildirim
```

#### Gelir Modeli
- **İşlem başı komisyon:** Wyse'dan gelir paylaşımı (her e-fatura işleminden)
- **Abonelik:** E-Fatura Paketi — aylık fatura kotasına göre katmanlı fiyatlandırma
- **Potansiyel:** ₺50–₺300/işletme/ay (Paraşüt referans fiyatı)

---

### 3.3 Chatbot & AI Kurulum Hizmeti

#### Konsept
FirmaCom, KOBİ'lere **AI chatbot kurulum ve bakım hizmeti** sunar. Bu, platform içi bir servis kategorisi olarak konumlandırılır: KOBİ'nin kendi web sitesine, WhatsApp Business API'sine veya iç kullanıma yönelik chatbot altyapısı FirmaCom tarafından kurulur ve yönetilir.

#### Kapsam

| Hizmet | İçerik |
|--------|--------|
| Web Chatbot Kurulumu | KOBİ web sitesine entegre AI destekli müşteri hizmetleri chatbotu |
| WhatsApp Business API | WhatsApp iş hattı entegrasyonu + otomatik yanıt akışları |
| Müşteri Hizmetleri Otomasyonu | SSS yanıtlama, randevu yönetimi, talep yönlendirme |
| Bakım Paketi | Aylık içerik güncellemesi, konuşma analizi, performans raporu |

#### Hedef Kitle
- Müşteri iletişimini otomatize etmek isteyen küçük perakendeciler, klinikler, hukuk büroları, muhasebe ofisleri
- WhatsApp Business'tan müşteri almak isteyen KOBİ'ler

#### Gelir Modeli
| Paket | Fiyat | İçerik |
|-------|-------|--------|
| Temel Chatbot | ₺4.999 kurulum ücreti | Web chatbot, temel SSS, 3 ay destek |
| WhatsApp Paketi | ₺7.999 kurulum + ₺999/ay bakım | WhatsApp Business API + otomasyon akışları |
| Tam Paket | ₺14.999 kurulum + ₺1.999/ay bakım | Web + WhatsApp + müşteri hizmetleri dashboard |

---

### 3.4 Teşvik & Hibe Bilgilendirme Modülü

#### Konsept
Türkiye'de KOBİ'lerin faydalanabileceği KOSGEB, TÜBİTAK, İŞKUR ve kalkınma ajansı desteklerini tek ekranda toplayan, **firma profiline göre kişiselleştirilen** akıllı bilgilendirme modülü.

**Piyasa Fırsatı:** KOSGEB'in KOBİ'lere dijital dönüşüm için 50.000₺'ye kadar hibe verdiği bilinmektedir. Ancak bu programlara başvurma oranı düşük; bilgiye erişim sorunu var.

#### Özellikler

| Özellik | Detay |
|---------|-------|
| Teşvik Veritabanı | KOSGEB, TÜBİTAK, İŞKUR, 26 bölge kalkınma ajansı destekleri |
| Kişiselleştirilmiş Eşleştirme | Firma sektörü + çalışan sayısı + kuruluş yılına göre uygun teşvikler |
| Başvuru Takvimi | Vade tarihi 7 gün kala push notification |
| Premium: Başvuru Yardımı | FirmaCom iş ortağı danışmanları ile başvuru hazırlama hizmeti |
| Teşvik Takibi | Başvurulan destek programlarının durum takibi |

#### Gelir Modeli
- Temel liste görüntüleme: Ücretsiz (kullanıcı edinim aracı)
- Premium eşleştirme + bildirimler: Pro katmana dahil
- Başvuru yardımı hizmeti: Danışmanlık ücreti (₺1.500–₺5.000/başvuru) + başarıya dayalı komisyon

---

### 3.5 Ticari Duyurular Modülü

#### Konsept
Türkiye'deki KOBİ'leri etkileyen resmi duyuruları, mevzuat değişikliklerini ve vergi takvimini tek ekranda sunan, push notification destekli akıllı bildirim modülü.

**Piyasa Araştırması Skoru:** Vergi takvimi + hatırlatma özelliği **hız/değer oranında 3.5/5** ile en hızlı kazanımlar arasında yer almaktadır.

#### İçerik Kategorileri

| Kategori | Kaynak | Sıklık |
|----------|--------|--------|
| Vergi Takvimi | GIB, Türkiye Cumhuriyet takvimi | Dönemsel |
| SGK Duyuruları | SGK resmi kanalları | Aylık |
| Ticaret Bakanlığı | Mevzuat değişiklikleri | Değişken |
| KOSGEB Haberleri | Yeni destek programları, son başvuru tarihleri | Haftalık |
| Sektörel Haberler | İlgili sektör basını | Günlük (opsiyonel) |

#### Teknik Yapı
- Firestore `/news` koleksiyonu (mevcut altyapı üzerine)
- Admin panelinden içerik yönetimi
- FCM push notification (Faz 0'da kurulacak)
- Kullanıcı sektör tercihine göre kişiselleştirilmiş bildirim

#### Gelir Modeli
- Temel vergi takvimi: Ücretsiz (engagement + retention)
- Sektörel haber akışı + öncelikli bildirimler: Pro katmana dahil
- Ticari partnerlikler: Bankalar/sigortacıların kampanya duyuruları (sponsorlu içerik)

---

### 3.6 Piyasa Araştırmasından Quick Win Özellikleri

Piyasa araştırması önceliklendirme matrisinden en yüksek etki/efor oranına sahip ek özellikler:

| # | Özellik | Etki/Efor Skoru | Faz | Neden Önce |
|---|---------|----------------|-----|-----------|
| 1 | **Akıllı Form Doldurma** (mevcut Firebase verisi → auto-fill) | 4.0 | Faz 0 | Sıfır bağımlılık; mevcut Firestore veri modeli yeterli |
| 2 | **Fatura Takibi & SMS Hatırlatma** | 4.0 | Faz 1 | Sözleşme modülü altyapısı var |
| 3 | **Google My Business Entegrasyonu** | 2.3 | Faz 2 | KOBİ'lerin %40'ı Google haritada profil eksik; API ücretsiz |
| 4 | **KVKK Uyumluluk Şablonları** | 2.3 | Faz 2 | İçerik tabanlı; geliştirme minimal; KOBİ için yüksek değer |
| 5 | **SGK İşe Giriş/Çıkış Bildirimi** | 2.0 | Faz 3 | Yasal zorunluluk; HR modülüne giriş kapısı |
| 6 | **Muhasebe Entegrasyonu (Paraşüt API)** | 1.8 | Faz 3 | Muhasebe bürosu kanalı açar; Paraşüt API belgelendi |

---

## 4. FAZ PLANI (TİMELİNE)

### Genel Bakış

```
HAFTA:  1   2   3   4 | 5   6   7   8 | 9  10  11  12  13  14  15  16 | 17  18  19  20  21  22  23  24 | AY 7-12
        ├── FAZ 0 ────┤├─── FAZ 1 ────┤├────────── FAZ 2 ─────────────┤├────────── FAZ 3 ─────────────┤├── FAZ 4 ──┤
        Canlıya         AI & OCR         E-Fatura &                      Büyüme &                         Ölçeklendirme
        Hazırlık        MVP              Yeni Hizmetler                  Monetizasyon
```

---

### FAZ 0 — Canlıya Hazırlık (Hafta 1–4)

**Hedef:** Ürünü güvenli, kararlı ve yönetilebilir hale getirmek.

#### Güvenlik Blocker'larını Kapat (Hafta 1)

| # | Görev | Önem | Tahmini Süre |
|---|-------|------|-------------|
| G-1 | `users` koleksiyonu `allow read: if true` kuralını kaldır | P0 BLOCKER | 0.5 gün |
| G-2 | `offers` write kuralını sadece admin'e kısıtla | P0 BLOCKER | 0.5 gün |
| G-3 | Debug App Check token'ı `.env`'e taşı | P0 BLOCKER | 1 gün |
| G-4 | Firebase API key'lerini `.env`/config'e taşı | P0 BLOCKER | 1 gün |
| G-5 | Google Client ID'yi environment variable'a taşı | P1 | 0.5 gün |

#### Backend Bağlantılarını Tamamla (Hafta 1–2)

| # | Görev | Önem | Tahmini Süre |
|---|-------|------|-------------|
| B-1 | Tüm talep ekranları → Firestore `companies/{id}/requests/{id}` koleksiyonuna yaz | P0 BLOCKER | 3–5 gün |
| B-2 | `App.tsx` `handleSplashFinish` scope hatasını düzelt | P0 BLOCKER | 0.5 gün |
| B-3 | Firebase Storage entegrasyonu — belge yükleme cloud'a taşı | P1 | 3 gün |
| B-4 | Sözleşmeler modülü: işlevsel hale getir veya "Yakında" etiketi ekle | P1 | 2 gün |

#### Admin Paneli MVP (Hafta 2–3)

| # | Görev | Tahmini Süre |
|---|-------|-------------|
| A-1 | Admin giriş sayfası (isAdmin kontrolü) | 1 gün |
| A-2 | Haber ekleme/düzenleme/yayınlama | 2 gün |
| A-3 | Kampanya yönetimi | 1 gün |
| A-4 | Talep listesi görüntüleme (temel) | 2 gün |

#### UI/UX Temel İyileştirmeleri (Hafta 3–4)

*Tasarım dokümanından tespit edilen hızlı kazanımlar:*

| # | Görev | Etki | Süre |
|---|-------|------|------|
| U-1 | Register `placeholderTextColor="#FFFFFF80"` düzelt | Görünürlük dramatik artış | 15 dk |
| U-2 | `backdropFilter` CSS kaldır (React Native desteklemiyor) | Sessiz hata düzelir | 15 dk |
| U-3 | Web `iconColor` `#667eea` → `#1B46B5` (renk tutarlılığı) | Görsel tutarlılık | 15 dk |
| U-4 | Dashboard'a haber bölümü ekle (AuthContext zaten hazır) | İçerik doluluğu | 2 saat |
| U-5 | Tab bar özel stil ve aktif indikatör | Profesyonel görünüm | 2 saat |
| U-6 | `FormField` ve `PrimaryButton` ortak component | Geliştirici üretkenliği | 2 gün |
| U-7 | Talep detay ekranına step progress bar | UX iyileştirme | 1 gün |
| U-8 | FCM push notification temel kurulumu | Bildirim altyapısı | 2 gün |
| U-9 | Firebase Crashlytics + temel analytics | İzleme | 1 gün |
| U-10 | Akıllı form doldurma (firma bilgileri auto-fill) | Retention artışı | 2 gün |

**Faz 0 Çıkış Kriteri:**
- [ ] Tüm P0 güvenlik açıkları kapatılmış
- [ ] Talepler Firestore'a yazılıyor
- [ ] Admin paneli çalışıyor
- [ ] Crashlytics aktif
- [ ] App Store / Google Play başvuruya hazır

---

### FAZ 1 — AI & OCR MVP (Hafta 5–8)

**Hedef:** Türkiye'de eşsiz: kimlik tarama, form otomasyonu ve akıllı chatbot ile rakipsiz UX.

#### Hafta 5–6: OCR Temeli

| # | Görev | Araç | Süre |
|---|-------|------|------|
| O-1 | Google Cloud Vision API aktif et (aynı GCP projesi — 1 tık) | GCP Console | 1 gün |
| O-2 | Azure Document Intelligence Free tier hesabı aç | Azure Portal | 1 gün |
| O-3 | Firebase Genkit + Gemini Flash kurulumu | Cloud Functions | 1 gün |
| O-4 | ML Kit React Native paketi entegrasyonu | npm | 0.5 gün |
| O-5 | Cloud Function: `processIDDocument` (Azure prebuilt-idDocument) | Node.js | 2 gün |
| O-6 | Cloud Function: `processTaxDocument` (Vision + Gemini parse) | Node.js | 2 gün |
| O-7 | RN: Kamera → Storage upload → Firestore dinleyici akışı | React Native | 2 gün |
| O-8 | Kimlik tarama → kayıt formu auto-fill UI | React Native | 1.5 gün |

#### Hafta 7–8: AI Chatbot & Fatura OCR

| # | Görev | Araç | Süre |
|---|-------|------|------|
| O-9 | Vergi levhası tarama → şirket bilgileri akışı | Genkit + Gemini | 2 gün |
| O-10 | Cloud Function: `processInvoice` (Azure prebuilt-invoice) | Azure SDK | 1.5 gün |
| O-11 | Belge sınıflandırma (Gemini Flash multimodal) | Genkit | 1 gün |
| C-1 | `aiChat` Cloud Function (Genkit + Gemini Flash) | Genkit | 2 gün |
| C-2 | FirmaCom sistem prompt'u yazımı (Türkçe, modül bazlı) | — | 1 gün |
| C-3 | Konuşma geçmişi Firestore'a kayıt | Firestore | 1 gün |
| C-4 | React Native: Chat UI component | React Native | 2 gün |
| C-5 | Web: Chat widget (React/Vite) | React | 1.5 gün |
| C-6 | Sözleşme özetleme (Claude Haiku 3.5 entegrasyonu) | Anthropic SDK | 1 gün |

**Faz 1 Çıkış Kriteri:**
- [ ] TC Kimlik tarama → form doldurma canlıda (mobil + web)
- [ ] Vergi levhası tarama → şirket bilgileri otomatik doluyor
- [ ] Fatura OCR aktif
- [ ] AI chatbot mobil + web'de kullanılabilir
- [ ] Belge sınıflandırma çalışıyor

---

### FAZ 2 — E-Fatura & Yeni Hizmetler (Hafta 9–16)

**Hedef:** Paraşüt'e rakip konumlanma; yeni gelir kanalları açma.

#### Hafta 9–12: Wyse E-Fatura Entegrasyonu

| # | Görev | Süre |
|---|-------|------|
| E-1 | Wyse API partner anlaşması + teknik dokümantasyon | 1 hafta |
| E-2 | E-fatura UI: fatura oluşturma formu (OCR auto-fill destekli) | 1.5 hafta |
| E-3 | Wyse API entegrasyonu: fatura gönderme + durum sorgulama | 1 hafta |
| E-4 | E-arşiv: gönderilen/alınan fatura listesi ve indirme | 0.5 hafta |
| E-5 | Vadesi yaklaşan fatura push notification | 0.5 hafta |
| E-6 | GIB test ortamı + canlı geçiş | 1 hafta |

#### Hafta 11–14: Yeni Hizmet Modülleri

| # | Görev | Süre |
|---|-------|------|
| H-1 | Chatbot & AI Kurulum Hizmeti: talep sayfası + form | 1 hafta |
| H-2 | Chatbot hizmet sipariş akışı (katalog → teklif → onay) | 1 hafta |
| H-3 | Teşvik & Hibe Modülü v1: teşvik veritabanı + liste görüntüleme | 1 hafta |
| H-4 | Teşvik kişiselleştirme (firma sektörüne göre filtreleme) | 1 hafta |
| H-5 | Başvuru tarihi push notification | 0.5 hafta |
| H-6 | Google My Business entegrasyonu (profil oluşturma + yönetimi) | 1.5 hafta |
| H-7 | KVKK uyumluluk şablon paketi | 0.5 hafta |

#### Hafta 13–16: Ticari Duyurular & Tamamlama

| # | Görev | Süre |
|---|-------|------|
| T-1 | Ticari Duyurular modülü: içerik yapısı + Firestore şeması | 1 hafta |
| T-2 | Vergi takvimi ekranı + kategorize duyuru listesi | 1 hafta |
| T-3 | Sektör bazlı kişiselleştirilmiş push notification | 0.5 hafta |
| T-4 | Admin panelinde içerik yönetimi | 0.5 hafta |
| T-5 | Fatura takibi & SMS hatırlatma sistemi | 1 hafta |

**Faz 2 Çıkış Kriteri:**
- [ ] E-fatura / e-arşiv canlıda (Wyse üzerinden)
- [ ] Chatbot & AI Kurulum hizmet sayfası aktif, ilk siparişler alınıyor
- [ ] Teşvik modülü yayında; KOSGEB/TÜBİTAK verileri güncel
- [ ] Ticari duyurular + vergi takvimi bildirimleri çalışıyor

---

### FAZ 3 — Büyüme & Monetizasyon (Hafta 17–24)

**Hedef:** Premium katman lansmanı; yüksek ARPU özellikler; müşteri kitlemesi (lock-in).

| # | Görev | Tahmini Süre | Stratejik Değer |
|---|-------|-------------|----------------|
| M-1 | Premium katman ödeme altyapısı (Iyzico / Stripe) | 2 hafta | Doğrudan gelir |
| M-2 | CRM Modülü MVP: müşteri listesi, iletişim geçmişi, basit pipeline | 8–10 hafta | Yüksek retention |
| M-3 | Muhasebe entegrasyonu (Paraşüt API) | 4–5 hafta | Muhasebe bürosu kanalı |
| M-4 | SGK İşe Giriş/Çıkış Bildirimi modülü | 3–4 hafta | HR segmenti girişi |
| M-5 | İzin takibi (Kolay İK alternatifl) | 2–3 hafta | HR mini-suite |
| M-6 | Personel dosya yönetimi (Belge modülü uzantısı) | 1–2 hafta | Mevcut altyapı sinerji |
| M-7 | Nakit akış tahminleme (kural tabanlı v1) | 4–6 hafta | Finansal danışmanlık değeri |
| M-8 | Banka/sigorta/telekom lead komisyon anlaşmaları | 4 hafta (BD) | Komisyon geliri |
| M-9 | Kargo entegrasyonu (Yurtiçi, MNG, Aras) | 3–4 hafta | E-ticaret segmenti |

**Faz 3 Çıkış Kriteri:**
- [ ] Ödeme altyapısı canlıda; aylık abonelik geliri başlıyor
- [ ] CRM modülü beta yayında
- [ ] Muhasebe entegrasyonu aktif; muhasebe büroları B2B2C kanalı açılıyor
- [ ] HR mini-suite (SGK + izin + personel dosyası) yayında
- [ ] En az 2 banka/sigorta/telekom partner anlaşması imzalanmış

---

### FAZ 4 — Ölçeklendirme (Ay 7–12)

**Hedef:** Türkiye'nin önde gelen KOBİ "super app" konumunu pekiştirmek.

| Girişim | Detay | Hedef Süre |
|---------|-------|-----------|
| **Gelişmiş AI** | Sözleşme risk analizi, ML tabanlı nakit akış modeli, fraud tespiti | Ay 7–9 |
| **API-First Platform** | Muhasebe bürolarına ve 3. parti yazılımlara FirmaCom API satışı (B2B2B) | Ay 8–10 |
| **Bordro Yönetimi** | Türkiye vergi mevzuatı tabanlı; SGK matrahı hesaplama | Ay 9–12 |
| **Stok / Envanter** | Basit stok girişi/çıkışı, barkod okuma, kritik stok uyarısı | Ay 8–10 |
| **Partner Ekosistemi** | Muhasebe büroları, İSG firmaları, hukuk büroları marketplace | Ay 10–12 |
| **Şirket Kuruluş Rehberi** | MERSIS/Ticaret Sicil akışı desteği; Stripe Atlas benzeri | Ay 9–11 |
| **Beyaz Etiket (White-Label)** | Bankalara veya meslek odalarına platform lisanslama | Ay 11–12 |

---

## 5. MONETİZASYON STRATEJİSİ

### 5.1 Fiyatlandırma Katmanları

| Katman | Aylık Fiyat | Hedef Segment | Temel Özellikler |
|--------|-------------|---------------|-----------------|
| **Ücretsiz** | ₺0 | Yeni kayıt, keşif | 5 hizmet talebi/ay, 5GB belge, vergi takvimi, teşvik listesi |
| **Başlangıç** | ₺299/ay | 1–5 çalışanlı KOBİ | Sınırsız hizmet talebi, 50GB belge, AI form doldurma, OCR, chatbot |
| **Profesyonel** | ₺599/ay | 5–50 çalışanlı KOBİ | + E-fatura (100 belge/ay), SGK bildirimleri, izin takibi, CRM, muhasebe entegrasyonu |
| **Kurumsal** | ₺1.499/ay | 50+ çalışanlı, çoklu şube | + Bordro, sınırsız kullanıcı, API erişimi, öncelikli destek, özel entegrasyon |

### 5.2 Modül Bazlı Gelir Modelleri

| Modül | Gelir Modeli | Tahmini Gelir/Kullanıcı/Ay |
|-------|-------------|--------------------------|
| E-Fatura / E-Arşiv | Abonelik + işlem başı | ₺50–₺300 |
| Chatbot Kurulum Hizmeti | Kurulum ücreti + bakım | ₺999–₺1.999 (bakım) |
| Teşvik Başvuru Yardımı | Danışmanlık + başarıya dayalı komisyon | ₺1.500–₺5.000 |
| Banka Hesabı Lead | Bankadan referans ücreti | ₺200–₺500/başvuru |
| Sigorta Lead | Sigorta şirketinden komisyon | Prim'in %5–15'i |
| POS Kurulumu Lead | Banka/ödeme kuruluşundan | ₺150–₺400/terminal |
| Kargo İşlemi | Kargo firmasından hacim bonusu | ₺2–₺5/gönderi |
| E-Fatura (işlem) | Wyse'dan gelir paylaşımı | ₺0.20–₺0.50/fatura |
| Bordro (per-employee) | Doğrudan | ₺30–₺80/çalışan/ay |

### 5.3 Tahmini ARPU ve Gelir Projeksiyonu

**Varsayımlar:**
- Ücretsiz → Başlangıç dönüşüm oranı: %25
- Başlangıç → Profesyonel dönüşüm: %30
- Ortalama e-fatura işlem geliri: ₺100/kullanıcı/ay (Profesyonel+)
- Komisyon gelirleri: aylık aktif kullanıcı başına ₺50 ortalama

| Dönem | Aktif Kullanıcı | Ort. ARPU | Tahmini ARR |
|-------|----------------|-----------|------------|
| Faz 0 tamamı (Ay 1) | 100 | ₺0 (beta) | — |
| Faz 1 tamamı (Ay 2) | 300 | ₺150 | ~₺540.000 |
| Faz 2 tamamı (Ay 4) | 800 | ₺320 | ~₺3.072.000 |
| Faz 3 tamamı (Ay 6) | 2.000 | ₺480 | ~₺11.520.000 |
| Faz 4 tamamı (Ay 12) | 6.000 | ₺650 | ~₺46.800.000 |

> **Not:** Bu projeksiyonlar mevcut piyasa verileri ve rakip fiyatlandırma referansı ile hazırlanmıştır. Gerçek değerler büyüme hızına, satış kapasitesine ve piyasa koşullarına göre değişir.

### 5.4 Komisyon Bazlı Gelir Fırsatları

**Banka Partnerlikleri (Faz 3):**
- Ziraat, Garanti, İş Bankası, Yapı Kredi KOBİ segmenti lead anlaşmaları
- Potansiyel: Aylık 100 başvuru × ₺350 ortalama = ₺35.000/ay

**Telekom (Mevcut Hat Modülü Üzerinden):**
- Vodafone, Turkcell, Türk Telekom kurumsal hat B2B reseller
- Lead ücreti veya ciro paylaşımı modeli

**Sigorta:**
- Dijital sigorta lead anlaşması (Allianz, Anadolu Sigorta)
- Mevcut Sigorta talep modülü üzerinden aktivasyon

---

## 6. TEKNİK GEREKSİNİMLER

### 6.1 Faz Bazlı Altyapı Gereksinimleri

| Faz | Altyapı Gereksinimi | Tahmini Maliyet/Ay |
|-----|--------------------|--------------------|
| **Faz 0** | Firebase Blaze plan, FCM, Crashlytics | ~₺0–500 |
| **Faz 1** | Google Cloud Vision API, Azure Document Intelligence (Free tier), Gemini API, OpenAI API | ~$20–50/ay |
| **Faz 2** | Wyse API lisansı/komisyon, Twilio/NetGSM SMS API | Wyse: gelir paylaşımı; SMS: ~₺0.10/SMS |
| **Faz 3** | Ödeme altyapısı (Iyzico: %2.49 + ₺0.25/işlem), muhasebe API erişimi, Paraşüt API | ~₺500–2.000/ay |
| **Faz 4** | Ayrı API gateway (Kong/Apigee), CDN (Cloudflare), monitoring (Datadog) | ~$200–500/ay |

### 6.2 API Entegrasyon Listesi

| Entegrasyon | Faz | Tip | Durum |
|------------|-----|-----|-------|
| Google Cloud Vision | Faz 1 | OCR | Aynı GCP projesi |
| Azure Document Intelligence | Faz 1 | OCR + Parsing | Yeni hesap |
| Firebase Genkit | Faz 1 | AI Framework | npm paketi |
| Gemini API | Faz 1 | LLM | Aistudio.google.com |
| OpenAI API | Faz 1 | LLM | platform.openai.com |
| Anthropic Claude | Faz 1 | LLM (doküman) | anthropic.com |
| Wyse API | Faz 2 | E-Fatura | Partner anlaşması |
| Google My Business API | Faz 2 | Dijital Pazarlama | GCP OAuth |
| Twilio/NetGSM | Faz 2 | SMS Bildirimi | Hesap açma |
| Iyzico / Stripe | Faz 3 | Ödeme | Hesap açma |
| Paraşüt API | Faz 3 | Muhasebe Entegrasyon | Paraşüt developer portal |
| SGK Web Servisleri | Faz 3 | Yasal | Elektronik imza + sertifika |
| Yurtiçi/MNG Kargo API | Faz 3 | Kargo | Partner anlaşması |

### 6.3 Tahmini Geliştirme Maliyeti

| Faz | Süre | Geliştirici Kaynak | Tahmini Maliyet (₺) |
|-----|------|-------------------|---------------------|
| Faz 0 | 4 hafta | 2 full-stack developer | ₺120.000–₺160.000 |
| Faz 1 | 4 hafta | 2 full-stack + 0.5 ML | ₺150.000–₺200.000 |
| Faz 2 | 8 hafta | 3 full-stack + 1 backend | ₺380.000–₺480.000 |
| Faz 3 | 8 hafta | 3 full-stack + 1 backend + 0.5 PM | ₺450.000–₺580.000 |
| Faz 4 | 6 ay | 4+ full-stack + DevOps | ₺1.200.000–₺1.800.000 |

---

## 7. KPI VE BAŞARI METRİKLERİ

### 7.1 Kullanıcı Edinme Hedefleri

| Metrik | 3. Ay (Faz 1 Sonu) | 6. Ay (Faz 2 Sonu) | 12. Ay (Faz 4 Başı) |
|--------|-------------------|--------------------|---------------------|
| Toplam Kayıtlı Kullanıcı | 500 | 2.500 | 10.000 |
| Aktif Kullanıcı (MAU) | 300 | 1.500 | 6.000 |
| Ücretli Kullanıcı | — | 400 | 2.000 |
| Ücretli Kullanıcı Oranı | — | %27 | %33 |

### 7.2 Ürün Sağlığı Metrikleri

| Metrik | Hedef (6. Ay) | Hedef (12. Ay) | Ölçüm Yöntemi |
|--------|--------------|----------------|---------------|
| **Talep Tamamlanma Oranı** | >%75 | >%85 | Firestore `requests` koleksiyonu |
| **Günlük Aktif / Aylık Aktif (DAU/MAU)** | >%30 | >%40 | Firebase Analytics |
| **OCR Doğruluk Oranı** | >%90 | >%95 | AI model confidence skoru |
| **Chatbot Çözüm Oranı** | >%60 | >%75 | Chat session → escalation oranı |
| **Belge Yükleme Başarı Oranı** | >%95 | >%98 | Storage upload event |
| **Uygulama Çakışma Oranı** | <%0.5 | <%0.1 | Firebase Crashlytics |

### 7.3 Gelir Metrikleri

| Metrik | 3. Ay | 6. Ay | 12. Ay |
|--------|-------|-------|--------|
| **MRR (Aylık Yinelenen Gelir)** | ₺0 (beta) | ₺250.000 | ₺2.500.000 |
| **ARPU (Aylık Kullanıcı Başına Gelir)** | — | ₺167 | ₺417 |
| **Komisyon Geliri (Aylık)** | ₺0 | ₺30.000 | ₺200.000 |
| **E-Fatura İşlem Geliri (Aylık)** | — | ₺15.000 | ₺150.000 |
| **Chatbot Kurulum Satışı (Aylık)** | — | ₺50.000 | ₺300.000 |
| **ARR** | — | ₺3.540.000 | ₺35.400.000 |

### 7.4 Müşteri Deneyimi Metrikleri

| Metrik | Hedef (6. Ay) | Hedef (12. Ay) |
|--------|--------------|----------------|
| **NPS (Net Promoter Score)** | >40 | >55 |
| **Aylık Churn Oranı** | <%3 | <%1.5 |
| **Destek Talebi/Aktif Kullanıcı** | <0.2 | <0.1 |
| **Onboarding Tamamlama Oranı** | >%65 | >%80 |
| **App Store Puanı** | >4.2 | >4.5 |

---

## 8. RİSK ANALİZİ

### 8.1 Teknik Riskler

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|-----------|
| **OCR Türkçe doğruluk sorunu** | Orta | Yüksek | ML Kit (ücretsiz) + Azure prebuilt (kimlik için hazır şema) hibrit yaklaşımı; düşük güven skoru → kullanıcıdan manuel onay |
| **Firebase ölçeklenme** | Düşük | Yüksek | Firebase Blaze plan + Firestore composite index optimizasyonu; 10K+ kullanıcıda Cloud Run'a taşıma hazırlığı |
| **E-fatura GIB API değişiklikleri** | Orta | Yüksek | Wyse partnersliği bu riski absorbe eder; Wyse GIB uyumunu yönetir |
| **AI model maliyeti aşımı** | Orta | Orta | On-device ML Kit önce; cloud API maliyet takip sistemi; rate limiting; Gemini Flash tercih (en ekonomik) |
| **Mevcut JS/TS mixed codebase** | Yüksek | Orta | Faz 0'da kritik ekranları TypeScript'e taşı; yeni özellikler TS zorunlu |
| **Belge güvenliği / KVKK** | Orta | Çok Yüksek | OCR sonrası ham görsel 24 saatte Firebase Storage'dan sil; kimlik verileri şifreli Firestore; KVKK uyumluluk dokümanı hazırla |

### 8.2 Piyasa Riskleri

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|-----------|
| **Paraşüt / rakip hızlı kopyalama** | Orta | Orta | Network efekti (komisyon anlaşmaları, çoklu modül lock-in) ile savunma; hızlı ürün çıkış temposu |
| **GIB e-fatura zorunluluğu gecikmesi** | Düşük | Orta | E-fatura dışındaki modüllerden gelir; teşvik modülü ile KOSGEB sezonsal aktivasyon |
| **KOBİ dijital dönüşüm direnci** | Orta | Orta | Ücretsiz katman ile düşük eşikli giriş; mobil-first kolay UX; WhatsApp ile destek kanalı |
| **Ekonomik kriz — KOBİ harcama kısıtı** | Orta | Yüksek | Komisyon modeli (platform ücretsiz; sadece hizmet alındığında ödeme); işlem bazlı gelir modeli kriz döneminde avantajlı |
| **Yerli rakip girişi** | Düşük | Orta | Hızlı modül genişlemesi ile piyasa kapama; mevcut müşteri verisi → switching cost |

### 8.3 Rekabet Riskleri

| Rakip | Risk Senaryosu | Olasılık | FirmaCom Savunması |
|-------|---------------|----------|-------------------|
| **Paraşüt** | Operasyonel talep modülleri (hat, POS, HGS) ekler | Düşük | Paraşüt muhasebe odaklı; operasyonel B2B hizmetler FirmaCom'un çekirdeği |
| **Kolay İK** | Platform genişler, talep modülleri ekler | Çok Düşük | Kolay İK HR-only; genişleme maliyeti yüksek |
| **Logo / Mikro** | KOBİ SaaS'a dönüşür, mobil-first odak | Düşük | Kurumsal odaklı; KOBİ UX değil; fiyat erişilemez |
| **Yeni girişim (yurt dışı)** | Rippling/Deel Türkiye'ye giriş | Düşük | Türkiye regülasyon (SGK, GIB) karmaşıklığı; yerli bilgi avantajı |
| **Bankalar (Papara, Tosla)** | KOBİ super app iddiası | Orta | Bankacılık lisansı sınırı; operasyonel B2B hizmetlerde FirmaCom önde |

### 8.4 Yasal / Düzenleyici Riskler

| Risk | Olasılık | Etki | Mitigasyon |
|------|----------|------|-----------|
| **BDDK fintech düzenlemesi** | Orta | Orta | Ödeme aracılığı yapmıyoruz (sadece yönlendiriyoruz); hukuki danışmanlık al |
| **KVKK cezası** | Düşük | Yüksek | OCR veri minimizasyonu; VERBİS kaydı; açık rıza metni; hukuki inceleme |
| **GIB entegratör lisans gereksinimi** | Orta | Yüksek | Wyse partnersliği bu riski ortadan kaldırır |
| **SGK web servisi erişim** | Orta | Orta | Elektronik imza + sertifika erişimi; alternatif: muhasebeci aracılığı |

---

## EKLER

### Ek A: Hızlı Kazanımlar — Bu Ay Uygulanabilecekler (Sıfır Geliştirme)

1. **Vergi takvimi PDF** → Mevcut kullanıcılara e-posta gönder → Engagement ölç
2. **KVKK şablon paketi** → Belge yönetiminde hazır şablon → ₺299 "Yasal Paket" sat
3. **Google Cloud Vision API aktif et** → Aynı GCP projesi, tek tık, ücretsiz tier
4. **Papara İşletme / Tosla ile lead anlaşması görüşmesi** → Banka hesabı yönlendirmesi için anlaşma
5. **Allianz/Anadolu Sigorta dijital lead anlaşması** → Mevcut sigorta modülü üzerinden

### Ek B: Teknoloji Stack Özeti

```
MEVCUT:
├── Mobil: React Native 0.80 + Firebase (Firestore, Auth, App Check)
├── Web: React 19 + Vite + Firebase
└── Backend: Firebase Cloud Functions (Node.js)

EKLENECEK (Faz 1):
├── OCR: ML Kit + Google Cloud Vision + Azure Document Intelligence
├── AI Framework: Firebase Genkit
├── AI Modeller: Gemini Flash (ana) + GPT-5.4 mini + Claude Haiku 3.5
└── Belge İşleme: Storage tetikleyici Cloud Functions pipeline

EKLENECEK (Faz 2-3):
├── E-Fatura: Wyse API
├── SMS: Twilio / NetGSM
├── Ödeme: Iyzico
└── Muhasebe: Paraşüt API

EKLENECEK (Faz 4):
├── API Gateway: Kong / Apigee
├── Monitoring: Datadog / New Relic
└── CDN: Cloudflare
```

### Ek C: Rakip Karşılaştırma Özeti

| Özellik | FirmaCom (Hedef) | Paraşüt | Kolay İK | Logo |
|---------|-----------------|---------|---------|------|
| Hizmet Talepleri (Hat, POS, HGS, KEP) | ✅ | ❌ | ❌ | ❌ |
| E-Fatura / E-Arşiv | Faz 2 → ✅ | ✅ | ❌ | ✅ |
| AI & OCR | Faz 1 → ✅ | ❌ | ❌ | ❌ |
| Teşvik & Hibe Bilgi | Faz 2 → ✅ | ❌ | ❌ | ❌ |
| Chatbot Kurulum Hizmeti | Faz 2 → ✅ | ❌ | ❌ | ❌ |
| HR / Bordro | Faz 4 → ✅ | ❌ | ✅ | ✅ |
| CRM | Faz 3 → ✅ | ❌ | ❌ | Kısmen |
| Mobil-First | ✅ | ❌ | ✅ | ❌ |
| Firebase / Cloud Native | ✅ | ❌ | ❌ | ❌ |
| Fiyat (Başlangıç) | ₺299/ay | ₺299/ay | Kurumsal | ₺500+/ay |

---

*Bu doküman FirmaCom / FinHouse stratejik planlama sürecinin çıktısıdır. Kaynak: FirmaCom teknik analiz (Mart 2025), piyasa araştırması (Mart 2026), AI/OCR teknik plan (Mart 2026), UI/UX iyileştirme planı (Mart 2025). Yönetim kurulu onayına sunulmak üzere hazırlanmıştır.*

**Son Güncelleme:** Mart 2026  
**Hazırlayan:** OpenClaw AI — FirmaCom Strateji Ekibi
