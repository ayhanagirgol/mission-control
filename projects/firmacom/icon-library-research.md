# FirmaCom — İkon Kütüphanesi Araştırması

_Tarih: 2026-03-31 | Hazırlayan: Güneş_

---

## Özet Karşılaştırma Tablosu

| Kütüphane | İkon Sayısı | Teknik | Expo Uyumu | Lisans | Aktiflik | Finhouse Paleti |
|-----------|-------------|--------|------------|--------|----------|-----------------|
| **Lucide RN** | ~1.400+ | SVG (react-native-svg) | ✅ Mükemmel | MIT | ⭐⭐⭐⭐⭐ | ✅ Tam uyumlu |
| **Phosphor RN** | ~9.000 | SVG (react-native-svg) | ✅ Mükemmel | MIT | ⭐⭐⭐⭐ | ✅ Tam uyumlu |
| **Tabler Icons** | 6.000+ | SVG (react-native-svg) | ✅ İyi | MIT | ⭐⭐⭐⭐⭐ | ✅ Tam uyumlu |
| **MaterialCommunityIcons** | ~7.000 | **Font tabanlı** ⚠️ | ✅ Dahili | MIT | ⭐⭐⭐ | ⚠️ Renk kısıtlı |
| **expo-symbols** | SF Symbols (iOS) | Native | 🟡 Beta | Apple/Google | ⭐⭐⭐ | ⚠️ Platform farkı |

---

## Detaylı Analiz

### 1. 🟢 Lucide React Native
- **Paket:** `lucide-react-native` + `react-native-svg`
- **İkon sayısı:** ~1.400+ (sürekli artıyor)
- **Teknik:** SVG tabanlı — font yükleme sorunu yok
- **Kullanım:**
  ```tsx
  import { Home, FileText, Bell } from 'lucide-react-native';
  <Home color="#29304A" size={24} />
  <FileText color="#D3B679" size={24} />
  ```
- **Stil seçenekleri:** color, size, strokeWidth, fill — hepsi prop
- **Finhouse paleti:** Doğrudan hex renk desteği → lacivert + altın mükemmel uyar
- **GitHub:** https://github.com/lucide-icons/lucide
- **Ön izleme:** https://lucide.dev/icons/
- **Avantaj:** En temiz API, en aktif topluluk, Figma plugin dahil
- **Dezavantaj:** Sadece outline stil (fill yok)

---

### 2. 🟢 Phosphor React Native
- **Paket:** `phosphor-react-native` + `react-native-svg`
- **İkon sayısı:** ~9.000 (6 ağırlık × ~1.500 ikon)
- **Teknik:** SVG tabanlı
- **Kullanım:**
  ```tsx
  import { House, FilePdf, Bell } from 'phosphor-react-native';
  <House color="#29304A" weight="bold" size={24} />
  <Bell color="#D3B679" weight="fill" size={24} />
  ```
- **Stil seçenekleri:** `weight` prop → thin / light / regular / bold / fill / **duotone** ✨
  - Duotone: iki renk katmanlı ikon — lacivert + altın kombinasyonu harika görünür
- **Finhouse paleti:** `duotoneColor="#D3B679"` + ana renk `#29304A` → çok premium görünüm
- **GitHub:** https://github.com/duongdev/phosphor-react-native
- **Ön izleme:** https://phosphoricons.com
- **Avantaj:** En fazla ikon çeşidi, duotone stil, context-based global config
- **Dezavantaj:** Daha büyük bundle (ikon başına SVG), güncel bakımcı kontrolü yapılmalı

---

### 3. 🟡 Tabler Icons
- **Paket:** `@tabler/icons-react-native` + `react-native-svg`
- **İkon sayısı:** 6.000+ (web için, RN paketi daha az içerebilir)
- **Teknik:** SVG tabanlı
- **Kullanım:**
  ```tsx
  import { IconHome, IconFileInvoice, IconBell } from '@tabler/icons-react-native';
  <IconHome color="#29304A" size={24} stroke={2} />
  ```
- **Stil seçenekleri:** color, size, stroke kalınlığı
- **Finhouse paleti:** Tam uyumlu
- **GitHub:** https://github.com/tabler/tabler-icons
- **Ön izleme:** https://tabler.io/icons
- **Avantaj:** Çok geniş kütüphane, iş/finans ikonlarında zengin
- **Dezavantaj:** RN paketi web versiyonuna kıyasla biraz geride kalıyor

---

### 4. 🔴 MaterialCommunityIcons (@expo/vector-icons)
- **Paket:** `@expo/vector-icons` (dahili)
- **Teknik:** **Font tabanlı** — Ionicons ile aynı altyapı ⚠️
- **Sorun:** Mevcut PNG'ye geri dönme sebebi zaten bu ailenin font yükleme sorunuydu
- **Değerlendirme:** ❌ Aynı sorunu tekrar yaşatır — önerilmez

---

### 5. 🟡 expo-symbols (SF Symbols)
- **Paket:** `expo-symbols`
- **Teknik:** Native (iOS: SF Symbols, Android: Material Symbols)
- **Durum:** Beta — breaking changes olabilir
- **Sorun:** iOS ve Android'de farklı ikon görüntülenebilir → tutarsız UI
- **Değerlendirme:** ⚠️ Beta olduğu için production için erken; tutarsızlık riski var

---

## 🎨 Finhouse Renk Paleti Simülasyonu

**Lacivert #29304A + Altın #D3B679 ile Tab Bar Örneği:**

```tsx
// Lucide - Temiz, minimal
<Home color="#29304A" size={24} />           // Aktif değil
<Home color="#D3B679" size={24} />           // Aktif (altın vurgu)

// Phosphor - Duotone ile premium his
<House weight="duotone"
  color="#29304A"
  duotoneColor="#D3B679"
  duotoneOpacity={0.4}
  size={28} />

// Tabler - Stroke kalınlığı ayarlanabilir
<IconHome color="#D3B679" stroke={1.5} size={26} />  // Aktif, ince çizgi → premium
```

---

## 🏆 Güneş'in Önerisi: **Lucide React Native**

**Gerekçe:**

1. **Sıfır font yükleme riski** — Ionicons sorununu tamamen bypass eder, SVG ile çalışır
2. **En aktif topluluk** — LEGO gibi kurumsal şirketler backing yapıyor, düzenli release
3. **Temiz, modern estetik** — Finhouse'un kurumsal görünümüyle birebir uyuşuyor
4. **Minimal API** — `color`, `size`, `strokeWidth` — öğrenmesi ve uygulaması en kolay
5. **Figma entegrasyonu** — Tasarım → kod senkronizasyonu Phosphor/Tabler'dan daha iyi

**Aktif olmayan tab → `color="#29304A"` (lacivert)**
**Aktif tab → `color="#D3B679"` (altın)**

Bu kombinasyon çok güçlü kontrast ve premium his verir.

---

**İkinci tercih:** Phosphor (duotone stil istenir ve premium his öncelikliyse)

**Kurulum:**
```bash
npx expo install lucide-react-native react-native-svg
```

---

*Karar Ayhan'ın onayına sunulacak. Onay sonrası tab bar + yaygın kullanılan ikonlar değiştirilecek.*
