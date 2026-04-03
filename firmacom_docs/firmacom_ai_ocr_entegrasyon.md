# FirmaCom — AI & OCR Entegrasyon Planı

> **Hazırlanma:** Mart 2026  
> **Platform:** React Native (mobil) + React/Vite (web) + Firebase (Firestore + Auth)  
> **Pazar:** Türkiye B2B SaaS (KOBİ odaklı)

---

## İçindekiler

1. [OCR Çözümleri Karşılaştırması](#1-ocr-çözümleri-karşılaştırması)
2. [AI Chatbot / Asistan Çözümleri](#2-ai-chatbot--asistan-çözümleri)
3. [FirmaCom'a Özel Kullanım Senaryoları](#3-firmacomа-özel-kullanım-senaryoları)
4. [Teknik Mimari](#4-teknik-mimari)
5. [MVP Planı (4 Hafta)](#5-mvp-planı-4-hafta)
6. [Maliyet Analizi](#6-maliyet-analizi)
7. [Önerilen Stack](#7-önerilen-stack)

---

## 1. OCR Çözümleri Karşılaştırması

### 1.1 Detaylı Değerlendirme

#### 🔵 Google Cloud Vision API

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐⭐ Latin alfabesi tam destekli, Türkçe özel karakterler (ğ, ş, ı, ç, ö, ü) sorunsuz |
| **Fiyatlandırma** | İlk 1.000 istek/ay ÜCRETSİZ; 1.001–5.000.000 → $1.50/1K birim; 5M+ → $0.60/1K birim |
| **Firebase Entegrasyonu** | ⭐⭐⭐⭐⭐ Aynı GCP ekosistemi, Service Account ile doğrudan Cloud Functions çağrısı |
| **Entegrasyon Zorluğu** | Düşük — Firebase SDK ile neredeyse native entegrasyon |
| **Öne Çıkan Özellikler** | Document Text Detection, handwriting, PDF/multipage support |
| **Avantajlar** | Firebase ile tek ekosistem; ücretsiz tier cömert; çok dilli; doküman yapısı analizi |
| **Dezavantajlar** | Önceden eğitilmiş belge modeli yok (fatura, kimlik için ek işlem gerekir); form parsing zayıf |

**Kullanım örneği (Cloud Functions):**
```javascript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

exports.ocrDocument = functions.https.onCall(async (data, context) => {
  const [result] = await client.documentTextDetection({
    image: { content: data.imageBase64 }
  });
  const fullText = result.fullTextAnnotation?.text || '';
  return { text: fullText, pages: result.fullTextAnnotation?.pages };
});
```

---

#### 🔷 Azure AI Document Intelligence (eski Form Recognizer)

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐⭐ Layout ve Read modelleri Türkçe dahil 300+ dil desteği |
| **Fiyatlandırma** | Ücretsiz: 500 sayfa/ay; S0 Read: ~$1.50/1K sayfa; Prebuilt (fatura/kimlik): ~$10/1K sayfa |
| **Firebase Entegrasyonu** | ⭐⭐⭐ REST API çağrısı; Cloud Functions üzerinden proxy gerekir |
| **Entegrasyon Zorluğu** | Orta — Azure aboneliği + API key yönetimi |
| **Öne Çıkan Özellikler** | **Hazır modeller:** Invoice, ID Card, Receipt, W-2, Health Insurance Card, Contract |
| **Avantajlar** | Fatura/kimlik için hazır şema; tablo çıkarma mükemmel; custom model eğitme; key-value pair extraction |
| **Dezavantajlar** | Google ekosistemi değil; ek maliyet; Türkçe vergi levhası için custom model gerekebilir |

**Hazır Modeller (FirmaCom için kritik):**
- `prebuilt-idDocument` → TC Kimlik, Pasaport
- `prebuilt-invoice` → Fatura işleme
- `prebuilt-receipt` → Makbuz okuma

**Kullanım örneği:**
```javascript
// Cloud Functions içinde
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');

const client = new DocumentAnalysisClient(
  process.env.AZURE_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_KEY)
);

exports.analyzeID = functions.https.onCall(async (data) => {
  const poller = await client.beginAnalyzeDocument('prebuilt-idDocument', data.imageBuffer);
  const result = await poller.pollUntilDone();
  return {
    firstName: result.documents[0].fields.FirstName?.value,
    lastName: result.documents[0].fields.LastName?.value,
    documentNumber: result.documents[0].fields.DocumentNumber?.value,
  };
});
```

---

#### 🟡 AWS Textract

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐ Latin tabanlı iyi; ancak Türkçe özel karakterlerde zaman zaman sorun |
| **Fiyatlandırma** | Detect Text: $1.50/1K sayfa (ilk 1M); Form/Table: $50/1K sayfa (Forms) + $15/1K (Tables); ID API: $25/1K (ilk 100K) |
| **Firebase Entegrasyonu** | ⭐⭐ AWS SDK + ayrı auth sistemi; Cloud Functions'tan çağrılabilir ama karmaşık |
| **Entegrasyon Zorluğu** | Yüksek — iki ayrı cloud ekosistemi yönetimi |
| **Öne Çıkan Özellikler** | Tablo ve form çıkarımında sektör lideri; Lending API; Signature Detection |
| **Avantajlar** | Tablo yapısı mükemmel; imza tespiti var; bankacılık/finans belge desteği |
| **Dezavantajlar** | Firebase ile soğuk entegrasyon; AWS ekosistemi bağımlılığı; Forms çıkarma pahalı |

**Fiyat Notu (2025):**
- Text: $0.0015/sayfa (1M'e kadar)
- Forms + Tables: $0.05/sayfa (Forms) + $0.015/sayfa (Tables)
- ID Documents: $0.025/sayfa (100K'ya kadar), $0.01/sayfa (100K+)
- Expense (Fatura): $0.01/sayfa (1M'e kadar)

---

#### 🟢 Tesseract.js (Açık Kaynak)

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐ Türkçe dil dosyası mevcut (`tur`); iyi koşullar altında %80-90; düşük kalite görselde %50-60 |
| **Fiyatlandırma** | ÜCRETSİZ (açık kaynak) |
| **Firebase Entegrasyonu** | ⭐⭐⭐⭐ Browser'da çalışır; Cloud Functions'ta Node.js ile kullanılabilir |
| **Entegrasyon Zorluğu** | Düşük (web için); Node.js backend için orta |
| **Öne Çıkan Özellikler** | Tamamen client-side çalışabilir; veri gizliliği maksimum; sunucu maliyeti yok |
| **Avantajlar** | Sıfır API maliyeti; internet bağlantısı gerektirmez; GDPR/KVKK uyumu kolay |
| **Dezavantajlar** | Düşük kalite görselde zayıf; el yazısı yok; büyük bundle size (~20MB dil dosyası); yavaş (client CPU) |

**Web entegrasyonu:**
```javascript
import Tesseract from 'tesseract.js';

const ocrDocument = async (imageFile) => {
  const { data: { text, confidence } } = await Tesseract.recognize(
    imageFile,
    'tur+eng', // Türkçe + İngilizce
    { logger: m => console.log(m) }
  );
  return { text, confidence };
};
```

---

#### 🍎 Apple Vision Framework (iOS Native)

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐⭐ On-device, iOS 16+ ile Latin script mükemmel; Türkçe tam destekli |
| **Fiyatlandırma** | ÜCRETSİZ (iOS framework) |
| **Firebase Entegrasyonu** | ⭐⭐ Native Swift/ObjC kod; React Native bridge gerekir |
| **Entegrasyon Zorluğu** | Yüksek — native iOS modülü yazımı gerekir |
| **Öne Çıkan Özellikler** | On-device; privacy-first; hızlı; belge tarama + perspektif düzeltme |
| **Avantajlar** | Sıfır maliyet; internet yok; gizlilik; hızlı response |
| **Dezavantajlar** | Sadece iOS; React Native bridge karmaşıklığı; Android'de çalışmaz |

**React Native bridge (hızlı çözüm):** `react-native-vision-camera` + `VisionCamera Frame Processors`

---

#### 🔶 ML Kit (Firebase) — Text Recognition v2

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐ Latin script on-device; Türkçe karakterler desteklenir |
| **Fiyatlandırma** | On-device: ÜCRETSİZ; Cloud API: Firebase Blaze planı ($0/1K on-device) |
| **Firebase Entegrasyonu** | ⭐⭐⭐⭐⭐ Native Firebase SDK entegrasyonu |
| **Entegrasyon Zorluğu** | Düşük — `@react-native-ml-kit/text-recognition` paketi mevcut |
| **Öne Çıkan Özellikler** | On-device veya cloud; Latin/Çince/Japonca/Korece/Devanagari |
| **Avantajlar** | Firebase native; ücretsiz on-device; React Native paketi hazır; offline çalışır |
| **Dezavantajlar** | Doküman anlama yok (sadece metin çıkarma); yapısal analiz sınırlı |

**React Native entegrasyonu:**
```bash
npm install @react-native-ml-kit/text-recognition
```

```javascript
import TextRecognition from '@react-native-ml-kit/text-recognition';

const scanDocument = async (imagePath) => {
  const result = await TextRecognition.recognize(imagePath);
  return result.text; // Türkçe metin dahil
};
```

---

#### 🏢 ABBYY Cloud OCR SDK

| Özellik | Detay |
|---------|-------|
| **Türkçe Doğruluk** | ⭐⭐⭐⭐⭐ Kurumsal kalite; Türkçe özel optimizasyon |
| **Fiyatlandırma** | Enterprise fiyatlandırma (teklif bazlı); yaklaşık $200+/ay başlangıç |
| **Firebase Entegrasyonu** | ⭐⭐ REST API; Cloud Functions proxy |
| **Entegrasyon Zorluğu** | Orta-Yüksek — lisanslama ve kurulum |
| **Öne Çıkan Özellikler** | En yüksek doğruluk; form recognition; çok dilli |
| **Avantajlar** | Endüstri standardı doğruluk; kurumsal destek |
| **Dezavantajlar** | Pahalı; KOBİ SaaS için aşırı donanımlı; Firebase uyumu iyi değil |

---

### 1.2 OCR Karşılaştırma Özeti

| Çözüm | Türkçe Doğruluk | Fiyat (1K belge) | Firebase Uyumu | Öneri |
|-------|----------------|-----------------|----------------|-------|
| **Google Vision API** | ⭐⭐⭐⭐⭐ | ~$1.50 | ⭐⭐⭐⭐⭐ | ✅ **Ana OCR çözümü** |
| **Azure Doc Intelligence** | ⭐⭐⭐⭐⭐ | ~$10 (prebuilt) | ⭐⭐⭐ | ✅ **Kimlik/fatura için** |
| **ML Kit (Firebase)** | ⭐⭐⭐⭐ | ÜCRETSİZ | ⭐⭐⭐⭐⭐ | ✅ **Mobil ön tarama** |
| AWS Textract | ⭐⭐⭐⭐ | ~$25-50 | ⭐⭐ | ❌ Ekosistem uyumsuz |
| Tesseract.js | ⭐⭐⭐ | ÜCRETSİZ | ⭐⭐⭐⭐ | ⚠️ Düşük kalite fallback |
| Apple Vision | ⭐⭐⭐⭐⭐ | ÜCRETSİZ | ⭐⭐ | ⚠️ Sadece iOS |
| ABBYY | ⭐⭐⭐⭐⭐ | $$$$ | ⭐⭐ | ❌ KOBİ için overkill |

**Önerilen Hibrit Strateji:**
1. **Mobil ilk tarama:** ML Kit (ücretsiz, hızlı, on-device)
2. **Yüksek doğruluk OCR:** Google Cloud Vision API
3. **Kimlik & Fatura parsing:** Azure Document Intelligence prebuilt modeller
4. **iOS yedek:** Apple Vision Framework

---

## 2. AI Chatbot / Asistan Çözümleri

### 2.1 Model Karşılaştırması

#### OpenAI API (GPT-5.4)

| Özellik | Detay |
|---------|-------|
| **Türkçe Kalitesi** | ⭐⭐⭐⭐⭐ Mükemmel; doğal Türkçe; teknik terminoloji iyi |
| **Fiyatlandırma** | GPT-5.4: $2.50/1M input, $15/1M output; GPT-5.4 mini: $0.75/1M input, $4.50/1M output |
| **Rate Limits** | Tier'a göre değişir; 3 RPM (ücretsiz) → 10K RPM (Tier 5) |
| **Avantajlar** | En güçlü; geniş context window; vision capability; function calling |
| **Dezavantajlar** | En pahalı; OpenAI bağımlılığı; veri gizliliği politikaları |

**GPT-5.4 nano** ($0.20/1M input, $1.25/1M output) chatbot için ideal maliyet/performans dengesi.

---

#### Anthropic Claude API

| Özellik | Detay |
|---------|-------|
| **Türkçe Kalitesi** | ⭐⭐⭐⭐⭐ GPT ile eşdeğer; uzun doküman anlama üstün |
| **Fiyatlandırma** | Claude Sonnet 4: ~$3/1M input, ~$15/1M output; Haiku 3.5: ~$0.80/1M input, ~$4/1M output |
| **Avantajlar** | Uzun context (200K token); doküman analizi güçlü; güvenli çıktı |
| **Dezavantajlar** | Function calling daha kısıtlı; Firebase native değil |

**Sözleşme özetleme ve belge analizi için Claude Sonnet 4 idealdir.**

---

#### Google Gemini API (Vertex AI)

| Özellik | Detay |
|---------|-------|
| **Türkçe Kalitesi** | ⭐⭐⭐⭐ İyi; GPT'ye yakın; multimodal güçlü |
| **Fiyatlandırma** | Gemini 3 Flash: $0.50/1M input, $3/1M output; Gemini 3 Pro: $2/1M input, $12/1M output |
| **Firebase Entegrasyonu** | ⭐⭐⭐⭐⭐ Vertex AI + Firebase Admin SDK; aynı GCP projesi |
| **Avantajlar** | Firebase native; multimodal (görsel + metin); Google Search grounding |
| **Dezavantajlar** | Türkçe'de zaman zaman İngilizce'ye kayma; Vertex AI kurulumu gerekir |

---

#### Firebase Genkit

| Özellik | Detay |
|---------|-------|
| **Ne Yapar?** | Google'ın AI uygulama framework'ü — model-agnostic orchestration |
| **Desteklenen Modeller** | GoogleAI, OpenAI, Claude, Ollama (tek SDK ile) |
| **Firebase Entegrasyonu** | ⭐⭐⭐⭐⭐ Firebase Cloud Functions ile native deploy |
| **Özellikler** | RAG, tool use, agent patterns, local debug UI, flow orchestration |
| **Avantajlar** | Model bağımsız; Firebase Functions'ta doğrudan çalışır; üretim hazır |

**FirmaCom için Genkit kritik seçim — hem Gemini hem OpenAI'ı tek framework altında yönetir.**

---

#### Vercel AI SDK

| Özellik | Detay |
|---------|-------|
| **Firebase Uyumu** | ⭐⭐ Firebase Functions değil, Next.js/Edge Functions odaklı |
| **React Entegrasyonu** | ⭐⭐⭐⭐⭐ `useChat`, `useCompletion` hook'ları mükemmel |
| **Öneri** | FirmaCom web (React/Vite) için UI katmanında kullanılabilir; backend Firebase |

---

#### Açık Kaynak: Llama / Mistral

| Özellik | Detay |
|---------|-------|
| **Türkçe Kalitesi** | ⭐⭐⭐ Llama 3.1 / Mistral Medium; GPT'nin %70-80'i |
| **Self-hosted Maliyet** | GPU sunucu: ~$500-2000/ay (Llama 70B için) |
| **API (together.ai, groq)** | Llama 3.3: ~$0.60/1M input via Groq; ultra-hızlı inference |
| **Avantajlar** | Veri gizliliği maksimum; uzun vadede maliyet avantajı |
| **Dezavantajlar** | Türkçe finans terminolojisi zayıf; operasyon karmaşıklığı yüksek |

**Öneri:** MVP aşamasında OpenAI/Gemini; hacim büyüdükçe açık kaynak değerlendirilebilir.

---

### 2.2 AI Model Karşılaştırma Özeti

| Model | Türkçe | Fiyat (ucuz tier) | Firebase | FirmaCom Kullanım |
|-------|--------|------------------|----------|-------------------|
| **GPT-5.4 mini/nano** | ⭐⭐⭐⭐⭐ | $0.20-0.75/1M | ⭐⭐⭐ | Chatbot, form yardımı |
| **Gemini 3 Flash** | ⭐⭐⭐⭐ | $0.50/1M | ⭐⭐⭐⭐⭐ | **Ana model (Firebase native)** |
| **Claude Haiku 3.5** | ⭐⭐⭐⭐⭐ | $0.80/1M | ⭐⭐⭐ | Doküman özetleme |
| Llama 3 (Groq API) | ⭐⭐⭐ | $0.06/1M | ⭐⭐ | Maliyet optimizasyonu |
| Mistral | ⭐⭐⭐ | $0.25/1M | ⭐⭐ | Alternatif |

**Önerilen:** Firebase Genkit + Gemini Flash (ana chatbot) + GPT-5.4 mini (karmaşık görevler)

---

## 3. FirmaCom'a Özel Kullanım Senaryoları

### 3.1 OCR Senaryoları

#### 🪪 Senaryo 1: Kimlik/Pasaport Tarama → Otomatik Form Doldurma

**Kullanıcı Akışı:**
1. Kullanıcı kayıt formunda "Kimlik Tara" butonuna basar
2. Kamera açılır (mevcut `react-native-document-scanner-plugin` kullanılır)
3. Kimlik fotoğrafı çekilir, önizleme gösterilir
4. "Onayla" → görsel Firebase Storage'a yüklenir
5. Cloud Function tetiklenir → Azure prebuilt-idDocument modeli çalışır
6. Ad, soyad, TC No, doğum tarihi otomatik doldurulur
7. Kullanıcı verileri kontrol edip devam eder

**Teknik Mimari:**
```
[RN Kamera] → [Firebase Storage] → [Cloud Function: analyzeID]
                                        ↓
                              [Azure Doc Intelligence]
                              prebuilt-idDocument
                                        ↓
                              [Firestore: /users/{uid}/profile]
                                        ↓
                              [RN: form auto-fill]
```

**MVP Kapsamı:**
- TC Kimlik kartı (ön yüz)
- Ad, soyad, TC No, doğum tarihi çıkarma
- Sonuçları Firestore'a kaydetme

**Kod Örneği (Cloud Function):**
```javascript
const { DocumentAnalysisClient } = require('@azure/ai-form-recognizer');

exports.analyzeIDDocument = functions.storage.object().onFinalize(async (object) => {
  if (!object.name.startsWith('ocr/id/')) return;
  
  const client = new DocumentAnalysisClient(
    process.env.AZURE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_KEY)
  );
  
  // Storage URL al
  const imageUrl = `https://storage.googleapis.com/${object.bucket}/${object.name}`;
  
  const poller = await client.beginAnalyzeDocumentFromUrl('prebuilt-idDocument', imageUrl);
  const { documents } = await poller.pollUntilDone();
  
  if (documents?.[0]) {
    const fields = documents[0].fields;
    const uid = object.name.split('/')[2]; // ocr/id/{uid}/filename
    
    await admin.firestore().doc(`users/${uid}/profile/kyc`).set({
      firstName: fields.FirstName?.value,
      lastName: fields.LastName?.value,
      documentNumber: fields.DocumentNumber?.value,
      dateOfBirth: fields.DateOfBirth?.value,
      ocrConfidence: documents[0].confidence,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }
});
```

---

#### 📄 Senaryo 2: Vergi Levhası Tarama → Şirket Bilgileri Çıkarma

**Kullanıcı Akışı:**
1. "Şirket Ekle" akışında "Vergi Levhası Tara" butonu
2. Kamera/dosya yükleme → Storage'a gider
3. Cloud Function: Google Vision API (Document Text Detection) çalışır
4. Metin çıktısı Gemini API'ye gönderilir: *"Bu metinden VKN, şirket adı, vergi dairesi ve adres bilgilerini JSON olarak çıkar"*
5. Yapılandırılmış veri forma doldurulur

**Teknik Mimari:**
```
[Kamera/Dosya] → [Storage] → [Vision API: text extract]
                                    ↓
                          [Gemini Flash: structured parse]
                          Prompt: "Extract VKN, company name, 
                                   tax office, address as JSON"
                                    ↓
                          [Firestore: /companies/{id}]
```

**Gemini Prompt Şablonu:**
```javascript
const prompt = `
Aşağıdaki vergi levhası metninden şu bilgileri JSON formatında çıkar:
- vkn: Vergi Kimlik Numarası (10 haneli)
- sirketAdi: Şirket/Ticaret Unvanı
- vergiDairesi: Vergi Dairesi adı
- adres: Tam adres
- faaliyetKodu: Faaliyet kodu (varsa)

Metin:
${extractedText}

Sadece JSON döndür, başka açıklama ekleme.
`;
```

---

#### 🧾 Senaryo 3: Fatura Tarama → Fatura Verilerini Otomatik Okuma

**Kullanıcı Akışı:**
1. Belge Yönetimi modülünde "Fatura Yükle"
2. PDF/görsel yükleme
3. Azure prebuilt-invoice modeli çalışır
4. Fatura no, tarih, tutar, KDV, tedarikçi bilgileri otomatik doldurulur
5. Onaylanan veriler muhasebe modülüne işlenir

**Azure Invoice Model Çıktıları:**
```json
{
  "VendorName": "ABC Teknoloji A.Ş.",
  "InvoiceId": "INV-2025-001",
  "InvoiceDate": "2025-01-15",
  "DueDate": "2025-02-15",
  "SubTotal": 10000,
  "TaxDetails": [{"Amount": 1800, "Rate": 0.18}],
  "AmountDue": 11800,
  "Items": [
    {"Description": "Yazılım Lisansı", "Quantity": 1, "UnitPrice": 10000}
  ]
}
```

---

#### 📑 Senaryo 4: Belge Sınıflandırma

**Amaç:** Yüklenen belgenin türünü otomatik tespit et

**Mimari:**
```
[Yüklenen Belge] → [Gemini Flash multimodal]
                    Prompt: "Bu belge hangi türde? 
                    Seçenekler: fatura, sözleşme, kimlik, 
                    vergi_levhası, makbuz, diğer"
                         ↓
                   [Otomatik klasörleme + etiketleme]
```

**Firestore Şeması:**
```javascript
// /documents/{docId}
{
  type: 'invoice',          // sınıflandırma sonucu
  confidence: 0.97,
  extractedData: { ... },   // OCR verisi
  storageRef: 'docs/...',
  status: 'processed',
  createdAt: timestamp,
  userId: 'uid',
  companyId: 'cid'
}
```

---

### 3.2 AI Asistan Senaryoları

#### 💬 Senaryo 5: Akıllı Form Doldurma Yardımcısı

**Kullanım:** "Hangi POS tipini seçmeliyim?"

**Sistem Prompt:**
```
Sen FirmaCom'un akıllı asistanısın. Türkiye'deki KOBİ'lerin kurumsal 
hizmet taleplerinde yardım ediyorsun. Mevcut modüller: Hat, POS, HGS, 
Banka Hesabı, KEP, Sigorta, Bulut, Web Sitesi.

Kullanıcının sektörünü ve ihtiyacını analiz et. Kısa, net öneriler ver.
Türkçe yanıt ver.
```

**Chatbot Akışı:**
```javascript
// Firebase Genkit flow
const posAdvisor = defineFlow({ name: 'posAdvisor' }, async (userMessage) => {
  const response = await generate({
    model: gemini15Flash,
    system: FIRMACOM_SYSTEM_PROMPT,
    messages: conversationHistory,
    prompt: userMessage,
    output: { schema: z.object({ 
      recommendation: z.string(), 
      module: z.string(),
      nextSteps: z.array(z.string())
    })}
  });
  return response.output;
});
```

---

#### 📋 Senaryo 6: Doküman Özetleme

**Kullanım:** Uzun sözleşmeleri özetleme (Sözleşme Yönetimi modülü)

```javascript
// Claude Sonnet 4 ile uzun doküman özetleme
const summarizeContract = async (contractText) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Aşağıdaki sözleşmeyi Türkçe olarak özetle:
      1. Taraflar
      2. Konu ve kapsam  
      3. Önemli yükümlülükler
      4. Süre ve fesih koşulları
      5. Dikkat edilmesi gereken maddeler (riskler)
      
      Sözleşme:
      ${contractText}`
    }]
  });
  return response.content[0].text;
};
```

---

#### 🤖 Senaryo 7: Chatbot (SSS + Yönlendirme)

**Mimari:**
```
[Kullanıcı mesajı] → [Intent detection: Gemini Flash]
                           ↓
              ┌────────────┴───────────────┐
              ↓                            ↓
       [Bilinen SSS]              [Özel soru]
    Firestore'dan yanıt      Gemini Flash + sistem bilgisi
              ↓                            ↓
         [Yanıt + yönlendirme butonu]
```

**Konuşma geçmişi Firestore'da:**
```javascript
// /chats/{userId}/messages/{msgId}
{
  role: 'user' | 'assistant',
  content: string,
  timestamp: Timestamp,
  intent: 'pos_inquiry' | 'document_help' | 'general',
  moduleRef: 'POS' | 'HAT' | null
}
```

---

#### 📊 Senaryo 8: Tahmine Dayalı İhtiyaç Analizi

**Kullanım:** "Bu sektördeki KOBİ'ler genellikle şu hizmetleri alıyor"

```javascript
const predictNeeds = async (companyProfile) => {
  const prompt = `
  Şirket Profili:
  - Sektör: ${companyProfile.sector}
  - Çalışan sayısı: ${companyProfile.employeeCount}
  - Mevcut hizmetler: ${companyProfile.currentServices.join(', ')}
  
  Bu profile sahip Türkiye'deki KOBİ'lerin genellikle ihtiyaç duyduğu 
  ama henüz almadığı kurumsal hizmetleri öner. FirmaCom'un modülleri: 
  Hat, POS, HGS, Banka Hesabı, KEP, Sigorta, Bulut, Web Sitesi.
  
  JSON formatında dön: { recommendations: [{service, reason, priority}] }
  `;
  
  // Gemini Flash ile hızlı analiz
  return await gemini.generateJSON(prompt);
};
```

---

### 3.3 Gelişmiş AI Senaryoları

#### 🔍 Senaryo 9: Belge Karşılaştırma

**Kullanım:** İki sözleşme versiyonu arasındaki farkları bul

```javascript
const compareContracts = async (contract1Text, contract2Text) => {
  // Claude Sonnet 4 — 200K context window ile iki belgeyi karşılaştır
  const prompt = `
  Aşağıdaki iki sözleşme arasındaki önemli farkları analiz et:
  
  [SÖZLEŞME 1]:
  ${contract1Text}
  
  [SÖZLEŞME 2]:
  ${contract2Text}
  
  Farkları şu kategorilerde listele:
  - Eklenen maddeler
  - Silinen maddeler  
  - Değiştirilen koşullar
  - Risk değişiklikleri
  `;
};
```

#### ⚠️ Senaryo 10: Risk Skoru (Başvuru Değerlendirme)

```javascript
// Başvuru risk skoru hesaplama
const calculateRiskScore = async (applicationData) => {
  const features = {
    companyAge: applicationData.kurulusYili,
    sector: applicationData.sektor,
    requestedServices: applicationData.talepler,
    documentCompleteness: applicationData.belgeTamamlama,
    previousApplications: applicationData.oncekiBasvurular
  };
  
  // Gemini ile kural tabanlı + AI risk analizi
  const riskAnalysis = await gemini.generate({
    prompt: `Bu başvuruyu değerlendir ve 0-100 arası risk skoru ver...`,
    output: { schema: RiskScoreSchema }
  });
  
  return riskAnalysis;
};
```

---

## 4. Teknik Mimari

### 4.1 Genel Mimari Şeması

```
┌─────────────────────────────────────────────────────┐
│                  FirmaCom Clients                    │
│                                                      │
│   ┌──────────────────┐    ┌───────────────────────┐ │
│   │  React Native    │    │    React/Vite Web      │ │
│   │  (iOS + Android) │    │                        │ │
│   │                  │    │  - File upload         │ │
│   │  - Camera OCR    │    │  - AI Chat UI          │ │
│   │  - ML Kit        │    │  - Document viewer     │ │
│   │  - AI Chat       │    │                        │ │
│   └────────┬─────────┘    └──────────┬────────────┘ │
└────────────┼──────────────────────────┼──────────────┘
             │                          │
             ▼                          ▼
┌─────────────────────────────────────────────────────┐
│              Firebase Services                       │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Firestore  │  │   Storage    │  │    Auth    │ │
│  │             │  │              │  │            │ │
│  │  - users    │  │  - ocr/      │  │  - UID     │ │
│  │  - companies│  │  - docs/     │  │  - claims  │ │
│  │  - documents│  │  - contracts/│  │            │ │
│  │  - chats    │  │              │  │            │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────┘ │
│         │                │                          │
│         ▼                ▼                          │
│  ┌────────────────────────────────────────────────┐ │
│  │           Cloud Functions (AI Pipeline)         │ │
│  │                                                 │ │
│  │  ┌─────────────┐  ┌──────────────────────────┐ │ │
│  │  │  OCR Flow   │  │      AI Chat Flow         │ │ │
│  │  │             │  │                           │ │ │
│  │  │ 1. Vision   │  │  Firebase Genkit          │ │ │
│  │  │    API      │  │  + Gemini Flash           │ │ │
│  │  │ 2. Azure    │  │  + GPT-5.4 mini          │ │ │
│  │  │    DocInt   │  │  + Claude (summaries)     │ │ │
│  │  │ 3. Gemini   │  │                           │ │ │
│  │  │    parse    │  │                           │ │ │
│  │  └─────────────┘  └──────────────────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
             │                    │
             ▼                    ▼
   ┌──────────────────┐  ┌───────────────────┐
   │ Google Cloud     │  │  Azure/OpenAI     │
   │ Vision API       │  │  - Doc Intelligence│
   │                  │  │  - OpenAI API     │
   └──────────────────┘  └───────────────────┘
```

### 4.2 Firebase Cloud Functions AI Pipeline

```javascript
// functions/src/ai/pipeline.js
const { onObjectFinalized } = require('firebase-functions/v2/storage');
const { onCall } = require('firebase-functions/v2/https');
const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/googleai');

const ai = genkit({ plugins: [googleAI()] });

// OCR Pipeline — Storage tetikleyici
exports.processDocument = onObjectFinalized({
  bucket: 'firmacom-prod.appspot.com',
  memory: '1GiB',
  timeoutSeconds: 300,
}, async (event) => {
  const { name, contentType } = event.data;
  
  // Belge türüne göre işlem
  if (name.startsWith('ocr/id/')) {
    await processIDDocument(name);
  } else if (name.startsWith('ocr/invoice/')) {
    await processInvoice(name);
  } else if (name.startsWith('ocr/tax/')) {
    await processTaxDocument(name);
  }
});

// AI Chat — HTTPS callable
exports.aiChat = onCall({
  memory: '512MiB',
  maxInstances: 10,
}, async (request) => {
  const { message, history, context } = request.data;
  const uid = request.auth.uid;
  
  const response = await ai.generate({
    model: 'googleai/gemini-flash-2.0',
    system: FIRMACOM_SYSTEM_PROMPT,
    messages: [...history, { role: 'user', content: message }],
    config: { temperature: 0.3, maxOutputTokens: 500 }
  });
  
  // Konuşma geçmişini kaydet
  await saveConversation(uid, message, response.text);
  
  return { response: response.text };
});
```

### 4.3 React Native OCR Akışı

```javascript
// Mevcut react-native-document-scanner-plugin entegrasyonu
import DocumentScanner from 'react-native-document-scanner-plugin';
import storage from '@react-native-firebase/storage';
import functions from '@react-native-firebase/functions';

const scanAndProcessDocument = async (documentType) => {
  // 1. Belge tara (mevcut plugin)
  const { scannedImages } = await DocumentScanner.scanDocument({
    croppedImageQuality: 85,
    maxNumDocuments: 1,
  });
  
  if (!scannedImages?.length) return;
  
  // 2. ML Kit ile ön kontrol (ücretsiz, hızlı)
  const mlKitText = await TextRecognition.recognize(scannedImages[0]);
  if (mlKitText.text.length < 20) {
    Alert.alert('Lütfen daha net bir görüntü çekin');
    return;
  }
  
  // 3. Firebase Storage'a yükle
  const ref = storage().ref(`ocr/${documentType}/${auth().currentUser.uid}/${Date.now()}.jpg`);
  await ref.putFile(scannedImages[0]);
  
  // 4. Cloud Function tetikleyici otomatik çalışır
  // Sonuç için Firestore dinleyici
  const unsubscribe = firestore()
    .doc(`users/${auth().currentUser.uid}/ocr/${documentType}`)
    .onSnapshot((doc) => {
      if (doc.data()?.status === 'completed') {
        unsubscribe();
        onComplete(doc.data().extractedData);
      }
    });
};
```

### 4.4 Firestore Veri Şeması

```
firestore/
├── users/{uid}/
│   ├── profile/
│   │   ├── kyc {firstName, lastName, tcNo, dob, ocrConfidence}
│   │   └── company {vkn, companyName, taxOffice, address}
│   └── ocr/{docType} {status, extractedData, storageRef, processedAt}
│
├── companies/{companyId}/
│   ├── info {name, vkn, sector, ...}
│   ├── documents/{docId} {type, status, extractedData, storageRef}
│   └── contracts/{contractId} {summary, riskScore, parties, ...}
│
├── chats/{chatId}/
│   ├── info {userId, companyId, createdAt, topic}
│   └── messages/{msgId} {role, content, timestamp, intent}
│
└── ai_results/{resultId}/
    ├── type: 'ocr' | 'summary' | 'classification'
    ├── input: {storageRef, text}
    ├── output: {structured data}
    ├── model: 'vision-api' | 'azure-doc-int' | 'gemini-flash'
    ├── confidence: number
    └── cost_estimate: number (USD)
```

### 4.5 Maliyet Optimizasyonu: On-Device vs Cloud

```
Karar Ağacı:
                    [Belge Geldi]
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
     [Mobil uygulama]         [Web uygulaması]
              │                     │
    [ML Kit on-device]      [Direkt Cloud Vision]
    (ücretsiz, hızlı)              │
              │                     │
    [Metin uzunluğu > 50 char?] ───┘
         │           │
        Evet         Hayır
         │           │
    [Cloud API]  [Kullanıcıyı
    Vision/Azure  yeniden çektir]
```

---

## 5. MVP Planı (4 Hafta)

### Hafta 1-2: OCR Temeli

#### Teknik Hazırlık (Gün 1-3)
```bash
# Firebase Functions kurulum
cd functions
npm install @google-cloud/vision @azure/ai-form-recognizer @genkit-ai/googleai

# Environment variables (.env)
GOOGLE_CLOUD_PROJECT=firmacom-prod
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://firmacom.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=xxx
OPENAI_API_KEY=sk-xxx
GEMINI_API_KEY=xxx
```

#### Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ocr/{docType}/{userId}/{filename} {
      allow write: if request.auth.uid == userId 
                   && request.resource.size < 10 * 1024 * 1024  // 10MB
                   && request.resource.contentType.matches('image/.*|application/pdf');
      allow read: if request.auth.uid == userId;
    }
  }
}
```

#### Hafta 1 Deliverable'ları:
- [ ] Cloud Functions: `processIDDocument` (Azure prebuilt-idDocument)
- [ ] Cloud Functions: `processTaxDocument` (Vision API + Gemini parse)
- [ ] React Native: Mevcut scanner plugin → Storage upload akışı
- [ ] Firestore: OCR sonuç şeması + gerçek zamanlı dinleyici
- [ ] ML Kit entegrasyonu (ön kalite kontrolü)

#### Hafta 2 Deliverable'ları:
- [ ] Form auto-fill UI (kimlik tarama → kayıt formu)
- [ ] Vergi levhası → şirket bilgileri akışı
- [ ] Error handling (düşük kalite görüntü, timeout)
- [ ] Belge sınıflandırma (Gemini Flash multimodal)
- [ ] OCR sonuç güven skoru gösterimi

---

### Hafta 3-4: AI Chatbot

#### Hafta 3 Deliverable'ları:
- [ ] Firebase Genkit kurulum + Gemini Flash entegrasyonu
- [ ] Sistem prompt FirmaCom'a özel yazımı
- [ ] `aiChat` Cloud Function (callable)
- [ ] Konuşma geçmişi Firestore'da saklama
- [ ] React Native: Chat UI component

#### Hafta 4 Deliverable'ları:
- [ ] Web: Chat widget (React/Vite)
- [ ] POS/Hat modülü form yardımcısı
- [ ] Sözleşme özetleme (Claude entegrasyonu)
- [ ] Test + fine-tuning (Türkçe yanıt kalitesi)
- [ ] Rate limiting + cost monitoring

---

### MVP Teknik Gereksinimler

**API Key'ler:**
| Servis | Nerede Alınır | Süre |
|--------|--------------|------|
| Google Cloud Vision | console.cloud.google.com | 1 saat |
| Azure Document Intelligence | portal.azure.com | 2 saat |
| OpenAI API | platform.openai.com | 30 dakika |
| Gemini API | aistudio.google.com | 30 dakika |

**Firebase Functions Kurulum:**
```bash
firebase functions:config:set \
  azure.endpoint="https://xxx.cognitiveservices.azure.com/" \
  azure.key="xxx" \
  openai.key="sk-xxx" \
  gemini.key="xxx"
```

**React Native Paketler:**
```bash
npm install @react-native-ml-kit/text-recognition
npm install @react-native-firebase/storage
npm install @react-native-firebase/functions
# react-native-document-scanner-plugin zaten mevcut ✓
```

---

## 6. Maliyet Analizi

### 6.1 Aylık Maliyet Senaryoları

**Varsayımlar:**
- Ortalama kullanıcı/ay: 3 belge tarar, 10 AI chat mesajı gönderir
- OCR: %60 kimlik/vergi, %40 fatura
- AI Chat: ortalama 500 token input + 300 token output

#### 100 Aktif Kullanıcı / Ay

| Servis | Kullanım | Maliyet |
|--------|---------|---------|
| ML Kit OCR (on-device) | 300 tarama | **$0** |
| Google Vision API | 180 belge (cloud) | **$0** (ücretsiz tier) |
| Azure Doc Intelligence | 120 prebuilt (kimlik+fatura) | **$0** (500/ay ücretsiz) |
| Gemini Flash (chat) | 1.000 mesaj × 800 token | **~$0.40** |
| Firebase Storage | ~500MB | **~$0.05** |
| **TOPLAM** | | **~$0.45/ay** |

#### 1.000 Aktif Kullanıcı / Ay

| Servis | Kullanım | Maliyet |
|--------|---------|---------|
| ML Kit OCR (on-device) | 3.000 tarama | **$0** |
| Google Vision API | 1.800 belge | **~$1.20** (ilk 1K ücretsiz) |
| Azure Doc Intelligence | 1.200 prebuilt | **~$12.00** (~$10/1K) |
| Gemini Flash (chat) | 10.000 mesaj | **~$4.00** |
| Firebase Storage | ~5GB | **~$0.75** |
| **TOPLAM** | | **~$18/ay** |

#### 10.000 Aktif Kullanıcı / Ay

| Servis | Kullanım | Maliyet |
|--------|---------|---------|
| ML Kit OCR (on-device) | 30.000 tarama | **$0** |
| Google Vision API | 18.000 belge | **~$27.00** |
| Azure Doc Intelligence | 12.000 prebuilt | **~$120.00** |
| Gemini Flash (chat) | 100.000 mesaj | **~$40.00** |
| GPT-5.4 mini (karmaşık) | 10.000 mesaj | **~$15.00** |
| Firebase Storage | ~50GB | **~$7.50** |
| Firebase Functions | ~500K invocations | **~$5.00** |
| **TOPLAM** | | **~$215/ay** |

### 6.2 Optimizasyon Stratejileri

**Maliyet Düşürme:**

1. **On-device önce:** ML Kit ile ücretsiz ön tarama → sadece gerektiğinde cloud
2. **Caching:** Aynı belge tekrar işlenmesin (MD5 hash kontrolü)
3. **Batch processing:** Anlık değil, toplu işleme (Azure batch: %50 indirim)
4. **Model seçimi:** Basit chatbot → Gemini Flash; karmaşık analiz → GPT/Claude
5. **Token optimizasyonu:** Sistem prompt'u kısa tut; conversation history sınırla

```javascript
// Maliyet takip sistemi
const trackAICost = async (model, inputTokens, outputTokens, operation) => {
  const costs = {
    'gemini-flash': { input: 0.0000005, output: 0.000003 },
    'gpt-4o-mini': { input: 0.00000075, output: 0.0000045 },
    'vision-api': { per1k: 0.0015 },
  };
  
  const cost = model === 'vision-api' 
    ? costs[model].per1k / 1000
    : (inputTokens * costs[model].input + outputTokens * costs[model].output);
  
  await firestore().collection('ai_costs').add({
    model, inputTokens, outputTokens, operation,
    costUSD: cost,
    timestamp: FieldValue.serverTimestamp()
  });
};
```

### 6.3 Ücretsiz Tier Özeti

| Servis | Ücretsiz Limit |
|--------|---------------|
| Google Cloud Vision | 1.000 istek/ay |
| Azure Document Intelligence | 500 sayfa/ay |
| ML Kit (Firebase) | Sınırsız (on-device) |
| Gemini API (aistudio) | 15 RPM, 1M token/gün |
| OpenAI | $5 kredi (yeni hesap) |
| Firebase Storage | 5GB |
| Firebase Functions | 2M invocation/ay |

---

## 7. Önerilen Stack

### Nihai Teknoloji Kararları

```
OCR:
├── Mobil: ML Kit Text Recognition v2 (ücretsiz, on-device)
├── Kimlik/Pasaport: Azure Document Intelligence prebuilt-idDocument
├── Fatura: Azure Document Intelligence prebuilt-invoice
├── Vergi Levhası: Google Cloud Vision + Gemini Flash parse
└── Belge Sınıflandırma: Gemini Flash multimodal

AI Chatbot:
├── Framework: Firebase Genkit (model-agnostic)
├── Ana Model: Gemini 3 Flash (Firebase native, ucuz)
├── Karmaşık Görevler: GPT-5.4 mini (form analizi)
├── Doküman Özetleme: Claude Haiku 3.5 (uzun context)
└── UI: Vercel AI SDK useChat hook (web için)

Altyapı:
├── Backend: Firebase Cloud Functions v2 (Node.js)
├── Storage: Firebase Storage (belge depolama)
├── DB: Firestore (sonuçlar, chat geçmişi)
└── Monitoring: Firebase Performance + custom cost tracker
```

### Başlangıç İçin Acil Aksiyonlar

1. **Bugün:** Google Cloud Vision API'yi aktif et (aynı GCP projesi — 1 tık)
2. **Bu hafta:** Azure Free tier hesabı aç (500 sayfa/ay ücretsiz)
3. **Bu hafta:** Firebase Genkit + Gemini Flash kurulumu
4. **Hafta 2:** ML Kit React Native paketi entegrasyonu
5. **Hafta 3:** İlk OCR flow canlıya al (kimlik tarama)

### Güvenlik Notları

- API key'ler **asla** client-side'a gönderilmez — tüm AI çağrıları Cloud Functions üzerinden
- OCR edilen kimlik verileri **şifreli** Firestore'da saklanır
- KVKK uyumu için OCR sonrası görsel 24 saatte silinir
- Storage'da sadece işlenmiş metadata tutulur, ham belge opsiyonel

---

*Doküman güncel fiyatlarla oluşturulmuştur (Mart 2026). API fiyatlandırmaları değişkendir; üretim öncesi güncel listeye bakınız.*
