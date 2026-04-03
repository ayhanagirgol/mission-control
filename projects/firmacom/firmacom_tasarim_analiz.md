# FirmaCom Mobil Uygulama — Analiz, Tasarım ve Teknik Spesifikasyon Dokümanı

**Versiyon:** 1.0  
**Tarih:** 2026-04-03  
**Durum:** Taslak (Yazılım Ekibi İçin)  
**Hazırlayan:** Kıdemli Yazılım Analisti & Ürün Tasarımcısı

---

## 1. Ürün Vizyonu ve Hedef Kitle

### 1.1 Çözülen Problem
Türkiye'deki KOBİ'ler (özellikle 1-50 çalışanlı mikro ve küçük işletmeler), resmi belgelerini (e-fatura, e-arşiv, sözleşmeler) ve bankacılık/operasyonel hizmet taleplerini dağınık kanallar (WhatsApp, e-posta, fiziksel dosya) üzerinden yönetmektedir. Bu durum veri kaybına, gecikmelere ve operasyonel verimsizliğe yol açmaktadır.

### 1.2 Hedef Kullanıcı Profili (Persona)
- **KOBİ Sahibi (30-55 Yaş):** Teknolojiyi işini kolaylaştırmak için kullanan, mobil odaklı, muhasebe süreçlerinde karmaşadan kaçınan profesyoneller.
- **Mali Müşavir / Muhasebeci:** Müşterisinden gelen evrakları düzenli almak ve hizmet taleplerini (POS başvurusu, sigorta vb.) hızlıca işlemek isteyen paydaşlar.

### 1.3 Rekabet Analizi
- **Rakipler:** Paraşüt, Bizim Hesap, Logo İşbaşı, Kolaybi, Defter.app.
- **Farklılaşma Noktası:** Sadece ön muhasebe değil, "Hizmet Talebi" (Lead Gen) ve AI destekli belge analizi ile KOBİ'nin operasyonel asistanı olma vizyonu.

---

## 2. Fonksiyonel Gereksinimler

### 2.1 Ana Ekranlar ve Kullanıcı Akışları
Uygulama 5 ana sekmeden (Bottom Tab Navigation) oluşmaktadır:

1.  **Ana Sayfa (Home):** Özet finansal durum, bekleyen taleplerin statüsü ve günlük bülten/haberler.
2.  **Belgeler (Documents):** Yüklenen e-fatura, e-arşiv ve diğer PDF/Görüntü dosyalarının listesi. GPT-4o Vision ile otomatik veri çıkarma.
3.  **Talepler (Requests):** 11 farklı kategoride (Banka, POS, HGS vb.) hizmet talebi oluşturma alanı.
4.  **Sözleşmeler (Agreements):** İmzalı dijital sözleşmelerin saklandığı ve görüntülendiği arşiv.
5.  **Profil (Profile):** Şirket bilgileri, abonelik yönetimi ve ayarlar.

### 2.2 Hizmet Talebi Detayları (Örnek Form Alanları)
Her talep tipi Firestore'da `requests` koleksiyonu altında saklanmalı ve `status` (pending, approved, rejected) ile takip edilmelidir.

- **Banka Talebi:** Banka seçimi (Dropdown), hesap tipi (TL/Döviz), şirket yetkilisi bilgileri.
- **POS Talebi (Fiziksel/Sanal/Soft):** Ciro tahmini, sektör bilgisi, vergi levhası yükleme.
- **HGS Talebi:** Plaka numarası, araç sınıfı, ruhsat görüntüsü.
- **Web Sitesi / Bulut:** İhtiyaç özeti, bütçe aralığı, iletişim tercihi.

---

## 3. Teknik Mimari

### 3.1 Teknoloji Stack'i
- **Frontend:** React Native 0.80.1 (New Architecture önerilir)
- **Dil:** TypeScript (Mevcut .js dosyaları migrate edilecek)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **AI:** OpenAI GPT-4o Vision API (Belge analizi için)
- **Navigation:** React Navigation v7 (Native Stack + Bottom Tabs)

### 3.2 Firebase Yapısı
- **Collections:**
  - `users`: `{uid, email, companyName, role, premiumStatus}`
  - `documents`: `{docId, userId, type, contentHash, aiData: {amount, date, vendor}, status}`
  - `requests`: `{requestId, userId, type, data: {}, status, createdAt}`
- **Security Rules:** Sadece `request.auth.uid == resource.data.userId` olan verilerin okunmasına izin verilmelidir. Belge yüklemelerinde App Check zorunlu tutulmalıdır.

### 3.3 State Management
- **Tercih:** TanStack Query (React Query) v5.
- **Neden:** Firestore verilerinin cache yönetimi ve loading/error state'lerinin deklaratif yönetimi için.

---

## 4. UI/UX Tasarım Gereksinimleri

### 4.1 Görsel Kimlik
- **Renk Paleti:** Ana renk: Finhouse Turuncusu (#FF6B00), İkincil: Gece Mavisi (#1A2B3C), Arka Plan: Açık Gri/Beyaz.
- **Tipografi:** Inter veya Roboto (Modern ve okunabilir).
- **İkon Seti:** Phosphor Icons (Mevcut geçiş tamamlanmalı).

### 4.2 Navigasyon Yapısı
- **Bottom Tab:** Ana Sayfa, Belgeler, Talepler, Sözleşmeler, Profil.
- **Stack:** Login -> Register -> Onboarding -> MainTabs.
- **Modals:** Talep detayları ve belge önizleme için tam ekran modallar kullanılmalı.

---

## 5. Teknik Borç ve Öncelikli Düzeltmeler (Kritik)

### 5.1 Acil Refactor (P0)
- **Naming:** `Companents` klasörü acilen `components` olarak değiştirilmeli ve tüm import'lar güncellenmelidir.
- **Typo Fix:** `ForgotPasswordScreeen`, `SigininDocumentsScreen` gibi dosya adları standartlaştırılmalıdır.
- **Security:** `SolveEncryptionPDF.js` içindeki plaintext key ve `App.tsx` içindeki hardcoded debug token `.env` dosyasına (`react-native-config`) taşınmalıdır.

### 5.2 Kod Kalitesi
- Projenin %90'ı JavaScript'tir. Yeni eklenecek tüm özellikler `.tsx` ile yazılmalı ve mevcut `.js` dosyaları sprint bazlı TS'ye dönüştürülmelidir.
- `App.tsx` içindeki "dead code" (kullanılmayan splash fonksiyonları) temizlenmelidir.

---

## 6. Yol Haritası (Roadmap)

### Sprint 0: Teknik Temizlik (2 Hafta)
- Klasör ve dosya adı düzeltmeleri.
- `.env` entegrasyonu ve güvenlik açıklarının kapatılması.
- TypeScript migration başlangıcı.

### Sprint 1: Belge Yönetimi MVP (2 Hafta)
- Firestore document listeleme.
- PDF/Image preview iyileştirmesi.
- GPT-4o Vision entegrasyonu (OCR/Analiz).

### Sprint 2: Talep Akışları (2 Hafta)
- 11 farklı talep formu için UI/UX tasarımı.
- Backend (Firestore) kayıt mantığı.
- Push Notification (Talep durum değişiklikleri).

---

## 7. Gelir Modeli Entegrasyonu

### 7.1 Lead Generation (Komisyon)
- Banka/POS/Sigorta talepleri oluşturulduğunda, her talep için benzersiz bir `leadId` oluşturulur.
- Partner (Banka/Operatör) API'si varsa webhook ile, yoksa panel üzerinden talep sonucu takip edilerek komisyon hakedişi hesaplanır.

### 7.2 Reklam ve Premium
- **AdMob:** Ana sayfa ve talep listesi arasına "Native Ads" yerleşimi.
- **Premium:** Aylık/Yıllık abonelik ile reklamların kaldırılması ve sınırsız AI belge analizi hakkı. (RevenueCat entegrasyonu önerilir).

---
*Bu doküman yazılım ekibi için bir rehber niteliğindedir. Uygulama aşamasında teknik kısıtlar doğrultusunda revize edilebilir.*
