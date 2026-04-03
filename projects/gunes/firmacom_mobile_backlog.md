# FirmaCom Mobil — Backlog
_Güneş 🌟 tarafından oluşturuldu | 2025-03-31_

---

## Mevcut Durum Özeti

### Proje
- **Repo:** https://github.com/ayhanagirgol/FirmaCom (private)
- **Framework:** React Native 0.80.1 + TypeScript
- **Firebase:** Auth + Firestore + App Check (v23.4.0 modular API)
- **Navigation:** React Navigation v7 — NativeStack + BottomTabs
- **Son commit:** `feat: replace PNG tab bar icons with Phosphor Icons`

### Uygulama Yapısı
| Katman | İçerik |
|--------|--------|
| **TabBar (5 sekme)** | Ana Sayfa, Belgeler, Talepler, Sözleşmeler, Profil |
| **Screens** | LoginScreen, RegisterScreen, ForgotPasswordScreeen, HomeScreen, DocumentScreen, RequestScreen, AgreementScreen, ProfilScreen, SplashScreen, LandingPage (onboarding) |
| **Companents** | AgreementScreen, DocumentsScreen, HomeScreen, ProfilScreen, RequestScreen (Bank, Cap, ChangeAdress, Cloud, HGS, Insurance, Kep, Line, PhysicalPos, SoftPos, VirtualPos, WebRequest) |
| **Auth** | Firebase Email/Password + Google Sign-In |
| **Assets** | Banka logoları (12 banka), HGS/fiziksel POS/soft POS/sanal POS ikonları |

### Gözlemlenen Sorunlar
1. **README tamamen default** — React Native boilerplate'i, FirmaCom'a özgü hiçbir bilgi yok
2. **Klasör adı yazım hatası:** `Companents` (Components olmalı) — tüm navigation/import'lara yansımış
3. **Dosya/fonksiyon yazım hataları:** `ForgotPasswordScreeen`, `NewsDetalisContect`, `OfferScreenContect`, `DocumentsKnowlange`, `PaswordChanged`, `SigininDocumentsScreen`, `SolveEncryptionPDF`, `ChangeAdress` — tutarsız isimlendirme
4. **App.tsx bug:** `handleSplashFinish` ve `setShowSplash` fonksiyonu App() component'ının içinde tanımlı ama `MainApp` state'ini kullanmaya çalışıyor (dead code)
5. **Debug token hardcoded:** App.tsx'te Firebase App Check debug token açık kodda (`3E3D12C3-8280-499B-9460-55D69602476B`)
6. **Hardcoded encryption key:** `SolveEncryptionPDF.js`'te `VirgoSolCosmicKey2024!*SecureEncryption` plaintext
7. **`Companents` klasörü altında `src/Components` yok** — src/context ve src/utils var, bileşenler `Companents` altında
8. **InsuranceRequest vs InsuranceClaim** — iki ayrı dosya mevcut, ilişkisi belirsiz
9. **`WebDesignRequestForm.js`** — `WebSiteRequest.js` altında form ayrı ama navigation'da kayıtlı değil
10. **`CapRequest`** — içerik belirsiz (sermaye talebi mi?)

---

## P0 — Hemen Yapılacaklar

| # | Task | Dosya | Açıklama |
|---|------|-------|----------|
| P0-1 | **README'yi FirmaCom'a özel hale getir** | `README.md` | Default RN README → proje açıklaması, kurulum, ekranlar |
| P0-2 | **App.tsx dead code temizliği** | `App.tsx` | `App()` içindeki `handleSplashFinish` + `setShowSplash` dead code kaldır |
| P0-3 | **Debug token'ı env'e taşı** | `App.tsx` | Hardcoded App Check debug token → `.env` + `react-native-config` |

---

## P1 — Kısa Vadeli (Sprint 1)

| # | Task | Dosya | Açıklama |
|---|------|-------|----------|
| P1-1 | **Klasör adı refactor: Companents → Components** | Tüm proje | Rename + tüm import'ları güncelle (20+ dosya) |
| P1-2 | **Dosya adı yazım düzeltmeleri** | Çoklu | ForgotPasswordScreeen→Screen, NewsDetalisContect→Context, PaswordChanged→Password, vb. |
| P1-3 | **WebDesignRequestForm navigation kaydı** | `AppNavigator.tsx` | Form ekranı kayıtlı değil, erişilemiyor |
| P1-4 | **Encryption key .env'e taşı** | `SolveEncryptionPDF.js`, `EncryptionPDF.js` | Güvenlik riski — plaintext key kaldırılmalı |
| P1-5 | **App Check debug token .env'e taşı** | `App.tsx` | Güvenlik — env variable kullan |
| P1-6 | **InsuranceRequest vs InsuranceClaim ilişkisi netleştirilmeli** | RequestScreen | Aynı akış mı, ayrı mı? |

---

## P2 — Orta Vadeli (Sprint 2-3)

| # | Task | Dosya | Açıklama |
|---|------|-------|----------|
| P2-1 | **TypeScript migration** | `src/` altı `.js` dosyalar | Sadece AppNavigator.tsx TypeScript, gerisi JavaScript |
| P2-2 | **Error boundary ekle** | `App.tsx` | Crash durumunda kullanıcı dostu ekran |
| P2-3 | **Loading state iyileştirmesi** | `AppNavigator.tsx` | `LoadingScreen` component'ına logo/brand ekle |
| P2-4 | **`CapRequest` içeriği netleştirilmeli** | `CapRequest.js` | Sermaye talebi mi, kap talebi mi? İçerik boş/belirsiz |
| P2-5 | **Onboarding skip sonrası login yönlendirme** | `landingPage.js` | `navigation.replace` yerine `reset` kullan — back tuşu sorunu |
| P2-6 | **Tab bar label rengi** | `TabBarNavigation.js` | `INACTIVE_COLOR` tab label'lara da uygulanmalı (sadece ikon renkleniyor) |
| P2-7 | **`SigininDocumentsScreen` adı düzelt** | `SigininDocumentsScreen.js` | Typo: Siginin → Signin |
| P2-8 | **Test coverage** | `__tests__/` | Şu an boş; en azından auth flow için temel testler |
| P2-9 | **`firebase.config.backup.js` temizle** | root | Repo'da backup dosyası kalmamalı |

---

## Notlar
- `Companents` klasör adı typo'su tüm projeye yayılmış — düzeltme yüksek efor, P1 olarak işaret edildi
- Firebase App Check debug token hardcoded bırakılmış; production build'de otomatik devre dışı kalıyor (__DEV__ kontrolü var) ama repo güvenliği için env'e taşınmalı
- Projenin genel kalitesi iyi; navigation yapısı temiz, auth flow çalışıyor
