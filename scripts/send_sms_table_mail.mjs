import fs from 'fs';

const env = {};
fs.readFileSync('/Users/baykus/.openclaw/workspace/.env', 'utf8').split('\n').forEach(l => {
  const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) { let v = m[2]; if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1); env[m[1]] = v; }
});

const tokenRes = await fetch(`https://login.microsoftonline.com/${env.MS_TENANT_ID}/oauth2/v2.0/token`, {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: env.MS_CLIENT_ID, client_secret: env.MS_CLIENT_SECRET, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' })
});
const { access_token } = await tokenRes.json();

const html = `<p>Zeliha Hanım merhaba,</p>
<p>SMS hizmet sağlayıcı firma çalışmalarının durumunu takip edebilmek adına aşağıdaki tabloyu hazırladım. Bilgilerinizi ve güncel durumu eklemenizi rica ederim.</p>
<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial;font-size:13px;">
<thead style="background-color:#f2f2f2;">
<tr><th>Görüşülen Kurum</th><th>İletişim Kişisi</th><th>Durum</th><th>Açıklama / Notlar</th><th>Sonraki Adım</th></tr>
</thead>
<tbody>
<tr><td>Sahra Telekom</td><td>Emel Kara</td><td>Entegrasyon devam ediyor</td><td>e-İmza entegrasyonu sürüyor; müşterileri için e-imza talep etti, CRM'de ürün henüz açılmadı</td><td></td></tr>
<tr><td>Callturk Telekomünikasyon</td><td>Murat Topçu</td><td>Erişim izin formları bekleniyor</td><td>BTK uyum deadline: 1 Nisan 2026; formlar ve e-İmza teknik detayları bekleniyor</td><td></td></tr>
<tr><td>MutluCell</td><td>Bertan Küçük / Cevdet Öztürk</td><td>NDA imzalandı</td><td>NDA teslim edildi; entegrasyon dokümanı ve API talep edildi; gelir paylaşımı görüşülüyor</td><td></td></tr>
<tr><td>Asistan Telekom</td><td>—</td><td>Anlaşma sağlandı</td><td>Sibel Hanım'ın mailinde belirtildi</td><td></td></tr>
<tr><td>Corvass Telekom</td><td>—</td><td>Anlaşma sağlandı</td><td>Sibel Hanım'ın mailinde belirtildi</td><td></td></tr>
<tr><td>Datassist</td><td>Kemal Gür</td><td>Süreç tartışmalı</td><td>Cemal Bey dahil olmak istemiyor; Aykut Bey koordinasyonu üstlenebilir</td><td></td></tr>
</tbody>
</table>
<p>Eksik veya hatalı bilgi varsa lütfen düzeltin. <b>Durum, Açıklama ve Sonraki Adım</b> sütunlarını güncel tutmanızı rica ederim.</p>
<p>Teşekkürler,<br>Ayhan Ağırgöl<br>CTO, TÜRKKEP</p>`;

const mail = {
  message: {
    subject: 'SMS Hizmet Sağlayıcı Firma Durum Tablosu',
    body: { contentType: 'HTML', content: html },
    toRecipients: [{ emailAddress: { address: 'zeliha.colak@turkkep.com.tr', name: 'Zeliha Colak' } }],
    from: { emailAddress: { address: 'ayhan.agirgol@finhouse.com.tr', name: 'Ayhan Ağırgöl' } }
  },
  saveToSentItems: true
};

const res = await fetch('https://graph.microsoft.com/v1.0/users/ayhan.agirgol@finhouse.com.tr/sendMail', {
  method: 'POST', headers: { Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json' },
  body: JSON.stringify(mail)
});

if (res.status === 202) console.log('✅ Mail gönderildi: zeliha.colak@turkkep.com.tr');
else { const j = await res.json(); console.log('❌', JSON.stringify(j.error)); }
