#!/bin/bash
# OpenClaw Workspace Backup → Keenetic WebDAV
# Cron ile günlük çalıştırılır

set -euo pipefail

# .env'den credentials yükle
source /Users/baykus/.openclaw/workspace/.env

WORKSPACE="/Users/baykus/.openclaw/workspace"
DATE=$(date +%Y-%m-%d)
BACKUP="/tmp/openclaw_workspace_${DATE}.tar.gz"
WEBDAV_URL="https://${KEENETIC_USER}:${KEENETIC_PASS}@finhouse.keenetic.link/webdav/Backup%20Files"

# Eski local backup'ı temizle
rm -f /tmp/openclaw_workspace_*.tar.gz 2>/dev/null || true

# Tar oluştur (git, node_modules, log hariç)
tar -czf "$BACKUP" \
  -C "$WORKSPACE" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='*.log' \
  --exclude='.env' \
  . 2>/dev/null

SIZE=$(du -sh "$BACKUP" | cut -f1)

# WebDAV'a yükle (timeout 10 dakika)
if curl -s --max-time 600 -T "$BACKUP" "${WEBDAV_URL}/openclaw_workspace_${DATE}.tar.gz"; then
  echo "✅ Backup başarılı: ${SIZE} → WebDAV (${DATE})"
  
  # 7 günden eski backup'ları sil (WebDAV'da)
  for i in $(seq 8 30); do
    OLD_DATE=$(date -v-${i}d +%Y-%m-%d 2>/dev/null || date -d "-${i} days" +%Y-%m-%d 2>/dev/null)
    curl -s --max-time 10 -X DELETE "${WEBDAV_URL}/openclaw_workspace_${OLD_DATE}.tar.gz" 2>/dev/null || true
  done
  
  # Local temizlik
  rm -f "$BACKUP"
  echo "✅ Eski backup'lar temizlendi, local dosya silindi"
else
  echo "❌ WebDAV upload başarısız! Local backup: $BACKUP"
  exit 1
fi
