# FirmaCom Proje Özet Raporu

**Tarih:** 29 Mart 2026
**Hazırlayan:** Proje Yöneticisi Agent
**Ürün:** FirmaCom — Finhouse.ai
**Hedef:** Türkiye KOBİ'leri için belge yönetimi + hizmet talebi mobil platformu

---

## Yönetici Özeti

FirmaCom, KOBİ'lerin e-fatura, e-arşiv ve diğer resmi belgelerini mobil üzerinden yönetmesini ve muhasebecilerinden hizmet talep etmesini sağlayan bir platform olarak planlandı. 5 toplantı yapıldı; MVP kapsamı, teknik mimari, pazarlama stratejisi, rakip analizi ve kullanıcı hikayeleri belirlendi.

**Toplam proje süresi:** 18 hafta (9 sprint × 2 hafta)
- MVP: 6 hafta → Belge görüntüleme + hizmet talebi
- v1.0: 6 hafta → Belge yükleme, OCR, muhasebeci paneli
- v1.1: 6 hafta → e-İmza, KEP, GİB, AI sınıflandırma

---

## Toplantı Özetleri

### 1. Product Owner
- MVP kapsamı kesinleşti: auth, belge görüntüleme, hizmet talebi, push bildirim
- 10 kullanıcı hikayesi tanımlandı (US-01 → US-10)
- MVP'de OCR, muhasebeci paneli ve entegrasyonlar yok

### 2. Marketing Manager
- Birincil hedef kitle: 1-50 çalışanlı KOBİ sahipleri (30-55 yaş)
- Pozisyonlama: "KOBİ'nizin dijital muhasebe asistanı"
- Kanallar: LinkedIn, Google Ads, YouTube, Blog (finhouse.ai), SMMM odaları
- Lansman: waitlist → beta (50-100 kişi) → public launch
- Referans programı: "Muhasebecini davet et" modeli

### 3. Codex / Teknik
- Stack: React Native + NestJS + PostgreSQL + Firebase Auth + S3
- Monorepo (Turborepo), CI/CD (GitHub Actions + Fastlane)
- 7 teknik borç kaydedildi, en kritik: KVKK uyumlu şifreleme
- Sprint 1-3 backlog detaylandırıldı

### 4. Analist Görüşmesi
- 5 rakip analiz edildi (Parasut, Bizim Hesap, Logo İşbaşı, Kolaybi, Defter.app)
- Farklılaşma: mobil-first + belge/talep combo + KOBİ-muhasebeci köprüsü
- RICE skorlama ile 12 özellik önceliklendirildi
- Öne çıkan insight: vergi takvimi bildirimi v1.0'a çekilmeli

---

## Tüm Aksiyonlar (Birleştirilmiş)

### 🔴 Acil (Bu Hafta)
| # | Aksiyon | Sorumlu |
|---|---------|---------|
| A1 | Monorepo kurulumu başlat | Geliştirici |
| A2 | DB schema tasarımı (ER diagram) | Geliştirici |
| A3 | Firebase projesi oluştur | Geliştirici |
| A4 | MVP scope freeze — onaylandı | Product Owner |

### 🟡 Kısa Vadeli (2 Hafta İçinde)
| # | Aksiyon | Sorumlu |
|---|---------|---------|
| A5 | Wireframe hazırlığı (Figma) | Tasarımcı |
| A6 | API spec (OpenAPI) yaz | Geliştirici |
| A7 | Landing page tasarımı | Marketing |
| A8 | LinkedIn şirket sayfası optimize et | Marketing |
| A9 | İlk 3 blog yazısı draft | Marketing |
| A10 | KVKK teknik gereksinimler listesi | Geliştirici |

### 🟢 Orta Vadeli (1 Ay İçinde)
| # | Aksiyon | Sorumlu |
|---|---------|---------|
| A11 | 10 KOBİ sahibi ile kullanıcı görüşmesi | Analist |
| A12 | 5 SMMM ile ihtiyaç analizi | Analist |
| A13 | Rakip ürünleri deneyimle (trial) | Analist |
| A14 | Beta kullanıcı davet şablonu | Marketing |
| A15 | SMMM odaları ile iletişim planı | Marketing |
| A16 | CI/CD pipeline kurulumu | Geliştirici |

---

## Riskler & Azaltma

| Risk | Azaltma |
|------|---------|
| GİB API erişim gecikmeleri | MVP'de bağımsız çalış |
| KOBİ dijital okuryazarlık düşük | Basit UI, video rehber, onboarding |
| KVKK uyumluluk | Baştan şifreli mimari |
| Muhasebeci adaptasyonu | Muhasebeci-first tasarım |

---

## Sonraki Adımlar

1. Sprint 1 başlangıcı için geliştirme ortamı hazırlığı
2. Figma wireframe'ler → tasarım review toplantısı
3. Kullanıcı araştırması görüşmeleri planla
4. Haftalık sprint review toplantıları takvime ekle

---

*Bu rapor, FirmaCom projesinin başlangıç planlaması için referans belgesidir. Sprint sonlarında güncellenecektir.*
