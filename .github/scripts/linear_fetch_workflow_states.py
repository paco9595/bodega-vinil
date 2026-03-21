#!/usr/bin/env python3
"""Obtiene workflowStates de Linear para el equipo indicado (nombre exacto en Linear)."""
from __future__ import annotations

import json
import os
import urllib.request


def main() -> None:
    api_key = os.environ["LINEAR_API_KEY"]
    team = os.environ.get("LINEAR_TEAM_NAME", "Bearpoint").strip()
    if not team:
        team = "Bearpoint"

    # GraphQL: comillas en el nombre del equipo dentro de la query
    escaped = team.replace("\\", "\\\\").replace('"', '\\"')
    query = (
        "{ workflowStates(filter: { team: { name: { eq: \""
        + escaped
        + "\" } } }) { nodes { id name type } } }"
    )
    body = json.dumps({"query": query}).encode("utf-8")
    req = urllib.request.Request(
        "https://api.linear.app/graphql",
        data=body,
        headers={
            "Authorization": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        out = r.read().decode()
    print(out, end="")


if __name__ == "__main__":
    main()
