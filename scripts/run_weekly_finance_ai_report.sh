#!/bin/bash
set -euo pipefail
cd /Users/baykus/.openclaw/workspace
exec /Users/baykus/.openclaw/workspace/.venv-reports/bin/python /Users/baykus/.openclaw/workspace/scripts/report_jobs.py weekly_finance_ai --to ayhan.agirgol@gmail.com
