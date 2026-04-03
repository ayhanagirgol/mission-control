# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Local Setup Notes

### Microsoft 365 (Graph) mail send/read

- Script: `ms_graph_mail.js` (workspace root)
- Auth model: **Application permissions (client credentials)**
- Required env vars (in `.env`):
  - `MS_CLIENT_ID`
  - `MS_TENANT_ID`
  - `MS_CLIENT_SECRET`
- Defaults:
  - `MAILBOX_UPN=ayhan.agirgol@finhouse.com.tr`
  - `TEST_TO=ayhan.agirgol@gmail.com`
- Graph endpoints used:
  - `POST /v1.0/users/{MAILBOX_UPN}/sendMail` (saveToSentItems=true)
  - `GET /v1.0/users/{MAILBOX_UPN}/messages?$top=5&$orderby=receivedDateTime desc`

Notes:
- Needs Entra ID app with admin-consented **Application permissions** (e.g. `Mail.Send`, `Mail.Read`).
- Some tenants also require Exchange **Application Access Policy** to allow mailbox access.

### Keenetic WebDAV (Network Disk)

- URL: `https://finhouse.keenetic.link/webdav/`
- Auth: URL-embedded format → `https://$KEENETIC_USER:$KEENETIC_PASS@finhouse.keenetic.link/webdav/`
- Credentials: `.env` → `KEENETIC_USER`, `KEENETIC_PASS`
- Keenetic IP: 192.168.1.7 (LAN), ZTE modem: 192.168.1.1
- Disk: Western Digital Elements 25A3 (~5.46 TB)
- Not: `curl -u` çalışmıyor, URL içinde `login:password@` formatı gerekiyor (Keenetic özel)
- Klasörler: Backup Files, DropBox.tib (yedek)

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
