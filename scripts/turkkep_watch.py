#!/usr/bin/env python3
"""Weekly Türkkep/KEP ecosystem news watcher — yurt içi, birebir eşleşme.

Kurallar:
  1. Sadece .tr domainleri kabul edilir (yurt içi filtresi).
  2. Provider adı (TÜRKKEP, EDM, TBM, PTTKEP) başlık veya özet içinde
     birebir geçmeli — benzeterek eşleştirme yapılmaz.
  3. Haber bulunamazsa bölüm "Bu hafta haber bulunamadı." der.

Konu başlıkları (KEP, e-Fatura, e-Defter, vb.) de .tr domainleriyle sınırlıdır
ve ilgili anahtar kelime başlık/özette geçmelidir.

Zamanlama: Her Pazartesi 09:00 (Europe/Istanbul).
"""

from __future__ import annotations

import json
import re
import smtplib
import sys
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from textwrap import fill
from typing import Dict, List, Optional, Set, Tuple
from urllib import error, parse, request

from zoneinfo import ZoneInfo

WORKSPACE = Path(__file__).resolve().parents[1]
ENV_PATH = WORKSPACE / ".env"

RECIPIENT = "ayhan.agirgol@finhouse.com.tr"
TIMEZONE = ZoneInfo("Europe/Istanbul")
BRAVE_NEWS_ENDPOINT = "https://api.search.brave.com/res/v1/news/search"
BRAVE_WEB_ENDPOINT = "https://api.search.brave.com/res/v1/web/search"
RESULTS_PER_QUERY = 10
LOOKBACK_DAYS = 14  # 2 haftalık pencere

# ── Sadece bu TLD'ler yurt içi sayılır ──────────────────────────────────────
DOMESTIC_TLD = ".tr"

# ── Statik/evergreen sayfa desenleri — bunlar haber DEĞİL ───────────────────
STATIC_PATH_PATTERNS = re.compile(
    r"/(sss|sikca-sorulan-sorular|banka-bilgileri|hakkimizda|iletisim|about|contact"
    r"|urunler?|cozumler?|products?|solutions?|services?|hizmetler"
    r"|kariyer|career|kvkk|gizlilik|privacy|cerez|cookie"
    r"|destek|support|yardim|help|faq|nasil-yapilir|rehber"
    r"|katalog|fiyat|pricing|basvuru-merkezi|urun-kilavuzlari"
    r"|about-us|about_us)(/|$)",
    re.IGNORECASE,
)

# ── Haber olmayan domain desenleri ──────────────────────────────────────────
NON_NEWS_DOMAINS = re.compile(
    r"(play\.google\.com|apps\.apple\.com|youtube\.com|linkedin\.com"
    r"|twitter\.com|x\.com|facebook\.com|instagram\.com"
    r"|sikayetvar\.com|eksi|uludagsozluk|eksisozluk"
    r"|google\.|bing\.|yandex\.)",
    re.IGNORECASE,
)

# ── Haber/duyuru URL desenleri — bunları önceliklendir ──────────────────────
NEWS_PATH_PATTERNS = re.compile(
    r"/(haber|haberler|duyuru|basin|basin-odasi|press|blog|makale|icerik"
    r"|2024|2025|2026|gundem|gundeme|yenilik|update|announce)(/|$|-)",
    re.IGNORECASE,
)

# ── KEP Hizmet Sağlayıcıları ────────────────────────────────────────────────
# exact_terms: başlık veya snippet'te bu stringlerden biri birebir geçmeli (case-insensitive)
PROVIDERS: Dict[str, Dict] = {
    "turkkep": {
        "label": "TÜRKKEP",
        "queries": ['"TÜRKKEP"', '"turkkep"'],
        "exact_terms": ["türkkep", "turkkep"],
        "own_domains": ["turkkep.com.tr"],
        # Firmanın kendi haber/duyuru sayfaları — doğrudan fetch edilir
        "news_urls": [
            "https://turkkep.com.tr/",  # VC Grid haberler ana sayfada
        ],
    },
    "edm": {
        "label": "EDM",
        "queries": ['"EDM" KEP türkiye', '"edm.com.tr"'],
        "exact_terms": ["edm"],
        "kep_context_required": True,
        "own_domains": ["edm.com.tr"],
        "news_urls": [
            "https://www.edm.com.tr/haberler",
            "https://www.edm.com.tr/duyurular",
            "https://www.edm.com.tr/blog",
        ],
    },
    "tbm": {
        "label": "TBM",
        "queries": ['"tbm.com.tr"', '"TBM" "kayıtlı elektronik" türkiye'],
        "exact_terms": ["tbm.com.tr", "tbm kep", "tbm kayıtlı"],
        "kep_context_required": False,
        "own_domains": ["tbm.com.tr"],
        "news_urls": [
            "https://www.tbm.com.tr/haberler",
            "https://www.tbm.com.tr/duyurular",
        ],
    },

    "pttkep": {
        "label": "PTTKEP",
        "queries": ['"PTTKEP"', '"pttkep"'],
        "exact_terms": ["pttkep"],
        "own_domains": ["pttkep.gov.tr", "ptt.gov.tr"],
        "news_urls": [
            "https://www.pttkep.gov.tr/haberler",
            "https://www.pttkep.gov.tr/duyurular",
            "https://www.ptt.gov.tr/haberler",
        ],
    },
}

# ── Konu Başlıkları ──────────────────────────────────────────────────────────
TOPIC_QUERIES: List[Tuple[str, str, List[str]]] = [
    # (query, label, zorunlu_terimler — en az biri başlık/snippet'te geçmeli)
    # NOT: site:.tr operatörü Brave API'de sonuçları sıfırlıyor;
    #      yurt içi filtresi kendi is_domestic() kontrolümüzle yapılıyor.
    ('"KEP" "kayıtlı elektronik posta"', "KEP Genel", ["kep", "kayıtlı elektronik posta"]),
    ('"e-fatura" mevzuat türkiye', "e-Fatura", ["e-fatura", "efatura"]),
    ('"e-defter" GİB türkiye', "e-Defter", ["e-defter", "edefter"]),
    ('"e-imza" türkiye 2025 2026', "e-İmza", ["e-imza", "eimza"]),
    ('"e-arşiv" türkiye belge', "e-Arşiv", ["e-arşiv", "e-arsiv", "e-arşiv"]),
    ('"e-mutabakat" türkiye finans', "e-Mutabakat", ["e-mutabakat"]),
    ('"regtech" türkiye fintech', "RegTech", ["regtech"]),
]


@dataclass
class Article:
    title: str
    url: str
    source: str
    snippet: str
    published: Optional[datetime]
    tags: Set[str] = field(default_factory=set)


# ── Yardımcı fonksiyonlar ────────────────────────────────────────────────────

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


def brave_query(query: str, token: str, news: bool = True) -> List[dict]:
    endpoint = BRAVE_NEWS_ENDPOINT if news else BRAVE_WEB_ENDPOINT
    # NOT: freshness="pw" + country="tr" birlikte Brave API'de sıfır sonuç döndürüyor.
    # Zaman filtresi kendi parse_date + within_lookback logic'imizle yapılıyor.
    params = parse.urlencode({
        "q": query,
        "count": RESULTS_PER_QUERY,
        "country": "tr",
        "search_lang": "tr",
    })
    req = request.Request(
        f"{endpoint}?{params}",
        headers={"Accept": "application/json", "X-Subscription-Token": token},
    )
    try:
        with request.urlopen(req, timeout=20) as resp:
            payload = json.load(resp)
    except error.HTTPError as exc:
        print(f"[warn] Brave {exc.code}: '{query}'", file=sys.stderr)
        return []
    except error.URLError as exc:
        print(f"[warn] Brave URLError: {exc.reason}", file=sys.stderr)
        return []

    if news:
        return payload.get("results") or payload.get("news", {}).get("results", []) or []
    return payload.get("web", {}).get("results", []) or []


def parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    text = value.strip().rstrip("Z")
    for fmt in ("%Y-%m-%dT%H:%M:%S.%f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(text, fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return None


def within_lookback(dt: Optional[datetime]) -> bool:
    if dt is None:
        return True
    return datetime.now(timezone.utc) - dt <= timedelta(days=LOOKBACK_DAYS)


def extract_domain(url: str) -> str:
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc.lower()
    except Exception:
        return ""


def is_domestic(url: str) -> bool:
    """URL'nin .tr TLD'ye sahip olup olmadığını kontrol eder."""
    domain = extract_domain(url)
    # domain: www.sabah.com.tr → .tr ile bitiyor mu?
    return domain.endswith(DOMESTIC_TLD)


def text_contains_any(text: str, terms: List[str]) -> bool:
    """Verilen terimlerden herhangi biri metinde birebir geçiyor mu (case-insensitive)?"""
    lower = text.lower()
    return any(term.lower() in lower for term in terms)


def is_own_domain(url: str, own_domains: List[str]) -> bool:
    domain = extract_domain(url)
    return any(own.lower() in domain for own in own_domains)


def is_static_page(url: str) -> bool:
    """SSS, ürün, kariyer gibi evergreen sayfalar — haber değil, atla."""
    try:
        from urllib.parse import urlparse
        path = urlparse(url).path
        return bool(STATIC_PATH_PATTERNS.search(path))
    except Exception:
        return False


def is_likely_news(url: str) -> bool:
    """Haber/duyuru URL'si mi?"""
    try:
        from urllib.parse import urlparse
        path = urlparse(url).path
        return bool(NEWS_PATH_PATTERNS.search(path))
    except Exception:
        return False


def item_to_article(item: dict) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str], Optional[datetime]]:
    url = item.get("url") or ""
    title = (item.get("title") or "").strip()
    snippet = (item.get("description") or "").strip()
    domain = extract_domain(url) or url
    published = parse_date(item.get("published") or item.get("date"))
    return url, title, snippet, domain, published


# ── Firma sitesi doğrudan fetch ──────────────────────────────────────────────

_TR_MONTHS = {
    "ocak": 1, "şubat": 2, "mart": 3, "nisan": 4, "mayıs": 5, "haziran": 6,
    "temmuz": 7, "ağustos": 8, "eylül": 9, "ekim": 10, "kasım": 11, "aralık": 12,
}
_TR_DATE_RE = re.compile(
    r'(\d{1,2})\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+(\d{4})',
    re.IGNORECASE,
)


def parse_tr_date(text: str) -> Optional[datetime]:
    """'2 Mart 2026' gibi Türkçe tarihleri datetime'a çevirir."""
    m = _TR_DATE_RE.search(text.lower())
    if not m:
        return None
    day, month_tr, year = int(m.group(1)), m.group(2).lower(), int(m.group(3))
    month = _TR_MONTHS.get(month_tr)
    if not month:
        return None
    try:
        return datetime(year, month, day, tzinfo=timezone.utc)
    except ValueError:
        return None


def fetch_site_articles(news_urls: List[str], label: str, exact_terms: List[str]) -> List[Article]:
    """
    Firmanın kendi sayfalarını çeker.
    SADECE tarihi olan ve lookback içindeki makaleler eklenir.
    Tarih bulunamazsa makale atlanır.

    TÜRKKEP gibi siteler ana sayfada VC Grid formatında haber + tarih sunar;
    tarih 'vc_gitem-post-data-source-post_date' bloğunda Türkçe yazılı olur.
    """
    import html as _html
    import ssl as _ssl

    results: List[Article] = []
    seen: Set[str] = set()

    TAG_RE = re.compile(r'<[^>]+>')

    # VC Grid formatı: tarih + başlık + link bloklarını çıkar
    # <div ...post_date...>...<tarih>...</div>...<h5><a href="url">başlık</a></h5>
    # Hem post_date hem de post_title aynı vc_gitem bloğunda bulunur
    GRID_ITEM_RE = re.compile(
        r'post_date[^>]*>.*?'        # tarih div başlangıcı
        r'([\d]{1,2}\s+\w+\s+\d{4})'  # Türkçe tarih
        r'.*?'
        r'href=["\']([^"\']+)["\'][^>]*title=["\']([^"\']+)["\']',
        re.IGNORECASE | re.DOTALL,
    )

    ctx = _ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = _ssl.CERT_NONE

    for base_url in news_urls:
        try:
            req = request.Request(
                base_url,
                headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},
            )
            with request.urlopen(req, timeout=15, context=ctx) as resp:
                raw = resp.read().decode("utf-8", errors="replace")
        except Exception as exc:
            print(f"[fetch] {base_url} → {exc}", file=sys.stderr)
            continue

        base_domain = extract_domain(base_url)

        for m in GRID_ITEM_RE.finditer(raw):
            date_str, href, title_raw = m.group(1), m.group(2), m.group(3)
            title = _html.unescape(TAG_RE.sub("", title_raw)).strip()

            if not title or not href or len(title) < 10:
                continue

            # Mutlak URL
            if href.startswith("//"):
                href = "https:" + href
            elif href.startswith("/"):
                from urllib.parse import urlparse as _p
                parsed = _p(base_url)
                href = f"{parsed.scheme}://{parsed.netloc}{href}"
            elif not href.startswith("http"):
                continue

            if href in seen:
                continue
            if not is_domestic(href):
                continue
            if is_static_page(href):
                continue
            if NON_NEWS_DOMAINS.search(href):
                continue

            # Tarih çözümle — tarih yoksa ATLA
            published = parse_tr_date(date_str)
            if published is None:
                continue

            # Lookback kontrolü
            if not within_lookback(published):
                continue

            seen.add(href)
            domain = extract_domain(href) or base_domain
            results.append(Article(
                title=title,
                url=href,
                source=domain,
                snippet="",
                published=published,
                tags={label},
            ))

        if results:
            break  # ilk çalışan URL yeterliyse devam etme

    return results[:8]


# ── Toplama mantığı ──────────────────────────────────────────────────────────

def collect_provider_articles(token: str) -> Dict[str, List[Article]]:
    """Her provider için Article listesi döner. Boş olabilir — bu normaldir."""
    by_provider: Dict[str, List[Article]] = {p["label"]: [] for p in PROVIDERS.values()}
    seen: Dict[str, Set[str]] = {p["label"]: set() for p in PROVIDERS.values()}

    for prov_meta in PROVIDERS.values():
        label = prov_meta["label"]
        exact_terms = prov_meta["exact_terms"]
        kep_required = prov_meta.get("kep_context_required", False)
        own_domains = prov_meta["own_domains"]

        for query in prov_meta["queries"]:
            for news_mode in (True, False):
                results = brave_query(query, token, news=news_mode)
                for item in results:
                    url, title, snippet, domain, published = item_to_article(item)
                    if not url or not title:
                        continue
                    if url in seen[label]:
                        continue
                    # 1. Yurt içi filtresi (.tr)
                    if not is_domestic(url):
                        continue
                                    # 2. Statik/evergreen sayfaları atla (SSS, ürün, kariyer vb.)
                    if is_static_page(url):
                        continue
                    # 2b. Sosyal medya, uygulama mağazası vb. atla
                    if NON_NEWS_DOMAINS.search(url):
                        continue
                    # 2c. Ana sayfa ise atla (path "/" veya boş)
                    from urllib.parse import urlparse as _up
                    if _up(url).path.strip("/") == "":
                        continue
                    # 3. Tarih filtresi — tarih yoksa kabul et, varsa son 7 gün
                    if published and not within_lookback(published):
                        continue
                    # 4. Provider adı birebir geçmeli (başlık veya snippet)
                    combined = f"{title} {snippet}"
                    if not text_contains_any(combined, exact_terms):
                        continue
                    # 5. EDM / TBM için KEP bağlamı zorunlu
                    if kep_required and not text_contains_any(combined, ["kep", "kayıtlı elektronik"]):
                        continue

                    seen[label].add(url)
                    by_provider[label].append(Article(
                        title=title, url=url, source=domain,
                        snippet=snippet, published=published,
                        tags={label},
                    ))

    # ── Firmaların kendi sitelerini doğrudan tara (Brave'de çıkmayanlar için) ──
    for prov_meta in PROVIDERS.values():
        label = prov_meta["label"]
        news_urls = prov_meta.get("news_urls", [])
        if not news_urls:
            continue
        site_articles = fetch_site_articles(news_urls, label, prov_meta["exact_terms"])
        for art in site_articles:
            if art.url not in seen[label]:
                seen[label].add(art.url)
                by_provider[label].append(art)

    # Her sağlayıcı için tarihe göre sırala (tarihsizler sona)
    for label in by_provider:
        by_provider[label].sort(
            key=lambda a: a.published or datetime.min.replace(tzinfo=timezone.utc),
            reverse=True,
        )
    return by_provider


def collect_topic_articles(token: str) -> Dict[str, List[Article]]:
    """Konu başlıklarına göre Article listesi döner."""
    by_topic: Dict[str, List[Article]] = {}
    seen_urls: Set[str] = set()

    for query, label, required_terms in TOPIC_QUERIES:
        by_topic[label] = []
        for news_mode in (True, False):
            results = brave_query(query, token, news=news_mode)
            for item in results:
                url, title, snippet, domain, published = item_to_article(item)
                if not url or not title:
                    continue
                if url in seen_urls:
                    continue
                if not is_domestic(url):
                    continue
                if is_static_page(url):
                    continue
                if NON_NEWS_DOMAINS.search(url):
                    continue
                from urllib.parse import urlparse as _up2
                if _up2(url).path.strip("/") == "":
                    continue
                if published and not within_lookback(published):
                    continue
                combined = f"{title} {snippet}"
                if not text_contains_any(combined, required_terms):
                    continue
                seen_urls.add(url)
                by_topic[label].append(Article(
                    title=title, url=url, source=domain,
                    snippet=snippet, published=published,
                    tags={label},
                ))
            if by_topic[label]:
                break  # news bulunduysa web'e geçme

        by_topic[label].sort(
            key=lambda a: a.published or datetime.min.replace(tzinfo=timezone.utc),
            reverse=True,
        )
    return by_topic


# ── Email oluşturma ──────────────────────────────────────────────────────────

def fmt_date(dt: Optional[datetime]) -> str:
    if dt is None:
        return "tarih yok"
    return dt.astimezone(TIMEZONE).strftime("%d %b %Y")


EMPTY_MSG = "Bu hafta bu bölümde yurt içi kaynaklarda haber bulunamadı."

_CARD_STYLE = (
    "border-left:3px solid #1a73e8;padding:10px 14px;"
    "margin:10px 0;background:#fafafa;border-radius:0 4px 4px 0"
)
_H2_STYLE = "color:#333;border-bottom:2px solid #e0e0e0;padding-bottom:6px;margin-top:28px"
_TAG_STYLE = (
    "background:#e8f0fe;padding:2px 7px;border-radius:3px;"
    "font-size:11px;margin-right:4px;color:#1a73e8"
)


def html_article_card(art: Article) -> str:
    tags_html = "".join(
        f"<span style='{_TAG_STYLE}'>{t}</span>" for t in sorted(art.tags)
    )
    snippet_html = ""
    if art.snippet:
        safe = art.snippet[:220].replace("<", "&lt;").replace(">", "&gt;")
        if len(art.snippet) > 220:
            safe += "…"
        snippet_html = f"<p style='margin:4px 0 0;color:#555;font-size:13px'>{safe}</p>"
    safe_title = art.title.replace("<", "&lt;").replace(">", "&gt;")
    return (
        f"<div style='{_CARD_STYLE}'>"
        f"<a href='{art.url}' style='font-weight:600;color:#1a0dab;text-decoration:none;font-size:14px'>{safe_title}</a>"
        f"<div style='color:#777;font-size:12px;margin:3px 0'>{art.source} &nbsp;·&nbsp; {fmt_date(art.published)}</div>"
        f"<div style='margin:4px 0'>{tags_html}</div>"
        f"{snippet_html}"
        f"</div>"
    )


def html_section(title: str, articles: List[Article]) -> str:
    if not articles:
        return (
            f"<h2 style='{_H2_STYLE}'>{title}</h2>"
            f"<p style='color:#aaa;font-style:italic'>{EMPTY_MSG}</p>"
        )
    cards = "".join(html_article_card(a) for a in articles[:8])
    return f"<h2 style='{_H2_STYLE}'>{title}</h2>{cards}"


def text_section(title: str, articles: List[Article]) -> List[str]:
    lines = [f"\n{'─'*58}", f"  {title}", f"{'─'*58}"]
    if not articles:
        lines.append(f"  {EMPTY_MSG}")
        return lines
    for i, art in enumerate(articles[:8], 1):
        lines.append(f"\n[{i}] {art.title}")
        lines.append(f"    Kaynak : {art.source}  |  {fmt_date(art.published)}")
        if art.snippet:
            wrapped = fill(art.snippet, width=88, subsequent_indent="           ")
            lines.append(f"    Özet   : {wrapped}")
        lines.append(f"    URL    : {art.url}")
    return lines


def build_email(
    by_provider: Dict[str, List[Article]],
    by_topic: Dict[str, List[Article]],
) -> Tuple[str, str, str]:
    now = datetime.now(TIMEZONE)
    week_start = (now - timedelta(days=7)).strftime("%d %b")
    week_end = now.strftime("%d %b %Y")
    subject = f"[KEP Watch] Haftalık Özet — {week_start} – {week_end}"

    total_prov = sum(len(v) for v in by_provider.values())
    total_topic = sum(len(v) for v in by_topic.values())
    total = total_prov + total_topic

    # ── Plain text ──────────────────────────────────────────────────────────
    lines: List[str] = [
        "Merhaba Ayhan,",
        "",
        f"Son 7 günde ({week_start} – {week_end}) KEP ekosistemindeki yurt içi gelişmeler.",
        f"Toplam: {total_prov} sağlayıcı haberi + {total_topic} konu haberi",
        "",
    ]

    prov_order = ["TÜRKKEP", "EDM", "TBM", "PTTKEP"]
    for p in prov_order:
        lines.extend(text_section(f"📌 {p}", by_provider.get(p, [])))

    lines.extend(text_section("📋 Konu Başlıkları", [
        a for arts in by_topic.values() for a in arts
    ]))

    lines += [
        "",
        "─" * 58,
        "Kaynak: Brave Search — sadece .tr domainleri · Her Pazartesi 09:00",
        "İyi çalışmalar.",
    ]
    plain = "\n".join(lines)

    # ── HTML ────────────────────────────────────────────────────────────────
    prov_html = "".join(
        html_section(f"📌 {p}", by_provider.get(p, []))
        for p in prov_order
    )

    # Topic'leri alt başlıklara böl — sadece içeriği olanları göster
    topic_html_parts = []
    for label, arts in by_topic.items():
        topic_html_parts.append(html_section(f"&nbsp;&nbsp;{label}", arts))
    topic_block = (
        f"<h2 style='{_H2_STYLE}'>📋 Konu Başlıkları</h2>"
        + "".join(topic_html_parts)
        if topic_html_parts else ""
    )

    html = f"""<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: Arial, sans-serif; max-width: 760px; margin: auto; padding: 20px 24px; color: #333; }}
    a {{ color: #1a0dab; }}
    h1 {{ color: #1a73e8; margin-bottom: 4px; }}
    .meta {{ color: #777; font-size: 13px; margin-bottom: 24px; }}
    .footer {{ color: #aaa; font-size: 11px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 10px; }}
  </style>
</head>
<body>
  <h1>📬 KEP Watch — Haftalık Özet</h1>
  <div class="meta">{week_start} – {week_end} &nbsp;·&nbsp; <strong>{total_prov}</strong> sağlayıcı + <strong>{total_topic}</strong> konu haberi &nbsp;·&nbsp; Sadece yurt içi (.tr)</div>
  {prov_html}
  {topic_block}
  <div class="footer">
    Bu rapor OpenClaw tarafından Brave Search üzerinden otomatik derlenmiştir.<br>
    Kriter: .tr domain zorunlu · Provider adı birebir eşleşmeli · Her Pazartesi 09:00 (Europe/Istanbul)
  </div>
</body>
</html>"""

    return subject, plain, html


# ── Mail gönderme ────────────────────────────────────────────────────────────

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


# ── Giriş noktası ────────────────────────────────────────────────────────────

def main() -> int:
    env = load_env(ENV_PATH)
    brave_token = env.get("BRAVE_API_KEY")
    gmail_user = env.get("GMAIL_EMAIL")
    gmail_pass = env.get("GMAIL_APP_PASSWORD")

    missing = [n for n, v in (
        ("BRAVE_API_KEY", brave_token),
        ("GMAIL_EMAIL", gmail_user),
        ("GMAIL_APP_PASSWORD", gmail_pass),
    ) if not v]
    if missing:
        print(f"[error] Eksik env değişkenleri: {', '.join(missing)}", file=sys.stderr)
        return 1

    print("[kep_watch] Brave Search sorguları başlatılıyor…", file=sys.stderr)
    by_provider = collect_provider_articles(brave_token)
    by_topic = collect_topic_articles(brave_token)

    prov_counts = {k: len(v) for k, v in by_provider.items()}
    topic_counts = {k: len(v) for k, v in by_topic.items()}
    print(f"[kep_watch] Sağlayıcılar: {prov_counts}", file=sys.stderr)
    print(f"[kep_watch] Konular: {topic_counts}", file=sys.stderr)

    subject, plain, html = build_email(by_provider, by_topic)
    send_email(gmail_user, gmail_pass, RECIPIENT, subject, plain, html)
    total = sum(prov_counts.values()) + sum(topic_counts.values())
    print(f"[kep_watch] Email gönderildi: {total} haber — '{subject}'")
    return 0


if __name__ == "__main__":
    sys.exit(main())
