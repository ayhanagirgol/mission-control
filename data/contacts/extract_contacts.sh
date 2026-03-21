#!/usr/bin/env bash
# Extract contacts from all configured mailboxes into per-source CSV files.
# Safe: read-only, no outbound messages.
set -euo pipefail
cd "$(dirname "$0")"
WORKSPACE="$(cd ../.. && pwd)"

CSV_HEADER="email,name,domain,company_hint,direction,count,first_seen,last_seen,source_mailbox,notes"

# ── Helper: extract contacts from Graph API JSON ──
extract_graph() {
  local PROFILE="$1" MAILBOX="$2" OUTFILE="$3" TOP="${4:-200}"
  echo "→ Extracting $MAILBOX via Graph ($PROFILE)..."
  
  # Fetch messages using ms_graph_mail.js (read action)
  MAIL_PROFILE="$PROFILE" node "$WORKSPACE/ms_graph_mail.js" read --top "$TOP" --json 2>/dev/null \
    | python3 "$WORKSPACE/data/contacts/parse_graph_contacts.py" "$MAILBOX" \
    > "$OUTFILE"
  echo "  Wrote $OUTFILE ($(wc -l < "$OUTFILE") lines)"
}

# ── Helper: extract contacts from himalaya (IMAP) ──
extract_himalaya() {
  local ACCOUNT="$1" MAILBOX="$2" OUTFILE="$3" LIMIT="${4:-200}"
  echo "→ Extracting $MAILBOX via himalaya ($ACCOUNT)..."
  
  # List inbox + sent
  {
    himalaya -a "$ACCOUNT" envelope list -f inbox -s "$LIMIT" -o json 2>/dev/null || true
    himalaya -a "$ACCOUNT" envelope list -f sent -s "$LIMIT" -o json 2>/dev/null || true
  } | python3 "$WORKSPACE/data/contacts/parse_himalaya_contacts.py" "$MAILBOX" \
    > "$OUTFILE"
  echo "  Wrote $OUTFILE ($(wc -l < "$OUTFILE") lines)"
}

echo "=== Mailbox Contact Extraction ==="
echo ""

# Finhouse (Graph, default profile)
extract_graph "" "ayhan.agirgol@finhouse.com.tr" "finhouse.csv" 500 || echo "⚠ Finhouse extraction failed"

# Türkkep (Graph, turkkep profile)
extract_graph "turkkep" "ayhan.agirgol@turkkep.com.tr" "turkkep.csv" 500 || echo "⚠ Türkkep extraction failed"

# Gmail (himalaya)
extract_himalaya "gmail" "ayhan.agirgol@gmail.com" "gmail.csv" 500 || echo "⚠ Gmail extraction failed"

# Bulutistan — no credentials yet
echo "→ Bulutistan: skipped (no credentials configured)"
echo "$CSV_HEADER" > bulutistan.csv

echo ""
echo "=== Done ==="
