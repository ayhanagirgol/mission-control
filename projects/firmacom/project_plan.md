# FirmaCom Mobil Uygulama - Proje Planı

**Ürün:** FirmaCom (Finhouse.ai)
**Hedef:** Türkiye'deki KOBİ'ler için belge yönetimi + hizmet talebi platformu
**Tarih:** 29 Mart 2026

---

## Vizyon

KOBİ'lerin e-fatura, e-arşiv, e-irsaliye, KEP ve diğer resmi belgelerini tek bir mobil uygulamadan yönetmesi; muhasebeci/mali müşavir ile hizmet taleplerini dijitalleştirmesi.

---

## Sprint Planı

### 🏁 MVP (Sprint 1-3) — 6 Hafta

**Hedef:** Temel belge görüntüleme + hizmet talebi oluşturma

| Sprint | Süre | Görevler | Öncelik |
|--------|------|----------|---------|
| Sprint 1 (2 hafta) | Hafta 1-2 | Proje altyapısı (React Native/Flutter), auth sistemi (telefon/email), **mail ve telefon doğrulama (OTP/verification)**, onboarding akışı | P0 |
| Sprint 2 (2 hafta) | Hafta 3-4 | Belge listeleme & görüntüleme (e-fatura, e-arşiv), PDF preview, arama/filtreleme | P0 |
| Sprint 3 (2 hafta) | Hafta 5-6 | Hizmet talebi oluşturma/takip, push notification, MVP test & bug fix | P0 |

**MVP Çıktısı:** Kullanıcı giriş yapar → belgelerini görür → hizmet talebi açar → durumu takip eder.

### 📦 v1.0 (Sprint 4-6) — 6 Hafta

**Hedef:** Tam belge yönetimi + muhasebeci entegrasyonu

| Sprint | Süre | Görevler | Öncelik |
|--------|------|----------|---------|
| Sprint 4 (2 hafta) | Hafta 7-8 | Belge yükleme (fotoğraf/PDF), OCR ile otomatik veri çıkarma, kategorilendirme | P1 |
| Sprint 5 (2 hafta) | Hafta 9-10 | Muhasebeci paneli (web), müşteri-muhasebeci eşleştirme, mesajlaşma | P1 |
| Sprint 6 (2 hafta) | Hafta 11-12 | Dashboard & raporlama, KDV/vergi takvimi bildirimleri, performans optimizasyonu | P1 |

### 🚀 v1.1 (Sprint 7-9) — 6 Hafta

**Hedef:** Gelişmiş özellikler + ölçeklendirme

| Sprint | Süre | Görevler | Öncelik |
|--------|------|----------|---------|
| Sprint 7 (2 hafta) | Hafta 13-14 | e-İmza / e-Mühür entegrasyonu, KEP entegrasyonu | P2 |
| Sprint 8 (2 hafta) | Hafta 15-16 | GİB API entegrasyonu (e-fatura sorgulama), çoklu şirket desteği | P2 |
| Sprint 9 (2 hafta) | Hafta 17-18 | AI destekli belge sınıflandırma, analitik dashboard, App Store/Play Store yayın | P2 |

---

## Teknik Stack (Önerilen)

- **Mobil:** React Native veya Flutter
- **Backend:** Node.js (NestJS) veya Go
- **Veritabanı:** PostgreSQL + Redis
- **Dosya Depolama:** S3-uyumlu (MinIO veya AWS S3)
- **Auth:** Firebase Auth veya Supabase Auth
- **CI/CD:** GitHub Actions + Fastlane
- **OCR:** Google Vision API veya Tesseract

---

## Riskler

| Risk | Etki | Azaltma |
|------|------|---------|
| GİB API erişim gecikmeleri | Yüksek | MVP'de GİB bağımsız çalış, v1.1'de entegre et |
| KOBİ dijital okuryazarlık | Orta | Basit UI, video rehberler, onboarding wizard |
| Yasal uyumluluk (KVKK) | Yüksek | Baştan KVKK-uyumlu mimari, veri şifreleme |
| Muhasebeci adaptasyonu | Orta | Muhasebeci-first tasarım, kolay entegrasyon |

---

## Başarı Metrikleri

- MVP: 100 beta kullanıcı, %70 retention (haftalık)
- v1.0: 1.000 aktif kullanıcı, 50 muhasebeci partner
- v1.1: 5.000 aktif kullanıcı, App Store 4.0+ puan
