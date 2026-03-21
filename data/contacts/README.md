# Mailbox Contact Tables

Per-mailbox contact frequency tables extracted from email data.
Each source has its own CSV file — never merged.

## Schema (shared across all files)

| Column | Description |
|--------|-------------|
| email | Email address (lowercase, canonical) |
| name | Display name (best guess from headers) |
| domain | Domain part of email |
| company_hint | Inferred company/org from domain |
| direction | `from` / `to` / `both` |
| count | Total message count involving this contact |
| first_seen | Earliest message date (ISO 8601) |
| last_seen | Latest message date (ISO 8601) |
| source_mailbox | Which mailbox this was extracted from |
| notes | Any extra context |

## Files

- `finhouse.csv` — ayhan.agirgol@finhouse.com.tr (Graph API)
- `turkkep.csv` — ayhan.agirgol@turkkep.com.tr (Graph API)
- `gmail.csv` — ayhan.agirgol@gmail.com (himalaya / IMAP)
- `bulutistan.csv` — TBD (no credentials configured yet)

## How to Refresh

See `extract_contacts.sh` in this directory.
