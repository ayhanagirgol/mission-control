# TÜRKKEP — Merkezi Olmayan Güvenli Saklama Altyapısı
## TransferChain Benzeri Yapı: İhtiyaç Analizi ve Strateji

_Hazırlayan: OpenClaw AI Asistan | 30 Mart 2026_
_Gizlilik: TÜRKKEP İç Kullanım_

---

## ▶ NEDEN BU İHTİYAÇ DOĞDU?

TÜRKKEP'in mevcut saklama altyapısı merkezi bulut modellerine dayanmaktadır. Ancak müşteri tabanının artan güvenlik, KVKK/GDPR uyum ve veri egemenliği talepleri; özellikle finans, hukuk ve kamu sektörü müşterilerinin "verim benim kontrolümde kalmalı" beklentisi, geleneksel merkezi modelin sınırlarını zorlamaktadır.

**TÜRKKEP için dönüşüm fırsatı:**
> Saklama altyapısını "güvenli ve değişmez" olmaktan; "güvenli, değişmez **ve kullanıcı egemenliğinde**" konumuna taşımak.

---

## ▶ TRANSFERCHAİN NEDİR?

TransferChain, İsviçre merkezli (İstanbul ofisi de var), **end-to-end şifreli, blockchain destekli, dağıtık çok-bulut depolama** platformudur.

### Temel Teknoloji Katmanları:

| Katman | Açıklama |
|---|---|
| **İstemci Taraflı Şifreleme** | Veri kullanıcının cihazında şifrelenerek sisteme gönderilir — hiçbir zaman açık formda iletilmez |
| **E2E Şifreleme (E2EE)** | Uçtan uca şifreleme; TransferChain dahil kimse veriye erişemez |
| **Zero-Knowledge Mimari** | Şifreler ve dosyalar hiçbir zaman şifresiz formda saklanmaz veya iletilmez |
| **Blockchain Yetkilendirme** | Tüm şifreli metadata blockchain ağında değiştirilemez şekilde tutulur |
| **Dağıtık Çok-Bulut** | Veri parçalanarak dünyanın farklı bulut sağlayıcılarına dağıtılır |
| **Veri Egemenliği (Data Residency)** | Verinin hangi coğrafyada tutulacağı belirlenebilir — KVKK uyumu için kritik |
| **Regülasyon Uyumu** | KVKK/GDPR uyumlu tasarım, şifreleme + erişim kontrolü ile korunan kişisel veri |

---

## ▶ TÜRKKEP İÇİN KULLANIM SENARYOLARI

### Senaryo 1: Müşteri Veri Saklama Hizmetinin Güçlendirilmesi
Mevcut e-Saklama ve e-Dönüşüm müşterilerine sunulan saklama hizmeti, TransferChain benzeri mimariyle güçlendirilebilir:
- Müşteri verisinin **istemci taraflı şifrelenerek** Türkkep'e gönderilmesi
- Türkkep'in bile ham veriye erişememesi → **"Trusted AI" vizyonuyla mükemmel örtüşme**
- Blockchain ile değiştirilemez audit trail → **yasal delil değeri artar**

### Senaryo 2: TÜRKKEP AI için Güvenli Veri Katmanı
AI ürün gruplarının (Legal AI, CFO AI, Compliance AI) çalışacağı veri, geleneksel merkezi depolama yerine zero-knowledge dağıtık mimaride tutulabilir:
- AI, müşterinin şifreli verisini **kendi anahtarıyla açarak** işler
- Veri Türkkep sunucularında açık formda asla bulunmaz
- **"Trusted AI = Zero-Knowledge AI"** olarak pazarlanabilir

### Senaryo 3: KEP Arşiv Entegrasyonu
KEP mesajlarının uzun süreli arşivlenmesinde blockchain destekli değiştirilemezlik garantisi:
- Her KEP mesajı hash'i blockchain'e yazılır
- Arşiv bütünlüğü kriptografik olarak kanıtlanabilir
- Mahkeme süreçlerinde **tartışmasız delil değeri**

### Senaryo 4: Kurumlar Arası Güvenli Dosya Paylaşımı
Bankalar, hukuk firmaları, kamu kurumları arasında **hassas doküman transferi** için hazır altyapı — mevcut KEP altyapısının dosya transfer katmanıyla entegrasyonu.

---

## ▶ REKABET ANALİZİ: TRANSFERCHAİN vs ALTERNATİFLER

| Çözüm | Model | Güçlü Yönler | Zayıf Yönler | TR Uyumu |
|---|---|---|---|---|
| **TransferChain** | SaaS + API + White Label | E2EE, blockchain, zero-knowledge, veri egemenliği | Yeni şirket, TR referans az | ✅ KVKK, TR ofis var |
| **Tresorit** | SaaS (Macar/Swiss) | E2EE, kurumsal, iyi UX | Blockchain yok, veri egemenliği sınırlı | ✅ KVKK uyumlu |
| **Internxt** | SaaS + açık kaynak | Açık kaynak, ucuz | Kurumsal destek zayıf | ⚠️ Sınırlı |
| **Storj** | Dağıtık (token bazlı) | Gerçek dağıtık mimari, ucuz depolama | Karmaşık, token ekosistemi | ⚠️ KVKK riskli |
| **İç Geliştirme** | On-prem | Tam kontrol, özelleşme | Yüksek maliyet, zaman | ✅ Tam kontrol |
| **Mevcut S3/Azure** | Merkezi bulut | Ucuz, olgun | Zero-knowledge yok, egemenlik sınırlı | ⚠️ Kısmi |

**Sonuç:** TransferChain, TÜRKKEP'in "Trusted AI" vizyonuyla en uyumlu hazır çözümdür. Ancak white-label/entegrasyon modeli tercih edilmelidir.

---

## ▶ TÜRKKEP İÇİN ÖNERİLEN YAPI

### Hibrit Mimari: "TÜRKKEP Trusted Storage"

```
Müşteri Cihazı
    │
    ▼ (İstemci taraflı şifreleme)
TÜRKKEP Gateway API
    │
    ├── Metadata Katmanı → Blockchain (değiştirilemez log)
    │
    ├── Şifreli Veri → Dağıtık Depolama
    │       ├── TR Bulut (KVKK — birincil)
    │       ├── EU Bulut (Yedek)
    │       └── On-prem (kritik müşteriler)
    │
    └── AI Katmanı → Zero-Knowledge AI İşleme
            (müşteri anahtarıyla geçici şifre çözme)
```

### Uygulama Yol Haritası:

| Aşama | Süre | İçerik | Maliyet Tahmini |
|---|---|---|---|
| **Faz 1: PoC** | 2-3 ay | TransferChain API entegrasyonu, pilot müşteri | 20-50K USD |
| **Faz 2: Pilot** | 3-6 ay | 10-20 kurumsal müşteriye açılım, feedback | 50-100K USD |
| **Faz 3: Ürün** | 6-12 ay | "TÜRKKEP Trusted Storage" markasıyla lansман | 200K+ USD |

---

## ▶ STRATEJİK DEĞER: "TRUSTED AI" İLE BAĞLANTI

TransferChain benzeri altyapı kurulumu, TÜRKKEP'in "Trusted AI" vizyonunun **teknik temelini** oluşturur:

> **"Müşteri verisi TÜRKKEP'in AI sistemlerinde işlenir, ancak hiçbir zaman TÜRKKEP'in göremeyeceği şekilde şifreli kalır."**

Bu pozisyon:
- Rakip bulut sağlayıcılarından (Azure, AWS, Google) farklılaşma sağlar
- KVKK/GDPR uyum kaygılarını ortadan kaldırır
- Finans, sağlık, hukuk sektörlerinde premium fiyatlamayı mümkün kılar
- BTK ve BDDK nezdinde güçlü düzenleyici pozisyon yaratır

---

## ▶ ÖNERİLEN SONRAKI ADIMLAR

1. **TransferChain ile görüşme** — White label / API entegrasyon modelini değerlendir (İstanbul ofisi var)
2. **Rakip demo** — Tresorit ve Storj Enterprise ile karşılaştırmalı değerlendirme
3. **Teknik PoC bütçesi** — YK onayı alınarak 20-50K USD PoC başlatılması
4. **Müşteri sesi** — Mevcut e-Saklama müşterilerinden 5-10 kurumla "zero-knowledge saklama" ilgi araştırması
5. **Hukuki değerlendirme** — KVKK otoritesi (KVKK Kurumu) nezdinde bu modelin uyumluluğu teyit edilmeli

---

## ▶ YK'YA ÖNERİLEN KARAR EKİ

**Yeni Karar Maddesi Önerisi (K-10):**

> *TÜRKKEP'in uzun vadeli "Trusted AI" vizyonu çerçevesinde, müşteri veri egemenliğini garanti eden zero-knowledge, blockchain destekli dağıtık saklama altyapısı kurulumu için fizibilite ve PoC çalışması başlatılmasına; bu amaçla TransferChain ve alternatif çözümlerle görüşme yapılmasına ve 2026 Q3'te YK'ya detaylı PoC raporu sunulmasına karar verilmiştir.*
>
> Sorumlu: Ayhan Ağırgöl (CTO)
> Termin: 2026 Q3 PoC raporu

---

*Kaynaklar: transferchain.io, LinkedIn, açık kaynak inceleme*
*Hazırlayan: OpenClaw AI Asistan — 30 Mart 2026*
