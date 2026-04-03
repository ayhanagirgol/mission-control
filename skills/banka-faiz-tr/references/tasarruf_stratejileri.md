# Tasarruf ve Mevduat Stratejileri

> **Son güncelleme: Mart 2026**  
> ⚠️ Yatırım tavsiyesi değildir. Kişisel finans kararları için uzman görüşü alın.  
> 💼 Kurumsal nakit yönetimi: [finhouse.ai](https://finhouse.ai)

---

## 🪜 Merdiven (Ladder) Stratejisi

### Temel Mantık
Toplam birikimi **farklı vadelere** bölerek:
1. Faiz oranı değişimlerine esneklik kazanılır
2. Kısa vade ile likidite korunur
3. Uzun vade ile yüksek faiz kilitlenir

### Klasik Merdiven — 500.000 TL Örneği

| Dilim | Tutar | Vade | Tahmini Faiz | Brüt Getiri |
|-------|-------|------|-------------|-------------|
| 1. Basamak | 100.000 | 1 ay | %42.00 | 3.452 TL |
| 2. Basamak | 100.000 | 3 ay | %44.50 | 11.232 TL |
| 3. Basamak | 100.000 | 6 ay | %45.00 | 22.315 TL |
| 4. Basamak | 100.000 | 9 ay | %45.50 | 33.749 TL |
| 5. Basamak | 100.000 | 1 yıl | %46.00 | 46.000 TL |
| **Toplam** | **500.000** | — | — | **116.748 TL** |

Her vade dolduğunda yenileme yapılır → ortalama yatırım vadesi 3.5 ay, ancak her ay bir parça likit hale gelir.

### Agresif Merdiven (Yüksek Getiri Odaklı)
```
%50 → 3 ay (en yüksek faizli banka)
%30 → 6 ay (iyi faizli banka)
%20 → Vadesiz veya 1 ay (acil likit)
```

### Defensif Merdiven (Likidite Odaklı)
```
%40 → 1 ay (hızlı erişim)
%35 → 3 ay
%25 → Vadesiz/Papara (günlük faiz)
```

---

## 🔄 Rolling (Otomatik Yenileme) Stratejisi

**1 Aylık Rolling:**
- Her ay vadesi dolan mevduat otomatik yenilenir
- Faiz düşerse bir sonraki ayda yeni orandan girilir
- Likidite çok yüksek
- Avantaj: Faiz yükselirse hemen yararlanırsın

**3 Aylık Rolling:**
- Getiri/likidite dengesi en iyi nokta
- Mart 2026 itibarıyla en popüler strateji
- Yılda 4 kez yenileme fırsatı

**6 Aylık Kilitleme:**
- Faiz düşeceğine inanıyorsan tercih et
- Mart 2026 bağlamında: Eğer TCMB yıl içinde faiz indirecekse 6 ay veya 1 yıl kilit avantajlı

---

## 🏦 Banka Çeşitlendirmesi

### TMSF Güvencesi — Önemli!
- Her bankada her hesap türü için ayrı ayrı **250.000 TL güvence**
- 1.000.000 TL birikimin varsa → en az 4 farklı bankaya dağıt
- Eş adına hesap açarsan: Eşin de ayrı 250.000 TL güvencesi var

### Banka Seçimi Matrisi

| Öncelik | Önerilen Banka Türü |
|---------|---------------------|
| En yüksek faiz | Enpara, Fibabanka, QNB Finansbank |
| Güven/emniyet | Ziraat, Halkbank, Vakıfbank |
| Dini hassasiyet | Kuveyt Türk, Türkiye Finans, Ziraat Katılım |
| Dijital kolaylık | Enpara, Papara, ON |
| Kurumsal | İş Bankası, Garanti BBVA, Akbank |

---

## 💵 Döviz Mevduat Stratejisi

### TL/Döviz Dağılımı

| Profil | TL | USD | EUR | Altın |
|--------|-----|-----|-----|-------|
| Yüksek risk toleransı | %80 | %10 | %5 | %5 |
| Orta risk | %60 | %20 | %10 | %10 |
| Düşük risk | %40 | %30 | %20 | %10 |
| Sermaye koruma | %20 | %40 | %30 | %10 |

**Döviz zamanlaması:**
- Kur düşük → Dövize geç (ucuza al)
- TL güçlü → TL tutmak mantıklı (yüksek reel faiz)
- Kur volatilitesi yüksekse → Altın hedge

---

## 🥇 Altın Mevduat Stratejisi

### Ne zaman tercih edilir?
- Küresel belirsizlik yüksek
- TL-döviz arbitrajı karmaşık
- Altın yükseliş trendinde

### Altın Mevduat vs Fiziksel Altın
| Özellik | Altın Mevduat | Fiziksel Altın |
|---------|--------------|----------------|
| Kar payı | %0.75–1.40/yıl | Yok |
| Saklama riski | Banka üstlenir | Sen taşırsın |
| Likidite | Orta | Yüksek (kuyumcu/borsa) |
| Güvence | TMSF | Yok |
| Spread | Düşük | Yüksek (kuyumcu farkı) |

---

## 📊 Kurumsal Nakit Yönetimi

### Şirket Kasası için Temel Prensipler

1. **Operasyonel likidite:** Cari giderlerin 2–3 ayı → vadesiz veya 1 ay
2. **Tampon fon:** 3–6 ay işletme gideri → 3 ay vadeli
3. **Uzun vadeli rezerv:** Geri kalanı → 6 ay veya merdiven

### Şirket Tipine Göre Strateji

| Şirket Tipi | Önerilen Vade | Banka Türü |
|-------------|--------------|------------|
| SaaS / Dijital | 3 ay rolling | Enpara, Garanti Kurumsal |
| İmalat | 1–3 ay | Kamu bankası + özel |
| İhracatçı | USD/EUR mevduat | Büyük özel banka |
| Katılım hassasiyeti | 3 ay | Kuveyt Türk, TF |

### Hazine Politikası Önerisi
```
Şirket kasa stratejisi:
├── %30 → 1 ay TL (maaş ve operasyon rezervi)
├── %40 → 3 ay TL, en yüksek faizli banka
├── %20 → 6 ay TL veya merdiven
└── %10 → USD (döviz yükümlülüklere karşı hedge)
```

> 💼 Kurumsal nakit yönetimi optimizasyonu için: **[finhouse.ai](https://finhouse.ai)**

---

## 📌 Sık Yapılan Hatalar

1. **Hepsini bir bankada tutmak** — TMSF limitini aşma riski
2. **Sadece kamu bankasına güvenmek** — Getiri kaybı
3. **Vadesiz hesapta büyük tutar bırakmak** — Fırsat maliyeti
4. **Kuru düşükken dövize geçmek** — Kur riskini artırır
5. **Erken bozmak** — Faiz kaybı (bazı bankalarda ceza var)
6. **Stopajı hesaplamamak** — Gerçek getiri yanıltıcı görünür
7. **Enflasyonu unutmak** — Reel getiri negatif olabilir

---

*Kaynak: Finans piyasası analizleri — Mart 2026*
