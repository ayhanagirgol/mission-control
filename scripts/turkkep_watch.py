#!/usr/bin/env python3
"""Weekly Türkkep/KEP ecosystem news watcher.

Collects last 7 days of news from Brave Search for:
  - TÜRKKEP, EDM, NTB/TBM, PTTKEP
  - Topics: KEP, e-Fatura, e-Defter, e-İmza, e-Arşiv, e-Mutabakat

Schedule: Weekly — runs every Monday at 09:00 (Europe/Istanbul).
Sends a single consolidated email to ayhan.agirgol@finhouse.com.tr.
"""

from __future__ import annotations

import json
import smtplib
import sys
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from textwrap import fill
from typing import Dict, List, Sequence, Set, Tuple
from urllib import error, parse, request

from zoneinfo import ZoneInfo

WORKSPACE = Path(__file__).resolve().parents[1]
ENV_PATH = WORKSPACE / ".env"

RECIPIENT = "ayhan.agirgol@finhouse.com.tr"
TIMEZONE = ZoneInfo("Europe/Istanbul")
BRAVE_NEWS_ENDPOINT = "https://api.search.brave.com/res/v1/news/search"
BRAVE_SEARCH_ENDPOINT = "https://api.search.brave.com/res/v1/web/search"
RESULTS_PER_QUERY = 5
MAX_EMAIL_RESULTS = 40
LOOKBACK_DAYS = 7

# ── KEP Ecosystem Providers ─────────────────────────────────────────────────
PROVIDERS = {
    "turkkep": {
        "label": "TÜRKKEP",
        "queries": ["TÜRKKEP", "turkkep.com.tr"],
        "own_domains": ["turkkep.com.tr"],
    },
    "edm": {
        "label": "EDM",
        "queries": ["EDM KEP", "edm.com.tr KEP"],
        "own_domains": ["edm.com.tr"],
    },
    "tbm": {
        "label": "TBM",
        "queries": ["TBM KEP Türkiye Bilişim", "tbm.com.tr KEP"],
        "own_domains": ["tbm.com.tr"],
    },
    "ntb": {
        "label": "NTB",
        "queries": ["NTB KEP netbt.com.tr"],
        "own_domains": ["ntb.com.tr", "netbt.com.tr"],
    },
    "pttkep": {
        "label": "PTTKEP",
        "queries": ["PTTKEP", "pttkep.gov.tr"],
        "own_domains": ["pttkep.gov.tr", "ptt.gov.tr"],
    },
}

# ── Topic Keywords ───────────────────────────────────────────────────────────
TOPIC_QUERIES: List[Tuple[str, str]] = [
    # (search query, display label)
    ('"kayıtlı elektronik posta" KEP', "KEP Genel"),
    ('"e-fatura" mevzuat yenilik 2025 2026', "e-Fatura"),
    ('"e-defter" mevzuat GİB 2025 2026', "e-Defter"),
    ('"e-imza" e-arşiv elektronik belge 2026', "e-İmza / e-Arşiv"),
    ('"e-mutabakat" finans KEP elektronik', "e-Mutabakat"),
    ("KEP entegrasyon API fintech 2026", "KEP Entegrasyon"),
    ("GİB e-belge dönüşüm zorunluluk 2026", "GİB e-Belge"),
]


@dataclass
class Article:
    title: str
    url: str
    source: str
    snippet: str
    published: datetime | None
    tags: Set[str] = field(default_factory=set)
    is_topic: bool = False


def load_env(path: Path) -> Dict[str, str]:
    env: Dict[str, str] = {}
    if not path.exists():
        return env
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def brave_query(query: str, token: str, freshness: str = "pw", news: bool = True) -> list[dict]:
    endpoint = BRAVE_NEWS_ENDPOINT if news else BRAVE_SEARCH_ENDPOINT
    params = parse.urlencode(
        {
            "q": query,
            "count": RESULTS_PER_QUERY,
            "freshness": freshness,
            "country": "tr",
            "search_lang": "tr",
        }
    )
    req = request.Request(
        f"{endpoint}?{params}",
        headers={
            "Accept": "application/json",
            "X-Subscription-Token": token,
        },
    )
    try:
        with request.urlopen(req, timeout=20) as resp:
            payload = json.load(resp)
    except error.HTTPError as exc:
        print(f"[warn] Brave HTTPError {exc.code}: query='{query}'", file=sys.stderr)
        return []
    except error.URLError as exc:
        print(f"[warn] Brave URLError: {exc.reason}", file=sys.stderr)
        return []

    if news:
        return payload.get("results") or payload.get("news", {}).get("results", []) or []
    else:
        web_results = payload.get("web", {}).get("results", []) or []
        return web_results


def parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    text = value.strip()
    tzinfo = timezone.utc if text.endswith("Z") else None
    text = text.rstrip("Z")
    for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(text, fmt)
            return dt.replace(tzinfo=tzinfo or timezone.utc)
        except ValueError:
            continue
    return None


def within_lookback(dt: datetime | None) -> bool:
    if dt is None:
        return True  # include undated items
    now = datetime.now(timezone.utc)
    return now - dt <= timedelta(days=LOOKBACK_DAYS)


def is_own_domain(url: str, own_domains: list[str]) -> bool:
    return any(d.lower() in url.lower() for d in own_domains)


def collect_articles(token: str) -> Tuple[List[Article], List[Article]]:
    """Returns (provider_articles, topic_articles)."""
    catalog: Dict[str, Article] = {}

    # ── Provider scans ──────────────────────────────────────────────────────
    for prov_key, prov_meta in PROVIDERS.items():
        for query in prov_meta["queries"]:
            for news_mode in (True, False):  # try news index first, then web
                results = brave_query(query, token, freshness="pw", news=news_mode)
                for item in results:
                    url = item.get("url") or item.get("page_fetched") or ""
                    if not url:
                        continue
                    # Skip articles from provider's own domain (marketing noise)
                    if is_own_domain(url, prov_meta["own_domains"]):
                        continue
                    title = (item.get("title") or url).strip()
                    snippet = (item.get("description") or item.get("extra_snippets", [""])[0] or "").strip()
                    domain = (item.get("meta_url") or {}).get("hostname") or url.split("/")[2] if "//" in url else url
                    published = parse_date(item.get("published") or item.get("date"))
                    if not within_lookback(published):
                        continue
                    art = catalog.setdefault(
                        url,
                        Article(
                            title=title,
                            url=url,
                            source=domain,
                            snippet=snippet,
                            published=published,
                        ),
                    )
                    art.tags.add(prov_meta["label"])
                if len([a for a in catalog.values() if prov_meta["label"] in a.tags]) >= 3:
                    break  # enough results for this provider

    # ── Topic scans ─────────────────────────────────────────────────────────
    topic_catalog: Dict[str, Article] = {}
    for query, label in TOPIC_QUERIES:
        results = brave_query(query, token, freshness="pw", news=True)
        if not results:
            results = brave_query(query, token, freshness="pw", news=False)
        for item in results:
            url = item.get("url") or ""
            if not url:
                continue
            title = (item.get("title") or url).strip()
            snippet = (item.get("description") or "").strip()
            domain = (item.get("meta_url") or {}).get("hostname") or (url.split("/")[2] if "//" in url else url)
            published = parse_date(item.get("published") or item.get("date"))
            if not within_lookback(published):
                continue
            art = topic_catalog.setdefault(
                url,
                Article(
                    title=title,
                    url=url,
                    source=domain,
                    snippet=snippet,
                    published=published,
                    is_topic=True,
                ),
            )
            art.tags.add(label)

    def sort_key(a: Article) -> datetime:
        return a.published or datetime.min.replace(tzinfo=timezone.utc)

    provider_articles = sorted(catalog.values(), key=sort_key, reverse=True)[:MAX_EMAIL_RESULTS]
    topic_articles = sorted(topic_catalog.values(), key=sort_key, reverse=True)[:MAX_EMAIL_RESULTS]
    return provider_articles, topic_articles


def fmt_date(dt: datetime | None) -> str:
    if dt is None:
        return "tarih yok"
    return dt.astimezone(TIMEZONE).strftime("%d %b %Y")


def build_html_email(provider_articles: List[Article], topic_articles: List[Article]) -> Tuple[str, str]:
    now = datetime.now(TIMEZONE)
    week_start = (now - timedelta(days=7)).strftime("%d %b")
    week_end = now.strftime("%d %b %Y")
    subject = f"[KEP Watch] Haftalık Özet — {week_start} – {week_end}"

    # ── Plain text ──────────────────────────────────────────────────────────
    lines = [
        "Merhaba Ayhan,",
        "",
        f"Son 7 günde ({week_start} – {week_end}) KEP ekosistemindeki gelişmelerin haftalık özeti:",
        "",
    ]

    def add_section_text(title: str, articles: List[Article]) -> None:
        lines.append(f"{'─'*60}")
        lines.append(f"  {title}")
        lines.append(f"{'─'*60}")
        if not articles:
            lines.append("  Bu bölümde bu hafta yeni içerik bulunamadı.")
            lines.append("")
            return
        for i, art in enumerate(articles, 1):
            lines.append(f"\n[{i}] {art.title}")
            lines.append(f"    Kaynak : {art.source}  |  {fmt_date(art.published)}")
            lines.append(f"    Etiket : {', '.join(sorted(art.tags))}")
            if art.snippet:
                lines.append(f"    Özet   : {fill(art.snippet, width=90, subsequent_indent='           ')}")
            lines.append(f"    URL    : {art.url}")
        lines.append("")

    # Group provider articles by tag
    by_provider: Dict[str, List[Article]] = {}
    for art in provider_articles:
        for tag in art.tags:
            by_provider.setdefault(tag, []).append(art)

    for prov_key in ["TÜRKKEP", "EDM", "TBM", "NTB", "PTTKEP"]:
        arts = by_provider.get(prov_key, [])
        add_section_text(f"📌 {prov_key}", arts)

    add_section_text("📋 Konu Başlıkları (KEP / e-Fatura / e-Defter / e-İmza)", topic_articles)

    lines += [
        "─" * 60,
        "Bu rapor OpenClaw tarafından Brave Search üzerinden derlenmiştir.",
        "Her Pazartesi 09:00'da otomatik gönderilir.",
        "",
        "İyi çalışmalar.",
    ]

    plain_text = "\n".join(lines)

    # ── HTML ────────────────────────────────────────────────────────────────
    def html_section(title: str, articles: List[Article]) -> str:
        rows = ""
        if not articles:
            return f"<h2>{title}</h2><p style='color:#888'>Bu hafta bu bölümde yeni içerik bulunamadı.</p>"
        for art in articles:
            tags_html = " ".join(f"<span style='background:#e8f0fe;padding:2px 7px;border-radius:3px;font-size:11px;margin-right:4px'>{t}</span>" for t in sorted(art.tags))
            snippet_html = f"<p style='margin:4px 0 0;color:#555;font-size:13px'>{art.snippet[:200]}{'…' if len(art.snippet)>200 else ''}</p>" if art.snippet else ""
            rows += f"""
            <div style='border-left:3px solid #1a73e8;padding:10px 14px;margin:10px 0;background:#fafafa'>
              <a href='{art.url}' style='font-weight:600;color:#1a0dab;text-decoration:none;font-size:14px'>{art.title}</a>
              <div style='color:#777;font-size:12px;margin:3px 0'>{art.source} &nbsp;·&nbsp; {fmt_date(art.published)}</div>
              <div style='margin:4px 0'>{tags_html}</div>
              {snippet_html}
            </div>"""
        return f"<h2 style='color:#333;border-bottom:2px solid #e0e0e0;padding-bottom:6px'>{title}</h2>{rows}"

    prov_sections = ""
    for prov_key in ["TÜRKKEP", "EDM", "TBM", "NTB", "PTTKEP"]:
        arts = by_provider.get(prov_key, [])
        prov_sections += html_section(f"📌 {prov_key}", arts)

    topic_section = html_section("📋 Konu Başlıkları — KEP / e-Fatura / e-Defter / e-İmza", topic_articles)

    total = len(provider_articles) + len(topic_articles)
    html = f"""<!DOCTYPE html>
<html><head><meta charset='utf-8'><style>
  body{{font-family:Arial,sans-serif;max-width:760px;margin:auto;padding:20px;color:#333}}
  h1{{color:#1a73e8}} h2{{color:#333}} a{{color:#1a0dab}}
</style></head><body>
<h1>📬 KEP Watch — Haftalık Özet</h1>
<p style='color:#555'>{week_start} – {week_end} &nbsp;|&nbsp; <strong>{total} haber</strong> bulundu</p>
{prov_sections}
{topic_section}
<hr style='margin-top:30px'>
<p style='color:#aaa;font-size:12px'>Bu rapor OpenClaw tarafından Brave Search üzerinden otomatik derlenmiştir. Her Pazartesi 09:00'da gönderilir.</p>
</body></html>"""

    return subject, plain_text, html


def send_email(sender: str, password: str, recipient: str, subject: str, plain: str, html: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(sender, password)
        smtp.send_message(msg)


def main() -> int:
    env = load_env(ENV_PATH)
    brave_token = env.get("BRAVE_API_KEY")
    gmail_user = env.get("GMAIL_EMAIL")
    gmail_pass = env.get("GMAIL_APP_PASSWORD")

    missing = [n for n, v in (("BRAVE_API_KEY", brave_token), ("GMAIL_EMAIL", gmail_user), ("GMAIL_APP_PASSWORD", gmail_pass)) if not v]
    if missing:
        print(f"[error] Eksik env değişkenleri: {', '.join(missing)}", file=sys.stderr)
        return 1

    print("[turkkep_watch] Brave Search sorguları başlatılıyor…", file=sys.stderr)
    provider_articles, topic_articles = collect_articles(brave_token)
    total = len(provider_articles) + len(topic_articles)
    print(f"[turkkep_watch] {len(provider_articles)} provider + {len(topic_articles)} topic haberi bulundu.", file=sys.stderr)

    subject, plain_text, html = build_html_email(provider_articles, topic_articles)
    send_email(gmail_user, gmail_pass, RECIPIENT, subject, plain_text, html)
    print(f"[turkkep_watch] Email gönderildi: {total} haber — '{subject}'")
    return 0


if __name__ == "__main__":
    sys.exit(main())
