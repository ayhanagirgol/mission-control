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

const html = `<p>Aytekin Bey merhaba,</p>

<p>Sormuş olduğunuz konuyla ilgili detaylı bilgileri aşağıda paylaşıyorum.</p>

<p>Çek işleme sürecimiz şu şekilde çalışmaktadır:</p>

<ul>
<li>Çek okuyucu sistemler arkalı-önlü doküman oluşturmakta olup, bu formatta gelen çeklerde ön yüz ile arka yüz otomatik olarak eşleştirilmektedir.</li>

<li>Çek arka yüzünü ön yüzüne bağlayacak bir referans bilgisi (barkod, numara vb.) bulunması durumunda da otomatik eşleştirme yapılabilmektedir.</li>

<li>Çek ön yüzleri yapay zekâ tarafından işlenerek talep edilen bilgiler (cirant VKN/TCKN dahil) otomatik olarak çıkarılmaktadır.</li>

<li>WhatsApp veya e-posta kanalıyla gelen fotoğraflarda birden fazla ön yüz ve arka yüz karışık şekilde iletilmişse, bu durumu tespit ederek müşteriye otomatik geri bildirim maili hazırlayıp iletebilmekteyiz. Böylece dokümanların doğru formatta tekrar gönderilmesi sağlanmaktadır.</li>

<li>Video formatındaki dosyalar işlenmemektedir.</li>
</ul>

<p>Ek sorularınız olursa memnuniyetle yanıtlarız. Dilediğiniz takdirde bir demo toplantısı planlayabiliriz.</p>

<p>Saygılarımla,<br>Ayhan Ağırgöl</p>`;

const mail = {
  message: {
    subject: 'RE: FinHouse Çözümleri',
    body: { contentType: 'HTML', content: html },
    toRecipients: [
      { emailAddress: { address: 'ACelebi3@burgan.com.tr', name: 'Aytekin Çelebi' } }
    ],
    ccRecipients: [
      { emailAddress: { address: 'IGogus@burgan.com.tr', name: 'İbrahim Halil Göğüş' } },
      { emailAddress: { address: 'MOlmuser@burgan.com.tr', name: 'Mert Olmuşer' } },
      { emailAddress: { address: 'SParlak@burgan.com.tr', name: 'Sercan Parlak' } },
      { emailAddress: { address: 'HPulurbey@burgan.com.tr', name: 'Hilal Hayal Pulurbey' } },
      { emailAddress: { address: 'CBilgen@burgan.com.tr', name: 'Celalettin Bilgen' } },
      { emailAddress: { address: 'nilgun.yenice@finhouse.com.tr', name: 'Nilgün Yenice' } },
      { emailAddress: { address: 'dilara.kaplan@orbina.ai', name: 'Dilara Kaplan' } },
      { emailAddress: { address: 'orkun.akyuz@orbina.ai', name: 'Orkun Akyüz' } }
    ],
    from: { emailAddress: { address: 'ayhan.agirgol@finhouse.com.tr', name: 'Ayhan Ağırgöl' } }
  },
  saveToSentItems: true
};

const res = await fetch('https://graph.microsoft.com/v1.0/users/ayhan.agirgol@finhouse.com.tr/sendMail', {
  method: 'POST', headers: { Authorization: 'Bearer ' + access_token, 'Content-Type': 'application/json' },
  body: JSON.stringify(mail)
});

if (res.status === 202) console.log('✅ Mail gönderildi: Aytekin Çelebi + CC: Burgan ekibi, Nilgün, Dilara, Orkun');
else { const j = await res.json(); console.log('❌', JSON.stringify(j.error)); }
