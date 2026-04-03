# Şarj Tipleri ve Konnektörler

> Son güncelleme: Mart 2026

---

## Şarj Seviyeleri Genel Bakış

| Seviye | Akım | Güç | Süre (Tam Dolu) | Kullanım |
|--------|------|-----|-----------------|---------|
| AC Yavaş | AC 1-fazlı | 2,3 - 7,4 kW | 12-24 saat | Ev, otopark |
| AC Orta | AC 3-fazlı | 11 - 22 kW | 4-10 saat | Ev (3-fazlı), AVM |
| DC Hızlı | DC | 50 - 150 kW | 30-60 dk | Şarj istasyonu |
| DC Ultra Hızlı (HPC) | DC | 150 - 350 kW | 15-25 dk | Otoyol, HPC istasyon |

---

## AC Şarj (Alternating Current)

### Tip 2 Konnektör (Mennekes)
**Türkiye ve Avrupa standardı**

```
   ___
  /   \
 | ●●● |   7 pin
 |  ●  |
  \___/
```

| Özellik | Değer |
|---------|-------|
| Standart | IEC 62196-2 |
| Pin Sayısı | 7 |
| Güç | 3,7 kW – 43 kW |
| Faz | 1-fazlı (3,7-7,4 kW) veya 3-fazlı (11-22 kW) |
| Yaygınlık Türkiye | Çok yaygın — tüm operatörler |

**Nerede kullanılır:**
- Ev şarj ünitesi
- AVM, ofis, otel şarj noktaları
- ZES, Eşarj, Sharz, Trugo AC soketleri
- Şarj süresi: 7 kW'de ~10 saat (60 kWh araç için)

**Araç tarafı:** Standart Tip 2 fiş, tüm Avrupa EV'lerinde aynı

---

### Schuko (Type F) — Eski/Acil
| Özellik | Değer |
|---------|-------|
| Güç | 2,3 kW (max 10A) |
| Kullanım | Yalnızca acil durum — taşınabilir kablo ile |
| Öneri | Düzenli şarj için kullanılmaz |

---

## DC Şarj (Direct Current)

### CCS2 (Combined Charging System 2)
**Avrupa ve Türkiye DC standardı**

```
   ___
  /   \
 | ●●● |   Tip 2 üst kısım (AC)
 |  ●  |   + aşağıda 2 büyük DC pin
 |● ● |
  \___/
```

| Özellik | Değer |
|---------|-------|
| Standart | IEC 62196-3 Combo 2 |
| Güç | 50 kW – 350 kW |
| Yaygınlık Türkiye | Standart — tüm yeni DC noktaları |
| Uyumlu Araçlar | Neredeyse tüm Avrupa/Kore/TOGG EV'leri |

**Operatör desteği:** ZES, Eşarj, Sharz.net, Trugo, Voltrun, Shell Recharge, Tesla (V4)

**Şarj süreleri:**
- 50 kW: 10-80% ~45-60 dk
- 100 kW: 10-80% ~25-35 dk
- 150 kW: 10-80% ~18-25 dk
- 250+ kW: 10-80% ~15-20 dk

---

### CHAdeMO
**Japon standardı — azalan**

| Özellik | Değer |
|---------|-------|
| Standart | CHAdeMO |
| Güç | 50 kW – 150 kW |
| Türkiye | Giderek azalıyor |
| Uyumlu Araçlar | Eski Nissan Leaf, bazı Mitsubishi |

**Durum:** 2025 itibarıyla Türkiye'de CHAdeMO soketleri azalıyor, yerini CCS2 alıyor. Yeni satılan araçların büyük çoğunluğu CCS2.

---

### Tesla Konnektör (NACS)
| Özellik | Değer |
|---------|-------|
| Standart | Tesla/NACS (SAE J3400 — ABD) |
| Türkiye | CCS2 adaptör ile Supercharger |
| Güç | 250 kW (V3), 350 kW (V4) |
| Uyumlu | Tesla araçlar + CCS2 adaptör ile diğerleri |

**Türkiye'de Tesla:** V3 ve V4 Supercharger istasyonları CCS2 ile de uyumlu (adaptör dahil).

---

## Şarj Hızı Karşılaştırması

### Aynı Araç (60 kWh batarya) İçin

| Şarj Tipi | Güç | 10→80% Süresi | Eklenen km/saat |
|-----------|-----|---------------|-----------------|
| Ev (Schuko acil) | 2,3 kW | ~25 saat | ~15 km/saat |
| Ev (7 kW Tip 2) | 7 kW | ~7 saat | ~45 km/saat |
| Ev/AVM (22 kW) | 22 kW | ~2,5 saat | ~130 km/saat |
| DC 50 kW | 50 kW | ~50 dk | ~330 km/saat |
| DC 100 kW | 100 kW | ~25 dk | ~600 km/saat |
| DC 150 kW | 150 kW | ~17 dk | ~850 km/saat |
| HPC 250 kW | 250 kW | ~12 dk | ~1.400 km/saat |

> Not: Araç kendi max DC hızıyla sınırlıdır. 100 kW araç, 250 kW istasyona bağlansa bile 100 kW'de şarj olur.

---

## Konnektör Uyumluluk Tablosu

| Araç Markası | AC | DC |
|-------------|----|----|
| TOGG | Tip 2 | CCS2 |
| Tesla (Türkiye) | Tip 2 | CCS2 |
| BYD | Tip 2 | CCS2 |
| Hyundai/Kia | Tip 2 | CCS2 |
| VW/Audi/Porsche | Tip 2 | CCS2 |
| BMW/Mini | Tip 2 | CCS2 |
| Mercedes | Tip 2 | CCS2 |
| Renault/Dacia | Tip 2 | CCS2 |
| Volvo/Polestar | Tip 2 | CCS2 |
| Fiat/Peugeot | Tip 2 | CCS2 |
| MG | Tip 2 | CCS2 |
| Nissan Leaf (eski) | Tip 2 | CHAdeMO |
| Nissan Leaf (2023+) | Tip 2 | CCS2 |

**Türkiye'de neredeyse tüm yeni EV'ler CCS2 DC kullanmaktadır.**

---

## Türkiye'de Şarj Altyapısı Standardı

### EPDK Düzenlemesi
- Tüm kamuya açık DC şarj noktaları CCS2 zorunlu
- AC: Tip 2 standart
- Operatörler EPDK lisansı almak zorunda
- Tüketim bazlı fiyatlandırma zorunlu (dakika bazlı yasaklandı)
- Kaynak: https://www.epdk.gov.tr

### Roaming (Ağlar Arası Geçiş)
- ZES ↔ PlugSurf ↔ Shell Recharge
- Trugo ↔ Trumore uygulaması
- Eşarj roaming ortaklıkları

---

## Adaptörler

| Adaptör | Kullanım |
|---------|---------|
| CCS2 → CHAdeMO | Neredeyse yok, gerekli değil |
| Tesla CCS2 Adaptör | Tesla araç → Türkiye CCS2 ağları (dahil geliyor) |
| Tip 1 → Tip 2 | Eski Japon/ABD araçlar (Türkiye'de nadir) |
| Schuko acil kablo | Her EV ile gelir, sadece acil durumda |

---

## Şarj İçin Pratik İpuçları

1. **%80'de dur:** DC hızlı şarjda %80 sonrası şarj hızı düşer, %80-100 yavaş gelir
2. **Şarj öncesi ısıt:** Kışın uzun yolda gitmeden önce araç pili ısıtılmış olmalı (pek çok araç navigasyonda otomatik yapar)
3. **Precondition:** Tesla ve Ioniq 5/6 Supercharger'a giderken pili otomatik ısıtır
4. **AC gece, DC yolculukta:** Günlük şarjı evde AC ile, yolculukta DC ile yap
5. **Rezervasyon yap:** ZES ve Eşarj rezervasyon ile şarj noktası garantile

---

💼 **Elektrikli araç filo yönetimi danışmanlığı: [finhouse.ai](https://finhouse.ai)**
