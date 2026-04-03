# FirmaCom Ana Sayfa — Multi-Agent Analiz ve Yeniden Tasarım

> **Tarih:** 29 Mart 2026  
> **Hazırlayan:** 3 Agent Perspektifi (Product Manager, Marketing Specialist, UI Designer)  
> **Kapsam:** Ana sayfa mevcut durum analizi + v2 tasarım önerisi

---

## Mevcut Durum Özeti

| Bileşen | Açıklama | Konum |
|---------|----------|-------|
| Header | "Hoş Geldiniz" + Kullanıcı adı | Üst |
| NewsDetailsScreen | Haber slider (kaydırmalı kartlar) | 1. bölüm |
| OfferScreen | Kampanyalar (indirim kartları) | 2. bölüm |
| ShortcutScreen | Hızlı Geçişler (Banka Hesabı, Hat Talebi, İmza Sirküleri vb.) | 3. bölüm |
| Footer | © 2025 FirmaCom · Finhouse | Alt |

**Renk Paleti:**
- Primary: `#29304A` (koyu lacivert) · Accent: `#D3B679` (altın) · Background: `#FBFBF6` (krem)
- Surface: `#FFFFFF` (beyaz) · Text: `#0D0D0D` (siyah) · Muted: `#7E889B` (gri)

---

# BÖLÜM 1: 🧭 Product Manager Analizi

## 1. Problem Tanımı

### Mevcut ana sayfanın sunduğu değer:
- **Haberler:** Sektörel/yasal güncellemeler konusunda bilgilendirme
- **Kampanyalar:** Fırsatlardan haberdar etme
- **Hızlı Geçişler:** Sık kullanılan işlemlere kolay erişim

### Eksik olan (ve kritik olan):
1. **Durum bilgisi yok.** Kullanıcı uygulamayı açtığında "Belge sürecim ne aşamada?", "Eksik belgem var mı?" sorularının cevabını göremez. Bu, bir KOBİ uygulamasının en temel ihtiyacı.
2. **Kişiselleştirme yok.** Herkes aynı ana sayfayı görüyor — tamamlamış kullanıcıyla yeni başlayanın ekranı aynı.
3. **Aksiyon önceliği belirsiz.** "Şimdi ne yapmalıyım?" sorusuna cevap yok. Kullanıcı menüde kaybolabilir.
4. **Aktivite geçmişi yok.** "Son ne yaptım, ne onaylandı?" görünmüyor.
5. **İlerleme hissi yok.** Belge tamamlama oranı, talep durumu gibi motivasyon unsurları eksik.

**Temel sorun:** Ana sayfa, bir "bilgi panosu" yerine bir "vitrin" gibi tasarlanmış. Oysa KOBİ kullanıcısı vitrine değil, kontrol paneline ihtiyaç duyuyor.

## 2. Kullanıcı Personaları

### Persona A: KOBİ Sahibi — "Mehmet Bey" (Birincil)
- **Yaş:** 35-55
- **Teknik yetkinlik:** Orta-düşük (WhatsApp, bankacılık uygulamaları kullanır)
- **Motivasyon:** "İşlerimi halledeyim, işime geri döneyim"
- **Sabır eşiği:** Düşük — 2-3 tıklamada istediğini bulamazsa bırakır
- **Ana ihtiyaç:** Belge yükleme, talep oluşturma, süreç takibi
- **Sıkıntısı:** Bürokratik süreçler, evrak karmaşası, neyin eksik olduğunu bilmemek

### Persona B: Muhasebeci / Mali Müşavir — "Seda Hanım" (İkincil)
- **Yaş:** 28-45
- **Teknik yetkinlik:** Orta-yüksek
- **Motivasyon:** Müşterilerinin belgelerini toplu yönetmek
- **Sabır eşiği:** Orta — süreç odaklı, detay ister
- **Ana ihtiyaç:** Birden fazla müşterinin belge durumunu görmek, toplu işlem yapmak

### Persona C: Şirket Yöneticisi / İdari Sorumlu — "Ali Bey" (İkincil)
- **Yaş:** 30-50
- **Motivasyon:** Şirket adına belge ve talep süreçlerini yürütmek
- **Ana ihtiyaç:** Hızlı geçişler, durum takibi

**Birincil odak Persona A olmalı** — uygulamanın büyümesi bu segmentten gelecek.

## 3. Jobs-to-be-Done (JTBD)

Kullanıcı ana sayfaya geldiğinde aslında şunu soruyor:

| Öncelik | Job | Mevcut durumda karşılanıyor mu? |
|---------|-----|----------------------------------|
| 🔴 P0 | "Eksik belgem var mı? Sürecim ne durumda?" | ❌ Hayır |
| 🔴 P0 | "Yeni bir talep oluşturmam gerekiyor" | ⚠️ Kısmen (Hızlı Geçişler ile) |
| 🟡 P1 | "Son ne oldu? Talebim onaylandı mı?" | ❌ Hayır |
| 🟡 P1 | "Belge yüklemem lazım" | ⚠️ Kısmen (Hızlı Geçişler ile) |
| 🟢 P2 | "Yasal değişiklikler/haberler neler?" | ✅ Evet (Haber slider) |
| ⚪ P3 | "Kampanya/indirim var mı?" | ✅ Evet (OfferScreen) |

**Kritik bulgu:** En yüksek öncelikli iki iş (P0) şu an hiç karşılanmıyor.

## 4. Önceliklendirme — Mevcut Bileşenlerin Değerlendirmesi

### 📰 Haber Slider'ı (NewsDetailsScreen)
- **Değer katıyor mu?** Marjinal. KOBİ sahipleri haberleri genelde WhatsApp gruplarından, muhasebecilerinden veya sosyal medyadan takip ediyor. Bir mobil uygulamada haber slider açmak, kullanıcının birincil amacı değil.
- **Karar:** ⬇️ **Küçült ve aşağı taşı.** Tam kaldırmak yerine küçük, opsiyonel bir bölüm olarak en altta kalabilir. "Yasal güncelleme" niteliğinde olanlar (KDV oranı değişti, yeni mevzuat gibi) daha değerli — bunları bildirim olarak push etmek daha etkili.

### 🎁 Kampanyalar (OfferScreen)
- **Bir KOBİ uygulamasında mantıklı mı?** Tartışmalı. Eğer FirmaCom'un iş modeli hizmet satışına dayalıysa (POS başvurusu, banka hesabı açma, kredi vb.) kampanyalar monetizasyon için önemli. Ancak **ana sayfanın 2. en önemli bölümü olmamalı.**
- **Karar:** ⬇️ **Ayrı bir sekmeye veya "Fırsatlar" sayfasına taşı.** Ana sayfada sadece 1 adet "öne çıkan fırsat" banner'ı olabilir, ancak bu bileşen ana sayfanın merkezinde olmamalı.

### ⚡ Hızlı Geçişler (ShortcutScreen)
- **Doğru şeyler mi?** Kısmen. Banka Hesabı, Hat Talebi, İmza Sirküleri — bunlar önemli aksiyonlar. Ancak:
  - Kullanıcıya göre kişiselleştirilmiş değil (herkes aynı kısayolları görüyor)
  - En sık kullanılanlar ön plana çıkmıyor
  - "Belge Yükle" gibi temel bir aksiyon kısayollar arasında olmayabilir
- **Karar:** ✅ **Koru ama yeniden tasarla.** 2x2 veya 2x3 grid formatında, ikonlarla, kişiselleştirilebilir hale getir. En çok kullanılan aksiyonlar otomatik öne çıksın.

## 5. Metrik Önerisi

### Birincil Metrikler (North Star)
| Metrik | Tanım | Hedef |
|--------|-------|-------|
| **Günlük Aktif Kullanıcı (DAU)** | Ana sayfayı açan unique kullanıcı sayısı | +30% (v2 sonrası 3 ay) |
| **İlk Aksiyon Süresi** | Uygulama açılışından ilk anlamlı tıklamaya kadar geçen süre | < 5 saniye |
| **Talep Oluşturma Oranı** | Ana sayfadan talep oluşturan / toplam ziyaretçi | > %15 |

### İkincil Metrikler
| Metrik | Tanım |
|--------|-------|
| **Belge Tamamlama Oranı** | Dosya yükleyen kullanıcı yüzdesi (haftalık) |
| **Bounce Rate** | Ana sayfayı açıp hiçbir şeye tıklamadan çıkan kullanıcı oranı |
| **Haber Tıklama Oranı** | Haber kartına tıklayan / ana sayfayı gören (mevcut slider'ın gerçek değerini ölçmek için) |
| **NPS** | Kullanıcı memnuniyet skoru (üç ayda bir anket) |

## 6. Yol Haritası — Ana Sayfa v2

### Faz 1: Temel Dönüşüm (Sprint 1-2, ~4 hafta)
1. ✅ **Durum Kartı** bileşeni oluştur (eksik belge sayısı, aktif talep sayısı, ilerleme çubuğu)
2. ✅ **Hızlı Aksiyonlar** grid'ini yeniden tasarla (2x2 ikonlu grid)
3. ⬇️ Haber slider'ını küçült ve alta taşı
4. ⬇️ Kampanyaları ayrı sekmeye taşı

### Faz 2: Kişiselleştirme (Sprint 3-4, ~4 hafta)
5. ✅ **Son Aktiviteler** timeline'ı ekle
6. ✅ Bildirim ikonu (🔔) + badge ekle header'a
7. ✅ Profil avatarı ekle

### Faz 3: Zeka Katmanı (Sprint 5-6, ~4 hafta)
8. 🧠 Kişiselleştirilmiş kısayollar (kullanım verisine göre sıralama)
9. 🧠 Akıllı öneriler ("İmza sirküleri eksik, şimdi yükle")
10. 🧠 Onboarding akışı (yeni kullanıcı için)

---

# BÖLÜM 2: 📢 Marketing Specialist Analizi

## 1. İlk İzlenim

Uygulama açılınca kullanıcı ne hissediyor?

**Mevcut durum:** "Hoş Geldiniz, [Ad]" başlığı samimi ama yetersiz. Ardından haber kartları geliyor — sanki bir haber uygulaması açılmış gibi. Kullanıcı "Bu uygulama benim işimi mi görüyor yoksa haber mi okutuyor?" diye düşünebilir.

**Güven veriyor mu?** Renk paleti (lacivert + altın + krem) kurumsal ve güven verici — bu iyi. Ancak:
- İlk ekranın büyük bölümünü haberler kaplaması, uygulamanın "ciddi bir iş aracı" olduğu algısını zayıflatıyor
- Kullanıcıya özel hiçbir bilgi yok — herkesin ekranı aynı, bu da "beni tanımıyor" hissi yaratıyor
- Footer'daki "Finhouse" markası güven veriyor ama çok küçük ve pasif

**Olması gereken his:** "Bu uygulama benim işlerimi biliyor, beni tanıyor, nelerin eksik olduğunu gösteriyor." — Bir kontrol paneli hissi.

## 2. Değer Önerisi

**Ana sayfada FirmaCom'un değer önerisi net mi?** Hayır.

FirmaCom'un değer önerisi "KOBİ'lerin belgelerini dijital yönetmesini ve hizmet taleplerini kolaylaştırması" olmalı. Ancak ana sayfada bu mesaj hiçbir yerde yok:
- Haberler → "Biz bir haber kaynağıyız" diyor
- Kampanyalar → "Biz bir pazaryeriyiz" diyor
- Hızlı Geçişler → "Biz bir menüyüz" diyor

**Hiçbiri "Biz sizin dijital belge yönetim aracınızız" demiyor.**

**Öneri:** Durum Kartı tam olarak bu değer önerisini somutlaştırır: "3 belgeniz eksik, 2 talebiniz işleniyor" — bu, kullanıcıya "Ben senin işini takip ediyorum" mesajı verir.

## 3. CTA (Call-to-Action)

**En önemli aksiyon nedir?** Kullanıcının bir sonraki yapması gereken işlem — ki bu genellikle:
1. Eksik belgeyi yüklemek
2. Yeni talep oluşturmak
3. Bekleyen bir talebin detayını görmek

**Yeterince belirgin mi?** Hayır. Mevcut tasarımda:
- Haberler ilk dikkat alanını kaprıyor (yanlış CTA)
- Kampanyalar ikinci dikkat alanında (monetizasyon CTA'sı — kullanıcı CTA'sı değil)
- Gerçek CTA (kısayollar) en altta, scroll gerektiriyor

**Kural:** Ana sayfanın ilk ekranında (above the fold) kullanıcının birincil aksiyonu görünür olmalı. Mevcut tasarımda bu kural ihlal ediliyor.

## 4. Marka Tutarlılığı

**Finhouse markası yeterince yansıtılıyor mu?**

- Footer'da "© 2025 FirmaCom · Finhouse" var — ancak bu çok pasif
- Renk paleti kurumsal ve tutarlı (lacivert/altın iyi kombinasyon) ✅
- Ancak "Finhouse güvencesiyle" gibi bir mesaj yok
- Logo kullanımı, marka sesi (tone of voice) tutarlılığı değerlendirilmeli

**Öneri:**
- Header'a Finhouse/FirmaCom logosu ekle (küçük, sol üst)
- Durum kartında "Finhouse güvencesiyle dijital dosyanız" gibi subtle bir marka mesajı
- Altın rengi (#D3B679) CTA butonlarında ve vurgu noktalarında daha agresif kullanılmalı — bu renk premium/güven hissi veriyor

## 5. Onboarding Fırsatı

**Yeni kullanıcı için yönlendirme var mı?** Muhtemelen yok (mevcut yapıda böyle bir bileşen tanımlanmamış).

**Olmalı mı?** Kesinlikle. FirmaCom gibi bir iş uygulamasında kullanıcının ilk deneyimi kritik:

- İlk giriş yapan kullanıcı "şimdi ne yapmalıyım?" diye düşünür
- Belge yükleme süreci korkutucu olabilir ("Yanlış belge yüklersem ne olur?")
- Adım adım rehberlik, terk oranını düşürür

**Önerilen Onboarding:**
1. **İlk giriş:** "Merhaba [Ad]! Hadi başlayalım — ilk belgenizi yükleyin" (tek CTA)
2. **Adım göstergesi:** "1/5 belge tamamlandı" gibi ilerleme çubuğu (gamification)
3. **Tooltip'ler:** İlk 3 günde hızlı geçiş butonlarında "Bu nedir?" açıklamaları
4. **Tamamlama kutlaması:** "Tüm belgeleriniz tamam! 🎉" (dopamin anı)

## 6. Sosyal Kanıt

**Güven artırıcı elementler var mı?** Hayır. Hiçbir sosyal kanıt unsuru mevcut değil.

**Eklenebilecekler (uygun olanlar):**
- "2.500+ KOBİ FirmaCom kullanıyor" (sayı yeterliyse)
- "Bu ay 1.200 talep işlendi" (platform aktivite göstergesi)
- Finhouse'un banka/kurum ortaklıkları logoları (güven rozeti)
- Google Play / App Store puanı
- KVKK/güvenlik sertifikası rozeti (veri hassasiyeti olan kullanıcılar için)

**Dikkat:** Sosyal kanıt bölümü ana sayfayı kalabalıklaştırmamalı. Onboarding ekranında veya "Hakkımızda" bölümünde daha uygun olabilir. Ana sayfada sadece bir satırlık istatistik yeterli.

## 7. Marketing Önerileri Özeti

| # | Öneri | Etki | Efor |
|---|-------|------|------|
| 1 | Durum Kartı ile değer önerisini somutlaştır | 🔴 Yüksek | Orta |
| 2 | CTA'yı above-the-fold'a taşı | 🔴 Yüksek | Düşük |
| 3 | Onboarding akışı ekle | 🟡 Orta | Yüksek |
| 4 | Sosyal kanıt (tek satır istatistik) | 🟡 Orta | Düşük |
| 5 | Marka mesajını güçlendir | 🟢 Düşük | Düşük |
| 6 | Push bildirimlerle haberleri dışarı taşı | 🟡 Orta | Orta |

---

# BÖLÜM 3: 🎨 UI Designer Önerisi — Yeni Ana Sayfa Layout

## Tasarım Felsefesi

Product Manager ve Marketing analizlerinden çıkan 3 temel ilke:

1. **Dashboard-first:** Ana sayfa bir vitrin değil, kontrol paneli olmalı
2. **Action-oriented:** Kullanıcı 5 saniyede istediğini bulmalı
3. **Personalized:** Ekran kullanıcının durumuna göre değişmeli

## Önerilen Layout

```
┌──────────────────────────────────┐
│ HEADER                           │
│ [Logo]  Hoş Geldiniz, [Ad]      │
│ [Profil avatar]    [Bildirim 🔔] │
├──────────────────────────────────┤
│ DURUM KARTI (StatusCard)         │
│ "3 belgeniz eksik"              │
│ "2 talebiniz işleniyor"         │
│ [██████████░░░░░ %65]            │
│ [Detayları Gör →]               │
├──────────────────────────────────┤
│ HIZLI AKSİYONLAR (2x2 grid)    │
│ [📄 Belge Yükle] [📨 Talep]     │
│ [📝 Sözleşme]   [👤 Profil]     │
├──────────────────────────────────┤
│ SON AKTİVİTELER                  │
│ - Vergi Levhası yüklendi ✅     │
│ - POS talebi onaylandı ✅       │
│ - İmza sirküleri bekliyor ⏳    │
│ [Tümünü Gör →]                  │
├──────────────────────────────────┤
│ HABERLER (opsiyonel, kompakt)   │
│ [Kart] [Kart]                    │
├──────────────────────────────────┤
│ FOOTER                           │
│ © 2025 FirmaCom · Finhouse       │
└──────────────────────────────────┘
```

---

## Bileşen 1: Header (Yeni Tasarım)

### Gerekçe
Mevcut header sadece isim gösteriyor. Yeni header: logo (marka), avatar (kişiselleştirme), bildirim (aksiyonellik) ekliyor. Kullanıcı "bu uygulama beni tanıyor" hissi alıyor.

### JSX

```jsx
// components/HomeHeader.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeHeader = ({ userName, avatarUrl, notificationCount, onAvatarPress, onNotificationPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={require('../assets/firmacom-logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.greeting}>
          <Text style={styles.welcomeText}>Hoş Geldiniz,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#29304A" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{userName?.charAt(0)?.toUpperCase()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EC',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
  },
  greeting: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 13,
    color: '#7E889B',
    fontWeight: '400',
  },
  userName: {
    fontSize: 18,
    color: '#0D0D0D',
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarContainer: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#29304A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#D3B679',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeHeader;
```

---

## Bileşen 2: Durum Kartı (StatusCard) ⭐ En Kritik Yeni Bileşen

### Gerekçe
**Bu bileşen, tüm yeniden tasarımın merkezindeki parça.** Kullanıcı uygulamayı açtığı anda "işlerim ne durumda?" sorusunun cevabını alıyor. İlerleme çubuğu hem bilgi veriyor hem de tamamlama motivasyonu yaratıyor (gamification). Above-the-fold konumda olması, uygulamanın ana değer önerisini anında ileten bir unsur.

### JSX

```jsx
// components/StatusCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatusCard = ({
  missingDocCount = 0,
  activeRequestCount = 0,
  completionPercent = 0,
  onPress,
}) => {
  const getStatusColor = () => {
    if (completionPercent >= 80) return '#27AE60';
    if (completionPercent >= 50) return '#D3B679';
    return '#E67E22';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="pulse-outline" size={20} color="#29304A" />
          <Text style={styles.title}>Dosya Durumunuz</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#7E889B" />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{missingDocCount}</Text>
          <Text style={styles.statLabel}>Eksik Belge</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{activeRequestCount}</Text>
          <Text style={styles.statLabel}>İşlenen Talep</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: getStatusColor() }]}>
            %{completionPercent}
          </Text>
          <Text style={styles.statLabel}>Tamamlandı</Text>
        </View>
      </View>

      {/* İlerleme Çubuğu */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${completionPercent}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
      </View>

      {missingDocCount > 0 && (
        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>
            {missingDocCount} belgenizi tamamlayın →
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    // Shadow
    shadowColor: '#29304A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29304A',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#29304A',
  },
  statLabel: {
    fontSize: 12,
    color: '#7E889B',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#F0F0EC',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#F0F0EC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  ctaRow: {
    marginTop: 8,
  },
  ctaText: {
    fontSize: 13,
    color: '#D3B679',
    fontWeight: '600',
  },
});

export default StatusCard;
```

---

## Bileşen 3: Hızlı Aksiyonlar (QuickActions)

### Gerekçe
Mevcut ShortcutScreen'in evrimleşmiş hali. 2x2 grid formatı mobilde iyi çalışır — tek bakışta 4 ana aksiyon. Kullanıcının en sık ihtiyaç duyduğu işlemler buraya konumlandırılıyor. Durum kartının hemen altında olması "durumunu gör → harekete geç" akışını doğal kılıyor.

### JSX

```jsx
// components/QuickActions.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const defaultActions = [
  { id: 'upload', icon: 'document-text-outline', label: 'Belge Yükle', color: '#29304A' },
  { id: 'request', icon: 'paper-plane-outline', label: 'Talep Oluştur', color: '#29304A' },
  { id: 'contract', icon: 'create-outline', label: 'Sözleşme', color: '#29304A' },
  { id: 'profile', icon: 'person-outline', label: 'Profil', color: '#29304A' },
];

const QuickActions = ({ actions = defaultActions, onActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hızlı Aksiyonlar</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => onActionPress?.(action.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, { backgroundColor: action.color + '10' }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29304A',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 10,
    // Shadow
    shadowColor: '#29304A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D0D0D',
    textAlign: 'center',
  },
});

export default QuickActions;
```

---

## Bileşen 4: Son Aktiviteler (RecentActivity)

### Gerekçe
Kullanıcının "son ne oldu?" sorusuna cevap veriyor. Timeline formatı, süreç takibini kolaylaştırıyor. Durum ikonları (✅, ⏳, ❌) ile hızlı görsel tarama mümkün. Hızlı aksiyonların altında olması mantıklı çünkü kullanıcı önce "ne yapacağımı biliyorum" sonra "ne olmuş bakalım" akışını takip ediyor.

### JSX

```jsx
// components/RecentActivity.jsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUS_CONFIG = {
  completed: { icon: 'checkmark-circle', color: '#27AE60', label: 'Tamamlandı' },
  pending: { icon: 'time-outline', color: '#D3B679', label: 'Bekliyor' },
  rejected: { icon: 'close-circle', color: '#E74C3C', label: 'Reddedildi' },
  processing: { icon: 'sync-outline', color: '#3498DB', label: 'İşleniyor' },
};

const RecentActivity = ({ activities = [], onViewAll, onActivityPress }) => {
  const renderItem = ({ item }) => {
    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

    return (
      <TouchableOpacity
        style={styles.activityRow}
        onPress={() => onActivityPress?.(item)}
        activeOpacity={0.7}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.activityTime}>{item.timeAgo}</Text>
        </View>
        <Text style={[styles.statusBadge, { color: config.color }]}>
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={32} color="#7E889B" />
          <Text style={styles.emptyText}>Henüz bir aktivite yok</Text>
          <Text style={styles.emptySubtext}>İlk belgenizi yükleyerek başlayın!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>Tümünü Gör →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listCard}>
        <FlatList
          data={activities.slice(0, 5)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29304A',
  },
  viewAllText: {
    fontSize: 13,
    color: '#D3B679',
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#29304A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D0D0D',
  },
  activityTime: {
    fontSize: 11,
    color: '#7E889B',
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0EC',
    marginHorizontal: 14,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7E889B',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#7E889B',
  },
});

export default RecentActivity;
```

---

## Bileşen 5: Haberler (CompactNews) — Küçültülmüş

### Gerekçe
PM analizinde haberler "P2" önceliğe düşürüldü, Marketing analizinde "dikkat dağıtıcı" olarak belirlendi. Ancak tamamen kaldırmak yerine küçük, yatay kartlar halinde en altta tutuyoruz. Yasal güncellemeler gibi önemli haberler push bildirim ile desteklenebilir.

### JSX

```jsx
// components/CompactNews.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

const CompactNews = ({ news = [], onNewsPress, onViewAll }) => {
  if (news.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Güncel Haberler</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>Tümü →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {news.slice(0, 4).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.newsCard}
            onPress={() => onNewsPress?.(item)}
            activeOpacity={0.7}
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
            )}
            <Text style={styles.newsTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.newsDate}>{item.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29304A',
  },
  viewAllText: {
    fontSize: 13,
    color: '#D3B679',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  newsCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#29304A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#F0F0EC',
  },
  newsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D0D0D',
    padding: 10,
    paddingBottom: 4,
  },
  newsDate: {
    fontSize: 10,
    color: '#7E889B',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default CompactNews;
```

---

## Ana Sayfa — Birleştirilmiş Ekran

```jsx
// screens/HomeScreen.jsx
import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import HomeHeader from '../components/HomeHeader';
import StatusCard from '../components/StatusCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import CompactNews from '../components/CompactNews';

const HomeScreen = ({ navigation }) => {
  // Bu veriler API/state'ten gelecek
  const userData = {
    name: 'Mehmet',
    avatar: null,
    notifications: 3,
  };

  const statusData = {
    missingDocs: 3,
    activeRequests: 2,
    completion: 65,
  };

  const activities = [
    { id: '1', title: 'Vergi Levhası yüklendi', status: 'completed', timeAgo: '2 saat önce' },
    { id: '2', title: 'POS talebi onaylandı', status: 'completed', timeAgo: '5 saat önce' },
    { id: '3', title: 'İmza sirküleri bekliyor', status: 'pending', timeAgo: '1 gün önce' },
    { id: '4', title: 'Faaliyet belgesi işleniyor', status: 'processing', timeAgo: '2 gün önce' },
  ];

  const news = [
    { id: '1', title: 'KDV oranlarında güncelleme', date: '28 Mar 2026', imageUrl: null },
    { id: '2', title: 'E-fatura zorunluluğu genişledi', date: '25 Mar 2026', imageUrl: null },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader
        userName={userData.name}
        avatarUrl={userData.avatar}
        notificationCount={userData.notifications}
        onAvatarPress={() => navigation.navigate('Profile')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusCard
          missingDocCount={statusData.missingDocs}
          activeRequestCount={statusData.activeRequests}
          completionPercent={statusData.completion}
          onPress={() => navigation.navigate('DocumentStatus')}
        />

        <QuickActions
          onActionPress={(actionId) => {
            const routes = {
              upload: 'DocumentUpload',
              request: 'NewRequest',
              contract: 'Contracts',
              profile: 'Profile',
            };
            navigation.navigate(routes[actionId]);
          }}
        />

        <RecentActivity
          activities={activities}
          onViewAll={() => navigation.navigate('ActivityHistory')}
          onActivityPress={(activity) => navigation.navigate('ActivityDetail', { id: activity.id })}
        />

        <CompactNews
          news={news}
          onNewsPress={(item) => navigation.navigate('NewsDetail', { id: item.id })}
          onViewAll={() => navigation.navigate('NewsList')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFBF6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});

export default HomeScreen;
```

---

# BÖLÜM 4: Uygulama Planı

## Yeni Bileşenler

| # | Bileşen | Dosya | Durum |
|---|---------|-------|-------|
| 1 | HomeHeader | `components/HomeHeader.jsx` | 🆕 Yeni |
| 2 | StatusCard | `components/StatusCard.jsx` | 🆕 Yeni |
| 3 | QuickActions | `components/QuickActions.jsx` | 🔄 ShortcutScreen evrim |
| 4 | RecentActivity | `components/RecentActivity.jsx` | 🆕 Yeni |
| 5 | CompactNews | `components/CompactNews.jsx` | 🔄 NewsDetailsScreen evrim |
| 6 | HomeScreen | `screens/HomeScreen.jsx` | 🔄 Mevcut ana ekran refactor |

## Değişecek/Kaldırılacak Dosyalar

| Dosya | Aksiyon |
|-------|---------|
| `NewsDetailsScreen` | → `CompactNews`'a dönüşüyor (ayrı sayfa olarak kalabilir, ana sayfadan çıkıyor) |
| `OfferScreen` | → Ana sayfadan çıkarılıyor → Ayrı "Fırsatlar" sekmesine taşınıyor |
| `ShortcutScreen` | → `QuickActions`'a dönüşüyor |
| Mevcut Header | → `HomeHeader`'a dönüşüyor |
| Mevcut HomeScreen | → Yeniden yazılıyor (yukarıdaki birleştirilmiş ekran) |

## API Gereksinimleri (Backend)

Yeni bileşenler için backend endpoint'leri gerekiyor:

| Endpoint | Açıklama | Bileşen |
|----------|----------|---------|
| `GET /api/user/status` | Eksik belge sayısı, aktif talep, tamamlanma yüzdesi | StatusCard |
| `GET /api/user/activities?limit=5` | Son aktiviteler listesi | RecentActivity |
| `GET /api/user/notifications/count` | Okunmamış bildirim sayısı | HomeHeader badge |
| `GET /api/news?limit=4` | Haber listesi (zaten mevcut olabilir) | CompactNews |

## İmplementasyon Sırası

```
Hafta 1-2: Altyapı
├── Backend: /api/user/status endpoint'i
├── Backend: /api/user/activities endpoint'i
├── HomeHeader bileşeni
└── StatusCard bileşeni

Hafta 3-4: Ana Bileşenler
├── QuickActions bileşeni (ShortcutScreen refactor)
├── RecentActivity bileşeni
├── CompactNews bileşeni (NewsDetailsScreen küçültme)
└── HomeScreen birleştirme

Hafta 5: Taşıma & Temizlik
├── OfferScreen → ayrı sekmeye taşıma
├── Eski bileşenlerin kaldırılması
├── Navigation güncelleme
└── QA & Test

Hafta 6: Polish
├── Animasyonlar (kart geçişleri, progress bar)
├── Loading skeleton'ları
├── Empty state tasarımları
└── A/B test altyapısı (eski vs yeni karşılaştırma)
```

## Risk & Dikkat Edilecekler

| Risk | Çözüm |
|------|-------|
| Backend endpoint'leri hazır olmayabilir | Mock data ile frontend'i geliştir, paralel ilerle |
| Mevcut kullanıcılar değişikliğe direnebilir | Feature flag ile kademeli rollout, A/B test |
| StatusCard verisi real-time olmalı | WebSocket veya polling ile güncelleme |
| Performans — çok fazla API çağrısı | Tek bir `/api/home` endpoint'i ile birleştir |

## Başarı Kriterleri (v2 Lansmanı Sonrası 3 Ay)

- [ ] İlk aksiyon süresi < 5 saniye
- [ ] Bounce rate %20 azalma
- [ ] Talep oluşturma oranı > %15
- [ ] DAU %30 artış
- [ ] NPS > 40

---

> **Sonuç:** Mevcut ana sayfa bir "haber + kampanya vitrini" — olması gereken ise bir "kişisel kontrol paneli". Bu dönüşüm, FirmaCom'u "güzel görünen ama az kullanılan" bir uygulamadan "her gün açılan vazgeçilmez bir iş aracına" dönüştürme potansiyeline sahip.
