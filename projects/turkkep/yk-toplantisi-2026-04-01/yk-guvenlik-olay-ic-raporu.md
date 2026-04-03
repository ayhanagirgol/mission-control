# TÜRKKEP A.Ş.
## YÖNETİM KURULU GÜVENLİK OLAYI İÇ RAPORU
### Şubat 2026 Siber Güvenlik Olayı — Durum ve Önlemler Özeti

**Tarih:** 1 Nisan 2026  
**Hazırlayan:** Ayhan Ağırgöl — CTO / GMY  
**Gizlilik:** YK Üyeleri İç Kullanımı

---

## 1. OLAYIN KISA ÖZETİ

Şubat 2026'nın ilk yarısında TÜRKKEP müşteri destek portali üzerinden yetkisiz erişim niteliğinde bir siber güvenlik olayı yaşanmıştır. Olay hızla tespit edilmiş, ilgili tüm kurumlara bildirim yapılmış ve kapsamlı önlemler alınmıştır.

> **Kritik Not:** KEP altyapısı, ana veritabanları ve KEP mesaj içerikleri bu olaydan **etkilenmemiştir.**

---

## 2. OLAYIN OLUŞ ŞEKLİ

### Ne Oldu?
- **10 Şubat 2026** civarında, **e-Saklama ve e-Defter uygulamalarındaki SQL Injection açığı** kullanılarak sisteme yetkisiz erişim sağlandı.
- Saldırgan, bu açık aracılığıyla uygulama veritabanına sorgu göndererek veri çekti.
- Adli inceleme sonucunda, e-Saklama ve e-Defter hizmeti kullanan müşterilere ait **e-posta adresleri, telefon numaraları ve son giriş tarihleri** çekildiği değerlendirilmektedir.

### Ne Etkilenmedi?
- KEP mesaj içerikleri ve arşivler
- Ana veritabanlarına doğrudan erişim gerçekleşmedi
- Ödeme bilgileri, kimlik belgeleri veya kriptografik imza verileri
- TÜRKKEP'in temel hizmet altyapısı

### Saldırı Sonrası Girişim
- Saldırgan(lar), ele geçirdiğini iddia ettiği verileri "türkkep" ibaresini içeren sahte bir alan adı üzerinden yayımlamakla tehdit etti.
- Sahte alan adı USOM koordinasyonu ile **20 Şubat 2026** tarihinde erişime kapatıldı.
- **17 Mart 2026'da** ikinci bir siber saldırı girişimi (DDoS, 13 farklı kaynak) gerçekleşti; Platin SOC tarafından başarıyla bloke edildi.

---

## 3. OLAY TESPİT VE İLK MÜDAHALENİN KRONOLOJİSİ

| Tarih | Yapılan |
|---|---|
| **10 Şubat 2026** | Tahmini olay başlangıcı |
| **15 Şubat 2026** | Olay tespit edildi — aynı gün kriz yönetim ekibi devreye alındı |
| **15 Şubat 2026** | e-Saklama ve Türkkep Bulut uygulamaları güvenli hale getirilene kadar geçici olarak durduruldu |
| **17 Şubat 2026** | DDoS saldırısı Platin SOC tarafından bloke edildi |
| **20 Şubat 2026** | USOM'a yazılı bildirim yapıldı (15 dakika içinde işleme alındı) |
| **20 Şubat 2026** | Sahte alan adı USOM koordinasyonu ile erişime kapatıldı |
| **24 Şub – 3 Mar 2026** | CyberFirstAid tarafından dijital adli inceleme gerçekleştirildi |
| **21 Şubat 2026** | Güvenlik katmanları güçlendirilerek uygulamalar hizmete geri alındı |
| **17 Mart 2026** | İkinci dalga saldırı başarıyla savunuldu |
| **30 Mart 2026** | Tüm sistemler aktif ve güvenli — süregelen ataklar bloke ediliyor |

---

## 4. ALINAN ÖNLEMLER

### Anlık Müdahale
- YK düzeyinde kriz yönetimi başlatıldı; Teknik, Hukuki ve Uyum ekipleri devreye alındı
- Yurt dışı bağlantı aktivitesi tespit edilen **2 çalışana ait bilgisayar karantinaya** alındı, yeni ekipman tahsis edildi
- Platin Bilişim ile SOC hizmeti **yüksek destek modeline** yükseltildi

### Teknik Güçlendirme
| Önlem | Durum |
|---|---|
| Fortify ile statik kod güvenlik analizi (e-Saklama, e-Defter) | ✅ Tamamlandı |
| FORTİNAC NAC entegrasyonu | ✅ Aktif |
| Bitdefender Gravityzone güvenlik yazılımı yükseltmesi | ✅ Aktif |
| Web sitesinin CRM'den ayrıştırılması ve harici hosting'e taşınması | ✅ Tamamlandı |
| Sızma testi kapsamı genişletildi (API dahil) | ✅ Tamamlandı |
| Gebze veri merkezi firewall yenileme | 🔄 Devam ediyor |
| DLP (Veri Kaybı Önleme) çözümü devreye alımı | 🔄 Devam ediyor |
| MS365 altyapısına geçiş (Zimbra güvenlik açığı giderilecek) | 🔄 Devam ediyor |
| 6 aylık siber güvenlik danışmanlık yol haritası (CyberFirstAid) | 🔄 Devam ediyor |

### Hukuki Süreç
- "TÜRKKEP" markasını içeren sahte alan adına marka ihlali gerekçesiyle hukuki süreç başlatıldı
- BTK/KVKK bildirimleri tamamlandı
- Avukat tarafından BTK resmi savunma yazısı hazırlık sürecinde (**YK onayı bekliyor**)

---

## 5. MEVCUT DURUM (1 Nisan 2026 İtibarıyla)

- Tüm hizmetler **tam kapasitede aktif**
- Süregelen saldırı girişimleri Platin SOC tarafından etkin biçimde bloke ediliyor
- **17 Mart'ta gerçekleştirilen ikinci dalga saldırı** (13 kaynaktan) başarıyla savunuldu — veri çıkışı gerçekleşmedi
- ISO 27001 sertifikası korunmaktadır
- BTK denetimine tabi olmaya devam edilmektedir
- 2026 güvenlik bütçesinde ~12M TL ek yatırım planlandı

---

## 6. YK'DAN BEKLENEN DESTEK VE KARARLAR

1. **BTK Savunma Yazısı Onayı** — Avukat tarafından hazırlanan yazının YK/yönetim onayından geçmesi
2. **Güvenlik Bütçesi Kabulü** — 2026 ek güvenlik yatırım planının onaylanması
3. **Yetkilendirme** — BTK/KVKK süreçlerinde CTO'nun yetkilendirilmesi
4. **Kamuoyu Bildirimi Onayı** — Gerekli görülürse müşteri bilgilendirme metninin onaylanması

---

## 7. SONUÇ VE DEĞERLENDİRME

Bu olay TÜRKKEP için ciddi bir uyarı sinyali olmuş; ancak aynı zamanda güvenlik altyapımızı kökten güçlendirmek için bir dönüm noktasına dönüştürülmüştür. Alınan önlemler, ikinci dalga saldırıda kendini kanıtlamış — **17 Mart saldırısı sıfır veri kaybıyla savunulmuştur.**

Güvenlik; TÜRKKEP'in kurumsal kimliğinin ve "Trusted AI" vizyonunun ayrılmaz bir parçasıdır. Bu olayı şeffaflıkla yönetmek ve güçlenerek çıkmak, müşteri güvenini pekiştirecektir.

---

*Hazırlayan: Ayhan Ağırgöl — CTO / GMY*
*Tarih: 1 Nisan 2026*
*⚠️ Bu belge YK iç kullanımına mahsustur.*
