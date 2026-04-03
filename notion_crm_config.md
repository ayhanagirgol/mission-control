# Notion CRM — Yapılandırma Referansı

## Bağlantı
- API Key: `~/.config/notion/api_key` (ntn_ prefix)
- Notion-Version: 2025-09-03

## CRM Sayfası
- Page ID: `219d4f17-ff64-8062-a1e7-c56cc64f8b3f`
- URL: https://www.notion.so/CRM-219d4f17ff648062a1e7c56cc64f8b3f

## Veritabanları

### Clients Database
- Database ID: `219d4f17-ff64-8185-aac3-c6366eb4b347`
- Data Source ID: `219d4f17-ff64-8105-8a95-000b403ae500`
- Alanlar: Company (title), Status (select), Lead Source (select), Tags (multi_select), Email, Phone, Point Person, Address, Last Contact, Account Owner, Added
- Status seçenekleri: Lead, Prospect, Active Customer, Inactive Customer
- Lead Source: Referral, Website, Social Media, Event, Form, LinkedIn, DMO/İhale, Webrazzi, X/Twitter, Mail, WhatsApp

### Deal Pipeline
- Database ID: `219d4f17-ff64-8122-8ef7-f5ae449bad28`
- Data Source ID: `219d4f17-ff64-81e6-95e4-000b67fc2157`
- Alanlar: Deal Name (title), Deal Stage (status), Close Date, Deal Value, Customer (relation→Clients), Activities (relation→Activities)

### Activities
- Database ID: `219d4f17-ff64-818e-8fa1-e1e05ef35e1d`
- Data Source ID: `219d4f17-ff64-81c6-ab12-000beb5ece20`
- Alanlar: Description (title), Date, Deal (relation→DealPipeline), Follow-up Required (checkbox), Assigned To, Outcome

### Opentext-Müşteri2 (eski tablo)
- Database ID: `219d4f17-ff64-8049-8374-c518cae06307`

## Önemli Notlar
- 2025-09-03 API'sinde database endpoint'i properties döndürmüyor → data_sources endpoint kullan
- Page oluşturmada `parent.database_id` kullan, sorgularda `data_source_id` kullan
- Rate limit: ~3 req/sec, 0.4s delay yeterli
- İş Kolu ve Sıcaklık property'leri database endpoint üzerinden oluşturuldu ama data_source'ta görünmedi → Notion UI'dan eklenebilir veya ileride API güncellemesiyle düzelir

---
*Son güncelleme: 26 Mart 2026*
