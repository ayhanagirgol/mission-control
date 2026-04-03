# TEFAS Nasıl Kullanılır?

> Türkiye Elektronik Fon Alım Satım Platformu — Eksiksiz Kullanım Rehberi  
> Kaynak: tefas.gov.tr, SPK, Takasbank  
> ⚠️ Yatırım tavsiyesi değildir.

---

## TEFAS Nedir?

**TEFAS** (Türkiye Elektronik Fon Alım Satım Platformu), Türkiye'deki tüm yatırım fonlarının tek bir çatı altında alınıp satılabildiği merkezi platformdur.

### Temel Özellikler
- **İşletici:** Takasbank (Sermaye Piyasası takas ve saklama kuruluşu)
- **Erişim:** tefas.gov.tr veya bağlı bankalar/aracı kurumlar aracılığıyla
- **Kapsam:** Tüm portföy yönetim şirketlerinin fonları
- **Avantaj:** Bankadan bağımsız — A bankasında hesabın varken B bankasının fonunu alabilirsin

### TEFAS'tan Önce
Her banka yalnızca kendi fonlarını satıyordu. Müşteri bankasını değiştirmeden başka kurumun fonuna erişemiyordu. TEFAS bu sorunu ortadan kaldırdı.

---

## TEFAS'ta Nasıl Hesap Açılır?

### Yöntem 1: Mevcut Banka Üzerinden (En Kolay)
1. Bankana bağlan (internet bankacılığı veya mobil uygulama)
2. "Yatırım" → "Yatırım Fonları" bölümüne git
3. TEFAS aktif değilse "TEFAS aktivasyonu" yap (5 dakika)
4. Onaylar imzalandıktan sonra tüm TEFAS fonlarına erişim açılır

### Yöntem 2: Aracı Kurum
1. Yeni bir aracı kurum hesabı aç (SPK lisanslı)
2. Kimlik doğrulama (genellikle dijital, 15 dakika)
3. Para yatır ve TEFAS fonlarına erişim

### TEFAS Uyumlu Bankalar/Kurumlar (Başlıcalar)
- Akbank / Ak Portföy
- Garanti BBVA
- İş Bankası
- Yapı Kredi
- Ziraat Bankası
- Halkbank
- Vakıfbank
- Denizbank
- QNB Finansbank
- TEB (BNP Paribas)
- ING Bank
- Kuveyt Türk
- Türkiye Finans
- Odeabank
- Midas (aracı kurum, dijital)
- TRADEX / Matriks (aracı kurumlar)

---

## TEFAS'ta Fon Alma / Satma

### Alım (Satın Alma) Süreci

1. **Fon kodu gir** (örn: TLY, ZPP, AGA)
2. **Tutar gir** (miktar veya pay sayısı)
3. **Onay ver**
4. **İşlem gerçekleşme zamanı:**
   - Saat 13:30'a kadar verilen emirler → O gün kapanış değeri ile gerçekleşir
   - 13:30 sonrası → Ertesi iş günü kapanış değeri ile

> **Not:** Birim pay değeri her iş günü saat ~17:00-18:00 arası TEFAS'ta güncellenir.

### Satım Süreci
- Aynı platform üzerinden
- Para hesabına genellikle T+2 iş günü geçer (bazı PPF'lerde T+1 veya T+0)

### Alım-Satım Saatleri
- İş günleri: 09:00 – 13:30 (emir kesim saati)
- Hafta sonu ve resmi tatillerde işlem yok

---

## TEFAS Web Sitesi — Fon Analiz

**tefas.gov.tr** üzerinde ücretsiz olarak:

### Fon Arama
- **Fon kodu** ile arama (TLY, ZPP, vs.)
- **Fon adı** ile arama
- **Türe göre** filtreleme

### Her Fon İçin Gösterilen Bilgiler
| Bilgi | Açıklama |
|-------|----------|
| Birim Pay Değeri | Güncel 1 pay fiyatı (TL) |
| Toplam Değer (AUM) | Fonun toplam büyüklüğü |
| Yatırımcı Sayısı | Fondaki aktif yatırımcı |
| TER | Yıllık toplam gider oranı |
| Risk Derecesi | SPK 1-7 skalası |
| Getiri Grafiği | 1 hafta, 1 ay, 3 ay, 6 ay, 1 yıl, 3 yıl |
| Portföy Dağılımı | Varlık sınıfı bazında % dağılım |
| İlk 10 Varlık | En büyük 10 portföy pozisyonu |

### Fon Karşılaştırma
- "Fon Karşılaştırma" aracı ile 5'e kadar fonu yan yana kıyasla
- Getiri grafiklerini overlay et

---

## TEFAS API ve Veri Çekme

### Resmi API
TEFAS resmi bir API sunmamaktadır. Veri erişimi genellikle:

### Yöntem 1: Python ile Web Scraping (Gayri resmi)
```python
import requests

# Birim pay değeri çekme — TEFAS'ın iç API endpoint'i
# (Resmi değil, değişebilir)
url = "https://tefas.gov.tr/api/DB/BindHistoryInfo"
params = {
    "fontip": "YAT",
    "fonkod": "TLY",
    "bastarih": "01.01.2024",
    "bittarih": "31.12.2024"
}
response = requests.post(url, data=params)
data = response.json()
```

### Yöntem 2: tefas Python Kütüphanesi
```bash
pip install tefas-crawler
```
```python
from tefas import Crawler
crawler = Crawler()
# Fon geçmiş verisi
data = crawler.fetch(start="2024-01-01", name="TLY")
```

### Yöntem 3: Script Kullanımı (Bu Skill)
```bash
python3 scripts/tefas_analiz.py --fon TLY
```

---

## Hangi Bankadan Hangi Fon Alınır?

### Önemli: TEFAS = Hepsinden Hepsi
TEFAS aktif ettikten sonra hangi bankada hesabın olursa olsun, **tüm portföy şirketlerinin fonlarını** alabilirsin.

Örnek:
- Ziraat Bankası hesabınla → Tera Portföy (TLY) alabilirsin
- Akbank hesabınla → Ziraat Portföy (ZPP) alabilirsin

### İstisna: Bazı Fonlar Sadece Kendi Kanalında
- Bazı serbest fonlar sadece kendi şirketin platformunda işlem görür
- BES (emeklilik) fonları TEFAS'ta değil, sigorta şirketi platformunda

---

## Mobil Uygulama Üzerinden TEFAS

### Bankacılık Uygulamaları
- **Akbank:** Yatırım → Yatırım Fonları → TEFAS aktif et
- **Garanti BBVA:** Yatırım → Fonlar
- **İş Bankası:** Yatırım İşlemleri → Fon İşlemleri
- **Ziraat:** Yatırım → Yatırım Fonları
- **Yapı Kredi:** Fon İşlemleri

### Bağımsız Yatırım Uygulamaları
- **Midas:** Kolay arayüz, TEFAS + hisse
- **Matriks:** Profesyonel araçlar

---

## SSS

**S: TEFAS'ta hesap açmak ücretli mi?**  
C: Hayır, tamamen ücretsiz. Bankana hesabın varsa aktivasyon ücretsiz.

**S: Fon alımında komisyon var mı?**  
C: Genellikle yoktur. Maliyet TER (yönetim ücreti) ile yansıtılır. Bazı kurumlar küçük işlem masrafı alabilir; bankanı kontrol et.

**S: Minimum yatırım tutarı nedir?**  
C: Çoğu fonda 1 TL (1 birim pay değeri kadar). Serbest fonlarda 500.000 TL nitelikli yatırımcı şartı var.

**S: Fonumu sattığımda para ne zaman gelir?**  
C: PPF ve bazı fon türlerinde T+1, diğerlerinde T+2 iş günü. Serbest fonlarda T+3 ila T+5 olabilir.

**S: TEFAS güvenli mi?**  
C: Evet. Takasbank devlet destekli bir saklama kuruluşu. SPK denetiminde. Fon varlıkları banka varlıklarından ayrı saklanır.

---

> Kurumsal yatırım danışmanlığı: **finhouse.ai**  
> Kaynak: tefas.gov.tr, SPK, Takasbank
