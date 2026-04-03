# BIST Algoritmik Trading Stratejileri — Araştırma Raporu

> **Tarih:** 1 Nisan 2026  
> **Kaynaklar:** GitHub, Google Scholar, Medium, akademik tezler, açık kaynak projeler

---

## 1. En Uygun Stratejiler (Sıralı, En İyiden)

### 🥇 1. Pairs Trading (Koentegrasyon Bazlı İstatistiksel Arbitraj)

**Açıklama:** BIST-30/BIST-100 hisseleri arasında koentegre çiftler bulunur. Spread (fiyat farkı) ortalamadan saptığında (Z-score > 2) karşı yönde pozisyon alınır.

**Neden BIST'e Uygun:**
- BIST'te aynı sektördeki hisseler güçlü korelasyon gösteriyor (bankacılık: AKBNK-VAKBN-YKBNK; petrokimya: PETKM-TUPRS)
- Piyasa nötr strateji — yüksek volatilite ve makro belirsizliğe karşı korumalı
- TL devalüasyonu ve enflasyon etkilerinden izole çalışır
- Yüksek volatilite daha sık trade fırsatı = daha fazla mean reversion sinyali

**Backtest Sonuçları (2025-2026):**
| Çift | Koentegrasyon p-değeri | Başlangıç | Bitiş | Getiri |
|------|----------------------|-----------|-------|--------|
| BIMAS-PGSUS | 0.0172 | 5,000 TL | 6,969 TL | **+39.4%** |
| SISE-YKBNK | 0.0478 | 5,000 TL | 6,923 TL | **+38.5%** |
| PETKM-SASA | 0.0285 | 5,000 TL | 6,166 TL | **+23.3%** |
| AKBNK-VAKBN | 0.0247 | 5,000 TL | 5,074 TL | **+1.5%** |

**Python İmplementasyon Notları:**
- Engle-Granger koentegrasyon testi (`statsmodels.tsa.stattools.coint`)
- Rolling OLS (20 günlük pencere) ile hedge ratio hesaplama
- Z-score eşikleri: Giriş ±2σ, Çıkış 0 (ortalamaya dönüş)
- Log fiyatlar kullanılmalı (varyans stabilizasyonu)
- Kütüphaneler: `yfinance`, `statsmodels`, `pandas`, `numpy`

**Kaynak:** 
- https://github.com/elfakb/BIST30-Pairs-Trading
- https://github.com/seymaozukanar/pairs-trading-BIST100

---

### 🥈 2. Momentum + Trend Takip (EMA/DMA + Volume Confirmation)

**Açıklama:** Çok katmanlı giriş onay sistemi: EMA trend yönü + hacim doğrulaması + SuperTrend filtresi + Bollinger Band pozisyonlama. Sabit stop-loss yerine mum bazlı tükenme çıkışları kullanılır.

**Neden BIST'e Uygun:**
- BIST'te güçlü trendler oluşuyor (özellikle enflasyon/devalüasyon dönemlerinde)
- Yüksek volatilite sabit stop-loss'u tetikliyor → mum bazlı çıkış bu sorunu çözüyor
- Hacim doğrulaması kurumsal katılımı teyit ediyor (BIST'te kurumsal-bireysel ayrımı önemli)
- EMA-50 üzeri breakout buffer (%0.33) sahte sinyalleri azaltıyor

**Backtest Sonuçları (SNIPER v8.39 — AKFYE, 2023-2026):**
| Metrik | Değer |
|--------|-------|
| Başlangıç sermaye | 10,000 TL |
| Final sermaye | 21,602 TL |
| Strateji getirisi | **+116%** |
| Buy & Hold getirisi | +60% |
| Outperformance | **~2x** |

**Çıkış Sinyalleri (4 seviye):**
1. Precision Exit: 4 ardışık mumda gövde/toplam oran > %34.7
2. Hard Exit: 5 ardışık kırmızı mum (koşulsuz)
3. Penalty Mode: Kötü çıkış sonrası güçlü boğa mumu gereksinimi
4. SuperTrend flattening (Bollinger üst bandı yakınında)

**Python İmplementasyon Notları:**
- `yfinance` (veri), `pandas-ta` (teknik göstergeler), `plotly` (görselleştirme)
- SuperTrend kolon adı dinamik: `startswith("SUPERTd")` kullan
- Body ratio threshold hisse bazlı kalibrasyon gerektirir
- Tüm parametreler dosya başında sabit olarak tanımlı

**Kaynak:** https://github.com/Emirzonee/Algo-Trade-Backtester

---

### 🥉 3. Çok Strateji Framework (DMA + Donchian + RSI + Bollinger + Combo)

**Açıklama:** 5 farklı stratejiyi aynı framework'te test eden akademik backtest sistemi. TRY ve USD bazında dual-currency analiz. 2018-2025 BIST-100 verisi.

**Stratejiler:**
1. **DMA (Dual Moving Average)** — Trend takip
2. **Donchian Breakout** — Kanal kırılımı momentum
3. **Combo Filtered** — Birden fazla gösterge birleşimi
4. **RSI** — Aşırı alım/satım mean reversion
5. **Bollinger Bands** — Volatilite bazlı mean reversion

**Neden BIST'e Uygun:**
- TRY ve USD perspektifi — BIST'in gerçek performansını ölçmek için kritik
- %0.1 slippage, %25 nakit faizi (Türkiye'ye özel yüksek faiz ortamı)
- Maksimum 15 pozisyon limiti — likidite riskini yönetir
- 4 farklı piyasa rejiminde alt-dönem analizi
- Bootstrap significance testi (10,000 iterasyon)

**Robustness Kontrolleri:**
- ✅ T-test (benchmark karşılaştırma)
- ✅ Rolling 3 yıllık Sharpe oranları
- ✅ İşlem maliyeti duyarlılığı (%0.05, %0.10, %0.20)
- ✅ Parametre duyarlılık analizi
- ✅ Makro korelasyonlar (kur, enflasyon, faiz)
- ✅ Sektör bazlı performans kırılımı

**Python İmplementasyon Notları:**
- `pandas`, `numpy`, `yfinance`, `matplotlib`, `seaborn`, `scipy`
- Python 3.8+ uyumlu
- Comprehensive metrikler: Sharpe, Sortino, Calmar, win rate, profit factor, expectancy

**Kaynak:** https://github.com/fdirencaktas/fortress-bist-momentum

---

### 4. MA Crossover (EMA-13/EMA-55)

**Açıklama:** Basit ama etkili EMA crossover stratejisi. EMA-13 yukarı kestiğinde AL, aşağı kestiğinde SAT.

**Neden BIST'e Uygun:**
- Düşük karmaşıklık, hızlı implementasyon
- BIST'teki güçlü trendlerde iyi çalışıyor
- Yeni başlayanlar için ideal giriş noktası

**Python İmplementasyon:** `yfinance`, `pandas`, `matplotlib`

**Kaynak:** https://github.com/yusufemreozden/bist-ma-crossover-backtest

---

### 5. AI-Destekli Sinyal Sistemi (RSI + MACD + Bollinger + Volume + LLM)

**Açıklama:** 6 teknik gösterge + 9 haber RSS kaynağı + Claude AI ile doğal dil analizi. Telegram üzerinden sinyal dağıtımı.

**Bileşenler:**
- RSI(14) Wilder smoothing ile
- MACD (12/26/9) EMA ile
- Bollinger Bands (20-period, 2σ)
- Dinamik destek/direnç (20 günlük)
- Hacim oranı (20 günlük ortalamaya göre)
- Composite skor: ≥3 = AL, ≤-3 = SAT

**Neden BIST'e Uygun:**
- Haber etkisi BIST'te çok güçlü (siyasi haberler, TCMB kararları)
- Türkçe haber kaynakları entegre
- Anomali tespiti: ±%5 portföy hareketi anında uyarı
- JSON bazlı sinyal hafızası — tutarlılık sağlıyor

**Maliyet:** ~$1.50-2.50/ay (yfinance ücretsiz, Claude Haiku API ~$0.05-0.08/gün)

**Kaynak:** https://github.com/sudo-pavlus/bist-trading-bot

---

### 6. Intraday Price Reversal (Sabah Gap Stratejisi)

**Açıklama:** Akademik araştırmaya dayalı. BIST-100'de aşırı gecelik gap'ler sonrası ilk dakikalarda fiyat geri dönüşü (reversal) gözlemleniyor.

**Neden BIST'e Uygun:**
- BIST'te gecelik haberler (Dow Jones kapanışı, TCMB kararları, siyasi gelişmeler) sabah gap'leri yaratıyor
- Cingöz (2021, METU tezi): BIST-100'de reversal ikinci dakikadan itibaren başlıyor
- Eşik seviyeleri yükseldikçe reversal olasılığı artıyor
- Inci & Ozenbas (2017): BIST'te açılış volatilitesi gün içi en yüksek (U-shape pattern)

**Strateji Mantığı:**
1. Gap > belirli eşik (örn. %2) → karşı yöne pozisyon al
2. İlk 5-15 dakika içinde çıkış
3. Kapanış müzayede sistemi fiyat keşfini etkiliyor

**Akademik Kaynaklar:**
- Cingöz F. (2021) "Intraday Price Reversals with High Frequency Data: Applied to BIST 100 Index" — METU
- Inci A.C., Ozenbas D. (2017) "Intraday volatility and the implementation of a closing call auction at Borsa Istanbul" — Emerging Markets Review
- Savaş M.C. (2017) "Algorithmic trading strategies using dynamic mode decomposition: Applied to Turkish stock market" — METU

---

### 7. Sector Rotation (BIST Sektör Endeksleri Arası Geçiş)

**Açıklama:** BIST'in sektör endeksleri arasında rotasyon yaparak göreceli güç temelinde portföy yönetimi.

**BIST Sektör Dinamikleri:**
- **Bankacılık (XBANK):** TCMB faiz kararlarına duyarlı, enflasyon beklentileri
- **Sanayi (XUSIN):** Döviz/hammadde maliyetlerine duyarlı
- **Holding (XHOLD):** Genel piyasa barometresi
- **Teknoloji (XUTEK):** Küresel teknoloji trendlerine bağlı

**Strateji:** Her ay göreceli momentum en yüksek 2-3 sektöre ağırlık ver. Yavuzarslan et al. (2026): BIST'te rejim geçişlerinde asimetrik risk-getiri dinamikleri var.

---

## 2. BIST'e Özel Gözlemler

### 🌅 Sabah Gap Paterni
- BIST açılışında (10:00) gecelik haber akışı gap yaratıyor
- ABD piyasaları (Dow Jones, S&P 500) kapanışı en büyük etken
- TCMB faiz kararları, siyasi haberler sabah gap'lerini tetikliyor
- Akademik bulgular: Gap sonrası reversal 2. dakikadan itibaren başlıyor (Cingöz, 2021)
- Açılış volatilitesi U-şeklinde: Gün başı ve sonu en yüksek (Inci & Ozenbas, 2017)
- Kapanış müzayedesi (closing call auction) gün sonu volatiliteyi azaltıyor

### 📊 Sektör Korelasyonları
- **Bankacılık hisseleri** birbirleriyle çok yüksek korelasyon → Pairs trading ideal
  - AKBNK-VAKBN, YKBNK-GARAN, SISE-YKBNK
- **PETKM** birçok hisse ile koentegre — Pairs trading için "hub" hisse
  - PETKM-SASA, PETKM-SAHOL, PETKM-TCELL, PETKM-TUPRS
- **BIMAS** defansif karakter ile agresif hisseler arasında çift oluşturuyor
  - BIMAS-PGSUS (en yüksek getirili çift: +39.4%)
- Makro korelasyonlar: Kur, enflasyon ve faiz oranları strateji performansını etkiliyor

### 📅 Sezon/Ay Bazlı Performans Farkları
- **Ocak Etkisi (January Effect):** BIST'te Ocak ayında pozitif anormal getiri gözlemleniyor (akademik olarak doğrulanmış)
- **Ramazan Etkisi:** Ramazan döneminde BIST-100 volatilitesinde farklılık (Yilmaz & Can Ergun, 2017)
- **Sürü Davranışı (Herding):** BIST'te takvim anomalileri ile sürü davranışı birlikte gözlemleniyor (Cılıngırtürk et al., 2020)
- **Yüksek Enflasyon Dönemleri:** Momentum stratejileri enflasyon dönemlerinde TRY bazında parlıyor ama USD bazında farklı sonuç verebilir

### 🔗 Dow Jones / Küresel Korelasyon
- BIST sabah açılışı ABD kapanışıyla güçlü korelasyon
- Fed kararları → TCMB beklentileri → BIST gap zinciri
- Global risk-off dönemlerinde (VIX yükseliş) BIST'te satış baskısı yoğun
- Bu korelasyon gap trading stratejileri için input

### 💱 TRY vs USD Analizi
- BIST TRY bazında nominal yüksek getiri üretebilir ama USD bazında farklı
- Fortress projesi dual-currency (TRY/USD) analizin önemini vurguluyor
- Nakit pozisyonda %25 faiz (2025-2026 Türkiye) → strateji değerlendirmesinde kritik benchmark
- "Beat the risk-free rate" BIST'te çok yüksek bar (%25-50 TRY faiz)

---

## 3. Risk Yönetimi Önerileri

### Kelly Criterion — Pozisyon Boyutlandırma
```
f* = (bp - q) / b
```
- f* = optimal yatırım oranı
- b = odds (ortalama kazanç / ortalama kayıp)
- p = kazanma olasılığı
- q = 1 - p
- **BIST için:** Yarı-Kelly kullan (f*/2) — yüksek volatilite nedeniyle tam Kelly çok agresif

### Drawdown Bazlı Strateji Duraklatma
- **%10 drawdown:** Pozisyon boyutunu %50 azalt
- **%15 drawdown:** Yeni pozisyon açmayı durdur
- **%20 drawdown:** Tüm pozisyonları kapat, stratejiyi 1 hafta duraklat
- Rolling drawdown penceresi: 20 iş günü

### Portföy Çeşitlendirme Kuralları
- **Maksimum tek pozisyon:** Portföyün %10'u (fortress projesi: maks 15 pozisyon)
- **Sektör limiti:** Portföyün %30'u tek sektörde
- **Strateji çeşitlendirmesi:** Momentum + Mean Reversion + Pairs → düşük korelasyon
- **Nakit tamponu:** Her zaman %15-20 nakit tut (BIST'te fırsatlar ani geliyor)
- **Slippage bütçesi:** %0.1-0.2 (BIST likiditesi düşük olan hisselerde daha yüksek)

### BIST'e Özel Risk Faktörleri
- **Likidite riski:** BIST-30 dışında spread genişleyebilir → yalnızca likit hisselerde trade et
- **Kur riski:** USD bazlı düşünerek risk yönet
- **Siyasi/düzenleyici risk:** SPK, TCMB kararları piyasayı aniden etkileyebilir
- **İşlem maliyeti:** Komisyon + BSMV + stopaj → net getiriyi %0.15-0.3 azaltır
- **Trading halt riski:** BIST'te volatilite bazlı devre kesiciler aktif (Bildik, 2023)

---

## 4. Önerilen Strateji Kombinasyonu

### A. Core Portföy (%50) — Pairs Trading
- **Koşul:** Her zaman aktif, piyasa nötr
- **Hisseler:** BIST-30 koentegre çiftler
- **En iyi çiftler:** BIMAS-PGSUS, SISE-YKBNK, PETKM-SASA
- **Rebalance:** Z-score bazlı, rolling OLS 20 gün
- **Hedef:** Yıllık %15-25 TRY (piyasa yönünden bağımsız)

### B. Trend Takip (%30) — Momentum/EMA Stratejisi
- **Koşul:** Piyasa trend gösterdiğinde (ADX > 25)
- **Hisseler:** BIST-50 likit hisseler
- **Giriş:** EMA-50 üzeri breakout + hacim doğrulaması + SuperTrend
- **Çıkış:** Mum bazlı tükenme sinyalleri (SNIPER sistemi)
- **Hedef:** Yıllık %30-50 TRY (trend dönemlerinde)

### C. Taktik Fırsatlar (%20) — Gap Trading + Sezonsal
- **Sabah Gap Reversal:** Gap > %2 → karşı yönde 5-15 dk trade
- **Ocak Etkisi:** Aralık sonu → Ocak başı uzun pozisyon
- **Ramazan Etkisi:** Volatilite farkını fiyatla
- **TCMB Kararları:** Faiz kararı öncesi/sonrası volatilite stratejisi
- **Hedef:** Yıllık %10-20 TRY (fırsat bazlı)

### Rejim Bazlı Geçiş Kuralları
| Piyasa Rejimi | Core (Pairs) | Trend | Taktik |
|---------------|-------------|-------|--------|
| Bull Trend | %40 | %40 | %20 |
| Bear Trend | %60 | %20 | %20 |
| Range-Bound | %50 | %10 | %40 |
| Kriz/Yüksek Vol | %70 | %0 | %30 |

### Teknoloji Stack Önerisi
```
Veri: yfinance (ücretsiz) veya BIST API (gerçek zamanlı)
Backtest: backtrader veya vectorbt
Göstergeler: pandas-ta veya ta-lib
Koentegrasyon: statsmodels
ML (opsiyonel): scikit-learn, xgboost
Görselleştirme: plotly, matplotlib
Sinyal dağıtımı: Telegram Bot API
Veritabanı: PostgreSQL + TimescaleDB (zaman serisi)
Cache: Redis
```

---

## 5. Kaynaklar

### GitHub Projeleri
| Proje | Strateji | Dil | Link |
|-------|----------|-----|------|
| BIST30-Pairs-Trading | Koentegrasyon pairs trading | Python/Jupyter | https://github.com/elfakb/BIST30-Pairs-Trading |
| Algo-Trade-Backtester | SNIPER v8.39 momentum | Python | https://github.com/Emirzonee/Algo-Trade-Backtester |
| fortress-bist-momentum | 5 strateji framework | Python | https://github.com/fdirencaktas/fortress-bist-momentum |
| bist-ma-crossover-backtest | EMA crossover | Python | https://github.com/yusufemreozden/bist-ma-crossover-backtest |
| bist-trading-bot | AI sinyal sistemi | Python | https://github.com/sudo-pavlus/bist-trading-bot |
| bist-holly | AI trading asistanı | JavaScript | https://github.com/certurk23/bist-holly |
| pairs-trading-BIST100 | Pairs trading | R | https://github.com/seymaozukanar/pairs-trading-BIST100 |
| borsa-istanbul-ui | Borsa analiz | JavaScript | https://github.com/furkankirmizioglu/borsa-istanbul-ui |

### Akademik Makaleler
| Yazar | Başlık | Yıl | Konu |
|-------|--------|-----|------|
| Cingöz F. | Intraday Price Reversals with HF Data: BIST 100 | 2021 | Gap reversal |
| Savaş M.C. | Algorithmic Trading Strategies using DMD: Turkish Stock Market | 2017 | Dynamic Mode Decomposition |
| Inci A.C., Ozenbas D. | Intraday Volatility and Closing Call Auction at Borsa Istanbul | 2017 | Volatilite paterni |
| Bildik R. | Trading Halts and Institutional Investors: Borsa Istanbul | 2023 | Devre kesici |
| Yilmaz A., Can Ergun Z. | Volatility Effect of Seasonal Variation: Ramadan Case | 2017 | Ramazan etkisi |
| Cılıngırtürk et al. | Herding and Calendar Anomalies in Borsa Istanbul | 2020 | Takvim anomalileri |
| Yavuzarslan et al. | Asymmetric Risk-Return Dynamics: Regime-Switching on BIST | 2026 | Rejim geçişleri |
| Kadioglu E. | Intraday Analysis of Regulation Change in Microstructure | 2023 | Mikro yapı |

### Genel Algoritmik Trading Kaynakları
- Volta V. — "Profitable Algorithmic Trading Strategies in Mean-Reverting Markets" (academia.edu)
- Silva T.C. et al. (2019) — "Modeling Investor Behavior using ML: Mean-Reversion and Momentum" — Complexity, Wiley
- r/algotrading (Reddit) — genel strateji tartışmaları
- QuantConnect tutorials — backtest framework

---

## Özet Skor Kartı

| Strateji | BIST Uygunluğu | Karmaşıklık | Risk | Beklenen Getiri (TRY/yıl) |
|----------|---------------|-------------|------|--------------------------|
| Pairs Trading | ⭐⭐⭐⭐⭐ | Orta-Yüksek | Düşük | %15-25 |
| Momentum/EMA (SNIPER) | ⭐⭐⭐⭐ | Orta | Orta | %30-50 (trend) |
| Multi-Strategy Framework | ⭐⭐⭐⭐ | Yüksek | Düşük-Orta | %20-35 |
| Gap Reversal | ⭐⭐⭐⭐ | Düşük-Orta | Orta-Yüksek | %10-20 |
| AI Sinyal Sistemi | ⭐⭐⭐ | Yüksek | Orta | Değişken |
| MA Crossover | ⭐⭐⭐ | Düşük | Orta | %10-25 |
| Sector Rotation | ⭐⭐⭐ | Orta | Orta | %15-30 |

> ⚠️ **Yasal Uyarı:** Bu rapor eğitim ve araştırma amaçlıdır. Yatırım tavsiyesi değildir. Geçmiş performans gelecek sonuçları garanti etmez. Tüm yatırım kararları ve riskleri kullanıcıya aittir.
