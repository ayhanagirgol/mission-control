#!/usr/bin/env node
/**
 * Teams Toplantısı Kurulum Scripti v2
 * 1. Calendar event + isOnlineMeeting ile Teams linki oluştur
 * 2. Davet maili gönder (Aykut + Dilek)
 */

require('dotenv').config({ path: '/Users/baykus/.openclaw/workspace/.env' });

const { MS_CLIENT_ID, MS_TENANT_ID, MS_CLIENT_SECRET } = process.env;
const MAILBOX = 'ayhan.agirgol@finhouse.com.tr';

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: MS_CLIENT_ID,
    client_secret: MS_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json();
  if (!data.access_token) {
    console.error('Token alınamadı:', JSON.stringify(data));
    process.exit(1);
  }
  return data.access_token;
}

async function createCalendarEventWithTeams(token) {
  const url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/events`;

  const htmlBody = `
    <p>Merhaba,</p>
    <p>Sizi aşağıdaki Microsoft Teams toplantısına davet etmekten memnuniyet duyarım.</p>
    <p>Görüşme konusu: Süleyman Şener ile iş görüşmesi.</p>
    <br>
    <p>Saygılarımla,<br>Ayhan Ağırgöl<br>Finhouse</p>
  `;

  const body = {
    subject: 'Görüşme — Ayhan Ağırgöl & Süleyman Şener',
    start: {
      dateTime: '2026-04-04T14:00:00',
      timeZone: 'Turkey Standard Time',
    },
    end: {
      dateTime: '2026-04-04T15:00:00',
      timeZone: 'Turkey Standard Time',
    },
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
    attendees: [
      {
        emailAddress: { address: 'aykut.kutlusan@turkkep.com.tr', name: 'Aykut Kutlusan' },
        type: 'required',
      },
      {
        emailAddress: { address: 'dilek.akyurek@turkkep.com.tr', name: 'Dilek Akyürek' },
        type: 'required',
      },
    ],
    body: {
      contentType: 'html',
      content: htmlBody,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'outlook.timezone="Turkey Standard Time"',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Takvim etkinliği oluşturulamadı:', JSON.stringify(data, null, 2));
    return null;
  }

  const joinUrl = data.onlineMeeting?.joinUrl || data.onlineMeetingUrl || null;
  console.log('✅ Takvim etkinliği oluşturuldu:', data.id);
  console.log('Teams join URL:', joinUrl);
  return { event: data, joinUrl };
}

async function sendInviteEmail(token, joinUrl) {
  const url = `https://graph.microsoft.com/v1.0/users/${MAILBOX}/sendMail`;

  const htmlBody = `
    <p>Merhaba,</p>
    <p>Sizi aşağıdaki Microsoft Teams toplantısına davet etmekten memnuniyet duyarım:</p>
    <br>
    <table style="border-collapse:collapse; font-family:Arial,sans-serif;">
      <tr><td style="padding:4px 8px;"><strong>Konu</strong></td><td style="padding:4px 8px;">Görüşme — Ayhan Ağırgöl & Süleyman Şener</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Tarih</strong></td><td style="padding:4px 8px;">Cuma, 4 Nisan 2026</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Saat</strong></td><td style="padding:4px 8px;">14:00 – 15:00 (Türkiye Saati)</td></tr>
      <tr><td style="padding:4px 8px;"><strong>Platform</strong></td><td style="padding:4px 8px;">Microsoft Teams</td></tr>
    </table>
    <br>
    ${joinUrl ? `<p><strong>Katılım Linki:</strong><br><a href="${joinUrl}">${joinUrl}</a></p>` : '<p><em>(Teams linki takvim davetiyesinde mevcuttur)</em></p>'}
    <br>
    <p><strong>Katılımcılar:</strong></p>
    <ul>
      <li>Ayhan Ağırgöl (Organizatör) — Finhouse</li>
      <li>Aykut Kutlusan — Türkkep</li>
      <li>Dilek Akyürek — Türkkep</li>
      <li>Süleyman Şener</li>
    </ul>
    <br>
    <p>Takvim davetiyesi ayrıca iletilecektir. Herhangi bir sorunuz olursa lütfen benimle iletişime geçin.</p>
    <br>
    <p>Saygılarımla,<br>
    <strong>Ayhan Ağırgöl</strong><br>
    Finhouse<br>
    ayhan.agirgol@finhouse.com.tr</p>
  `;

  const body = {
    message: {
      subject: 'Teams Toplantısı — Cuma 4 Nisan 2026, 14:00',
      body: {
        contentType: 'html',
        content: htmlBody,
      },
      toRecipients: [
        { emailAddress: { address: 'aykut.kutlusan@turkkep.com.tr', name: 'Aykut Kutlusan' } },
        { emailAddress: { address: 'dilek.akyurek@turkkep.com.tr', name: 'Dilek Akyürek' } },
      ],
      from: {
        emailAddress: { address: MAILBOX, name: 'Ayhan Ağırgöl' }
      },
    },
    saveToSentItems: true,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status === 202) {
    console.log('✅ Davet maili gönderildi → Aykut Kutlusan, Dilek Akyürek');
    return true;
  } else {
    const data = await res.json();
    console.error('Mail gönderilemedi:', JSON.stringify(data, null, 2));
    return false;
  }
}

async function main() {
  console.log('🔑 Access token alınıyor...');
  const token = await getAccessToken();
  console.log('✅ Token alındı\n');

  console.log('📆 Takvim etkinliği (Teams meeting) oluşturuluyor...');
  const result = await createCalendarEventWithTeams(token);
  if (!result) {
    console.error('❌ Etkinlik oluşturulamadı, durduruluyor.');
    process.exit(1);
  }
  const { event, joinUrl } = result;

  console.log('\n📧 Davet maili gönderiliyor...');
  const mailSent = await sendInviteEmail(token, joinUrl);

  console.log('\n=============================');
  console.log('📋 ÖZET');
  console.log('=============================');
  console.log(`Teams Linki: ${joinUrl || '(takvim davetiyesinde)'}`);
  console.log(`Takvim Etkinliği ID: ${event?.id}`);
  console.log(`Davet Maili: ${mailSent ? '✅ Gönderildi' : '❌ Gönderilemedi'}`);
  
  const suleymanDraft = `Sayın Süleyman Bey,

Cuma günü sizi bir Teams görüşmesine davet etmek istiyorum.

Tarih: 4 Nisan 2026, Cuma
Saat: 14:00 – 15:00 (Türkiye Saati)
Platform: Microsoft Teams
${joinUrl ? `\nKatılım Linki:\n${joinUrl}` : ''}

Görüşmek üzere,
Ayhan Ağırgöl
Finhouse
ayhan.agirgol@finhouse.com.tr`;

  console.log('\n--- Süleyman Şener için taslak mail ---');
  console.log('Konu: Cuma Görüşmesi — 4 Nisan 2026, 14:00 Teams');
  console.log(suleymanDraft);

  const output = {
    joinUrl: joinUrl || null,
    eventId: event?.id,
    mailSent,
    suleymanDraft,
  };
  console.log('\nJSON_RESULT:', JSON.stringify(output));
}

main().catch(console.error);
