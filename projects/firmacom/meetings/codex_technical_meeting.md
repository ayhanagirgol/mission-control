# Codex / Teknik Toplantı Notları

**Tarih:** 29 Mart 2026
**Ürün:** FirmaCom (Finhouse.ai)
**Konu:** Teknik Mimari, Sprint Backlog & Teknik Borç

---

## Teknik Mimari

### Önerilen Stack
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Mobile App      │────▶│  API Gateway │────▶│  Backend    │
│  React Native    │     │  (nginx/CF)  │     │  NestJS     │
└─────────────────┘     └──────────────┘     └──────┬──────┘
                                                     │
                              ┌───────────┬──────────┼──────────┐
                              │           │          │          │
                         ┌────▼───┐  ┌───▼────┐ ┌──▼───┐ ┌───▼────┐
                         │PostgreSQL│ │ Redis  │ │  S3  │ │Firebase│
                         │  (Ana DB)│ │(Cache) │ │(Dosya)││ (Auth) │
                         └─────────┘ └────────┘ └──────┘ └────────┘
```

### Mimari Kararlar
- **Monorepo** (Turborepo): mobil + backend + shared types
- **API:** REST (OpenAPI spec) — GraphQL v1.1'de değerlendirilebilir
- **Auth:** Firebase Auth (telefon OTP + email) → JWT token
- **Dosya depolama:** S3-uyumlu, presigned URL ile doğrudan yükleme
- **Push:** Firebase Cloud Messaging (FCM)
- **Veritabanı:** PostgreSQL (Supabase veya self-hosted)

---

## Sprint Backlog (MVP — Sprint 1-3)

### Sprint 1: Altyapı & Auth
- [ ] Monorepo kurulumu (Turborepo + pnpm)
- [ ] React Native proje scaffold (Expo veya bare)
- [ ] NestJS backend scaffold
- [ ] PostgreSQL schema tasarımı (users, companies, documents, service_requests)
- [ ] Firebase Auth entegrasyonu (telefon + email)
- [ ] JWT middleware
- [ ] CI/CD pipeline (GitHub Actions → test → build)
- [ ] Onboarding UI (3 ekran)

### Sprint 2: Belge Yönetimi
- [ ] Document API (CRUD + list + search)
- [ ] Belge listeleme ekranı (infinite scroll, filtre)
- [ ] Belge detay ekranı (PDF viewer)
- [ ] Arama (full-text search — pg_trgm veya Meilisearch)
- [ ] Belge paylaşma (share sheet)

### Sprint 3: Hizmet Talepleri & Polish
- [ ] Service Request API (create, list, update status)
- [ ] Talep oluşturma ekranı (kategori seçimi, açıklama, ek dosya)
- [ ] Talep listesi & detay ekranı
- [ ] Push notification altyapısı (FCM)
- [ ] Hata ayıklama, performans testi
- [ ] Beta build (TestFlight + Internal Testing)

---

## Teknik Borç Listesi

| # | Borç | Aciliyet | Not |
|---|------|----------|-----|
| TB-1 | Test coverage eksik (hedef: %60 MVP, %80 v1.0) | Orta | Sprint 3'te test sprint'i |
| TB-2 | Error handling standardizasyonu | Düşük | Global exception filter |
| TB-3 | API rate limiting | Orta | v1.0'da zorunlu |
| TB-4 | Loglama & monitoring (Sentry + analitik) | Orta | MVP'de Sentry minimum |
| TB-5 | KVKK uyumlu veri şifreleme (at-rest + in-transit) | Yüksek | Sprint 1'de başla |
| TB-6 | Database migration stratejisi | Düşük | TypeORM migrations |
| TB-7 | API versiyonlama | Düşük | v1.0'da /v1 prefix |

---

## Geliştirme Ortamı & CI/CD

### Ortamlar
- **Local:** Docker Compose (PostgreSQL, Redis, MinIO)
- **Staging:** Vercel (backend) + Expo Dev Build (mobil)
- **Production:** AWS/Hetzner (v1.0'da karar verilecek)

### CI/CD Pipeline
```
Push → Lint → Test → Build → Deploy (staging)
Tag → Build → Deploy (production)
```
- GitHub Actions
- Fastlane (iOS/Android build & deploy)
- Expo EAS Build (alternatif)

---

## Aksiyonlar

1. 📋 Monorepo kurulumu başlatılacak
2. 📋 DB schema tasarımı — ER diagram çizilecek
3. 📋 API spec (OpenAPI) yazılacak
4. 📋 Firebase projesi oluşturulacak
5. 📋 Figma → React Native component mapping yapılacak
6. 📋 KVKK teknik gereksinimler listesi çıkarılacak
