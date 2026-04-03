# Ev Şarj Ünitesi Kurulum Rehberi

> Son güncelleme: Mart 2026 | Fiyatlar yaklaşıktır, bölge ve elektrikçi firmaya göre değişir.

---

## Ev Şarjı Neden Önemli?

Araştırmalar EV kullanıcılarının %80-90'ının şarjını evde yaptığını gösteriyor. Ev şarjı:
- En ucuz enerji maliyeti (özellikle gece tarifesi)
- Sabah her zaman tam dolu çıkış
- Şarj istasyonu kuyruğu yok
- EPDK gündüz tarifesinin yarısı gece tarifesiyle

---

## Türkiye'de Ev Şarj Seçenekleri

### Seçenek 1: Schuko Priz (Acil/Geçici)
| Özellik | Değer |
|---------|-------|
| Güç | 2,3 kW (10A) |
| Kurulum maliyeti | 0 TL (mevcut priz) |
| Şarj süresi | 20-30 saat (tam dolu) |
| Günlük eklenen km | ~50 km |
| Öneri | Sadece acil, geçici veya düşük km için |

**⚠️ Uyarı:** Standart Schuko priz elektrikli araç için tasarlanmamıştır. Uzun süreli kullanımda aşırı ısınma riski. Araçla gelen "mode 2" kabloyu kullanın.

---

### Seçenek 2: Güçlendirilmiş Priz (3,7-7,4 kW)
| Özellik | Değer |
|---------|-------|
| Güç | 3,7-7,4 kW |
| Kurulum maliyeti | ~₺5.000-10.000 |
| Şarj süresi | 8-12 saat (tam dolu) |
| Günlük eklenen km | ~80-100 km |
| Durum kutusu | Güçlendirilmiş priz + devre kesici |

---

### Seçenek 3: Wallbox / EVSE (7-22 kW) — ÖNERİLEN
| Özellik | Değer |
|---------|-------|
| Güç | 7 kW (1-fazlı) veya 11-22 kW (3-fazlı) |
| Cihaz maliyeti | ₺15.000-40.000 |
| Kurulum işçilik | ₺5.000-15.000 |
| Toplam maliyet | ₺20.000-55.000 |
| Şarj süresi | 3-8 saat (tam dolu) |
| Garanti | Genellikle 2-3 yıl |

**Türkiye'deki Popüler Wallbox Markaları:**
- Voltrun (Türk ürünü)
- ZES Home Charger
- Eşarj Home
- Vestel EVC (Türk ürünü — fabrika ev şarj çözümü)
- Wallbox (İspanya)
- ABB Terra AC
- Schneider Electric EVlink

---

## Kurulum Gereksinimleri

### Elektrik Altyapısı
| Güç | Faz | Sigorta | Kablo |
|-----|-----|---------|-------|
| 7,4 kW | 1-fazlı | 32A | 6mm² min |
| 11 kW | 3-fazlı | 3×16A | 4mm² min |
| 22 kW | 3-fazlı | 3×32A | 6mm² min |

**Gerekli kontroller:**
- Ana sigorta yeterliliği (genellikle 32-40A ev sayacı)
- Kablo uzunluğu ve kesiti
- Topraklama sistemi
- RCD (kaçak akım rölesi) — zorunlu
- EVSE'nin EPDK uygunluğu

### İzin ve Bürokratik Süreç (Müstakil Ev)
1. Elektrik dağıtım şirketine başvuru (varsa ek güç için)
2. Elektrikçi montajı
3. Sayaç güncelleme (gerekirse)
4. Gece tarifesi başvurusu (çok zamanlı sayaç)

---

## Apartman / Site Şarj Hakkı

### Yasal Dayanak
**7376 sayılı Kanun** (2022) ve **Elektrik Piyasası Kanunu** kapsamında:
- Kat malikleri, ortak alanda EV şarj ünitesi talep edebilir
- Yönetim, makul gerekçe olmaksızın reddedemez
- Kablo, ilgili kat malikinin kendi hattından çekilebilir

### Apartmanda Kurulum Süreci
1. **Yöneticiye yazılı başvuru** — şarj ünitesi kurulumu talep
2. **Kat malikleri kurulu** kararı (olağan toplantı veya yazılı onay)
3. **Elektrik planı** — yerden veya ortak sayaçtan ayrı hat
4. **Kurulum ve sayaç** — bireysel tüketim ölçümü
5. **Ortak gider dahil edilmez** — bireysel ödeme

### Pratik Sorunlar
- Otopark alanı kısıtı (kablo ulaşımı)
- Sigorta kapasitesi yetersizliği
- Yönetim direnişi (hukuki yol açık)
- Çözüm: Voltrun, Beefull gibi şirketler "site çözümü" sunmaktadır

### Site/Rezidans Toplu Çözümler
- Voltrun: Konut sitesi paket kurulumu
- Trugo: Rezidans çözümü
- Beefull: Paylaşımlı şarj sistemi
- Maliyet site yönetimi veya kullanıcılar arasında paylaşılır

---

## Gece Tarifesi (Çok Zamanlı Tarife)

### Başvuru Nasıl Yapılır?
1. Elektrik dağıtım şirketinizi arayın (BEDAŞ, BAŞKENTEDAŞ, GEDAŞ vb.)
2. "Çok zamanlı tarife" veya "TRT (Tek Ring Tarife) değişikliği" isteyin
3. Akıllı/çift tarife sayacı takılır
4. Yaklaşık 1-4 hafta süre

### Gece Saatleri (EPDK düzenlemesi)
- **Gece (Boş Saat):** 22:00 – 06:00
- **Gündüz (Puant):** 17:00 – 22:00
- **Normal:** 06:00 – 17:00

### Fiyat Farkı (2025-2026)
| Tarife | TL/kWh |
|--------|--------|
| Gündüz normal | ~₺4,50-5,50 |
| Gündüz puant | ~₺5,50-7,00 |
| Gece boş saat | ~₺2,00-3,00 |

**Aylık tasarruf örneği (günlük 50 km, 18 kWh/100km):**
- Tüketim: 50 km × 18 kWh/100km = 9 kWh/gün × 30 = 270 kWh/ay
- Gündüz: 270 × ₺5 = ₺1.350/ay
- Gece: 270 × ₺2,50 = ₺675/ay
- **Tasarruf: ₺675/ay (%50)**

---

## Kurulum Maliyeti Özeti (2025-2026)

| Senaryo | Cihaz | Kurulum | Toplam |
|---------|-------|---------|--------|
| Müstakil ev, 7 kW | ₺15.000-20.000 | ₺5.000-8.000 | ₺20.000-28.000 |
| Müstakil ev, 22 kW | ₺25.000-40.000 | ₺8.000-15.000 | ₺33.000-55.000 |
| Apartman, 7 kW (hat çekme dahil) | ₺15.000-20.000 | ₺8.000-15.000 | ₺23.000-35.000 |
| Yazlık/garaj, 7 kW | ₺15.000-20.000 | ₺5.000-10.000 | ₺20.000-30.000 |

**Geri dönüş süresi:** Günlük 50 km kullanan biri için ev şarjı vs DC hızlı şarj:
- Aylık DC fark: ~₺1.000-1.500 (₺14 vs ₺5 kWh)
- ₺30.000 kurulum → ~20-30 ay geri dönüş

---

## Önerilen Kurulum Firmaları

- **Voltrun**: https://voltrun.com — ev/site kurulumunda uzman
- **Vestel EVC**: Türk markalı wallbox + kurulum
- **ZES Home**: ZES ağı ile entegre ev çözümü
- **Eşarj Home**: Eşarj uygulaması ile entegre
- Yetkili elektrik firmaları (EPDK lisanslı)

---

💼 **Elektrikli araç filo yönetimi danışmanlığı: [finhouse.ai](https://finhouse.ai)**
