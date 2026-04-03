#!/bin/bash
cd /Users/baykus/.openclaw/workspace
PUBLISHED=0
FAILED=0

for skill in fatura-rehberi-tr vergi-avantajlari-tr yasal-defterler-tr nakit-akisi-temel yolculuk-maliyet-tr ev-sarj-tr; do
  # Zaten yayınlanmışsa atla
  if [ -f "logs/published_${skill}" ]; then
    continue
  fi
  
  echo "$(date): Publishing $skill..." >> logs/skill_publish.log
  result=$(npx clawhub@latest publish "skills/$skill" --version 1.0.0 2>&1)
  
  if echo "$result" | grep -q "Rate limit"; then
    echo "$(date): $skill → Rate limited, will retry" >> logs/skill_publish.log
    FAILED=$((FAILED+1))
    break
  elif echo "$result" | grep -q "OK. Published"; then
    echo "$(date): $skill → ✅ Published" >> logs/skill_publish.log
    touch "logs/published_${skill}"
    PUBLISHED=$((PUBLISHED+1))
    sleep 5
  else
    echo "$(date): $skill → ERROR: $result" >> logs/skill_publish.log
    FAILED=$((FAILED+1))
  fi
done

# Tümü yayınlandıysa cron'u kaldır
REMAINING=$(ls -1 skills/fatura-rehberi-tr skills/vergi-avantajlari-tr skills/yasal-defterler-tr skills/nakit-akisi-temel skills/yolculuk-maliyet-tr skills/ev-sarj-tr 2>/dev/null | wc -l)
DONE=$(ls -1 logs/published_* 2>/dev/null | wc -l)
if [ "$DONE" -ge 6 ]; then
  crontab -l 2>/dev/null | grep -v "publish_remaining_skills" | crontab -
  echo "$(date): All 6 skills published! Cron removed." >> logs/skill_publish.log
fi
