#!/usr/bin/env python3
"""
FirmaCom dokümanlarını Notion'a aktarır.
"""
import json
import os
import re
import subprocess
import sys
import time

# ── Config ──────────────────────────────────────────────────────────────────
NOTION_KEY = open(os.path.expanduser("~/.config/notion/api_key")).read().strip()
NOTION_VERSION = "2022-06-28"  # stable version
PARENT_PAGE_ID = "330d4f17-ff64-8134-bbc6-cb363afacc87"

DOCS = [
    {
        "file": "/Users/baykus/.openclaw/workspace/firmacom_docs/firmacom_analiz.md",
        "title": "📊 Teknik & Ürün Analiz",
    },
    {
        "file": "/Users/baykus/.openclaw/workspace/firmacom_docs/firmacom_tasarim_dokumani.md",
        "title": "🎨 Tasarım & UI-UX Rehberi",
    },
    {
        "file": "/Users/baykus/.openclaw/workspace/firmacom_docs/firmacom_piyasa_arastirmasi.md",
        "title": "🔍 Piyasa Araştırması",
    },
    {
        "file": "/Users/baykus/.openclaw/workspace/firmacom_docs/firmacom_ai_ocr_entegrasyon.md",
        "title": "🤖 AI & OCR Entegrasyon Planı",
    },
]

# ── Helpers ──────────────────────────────────────────────────────────────────

def rich_text(content):
    """2000 char limitini aşmamak için metni böl."""
    MAX = 1990
    parts = []
    while len(content) > MAX:
        parts.append({"type": "text", "text": {"content": content[:MAX]}})
        content = content[MAX:]
    if content:
        parts.append({"type": "text", "text": {"content": content}})
    return parts if parts else [{"type": "text", "text": {"content": ""}}]


def make_block(btype, content_text, **kwargs):
    """Tek bir Notion bloğu dict'i oluşturur."""
    if btype == "code":
        return {
            "object": "block",
            "type": "code",
            "code": {
                "rich_text": rich_text(content_text[:1990]),
                "language": kwargs.get("language", "plain text"),
            },
        }
    elif btype == "divider":
        return {"object": "block", "type": "divider", "divider": {}}
    else:
        return {
            "object": "block",
            "type": btype,
            btype: {"rich_text": rich_text(content_text)},
        }


def md_to_blocks(md_text):
    """Markdown → Notion blok listesi."""
    blocks = []
    lines = md_text.splitlines()
    in_code = False
    code_buf = []
    code_lang = "plain text"

    i = 0
    while i < len(lines):
        line = lines[i]

        # --- Code block ---
        if line.strip().startswith("```"):
            if not in_code:
                in_code = True
                lang_hint = line.strip()[3:].strip().lower()
                code_lang = lang_hint if lang_hint else "plain text"
                code_buf = []
            else:
                in_code = False
                code_text = "\n".join(code_buf)
                # Split large code blocks
                while len(code_text) > 1990:
                    blocks.append(make_block("code", code_text[:1990], language=code_lang))
                    code_text = code_text[1990:]
                if code_text.strip():
                    blocks.append(make_block("code", code_text, language=code_lang))
                code_buf = []
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # --- Table row: convert to bulleted list item ---
        if line.strip().startswith("|") and line.strip().endswith("|"):
            # Skip separator rows like |---|---|
            if re.match(r"^\|[-| :]+\|$", line.strip()):
                i += 1
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            row_text = " | ".join(cells)
            if row_text.strip():
                blocks.append(make_block("bulleted_list_item", row_text))
            i += 1
            continue

        # --- Horizontal rule ---
        if re.match(r"^[-*_]{3,}$", line.strip()):
            blocks.append(make_block("divider", ""))
            i += 1
            continue

        # --- Headings ---
        m = re.match(r"^(#{1,3})\s+(.*)", line)
        if m:
            level = len(m.group(1))
            text = m.group(2).strip()
            btype = f"heading_{level}"
            blocks.append(make_block(btype, text))
            i += 1
            continue

        # --- Bulleted list ---
        m = re.match(r"^[-*+]\s+(.*)", line)
        if m:
            text = m.group(1).strip()
            blocks.append(make_block("bulleted_list_item", text))
            i += 1
            continue

        # --- Numbered list ---
        m = re.match(r"^\d+\.\s+(.*)", line)
        if m:
            text = m.group(1).strip()
            blocks.append(make_block("numbered_list_item", text))
            i += 1
            continue

        # --- Empty line ---
        if line.strip() == "":
            i += 1
            continue

        # --- Bold/header text (lines starting with **) treated as paragraph ---
        # Regular paragraph
        text = line.strip()
        if text:
            # Long paragraphs split by rich_text helper automatically
            blocks.append(make_block("paragraph", text))
        i += 1

    return blocks


def notion_request(method, path, data=None):
    """curl ile Notion API çağrısı."""
    headers = [
        "-H", f"Authorization: Bearer {NOTION_KEY}",
        "-H", f"Notion-Version: {NOTION_VERSION}",
        "-H", "Content-Type: application/json",
    ]
    cmd = ["curl", "-s", "-X", method, f"https://api.notion.com/v1/{path}"] + headers
    if data:
        cmd += ["-d", json.dumps(data)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  [ERROR] Could not parse response: {result.stdout[:500]}")
        return {}


def create_empty_page(title):
    """Boş sayfa oluştur, page_id döndür."""
    data = {
        "parent": {"page_id": PARENT_PAGE_ID},
        "properties": {
            "title": {"title": [{"text": {"content": title}}]}
        },
    }
    resp = notion_request("POST", "pages", data)
    if "id" in resp:
        return resp["id"]
    print(f"  [ERROR] Page creation failed: {resp}")
    return None


def append_blocks(page_id, blocks):
    """Blokları 100'lük gruplar halinde sayfaya ekle."""
    total = len(blocks)
    print(f"  Toplam {total} blok eklenecek...")
    
    for start in range(0, total, 100):
        batch = blocks[start:start + 100]
        data = {"children": batch}
        resp = notion_request("PATCH", f"blocks/{page_id}/children", data)
        if "results" in resp:
            print(f"  ✓ {start + len(batch)}/{total} blok eklendi")
        else:
            print(f"  [WARN] Batch {start}-{start+len(batch)} yanıtı beklenmedik: {str(resp)[:300]}")
        time.sleep(0.4)  # Rate limit


def process_doc(doc):
    print(f"\n{'='*60}")
    print(f"📄 İşleniyor: {doc['title']}")
    print(f"   Dosya: {doc['file']}")

    with open(doc["file"], "r", encoding="utf-8") as f:
        md_text = f.read()

    blocks = md_to_blocks(md_text)
    print(f"   {len(blocks)} blok dönüştürüldü")

    page_id = create_empty_page(doc["title"])
    if not page_id:
        print("  ✗ Sayfa oluşturulamadı, atlanıyor.")
        return

    clean_id = page_id.replace("-", "")
    url = f"https://www.notion.so/{clean_id}"
    print(f"  ✓ Sayfa oluşturuldu: {url}")

    append_blocks(page_id, blocks)
    print(f"  ✅ Tamamlandı: {doc['title']}")
    print(f"     URL: {url}")
    return url


if __name__ == "__main__":
    print("FirmaCom → Notion Aktarımı Başlıyor")
    print(f"Parent: {PARENT_PAGE_ID}")
    print(f"API Key: {NOTION_KEY[:10]}...")

    results = []
    for doc in DOCS:
        url = process_doc(doc)
        results.append({"title": doc["title"], "url": url})
        time.sleep(1)

    print("\n" + "="*60)
    print("✅ TÜM SAYFALAR TAMAMLANDI")
    for r in results:
        print(f"  • {r['title']}")
        print(f"    {r['url']}")
