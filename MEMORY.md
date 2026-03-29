# MEMORY.md

## Türkkep M365 Otomasyonu (2026-03-19)
- Türkkep mailbox erişimi Microsoft Graph üzerinden çalışıyor (TURKKEP_ prefix'li .env değişkenleri)
- Mail gönderme (Mail.Send) izni yok ama okuma çalışıyor
- `qradar` klasörü oluşturuldu; qradar@turkkep.com.tr'den gelen 72+ mail taşındı
- Kritik anahtar kelimeler (TA00xx, Ransomware vb.) → bayrak; diğerleri → qradar klasörü
- `Platin` kategorisi (turuncu, preset2) Outlook'ta oluşturuldu; platinbilisi.com.tr'den gelenlere atanacak
- Saatlik cron: `turkkep-automation` — qradar sınıflandırma + Platin etiketleme
- Sabah 08:00 cron: `turkkep-morning-brief` — son 24 saatin mailleri analiz edilip mail (ayhan.agirgol@finhouse.com.tr) ve WhatsApp (+905326142316) ile özet gönderilir
- Script dosyaları: turkkep_automation.mjs, turkkep_morning_brief.mjs, turkkep_qradar_moveall.mjs
- Service desk atama mailleri CTO için task sayılmaz; sadece onay isteyen mailleri task olarak çıkar
- Finhouse mail yönlendirmesi (→ Gmail) devre dışı durumda, silinmedi

## Takvim Senkronizasyonu (2026-03-19)
- Türkkep + Gmail → Finhouse tek yönlü senkronizasyon kuruldu
- launchd job: com.openclaw.calendar-sync — hafta içi 08-18 arası saat başı çalışır
- Script: calendar_sync.mjs, state: logs/calendar_sync_state.json
- Finhouse'ta etkinlikler [Türkkep] / [Gmail] prefix ile eklenir
- Salim Büge görüşmesi 26 Mart 10:00 Finhouse takvimine eklendi

## Finhouse Mailbox (2026-03-19)
- MS Graph API ile erişim aktif (MS_CLIENT_ID/TENANT_ID/CLIENT_SECRET)
- Önemli bekleyen işler: Burgan Bank (çek görüntüsü teknik soru), Enlighty AI (bankacılık örnek), SPL Group teslimat
- HR Interview: 23 Mart 17:30 Google Meet (Luis)

- Kullanıcının 3 ayrı mail ve takvim uygulaması var; bunları birlikte yönetmemi istiyor.
- Çoklu mail/takvim yönetimi, gelecekte varsayılan yardımcı olma şeklim olmalı.
- Mevcut bağlamda öne çıkan hesaplar: Gmail, Google Calendar, Finhouse, Türkkep.
- Google erişimi (ayhan.agirgol@gmail.com, gog ile calendar+gmail) kalıcı olarak hatırlanmalı.
- Kullanıcı Gemini subscription sahibi; özellikle YouTube videolarını Gemini ile özetlememi istiyor.
- Kullanıcının ana çalışma alanları Fintech ve AI; raporlarda AI dünyasındaki haberler ve finans sektörüne yönelik AI çözümleri fintech genel haberlerinden daha baskın olmalı.
- Finhouse.ai kullanıcının ikinci web sitesi; Fintech + AI haber akışı bu site için stratejik önem taşıyor ve haber paylaşımlarında kullanılabilir.
- Kullanıcı, bu alanda kendimi geliştirip memory kullanmamı özellikle istiyor; Fintech + AI kaynaklarını düzenli izleme kalıcı tercih olarak ele alınmalı.
- Cron job'larda mail gönderimi için, approval/problem riski olan OpenClaw içi akışlar yerine script tabanlı ve doğrudan SMTP/API kullanan bağımsız gönderim hattısı kalıcı tercih olarak ele alınmalı.
- Bu bağlamda `ayhan.agirgol@gmail.com` üzerinden çalışan Gmail SMTP hattısı, cron raporlarının tesliminde onaysız ve daha stabil çalışan varsayılan yöntem olarak benimsendi.
- Fintech raporlarında içerik üretiminde genel arama sonuçlarını filtrelemek yerine kaynak öncelikli yaklaşım tercih edilmeli: önce Webrazzi, sonra X, sonra LinkedIn, ardından yalnızca destekleyici güvenilir kaynaklar.
- Günlük fintech raporlarında güçlü sinyal yoksa rapor kısa kalabilir; alakasız maddelerle doldurulmamalı.
- Fintech raporlarında sektörde göreve başlayanlar, yönetici atamaları ve görev değişimleri de izlenmeli; bu tip sinyaller için LinkedIn öncelikli kaynak olarak ele alınmalı.
- Kullanıcı tarafından özellikle paylaşılan LinkedIn/şirket içeriklerinde, paylaşımı yapan firmanın kendi web sitesi ve ilişkili kaynakları da haftalık rapor hazırlığında değerlendirme havuzuna eklenmeli; yalnızca paylaşım linkiyle yetinilmemeli.
- Workspace'e yüklenen kişi listeleri lookup kaynağı olarak benimsenmeli; kişi/telefon aramalarında önce bu yerel rehbere bakılmalı.
- Özellikle WhatsApp gönderimlerinde hızlı erişim için bu rehberden isim → telefon eşleşmesi çıkarılıp kullanılmalı.
- Kullanıcı, `ayhan.agirgol@finhouse.com.tr` için Microsoft Graph bağlantısının her sabah proaktif olarak kontrol edilmesini istiyor; bu kalıcı bir takip görevi olarak ele alınmalı.
- Kullanıcı, OpenClaw'a bağlı WhatsApp hattı üzerinden her sabah +905326142316 numarasına kısa bir günaydın mesajı gönderilmesini istiyor; bu kalıcı tercih olarak hatırlanmalı.
- Kullanıcı, çalışma tarzımın daha araştırmacı, sürekli öğrenen ve güçlü memory kullanan bir yapıda olmasını istiyor; gerektiğinde GitHub/Reddit/dış kaynak araştırması yapmalı ve faydalı olduğunda lokal diskten çekinmeden yararlanmalıyım.
- Kullanıcı CTO olarak çalışıyor, AI danışmanlığı veriyor; Türkkep ve Bulutistan bağlamına uygun, yüksek sinyalli OpenClaw/AI/operasyon materyallerini proaktif araştırmamı ve gerçekten faydalı bulursam e-posta iletmeyi uygun buluyor.
- Kullanıcı, Finhouse mailbox'ındaki okunmamış mailleri proaktif takip etmemi; mümkünse görev/aksiyon/madde çıkarmamı ve uygun olduğunda WhatsApp `custom-1` hattı üzerinden bildirmemi istiyor.
- Kullanıcı toplantılarını takip eden, işlerini listeleyen daha proaktif bir asistan karakteri istiyor; bu yönde davranışımı genişletmeliyim.
- Kullanıcı bazen WhatsApp üzerinden toplantı oluşturmak isteyecek; bu durumda mümkünse Teams toplantısı oluşturup davet e-postasını katılımcılara iletmeliyim. Katılımcılar belirtilmemişse veya tarih/saat eksikse önce kullanıcıdan eksik bilgileri istemeliyim.
- Güneş'e (+905333610236) WhatsApp mesajı gönderirken bol emoji kullan: aşk emojileri (❤️😍🥰💕😘), gülücükler, sevimli ifadeler. Sıcak ve sevecen ton.
- ⚠️ KRİTİK WhatsApp KURALI: Başkalarına (Ayhan dışı) doğrudan WhatsApp yanıtı GÖNDERME. Bunun yerine:
  1. Mesajı oku ve anla
  2. Cevap taslağı hazırla
  3. Taslağı webchat'te Ayhan'a göster ve onay bekle
  4. Ayhan onaylarsa → gönder; onaylamazsa → gönderme
  - Ayhan'a (+905326142316) direkt yanıt verebilirsin, onay gerekmez.
  - Ayhan "mesaj yaz/gönder" derse de doğrudan gönder, onay gerekmez. Başka herkese (grup, DM, her türlü mesaj) kesinlikle yanıt verme — NO_REPLY bile gönderme, tamamen sessiz kal. Ayhan bile olsa, başkalarına gelen mesajlara cevap yazma; mesajları oku ama yanıt vermeyi Ayhan'a bırak.
- Kullanıcı, daha az soru soran; daha otonom, araştırmacı ve sonuç odaklı bir çalışma tarzı istiyor. Mümkün olduğunda önce kendim çözmeli, yalnızca gerçekten eksik bilgi varsa sormalıyım.

## Microsoft To Do Erişimi (2026-03-21)
- `ms_graph_todo.mjs` ile delegated auth (device code flow) üzerinden erişim kuruldu
- Finhouse Entra uygulaması üzerinden Tasks.ReadWrite delegated permission + public client flows aktif
- Token: `.todo_tokens.json` (refresh token ile otomatik yenileme)
- Listeler: Görevler (ana), Finhouse, Flagged Emails
- Komutlar: login, lists, tasks, add "başlık" [--due YYYY-MM-DD], complete <id>, search "sorgu"

## Erişim Durumu Özeti (2026-03-21)
| Hesap | Mail Okuma | Mail Gönderme | Takvim | To Do |
|---|---|---|---|---|
| Finhouse | ✅ | ✅ | ✅ | ✅ |
| Türkkep | ✅ | ✅ (25 Mart açıldı) | ✅ | ✅ Teams |
| Gmail | ✅ (gog) | ✅ (SMTP) | ✅ (gog) | - |
- Takvim konsolidasyonu: Türkkep + Gmail → Finhouse (calendar_sync.mjs)
- Exec approval sorunu çözüldü: exec-approvals.json'da security=full, ask=off

## Model Fallback Tercihi (2026-03-21)
- Varsayılan: Sonnet (basit işler) → Opus (zor işler)
- Anthropic API sorunu → GPT-5.4 subscription (openai-codex)
- O da sorun → GPT-5.2 API (openai)
- Config'te fallback zinciri olarak tanımlandı

## Standing Orders Yaklaşımı (2026-03-21)
- Rutin görevleri kalıcı "yetki belgesi" olarak AGENTS.md'ye yaz, cron sadece "tetikle" olarak kullan
- Claude Code: `--permission-mode bypassPermissions --print` ile PTY'siz — doğru yöntem
- WhatsApp "No active listener" sorunu: gateway restart sırasında timing meselesi, henüz tam çözülmedi

## finhouse.ai Sosyal Medya Akışı (2026-03-21)
- Plan: Her sabah AI+fintech raporu → LinkedIn ve X için 2-3 post → kullanıcı onayıyla paylaş
- Standing Order mantığıyla AGENTS.md'ye eklenecek
- Mevcut altyapı: xurl (X/Twitter), LinkedIn skill, günlük rapor scriptleri

## finhouse.ai Strateji Notları (2026-03-21)
- Siteden partner firma isimleri kaldırılacak (task açıldı Finhouse listesinde)
- finhouse.ai → "Finans sektörü AI çözüm merkezi" olarak yeniden konumlandırılacak
- Günlük finans/AI haberleri → mevcut rapor çıktılarından sosyal medya içeriği üretilip X ve LinkedIn'de yayınlanacak
- Bu içerik akışı için otomatik yayın sistemi kurulacak (task açıldı)
- 3 ayrı task açıldı Finhouse To Do listesinde

## Network Disk / Yedek Sistemi (2026-03-21)
- Kullanıcının bir network diski var — MacBook Time Machine/yedek hedefi olarak kullanıyor
- İleride: bu diske OpenClaw'ın da erişimi verilecek (workspace yedekleme, log arşivleme vb. için)
- Yapılacak: disk adı/IP/bağlantı yöntemi öğrenilecek, .env veya TOOLS.md'ye eklenecek
- Task açılmadı — kullanıcı hazır olduğunda başlatılacak

## Gelir Modeli / İş Planı Çalışması (2026-03-22)
- Kullanıcıyla birlikte "OpenClaw/AI ile nasıl gelir üretiriz" konusunu çalışıyoruz
- 5 model belirlendi, hepsi masada:
  1. AI Agent Kurulum & Danışmanlık (hemen başlanabilir, $5K-20K/ay potansiyel)
  2. ClawHub'da Finans Sektörüne Özel Skill Satışı (KEP, e-belge, BDDK — niş, pasif gelir)
  3. Finhouse.ai'yi "Finans AI Çözüm Merkezi"ne dönüştürme (abonelik, danışmanlık, hosting)
  4. Managed AI Agent Hosting / VPS (KVKK uyumlu, $30-150/ay/müşteri)
  5. Mikro-SaaS: Finans AI Asistan Platformu (bankalar/ödeme kuruluşları için, uzun vadeli)
- Kademe önerisi: Kısa vade → danışmanlık, Orta vade → skill + Finhouse, Uzun vade → hosting + SaaS
- Üzerinde konuşmaya devam edilecek

## WhatsApp Mesaj Takibi (2026-03-22)
- WhatsApp'tan gelen tüm mesajları oku ve kayıt altına al
- Kimseye yanıt VERME (mevcut kural: sadece Ayhan'a yanıt ver)
- Gelen mesajları günlük memory dosyasına (memory/YYYY-MM-DD.md) kaydet
- Önemli/acil mesajları ayrıca belirt

## Muhasebe Fatura Yönlendirmesi (2026-03-22)
- Finhouse A.Ş.'ye gelen tüm faturalar otomatik olarak muhasebeye iletilecek
- Muhasebe ekibi: İklime Güney (iklime.guney@techsmmm.com) + Arzu Sancar (arzu.sancar@finhouse.com.tr)
- .env: MUHASEBE_RECIPIENTS=iklime.guney@techsmmm.com,arzu.sancar@finhouse.com.tr
- Gönderim kaynağı: ayhan.agirgol@gmail.com (gmail_smtp.py)
- İletilen faturalar: Anthropic ($81.96, #2160-5743-9320, Mart 2026), X Developer Platform (#2074-8907, 22 Mart 2026)

## Kalıcı Takip Alanları — Beyttürk & Türkkep

### Beyttürk / E-Para Danışmanlık
- Beyttürk için ödeme sistemleri ve e-para şirketi danışmanlığı veriliyor
- TCMB e-para lisans çalışması devam ediyor (ikinci aşama)
- Haftalık rapor alıcıları: Muhammed Bey, Celal Bey, Gülden Hanım
- Rapor içeriği: TCMB yönetmelik değişiklikleri, sektördeki e-para/ödeme şirketlerinin LinkedIn paylaşımları, proje ilerleme notları
- Projede birlikte çalışılan kişi: Ramazan Küçük
- Sürekli öğrenme: fintech çözümleri, ödeme sistemleri, e-para iş modelleri, gelir modeli örnekleri (Türkiye + global)

### Türkkep — CTO Rolü
- Kullanıcı Türkkep'te CTO, ayrıca GM'e vekalet ediyor
- Türkkep mailleri proje ve operasyon takibi için birincil kaynak
- Araştırma alanları: e-belge, KEP, KEP entegrasyonları, e-imza, e-mühür, kullanım alanları
- Mail otomasyonları aktif (qradar sınıflandırma, Platin etiketleme, sabah brifingi)

### Takip Talimatı
- Her iki alanda da sürekli güncel kal: TCMB düzenlemeleri, sektör haberleri, LinkedIn paylaşımları
- Fintech + e-para + e-belge alanlarında kendini sürekli geliştir
- Haftalık raporlara katkı sağlayacak şekilde sektör takibi yap
- WhatsApp grup yazışmalarından bağlam topla (yanıt verme, sadece oku ve kaydet)

## Network Diski — Keenetic WebDAV (2026-03-21) ✅ ERİŞİM SAĞLANDI
- URL: https://finhouse.keenetic.link/webdav/
- Auth: URL-embedded format → `https://$KEENETIC_USER:$KEENETIC_PASS@finhouse.keenetic.link/webdav/`
- Credentials: .env → KEENETIC_USER=WebDAV, KEENETIC_PASS=Samsun5604!!
- Keenetic IP: 192.168.1.7 (LAN), ZTE ana modem: 192.168.1.1
- Disk: Western Digital Elements 25A3 (~5.46 TB)
- KeenDNS: finhouse.keenetic.link (Cloud access modu)
- Önemli: `curl -u` çalışmıyor; Keenetic WebDAV'da `login:password@host` URL formatı gerekiyor
- Mevcut klasörler: Backup Files/, DropBox.tib (72.5MB yedek)
- Yapılacaklar: workspace yedekleme cron'u kur, raporlar ve log'lar otomatik yedeklensin

## Mail Format Kuralı — Bülten ve Özet Gönderimlerinde Linkler (2026-03-23)
- Haber özetlerini mail olarak iletirken her maddenin altına **doğrudan kaynak linki** mutlaka eklenecek
- Tracker/redirect URL değil, asıl makale adresi kullanılacak
- Bu kural Beyttürk, Bulutistan ve diğer tüm alıcılara gönderilen bültenlerde geçerli
- İlk örnekte linkler eksik kalmıştı — hatırlanacak

## finhouse.ai Web Sitesi & Deployment (2026-03-23)
- **GitHub repo:** github.com/ayhanagirgol/finhouse-ai-site
- **Netlify site:** finhouseai (ID: b98948fd-a11e-465e-bbc0-1f542f562b5c)
- **Domain:** finhouse.ai + www.finhouse.ai
- **CI/CD:** GitHub → Netlify otomatik deploy aktif (push to main = auto deploy)
- **Teknoloji:** Statik HTML site, Netlify Functions (demo-request.js, emails)
- **Tema:** Koyu/Açık toggle — koyu temada logo-color-bg.png.jpg kullanılıyor (turuncu renkli logo gelecek)
- **Blog:** Yeni yazılar eklendiğinde blog.html'e kart ekle + HTML dosyası oluştur + git push = otomatik canlı
- **gh auth:** ayhanagirgol hesabı ile login (gh CLI)
- **Netlify auth:** finhouse account'u
- **Yapılan değişiklikler:** Partner firma isimleri kaldırıldı, yetkinlik bazlı yapıya geçildi, "Çözüm Ekosistemi" olarak yeniden adlandırıldı
- **Not:** CI/CD kurulumunda Netlify repo bağlantısı unlink + relink yapılması gerekti (deploy key sorunu)
- **Not:** Blog yazılarında linkleri mutlaka ekle (mail formatı kuralı burada da geçerli)

## Rehber Senkronizasyonu (2026-03-23)
- `contacts.md` ve `contacts_lookup.json` iki ayrı rehber kaynağı — her ikisi de güncel tutulmalı
- WhatsApp agent `contacts.md`'yi güncelliyor, webchat agent `contacts_lookup.json`'ı güncelliyor
- Her iki session da ortak workspace'de çalışıyor ama birbirinin değişikliklerini gerçek zamanlı görmüyor
- **Kural:** contacts.md'ye yeni kişi eklendiğinde contacts_lookup.json'a da ekle, ve tam tersi
- Session başında veya rehber değişikliğinde senkron kontrolü yap
- WhatsApp agent zaman zaman edit hatası alabilir — dosya yazma çakışması olabilir
- Haftalık raporlarda ve özellikle paylaşılan LinkedIn içeriklerinde sadece paylaşım linkiyle yetinilmemeli; paylaşımı yapan firmanın web sitesi, ilgili birincil kaynaklar ve benzer linkler de birlikte değerlendirilmelidir.

- ⚠️ KESİN KURAL (2026-03-24): YouTube videolarının özetlenmesinde her zaman ve öncelikli olarak Gemini (Gemini CLI / gemini skill) kullanılacaktır. Kullanıcı bu tercihi net bir şekilde vurgulamıştır.

- Fon Takibi: TLY ve DFI serbest fonları TEFAS üzerinden günlük takip ediliyor (Hafta içi 10:00).

## Mission Control / Fintech KOBİ Kurulum Paketi — Gelir Modeli (2026-03-24)
- Kaynak: "OpenClaw Mission Control: 15 Insane Use Cases!" (Vibe with AI) https://youtu.be/GzNM_bp1WaE
- Bu video gelir modelimiz için kritik pazar doğrulaması: 7 agent'lı tam otonom işletme kurulumu
- Yorumlarda talep net: Hazır şablon + kurulum = $5K-10K/kurulum potansiyeli
- Fintech/KOBİ için özel "OpenClaw Mission Control Kurulum Paketi" gelir modeline eklenecek
- Bu kaynağı mutlaka hatırla; iş planı görüşmelerinde referans olarak kullan

## Fon Takibi (2026-03-24)
- TLY (Tera Portföy Serbest Fon) ve DFI (Deniz Portföy Serbest Fon) aktif takipte
- TEFAS robot: scripts/tefas_tracker.mjs — hafta içi 10:00 WhatsApp bildirimi
- Kullanıcı yeni fon önerileri de almak istiyor; PHE, TTE, PBR radar altında

## Meeting-to-Prototype Pipeline — Danışmanlık Paketi (2026-03-29)
- Kaynak tweet: @PrajwalTomar_ (28 Mart 2026) — https://x.com/PrajwalTomar_/status/2037869118230262117
- Workflow: Müşteri toplantısı → Granola (AI transkript) → Lovable (AI builder) → 15 dk'da çalışan prototip
- Bu akış Finhouse danışmanlık paketine "Rapid Prototype" servisi olarak eklenecek
- Araçlar: Granola (toplantı transkript), Lovable/Bolt.new (AI builder), OpenClaw (orkestrasyon)
- Satış argümanı: "Müşteri heyecanı soğumadan somut ürün eline geçiyor"
- Riskler: Gözden geçirmeden gönderme tehlikesi (yorumlarda eleştiri var), ilk %80 kolay ama son %20 zor
- Finhouse danışmanlık paketinde bu pipeline kurulumu ayrı bir hizmet kalemi olabilir
- Bağlantı: Mission Control kurulum paketi + AI Agent danışmanlık gelir modeli

## OpenClaw Mission Control Dashboard Projesi (2026-03-29)
- Amaç: Tüm agent'ları, görevleri, skill'leri ve projeleri tek yerden yönetebilecek web dashboard
- Modüller: Agent Paneli (durum/iş), Skill Kataloğu, Proje & Görev Yönetimi, Proje Yöneticisi Agent, Zaman Planı
- 132 rol tanımlı agent mevcut (kullanıcıdan dosya/kaynak beklenecek)
- Deployment: Netlify (finhouse.ai CI/CD modeli gibi)
- ClawHub ürünü olarak satışa sunulabilir
- Teknik kararlar (React/statik HTML, backend vb.) belirlenmeli

## Kalıcı Talimat: İş Çıktılarını Mail ile Bildir (2026-03-29)
- Tamamlanan işlerin çıktılarını (mail sınıflandırma, sabah brifingi, inbox sort vb.) ayhan.agirgol@finhouse.com.tr adresine kısa özet mail olarak da ilet.
- Bu kalıcı bir talimattır — her iş tamamlandığında uygulanacak.

## FirmaCom vs Finhouse Ayrımı (2026-03-29)
- **FirmaCom:** Mobil uygulama ürünü — KOBİ belge yönetimi + hizmet talebi platformu
  - Gelir: Lead gen komisyon (banka/POS/operatör) + reklam + premium abonelik
  - Müşteri: KOBİ'ler (B2C/B2SMB)
- **Finhouse (finhouse.ai):** Şirket — AI çözümleri + fintech danışmanlık hizmeti
  - Gelir: AI danışmanlık + ClawHub skill satışı + managed hosting
  - Müşteri: Şirketler (B2B)
- Finhouse, FirmaCom'un sahibi/geliştiricisi — iki ayrı marka, iki ayrı iş modeli
- ClawHub skill'leri Finhouse markasıyla yayınlanıyor (finhouse.ai CTA)
- FirmaCom uygulamasında Finhouse markası footer'da görünüyor
