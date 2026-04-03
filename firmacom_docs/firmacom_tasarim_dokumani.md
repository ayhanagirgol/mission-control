# FirmaCom — Tasarım & UI-UX İyileştirme Dokümanı

**Tarih:** 27 Mart 2025  
**Kapsam:** Mobil (React Native) + Web (React/Vite)  
**Temel Kaynak:** Kaynak kodu + stil dosyaları analizi  

---

## Yönetici Özeti

FirmaCom mevcut haliyle tutarlı bir renk kimliğine sahip (mavi-mor gradient) ancak **iç ekranlarda tasarım dili onboarding kalitesini yakalayamıyor**. Landing/Login güçlü, Dashboard/Belge/Profil ekranları ise teknik olarak işlevsel ama görsel hiyerarşi, boşluk sistemi ve component tutarlılığı açısından zayıf. Aşağıdaki rehber, kod incelemesinde tespit edilen gerçek sorunlara dayanmaktadır.

---

## 1. Mevcut UI Sorunları

### 1.1 Gradient Monotonluğu
Her ekran tam ekran `#1b46b5 → #711EA2 → #1149D3` gradient ile başlıyor. Login, Register, HomeScreen, RequestScreen, DocumentScreen, ProfilScreen, LandingPage — hepsi aynı renk. Bu renk güçlü bir kimlik oluşturuyor ama uygulama içinde **ekranlar birbirinden ayırt edilemiyor**.

### 1.2 Alt Sekme Bar Tasarımı (Mobil)
`TabBarNavigation.js`'de tab bar için **hiçbir özel stil tanımlı değil** — React Navigation'ın varsayılan görünümü kullanılıyor. Aktif ikon rengi `#1b46b5ff`, pasif `#000000`. İkon boyutları (`25x25`) küçük, aktif sekme için arka plan yok, label font boyutu varsayılan. Görünüm geçici bir prototip izlenimi veriyor.

### 1.3 Kart Tasarımı Tutarsızlığı
- `RequestScreen`'deki kart `borderRadius: 23` ile yuvarlak, iç içe `TouchableOpacity` gereksiz tekrarı var.
- `DocumentScreen`'deki kart aynı stili kopyalamış ama "Yükle" ve "Paylaş" butonları farklı renkler (`#1b46b5` vs `#43b243`) kullanıyor — bu tek renk sistemiyle çelişiyor.
- Web tarafındaki `Requests.tsx` ikonları tek bir `iconColor = '#667eea'` ile sabit — mobil renk (`#1b46b5`) ile web rengi (`#667eea`) uyumsuz.

### 1.4 Profil Ekranı — Kırık CSS
`ProfilScreen.js`'de:
```javascript
backdropFilter: 'blur(10px)',  // React Native'de desteklenmiyor
```
Bu özellik sessizce yok sayılıyor. `profileContainer` yüksekliği `verticalScale(500)` ile sabit; içerik fazla olduğunda taşıyor.

### 1.5 Kayıt Ekranı — Input Placeholder Rengi
RegisterScreen'de placeholder rengi `#ffffff` — arka plan da `#FFFFFF80`. Metin neredeyse görünmez. LoginScreen'de ise `#666` — daha iyi ama tutarsız.

### 1.6 Dashboard (Web) — Boş İçerik
`Dashboard.tsx`'te sadece kampanyalar gösteriliyor, haber bölümü `AuthContext`'te hazırlanmış ama dashboard'da kullanılmamış. Ekranın büyük çoğunluğu boş kalıyor.

### 1.7 Onboarding → Uygulama İçi Geçiş Kırılması
`LandingPage.js` yüksek kalite animasyon + tipografi içeriyor. Ardından gelen `LoginScreen` daha az rafine bir görünüme sahip. Gradient aynı ama tipografi, spacing ve component kalitesi düşüyor.

### 1.8 Eksik Empty State Tasarımları
- `AgreementScreen` görünüşe göre boş liste gösteriyor, empty state ikonunun tasarımı yok.
- Sözleşme yoksa ekranda ne gösterileceği tanımlı değil.

---

## 2. Hedef Tasarım Dili

**Konsept:** "Kurumsal Güven + Modern Sadelik"

- **Ton:** Profesyonel ama soğuk değil. KOBİ sahibi olan bir kullanıcıya hem güvende hissettirmeli hem de kullanımı kolay görünmeli.
- **İlham:** Fintech uygulamaları (N26, Wise, Papara) + Kurumsal SaaS (Notion, Linear)
- **Yaklaşım:** Gradient kimliği korunur ama iç ekranlarda beyaz yüzeyler ön plana çıkar. Gradient artalan değil aksent olarak kullanılır.

---

## 3. Renk / Font / Spacing Sistemi

### 3.1 Renk Paleti

| Token | Değer | Kullanım |
|---|---|---|
| `--brand-primary` | `#1B46B5` | Ana aksent, buton, aktif sekme |
| `--brand-secondary` | `#711EA2` | Gradient orta noktası, vurgu |
| `--brand-gradient` | `135deg, #1B46B5 0%, #711EA2 60%, #1149D3 100%` | Header alanları, splash, onboarding |
| `--surface-white` | `#FFFFFF` | İç ekran arka planı |
| `--surface-light` | `#F4F6FA` | Kart arka planı, input arka planı |
| `--surface-border` | `#E2E8F0` | Kart kenarlığı |
| `--text-primary` | `#1A1A2E` | Başlık metinleri |
| `--text-secondary` | `#64748B` | Alt başlık, açıklama |
| `--text-disabled` | `#94A3B8` | Pasif metin |
| `--success` | `#22C55E` | Başarı durumu, onaylı |
| `--warning` | `#F59E0B` | Uyarı |
| `--danger` | `#EF4444` | Hata, çıkış butonu |
| `--white-alpha-10` | `rgba(255,255,255,0.1)` | Gradient üzeri overlay |
| `--white-alpha-20` | `rgba(255,255,255,0.2)` | Gradient üzeri kart kenarlığı |

### 3.2 Tipografi

| Token | Değer | Kullanım |
|---|---|---|
| `--font-display` | 700, 34–36px | Ekran başlıkları (GİRİŞ, KAYIT OL) |
| `--font-title` | 700, 24–28px | Bölüm başlıkları |
| `--font-subtitle` | 600, 18–20px | Kart başlıkları |
| `--font-body` | 400, 14–16px | Açıklama metinleri |
| `--font-caption` | 400, 12–13px | Meta bilgi, tarih, etiket |
| `--font-button` | 600, 14–16px | Buton metni |
| `--letter-spacing-wide` | `0.5–1px` | Başlıklarda hava |

**Mobil için:** Sistem fontu (SF Pro / Roboto) yeterli. Özel font eklenecekse yalnızca display için.

### 3.3 Spacing Sistemi

Mevcut kod `scale()`, `verticalScale()`, `moderateScale()` kullanıyor — bu doğru yaklaşım, tutarsız uygulanıyor.

**Önerilen baz değerler:**

| Token | px | Kullanım |
|---|---|---|
| `spacing-xs` | 4 | İkon-metin arası |
| `spacing-sm` | 8 | İnput padding yatay |
| `spacing-md` | 16 | Kart padding, bölüm arası |
| `spacing-lg` | 24 | Ekran kenar boşluğu |
| `spacing-xl` | 40 | Header üst boşluğu (safe area) |
| `spacing-2xl` | 64 | Ekran başı paddingi (iOS) |

### 3.4 Border Radius

| Token | Değer | Kullanım |
|---|---|---|
| `radius-sm` | 8px | Input alanları |
| `radius-md` | 12px | Butonlar, küçük kartlar |
| `radius-lg` | 20px | Ana kartlar |
| `radius-xl` | 28px | Modal, bottom sheet |
| `radius-full` | 9999px | Chip, badge, avatar |

---

## 4. Ekran Yaklaşımları

### 4.1 Landing Page
**Mevcut durum:** İyi. Framer Motion animasyonları, step göstergesi, temiz tipografi.  
**İyileştirme:**  
- Slayt görselleri şu an yok; her slayt için farklı SVG illüstrasyon eklenmeli.
- "Başlayalım" butonu son slayttan önce görünmüyor — kullanıcılar progress'i kaçırıyor. Mobil'de her slayta küçük "devam" oku eklenmeli.
- Web landing sayfasına "Müşteri logoları" bölümü eklenebilir (güven inşası).

### 4.2 Login / Register
**Mevcut durum:** Gradient arka plan, beyaz input, iyi.  
**Sorunlar ve çözümler:**

```
Sorun: Register placeholder rengi #ffffff → görünmez
Çözüm: placeholder rengi → #FFFFFF80 (LoginScreen ile eşleştir)

Sorun: Input label ve input arasındaki dikey boşluk tutarsız
Çözüm: Her input grubu tek bir component olarak sarılmalı (FormField)

Sorun: "FirmaCom | @2025 – Bir FinHouse uygulamasıdır." alt metin
Çözüm: Daha temiz: "© 2025 FirmaCom · FinHouse" — footer daha minimal olabilir
```

**İdeal Login ekranı yapısı:**
```
Header Gradient Alan (üst 35%)
  └── Logo / İkon
  └── "GİRİŞ" başlık
  └── Alt metin

Beyaz Form Kartı (kalan alan, rounded top corners)
  └── E-posta input
  └── Şifre input + göster/gizle
  └── Şifremi unuttum link (sağa hizalı)
  └── Giriş Yap butonu
  └── "veya" ayırıcı
  └── Google butonu
  └── Kayıt yönlendirme
```

### 4.3 Dashboard / Ana Sayfa
**Mobil:**  
- Üst alanda "Hoş Geldiniz + isim" + gradient = iyi ama altındaki haberler ve kampanyalar kartları aynı gradient üstünde. **Fark yaratmak için** haber slider'ı gradient üzerinde "floating card" görünümünde, kampanyalar ise içeride beyaz bölüm olarak yapılandırılabilir.
- Kısayollar (ShortcutScreen) hızlı erişim için iyi ama **hangi kısayolların göründüğü** hardcoded; kişiselleştirilebilir yapılmalı.

**Web:**  
- Şu an sadece kampanyalar gösteriliyor. Haber bölümü + aktif talepler özeti + hoş geldin mesajı eklenince ekran dolacak.
- Dashboard bir "Personal CRM Dashboard" olarak etiketlenmiş (`welcomeSubtitle`) — bu etiket ürün konumlandırmasıyla örtüşmüyor, kaldırılmalı.

### 4.4 App İçi Genel Ekranlar (Belgeler, Talepler, Profil)
**Sorun:** Tüm ekranlar gradient dolgu → beyaz kartlar. Bu kabul edilebilir ama ekranlar birbirinden görsel olarak ayırt edilemiyor.

**Önerilen yaklaşım — Ekran başlık alanı sistemi:**
```
[Ekran Üst Alanı - Gradient]
  safeArea paddingTop
  Başlık (Belgeler / Talepler / Profil)
  Alt başlık (açıklama veya sayısal özet)
[İçerik Alanı - Beyaz / Surface-Light]
  Kaydırılabilir içerik
  Kartlar
```
Bu "eğri geçiş" (concave header + flat body) yaklaşım birçok modern uygulamada kullanılıyor ve içerik hiyerarşisini netleştiriyor.

### 4.5 Profil Ekranı
**Mevcut:** Gradient arka plan + glassmorphism benzeri satırlar. Çalışıyor ama `backdropFilter` kırık.

**Önerilen:**
- Üstte avatar dairesel alan (gradient arka plan)
- Alt kısım beyaz kart içinde profil satırları
- Her satır `chevron-right` ile tıklanabilir olduğu belli edilmeli
- "Çıkış Yap" butonu kırmızı — doğru, ancak daha küçük ve daha az agresif olabilir

---

## 5. Request (Talep) Ekranı Deseni

Bu ekran ürünün çekirdeği — en fazla UX dikkatini hak eden yer.

### Mevcut Akış:
```
RequestScreen → [talep seç] → RequestDetails (operatör/banka seç)
  → RequestDetails (adım adım belge yükle)
  → PDF derleme → Gönderim
```

### Sorunlar:
1. `RequestScreen`'deki kart tasarımı fazla basit — sadece isim + klasör ikonu. Kullanıcı neyin ne olduğunu anlamıyor.
2. Operatör/kurum seçimi ayrı bir ekran olarak açılıyor ama **geri butonu görünümü** tutarsız (bazı ekranlarda custom back, bazılarında yok).
3. Belge yükleme adımları (step wizard) işlevsel ama görsel ilerleme göstergesi (progress bar / step indicator) eksik.

### Önerilen Request Kart Tasarımı (mobil):
```
┌─────────────────────────────────────┐
│  [İKON]  Hat Talebi                 │
│          Operatör seçimi gerekli    │
│                          [>]  Başla │
└─────────────────────────────────────┘
```
- İkon anlamlı ve renkli (her kategori için farklı renk tonu)
- Kısa açıklama metni eklenince kullanıcı ne yapacağını anlıyor
- Sağ tarafta "Başla" butonu veya ok

### Önerilen Talep Detay Step Wizard:
```
[Step 1/5]  ────────────────░░░░░░  20%

  📄 Vergi Levhası
  "Şirketin vergi levhasını yükleyin"
  
  [ Dosya Seç ] [ Tara ]
  
  ✓ Yüklendi: vergi_levhasi.pdf
  
           [< Geri]  [İleri >]
```
- Üstte progress bar (mevcut değil)
- Her adım için açıklama metni (kısmen var)
- Yüklenen dosya göstergesi (var ama görsel değil)
- Alt navigasyon butonları tutarlı konumda

---

## 6. Component Prensipleri

### 6.1 FormField (Input Wrapper)
Tüm input alanları tek bir component olmalı:
```
<FormField
  label="E-posta"
  icon={<EmailIcon />}
  value={email}
  onChange={setEmail}
  error="Geçersiz format"
  variant="glass" | "solid" | "outline"
/>
```
Mevcut kodda her ekranda aynı `<View><Text label /><View input /></View>` bloğu tekrarlanıyor.

### 6.2 PrimaryButton
```
<PrimaryButton
  label="Giriş Yap"
  onPress={handleLogin}
  loading={isLoading}
  disabled={!email || !password}
  variant="solid" | "outline" | "ghost"
/>
```
Mevcut: Her ekranda farklı `backgroundColor`, `paddingVertical`, `borderRadius` değerleri.

### 6.3 RequestCard
Talepler ekranındaki kartlar reusable olmalı:
```
<RequestCard
  title="Hat Talebi"
  description="Operatör seçin"
  icon={<SimCardIcon />}
  onPress={() => navigate('LineRequest')}
/>
```

### 6.4 SectionHeader
Her ekranın üst başlık alanı için:
```
<SectionHeader
  title="Talepler"
  subtitle="İhtiyacınız olan hizmeti seçin"
  gradient
/>
```

### 6.5 Avatar / UserBadge
Profil ekranında ve header'da kullanıcı avatarı:
```
<Avatar
  name="Ayhan Ağırgöl"
  photoURL={user.photoURL}
  size="lg" | "sm"
/>
```
Baş harflerden otomatik avatar oluşturabilmeli.

### 6.6 StatusBadge
Talep durumu gösterimi için:
```
<StatusBadge status="pending" | "approved" | "rejected" | "processing" />
```

### Tasarım Kararı: Native vs Platform-Specific
Mobil ve web ayrı codebase olduğu için **component seti de ayrı olmalı**. Paylaşılan şey: renk paleti, tipografi ve spacing token'ları (JSON/const dosyası olarak). Ortak component library için zaman varsa `design-tokens.js` dosyası oluşturulabilir.

---

## 7. Sonraki İyileştirme Backlog'u

### Öncelik 1 — Temel Tutarlılık

| Görev | Etki | Efor |
|---|---|---|
| `FormField` component oluştur, tüm input'ları taşı | Yüksek | Orta |
| `PrimaryButton` component oluştur | Yüksek | Düşük |
| Register placeholder rengini düzelt (`#FFFFFF80`) | Orta | Çok Düşük |
| Tab bar özel stil ve aktif indikatör ekle | Orta | Düşük |
| `backdropFilter` kaldır, gerçek stil yaz | Düşük | Çok Düşük |
| Web `iconColor` `#667eea` → `#1B46B5` ile eşleştir | Düşük | Çok Düşük |

### Öncelik 2 — UX İyileştirme

| Görev | Etki | Efor |
|---|---|---|
| Talep detay ekranına step progress bar ekle | Yüksek | Orta |
| Request kart tasarımını açıklama metni ile zenginleştir | Yüksek | Düşük |
| Dashboard'a haber bölümü ekle (AuthContext zaten hazır) | Yüksek | Düşük |
| Empty state tasarımları (sözleşmeler, boş belge listesi) | Orta | Düşük |
| "Ekran geçiş" sistemi: gradient header + beyaz body | Orta | Yüksek |

### Öncelik 3 — Görsel Kalite

| Görev | Etki | Efor |
|---|---|---|
| Landing page slayt illüstrasyonları | Orta | Yüksek |
| Başarı/hata animasyonları (lottie veya reanimated) | Orta | Orta |
| Onboarding → Login geçişi kalite tutarlılığı | Orta | Orta |
| Karanlık tema desteği (opsiyonel) | Düşük | Çok Yüksek |
| `RequestCard` ikonu her kategori için ayrı renk | Düşük | Düşük |

---

## 8. Hızlı Kazanımlar (Bu Hafta Yapılabilecekler)

1. **Register `placeholderTextColor="#FFFFFF80"`** → 1 satır değişiklik, görünürlüğü dramatik artırır
2. **Web: Dashboard'a haber slider ekle** → `campaignData` zaten bağlı, `newsData` da `AuthContext`'te hazır, sadece JSX eklenecek
3. **Web: `welcomeSubtitle` metnini "Personal CRM Dashboard" → "Kurumsal Hizmetleriniz" değiştir** → 1 kelime
4. **Mobil tab bar aktif sekme arka planı ekle** → 10 satır CSS
5. **`backdropFilter` satırını kaldır** → ProfilScreen'de sessiz hata sona erer

---

*Bu doküman Mart 2025 itibarıyla kaynak kodu stil dosyaları ve bileşen incelemesine dayanmaktadır. Görsel mockup'lar için Figma veya eşdeğer araç önerilir.*
