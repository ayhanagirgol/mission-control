# Contact Lookup Notes

Kaynak dosyalar:
- `/Users/baykus/.openclaw/workspace/abomaali@alsaqi.iq ve 2.966 kişi daha.vcf`
- `/Users/baykus/.openclaw/workspace/contacts.vcf`

WhatsApp lookup için çalışma yaklaşımı:
1. Önce büyük vCard dosyasında isim/telefon ara.
2. Telefonları normalize et (`+90...` tercih).
3. Bozuk / kısa / sabit hat kayıtlarını ayıkla.
4. WhatsApp mesaj gönderiminde önce bu lookup kaynağını kullan.

Hazır ara çıktı:
- `/Users/baykus/.openclaw/workspace/tmp/whatsapp_name_phone_map.txt`
- Toplam isim→telefon satırı: 2820
