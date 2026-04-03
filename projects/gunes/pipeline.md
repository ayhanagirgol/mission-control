# Proje Pipeline — Güneş 🌟

Son güncelleme: 2026-03-31

---

## 🏢 Ürünler

| Ürün | Açıklama | Model | Durum |
|------|----------|-------|-------|
| **Finhouse.ai** | AI danışmanlık & içerik platformu | B2B — danışmanlık, skill satışı, hosting | 🟡 Aktif geliştirme |
| **FirmaCom** | KOBİ belge yönetimi mobil uygulaması | B2C/B2SMB — lead gen, reklam, premium abonelik | 🟡 Devam ediyor |
| **FirmaCom Web** | FirmaCom tanıtım & pazarlama sitesi (firmacom-web.netlify.app) | Statik site, Netlify CI/CD | 🟡 Aktif |
| **Türkkep AI** | KEP + e-belge AI ürünleri (Orbina, Callie vb.) | Türkkep iç ürün | 🟡 Aktif |
| **Co-one** | Ağ altyapısı ürünleri | Ürün satışı | 🔵 Radar |

---

## 🔴 Kritik / Acil

### 1. Beyttürk — TCMB E-Para Lisans (2. Aşama)
- **Ne:** E-para lisans danışmanlığı — ikinci aşama sürecinde
- **Kimler:** Muhammed Bey, Celal Bey, Gülden Hanım (alıcılar) | Ramazan Küçük (birlikte çalışılan)
- **Aksiyon:** Haftalık rapor hazırlanıyor (TCMB yönetmelik, sektör haberleri, LinkedIn)
- **Durum:** 🔴 Devam ediyor

### 2. Türkkep — CTO / GM Vekilliği Operasyonları
- **Ne:** CTO + GM vekilliği; mail otomasyonları aktif
- **Sistemler:** qradar sınıflandırma, Platin etiketleme, sabah brifingi (08:00)
- **Aksiyon:** Süregelen operasyon takibi
- **Durum:** 🔴 Aktif

---

## 🟡 Devam Eden

### 3. Finhouse.ai — Web Sitesi & Sosyal Medya Akışı
- **Ne:** finhouse.ai "Finans AI Çözüm Merkezi" olarak yeniden konumlandırıldı
- **Repo:** github.com/ayhanagirgol/finhouse-ai-site → Netlify CI/CD aktif
- **Bekleyen:** Sosyal medya otomasyonu (sabah raporu → LinkedIn + X post) henüz kurulmadı
- **Durum:** 🟡 Kısmen tamamlandı, aksiyon bekliyor

### 4. Gelir Modeli — Finhouse AI Danışmanlık Paketi
- **Ne:** 5 gelir modeli masada; öncelik: AI Agent danışmanlık ($5K–20K/ay)
- **Pipeline:**
  1. AI Agent Kurulum & Danışmanlık — kısa vade, hemen başlanabilir
  2. ClawHub Skill Satışı (KEP, e-belge, BDDK) — pasif gelir
  3. Finhouse.ai AI Çözüm Merkezi — orta vade
  4. Managed AI Agent Hosting (KVKK uyumlu) — orta vade
  5. Mikro-SaaS: Finans AI Asistan Platformu — uzun vade
- **Referans:** [Mission Control video](https://youtu.be/GzNM_bp1WaE) — $5K-10K/kurulum potansiyeli
- **Durum:** 🟡 Strateji tamamlandı, execution başlamadı

### 5. Meeting-to-Prototype Pipeline
- **Ne:** Müşteri toplantısı → Granola → Lovable → 15 dk'da prototip
- **Araçlar:** Granola (transkript), Lovable/Bolt.new (builder), OpenClaw (orkestrasyon)
- **Kaynak:** [@PrajwalTomar_ tweet](https://x.com/PrajwalTomar_/status/2037869118230262117)
- **Durum:** 🟡 Konsept netleşti, danışmanlık paketine eklenecek

### 6. TEFAS Fon Takibi
- **Ne:** TLY (Tera Portföy) + DFI (Deniz Portföy) — hafta içi 10:00 WhatsApp bildirimi
- **Script:** scripts/tefas_tracker.mjs
- **Radar:** PHE, TTE, PBR yeni öneri adayları
- **Durum:** 🟡 Aktif otomasyon

---

## 🟢 Planlanmış

### 7. OpenClaw Mission Control Dashboard
- **Ne:** Tüm agent'ları, görevleri ve projeleri tek yerden yönetecek web dashboard
- **Modüller:** Agent Paneli, Skill Kataloğu, Proje/Görev Yönetimi, Zaman Planı
- **Deployment:** Netlify (finhouse.ai CI/CD modeliyle)
- **ClawHub:** Ürün olarak satışa sunulabilir
- **Bekleyen:** Teknik kararlar (React/statik HTML, backend), 132 rol dosyası
- **Durum:** 🟢 Planlama aşamasında

### 8. Workspace Yedekleme (Keenetic WebDAV)
- **Ne:** OpenClaw workspace + log'ların network diske otomatik yedeklenmesi
- **Disk:** finhouse.keenetic.link WebDAV (~5.46TB WD Elements)
- **Bekleyen:** Cron kurulumu
- **Durum:** 🟢 Planlanmış

### 9. Finhouse.ai — Blog & İçerik Akışı
- **Ne:** Günlük fintech/AI haberleri → Blog yazısı → Sosyal medya paylaşımı
- **Altyapı:** GitHub → Netlify CI/CD mevcut; xurl (X), LinkedIn skill hazır
- **Bekleyen:** Otomatik yayın sistemi kurulumu
- **Durum:** 🟢 Planlanmış

---

## ✅ Tamamlanan (Son 30 gün)

| Proje | Tarih | Not |
|-------|-------|-----|
| Türkkep M365 Otomasyonu | 2026-03-19 | qradar, Platin, sabah brifingi aktif |
| Takvim Senkronizasyonu | 2026-03-19 | Türkkep + Gmail → Finhouse |
| MS Graph Finhouse Erişimi | 2026-03-21 | Mail + Takvim + To Do |
| Microsoft To Do Entegrasyonu | 2026-03-21 | Delegated auth, refresh token |
| Finhouse.ai Yeniden Konumlandırma | 2026-03-23 | Partner isimleri kaldırıldı, CI/CD kuruldu |
| Muhasebe Fatura Yönlendirmesi | 2026-03-22 | Anthropic + X faturaları iletildi |
| Keenetic WebDAV Erişimi | 2026-03-21 | Auth çözüldü, disk erişilebilir |

---

*Bu dosyayı Güneş agent'ı yönetir. Son güncelleme: 2026-03-31 04:12*
