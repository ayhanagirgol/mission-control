import fs from 'fs';

for (const line of fs.readFileSync('./.env', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.*)\s*$/);
  if (!m) continue;
  let v = m[2] || '';
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1);
  if (!(m[1] in process.env)) process.env[m[1]] = v;
}

const clientId = process.env.TURKKEP_MS_CLIENT_ID;
const tenantId = process.env.TURKKEP_MS_TENANT_ID;
const clientSecret = process.env.TURKKEP_MS_CLIENT_SECRET;
const mailbox = 'ayhan.agirgol@turkkep.com.tr';

async function getToken() {
  const r = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials', scope: 'https://graph.microsoft.com/.default' }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(j));
  return j.access_token;
}

const signature = fs.readFileSync('turkkep_signature.html', 'utf8');

const bodyHtml = `
<div style="font-family:Tahoma,sans-serif; font-size:10pt; color:#222;">
<p>Melikşah merhaba, Tan merhaba,</p>

<p>Endpoint Central'dan gelen son raporlara göre patch deployment durumumuz ciddi biçimde kötüleşiyor ve bu haliyle kabul edilemez:</p>

<p><b>Mevcut Durum (3 Nisan 2026):</b></p>
<ul>
  <li>Toplam makine: <b>75</b></li>
  <li>Tamamlanan: <b>7</b> (%9)</li>
  <li>Başarısız: <b>16</b></li>
  <li>Eksik: <b>45</b> (%60)</li>
</ul>

<p>Dün 37 olan eksik sayısı bugün 45'e çıkmış. Bu, yamalar uygulanmak yerine eksik havuzunun büyüdüğünü gösteriyor. Şubat ayında yaşadığımız güvenlik olayını düşündüğümüzde, 45 makinede kritik yamaların eksik olması doğrudan risk oluşturuyor.</p>

<p><b>Sorum şu:</b></p>
<ol>
  <li><b>Neden bu kadar eksik var?</b> Deployment neden başarısız oluyor? Makine erişim sorunu mu, disk alanı mı, restart politikası mı?</li>
  <li><b>FortiNAC kayıt sorunu bunu ağırlaştırıyor mu?</b> 9 Mart'tan beri yeni kullanıcı/PC'ler NAC'a register olamıyor. Bu makineler güncelleme de alamıyor olabilir.</li>
  <li><b>Aksiyon planı ve takvim:</b> Hangi adımları ne zaman atacaksınız? Başarısız 16 makine ve eksik 45 makine için ayrı ayrı plan bekliyorum. Haftaya Pazartesi (7 Nisan) gününe kadar en az eksik sayısını 20'nin altına çekmemiz lazım.</li>
</ol>

<p>Lütfen bugün içinde kısa bir durum değerlendirmesi ve aksiyon planı iletin.</p>

<p>Teşekkürler</p>
<br/>
${signature}
</div>
`;

const payload = {
  message: {
    subject: 'ACİL: Patch Deployment Durumu — Aksiyon Planı Gerekiyor',
    body: { contentType: 'HTML', content: bodyHtml },
    toRecipients: [
      { emailAddress: { address: 'meliksah.canol@turkkep.com.tr', name: 'Melikşah Canol' } },
      { emailAddress: { address: 'tan.kocabiyik@turkkep.com.tr', name: 'Tan Kocabıyık' } },
    ],
  },
  saveToSentItems: true,
};

(async () => {
  const token = await getToken();
  const r = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (r.status === 202) {
    console.log('✅ Mail gönderildi: Melikşah + Tan');
  } else {
    const t = await r.text();
    throw new Error(`Gönderim hatası ${r.status}: ${t}`);
  }
})();
