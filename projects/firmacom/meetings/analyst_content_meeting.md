# Analist Görüşmesi — İçerik Belirleme

**Tarih:** 29 Mart 2026
**Ürün:** FirmaCom (Finhouse.ai)
**Konu:** Rakip Analizi, Kullanıcı İhtiyaçları & Özellik Önceliklendirme

---

## Rakip Analizi (Türkiye Fintech / KOBİ)

| Rakip | Odak | Güçlü Yanlar | Zayıf Yanlar | FirmaCom Fırsatı |
|-------|------|-------------|--------------|-------------------|
| **Parasut.com** | Online muhasebe | Geniş özellik seti, API | Karmaşık UI, KOBİ için ağır | Daha basit, mobil-first |
| **Bizim Hesap** | e-Fatura/e-Arşiv | GİB entegrasyonu | Sadece web, mobil zayıf | Mobil deneyim |
| **Logo İşbaşı** | KOBİ muhasebe | Marka bilinirliği | Eski UI, yavaş | Modern UX |
| **Kolaybi** | Ön muhasebe | Kolay kullanım | Sınırlı entegrasyon | Belge + talep combo |
| **Defter.app** | Dijital muhasebe | Modern tasarım | Yeni, küçük kullanıcı tabanı | Hız avantajı |

### FirmaCom'un Farklılaşma Noktaları
1. **Mobil-first:** Rakiplerin çoğu web-first, mobil zayıf
2. **Belge + hizmet talebi birleşimi:** Rakipler ya belge ya muhasebe, ikisini birleştiren yok
3. **KOBİ-muhasebeci köprüsü:** İki taraflı platform
4. **AI destekli belge işleme** (v1.1): Otomatik sınıflandırma, veri çıkarma

---

## Kullanıcı İhtiyaç Analizi

### KOBİ Sahibi İhtiyaçları (Öncelik sırasına göre)
1. 📄 **Belgelerime her yerden erişim** — #1 talep
2. 📨 **Muhasebecime kolay ulaşım** — WhatsApp yerine yapılandırılmış kanal
3. 📅 **Vergi takvimi hatırlatma** — Ceza riskini azalt
4. 📊 **Mali durumumu anlama** — Basit dashboard
5. 📸 **Belge dijitalleştirme** — Fotoğraf çek, sisteme at

### SMMM İhtiyaçları
1. 📥 Müşteri belgelerini toplu toplama
2. 📋 Talepleri organize takip etme
3. 💬 Müşteri ile güvenli iletişim
4. 📊 Müşteri portföy görünümü

---

## Özellik Önceliklendirme Matrisi (RICE)

| Özellik | Reach | Impact | Confidence | Effort | RICE Skor | Öncelik |
|---------|-------|--------|------------|--------|-----------|---------|
| Belge listeleme/görüntüleme | 10 | 3 | 9 | 2 | **135** | P0 |
| Hizmet talebi oluşturma | 10 | 3 | 8 | 3 | **80** | P0 |
| Auth (telefon/email) | 10 | 2 | 10 | 2 | **100** | P0 |
| Push bildirimler | 8 | 2 | 9 | 2 | **72** | P0 |
| Belge yükleme + OCR | 7 | 3 | 7 | 5 | **29** | P1 |
| Muhasebeci paneli (web) | 5 | 3 | 7 | 6 | **18** | P1 |
| Dashboard & raporlama | 6 | 2 | 6 | 4 | **18** | P1 |
| Vergi takvimi bildirimleri | 8 | 2 | 8 | 2 | **64** | P1 |
| e-İmza entegrasyonu | 3 | 2 | 5 | 6 | **5** | P2 |
| KEP entegrasyonu | 3 | 2 | 5 | 5 | **6** | P2 |
| GİB API entegrasyonu | 4 | 3 | 5 | 7 | **9** | P2 |
| AI belge sınıflandırma | 5 | 3 | 4 | 6 | **10** | P2 |

*RICE = (Reach × Impact × Confidence) / Effort*

---

## Öneriler

1. **MVP'de sadeleşme doğru:** Belge görüntüleme + hizmet talebi yeterli değer önerisi
2. **Vergi takvimi bildirimi** v1.0'a çekilmeli — düşük effort, yüksek perceived value
3. **Muhasebeci tarafı kritik:** v1.0'da muhasebeci paneli olmadan platform etkisi sınırlı
4. **Parasut ile doğrudan rekabet etme** — belge yönetimi + talep nişine odaklan
5. **SMMM odaları ile erken ilişki** kur — dağıtım kanalı olarak muhasebeciler

---

## Aksiyonlar

1. 📋 Kullanıcı araştırması: 10 KOBİ sahibi ile görüşme planla
2. 📋 5 SMMM ile ihtiyaç analizi görüşmesi
3. 📋 Rakip ürünleri detaylı deneyimle (trial hesaplar)
4. 📋 RICE skorlarını kullanıcı görüşmeleri sonrası güncelle
