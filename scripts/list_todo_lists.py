#!/usr/bin/env python3
"""List Microsoft To-Do lists for debugging purpose."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from urllib import error, parse, request

WORKSPACE = Path(__file__).resolve().parents[1]
ENV_FILE = WORKSPACE / ".env"


def env_value(key: str) -> str | None:
    if key in os.environ:
        return os.environ[key]
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            if k.strip() == key:
                return v.strip().strip('"').strip("'")
    return None


TENANT_ID = env_value("MS_TENANT_ID")
CLIENT_ID = env_value("MS_CLIENT_ID")
CLIENT_SECRET = env_value("MS_CLIENT_SECRET")
TOKEN_ENDPOINT = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
GRAPH_ROOT = "https://graph.microsoft.com/v1.0"
TARGET_USER = os.environ.get("MS_TARGET_USER", "ayhan.agirgol@finhouse.com.tr")


def get_token() -> str:
    payload = parse.urlencode(
        {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "scope": "https://graph.microsoft.com/.default",
            "grant_type": "client_credentials",
        }
    ).encode()
    req = request.Request(TOKEN_ENDPOINT, data=payload, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    try:
        with request.urlopen(req, timeout=20) as resp:
            data = json.load(resp)
            return data["access_token"]
    except error.HTTPError as exc:
        raise RuntimeError(f"Token isteği başarısız: {exc.read().decode()}" ) from exc


def graph_get(token: str, path: str) -> dict:
    url = f"{GRAPH_ROOT}/{path}"
    req = request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with request.urlopen(req, timeout=20) as resp:
            return json.load(resp)
    except error.HTTPError as exc:
        body = exc.read().decode()
        raise RuntimeError(f"Graph isteği başarısız ({path}): {body}") from exc


def main() -> int:
    try:
        token = get_token()
    except RuntimeError as e:
        print(e, file=sys.stderr)
        return 1

    try:
        lists = graph_get(token, f"users/{TARGET_USER}/todo/lists")
    except RuntimeError as e:
        print(e, file=sys.stderr)
        return 1

    print(f"{len(lists.get('value', []))} görev listesi bulundu:")
    for li in lists.get('value', []):
        print(f"- ID: {li.get('id')}, Adı: {li.get('displayName')}, wellknownListName: {li.get('wellknownListName')}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
