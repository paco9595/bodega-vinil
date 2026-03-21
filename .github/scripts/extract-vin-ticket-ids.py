#!/usr/bin/env python3
"""
Extrae identificadores VIN-XX del PR: título, body, rama, etiquetas y todos los commits (paginado).
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request


def fetch_pr_commits_all_pages() -> str:
    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ["GITHUB_REPO"]
    pr = os.environ["PR_NUMBER"]
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    page = 1
    messages: list[str] = []
    while True:
        url = (
            f"https://api.github.com/repos/{repo}/pulls/{pr}/commits"
            f"?per_page=100&page={page}"
        )
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.load(r)
        except (urllib.error.URLError, json.JSONDecodeError):
            break
        if not isinstance(data, list) or len(data) == 0:
            break
        for c in data:
            msg = c.get("commit", {}).get("message") or ""
            messages.append(msg)
        if len(data) < 100:
            break
        page += 1
    return "\n".join(messages)


def main() -> None:
    text_parts: list[str] = [
        os.environ.get("PR_TITLE") or "",
        os.environ.get("PR_BODY") or "",
        os.environ.get("PR_HEAD_REF") or "",
        fetch_pr_commits_all_pages(),
    ]
    labels_raw = os.environ.get("PR_LABELS_JSON") or "[]"
    label_names: list[str] = []
    try:
        labels = json.loads(labels_raw)
        if isinstance(labels, list):
            for lab in labels:
                if not isinstance(lab, dict):
                    continue
                name = lab.get("name") or ""
                desc = lab.get("description") or ""
                label_names.append(name)
                text_parts.append(name)
                text_parts.append(desc)
    except json.JSONDecodeError:
        pass

    text = "\n".join(text_parts)
    found: set[str] = set()
    for m in re.finditer(r"(?i)VIN-\d+", text):
        num = re.search(r"\d+", m.group())
        if num:
            found.add(f"VIN-{num.group()}")

    # Log útil en Actions (stderr no afecta a la captura de stdout)
    preview = text.replace("\n", " ")[:400]
    print(f"Combined text preview: {preview}...", file=sys.stderr)
    print(f"Label names: {label_names}", file=sys.stderr)

    for vid in sorted(found):
        print(vid)


if __name__ == "__main__":
    main()
