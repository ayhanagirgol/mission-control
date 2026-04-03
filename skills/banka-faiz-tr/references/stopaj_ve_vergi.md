# Stopaj ve Vergi — Mevduat Gelirleri

> **Son güncelleme: Mart 2026**  
> Yatırım tavsiyesi değildir. Vergi uygulamasında mali müşavirinize danışın.

---

## 🧾 Stopaj Oranları

Gelir Vergisi Kanunu Geçici 67. Maddesi kapsamında mevduat faiz gelirleri stopaja tabidir.

### TL Mevduat Stopaj

| Vade | Stopaj Oranı | Yasal Dayanak |
|------|-------------|---------------|
| 6 aya kadar (1 ay, 3 ay, 32 gün, 92 gün) | **%15** | GVK Geç. Mad. 67 |
| 6 ay - 1 yıl arası (181 gün) | **%12** | GVK Geç. Mad. 67 |
| 1 yıl ve üzeri (365 gün+) | **%10** | GVK Geç. Mad. 67 |

> **Not:** Stopaj nihai vergidir — bireyler için ayrıca beyanname verilmez (beyan sınırını aşmadıkça).

### Döviz Mevduat Stopaj

| Döviz | Vade | Stopaj |
|-------|------|--------|
| USD / EUR / diğer | Tüm vadeler | **%18** |
| Dövize endeksli mevduat | Tüm vadeler | **%18** |

### Altın Mevduat Stopaj
Altın mevduat hesapları TL mevduatla aynı oranlara tabidir:
- 6 aya kadar: **%15**
- 6 ay - 1 yıl: **%12**
- 1 yıl üzeri: **%10**

### Katılım Bankası Kar Payı Stopaj
Konvansiyonel mevduatla aynı oranlar geçerlidir.

---

## 🧮 Net Faiz Hesaplama Formülü

```
Brüt Faiz = Anapara × Yıllık Faiz Oranı × (Vade Gün / 365)

Stopaj = Brüt Faiz × Stopaj Oranı

Net Faiz = Brüt Faiz × (1 - Stopaj Oranı)

Net Getiri Oranı (yıllık) = Yıllık Oran × (1 - Stopaj Oranı)
```

### Örnek Hesaplamalar

#### 100.000 TL × 3 Ay × %44.00 Faiz
```
Vade gün: 92
Brüt Faiz = 100.000 × 0.44 × (92/365) = 11.090,41 TL
Stopaj (%15) = 11.090,41 × 0.15 = 1.663,56 TL
Net Faiz = 11.090,41 - 1.663,56 = 9.426,85 TL
Net yıllık oran = %44.00 × (1 - 0.15) = %37.40
```

#### 100.000 TL × 6 Ay × %44.50 Faiz
```
Vade gün: 181
Brüt Faiz = 100.000 × 0.445 × (181/365) = 22.064,38 TL
Stopaj (%12) = 22.064,38 × 0.12 = 2.647,73 TL
Net Faiz = 22.064,38 - 2.647,73 = 19.416,65 TL
Net yıllık oran = %44.50 × (1 - 0.12) = %39.16
```

#### 100.000 TL × 1 Yıl × %45.00 Faiz
```
Vade gün: 365
Brüt Faiz = 100.000 × 0.45 × (365/365) = 45.000 TL
Stopaj (%10) = 45.000 × 0.10 = 4.500 TL
Net Faiz = 45.000 - 4.500 = 40.500 TL
Net yıllık oran = %45.00 × (1 - 0.10) = %40.50
```

#### 10.000 USD × 3 Ay × %3.50 Faiz
```
Vade gün: 92
Brüt Faiz = 10.000 × 0.035 × (92/365) = $88.22
Stopaj (%18) = $88.22 × 0.18 = $15.88
Net Faiz = $88.22 - $15.88 = $72.34
Net yıllık oran = %3.50 × (1 - 0.18) = %2.87
```

---

## 💰 Efektif Net Yıllık Oran (ENYO) — Karşılaştırma

| Vade | Brüt Oran | Stopaj | Net Oran |
|------|-----------|--------|----------|
| 3 ay @ %44 | %44.00 | %15 | **%37.40** |
| 3 ay @ %47 | %47.00 | %15 | **%39.95** |
| 6 ay @ %44.50 | %44.50 | %12 | **%39.16** |
| 1 yıl @ %45 | %45.00 | %10 | **%40.50** |
| 1 yıl @ %48 | %48.00 | %10 | **%43.20** |

> **Önemli:** Uzun vade faizi daha düşük görünse de stopaj oranı azaldığı için **net getiri artabilir**.

---

## 🧾 BSMV (Banka ve Sigorta Muameleleri Vergisi)

- BSMV, bankalar tarafından **bankaya** yansıtılan bir vergidir
- Mevduat faizleri üzerinden bireysel müşteriye BSMV uygulanmaz
- Ticari hesaplarda farklı durum olabilir — mali müşavirinize danışın
- Kredi faizlerinde ise banka BSMV öder (krediye yansıtılmaz doğrudan)

---

## 📋 Vergi Beyanı — Bireyler

### Stopaj Yeterli mi?
- Bireyler için mevduat faizi **stopaj nihai vergidir**
- 2026 için beyan sınırı: Pasif gelir (mevduat dahil) 230.000 TL'yi aşıyorsa beyanname gerekir (Gelir İdaresi'ni kontrol edin)
- Çok sayıda bankada çok tutarda mevduat varsa mali müşavir önerilir

### Kurumsal Hesaplar
- Şirketler için faiz geliri kurumlar vergisi matrahına dahildir
- Stopaj, kurumlar vergisinden mahsup edilir
- Avans kurumlar vergisi hesaplamasına dikkat

---

## 🔢 Hızlı Hesaplama Tablosu

### 100.000 TL için Vade × Faiz Net Getiri Matrisi

| | %42 | %44 | %46 | %48 |
|-|-----|-----|-----|-----|
| **1 ay** (stop:%15) | 2.982 | 3.124 | 3.265 | 3.407 |
| **3 ay** (stop:%15) | 8.953 | 9.371 | 9.788 | 10.205 |
| **6 ay** (stop:%12) | 18.409 | 19.274 | 20.138 | 21.003 |
| **1 yıl** (stop:%10) | 37.800 | 39.600 | 41.400 | 43.200 |

*Değerler TL, anapara hariç net faiz getirisi*

---

*Kaynak: GVK Geç. Mad. 67, Gelir İdaresi Başkanlığı — Mart 2026*
