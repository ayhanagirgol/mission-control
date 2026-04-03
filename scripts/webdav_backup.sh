#!/bin/bash
# WebDAV Workspace Backup Script
# Hedef: finhouse.keenetic.link/webdav/openclaw-backups/
# Çalıştır: bash scripts/webdav_backup.sh

set -e

# .env'den credentials
source /Users/baykus/.openclaw/workspace/.env

WEBDAV_BASE="https://${KEENETIC_USER}:${KEENETIC_PASS}@finhouse.keenetic.link/webdav"
BACKUP_DIR="openclaw-backups"
TIMESTAMP=$(date +%Y-%m-%d)
WORKSPACE="/Users/baykus/.openclaw/workspace"
TMP_ARCHIVE="/tmp/openclaw-workspace-${TIMESTAMP}.tar.gz"

echo "🔄 WebDAV Backup başlatıldı: $(date)"

# 1. Backup klasörünü oluştur (varsa sorun yok)
curl -s -X MKCOL "${WEBDAV_BASE}/${BACKUP_DIR}/" -o /dev/null || true

# 2. Workspace'i sıkıştır (node_modules, .git büyük dosyalar hariç)
echo "📦 Workspace arşivleniyor..."
tar -czf "$TMP_ARCHIVE" \
  --exclude="$WORKSPACE/node_modules" \
  --exclude="$WORKSPACE/.git" \
  --exclude="$WORKSPACE/logs/*.log" \
  --exclude="$WORKSPACE/tmp" \
  -C "$(dirname $WORKSPACE)" \
  "$(basename $WORKSPACE)"

SIZE=$(du -sh "$TMP_ARCHIVE" | cut -f1)
echo "📁 Arşiv boyutu: $SIZE"

# 3. WebDAV'a yükle
echo "⬆️  WebDAV'a yükleniyor..."
curl -s -T "$TMP_ARCHIVE" \
  "${WEBDAV_BASE}/${BACKUP_DIR}/workspace-${TIMESTAMP}.tar.gz" \
  -o /dev/null

echo "✅ Yedekleme tamamlandı: workspace-${TIMESTAMP}.tar.gz ($SIZE)"

# 4. Invoices klasörünü ayrıca yedekle
if [ -d "$WORKSPACE/invoices" ]; then
  echo "📄 Faturalar yedekleniyor..."
  curl -s -X MKCOL "${WEBDAV_BASE}/${BACKUP_DIR}/invoices/" -o /dev/null || true
  for dir in "$WORKSPACE/invoices"/*/; do
    folder=$(basename "$dir")
    curl -s -X MKCOL "${WEBDAV_BASE}/${BACKUP_DIR}/invoices/${folder}/" -o /dev/null || true
    for file in "$dir"*; do
      fname=$(basename "$file")
      curl -s -T "$file" "${WEBDAV_BASE}/${BACKUP_DIR}/invoices/${folder}/${fname}" -o /dev/null
      echo "  ✓ invoices/$folder/$fname"
    done
  done
fi

# 5. Temizlik
rm -f "$TMP_ARCHIVE"

echo "🎉 Tüm yedekler WebDAV'da: ${WEBDAV_BASE}/${BACKUP_DIR}/"
echo "📅 $(date)"
