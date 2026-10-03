#!/usr/bin/env python3
"""Fixed-target GPS publisher. No model, third-party Python packages, or web API."""
from __future__ import annotations

import argparse
import contextlib
import fcntl
import hashlib
import io
import json
import os
import re
import shlex
import shutil
import stat
import subprocess
import sys
import tarfile
import time
import uuid
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlsplit
from urllib.request import Request, urlopen

REPOSITORY = "https://github.com/sajithkaimal/gps-public-site.git"
SITE = "https://gpsouth.org"
HOST = "u775171676@62.72.50.26"
WEBROOT = "/home/u775171676/domains/gpsouth.org/public_html"
STAGING = "/home/u775171676/domains/gpsouth.org/.gps-deploy"
HOME = Path.home()
STATE = HOME / ".local/state/gps-deploy"
TOKEN_FILE = HOME / ".config/gps-deploy/hostinger.token"
SERVICE = "gps-deploy.service"
TIMER = "gps-deploy.timer"
ASSET_TYPES = {".css", ".js", ".webmanifest", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".mp4", ".webm", ".mp3", ".ogg", ".woff", ".woff2", ".ttf", ".otf"}
ROOT_FILES = {"index.html", "404.html", "favicon.ico", "favicon.png", "robots.txt", "sitemap.xml", "send.php", ".htaccess"}
EXCLUDED_PARTS = {"private", "staff", "draft", "drafts", "backup", "backups", "uploads", "src", "ops", "node_modules"}


class DeployError(RuntimeError):
    pass


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def digest(path):
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def save(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    temporary = path.with_name(path.name + ".tmp")
    with temporary.open("w") as stream:
        json.dump(data, stream, indent=2, sort_keys=True)
        stream.write("\n")
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)


def load_state():
    path = STATE / "state.json"
    if not path.exists():
        return {"schema_version": 1, "deployed": None, "previous": None, "pending": None, "last_attempt": None}
    data = json.loads(path.read_text())
    if data.get("schema_version") != 1:
        raise DeployError("Unsupported deployment state version")
    return data


@contextlib.contextmanager
def locked():
    STATE.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (STATE / "lock").open("a") as stream:
        try:
            fcntl.flock(stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as exc:
            raise DeployError("Another GPS deployment command is running") from exc
        yield


def run(command, *, timeout=120, input=None):
    try:
        result = subprocess.run(command, input=input, capture_output=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise DeployError(f"{Path(command[0]).name} unavailable or timed out") from exc
    if result.returncode:
        # Commands never receive the API token; bound operational diagnostics.
        error = result.stderr.decode(errors="replace")[-1500:].strip()
        if not error:
            try: error = json.loads(result.stdout).get("error", "")[:1500]
            except (ValueError, AttributeError): pass
        raise DeployError(f"{Path(command[0]).name} failed ({result.returncode}): {error}")
    return result.stdout


def ssh_options():
    return ["ssh", "-F", "/dev/null", "-T", "-p", "65002", "-i", str(HOME / ".ssh/gps_hostinger_ed25519"),
            "-o", "BatchMode=yes", "-o", "IdentitiesOnly=yes", "-o", "IdentityAgent=none",
            "-o", "StrictHostKeyChecking=yes", "-o", f"UserKnownHostsFile={HOME}/.ssh/gps_hostinger_known_hosts",
            "-o", "GlobalKnownHostsFile=/dev/null", "-o", "UpdateHostKeys=no", "-o", "ForwardAgent=no",
            "-o", "PasswordAuthentication=no", "-o", "KbdInteractiveAuthentication=no",
            "-o", "ConnectTimeout=8", "-o", "ServerAliveInterval=10", "-o", "ServerAliveCountMax=2",
            "-o", "ControlMaster=no", "-o", "ControlPath=none", "-o", "ClearAllForwardings=yes"]


# Runs on Hostinger through its existing SSH account. Payload is JSON on stdin,
# never interpolated shell code. All operations stay inside the GPS domain.
REMOTE_CODE = r'''
import hashlib,json,os,re,shutil,stat,sys
from pathlib import Path,PurePosixPath
ROOT=Path("/home/u775171676/domains/gpsouth.org/public_html")
STAGE=Path("/home/u775171676/domains/gpsouth.org/.gps-deploy")
def checked(base,rel="",directory=False):
    parts=PurePosixPath(rel).parts
    if rel and (rel.startswith("/") or any(p in (".","..") for p in parts) or str(PurePosixPath(rel))!=rel or not re.fullmatch(r"[A-Za-z0-9_. /-]+",rel)):
        raise RuntimeError("Unsafe relative path")
    p=base.joinpath(*parts)
    for ancestor in [p,*p.parents]:
        if ancestor.exists() or ancestor.is_symlink():
            mode=ancestor.lstat().st_mode
            if stat.S_ISLNK(mode): raise RuntimeError("Symlink refused: "+str(ancestor))
            if ancestor!=p and not stat.S_ISDIR(mode): raise RuntimeError("Non-directory ancestor")
    if p.exists() and not (p.is_dir() if directory else p.is_file()):
        raise RuntimeError("Wrong path type: "+rel)
    return p
def sha(p):
    if not p.exists(): return None
    h=hashlib.sha256()
    with p.open("rb") as f:
        for block in iter(lambda:f.read(262144),b""): h.update(block)
    return h.hexdigest()
def current(paths): return {p:sha(checked(ROOT,p)) for p in paths}
def main(q):
    checked(ROOT,directory=True)
    if not ROOT.is_dir(): raise RuntimeError("GPS webroot is missing")
    action=q["action"]
    if action=="snapshot": return current(q["paths"])
    ident=q["id"]
    if not re.fullmatch(r"[a-f0-9]{32}",ident): raise RuntimeError("Unsafe transaction ID")
    checked(STAGE,directory=True)
    folder=checked(STAGE,ident,directory=True)
    before=q["before"]
    desired=q["desired"]
    if action=="prepare":
        if current(before)!=before: raise RuntimeError("Production changed before backup")
        folder.mkdir(parents=True,exist_ok=True,mode=0o700)
        for name in ("new","before"): checked(folder,name,directory=True).mkdir(exist_ok=True,mode=0o700)
        for rel,h in before.items():
            if h is None: continue
            target=checked(folder/"before",rel)
            target.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
            shutil.copyfile(checked(ROOT,rel),target)
            os.chmod(target,0o600)
            if sha(target)!=h: raise RuntimeError("Production changed while backing up: "+rel)
        return {"prepared":True}
    if action=="check-stage":
        for rel,h in desired.items():
            if h is not None and sha(checked(folder/"new",rel))!=h: raise RuntimeError("Staged hash mismatch: "+rel)
        return {"verified":True}
    if action=="promote":
        # A prior interrupted call may have already promoted some of these paths.
        observed=current(before)
        for rel,h in observed.items():
            if h not in (before[rel],desired[rel]): raise RuntimeError("Production drift during recovery: "+rel)
            if before[rel] is not None and sha(checked(folder/"before",rel))!=before[rel]: raise RuntimeError("Backup hash mismatch: "+rel)
            if h!=desired[rel] and desired[rel] is not None and sha(checked(folder/"new",rel))!=desired[rel]: raise RuntimeError("Staged hash mismatch: "+rel)
        def order(rel):
            return (2 if desired[rel] is None else (1 if rel.endswith(".html") else 0),rel)
        for rel in sorted(desired,key=order):
            target=checked(ROOT,rel)
            if sha(target)==desired[rel]: continue
            if desired[rel] is None:
                target.unlink()
            else:
                missing=[]
                parent=target.parent
                while not parent.exists(): missing.append(parent);parent=parent.parent
                for p in reversed(missing): p.mkdir(mode=0o755)
                os.chmod(checked(folder/"new",rel),0o644)
                os.replace(folder/"new"/rel,target)
        if current(desired)!=desired: raise RuntimeError("Published hashes do not match")
        return {"uploaded":True}
    raise RuntimeError("Unknown remote operation")
try:
    print(json.dumps({"ok":True,"result":main(json.load(sys.stdin))}))
except Exception as e:
    print(json.dumps({"ok":False,"error":str(e)}));sys.exit(1)
'''


def remote(action, **payload):
    command = ssh_options() + [HOST, "python3 -c " + shlex.quote(REMOTE_CODE)]
    try:
        result = run(command, timeout=300, input=json.dumps({"action": action, **payload}).encode())
    except DeployError as exc:
        raise DeployError(f"Hostinger {action} failed; inspect the saved transaction and retry: {exc}") from exc
    response = json.loads(result)
    if not response.get("ok"):
        raise DeployError(response.get("error", "Hostinger operation failed"))
    return response["result"]


def transfer(source, destination, *, files=None):
    command = ["rsync", "-rlt", "--checksum", "--chmod=Du=rwx,Dgo=,Fu=rw,Fgo=", "--protect-args",
               "-e", shlex.join(ssh_options())]
    if files is not None:
        command += ["--files-from", str(files)]
    run(command + [source, destination], timeout=600)


def valid_path(rel):
    if not rel or not re.fullmatch(r"[A-Za-z0-9_. /-]+", rel) or str(PurePosixPath(rel)) != rel or rel.startswith("/") or ".." in PurePosixPath(rel).parts:
        raise DeployError(f"Unsafe deployment path: {rel}")
    return rel


def permitted(rel, pages):
    valid_path(rel)
    parts = PurePosixPath(rel).parts
    if any(p.lower() in EXCLUDED_PARTS or (p.startswith(".") and rel != ".htaccess") for p in parts):
        return False
    if rel in ROOT_FILES or re.fullmatch(r"google[a-zA-Z0-9]+\.html", rel):
        return True
    if rel in pages:
        return True
    return len(parts) > 1 and parts[0] == "assets" and (Path(rel).suffix.lower() in ASSET_TYPES or rel == "assets/search-index.json") and not re.search(r"(secrets?|credentials?|\.env|\.bak|\.map)(\.|$)", parts[-1], re.I)


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = set()
        self.forms = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "form": self.forms.append(attrs.get("action", ""))
        for key in ("src", "poster"):
            if attrs.get(key): self.assets.add(attrs[key])
        if tag == "link" and attrs.get("href") and any(t in attrs.get("rel", "") for t in ("stylesheet", "icon", "manifest", "preload")):
            self.assets.add(attrs["href"])


def package(checkout, destination):
    dist = checkout / "dist"
    if not dist.is_dir() or dist.is_symlink(): raise DeployError("Build must produce a regular dist directory")
    for p in dist.rglob("*"):
        if p.is_symlink(): raise DeployError("Output symlink refused: " + p.relative_to(dist).as_posix())
    sources = checkout / "src/pages"
    pages = {"index.html", "404.html", "submission-received/index.html"}
    for p in sources.glob("*.html"):
        if p.stem not in {"hero-a", "hero-b", "hero-c"}:
            pages.add(f"{p.stem}/index.html")
    # This repository's build copies only selected assets. Populate remaining
    # public assets from source without cleaning or discarding tracked dist assets.
    for source in [checkout / "assets", checkout / "submission-received"]:
        if source.is_symlink(): raise DeployError("Source directory symlink refused")
        if source.exists():
            for p in source.rglob("*"):
                rel = p.relative_to(checkout).as_posix()
                if p.is_symlink(): raise DeployError(f"Source symlink refused: {rel}")
                if p.is_file() and permitted(rel, pages):
                    target = dist / rel
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if target.is_symlink(): raise DeployError(f"Output symlink refused: {rel}")
                    shutil.copyfile(p, target)
    if (checkout / "send.php").is_file():
        if (checkout / "send.php").is_symlink() or (dist / "send.php").is_symlink(): raise DeployError("Contact-handler symlink refused")
        shutil.copyfile(checkout / "send.php", dist / "send.php")
    destination.mkdir(parents=True, exist_ok=True, mode=0o700)
    manifest = {}
    assets = set()
    for p in sorted(dist.rglob("*")):
        rel = p.relative_to(dist).as_posix()
        if p.is_symlink(): raise DeployError(f"Output symlink refused: {rel}")
        if not p.is_file() or not permitted(rel, pages): continue
        if p.suffix == ".html" and not re.fullmatch(r"google[a-zA-Z0-9]+\.html", rel):
            body = p.read_text()
            if "<html" not in body.lower() or "</html>" not in body.lower(): raise DeployError(f"Invalid built page: {rel}")
            parser = Page(); parser.feed(body)
            assets.update(parser.assets)
            if rel == "contact/index.html" and "/send.php" not in parser.forms: raise DeployError("Contact form no longer targets /send.php")
        target = destination / rel
        target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        shutil.copyfile(p, target)
        manifest[rel] = digest(target)
    for required in ("index.html", "contact/index.html", "send.php", ".htaccess", "assets/site.css", "assets/site.js"):
        if required not in manifest: raise DeployError(f"Required deployment file missing: {required}")
    missing_assets = set()
    for asset in assets:
        url = urlsplit(asset)
        if url.scheme or url.netloc or not url.path.startswith("/"): continue
        rel = valid_path(url.path.lstrip("/"))
        if rel not in manifest: missing_assets.add(rel)
    return manifest, sorted(missing_assets)


def latest():
    output = run(["git", "ls-remote", REPOSITORY, "refs/heads/main"], timeout=30).decode()
    sha = output.split()[0] if output.strip() else ""
    if not re.fullmatch(r"[a-f0-9]{40}", sha): raise DeployError("GitHub main did not return a commit")
    return sha


def build(sha, folder):
    cache = STATE / "source.git"
    if not cache.exists(): run(["git", "init", "--bare", str(cache)])
    run(["git", "-C", str(cache), "fetch", "--depth=1", "--no-tags", REPOSITORY, "refs/heads/main"], timeout=300)
    # Main can advance during fetch; retrieve the originally observed commit.
    run(["git", "-C", str(cache), "cat-file", "-e", sha + "^{commit}"])
    archive = run(["git", "-C", str(cache), "archive", sha], timeout=120)
    checkout = folder / "checkout"
    checkout.mkdir(parents=True, mode=0o700)
    with tarfile.open(fileobj=io.BytesIO(archive)) as stream:
        stream.extractall(checkout, filter="data")
    try:
        result = subprocess.run(["node", "scripts/run-build.js"], cwd=checkout, capture_output=True, timeout=180)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise DeployError("GPS build tool unavailable or timed out") from exc
    (folder / "build.log").write_bytes(result.stdout + result.stderr)
    if result.returncode: raise DeployError("GPS build failed; see the private build.log for this attempt")
    return package(checkout, folder / "payload")


def read_token():
    try:
        info = TOKEN_FILE.lstat()
        if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
            raise DeployError("Hostinger token must be a regular file owned by Kendra with mode 0600")
        token = TOKEN_FILE.read_text().strip()
        if not token or any(c.isspace() for c in token): raise DeployError("Hostinger token file must contain one token")
        return token
    except OSError as exc:
        raise DeployError(f"Hostinger API token unavailable; provision {TOKEN_FILE} privately with mode 0600") from exc


def purge():
    token = read_token()
    request = Request("https://developers.hostinger.com/api/hosting/v1/accounts/u775171676/websites/gpsouth.org/cache/clear",
                      method="DELETE", headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    try:
        with urlopen(request, timeout=45) as response:
            if response.status != 200: raise DeployError(f"Hostinger cache purge returned HTTP {response.status}")
    except HTTPError as exc:
        raise DeployError(f"Hostinger cache purge failed: HTTP {exc.code}; upload will not be repeated") from exc
    except (URLError, TimeoutError) as exc:
        raise DeployError("Hostinger cache purge failed: connection unavailable; upload will not be repeated") from exc


def public_path(rel):
    if rel == "index.html": return "/"
    if rel.endswith("/index.html"): return "/" + rel[:-11]
    return "/" + rel


def verify(manifest, changed):
    observed = remote("snapshot", paths=list(manifest))
    if observed != manifest: raise DeployError("Production hashes differ from the release manifest")
    checks = {"index.html", "contact/index.html", "assets/site.css", "assets/site.js"}
    checks.update(p for p in changed if p in manifest and p.endswith((".html", ".css", ".js", ".json")) and p not in {"404.html"})
    # Bootstrap rollback can restore a release with no historical Git receipt.
    if not manifest:
        manifest = remote("snapshot", paths=list(checks))
    for rel in sorted(checks):
        if not manifest.get(rel): continue
        url = SITE + quote(public_path(rel))
        failure = None
        for attempt in range(3):
            try:
                with urlopen(Request(url, headers={"Accept-Encoding": "identity", "User-Agent": "GPS-Deploy/1"}), timeout=30) as response:
                    final = urlsplit(response.url)
                    if final.scheme != "https" or final.netloc != "gpsouth.org": raise DeployError("Unexpected public redirect")
                    path = final.path.strip("/")
                    target = "index.html" if not path else (path if Path(path).suffix else path + "/index.html")
                    expected = manifest.get(target, manifest.get(rel))
                    body = response.read(16 * 1024 * 1024 + 1)
                    if len(body) > 16 * 1024 * 1024 or hashlib.sha256(body).hexdigest() != expected:
                        raise DeployError(f"HTTPS content does not match deployment: {public_path(rel)}")
                failure = None
                break
            except (HTTPError, URLError, TimeoutError, DeployError) as exc:
                failure = DeployError(f"HTTPS verification failed for {public_path(rel)}: {exc}")
                if attempt < 2: time.sleep(5)
        if failure: raise failure


def plan_changes(manifest, previous, observed):
    drift = [p for p, h in previous.items() if observed.get(p) != h]
    if drift: raise DeployError("Production drift in managed files: " + ", ".join(drift[:10]))
    desired = {p: h for p, h in manifest.items() if observed.get(p) != h}
    desired.update({p: None for p in previous if p not in manifest})
    before = {p: observed.get(p) for p in desired}
    return before, desired


def advance(state):
    tx = state["pending"]
    folder = STATE / "releases" / tx["id"]
    if tx["phase"] == "prepare":
        remote("prepare", id=tx["id"], before=tx["before"], desired=tx["desired"])
        backup = folder / "backup"; backup.mkdir(exist_ok=True, mode=0o700)
        transfer(f"{HOST}:{STAGING}/{tx['id']}/before/", str(backup) + "/")
        for rel, h in tx["before"].items():
            if h is not None and digest(backup / rel) != h: raise DeployError("Local backup hash mismatch: " + rel)
        file_list = folder / "upload-files.txt"
        file_list.write_text("".join(p + "\n" for p,h in tx["desired"].items() if h is not None))
        transfer(str(folder / "payload") + "/", f"{HOST}:{STAGING}/{tx['id']}/new/", files=file_list)
        remote("check-stage", id=tx["id"], before=tx["before"], desired=tx["desired"])
        tx["phase"] = "upload"; save(STATE / "state.json", state)
    if tx["phase"] == "upload":
        remote("promote", id=tx["id"], before=tx["before"], desired=tx["desired"])
        tx["phase"] = "cache"; save(STATE / "state.json", state)
    if tx["phase"] == "cache":
        purge()
        tx["phase"] = "verify"; save(STATE / "state.json", state)
    if tx["phase"] == "verify":
        verify(tx["manifest"], tx["desired"])
        receipt = {"sha": tx["sha"], "manifest": tx["manifest"], "at": now(), "transaction_id": tx["id"], "kind": tx["kind"]}
        state["previous"] = state["deployed"]
        state["deployed"] = receipt
        state["last_attempt"] = {"at": now(), "ok": True, "sha": tx["sha"], "phase": "complete", "kind": tx["kind"]}
        save(folder / "receipt.json", receipt)
        save(folder / "transaction.json", tx)
        state["pending"] = None
        save(STATE / "state.json", state)
        return {"ok": True, "state": "deployed" if tx["kind"] == "deploy" else "rolled_back", "commit": tx["sha"], "changed_files": len(tx["desired"])}
    raise DeployError("Unknown saved transaction phase")


def deploy(*, dry_run=False, scheduled=False):
    state = load_state()
    if scheduled and (STATE / "paused").exists(): return {"ok": True, "state": "paused"}
    try:
        if state["pending"]:
            if dry_run: return {"ok": True, "dry_run": True, "resume_phase": state["pending"]["phase"], "commit": state["pending"]["sha"]}
            read_token()
            return advance(state)
        sha = latest()
        if state["deployed"] and state["deployed"]["sha"] == sha: return {"ok": True, "state": "unchanged", "commit": sha}
        ident = uuid.uuid4().hex
        folder = STATE / "releases" / ident; folder.mkdir(parents=True, mode=0o700)
        manifest, missing = build(sha, folder)
        if missing:
            remote_assets = remote("snapshot", paths=missing)
            absent = [p for p,h in remote_assets.items() if h is None]
            if absent: raise DeployError("Referenced assets absent from build and production: " + ", ".join(absent[:10]))
        previous = (state["deployed"] or {}).get("manifest", {})
        observed = remote("snapshot", paths=sorted(set(manifest) | set(previous)))
        before, desired = plan_changes(manifest, previous, observed)
        tx = {"id": ident, "kind": "deploy", "sha": sha, "phase": "prepare", "manifest": manifest, "before": before, "desired": desired, "previous": state["deployed"], "created_at": now()}
        save(folder / "transaction.json", tx)
        if dry_run:
            updates = sorted(p for p,h in desired.items() if h is not None)
            removals = sorted(p for p,h in desired.items() if h is None)
            return {"ok": True, "dry_run": True, "commit": sha, "deploy_files": len(manifest), "update_count": len(updates), "removal_count": len(removals), "update_sample": updates[:3], "preserved_server_asset_count": len(missing), "transaction": str(folder / "transaction.json"), "token_ready": token_ready()}
        read_token()  # Missing credentials never leave a partially uploaded release.
        state["pending"] = tx; save(STATE / "state.json", state)
        return advance(state)
    except (DeployError, OSError, ValueError) as exc:
        tx = state.get("pending") or {}
        state["last_attempt"] = {"at": now(), "ok": False, "sha": tx.get("sha"), "phase": tx.get("phase", "preflight"), "error": str(exc)[:1800]}
        if not dry_run: save(STATE / "state.json", state)
        raise


def token_ready():
    try: read_token(); return True
    except DeployError: return False


def scheduler(*args):
    return run(["systemctl", "--user", *args], timeout=30).decode().strip()


def pause():
    STATE.mkdir(parents=True, exist_ok=True, mode=0o700)
    (STATE / "paused").touch(mode=0o600)
    scheduler("disable", "--now", TIMER)
    return {"ok": True, "state": "paused"}


def resume():
    state = load_state()
    if not state.get("deployed") or not (state.get("last_attempt") or {}).get("ok") or state.get("pending"):
        raise DeployError("Complete one verified deployment before enabling the timer")
    read_token()
    scheduler("enable", "--now", TIMER)
    (STATE / "paused").unlink(missing_ok=True)
    return {"ok": True, "state": "hourly_timer_enabled"}


def _rollback():
    pause()  # An active publisher cannot share the command lock with rollback.
    state = load_state()
    if state["pending"] and state["pending"]["kind"] == "rollback":
        read_token(); return advance(state)
    original = state["pending"]
    if original is None:
        if not state["deployed"] or state["deployed"].get("kind") != "deploy": raise DeployError("No deployment is available to roll back")
        original = json.loads((STATE / "releases" / state["deployed"]["transaction_id"] / "transaction.json").read_text())
    observed = remote("snapshot", paths=list(original["desired"]))
    if any(observed[p] not in (original["before"][p], h) for p,h in original["desired"].items()): raise DeployError("Production drift prevents rollback; timer stays paused")
    ident = uuid.uuid4().hex
    folder = STATE / "releases" / ident; folder.mkdir(parents=True, mode=0o700)
    payload = folder / "payload"; payload.mkdir(mode=0o700)
    desired = {p:h for p,h in original["before"].items() if observed[p] != h}
    for rel,h in desired.items():
        if h is not None:
            source = STATE / "releases" / original["id"] / "backup" / rel
            if not source.is_file() or digest(source) != h: raise DeployError("Missing verified local rollback backup: " + rel)
            target = payload / rel; target.parent.mkdir(parents=True, exist_ok=True, mode=0o700); shutil.copyfile(source,target)
    previous = original["previous"] or {"sha": None, "manifest": {}}
    tx = {"id": ident, "kind": "rollback", "sha": previous["sha"], "phase": "prepare", "manifest": previous["manifest"], "before": {p:observed[p] for p in desired}, "desired": desired, "previous": state["deployed"], "created_at": now()}
    read_token()
    state["pending"] = tx; save(STATE / "state.json", state); save(folder / "transaction.json", tx)
    return advance(state)


def rollback():
    try:
        return _rollback()
    except (DeployError, OSError, ValueError) as exc:
        state = load_state()
        tx = state.get("pending") or {}
        state["last_attempt"] = {"at": now(), "ok": False, "kind": "rollback", "sha": tx.get("sha"), "phase": tx.get("phase", "preflight"), "error": str(exc)[:1800]}
        save(STATE / "state.json", state)
        raise


def status(*, diagnose=False):
    state = load_state()
    timer = subprocess.run(["systemctl", "--user", "show", TIMER, "--property=ActiveState,UnitFileState,NextElapseUSecRealtime", "--no-pager"], capture_output=True, text=True)
    result = {"ok": True, "site": SITE, "branch": "main", "deployed_commit": (state["deployed"] or {}).get("sha"), "deployed_at": (state["deployed"] or {}).get("at"), "pending_phase": (state["pending"] or {}).get("phase"), "pending_commit": (state["pending"] or {}).get("sha"), "last_attempt": state["last_attempt"], "paused": (STATE / "paused").exists(), "timer": dict(line.split("=",1) for line in timer.stdout.splitlines() if "=" in line), "token_ready": token_ready()}
    if diagnose:
        result["tools"] = {name: shutil.which(name) is not None for name in ("git", "node", "rsync", "ssh", "python3")}
        try:
            result["github_main"] = latest()
            manifest = (state["deployed"] or {}).get("manifest", {})
            observed = remote("snapshot", paths=list(manifest))
            result["production_drift"] = [p for p,h in manifest.items() if observed.get(p) != h]
        except DeployError as exc: result["diagnostic_error"] = str(exc)
        result["logs_command"] = "journalctl --user -u gps-deploy.service -n 30 --no-pager"
    return result


def main(argv=None):
    os.umask(0o077)
    os.environ.setdefault("GIT_TERMINAL_PROMPT", "0")
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("status", "diagnose", "pause", "resume", "rollback"): commands.add_parser(name)
    command = commands.add_parser("deploy")
    command.add_argument("--dry-run", action="store_true")
    command.add_argument("--scheduled", action="store_true", help=argparse.SUPPRESS)
    args = parser.parse_args(argv)
    try:
        if args.command in {"status", "diagnose"}: result = status(diagnose=args.command == "diagnose")
        elif args.command == "pause": result = pause()
        else:
            with locked():
                result = deploy(dry_run=args.dry_run, scheduled=args.scheduled) if args.command == "deploy" else globals()[args.command]()
        # Unchanged scheduled runs remain quiet in the service journal.
        if not (args.command == "deploy" and args.scheduled and result.get("state") in {"unchanged", "paused"}): print(json.dumps(result))
        return 0
    except (DeployError, OSError, ValueError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)[:1800]}, indent=2), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
