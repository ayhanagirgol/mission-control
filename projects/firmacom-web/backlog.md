# FirmaCom Web — Ürün Backlog

_Son güncelleme: 2026-03-31_

---

## 🌐 Domain Araştırması

| Domain | Durum | Not |
|--------|-------|-----|
| **firmacom.com** | ❌ KAYITLI | 2005'ten beri kayıtlı, 2027'ye kadar uzatılmış |
| **firmacom.net** | ✅ MÜSAİT | "No match" — alınabilir |
| **firmacom.com.tr** | ✅ MÜSAİT | "No match" — alınabilir |
| **firmacom.ai** | ✅ **MÜSAİT** | whois: Domain not found — **hemen alınması önerilir** |

---

## 🔴 P0 — Kritik

- [ ] [P0] **firmacom.ai domain satın alınması** ⚡
  - whois kontrolü: "Domain not found" — kayıt yok, müsait
  - "Dijital iş platformu + AI" konumlanmasıyla birebir uyumlu
  - Fırsat kaçmadan alınmalı — registrar: GoDaddy, Namecheap, Google Domains

- [ ] [P0] **Özellikler bölümü tamamen boş**
  - "İşletmeniz için her şey bir arada" başlığı render ediliyor ama altında hiçbir içerik/kart yok
  - 4 özellik kartı (Dijital Belge Yönetimi, Anında Talep Sistemi, Kurumsal Güvenlik, Hızlı İşlem) HTML'de mevcut ama görünmüyor
  - CSS veya JS yükleme sorunu — acil düzeltilmeli

- [ ] [P0] **Hizmetler bölümü tamamen boş**
  - "Tüm iş hizmetleriniz tek platformda" başlığı görünüyor ama 8 hizmet kartı (Hat, POS, HGS, Web, Bulut, Banka, KEP, Sigorta) render edilmiyor
  - Aynı CSS/JS sorunu olabilir

- [x] [P0] **İletişim bölümü — bilgiler güncellendi** ✅ KISMİ (commit 7670214)
  - E-posta: firmacom12@gmail.com → info@finhouse.ai ✅
  - Telefon: "Yakında gelecek" → 0532 614 23 16 (tıklanabilir) ✅
  - İletişim formu hâlâ yok — ayrı P1 task olarak takip edilecek

- [ ] [P0] **Giriş Yap / Kayıt Ol sayfaları yok**
  - Navbar ve footer'daki `/login` ve `/register` linkleri büyük ihtimalle 404 döndürüyor
  - Auth sistemi hazır olana kadar "Yakında" sayfası veya waitlist formu konulmalı

- [x] [P0] **Copyright yılı yanlış** ✅ TAMAMLANDI (commit 7670214)
  - Footer'da "© 2025 FirmaCom" yazıyor — 2026 olmalı

---

## 🟡 P1 — Önemli

- [ ] [P1] **Hero sağ demo widget çok zayıf**
  - Sağ taraftaki animasyonlu widget küçük ve ürünü yeterince temsil etmiyor
  - "Gerekli belgeler otomatik belirlenir", "Talep Oluşturuldu" gibi animasyonlar random döndüğü için anlamsız görünüyor
  - Daha çarpıcı uygulama önizlemesi veya statik ama etkileyici dashboard mockup ile değiştirilmeli

- [ ] [P1] **Navbar linkleri içeriğe gitmiyor**
  - "Özellikler", "Hizmetler", "İletişim" linkleri var ama hedef bölümler boş render edildiği için kullanıcıya boş sayfa gösteriyor
  - Bölüm içerikleri düzeltilene kadar geçici placeholder konulmalı

- [ ] [P1] **"Ücretsiz Başla" CTA'sı nereye götürüyor belirsiz**
  - Auth yoksa waitlist / email capture formuna yönlendirmeli

- [ ] [P1] **KVKK / Gizlilik Politikası yok**
  - Footer'da yasal belgeler (Gizlilik Politikası, Kullanım Koşulları, KVKK Aydınlatma Metni) eksik
  - Türkiye'de kullanıcı verisi toplayan her site için yasal zorunluluk

- [ ] [P1] **Bulut Hizmeti metni kalitesiz**
  - "FirmaCom olarak kullanıcıların ilk olarak ihtiyaçlarına ve isteklerine bağlı olarak..." — yarım cümleler, yazım hataları
  - Tüm hizmet açıklamaları gözden geçirilip profesyonel dille yeniden yazılmalı

- [ ] [P1] **Sosyal medya linkleri yok**
  - Footer'da LinkedIn, X (Twitter), Instagram linkleri eksik

---

## 🟢 P2 — İyileştirme

- [ ] [P2] **Renk paleti tutarsızlığı**
  - Mevcut mavi-mor gradient, FirmaCom kurumsal renk tonuyla birebir uyuşmuyor
  - Hedef palet: lacivert **#29304A** + altın **#D3B679** — tüm gradient ve accent renkler buna göre revize edilmeli

- [ ] [P2] **Footer iletişim bilgisi eksik**
  - Sadece `info@finhouse.ai` var; telefon, adres, FirmaCom'a özgü mail eklenebilir
  - FirmaCom-spesifik mail adresi açılması değerlendirilebilir (`info@firmacom.ai` / `info@firmacom.com.tr`)

- [ ] [P2] **SEO meta tag'leri muhtemelen eksik**
  - OG tags, Twitter Card, meta description kontrol edilmeli
  - Sosyal medya paylaşımında önizleme için kritik

- [ ] [P2] **Fiyatlandırma sayfası**
  - Hizmet başına fiyatlandırma veya paket planları — lead conversion için faydalı

- [ ] [P2] **App Store / Play Store linkleri (placeholder)**
  - Mobil uygulama yayınlandığında kullanılmak üzere hero veya footer'a eklenmeli

- [ ] [P2] **"Hakkımızda" sayfası yok**
  - Şirket, ekip ve vizyon — B2B güven inşası için önemli

- [ ] [P2] **favicon ve PWA manifest**
  - Tarayıcı sekmesinde FirmaCom logosu gösterilmeli

- [ ] [P2] **Domain bağlantısı**
  - Mevcut: firmacom-web.netlify.app → gerçek domain alındığında Netlify'a bağlanacak

---

## ✅ Tamamlanan

- [x] Site Netlify'a deploy edildi (firmacom-web.netlify.app)
- [x] GitHub → Netlify CI/CD aktif
- [x] Koyu/açık tema toggle çalışıyor
- [x] Temel sayfa yapısı oluşturuldu (Hero, Özellikler, Hizmetler, İletişim, Footer)
- [x] Domain araştırması tamamlandı (firmacom.ai müsait ✅)

---

## 📌 Notlar

- Platform: Statik HTML / Netlify
- Deploy: GitHub → Netlify (Finhouse hesabı)
- Site: https://firmacom-web.netlify.app
- İletişim: info@finhouse.ai | 0532 614 23 16
- **Öncelikli aksiyon:** firmacom.ai domain satın alımı + içerik bölümleri render sorunu
