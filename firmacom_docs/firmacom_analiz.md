# FirmaCom — Teknik & Ürün Analiz Dokümanı

**Tarih:** 27 Mart 2025  
**Repo:** `/tmp/firmacom_transfer/FirmaCom` (Mobil) · `/tmp/firmacom_transfer/FirmaComWeb/web` (Web)  
**Durum:** Pre-production / Beta  

---

## Yönetici Özeti

FirmaCom, KOBİ'lerin kurumsal hizmet taleplerini (hat, banka hesabı, POS, HGS, sigorta, KEP vb.) tek uygulama üzerinden oluşturmasını, evrak yönetimini dijitalleştirmesini ve şirkete ait belgeleri güvenli biçimde saklamasını sağlayan bir B2B SaaS ürünüdür.

**Mobil (React Native 0.80 + Firebase)** ve **Web (React 19 + Vite + Firebase)** olmak üzere iki paralel codebase mevcuttur. Her iki platform aynı Firebase projesini (`firmacommmmm`) kullanmaktadır.

Ürün işlevsel düzeyde çalışmaktadır ancak **canlıya çıkmadan önce kritik güvenlik açıkları, mimari tutarsızlıklar ve eksik iş akışları** kapatılmalıdır.

---

## 1. Ürün Ne Yapıyor?

| Modül | İşlev |
|---|---|
| **Landing Page / Onboarding** | Ürün tanıtımı, yeni kullanıcıyı kayıta/girişe yönlendirme |
| **Kimlik Doğrulama** | E-posta + şifre ve Google OAuth ile kayıt/giriş/şifre sıfırlama |
| **Ana Sayfa (Dashboard)** | Kişiselleştirilmiş karşılama, haberler slider, kampanyalar, kısayollar |
| **Belgeler** | Kurumsal evrak listesi, belge yükleme, PDF şifreleme/çözme, paylaşım |
| **Talepler** | 11 farklı servis kategorisi: Hat, Banka Hesabı, Fiziksel/Sanal/Soft POS, HGS, Sigorta, KEP, Bulut, Adres Değişikliği, Web Sitesi |
| **Talep Detay Akışı** | Kurum seçimi (operatör/banka listesi) → Belge adımları → PDF derleme → Gönderim |
| **Sözleşmeler** | Sözleşme listesi ve yönetimi (şu an yapı hazır, içerik sınırlı) |
| **Profil** | Ad/soyad, e-posta, şifre değiştir/belirle, QR kod, kuruluş bilgileri |

---

## 2. Mimari

### 2.1 Mobil Mimari (FirmaCom)

```
App.tsx
├── AuthProvider (Firebase Auth + AsyncStorage + Firestore cache)
│   └── MainApp
│       ├── SplashScreen (sadece giriş yapmış kullanıcı için)
│       └── AppNavigator (NavigationContainer)
│           ├── AuthStack
│           │   ├── LandingPage (onboarding - 4 slayt)
│           │   ├── LoginScreen
│           │   ├── RegisterScreen
│           │   └── ForgotPasswordScreen
│           └── AppStack
│               ├── TabBarNavigation (Alt Tab Bar - 5 sekme)
│               │   ├── HomeScreen
│               │   ├── DocumentScreen
│               │   ├── RequestScreen
│               │   ├── AgreementScreen
│               │   └── ProfilScreen
│               └── [Alt Ekranlar: 20+ Stack Screen]
```

**Durum Yönetimi:**
- `AuthContext.js` → Merkezi state (user, newsData, campaignData, firestoreUserData)
- `AsyncStorage` → Oturum kalıcılığı, haber/kampanya cache
- Firebase Auth listener (`onAuthStateChanged`) → Gerçek zamanlı oturum senkronizasyonu

### 2.2 Web Mimarisi (FirmaComWeb)

```
main.tsx → BrowserRouter
└── App.tsx
    ├── PublicRoute: / → LandingPage
    ├── PublicRoute: /login → Login
    ├── PublicRoute: /register → Register
    ├── PublicRoute: /forgot-password → ForgotPassword
    └── ProtectedRoute → AppLayout (Header Navbar)
        ├── /dashboard → Dashboard
        ├── /documents → Documents
        ├── /requests → Requests
        ├── /app/requests/* → [11 kategori, her biri 2 adım]
        ├── /contracts → Contracts
        └── /profile → Profile
```

---

## 3. Teknoloji Stack

### Mobil (React Native)

| Katman | Teknoloji | Versiyon |
|---|---|---|
| Framework | React Native | 0.80.1 |
| Dil | JavaScript (src) + TypeScript (Navigation) | Mixed |
| Backend | Firebase (Firestore, Auth, App Check) | 23.4.0 |
| Navigasyon | React Navigation | v7 |
| Auth | Firebase Auth + Google Sign-In | — |
| Yerel Depolama | AsyncStorage | 1.24.0 |
| Dosya İşlemleri | react-native-fs + react-native-blob-util | — |
| PDF | react-native-pdf + react-native-html-to-pdf + jspdf | — |
| Şifreleme | CryptoJS (AES) | 4.2.0 |
| Belge Tarama | react-native-document-scanner-plugin | — |
| QR Kod | react-native-qrcode-svg | — |
| Animasyon | react-native-reanimated | 4.0.2 |
| Gradient | react-native-linear-gradient | — |
| Paylaşım | react-native-share | — |
| İmza | react-native-signature-canvas | — |
| Build | Metro + Gradle (Android) + Xcode (iOS) | — |

### Web

| Katman | Teknoloji | Versiyon |
|---|---|---|
| Framework | React | 19.2.0 |
| Dil | TypeScript | 5.9.3 |
| Build Tool | Vite | 7.2.4 |
| Router | React Router DOM | v7 |
| Backend | Firebase (Firestore, Auth) | 11.1.0 |
| UI İkonlar | Lucide React | 0.562.0 |
| Animasyon | Framer Motion | 12.23.26 |
| QR | qrcode | 1.5.4 |
| Stillendirme | CSS Modules | — |

---

## 4. Firestore Veri Modeli

```
/users/{uid}
  uid, email, firstName, lastName, displayName,
  provider (email | google), hasPassword, isAdmin, isFirstAdmin,
  isFirstTime, photoURL, createdAt, updatedAt

/companies/{companyId}
  name, ownerId, createdAt
  → /employees/{employeeId}
  → /documents/{documentId}
  → /agreements/{agreementId}
  → /requests/{requestId}

/News/{newsId}
  title, content, description, status (draft|active|archived),
  imageUrls, createdAt, updatedAt

/offers/{offerId}
  title, description, imageUrl, discountPercent,
  validUntil, redirectUrl, conditions, createdAt

/notifications/{userId}
  title, message, isRead, createdAt

/userSettings/{userId}
  (kullanıcı ayarları)
```

---

## 5. Mevcut Güçlü Yönler

1. **Çift platform paralelliği** — Mobil ve web aynı Firebase projesini paylaşıyor; ekip tek backendde çalışıyor.
2. **Kapsamlı talep yelpazesi** — 11 farklı servis kategorisi hem mobilde hem webde tam olarak mevcut.
3. **Belge şifreleme altyapısı** — CryptoJS AES tabanlı local PDF şifreleme + metadata dosyası sistemi işlevsel.
4. **Firebase App Check** — iOS ve Android için debug/production yapılandırması mevcut.
5. **Onboarding akışı** — LandingPage (4 slayt, animasyonlu) ve `hasSeenOnboarding` AsyncStorage bayrağı çalışıyor.
6. **Güçlü validasyon** — Kayıt ekranında büyük harf + sembol + sayı zorunluluğu, e-posta format kontrolü.
7. **Google OAuth** — Hem mobil hem web'de entegre, ilk defa giriş yapan kullanıcı tespiti var.
8. **Firestore kuralları** — Admin/user ayrımı, company erişim kontrolü düşünülmüş.
9. **Responsive tasarım** — Mobil `Responsive.js` (scale/verticalScale/moderateScale), web CSS Modules.
10. **Framer Motion** — Web landing sayfasında modern animasyon katmanı.

---

## 6. Kritik Eksikler

### 6.1 Talep Gönderimi Backend'e Ulaşmıyor
- `LineRequestDetails.js` dahil tüm talep detay ekranları belgeleri **local dosya sistemine kaydediyor**, ancak taleplerin bir backend veya Firestore koleksiyonuna iletildiğine dair kod bulunamadı.
- `companies/{companyId}/requests/{requestId}` koleksiyonu Firestore kurallarında tanımlı ama uygulama bu koleksiyona yazım yapmıyor gibi görünüyor.
- **Sonuç:** Kullanıcı talep oluşturuyor, sistem dosyaları kaydediyor ama talep hiçbir yerde görünmüyor.

### 6.2 Sözleşmeler (Agreements) Modülü Eksik
- `AgreementScreen.js` (mobil) ve `Contracts.tsx` (web) dosyaları var, ancak **gerçek içerik** veya Firestore bağlantısı tamamlanmamış.
- `AddAgreementScreen.js` mevcut ama işlevselliği belirsiz.

### 6.3 Admin Paneli Yok
- `isAdmin` alanı Firestore kurallarında kullanılıyor, haberler ve kampanyaları sadece adminler yönetebiliyor.
- Ancak admin paneli (arka yüz veya ayrı web sayfası) **hiç mevcut değil**.
- Sonuç: Haber ve kampanya ekleme/düzenleme şu an imkânsız.

### 6.4 Bildirim Sistemi Eksik
- `/notifications` koleksiyonu Firestore'da tanımlı ve kurallar yazılmış.
- Mobil veya web'de **push notification entegrasyonu** (FCM) yok.
- Bildirim oluşturma akışı da eksik.

### 6.5 Belge Yükleme — Cloud Storage Yok
- Belgeler sadece **cihaz yerel depolama** alanına kaydediliyor.
- Firebase Storage veya başka cloud storage entegrasyonu yok.
- Belge paylaşımı kısıtlı (sadece yerel `Share` API).

### 6.6 Dil/İçerik Tutarsızlıkları
- Mobil kayıt ekranında `platform='ios'` özel davranış bazı Android cihazlarda sorun yaratabilir.
- Hata mesajları Türkçe ama bazı `console.log`'lar sadece İngilizce.
- `CompanyButtonContainer` (ProfilScreen) → `backdropFilter` CSS özelliği React Native'de çalışmaz.

### 6.7 Mixed Codebase (JS + TS)
- Mobil projede Navigation `.tsx`, diğer bileşenler `.js`. TypeScript tip güvenliği sınırlı.
- `App.tsx` içinde `setShowSplash(false)` referansı: `handleSplashFinish` fonksiyonu `App` bileşeninde tanımlı ama `MainApp` bileşeninde kullanılıyor — bu ayrı scope'da hata verir.

---

## 7. Güvenlik Riskleri

### 7.1 🔴 KRİTİK — Debug Token Hardcoded (App.tsx)
```javascript
const debugToken = '3E3D12C3-8280-499B-9460-55D69602476B';
```
Bu token kaynak kodunda sabit. Git commit geçmişine giren bir debug token, production ortamında App Check'i devre dışı bırakmak için kullanılabilir.
**Çözüm:** `.env` dosyasına taşı, production build'de `__DEV__` değil gerçek provider kullan.

### 7.2 🔴 KRİTİK — Firebase API Anahtarı Açık
`firebase.config.js`'de `apiKey`, `projectId`, `appId` düz metin.
React Native için bu kısmen kabul edilebilir olsa da **Firestore kuralları sağlam olmalı** (aksi hâlde veri açığa çıkar).

### 7.3 🟠 YÜKSEK — Firestore `users` Koleksiyonu Herkese Açık Okuma
```
match /users/{document=**} {
  allow read: if true;  // ← Şifremi unuttum için eklendi
```
Tüm kullanıcı e-posta adresleri kimlik doğrulaması yapılmadan okunabilir.
**Çözüm:** Bu kuralı kaldır; şifre sıfırlama için Firebase Auth'un `sendPasswordResetEmail` yeterli.

### 7.4 🟠 YÜKSEK — Offers Herkes Tarafından Okunabilir
```
match /offers/{offerId} {
  allow read: if true;
  allow create, update: if request.auth != null;  // Herhangi bir kullanıcı kampanya ekleyebilir!
```
Giriş yapmış her kullanıcı kampanya oluşturabilir/düzenleyebilir.
**Çözüm:** `create, update` sadece admin yapabilmeli.

### 7.5 🟡 ORTA — Şifreleme Anahtarı Yerel Dosyada
PDF şifreleme anahtarı metadata JSON dosyasında düz metin saklanıyor. Cihaz rootlanmışsa belgeler erişilebilir.

### 7.6 🟡 ORTA — 30 Günlük Login Oturumu Kontrolü
`AuthContext.js`'de 30 günlük oturum süresi sadece AsyncStorage timestamp ile kontrol ediliyor. Firebase token'ı yenilenmiş olsa bile eski session temizlenmiyor düzgün.

### 7.7 🟡 ORTA — Google Client ID Açık Kodda
`webClientId` ve `iosClientId` `App.tsx`'te sabit. Environment variable'a taşınmalı.

---

## 8. Canlıya Çıkmak İçin Yapılması Gerekenler

### 🔴 Zorunlu (Blocker)

| # | Görev | Platform | Öncelik |
|---|---|---|---|
| 1 | `users` koleksiyonunda `allow read: if true` kuralını kaldır | Backend | P0 |
| 2 | `offers` koleksiyonunda write kuralını sadece admin'e kısıtla | Backend | P0 |
| 3 | Debug token'ı `.env`'e taşı, production build'de kaldır | Mobil | P0 |
| 4 | Talep gönderimi → Firestore `requests` koleksiyonuna yaz | Mobil+Web | P0 |
| 5 | `App.tsx` içindeki `handleSplashFinish` scope hatasını düzelt | Mobil | P0 |
| 6 | Firebase API key'lerini `.env`/config dosyasına taşı | Tüm | P0 |

### 🟠 Gerekli (Canlı öncesi tamamlanmalı)

| # | Görev | Platform | Öncelik |
|---|---|---|---|
| 7 | Admin paneli oluştur (haber + kampanya yönetimi için minimum) | Web | P1 |
| 8 | Belge yükleme → Firebase Storage entegrasyonu | Mobil+Web | P1 |
| 9 | Sözleşmeler modülünü tamamla veya geçici olarak gizle | Tüm | P1 |
| 10 | JS → TypeScript migrasyonu başlat (en az Screens seviyesinde) | Mobil | P1 |
| 11 | `backdropFilter` CSS özelliğini kaldır (React Native desteklemiyor) | Mobil | P1 |
| 12 | Push notification (FCM) entegrasyonu | Mobil | P1 |

### 🟡 Önerilen

| # | Görev | Platform | Öncelik |
|---|---|---|---|
| 13 | Talep durumu takibi (gönderildi / inceleniyor / tamamlandı) | Tüm | P2 |
| 14 | Belge cloud backup | Mobil | P2 |
| 15 | Hata izleme (Sentry veya Firebase Crashlytics) | Tüm | P2 |
| 16 | Analytics (Firebase Analytics veya eşdeğer) | Tüm | P2 |
| 17 | Unit test coverage artırma | Tüm | P2 |

---

## 9. Önerilen Faz Planı

### Faz 0 — Güvenlik Temizliği (1 hafta)
- Kritik Firestore kural açıkları kapatılır (madde 1, 2, 4)
- Hardcoded token ve API key'ler environment variable'a taşınır
- Scope hatası düzeltilir

### Faz 1 — Temel İş Akışı Tamamlama (2-3 hafta)
- Talep gönderimi Firestore'a yazılır
- Talep listesi/durumu kullanıcıya gösterilir
- Sözleşmeler modülü tamamlanır ya da "Yakında" olarak etiketlenir
- Admin için minimum haber/kampanya yönetim sayfası

### Faz 2 — Belge Altyapısı (2 hafta)
- Firebase Storage entegrasyonu
- Belge yükleme akışı cloud'a taşınır
- Paylaşım URL'leri oluşturulur

### Faz 3 — Bildirim & İzleme (1-2 hafta)
- FCM push notification
- Firebase Crashlytics
- Temel analytics event'leri

### Faz 4 — Kalite & Büyüme (Süregelen)
- TypeScript migrasyonu
- Test coverage
- Performans optimizasyonu
- Kullanıcı geri bildirimleri

---

*Bu doküman Mart 2025 itibarıyla kaynak kodu incelemesine dayanmaktadır.*
