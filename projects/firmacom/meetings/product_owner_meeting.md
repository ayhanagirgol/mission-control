# Product Owner Toplantı Notları

**Tarih:** 29 Mart 2026
**Ürün:** FirmaCom (Finhouse.ai)
**Konu:** MVP Kapsamı & Kullanıcı Hikayeleri

---

## MVP Kapsamı

MVP'de odak: **Belge görüntüleme + hizmet talebi**. Minimum sürtünme ile KOBİ sahibinin belgelerine ulaşması ve muhasebecisinden hizmet talep edebilmesi.

**MVP'de VAR:**
- Kullanıcı kaydı ve giriş (telefon/email)
- Belge listeleme, filtreleme, arama
- PDF/görsel belge önizleme
- Hizmet talebi oluşturma ve durum takibi
- Push bildirimler

**MVP'de YOK (sonraki sürümler):**
- Belge yükleme/OCR
- Muhasebeci paneli
- e-İmza/KEP entegrasyonu
- GİB API entegrasyonu
- AI sınıflandırma

---

## Kullanıcı Hikayeleri (User Stories)

### Kimlik & Giriş
- **US-01:** KOBİ sahibi olarak, telefon numaram ile hızlıca kayıt olmak istiyorum, böylece dakikalar içinde uygulamayı kullanmaya başlayabilirim.
- **US-02:** Kullanıcı olarak, biyometrik giriş (FaceID/parmak izi) kullanmak istiyorum.

### Belge Yönetimi
- **US-03:** KOBİ sahibi olarak, tüm e-fatura ve e-arşiv belgelerimi tarih/tür bazında listelemek istiyorum.
- **US-04:** Kullanıcı olarak, bir belgeyi arayıp hızlıca bulmak istiyorum (firma adı, tutar, tarih).
- **US-05:** Kullanıcı olarak, belge detayını (PDF) uygulama içinde görüntülemek ve paylaşmak istiyorum.

### Hizmet Talepleri
- **US-06:** KOBİ sahibi olarak, muhasebecime "yeni fatura kes", "beyanname hazırla" gibi talepler göndermek istiyorum.
- **US-07:** Kullanıcı olarak, açtığım taleplerin durumunu (beklemede/işlemde/tamamlandı) takip etmek istiyorum.
- **US-08:** Kullanıcı olarak, talep durumu değiştiğinde bildirim almak istiyorum.

### Bildirimler
- **US-09:** Kullanıcı olarak, yeni belge geldiğinde push bildirim almak istiyorum.
- **US-10:** Kullanıcı olarak, vergi takvimi hatırlatmaları almak istiyorum (v1.0).

---

## Önceliklendirme

| Öncelik | Özellik | Gerekçe |
|---------|---------|---------|
| P0 | Auth + Onboarding | Giriş olmadan uygulama yok |
| P0 | Belge listeleme/görüntüleme | Ana değer önerisi |
| P0 | Hizmet talebi | İkinci ana değer önerisi |
| P1 | Belge yükleme + OCR | Kullanıcı kendi belgesini ekler |
| P1 | Muhasebeci paneli | İki taraflı platform |
| P2 | e-İmza, KEP, GİB | Entegrasyon katmanı |

---

## Aksiyonlar

1. ✅ MVP scope freeze — bu toplantıda kesinleşti
2. 📋 Wireframe hazırlığı başlatılacak (Figma)
3. 📋 Backend API spec yazılacak (OpenAPI)
4. 📋 Test kullanıcı grubu belirlenecek (10-20 KOBİ)
