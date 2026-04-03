# Notion Reports & Research Archive

## Database
- **DB ID:** 5e930001-4635-432d-a933-639a419cfd7f
- **Parent Page:** 📋 Günlük Raporlar & Agent Çıktıları (332d4f17-ff64-8147-9a28-d8a76ff2b54a)
- **API Key:** `~/.config/notion/api_key`
- **Notion-Version:** 2025-09-03

## Properties
| Property | Type | Options |
|---|---|---|
| Title | title | Rapor başlığı |
| Type | select | Beyttürk Haftalık, CRM Araştırma, Orbina Haftalık, Co-one Haftalık, Türkkep Yönetim, KEP Watch, Fintech Günlük, Finance+AI Günlük |
| Date | date | Rapor tarihi (ISO 8601) |
| Status | select | Draft, Sent, Archived |
| Agent | select | Main, Türkkep, Orbina, Co-one, CRM, Bulut |

## Kayıt Yöntemi
Rapor tamamlandığında:
1. Notion'a page olarak ekle (parent: database_id yukarıdaki)
2. Title: "[Tip] Rapor — [tarih]"
3. İçeriği page body'sine children block olarak ekle
4. Status: "Sent" (mail gönderildiyse)

## Mail Gönderimi
- Alıcı: ayhan.agirgol@finhouse.com.tr
- Script: node /Users/baykus/.openclaw/workspace/scripts/send_report_email.js
- Gönderici: ayhan.agirgol@gmail.com (Gmail SMTP)
