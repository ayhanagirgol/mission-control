# Microsoft 365 Mail via Microsoft Graph (Client Credentials)

This workspace uses **Application permissions** (client credentials) to send and read mail from a Microsoft 365 mailbox.

## Files

- `ms_graph_mail.js` — send a test email + list the last 5 messages (metadata only)

## Environment

Put these in `.env` (workspace root):

- `MS_CLIENT_ID`
- `MS_TENANT_ID`
- `MS_CLIENT_SECRET`

Optional:

- `MAILBOX_UPN` (default: `ayhan.agirgol@finhouse.com.tr`)
- `TEST_TO` (default: `ayhan.agirgol@gmail.com`)

## Run

```bash
cd ~/.openclaw/workspace
node ms_graph_mail.js
```

## Azure / Entra prerequisites

- App Registration must have admin-consented **Application permissions** such as:
  - `Mail.Send`
  - `Mail.Read`
- Many tenants also enforce Exchange **Application Access Policy** to scope mailbox access.

## APIs used

- Token: `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token` with:
  - `grant_type=client_credentials`
  - `scope=https://graph.microsoft.com/.default`
- Graph:
  - `POST https://graph.microsoft.com/v1.0/users/{MAILBOX_UPN}/sendMail`
  - `GET https://graph.microsoft.com/v1.0/users/{MAILBOX_UPN}/messages`

## Notes

- Don’t commit `.env`.
- Rotate secrets if they ever leak.
