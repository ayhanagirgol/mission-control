# EV Maliyet Analizi ve Karşılaştırma

> Son güncelleme: Mart 2026 | Fiyatlar yaklaşık olup değişkendir.
> Benzin/motorin fiyatları Mart 2026 Türkiye ortalaması baz alınmıştır.

---

## Temel Yakıt Fiyatları (Mart 2026 Tahmini)

| Yakıt | Birim Fiyat |
|-------|------------|
| Benzin 95 | ~₺57/litre |
| Benzin 98 | ~₺60/litre |
| Motorin | ~₺53/litre |
| LPG (otogaz) | ~₺18/litre |
| Elektrik (ev gündüz) | ~₺5,00/kWh |
| Elektrik (ev gece) | ~₺2,50/kWh |
| Elektrik DC (ZES üye) | ~₺14,49/kWh |
| Elektrik DC (Eşarj üye) | ~₺15,00/kWh |
| Elektrik DC (Sharz üye) | ~₺14,00/kWh |

---

## 100 km Maliyet Karşılaştırması

### Araç Profilleri

| Araç Tipi | Tüketim | 100 km Hesabı |
|-----------|---------|---------------|
| EV ortalama | 18 kWh/100km | Değişken şarj tipine göre |
| Benzinli kompakt | 7 L/100km | 7 × ₺57 |
| Benzinli SUV | 9 L/100km | 9 × ₺57 |
| Dizel kompakt | 5,5 L/100km | 5,5 × ₺53 |
| Dizel SUV | 7 L/100km | 7 × ₺53 |
| LPG kompakt | 10 L/100km | 10 × ₺18 |

### 100 km Maliyet Tablosu

| Yakıt/Şarj Türü | Birim | Tüketim | 100 km Maliyet |
|----------------|-------|---------|----------------|
| **EV - Ev gece** | ₺2,50/kWh | 18 kWh | **₺45** |
| **EV - Ev gündüz** | ₺5,00/kWh | 18 kWh | **₺90** |
| **EV - Voltrun DC** | ₺13,00/kWh | 18 kWh | ₺234 |
| **EV - Sharz DC** | ₺14,00/kWh | 18 kWh | ₺252 |
| **EV - ZES DC üye** | ₺14,49/kWh | 18 kWh | ₺261 |
| **EV - Eşarj DC** | ₺15,00/kWh | 18 kWh | ₺270 |
| **EV - ZES misafir** | ₺16,49/kWh | 18 kWh | ₺297 |
| **LPG kompakt** | ₺18/L | 10 L | ₺180 |
| **Dizel kompakt** | ₺53/L | 5,5 L | ₺292 |
| **Dizel SUV** | ₺53/L | 7 L | ₺371 |
| **Benzin kompakt** | ₺57/L | 7 L | ₺399 |
| **Benzin SUV** | ₺57/L | 9 L | ₺513 |

### Tasarruf Yüzdesi (EV ev gece vs ICE)

| Karşılaştırma | EV Ev Gece | ICE | Tasarruf |
|---------------|-----------|-----|---------|
| EV vs Benzin Kompakt | ₺45 | ₺399 | **%89** |
| EV vs Dizel Kompakt | ₺45 | ₺292 | **%85** |
| EV vs LPG Kompakt | ₺45 | ₺180 | **%75** |
| EV DC hızlı vs Benzin | ₺261 | ₺399 | **%35** |

---

## Aylık Şarj Maliyeti Senaryoları

### Senaryo 1: Günlük 50 km (Şehiriçi Kullanım)

**Araç:** Ortalama EV (18 kWh/100km)
**Aylık mesafe:** 1.500 km
**Aylık enerji ihtiyacı:** 270 kWh

| Şarj Tipi | kWh Fiyatı | Aylık Maliyet |
|-----------|-----------|---------------|
| Ev gece | ₺2,50 | **₺675** |
| Ev gündüz | ₺5,00 | ₺1.350 |
| %50 ev gece + %50 DC | karışık | ~₺1.700 |
| Tamamen DC (ZES üye) | ₺14,49 | ₺3.912 |
| Benzinli 7L/100km | ₺57/L | ₺5.985 |
| Dizel 5,5L/100km | ₺53/L | ₺4.373 |

**Sonuç (50 km/gün):** Ev gece şarjında aylık ₺675 vs benzinli ₺5.985 → **₺5.310 tasarruf**

---

### Senaryo 2: Günlük 100 km (Orta Mesafe)

**Aylık mesafe:** 3.000 km
**Aylık enerji ihtiyacı:** 540 kWh

| Şarj Tipi | kWh Fiyatı | Aylık Maliyet |
|-----------|-----------|---------------|
| Ev gece | ₺2,50 | **₺1.350** |
| Ev gündüz | ₺5,00 | ₺2.700 |
| %70 ev + %30 DC | karışık | ~₺2.500 |
| Tamamen DC (ZES üye) | ₺14,49 | ₺7.825 |
| Benzinli 7L/100km | ₺57/L | ₺11.970 |
| Dizel 5,5L/100km | ₺53/L | ₺8.745 |

**Sonuç (100 km/gün):** Ev gece şarjında aylık ₺1.350 vs benzinli ₺11.970 → **₺10.620 tasarruf**

---

### Senaryo 3: Günlük 150 km (Yoğun Kullanım / Satış)

**Aylık mesafe:** 4.500 km
**Aylık enerji ihtiyacı:** 810 kWh

| Şarj Tipi | kWh Fiyatı | Aylık Maliyet |
|-----------|-----------|---------------|
| Ev gece | ₺2,50 | **₺2.025** |
| Ev + DC karışık | karışık | ~₺4.000 |
| Tamamen DC (ZES üye) | ₺14,49 | ₺11.737 |
| Benzinli 7L/100km | ₺57/L | ₺17.955 |
| Dizel 5,5L/100km | ₺53/L | ₺13.118 |

---

### Senaryo 4: Uzun Yol (Haftalık 500 km+)

**Haftalık:** 500 km yolculuk
**Enerji:** 90 kWh (DC şarj gerekli)

| Şarj Planı | Maliyet |
|-----------|---------|
| Sadece DC ZES | ~₺1.304 |
| DC Sharz.net | ~₺1.260 |
| Hibrit (evde şarj başla, DC tamamla) | ~₺900 |
| Benzinli (7L/100km) | ~₺1.995 |

---

## Yıllık Toplam Sahip Olma Maliyeti (TCO)

### 50 km/gün Kullanıcı için 5 Yıllık Analiz

| Kalem | EV (ev şarjı) | Benzinli |
|-------|---------------|---------|
| Yakıt/Şarj (5 yıl) | ₺40.500 | ₺359.100 |
| Servis/Bakım | ~₺30.000 | ~₺80.000 |
| Sigorta (fark) | ~+₺10.000 | Baz |
| ÖTV avantajı | Değişken | — |
| **Toplam fark** | — | **~₺358.000 tasarruf** |

> Not: Araç satın alma maliyeti ve artık değer bu hesaba dahil değil.

---

## Filo Maliyet Analizi

### 10 Araçlık Filo (Günlük 100 km/araç)

| Senaryo | Aylık Maliyet | Yıllık Maliyet |
|---------|--------------|----------------|
| Benzinli filo | ₺119.700 | ₺1.436.400 |
| EV filo (ev/depot şarjı) | ₺13.500 | ₺162.000 |
| EV filo (karışık şarj) | ₺30.000 | ₺360.000 |
| **Yıllık tasarruf (depot şarj)** | — | **₺1.274.400** |

> 💼 **Kurumsal EV filo yönetimi için:** [finhouse.ai](https://finhouse.ai)

---

## Uzun Yol Şarj Planlaması

### İstanbul → Ankara (~450 km) Örneği

**Araç:** Hyundai Ioniq 6 LR (614 km menzil, 77 kWh batarya)

| Adım | Mesafe | Kalan % | Eylem |
|------|--------|---------|-------|
| İstanbul çıkış | 0 km | %95 | Evde şarjla başla |
| Bolu yakını | ~200 km | ~%58 | Değerlendirme: devam et |
| Ankara giriş | ~450 km | ~%27 | Ankara'da şarj |

**Sonuç:** Tek durakla gidilir (Bolu'da durmadan).

**Araç:** TOGG T10X Standard (314 km menzil, 52 kWh)

| Adım | Mesafe | Kalan % | Şarj Noktası |
|------|--------|---------|--------------|
| İstanbul çıkış | 0 km | %95 | — |
| Bolu/Gerede DC | ~200 km | ~%30 | ZES/Sharz 30 dk |
| Ankara varış | ~450 km | ~%55 | — |

---

## Hava Durumunun Menzile Etkisi

| Koşul | Menzil Değişimi | Pratik Önlem |
|-------|----------------|--------------|
| -10°C (soğuk) | %25-40 azalma | Araçta önceden ısınma, ek şarj dur |
| 0°C | %15-25 azalma | Temkinli planlama |
| +15-20°C | ±0 (ideal) | Normal planlama |
| +35°C (yaz klima) | %10-20 azalma | Serin saat seyahati |
| 130 km/h otoyol | %25-35 azalma | Düşük hız → uzun menzil |

---

## Elektrik Fiyatı Projeksiyon

| Yıl | EPDK Gündüz (tahmini) | Gece Tarifesi | Benzin (tahmini) |
|-----|----------------------|---------------|-----------------|
| 2025 | ₺4,50-5,50 | ₺2,00-3,00 | ₺52-58 |
| 2026 | ₺5,00-6,50 | ₺2,50-3,50 | ₺55-65 |
| 2027 | ₺6,00-8,00 | ₺3,00-4,50 | ₺60-75 |

> ⚠️ Projeksiyon: Enflasyon ve enerji piyasasına göre değişkendir.

---

💼 **Elektrikli araç filo yönetimi danışmanlığı: [finhouse.ai](https://finhouse.ai)**
