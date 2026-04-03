# Orbina Pipeline / Inbox Signals

_Last updated: 2026-04-03_

## Son 24 saat - Mailbox taraması ("orbina" keyword)

### Finhouse (ayhan.agirgol@finhouse.com.tr)
- Graph API ile "orbina" araması yapıldı.
- **Sonuç: Son 24 saatte yeni orbina yazışması yok.**

### Gmail (ayhan.agirgol@gmail.com)
- Gmail OAuth token süresi dolmuş (`invalid_grant`). Yenileme gerekiyor.
- **Not:** Gmail yeniden authorize edilmeli → `gog auth login` ile token yenilenebilir.

---

## Geçmiş Sinyaller (Önceki kayıtlar)

- Eski yazışmalardan **Fathom toplantı özeti** ve **Finhouse & Orbina Takip** mesajları mevcut (tarih: önceki haftalar).

---

## Aksiyon Gerektiren

| Madde | Detay | Öncelik |
|-------|-------|---------|
| Gmail token yenileme | `gog auth login` ile Google OAuth yenile | Orta |
| Orbina demo takibi | Fathom toplantı özetinden gelen follow-up var mı? | Kontrol et |

---

_[[Orbina daily training cron update — 2026-04-03]]_
