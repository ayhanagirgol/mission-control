import smtplib
import ssl
from pathlib import Path

vals = {}
for line in Path('.env').read_text().splitlines():
    if not line or line.lstrip().startswith('#') or '=' not in line:
        continue
    k, v = line.split('=', 1)
    vals[k.strip()] = v.strip().strip('"').strip("'")

user = vals['GMAIL_EMAIL']
pwd = vals['GMAIL_APP_PASSWORD']
to = 'ayhan.agirgol@finhouse.com.tr'
msg = (
    f"From: {user}\r\n"
    f"To: {to}\r\n"
    "Subject: Gmail test from OpenClaw SMTP\r\n"
    "\r\n"
    "Merhaba,\r\n"
    "\r\n"
    "Bu OpenClaw tarafindan Gmail SMTP ile gonderilmis test e-postasidir.\r\n"
    "\r\n"
    "Saat: 2026-03-14 23:16 Europe/Istanbul\r\n"
)

with smtplib.SMTP('smtp.gmail.com', 587, timeout=30) as s:
    s.ehlo()
    s.starttls(context=ssl.create_default_context())
    s.ehlo()
    s.login(user, pwd)
    s.sendmail(user, [to], msg.encode('utf-8'))

print('SENT')
