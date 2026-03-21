#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
MAILBOX="ayhan.agirgol@gmail.com"
PAGE=500

echo "Fetching inbox..." >&2
himalaya envelope list --account gmail --folder inbox --page-size $PAGE -o json 2>/dev/null > /tmp/gmail_inbox.json || true
echo "Fetching sent..." >&2
himalaya envelope list --account gmail --folder sent --page-size $PAGE -o json 2>/dev/null > /tmp/gmail_sent.json || true

python3 - "$MAILBOX" /tmp/gmail_inbox.json /tmp/gmail_sent.json <<'PYEOF'
import json, sys, csv, io
from collections import defaultdict

mailbox = sys.argv[1].lower()
contacts = {}  # email -> {name, dirs, dates}

def add(email, name, direction, date):
    if not email: return
    e = email.lower().strip()
    if e == mailbox: return
    if e not in contacts:
        contacts[e] = {"name": name or "", "dirs": set(), "dates": []}
    c = contacts[e]
    c["dirs"].add(direction)
    if name and len(name) > len(c["name"]):
        c["name"] = name
    if date:
        c["dates"].append(date)

for fpath, default_dir in [(sys.argv[2], "from"), (sys.argv[3], "to")]:
    try:
        data = json.load(open(fpath))
    except: continue
    for env in data:
        d = env.get("date", "")
        fr = env.get("from", {})
        to = env.get("to", {})
        if default_dir == "from":
            add(fr.get("addr"), fr.get("name"), "from", d)
            add(to.get("addr"), to.get("name"), "to", d)
        else:
            add(to.get("addr"), to.get("name"), "to", d)
            add(fr.get("addr"), fr.get("name"), "from", d)

w = csv.writer(sys.stdout)
w.writerow(["email","name","domain","company_hint","direction","count","first_seen","last_seen","source_mailbox","notes"])
for email, c in sorted(contacts.items(), key=lambda x: -len(x[1]["dates"])):
    domain = email.split("@")[1] if "@" in email else ""
    import re
    company = re.sub(r"\.(com|net|org|co|com\.tr|gov\.tr|edu\.tr|tr|io|ai|dev)(\..+)?$", "", domain, flags=re.I).rsplit(".", 1)[-1]
    dirs = "both" if "from" in c["dirs"] and "to" in c["dirs"] else list(c["dirs"])[0]
    dates = sorted(c["dates"])
    w.writerow([email, c["name"], domain, company, dirs, len(c["dates"]), dates[0] if dates else "", dates[-1] if dates else "", mailbox, ""])
PYEOF
