# FirmaCom Mobil Uygulama — Detaylı Yazılım Geliştirme Dokümanı v2

**Hazırlayan:** Finhouse AI  
**Tarih:** 2026-04-03  
**Versiyon:** 2.0  
**Hedef Kitle:** Yazılım Geliştirme Ekibi  
**Framework:** React Native 0.80.1 + TypeScript  
**Durum:** Aktif Geliştirme

---

## İÇİNDEKİLER

1. [Proje Genel Bakış](#1-proje-genel-bakış)
2. [Teknik Stack ve Bağımlılıklar](#2-teknik-stack-ve-bağımlılıklar)
3. [Navigasyon Mimarisi](#3-navigasyon-mimarisi)
4. [Ekran Envanteri — Detaylı](#4-ekran-envanteri--detaylı)
5. [Kullanıcı Akışları](#5-kullanıcı-akışları)
6. [Firestore Veri Modeli](#6-firestore-veri-modeli)
7. [API Entegrasyonları](#7-api-entegrasyonları)
8. [State Yönetimi](#8-state-yönetimi)
9. [Hata Yönetimi ve Edge Case'ler](#9-hata-yönetimi-ve-edge-caseler)
10. [Teknik Borç ve Refactor Planı](#10-teknik-borç-ve-refactor-planı)
11. [Test Senaryoları](#11-test-senaryoları)
12. [Gelir Modeli Teknik Entegrasyon](#12-gelir-modeli-teknik-entegrasyon)
13. [Sprint Planı](#13-sprint-planı)

---

## 1. Proje Genel Bakış

FirmaCom, KOBİ'lerin (1-50 çalışan) belge yönetimi ve finansal/operasyonel hizmet taleplerini tek bir mobil uygulamadan yönetmesini sağlayan bir platformdur.

### Temel Özellikler
- Belge yükleme, AI ile otomatik analiz (GPT-4o Vision)
- 11 kategoride hizmet talebi (banka, POS, HGS, sigorta, KEP vb.)
- Dijital sözleşme arşivi
- Firebase tabanlı auth + Firestore veri katmanı
- Lead generation komisyon modeli

### Gelir Kaynakları
1. **Lead Gen Komisyon:** Banka/POS/Sigorta talepleri → partner kurumdan komisyon
2. **Reklam (AdMob):** Native ads ana sayfa ve liste ekranlarında
3. **Premium Abonelik:** Sınırsız AI analiz + reklamsız deneyim

---

## 2. Teknik Stack ve Bağımlılıklar

### Core
```
React Native 0.80.1 (New Architecture önerilir)
TypeScript (mevcut: sadece AppNavigator.tsx — migration gerekli)
Firebase: Auth + Firestore + App Check v23.4.0 (modular API)
React Navigation v7 (NativeStack + BottomTabs)
```

### Mevcut Paketler
```
react-native-linear-gradient   → gradient arka planlar
react-native-fs (RNFS)        → dosya sistemi (PDF işleme)
react-native-share             → belge paylaşımı
react-native-pdf               → PDF önizleme
react-native-webview           → web içeriği
react-native-async-storage     → yerel depolama (onboarding, rememberme)
phosphor-react-native          → ikon seti (tab bar'a geçildi)
react-native-linear-gradient   → UI gradient'lar
```

### Önerilen Eklemeler
```
@tanstack/react-query v5        → async state + cache yönetimi
react-native-config             → .env okuma (secrets için gerekli)
react-native-purchases (RevenueCat) → in-app purchase
@react-native-google-mobile-ads → AdMob
```

---

## 3. Navigasyon Mimarisi

### Yapı Şeması
```
AppNavigator
├── LoadingScreen (auth initializing || onboarding check)
├── AuthStack (user == null)
│   ├── LandingPage (hasSeenOnboarding == false)
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
└── AppStack (user != null)
    ├── TabBarNavigation
    │   ├── Tab: HomeScreen
    │   ├── Tab: DocumentScreen
    │   ├── Tab: RequestScreen
    │   ├── Tab: AgreementScreen
    │   └── Tab: ProfilScreen
    ├── SigininDocumentsScreen    (Documents alt ekranı)
    ├── DocumentsKnowlange        (Profil alt ekranı)
    ├── ScanDocument              (Kamera ile tarama)
    ├── AddAgreementScreen        (Sözleşme ekle)
    ├── QrCodeScreen              (QR kod göster)
    ├── PaswordChanged            (Şifre değiştir — typo: PasswordChanged)
    ├── NewsDetalisContect        (Haber detay — typo: NewsDetailsContext)
    ├── OfferScreenContect        (Kampanya detay — typo: OfferScreenContext)
    └── Request Alt Ekranları:
        ├── LineRequest / LineRequestDetails
        ├── BankRequest / BankRequestDetails
        ├── PhysicalPosRequest / PhysicalPosRequestDetails
        ├── VirtualPosRequest / VirtualPosRequestDetails
        ├── SoftPosRequest / SoftPosRequestDetails
        ├── HgsRequest / HgsRequestDetails
        ├── InsuranceClaim        ⚠️ BOŞ EKRAN (sadece placeholder)
        ├── KepRequestScreen      ⚠️ Yanlış içerik (onboarding slide gösteriyor)
        ├── Cloudservices
        ├── ChangeAdress          (typo: ChangeAddress)
        ├── CapRequest            ⚠️ İçerik belirsiz
        └── WebSiteRequest        (WebDesignRequestForm navigation'a kayıtlı DEĞİL)
```

### Navigasyon Kuralları
- Auth state değişiminde `navigation.reset` kullan, `navigation.replace` yerine (back button sorunu)
- Deep link desteği henüz yok — v2'de eklenebilir
- Tab bar'da `gestureEnabled: true` — swipe ile tab geçişi aktif değil (BottomTabs default)

---

## 4. Ekran Envanteri — Detaylı

### 4.1 SplashScreen
**Dosya:** `src/Screens/SplashScreen.js`  
**Amaç:** Uygulama açılışında Firebase Auth ve Firestore verilerinin yüklenmesini beklerken animasyon gösterir.

**UI Yapısı:**
- LinearGradient arka plan (mavi-mor gradient)
- Ortada FirmaCom logosu (scale + fade animasyonu)
- Altında 3 nokta loading animasyonu
- "Uygulama başlatılıyor..." → "Veriler yükleniyor..." dinamik text

**State:**
```js
fadeAnim: Animated.Value     // logo fade-in
scaleAnim: Animated.Value    // logo scale
dot1/2/3Anim: Animated.Value // loading dots
loadingText: string          // dinamik durum metni
minTimeElapsed: boolean      // minimum 2sn göster
```

**Bağımlılık:** `AuthContext.dataLoading`, `AuthContext.initializing`  
**Geçiş:** AuthContext yüklenince AppNavigator otomatik geçiş yapar (SplashScreen prop olarak `onFinish` alıyor)

**Dikkat:** `App.tsx`'teki `handleSplashFinish` ve `setShowSplash` dead code — silinmeli.

---

### 4.2 LandingPage (Onboarding)
**Dosya:** `src/Screens/landingPage.js`  
**Amaç:** İlk açılışta uygulamayı tanıtan 4 sayfalı onboarding slayt gösterisi.

**UI Yapısı:**
- Horizontal ScrollView (paginated, `scrollEnabled: false`)
- Her slayt: gradient arka plan, büyük ikon, başlık, alt başlık, açıklama metni
- Alt kısım: dot indicator + "Atla" butonu + "İleri"/"Başla" butonu

**Slayt İçerikleri:**
```
Slayt 1: "FirmaCom'a Hoş Geldiniz" — Dijital belge yönetimi
Slayt 2: "Güvenli Belge İmzalama" — Dijital imza teknolojisi
Slayt 3: "Akıllı Belge Yönetimi" — QR kod ile hızlı erişim
Slayt 4: "Özel Kampanyalar" — Avantajlı fırsatlar
```

**State:**
```js
currentIndex: number         // mevcut slayt
```

**Tamamlanınca:**
```js
AsyncStorage.setItem('hasSeenOnboarding', 'true')
navigation.replace('LoginScreen')   // ⚠️ replace yerine reset kullan
```

**Bug:** `navigation.replace` kullanılıyor, kullanıcı geri dönünce onboarding'e düşüyor. Düzeltme:
```js
navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }))
```

---

### 4.3 LoginScreen
**Dosya:** `src/Screens/LoginScreen.js` (349 satır)  
**Amaç:** Email/şifre ve Google ile giriş.

**UI Yapısı:**
- Üst: FirmaCom logo + gradient arka plan
- Form alanları:
  - Email: TextInput (keyboardType: email-address, autoCapitalize: none)
  - Şifre: TextInput (secureTextEntry, toggle göster/gizle butonu)
  - "Beni Hatırla" checkbox (AsyncStorage'a kaydeder)
- Butonlar:
  - "Giriş Yap" (primary, loading state)
  - "Google ile Giriş" (secondary, Google logo)
- Alt linkler: "Şifremi Unuttum" → ForgotPasswordScreen, "Kayıt Ol" → RegisterScreen

**State:**
```js
email: string
password: string
secureText: boolean          // şifre görünürlüğü
rememberMe: boolean
isLoading: boolean           // email login
googleLoading: boolean       // Google login
```

**Validasyonlar:**
- Email + şifre boş kontrolü → Alert
- Firebase auth hata kodları → kullanıcı dostu mesaj:
  ```
  auth/invalid-email → "Geçersiz e-posta adresi"
  auth/wrong-password → "Hatalı şifre"
  auth/user-not-found → "Bu e-posta ile kayıtlı kullanıcı bulunamadı"
  auth/too-many-requests → "Çok fazla deneme. Lütfen bekleyin."
  ```

**Firebase Akışı:**
```js
const { login } = useAuth()  // AuthContext'ten
login(email, password)       // Firestore user sync dahil
```

---

### 4.4 RegisterScreen
**Dosya:** `src/Screens/RegisterScreen.js` (546 satır)  
**Amaç:** Email/şifre ile yeni hesap oluşturma.

**UI Yapısı:**
- Form alanları:
  - Ad: TextInput
  - Soyad: TextInput
  - Email: TextInput
  - Şifre: TextInput + göster/gizle
  - Şifre Tekrar: TextInput + göster/gizle
- "Kayıt Ol" butonu (loading state)

**Validasyonlar:**
- Tüm alanlar dolu mu?
- Email format kontrolü (regex)
- Şifre ≥ 6 karakter
- Şifreler eşleşiyor mu?

**Firebase Akışı:**
```js
// 1. Firebase Auth ile kullanıcı oluştur
createUserWithEmailAndPassword(auth, email, password)

// 2. Firestore'a user dokümanı yaz
setDoc(doc(firestore, 'users', uid), {
  uid,
  email,
  name: userName,
  surname,
  createdAt: Timestamp.now(),
  role: 'user',
  premiumStatus: false
})
```

**Sonrası:** LoginScreen'e navigate (otomatik login yapılmıyor — kullanıcı giriş yapmalı)  
**⚠️ İyileştirme:** Kayıt sonrası otomatik login + email verification gönderilebilir

---

### 4.5 ForgotPasswordScreen
**Dosya:** `src/Screens/ForgotPasswordScreeen.js` ⚠️ (typo: Screeen)  
**Amaç:** Şifre sıfırlama emaili gönderme.

**UI Yapısı:**
- Email TextInput
- "Sıfırlama Linki Gönder" butonu
- Başarı mesajı + "Tekrar Gönder" seçeneği
- Hata mesajı alanı

**State:**
```js
email: string
loading: boolean
success: boolean
error: string
resent: boolean
```

**Firebase:** `sendPasswordResetEmail(auth, email)`

---

### 4.6 HomeScreen
**Dosya:** `src/Screens/HomeScreen.js` (200 satır)  
**Amaç:** Ana sayfa — haber bülteni, kampanyalar, hızlı kısayollar.

**UI Yapısı:**
- Üst: Gradient header, kullanıcı adı selamlaması ("Merhaba, [Ad]!")
- Bölüm 1: Haberler (NewsDetailsScreen component — FlatList)
- Bölüm 2: Kampanyalar (OfferScreen component — horizontal ScrollView)
- Bölüm 3: Hızlı Kısayollar (ShortcutScreen component — grid layout)

**State:**
```js
// AuthContext'ten:
user: Firebase User
firestoreUserData: {name, surname, email, premiumStatus, ...}
newsData: Array          // Firestore'dan çekilen haberler
campaignData: Array      // Firestore'dan çekilen kampanyalar
```

**useFocusEffect:** Her tab focus'unda ilk kez Google ile giriş yapan kullanıcı kontrolü (1.5sn gecikme ile)

**İlk Kez Google Kullanıcısı Kontrolü:**
```js
// AsyncStorage'da 'googleUserChecked_{uid}' yoksa
// → RegisterScreen'e yönlendir (profil tamamlama)
```

**Veri Kaynakları:**
- `newsData`: `AuthContext` üzerinden (Firestore'dan)
- `campaignData`: `AuthContext` üzerinden
- `firestoreUserData`: `AuthContext.loadFirestoreUserData()`

---

### 4.7 DocumentScreen
**Dosya:** `src/Screens/DocumentScreen.js` (925 satır)  
**Amaç:** PDF belgelerin listelenmesi, yüklenmesi, analizi ve paylaşımı.

**UI Yapısı:**
- Header: "Belgelerim" başlığı + "Ekle" butonu
- Liste: FlatList — kayıtlı PDF'ler (dosya adı, tarih, boyut, şifreleme durumu)
- Her liste item:
  - Sol: PDF ikonu + dosya adı
  - Sağ: Share butonu + "..." menü (sil, detay)
- Boş state: "Henüz belge yüklenmedi" mesajı + yükle butonu
- Alt kısım: Yükleme seçenekleri modal (Galeri, Kamera, Dosya Sistemi)

**State:**
```js
savedPdfs: Array            // RNFS'den yüklenen PDF listesi
shareModalVisible: boolean
showShareModal: boolean
selectedDocumentId: string | null
isLoadingPdfs: boolean
isProcessingPdf: boolean
processingMessage: string   // "PDF işleniyor...", "Şifre çözülüyor..."
```

**PDF Akışı:**
1. Kullanıcı "Ekle" → modal açılır
2. Kaynak seç (galeri/kamera/dosya)
3. PDF seçilince `SolveEncryptionPDF` ile şifre kontrolü
4. Eğer şifreli → şifre çöz → önizle
5. RNFS ile yerel dosya sistemine kaydet
6. Liste güncellenir

**Alt Ekranlar:**
- `SigininDocumentsScreen`: Belge imzalama ekranı
- `ScanDocument`: Kamera ile tarama

**Paylaşım:** `react-native-share` — PDF'yi diğer uygulamalarla paylaş

---

### 4.8 RequestScreen
**Dosya:** `src/Screens/RequestScreen.js` (173 satır)  
**Amaç:** 11 hizmet kategorisini listeler ve seçime göre ilgili ekrana yönlendirir.

**UI Yapısı:**
- Gradient header: "Hizmet Talepleri"
- Grid/ScrollView: Her kategori bir kart (ikon + isim)
- Kategori tıklanınca → navigation.navigate()

**Kategori → Navigasyon Eşleşmesi:**
```
1. Hat Talebi          → LineRequest
2. Banka Hesabı        → BankRequest
3. Fiziksel POS        → PhysicalPosRequest
4. Sanal POS           → VirtualPosRequest
5. Soft POS            → SoftPosRequest
6. HGS Talebi          → HgsRequest
7. Sigorta Talebi      → InsuranceClaim  ⚠️ BOŞ EKRAN
8. KEP Talebi          → KepRequestScreen ⚠️ YANLIŞ İÇERİK
9. Bulut Hizmeti       → Cloudservices
10. Adres Değişikliği  → ChangeAdress
11. Web Sitesi         → WebSiteRequest  (WebDesignRequestForm kayıtlı DEĞİL)
```

---

### 4.8.1 BankRequest / BankRequestDetails
**Amaç:** Banka hesabı açılışı talebi.

**BankRequest — Banka Seçimi:**
- ScrollView: Banka logoları + isim listesi (BankData.js'den)
- Tıklanınca → `BankRequestDetails` ekranına banka objesi geçilir

**BankRequestDetails — Form:**
- Seçilen bankanın logosu + adı (header'da)
- Form alanları:
  - Ad Soyad (TextInput)
  - TC Kimlik No (TextInput, keyboardType: numeric, maxLength: 11)
  - Telefon (TextInput, keyboardType: phone-pad)
  - E-posta (TextInput)
  - Şube Tercihi (TextInput — opsiyonel)
  - İletişim Tercihi (Radio: "Sizi arasın" / "E-posta göndersin")
- "Talebi Gönder" butonu

**Validasyonlar:** Tüm zorunlu alanlar dolu + telefon 10 hane + TC 11 hane

**Gönderim:** Firestore `requests` koleksiyonuna yaz + partner webhook (varsa)

---

### 4.8.2 PhysicalPosRequest / Details
**Amaç:** Fiziksel POS cihazı başvurusu.

**PhysicalPosRequest — Provider Seçimi:**
- ScrollView: POS sağlayıcı listesi (PhysicalPosData.js — logo, renk, açıklama)
- Her kart farklı `backgroundColor`

**PhysicalPosRequestDetails — Form:**
- Seçilen sağlayıcı başlığı
- Form alanları:
  - Firma Adı (TextInput)
  - Ad Soyad (TextInput)
  - TC Kimlik No (TextInput, numeric, 11 hane)
  - Telefon (TextInput, phone-pad)
  - E-posta (TextInput)
  - Vergi No (TextInput, numeric)
  - Sektör/Faaliyet Alanı (TextInput veya Dropdown)
  - Aylık Ciro Tahmini (TextInput, numeric)
  - Adres (TextInput, multiline)
- Belge Yükleme: Vergi levhası (ImagePicker/DocumentPicker)
- "Başvur" butonu

**Sanal POS ve Soft POS** aynı yapıda, sağlayıcılar farklı.

---

### 4.8.3 HgsRequest / HgsRequestDetails
**Amaç:** HGS (Hızlı Geçiş Sistemi) başvurusu.

**HgsRequest — Provider Seçimi:**
HGS sağlayıcıları (hardcoded, 6 banka + PTT):
- PTT, Albaraka Türk, Ziraat Bankası, İş Bankası, QNB Finansbank, Akbank

**HgsRequestDetails — Form:**
- Seçilen sağlayıcı
- Form alanları:
  - Ad Soyad
  - TC Kimlik No
  - Telefon
  - Araç Plakası (TextInput, uppercase)
  - Araç Ruhsatı Görüntüsü (ImagePicker — zorunlu)
  - Araç Sınıfı (Dropdown: Otomobil, Minibüs, Kamyon, Motosiklet)

---

### 4.8.4 KepRequestScreen ⚠️ KRİTİK SORUN
**Mevcut Durum:** Ekran, yanlışlıkla **LandingPage onboarding slaytlarını** gösteriyor. İçerik tamamen yanlış.

**Olması Gereken:**
- KEP (Kayıtlı Elektronik Posta) başvuru formu
- Form alanları:
  - Ad Soyad (TextInput)
  - TC Kimlik No (TextInput)
  - E-posta (TextInput)
  - Telefon (TextInput)
  - Firma Adı (TextInput — opsiyonel)
  - KEP adresi tercihi (TextInput — istenen kep adresi)
- KEP hakkında bilgi metni (TÜRKKEP, KEP nedir?)
- "Başvur" butonu → Firestore kaydı + TÜRKKEP API entegrasyonu (ileride)

**Aciliyet:** P0 — ekran tamamen yeniden yazılmalı

---

### 4.8.5 InsuranceClaim ⚠️ BOŞ EKRAN
**Mevcut Durum:** Sadece "Insurance Claim" text'i içeren placeholder (19 satır).

**Olması Gereken:**
- Sigorta kategorisi seçimi (Kasko, Trafik, Sağlık, Konut, Yangın)
- Her kategori için ilgili sigorta şirketi listesi
- Form: Ad Soyad, TC, Telefon, Araç/Mülk Bilgisi (kategoriye göre)
- Belge yükleme (ruhsat, tapu vb.)

**Aciliyet:** P1

---

### 4.8.6 WebSiteRequest / WebDesignRequestForm ⚠️ NAVIGATION SORUNU
**Mevcut Durum:** `WebSiteRequest.js` ana ekran, `WebDesignRequestForm.js` form ekranı — ama form `AppNavigator.tsx`'te **kayıtlı değil**, erişilemiyor.

**Düzeltme:** AppNavigator'a ekle:
```tsx
<Stack.Screen name="WebDesignRequestForm" component={WebDesignRequestForm} />
```

---

### 4.9 AgreementScreen
**Dosya:** `src/Screens/AgreementScreen.js` (1093 satır — en uzun ekran)  
**Amaç:** Dijital sözleşmelerin listelenmesi, görüntülenmesi, imzalanması.

**UI Yapısı:**
- Header: "Sözleşmelerim" + "Ekle" butonu
- Liste: Sözleşmeler (başlık, tarih, durum: imzalı/bekleyen)
- Her item expand edilebilir (accordion)
- Detay Modal: Sözleşme içeriği
- Belge Modal: PDF/WebView görüntüleme
- PDF Modal: react-native-pdf

**State:**
```js
agreements: Array
showDetailsModal: boolean
selectedAgreement: object | null
showDocumentModal: boolean
selectedDocument: object | null
expandedAgreementId: string | null
showPdfModal: boolean
selectedPdfDocument: object | null
```

**useFocusEffect:** Tab'a her girildiğinde sözleşmeleri AsyncStorage'dan reload eder.

**Alt Ekran:** `AddAgreementScreen` — yeni sözleşme ekleme (PDF yükleme)

---

### 4.10 ProfilScreen
**Dosya:** `src/Screens/ProfilScreen.js` (464 satır)  
**Amaç:** Kullanıcı profili görüntüleme ve yönetimi.

**UI Yapısı:**
- Üst: Avatar (placeholder), ad soyad, email
- Bölümler:
  - Hesap Bilgileri (ad, email, üyelik türü)
  - Güvenlik (şifre değiştir — sadece email kullanıcıları için)
  - Belgelerim (belge sayısı → DocumentsKnowlange ekranına)
  - QR Kodum → QrCodeScreen
  - Çıkış Yap (Firebase signOut)

**State:**
```js
user: Firebase User | null
loading: boolean
hasPassword: boolean        // Google user mu email user mı?
```

**Google Kullanıcısı Farkı:** `providerData[0].providerId === 'google.com'` ise şifre değiştir butonu gösterilmez.

**useFocusEffect:** Her focus'ta `loadFirestoreUserData()` çağrılır.

**Alt Ekranlar:**
- `PaswordChanged` (typo: PasswordChanged) — şifre değiştirme formu
- `DocumentsKnowlange` (typo: DocumentsKnowledge) — belge bilgilendirme
- `QrCodeScreen` — kullanıcı QR kodu

---

## 5. Kullanıcı Akışları

### 5.1 İlk Kullanım Akışı
```
App Aç
  ↓
SplashScreen (Firebase init + data load)
  ↓ user == null + hasSeenOnboarding == false
LandingPage (4 slayt)
  ↓ "Başla" veya "Atla"
LoginScreen
  ↓ "Kayıt Ol" linki
RegisterScreen → form doldur → "Kayıt Ol"
  ↓ Firebase createUser + Firestore user dokümanı
LoginScreen → email + şifre gir → "Giriş Yap"
  ↓ Firebase signIn
HomeScreen (ana sayfa)
```

### 5.2 Geri Dönen Kullanıcı Akışı
```
App Aç
  ↓
SplashScreen
  ↓ user != null (Firebase token geçerli)
HomeScreen (direkt)

-- veya --

SplashScreen
  ↓ user == null + hasSeenOnboarding == true
LoginScreen → giriş → HomeScreen
```

### 5.3 Belge Yükleme ve AI Analiz Akışı
```
DocumentScreen → "Ekle" butonu
  ↓
Modal: "Galeri" / "Kamera" / "Dosya Seç"
  ↓ seçim yapıldı
Dosya seçildi (PDF/Görüntü)
  ↓
isProcessingPdf = true → "PDF işleniyor..."
  ↓
SolveEncryptionPDF.getDocumentMetadata()
  ↓ şifreli mi?
  ├── Evet → şifre çöz → önizle
  └── Hayır → direkt önizle
  ↓
RNFS.copyFile() → yerel dizine kaydet
  ↓
[OPSİYONEL] GPT-4o Vision API → AI analiz
  ↓ analiz sonucu
  ├── Tutar, tarih, firma adı çıkarıldı
  └── metadata dosyasına kaydet
  ↓
Liste yenilenir (loadSavedPdfs)
```

### 5.4 Banka Hesabı Açılışı Talebi Akışı
```
HomeScreen veya RequestScreen → "Banka Hesabı Açılışı"
  ↓
BankRequest (banka listesi)
  ↓ banka seçildi (ör. Ziraat)
BankRequestDetails (form ekranı, banka={id, name, logo})
  ↓ form doldur (ad, TC, telefon, email, iletişim tercihi)
  ↓ validasyon
  ↓ "Talebi Gönder" → loading
Firestore: requests.add({type:'bank', bankId, userId, formData, status:'pending', createdAt})
  ↓
Başarı Alert → "Talebiniz alındı"
  ↓
RequestScreen (geri dön)
```

### 5.5 POS Başvuru Akışı (Detaylı)
```
RequestScreen → "Fiziksel POS Talebi"
  ↓
PhysicalPosRequest (POS sağlayıcı listesi)
  ↓ sağlayıcı seçildi (ör. İyzico, Moka)
PhysicalPosRequestDetails
  ├── Form: Firma Adı, Ad Soyad, TC, Telefon, Email, Vergi No, Sektör, Ciro, Adres
  └── Belge: Vergi Levhası yükle (ImagePicker)
  ↓ tüm alanlar dolu + belge yüklendi
  ↓ "Başvur" → loading
  ↓ [OPSİYONEL] Vergi levhası → GPT-4o Vision → firma adı + vergi no otomatik doldur
Firestore: requests.add({type:'physical_pos', providerId, userId, formData, documentUrl, status:'pending'})
  ↓
Başarı mesajı → RequestScreen
```

### 5.6 Şifre Sıfırlama Akışı
```
LoginScreen → "Şifremi Unuttum"
  ↓
ForgotPasswordScreen
  ↓ email gir → "Sıfırlama Linki Gönder"
  ↓ validasyon (email format)
Firebase: sendPasswordResetEmail(email)
  ↓ success=true
"E-posta gönderildi" mesajı + "Tekrar Gönder" (30sn countdown)
  ↓ kullanıcı email'i açar, linke tıklar
  ↓ yeni şifre belirler
LoginScreen → yeni şifre ile giriş
```

### 5.7 Profil Güncelleme Akışı
```
ProfilScreen → "Şifre Değiştir" (sadece email kullanıcıları)
  ↓
PaswordChanged ekranı
  ↓ Mevcut şifre + Yeni şifre + Onay
  ↓ Firebase reauthenticate → updatePassword
Başarı → ProfilScreen
```

---

## 6. Firestore Veri Modeli

### 6.1 users Koleksiyonu
```json
{
  "uid": "firebase-auth-uid",
  "email": "user@example.com",
  "name": "Ahmet",
  "surname": "Yılmaz",
  "phone": "+905001234567",
  "companyName": "ABC Ltd.",
  "taxNumber": "1234567890",
  "role": "user",
  "premiumStatus": false,
  "premiumExpiresAt": null,
  "googleUser": false,
  "profileCompleted": true,
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "fcmToken": "device-push-token",
  "leadId": "unique-lead-tracking-id"
}
```

**Security Rule:**
```
allow read, write: if request.auth.uid == resource.data.uid;
```

### 6.2 requests Koleksiyonu
```json
{
  "requestId": "auto-generated",
  "userId": "firebase-auth-uid",
  "type": "bank | physical_pos | virtual_pos | soft_pos | hgs | insurance | kep | cloud | address | web | line",
  "subType": "ziraat | iyzico | ptt | ...",
  "status": "pending | processing | approved | rejected | completed",
  "formData": {
    "name": "Ahmet Yılmaz",
    "tc": "12345678901",
    "phone": "+905001234567",
    "email": "user@example.com",
    "companyName": "ABC Ltd.",
    "taxNumber": "1234567890",
    "sector": "Perakende",
    "monthlyVolume": "50000",
    "address": "..."
  },
  "documents": [
    {
      "type": "tax_certificate",
      "url": "firebase-storage-url",
      "aiExtracted": {
        "companyName": "ABC Ltd.",
        "taxNumber": "1234567890"
      }
    }
  ],
  "leadId": "unique-id-for-commission-tracking",
  "partnerId": "ziraat | iyzico | ...",
  "commissionStatus": "pending | paid",
  "commissionAmount": 0,
  "notes": "",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "processedAt": null
}
```

**Index Gereksinimleri:**
```
userId + createdAt DESC       → kullanıcının talepleri
type + status                 → admin panel için
status + createdAt DESC       → bekleyen talepler
```

**Security Rules:**
```
allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
allow read: if request.auth.uid == resource.data.userId;
allow update: if request.auth.uid == resource.data.userId && 
              request.resource.data.status == resource.data.status; // status admin değiştirir
```

### 6.3 documents Koleksiyonu
```json
{
  "docId": "auto-generated",
  "userId": "firebase-auth-uid",
  "fileName": "fatura_2026_03.pdf",
  "localPath": "/data/user/0/.../files/firmacom/docs/...",
  "storageUrl": null,
  "type": "invoice | contract | certificate | other",
  "encrypted": true,
  "encryptionType": "Simple | AES",
  "aiData": {
    "analyzed": true,
    "amount": "15000",
    "currency": "TL",
    "date": "2026-03-01",
    "vendor": "XYZ A.Ş.",
    "invoiceNo": "2026-001",
    "raw": "GPT-4o ham çıktı"
  },
  "fileSize": 245678,
  "mimeType": "application/pdf",
  "createdAt": "Timestamp"
}
```

### 6.4 agreements Koleksiyonu
```json
{
  "agreementId": "auto-generated",
  "userId": "firebase-auth-uid",
  "title": "Kiralama Sözleşmesi",
  "counterParty": "ABC Ltd.",
  "status": "signed | pending | expired",
  "signedAt": "Timestamp | null",
  "expiresAt": "Timestamp | null",
  "documentUrl": "firebase-storage-url",
  "localPath": "local-path",
  "createdAt": "Timestamp"
}
```

### 6.5 news ve campaigns Koleksiyonları
```json
// news
{
  "newsId": "auto-generated",
  "title": "Haber Başlığı",
  "summary": "Kısa açıklama",
  "content": "Tam içerik",
  "imageUrl": "url",
  "source": "Kaynak",
  "publishedAt": "Timestamp",
  "active": true
}

// campaigns (offers)
{
  "campaignId": "auto-generated",
  "title": "Kampanya Başlığı",
  "description": "Açıklama",
  "imageUrl": "url",
  "partnerName": "Banka/Firma Adı",
  "partnerId": "partner-id",
  "validUntil": "Timestamp",
  "active": true,
  "targetSegment": "all | premium | new"
}
```

---

## 7. API Entegrasyonları

### 7.1 Firebase Auth
```js
// Email/Şifre Login
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Google Sign-In
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });
const { idToken } = await GoogleSignin.signIn();
const credential = GoogleAuthProvider.credential(idToken);
await signInWithCredential(auth, credential);

// Sign Out
await auth().signOut();

// Şifre Sıfırlama
await sendPasswordResetEmail(auth, email);

// Şifre Değiştirme
const credential = EmailAuthProvider.credential(email, currentPassword);
await reauthenticateWithCredential(user, credential);
await updatePassword(user, newPassword);
```

### 7.2 GPT-4o Vision API — Belge Analizi
```js
// Endpoint: POST https://api.openai.com/v1/chat/completions
// Model: gpt-4o

const analyzeDocument = async (imageBase64, mimeType) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Config.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Bu belgeyi analiz et ve aşağıdaki bilgileri JSON formatında çıkar:
            - document_type: belge türü (fatura, sözleşme, ruhsat, kimlik, diğer)
            - company_name: firma/şahıs adı (varsa)
            - tax_number: vergi numarası (varsa)
            - amount: tutar (varsa, sadece rakam)
            - currency: para birimi (TL, USD, EUR)
            - date: tarih (YYYY-MM-DD formatında)
            - invoice_no: fatura/belge numarası (varsa)
            
            Sadece JSON döndür, başka açıklama ekleme.`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
              detail: 'high'
            }
          }
        ]
      }],
      max_tokens: 500,
      temperature: 0,
    })
  });
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  return JSON.parse(content);
};

// Hata Yönetimi:
// - 429: Rate limit → retry after 60s
// - 400: Invalid image → "Belge okunamadı" mesajı
// - Network error → "İnternet bağlantısı yok" mesajı
// PDF için: Önce PDF → PNG'ye dönüştür, sonra Vision API'ye gönder
```

### 7.3 Firebase Cloud Messaging (Push Notification)
```js
// FCM Token alma
const fcmToken = await messaging().getToken();
// → Firestore users/{uid}.fcmToken alanına kaydet

// Bildirim dinleme (foreground)
messaging().onMessage(async remoteMessage => {
  // In-app bildirim göster
  showInAppNotification(remoteMessage.notification);
});

// Bildirim dinleme (background tap)
messaging().onNotificationOpenedApp(remoteMessage => {
  // İlgili ekrana navigate
  handleNotificationNavigation(remoteMessage.data);
});

// Bildirim türleri:
// - request_status_update: Talep durumu değişti
// - document_analysis_done: AI analiz tamamlandı
// - campaign_new: Yeni kampanya
```

### 7.4 RevenueCat — Premium Abonelik (EKLENECEK)
```js
import Purchases from 'react-native-purchases';

// Başlatma (App.tsx)
Purchases.configure({ apiKey: Config.REVENUECAT_API_KEY });

// Ürünleri getir
const offerings = await Purchases.getOfferings();
const packages = offerings.current?.availablePackages;

// Satın alma
const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
const isPremium = customerInfo.entitlements.active['premium'] != null;

// Premium kontrolü (her açılışta)
const customerInfo = await Purchases.getCustomerInfo();
const isPremium = customerInfo.entitlements.active['premium'] != null;
// → AuthContext.premiumStatus güncelle
// → Firestore users/{uid}.premiumStatus güncelle

// Paket önerileri:
// - Aylık: 49.99 TL
// - Yıllık: 399.99 TL (%33 indirim)
```

---

## 8. State Yönetimi

### 8.1 AuthContext — Global State
**Dosya:** `src/context/AuthContext.js`

```js
// Sağlanan değerler:
const AuthContextValue = {
  user: FirebaseUser | null,          // Firebase Auth user
  isLoading: boolean,                  // auth işlemi devam ediyor mu
  initializing: boolean,               // Firebase ilk başlatma
  dataLoading: boolean,                // Firestore veri yükleniyor mu
  firestoreUserData: object | null,    // users/{uid} dokümanı
  newsData: Array,                     // haberler
  campaignData: Array,                 // kampanyalar
  
  // Metodlar:
  login: (email, password) => Promise,
  logout: () => Promise,
  loadFirestoreUserData: () => Promise,
}
```

### 8.2 Screen-Level State Yönetimi
Her ekran kendi state'ini `useState` ile yönetir. Loading, error, empty, filled durumları:

```js
// Standart pattern:
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [isEmpty, setIsEmpty] = useState(false);

// Render logic:
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
if (isEmpty) return <EmptyState message="Henüz veri yok" />;
return <DataList data={data} />;
```

### 8.3 TanStack Query Entegrasyonu (Önerilen)
```js
// Kurulum: npm install @tanstack/react-query
// App.tsx'e ekle:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

// Kullanım örneği (DocumentScreen):
const { data: documents, isLoading, error, refetch } = useQuery({
  queryKey: ['documents', userId],
  queryFn: () => fetchDocumentsFromFirestore(userId),
  staleTime: 5 * 60 * 1000, // 5 dakika cache
});

// Mutation örneği (request gönderme):
const submitMutation = useMutation({
  mutationFn: (formData) => submitRequestToFirestore(formData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['requests'] });
    showSuccessAlert();
  },
  onError: (error) => showErrorAlert(error.message),
});
```

---

## 9. Hata Yönetimi ve Edge Case'ler

### 9.1 Network Hatası
```js
// NetInfo ile bağlantı kontrolü
import NetInfo from '@react-native-community/netinfo';
const netInfo = await NetInfo.fetch();
if (!netInfo.isConnected) {
  Alert.alert('Bağlantı Yok', 'İnternet bağlantınızı kontrol edin.');
  return;
}
```

### 9.2 Firebase Auth Token Expired
```js
// AuthContext'te otomatik yönetim:
auth().onIdTokenChanged(async (user) => {
  if (user) {
    const token = await user.getIdToken(true); // force refresh
  }
});
// → Kullanıcı fark etmez, arka planda yenilenir
```

### 9.3 Firestore Permission Denied
```js
try {
  await firestore().collection('requests').add(data);
} catch (error) {
  if (error.code === 'firestore/permission-denied') {
    // Auth token expire olmuş olabilir → logout + login yönlendir
    Alert.alert('Oturum Sonlandı', 'Lütfen tekrar giriş yapın.', [
      { text: 'Giriş Yap', onPress: () => logout() }
    ]);
  }
}
```

### 9.4 GPT-4o Vision Başarısız
```js
try {
  const aiResult = await analyzeDocument(imageBase64, mimeType);
  setAiData(aiResult);
} catch (error) {
  // AI analiz başarısız → belgeyi yine de kaydet, AI verisi olmadan
  console.warn('AI analiz başarısız, manual devam ediliyor:', error);
  setAiData(null);
  // Kullanıcıya bildir: "Otomatik analiz yapılamadı, bilgileri manuel girin"
}
```

### 9.5 Dosya Boyutu Limiti
```js
const MAX_FILE_SIZE_MB = 10;
const fileSize = stat.size / (1024 * 1024); // MB
if (fileSize > MAX_FILE_SIZE_MB) {
  Alert.alert('Dosya Çok Büyük', `Maksimum dosya boyutu ${MAX_FILE_SIZE_MB}MB olmalıdır.`);
  return;
}
```

### 9.6 Form Validation — Standart Fonksiyon
```js
const validateForm = (fields) => {
  const errors = {};
  
  if (!fields.name?.trim()) errors.name = 'Ad Soyad zorunlu';
  if (!fields.tc || fields.tc.length !== 11) errors.tc = 'TC Kimlik No 11 haneli olmalı';
  if (!fields.phone || fields.phone.length < 10) errors.phone = 'Geçerli telefon numarası girin';
  if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Geçerli email girin';
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
```

---

## 10. Teknik Borç ve Refactor Planı

### Sprint 0 (ÖNCE YAPILMALI — 2 Hafta)

| # | Görev | Dosyalar | Efor |
|---|-------|----------|------|
| S0-1 | `Companents` → `components` klasör rename | 20+ dosya import güncelleme | 4s |
| S0-2 | Typo düzeltmeleri (ForgotPasswordScreeen vb.) | 8 dosya | 2s |
| S0-3 | `secrets.js` → `react-native-config` migration | App.tsx, SolveEncryptionPDF.js | 3s |
| S0-4 | `KepRequestScreen` tamamen yeniden yaz | KepRequestScreen.js | 6s |
| S0-5 | `InsuranceClaim` geliştir | InsuranceClaim.js | 8s |
| S0-6 | `WebDesignRequestForm` navigation kaydı | AppNavigator.tsx | 0.5s |
| S0-7 | App.tsx dead code temizliği | App.tsx | 1s |
| S0-8 | Error boundary ekle | App.tsx | 2s |
| S0-9 | TypeScript migration başlat (önce new screens) | Sprint 1'den itibaren |  |

### Sprint 1 (Belge Yönetimi + AI — 2 Hafta)

| # | Görev | Açıklama |
|---|-------|----------|
| S1-1 | GPT-4o Vision entegrasyonu | PDF → PNG → API → otomatik form doldurma |
| S1-2 | Firebase Storage entegrasyonu | Belgeler cloud'a yüklenmeli |
| S1-3 | Firestore documents koleksiyonu | Yerel RNFS yerine cloud |
| S1-4 | TanStack Query entegrasyonu | Cache + loading yönetimi |
| S1-5 | PDF scanner iyileştirme | ScanDocument — daha iyi crop/quality |

---

## 11. Test Senaryoları

### 11.1 Auth Flow Testleri
```
TC-001: Geçerli email/şifre ile giriş yapılabilmeli
TC-002: Hatalı şifre → "Hatalı şifre" mesajı gösterilmeli
TC-003: Boş form submit → validasyon hatası gösterilmeli
TC-004: Yeni kullanıcı kaydı → Firestore dokümanı oluşturulmalı
TC-005: Şifre sıfırlama emaili gönderilmeli
TC-006: Google ile giriş → Firestore user kontrolü yapılmalı
TC-007: "Beni Hatırla" → AsyncStorage'a kaydedilmeli
TC-008: Logout → AuthContext temizlenmeli, LoginScreen'e dönülmeli
```

### 11.2 Request Flow Testleri
```
TC-101: Banka seçimi → BankRequestDetails'a banka objesi geçilmeli
TC-102: Form validasyonu → TC 11 hane, telefon 10 hane
TC-103: Başarılı submit → Firestore'a yazılmalı, başarı mesajı gösterilmeli
TC-104: Offline → "İnternet yok" mesajı gösterilmeli
TC-105: POS başvurusunda vergi levhası zorunlu olmalı
```

### 11.3 Document Flow Testleri
```
TC-201: PDF seçimi → işlenip listeye eklenmeli
TC-202: Şifreli PDF → şifre çözülmeli
TC-203: 10MB+ dosya → "Çok büyük" uyarısı gösterilmeli
TC-204: GPT analiz başarısız → belge yine de kaydedilmeli
TC-205: PDF paylaşımı → share sheet açılmalı
```

---

## 12. Gelir Modeli Teknik Entegrasyon

### 12.1 Lead Generation Tracking
```js
// Request oluşturulduğunda:
const leadId = `LEAD-${Date.now()}-${userId.substring(0,8)}`;

await firestore().collection('requests').add({
  ...formData,
  leadId,
  partnerId: selectedBank.partnerId,
  commissionStatus: 'pending',
  commissionAmount: 0,
});

// Backend (Cloud Function):
// Partner onay bildirimi gelince → commissionStatus: 'approved'
// → commissionAmount güncelle
// → Raporlama dashboard'u için leads koleksiyonu güncelle
```

### 12.2 AdMob Entegrasyonu
```js
// Reklam gösterilecek ekranlar:
// - HomeScreen: banner (alttan)
// - RequestScreen: native ad (liste içinde, 3. kart arası)
// - DocumentScreen: banner (alttan)

// Premium kullanıcılar için reklam gösterme:
const { premiumStatus } = useAuth();
if (!premiumStatus) {
  return <BannerAd unitId={Config.ADMOB_BANNER_ID} size={BannerAdSize.BANNER} />;
}
```

### 12.3 RevenueCat Premium Akışı
```
ProfilScreen → "Premium'a Geç" butonu
  ↓
PremiumScreen (yeni ekran)
  ├── Özellikler listesi (sınırsız AI, reklamsız, öncelikli destek)
  ├── Fiyat seçimi (Aylık 49.99₺ / Yıllık 399.99₺)
  └── "Satın Al" butonu
  ↓ RevenueCat.purchasePackage()
  ↓ başarılı
Firestore users/{uid}.premiumStatus = true
AuthContext güncelle
ProfilScreen → "Premium Üye" badge göster
```

---

## 13. Sprint Planı

### Sprint 0 — Teknik Altyapı (Hafta 1-2)
- Klasör ve isimlendirme düzeltmeleri
- Secrets.js → react-native-config
- KepRequestScreen yeniden yazımı
- Error boundary + loading iyileştirmeleri

### Sprint 1 — Belge Yönetimi MVP (Hafta 3-4)
- Firebase Storage entegrasyonu
- GPT-4o Vision API — otomatik form doldurma
- Firestore documents koleksiyonu
- TanStack Query entegrasyonu

### Sprint 2 — Talep Akışları (Hafta 5-6)
- InsuranceClaim geliştirmesi
- WebDesignRequestForm düzeltmesi
- Tüm form validasyonları standartlaştırma
- Push notification entegrasyonu (FCM)

### Sprint 3 — Gelir Modeli (Hafta 7-8)
- RevenueCat entegrasyonu (in-app purchase)
- AdMob entegrasyonu
- Lead tracking altyapısı
- Premium ekran tasarımı

### Sprint 4 — Kalite ve Test (Hafta 9-10)
- TypeScript migration (önce yeni ekranlar)
- Jest test yazımı (auth + request flow)
- Performance optimizasyon
- App Store / Play Store hazırlık

---

*Bu doküman FirmaCom mobil uygulamasının aktif geliştirme rehberidir. Her sprint sonunda güncellenmeli ve değişiklikler git commit mesajlarında referans verilmelidir.*

**Son Güncelleme:** 2026-04-03  
**Hazırlayan:** Finhouse AI — OpenClaw Agent
