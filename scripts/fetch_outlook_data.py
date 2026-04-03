#!/usr/bin/env python3
"""Fetch recent Outlook mail, calendar, and task data via Microsoft Graph."""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib import error, parse, request

WORKSPACE = Path(__file__).resolve().parents[1]
ENV_FILE = WORKSPACE / ".env"
DATA_DIR = WORKSPACE / "data" / "outlook"
TARGET_USER = os.environ.get("MS_TARGET_USER", "ayhan.agirgol@finhouse.com.tr")


def load_env_file() -> dict:
    values: dict[str, str] = {}
    if not ENV_FILE.exists():
        return values
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        values[k.strip()] = v.strip().strip('"').strip("'")
    return values


ENV_MAP = load_env_file()


def env_value(key: str) -> str | None:
    if key in os.environ:
        return os.environ[key]
    return ENV_MAP.get(key)


TENANT_ID = env_value("MS_TENANT_ID")
CLIENT_ID = env_value("MS_CLIENT_ID")
CLIENT_SECRET = env_value("MS_CLIENT_SECRET")
TOKEN_ENDPOINT = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
GRAPH_ROOT = "https://graph.microsoft.com/v1.0"


def ensure_config() -> None:
    missing = [
        name
        for name, value in (
            ("MS_TENANT_ID", TENANT_ID),
            ("MS_CLIENT_ID", CLIENT_ID),
            ("MS_CLIENT_SECRET", CLIENT_SECRET),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(f"Eksik ortam değişkenleri: {', '.join(missing)}")


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


def graph_get(token: str, path: str, params: dict | None = None) -> dict:
    url = f"{GRAPH_ROOT}/{path}"
    if params:
        url += "?" + parse.urlencode(params)
    req = request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with request.urlopen(req, timeout=20) as resp:
            return json.load(resp)
    except error.HTTPError as exc:
        body = exc.read().decode()
        raise RuntimeError(f"Graph isteği başarısız ({path}): {body}") from exc


def save_json(name: str, data: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = DATA_DIR / name
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def fetch_mail(token: str) -> dict:
    params = {
        "$orderby": "receivedDateTime DESC",
        "$top": 5,
        "$select": "subject,from,receivedDateTime,isRead,webLink,bodyPreview",
    }
    return graph_get(token, f"users/{TARGET_USER}/messages", params)


def fetch_calendar(token: str) -> dict:
    start = datetime.now(timezone.utc)
    end = start + timedelta(days=7)
    params = {
        "startDateTime": start.isoformat(),
        "endDateTime": end.isoformat(),
        "$orderby": "start/dateTime",
        "$top": 20,
        "$select": "subject,start,end,location,webLink,organizer",
    }
    return graph_get(token, f"users/{TARGET_USER}/calendarView", params)


def fetch_tasks(token: str) -> dict | None:
    lists = graph_get(token, f"users/{TARGET_USER}/todo/lists")
    list_id = None
    for entry in lists.get("value", []):
        if entry.get("wellknownListName") == "defaultList" or entry.get("displayName") == "Tasks":
            list_id = entry.get("id")
            break
    if not list_id:
        return None
    params = {
        "$top": 20,
        "$filter": "status ne 'completed'",
        "$select": "title,status,dueDateTime,createdDateTime,importance",
    }
    list_id_odata = list_id.replace("'", "''")
    return graph_get(token, f"users/{TARGET_USER}/todo/lists('{list_id_odata}')/tasks", params)


def main() -> int:
    ensure_config()
    token = get_token()

    try:
        mail = fetch_mail(token)
        save_json("mail.json", mail)
        print(f"Mail: {len(mail.get('value', []))} kayıt alındı")
    except RuntimeError as exc:
        print(exc, file=sys.stderr)

    try:
        calendar = fetch_calendar(token)
        save_json("calendar.json", calendar)
        print(f"Takvim: {len(calendar.get('value', []))} kayıt alındı")
    except RuntimeError as exc:
        print(exc, file=sys.stderr)

    try:
        tasks = fetch_tasks(token)
        if tasks is not None:
            save_json("tasks.json", tasks)
            print(f"Görevler: {len(tasks.get('value', []))} kayıt alındı")
        else:
            print("Görev listesi bulunamadı")
    except RuntimeError as exc:
        print(exc, file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
