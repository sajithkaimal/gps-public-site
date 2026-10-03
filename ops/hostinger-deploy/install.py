#!/usr/bin/env python3
"""Install the GPS-only publisher and Bob runbook as the Kendra user."""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
from datetime import datetime, timezone

SOURCE = Path(__file__).resolve().parent
HOME = Path.home()
STAMP = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
BEGIN = "<!-- gps-deploy:begin -->"
END = "<!-- gps-deploy:end -->"
BLOCK = """GPS hourly deployment is owned by Bob. For gpsouth.org deployment status,
failures, deploy-now, pause/resume, and rollback, read GPS_DEPLOYMENT.md and use
`/home/kendra/.local/bin/gps-deploy`. GitHub GPS `main` carries Sajith's standing
deployment authorization; do not request per-release approval for this job.
"""


def write(path, text, mode=0o600):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    if path.exists() and path.read_text() != text:
        shutil.copy2(path, path.with_name(path.name + ".bak-gps-deploy-" + STAMP))
    temp = path.with_name(path.name + ".tmp-gps-deploy")
    temp.write_text(text)
    temp.chmod(mode)
    os.replace(temp, path)


def prepend(path, block):
    text = path.read_text() if path.exists() else "# Agent operations\n"
    if BEGIN in text and END in text:
        start = text.index(BEGIN); end = text.index(END, start) + len(END)
        text = text[:start] + text[end:]
    # Keep YAML skill frontmatter intact, and place instructions before legacy text.
    if text.startswith("---\n"):
        boundary = text.find("\n---", 4) + 4
        head, tail = text[:boundary], text[boundary:]
    else:
        head, _, tail = text.partition("\n")
    write(path, head + "\n\n" + BEGIN + "\n" + block.rstrip() + "\n" + END + "\n\n" + tail.lstrip())


def main():
    os.umask(0o077)
    if str(HOME) != "/home/kendra": raise SystemExit("Install only as the existing Kendra user")
    # Never replace a running publisher while it holds its transaction lock.
    import fcntl
    state = HOME / ".local/state/gps-deploy"
    state.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (state / "lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        version = hashlib.sha256((SOURCE / "gps_deploy.py").read_bytes()).hexdigest()[:16]
        release = HOME / ".local/share/gps-deploy" / version
        release.mkdir(parents=True, exist_ok=True, mode=0o700)
        for name in ("gps_deploy.py", "README.md", "BOB.md"):
            write(release / name, (SOURCE / name).read_text())
        write(HOME / ".local/bin/gps-deploy", '#!/bin/sh\nexec /usr/bin/python3 ' + str(release / "gps_deploy.py") + ' "$@"\n', 0o755)
        units = HOME / ".config/systemd/user"
        for name in ("gps-deploy.service", "gps-deploy.timer"):
            write(units / name, (SOURCE / name).read_text(), 0o644)
        (HOME / ".config/gps-deploy").mkdir(parents=True, exist_ok=True, mode=0o700)
        for base in (HOME / ".openclaw/workspace-bob-the-builder", HOME / ".openclaw/agents/bob_the_builder"):
            if base.exists():
                write(base / "GPS_DEPLOYMENT.md", (SOURCE / "BOB.md").read_text())
                prepend(base / "AGENTS.md", BLOCK)
        company = HOME / ".openclaw/businesses/gps"
        for base in (company / "agents/cto", HOME / ".openclaw/workspace-gps-cto"):
            if base.exists():
                write(base / "GPS_DEPLOYMENT.md", (SOURCE / "BOB.md").read_text())
                prepend(base / "AGENTS.md", BLOCK)
                skill = base / "skills/gps-website-operations/SKILL.md"
                if skill.exists(): prepend(skill, BLOCK + "\nThis standing main-to-Hostinger authorization supersedes the old per-release approval and adapter-pending instructions below for this fixed job only. Source changes still follow the existing Bob/Forge workflow.")
        write(company / "shared/ops/website/GPS_DEPLOYMENT.md", (SOURCE / "README.md").read_text())
        website = company / "shared/ops/website/README.md"
        if website.exists(): prepend(website, BLOCK + "\nRead GPS_DEPLOYMENT.md for the installed publisher. The timer is enabled only after a verified first release and private token provisioning. The inspection helper remains read-only; the publisher is gps-deploy.")
        write(state / "authorization.json", json.dumps({"authorized_by": "sajith", "authorized_on": "2026-10-03", "repository": "sajithkaimal/gps-public-site", "branch": "main", "site": "https://gpsouth.org", "rule": "Each main update authorizes deployment after checks pass", "operator": "bob_the_builder"}, indent=2) + "\n")
        write(state / "installed.json", json.dumps({"version": version, "installed_at": STAMP, "source": str(SOURCE)}, indent=2) + "\n")
        subprocess.run(["systemctl", "--user", "daemon-reload"], check=True)
        print(json.dumps({"ok": True, "installed_version": version, "command": str(HOME / ".local/bin/gps-deploy"), "timer_enabled_by_installer": False, "token_file": str(HOME / ".config/gps-deploy/hostinger.token")}))


if __name__ == "__main__": main()
