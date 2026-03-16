#!/bin/bash
set -euo pipefail
cd /Users/baykus/.openclaw/workspace
exec /usr/bin/python3 /Users/baykus/.openclaw/workspace/scripts/report_jobs.py weekly_fintech --to ayhan.agirgol@gmail.com
