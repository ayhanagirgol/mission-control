# FirmaCom — Ürün Backlog

_Son güncelleme: 30 Mart 2026_

## 🔴 P0 — Kritik (MVP'de olmalı)

- [ ] [P0] Auth sistemi — telefon/email ile kayıt, OTP doğrulama
- [ ] [P0] Onboarding akışı — yeni kullanıcı wizard
- [ ] [P0] Belge listeleme — e-fatura, e-arşiv, e-irsaliye görüntüleme
- [ ] [P0] PDF preview — belge okuyucu
- [ ] [P0] Hizmet talebi oluşturma — form + durum takibi
- [ ] [P0] Push notification — bildirim sistemi
- [ ] [P0] AI belge analizi — GPT-4o Vision ile PDF/fotoğraf analizi ✅ (entegre edildi, PDF→image dönüşümü gerekiyor)

## 🟡 P1 — Önemli (v1.0)

- [x] [P1] **Modern İkon Kütüphanesi Seçimi ve Uygulanması** ✅ TAMAMLANDI
  - Seçilen kütüphane: **Phosphor Icons** (Ayhan onayı: 2026-03-31)
  - Kurulum: `phosphor-react-native` npm paketi eklendi
  - Tab bar ikonları değiştirildi: House, Files, FolderOpen, Signature, UserCircle
  - Renk: aktif #D3B679 (altın), pasif #29304A (lacivert), weight="duotone"
  - Commit: `adbab04` — main branch'e push edildi
  - Ekleyen: Güneş / 2026-03-31

- [ ] [P1] Belge yükleme — fotoğraf/PDF çekme ve yükleme
- [ ] [P1] OCR otomatik veri çıkarma — vergi levhası, fatura vb.
- [ ] [P1] Muhasebeci paneli — web arayüzü
- [ ] [P1] Müşteri-muhasebeci eşleştirme
- [ ] [P1] Dashboard & raporlama — KDV/vergi takvimi
- [ ] [P1] PDF→Image dönüşümü düzeltmesi — Vision API için ön işleme

## 🟢 P2 — İstenen (v1.1)

- [ ] [P2] e-İmza / e-Mühür entegrasyonu
- [ ] [P2] KEP entegrasyonu
- [ ] [P2] GİB API entegrasyonu
- [ ] [P2] Çoklu şirket desteği
- [ ] [P2] AI destekli belge sınıflandırma
- [ ] [P2] App Store / Play Store yayın hazırlığı

## ✅ Tamamlanan

- [x] AI belge analizi GPT-4o Vision API entegrasyonu (OpenAI API ödeme + quota aktif)
- [x] Metro bundler port 8081 sorunu giderildi
- [x] Simülatörde uygulama çalışıyor (Ana Sayfa, Dosya Durumunuz, Hızlı Aksiyonlar)
- [x] Proje planı hazırlandı (Sprint 1-9)
- [x] FirmaCom Proje Yöneticisi Agent spawned

## 📌 Notlar
- Teknik stack: React Native (belirlendi), Backend henüz seçilmedi
- PDF analizi için Files API veya server-side image dönüşümü araştırılacak
- Muhasebeci: İklime Güney + Arzu Sancar (mevcut Finhouse muhasebecileri)
