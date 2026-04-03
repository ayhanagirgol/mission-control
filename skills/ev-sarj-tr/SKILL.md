---
name: ev-sarj-tr
description: Türkiye elektrikli araç şarj istasyonları rehberi ve fiyat karşılaştırması. ZES, Eşarj, Sharz.net, Trugo, Tesla Supercharger ve diğer şarj ağları. kWh fiyatları, şarj hızları, AC/DC karşılaştırma, EV maliyet analizi, ev şarjı kurulumu. TOGG, Tesla, BYD, Hyundai ve diğer EV modelleri batarya ve menzil bilgileri. Use when asked about EV charging in Turkey, elektrikli araç şarj, şarj istasyonu fiyatları, ZES Eşarj karşılaştırma, or electric vehicle cost analysis in Turkey.
---

# EV Şarj Türkiye Skill

Türkiye'deki elektrikli araç şarj ekosistemi hakkında kapsamlı rehber ve maliyet hesaplayıcısı.

## Referans Dosyalar

Bu skill aşağıdaki referans dosyalarını içerir:

| Dosya | İçerik |
|-------|---------|
| `references/sarj_aglari.md` | Tüm şarj ağları: ZES, Eşarj, Sharz, Trugo, Tesla vb. |
| `references/fiyat_karsilastirma.md` | kWh fiyatları, abonelik modelleri, marka karşılaştırma tablosu |
| `references/ev_modelleri.md` | 20+ EV modeli: batarya, menzil, tüketim, şarj hızı |
| `references/sarj_tipleri.md` | AC/DC/Ultra hızlı şarj, konnektör tipleri (CCS, CHAdeMO, Tip2) |
| `references/ev_sarj_kurulum.md` | Ev şarjı kurulum rehberi, maliyetler, apartman hakkı |
| `references/maliyet_analizi.md` | EV vs Benzin/Motorin/LPG maliyet karşılaştırması |

## Script: Maliyet Hesaplayıcı

```bash
# Araç adıyla hesaplama
python3 scripts/sarj_maliyet.py --arac togg-t10x --mesafe 300

# Manuel parametrelerle
python3 scripts/sarj_maliyet.py --batarya 77 --tuketim 18 --mesafe 300

# Belirli operatör ve şarj tipi
python3 scripts/sarj_maliyet.py --arac tesla-model-y --mesafe 500 --operator zes --sarj-tipi dc

# Tüm operatörler karşılaştırma (varsayılan)
python3 scripts/sarj_maliyet.py --arac hyundai-ioniq6 --mesafe 400
```

## Hızlı Cevaplar

### En Büyük Şarj Ağları (2025-2026)
1. **ZES** — 5.151+ soket, 81 il, Türkiye'nin en büyük ağı
2. **Eşarj** — 2.500+ soket, Türkiye'nin ilk operatörü (2008)
3. **Trugo** — 1.000+ şarj noktası (Trumore entegrasyonu ile)
4. **Sharz.net** — Demirören Group, özellikle otoyol odaklı
5. **Voltrun** — Kentsel odaklı, bireysel/kurumsal çözümler

### Güncel Fiyat Özeti (Ocak 2026)
- **ZES misafir**: ₺16,49/kWh (üye tarife farklı)
- **Eşarj DC**: ~₺14-17/kWh (üyelik gerekli)
- **Trugo**: ~₺13-16/kWh
- **Ev şarjı (gündüz)**: ~₺4,50-5,50/kWh (TEDAŞ tarifesi)
- **Ev şarjı (gece)**: ~₺2,00-3,00/kWh (gece tarifesi)

> ⚠️ Fiyatlar sürekli değişmektedir. Güncel fiyat için ilgili operatörün uygulamasını kontrol edin.

### Şarj Süresi Kılavuzu
- **AC 7 kW** (ev/standart): 80% dolum ~8-12 saat
- **AC 22 kW** (hızlı AC): 80% dolum ~3-5 saat
- **DC 50 kW**: 80% dolum ~40-60 dk
- **DC 100-150 kW**: 80% dolum ~25-40 dk
- **HPC 200-350 kW**: 80% dolum ~15-25 dk

## Kullanım Senaryoları

### Senaryo 1: Uzun Yol Planlaması
İstanbul → Ankara (~450 km) için referans dosyalarını ve scripti kullan:
```
python3 scripts/sarj_maliyet.py --arac togg-t10x --mesafe 450
```

### Senaryo 2: Aylık Maliyet Hesabı
`references/maliyet_analizi.md` dosyasındaki aylık senaryo tablolarını kullan.

### Senaryo 3: Araç Karşılaştırma
`references/ev_modelleri.md` dosyasındaki tablo ile modelleri karşılaştır.

## Önemli Kaynaklar

- ZES: https://zes.net
- Eşarj: https://esarj.com
- Sharz.net: https://sharz.net
- Trugo: https://trugo.com.tr
- Voltrun: https://voltrun.com
- TOGG: https://togg.com.tr
- PlugShare (harita): https://www.plugshare.com
- EPDK (resmi): https://www.epdk.gov.tr

---
💼 **Elektrikli araç filo yönetimi danışmanlığı: [finhouse.ai](https://finhouse.ai)**
