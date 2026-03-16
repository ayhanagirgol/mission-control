#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import html
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List

import requests

from gmail_smtp import load_env_file, send_email, get_required_env

BRAVE_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"
WORKSPACE = Path(os.getenv("OPENCLAW_WORKSPACE", "/Users/baykus/.openclaw/workspace")).expanduser()
OUTPUT_DIR = WORKSPACE / "reports" / "generated"
DEFAULT_TO = "ayhan.agirgol@gmail.com"

REPORT_CONFIGS: Dict[str, Dict] = {
    "daily_fintech": {
        "subject": "Günlük Fintech Raporu",
        "days": 1,
        "intro": "Aşağıda son 1 gün içindeki fintech, ödeme, açık bankacılık, kart şemaları ve yönetici hareketlerine dair derli toplu özet yer almaktadır.",
        "sections": {
            "Türkiye Fintech / Ödeme Gündemi": [
                'Türkiye fintech OR ödeme OR e-para OR açık bankacılık OR sanal POS',
                'site:x.com Fintekwins fintech OR ödeme OR açık bankacılık',
                'Visa Mastercard Türkiye fintech',
                'fintech yönetici atama Türkiye',
            ],
            "Yurt Dışı Fintech / Ödeme Gündemi": [
                'global fintech payments open banking card issuer news',
                'Visa Mastercard fintech partnership AI payments',
                'embedded finance fintech funding product launch',
            ],
        },
    },
    "weekly_fintech": {
        "subject": "Haftalık Fintech Özeti",
        "days": 7,
        "intro": "Aşağıda son 1 hafta içindeki fintech, ödeme/e-para, açık bankacılık, POS/sanal POS, Visa/Mastercard ve yönetici atamalarına dair haftalık özet yer almaktadır.",
        "sections": {
            "Türkiye Fintech / Ödeme Gündemi": [
                'Türkiye fintech OR ödeme OR e-para OR açık bankacılık OR sanal POS',
                'site:x.com Fintekwins fintech OR ödeme OR açık bankacılık',
                'Visa Mastercard Türkiye fintech',
                'fintech yönetici atama Türkiye',
            ],
            "Yurt Dışı Fintech / Ödeme Gündemi": [
                'global fintech payments open banking card issuer news',
                'Visa Mastercard fintech partnership AI payments',
                'embedded finance fintech funding product launch',
            ],
        },
    },
    "daily_finance_ai": {
        "subject": "Günlük Finance + AI Raporu",
        "days": 1,
        "intro": "Aşağıda son 1 gün içindeki finans sektörüne yönelik AI çözümleri, ürün duyuruları, kullanım senaryoları, risk/regülasyon notları ve önemli gelişmeler yer almaktadır.",
        "sections": {
            "Türkiye Finans + AI": [
                'Türkiye banka yapay zeka çözümü finans AI bank insurance',
                'Türkiye fintech AI fraud risk credit scoring automation',
                'site:linkedin.com finance AI Türkiye banka yapay zeka',
                'site:x.com finance AI Türkiye banka yapay zeka',
            ],
            "Yurt Dışı Finans + AI": [
                'banking AI product launch risk compliance fraud underwriting',
                'financial services AI copilot AML KYC model ops',
                'genAI banking insurance wealth management news',
            ],
            "Regülasyon / Risk / Fırsat": [
                'AI regulation banking compliance risk financial services',
                'AI model risk governance bank regulator',
                'fraud AML KYC AI financial services regulator',
            ],
        },
    },
    "weekly_finance_ai": {
        "subject": "Haftalık Finance + AI Özeti",
        "days": 7,
        "intro": "Aşağıda son 1 hafta içindeki finans sektörüne yönelik AI çözümleri, ürünleşen kullanım senaryoları, regülasyon-risk-fırsat notları ve öne çıkan eğilimlerin haftalık özeti yer almaktadır.",
        "sections": {
            "Türkiye Finans + AI": [
                'Türkiye banka yapay zeka çözümü finans AI bank insurance',
                'Türkiye fintech AI fraud risk credit scoring automation',
                'site:linkedin.com finance AI Türkiye banka yapay zeka',
                'site:x.com finance AI Türkiye banka yapay zeka',
            ],
            "Yurt Dışı Finans + AI": [
                'banking AI product launch risk compliance fraud underwriting',
                'financial services AI copilot AML KYC model ops',
                'genAI banking insurance wealth management news',
            ],
            "Regülasyon / Risk / Fırsat": [
                'AI regulation banking compliance risk financial services',
                'AI model risk governance bank regulator',
                'fraud AML KYC AI financial services regulator',
            ],
        },
    },
}


def normalize_text(text: str) -> str:
    return (text or "").strip().lower()


def freshness_for_days(days: int) -> str:
    if days <= 1:
        return "pd"
    if days <= 7:
        return "pw"
    if days <= 31:
        return "pm"
    return "py"


def brave_search(query: str, api_key: str, count: int, freshness: str, country: str = "TR", search_lang: str = "tr", ui_lang: str = "tr-TR") -> List[dict]:
    params = {
        "q": query,
        "count": count,
        "freshness": freshness,
        "country": country,
        "search_lang": search_lang,
        "ui_lang": ui_lang,
        "safesearch": "moderate",
        "text_decorations": False,
        "spellcheck": True,
    }
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": api_key,
    }
    resp = requests.get(BRAVE_SEARCH_URL, headers=headers, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json().get("web", {}).get("results", [])


def dedupe_results(items: List[dict]) -> List[dict]:
    seen = set()
    out = []
    for item in items:
        key = (item.get("url") or item.get("title") or "").strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def collect_section(api_key: str, queries: List[str], days: int, count_each: int = 5) -> List[dict]:
    freshness = freshness_for_days(days)
    results: List[dict] = []
    for query in queries:
        try:
            country = "US" if any(token in query.lower() for token in ["global", "banking", "financial services", "genai"]) else "TR"
            lang = "en" if country == "US" else "tr"
            ui_lang = "en-US" if country == "US" else "tr-TR"
            results.extend(brave_search(query, api_key=api_key, count=count_each, freshness=freshness, country=country, search_lang=lang, ui_lang=ui_lang))
        except Exception as exc:
            results.append({
                "title": f"Arama hatası: {query}",
                "url": "",
                "description": str(exc),
                "age": "",
            })
        time.sleep(0.35)
    return dedupe_results(results)


def summarize_results(section_name: str, items: List[dict], limit: int = 6) -> str:
    lines = [f"## {section_name}"]
    if not items:
        lines.append("- Bu başlık için anlamlı sonuç bulunamadı.")
        return "\n".join(lines)
    for idx, item in enumerate(items[:limit], start=1):
        title = (item.get("title") or "Başlıksız sonuç").strip()
        desc = (item.get("description") or "Kısa açıklama yok.").strip()
        url = (item.get("url") or "").strip()
        age = (item.get("age") or "").strip()
        age_text = f" | Zaman: {age}" if age else ""
        lines.append(f"- {idx}. {title}{age_text}\n  {desc}\n  Link: {url}")
    return "\n".join(lines)


def summarize_results_html(section_name: str, items: List[dict], limit: int = 6) -> str:
    out = [f"<h2>{html.escape(section_name)}</h2>"]
    if not items:
        out.append("<p>Bu başlık için anlamlı sonuç bulunamadı.</p>")
        return "\n".join(out)
    out.append("<ul>")
    for item in items[:limit]:
        title = html.escape((item.get("title") or "Başlıksız sonuç").strip())
        desc = html.escape((item.get("description") or "Kısa açıklama yok.").strip())
        url = html.escape((item.get("url") or "").strip())
        age = html.escape((item.get("age") or "").strip())
        age_html = f" <em>({age})</em>" if age else ""
        out.append(f"<li><strong>{title}</strong>{age_html}<br>{desc}<br><a href=\"{url}\">{url}</a></li>")
    out.append("</ul>")
    return "\n".join(out)


def build_executive_notes(report_key: str, sections: Dict[str, List[dict]], days: int) -> List[str]:
    notes = []
    total_hits = sum(1 for items in sections.values() for item in items if item.get("url"))
    if total_hits:
        notes.append(f"Toplam {total_hits} görünür kaynak sonucu derlendi.")
    if report_key.startswith("daily"):
        notes.append(f"Bu rapor yalnızca son {days} gün içindeki sinyallere odaklanır.")
    else:
        notes.append(f"Bu rapor yalnızca son {days} gün içindeki haftalık eğilimleri özetler.")
    if "finance_ai" in report_key:
        notes.append("Finans sektörüne yönelik AI ürünleri, kullanım senaryoları ve regülasyon/risk notları öne çıkarıldı.")
    if "fintech" in report_key:
        notes.append("Fintekwins, ödeme/e-para, açık bankacılık ve kart şemaları eksenindeki gündem önceliklendirildi.")
    return notes


def build_report(report_key: str) -> tuple[str, str, str]:
    config = REPORT_CONFIGS[report_key]
    api_key = get_required_env("BRAVE_API_KEY")
    report_date = datetime.now().strftime("%d.%m.%Y")
    days = config["days"]

    section_results: Dict[str, List[dict]] = {}
    for section_name, queries in config["sections"].items():
        section_results[section_name] = collect_section(api_key, queries, days)

    executive_notes = build_executive_notes(report_key, section_results, days)

    text_parts = [
        f"# {config['subject']} - {report_date}",
        "",
        f"Merhaba Ayhan Bey,",
        "",
        config["intro"],
        "",
        "## Yönetici Özeti",
    ]
    text_parts.extend([f"- {note}" for note in executive_notes])
    for section_name, items in section_results.items():
        text_parts.append("")
        text_parts.append(summarize_results(section_name, items))
    text_body = "\n".join(text_parts).strip() + "\n"

    html_parts = [
        f"<h1>{html.escape(config['subject'])} - {html.escape(report_date)}</h1>",
        "<p>Merhaba Ayhan Bey,</p>",
        f"<p>{html.escape(config['intro'])}</p>",
        "<h2>Yönetici Özeti</h2><ul>",
    ]
    html_parts.extend([f"<li>{html.escape(note)}</li>" for note in executive_notes])
    html_parts.append("</ul>")
    for section_name, items in section_results.items():
        html_parts.append(summarize_results_html(section_name, items))
    html_body = "<html><body style=\"font-family: Arial, sans-serif; line-height: 1.5; color: #222;\">" + "\n".join(html_parts) + "</body></html>"

    subject = f"{config['subject']} - {report_date}"
    return subject, text_body, html_body


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("report_key", choices=sorted(REPORT_CONFIGS.keys()))
    parser.add_argument("--env", default=str(WORKSPACE / ".env"))
    parser.add_argument("--to", default=DEFAULT_TO)
    parser.add_argument("--no-send", action="store_true")
    args = parser.parse_args()

    load_env_file(args.env)
    subject, text_body, html_body = build_report(args.report_key)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    text_path = OUTPUT_DIR / f"{args.report_key}-{stamp}.md"
    html_path = OUTPUT_DIR / f"{args.report_key}-{stamp}.html"
    text_path.write_text(text_body, encoding="utf-8")
    html_path.write_text(html_body, encoding="utf-8")

    if not args.no_send:
        recipients = [x.strip() for x in args.to.split(",") if x.strip()]
        send_email(subject, text_body, html_body, recipients)
        print(f"[OK] Report mail sent: {', '.join(recipients)}")
    else:
        print("[OK] Report generated without sending.")

    print(f"Text report: {text_path}")
    print(f"HTML report: {html_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
