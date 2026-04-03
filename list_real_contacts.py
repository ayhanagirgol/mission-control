import json, re

d = json.load(open('/tmp/all_senders.json'))

SKIP = [
    r'no.?reply', r'donotreply', r'noreply', r'notifications@', r'drive-shares',
    r'infoemails', r'myactivecampaign', r'substack\.com', r'godaddy', r'apple\.com',
    r'microsoft\.com', r'\.ito\.org', r'members\.', r'o=exchangelabs', r'crowdcasts@',
    r'publishing@email\.', r'team@learn\.', r'team@marketing\.', r'marketing@',
    r'newsletter', r'bulten', r'\.wixemails\.', r'bounce', r'mailer-',
    r'postmaster', r'abuse@', r'activecampaign', r'sendgrid', r'mailchimp',
    r'e\.egeyapi', r'em\.ikas', r'erp\.uyumsoftmail', r'billing@',
    r'@em\.', r'@email\.', r'automated', r'system@', r'alert@',
    r'info@pb', r'social@', r'connect@', r'news@', r'hello@',
]
SKIP_EXACT = {'ayhan.agirgol@finhouse.com.tr', 'ayhan.agirgol@gmail.com'}

real = {k: v for k, v in d.items()
        if k not in SKIP_EXACT
        and not any(re.search(p, k, re.I) for p in SKIP)}

print(f'Toplam: {len(d)} | Gerçek kişi: {len(real)}\n')
for k, v in sorted(real.items(), key=lambda x: x[1].lower()):
    print(f'{v} <{k}>')

# Dosyaya da yaz
with open('/tmp/real_contacts.txt', 'w') as f:
    for k, v in sorted(real.items(), key=lambda x: x[1].lower()):
        f.write(f'{v} <{k}>\n')
print(f'\n/tmp/real_contacts.txt dosyasına yazıldı.')
