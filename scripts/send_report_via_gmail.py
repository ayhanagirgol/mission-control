#!/usr/bin/env python3
import argparse
import os
from pathlib import Path

from gmail_smtp import load_env_file, send_email, get_required_env


def markdown_to_basic_html(markdown: str) -> str:
    lines = markdown.splitlines()
    out = ["<html><body style=\"font-family: Arial, sans-serif; line-height: 1.5; color: #222;\">"]
    in_list = False
    for raw in lines:
        line = raw.strip()
        if not line:
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append("<br/>")
            continue
        if line.startswith("# "):
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h1>{line[2:]}</h1>")
        elif line.startswith("## "):
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{line[2:]}</li>")
        else:
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<p>{line}</p>")
    if in_list:
        out.append("</ul>")
    out.append("</body></html>")
    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", default=".env")
    parser.add_argument("--to", default="")
    parser.add_argument("--subject", required=True)
    parser.add_argument("--text-file", required=True)
    parser.add_argument("--html-file", default="")
    args = parser.parse_args()

    load_env_file(args.env)
    recipients = [x.strip() for x in (args.to or get_required_env("EMAIL_TO")).split(",") if x.strip()]
    text_body = Path(args.text_file).read_text(encoding="utf-8")
    html_body = Path(args.html_file).read_text(encoding="utf-8") if args.html_file else markdown_to_basic_html(text_body)
    send_email(args.subject, text_body, html_body, recipients)
    print(f"[OK] Mail gönderildi: {', '.join(recipients)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
