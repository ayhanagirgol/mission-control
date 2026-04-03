---
name: yolculuk-maliyet-tr
description: Türkiye köprü, otoyol ve tünel geçiş ücretleri rehberi ve yolculuk maliyet hesaplayıcı. HGS/OGS ücretleri, köprü geçiş fiyatları (Osmangazi, 1915 Çanakkale, Yavuz Sultan Selim, Avrasya Tüneli), otoyol gişe ücretleri, araç sınıfları. Yolculuk planı yaparken toplam maliyet hesaplama. Use when asked about Turkish toll roads, bridge fees, HGS/OGS charges, highway costs, Osmangazi köprüsü ücreti, otoyol ücreti hesaplama, or trip cost calculation in Turkey.
version: 1.0.0
updated: 2026-01
---

# Yolculuk Maliyet Hesaplayıcı — Türkiye

Bu skill, Türkiye'deki köprü, otoyol ve tünel geçiş ücretlerini ve yolculuk maliyetlerini hesaplamak için kapsamlı bir rehber ve araç seti sunar.

---

## 📚 Referans Dosyalar

| Dosya | İçerik |
|-------|--------|
| `references/kopru_ucretleri.md` | Tüm köprü ücretleri (2026 güncel) |
| `references/otoyol_ucretleri.md` | Otoyol gişe bazlı ücretler (2026 güncel) |
| `references/tunel_ucretleri.md` | Tünel geçiş ücretleri |
| `references/hgs_ogs_rehberi.md` | HGS/OGS sistemi rehberi |
| `references/arac_sinifi_tanimlari.md` | 1-6. sınıf araç tanımları |

---

## 🛠️ Script

```bash
# Temel kullanım
python scripts/yolculuk_hesapla.py --guzergah istanbul ankara

# Araç ve yakıt belirt
python scripts/yolculuk_hesapla.py --guzergah istanbul izmir --arac-sinifi 2 --yakit-turu motorin

# İnteraktif mod
python scripts/yolculuk_hesapla.py --interaktif

# Mevcut güzergahları listele
python scripts/yolculuk_hesapla.py --liste
```

---

## 🌉 Köprü Ücretleri 2026 — Hızlı Özet

### İstanbul Boğaz Köprüleri

| Köprü | Otomobil | Hafif Ticari | YSS Zorunlu mu? |
|-------|----------|-------------|----------------|
| 15 Temmuz Şehitler (1.) | 59 TL | 75 TL | 3-4-5. sınıf evet |
| Fatih Sultan Mehmet (2.) | 59 TL | 75 TL | 3-4-5. sınıf evet |
| Yavuz Sultan Selim (3.) | 95 TL | 125 TL | Tüm sınıflar geçer |

### Diğer Büyük Köprüler

| Köprü | Otomobil | Minibüs | Kamyon/3. sınıf |
|-------|----------|---------|----------------|
| Osmangazi Köprüsü | 995 TL | 1.590 TL | 1.890 TL |
| 1915 Çanakkale Köprüsü | 995 TL | 1.245 TL | 2.240 TL |

---

## 🛣️ Otoyol Ücretleri 2026 — Hızlı Özet (Otomobil)

| Güzergah | Ücret |
|----------|-------|
| İstanbul → Ankara (O-4) | 338 TL |
| İstanbul → İzmir (O-5, Osmangazi dahil) | 2.465 TL |
| İstanbul → Edirne (O-3) | 168 TL |
| Ankara → Niğde | 740 TL |
| Kuzey Marmara (Kınalı → Fatih) | 220 TL |
| Menemen → Çandarlı | 205 TL |

---

## 🚇 Tünel Ücretleri 2026

| Tünel | Otomobil (gündüz) | Not |
|-------|------------------|-----|
| Avrasya Tüneli | 280 TL | HGS/OGS zorunlu, nakit yok |
| Ilgaz Tüneli | Ücretsiz | KGM devlet yolu |
| Zigana Tüneli | Ücretsiz | KGM devlet yolu |
| Ovit Tüneli | Ücretsiz | KGM devlet yolu |

---

## 💡 Temel Kurallar

1. **İhlal cezası:** Geçiş ücreti ödenmezse 15 gün içinde öde (4 kat ceza uygulanır).
2. **Avrasya Tüneli:** Nakit kabul edilmez, HGS/OGS zorunlu.
3. **YSS zorunluluğu:** 3-4-5. sınıf araçlar İstanbul'da Yavuz Sultan Selim Köprüsü'nü kullanmak zorunda.
4. **Yıllık zam:** Her yıl Ocak ayında Hazine yeniden değerleme oranıyla fiyatlar güncellenir.
5. **Ücretler tek yön:** Tüm ücretler tek yön içindir; dönüş için tekrar ödenir.

---

## 🚗 Araç Sınıfı Özeti

| Sınıf | Tanım | Örnek |
|-------|-------|-------|
| 1 | 2 akslı, aks aralığı <3,20 m | Otomobil, küçük SUV |
| 2 | 2 akslı, aks aralığı ≥3,20 m | Minibüs, Sprinter/Transit |
| 3 | 3 akslı | Büyük otobüs, orta kamyon |
| 4 | 4-5 akslı | TIR çekici, büyük kamyon |
| 5 | 6+ akslı | Büyük TIR, özel taşıt |
| 6 | Motosiklet | Motosiklet, scooter |

---

## 🔄 Sık Sorulan Sorular

**S: Osmangazi Köprüsü'nden nakit geçiş olur mu?**  
C: Evet, nakit gişe mevcuttur. HGS/OGS de kabul edilir.

**S: 1915 Çanakkale Köprüsü nereden geçiyor?**  
C: Çanakkale Boğazı (Dardanelles) üzerinden, Lapseki ile Gelibolu güneyi arasında.

**S: Avrasya Tüneli'nden kamyon geçebilir mi?**  
C: Hayır, sadece 1. ve 2. sınıf araçlar (otomobil ve minibüs) geçebilir.

**S: HGS bakiyem yoksa ne olur?**  
C: İhlalli geçiş sayılır. 15 gün içinde öde (sadece normal ücret), aksi halde 4 kat ceza.

---

## 📊 Kaynaklar

- [KGM Resmi Site](https://www.kgm.gov.tr)
- [HGS Resmi Site](https://hgs.gov.tr)
- [İhlal Sorgulama](https://webihlaltakip.kgm.gov.tr)
- [Osmangazi Ücret Hesaplama](https://isletme.otoyolas.com.tr)
- [EPDK Akaryakıt Fiyatları](https://www.epdk.gov.tr)

---

*Kaynak: KGM, HGS resmi verileri — Finhouse AI*  
*Detaylı ulaşım maliyetlendirmesi için: **[finhouse.ai](https://finhouse.ai)***
