import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

MODULE = Path(__file__).resolve().parents[1] / "gps_deploy.py"
spec = importlib.util.spec_from_file_location("gps_deploy", MODULE)
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)


class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.base = Path(self.tmp.name).resolve()
        self.root = self.base / "production"; self.root.mkdir()
        self.stage = self.base / "staging"
        self.calls = []
        self.requests = []
        self.payload = {
            "index.html": b"<html>new homepage</html>",
            "contact/index.html": b'<html><form action="/send.php"></form></html>',
            "assets/site.css": b"new css", "assets/site.js": b"new js",
            "send.php": b"<?php /* handler */", ".htaccess": b"configuration",
        }
        self.old = {p: b"<html>old page</html>" if p.endswith(".html") else b"old bytes" for p in self.payload}
        self.put(self.old)
        self.put({"uploads/keep.bin": b"user upload", "server-only.txt": b"preserve"})
        self.original = {p: (self.root / p).read_bytes() for p in self.old}
        self.sha = "a" * 40
        self.code = d.REMOTE_CODE.replace(d.WEBROOT, str(self.root)).replace(d.STAGING, str(self.stage))
        self.patches = [patch.object(d, "STATE", self.base / "state"), patch.object(d, "latest", lambda: self.sha),
                        patch.object(d, "build", self.build), patch.object(d, "remote", self.remote),
                        patch.object(d, "transfer", self.transfer), patch.object(d, "read_token", lambda: "test-token"),
                        patch.object(d, "purge"), patch.object(d, "scheduler", lambda *args: self.calls.append(("scheduler", args))),
                        patch.object(d, "urlopen", self.urlopen)]
        self.mocks = [p.start() for p in self.patches]
        self.addCleanup(lambda: [p.stop() for p in reversed(self.patches)])
        self.addCleanup(self.tmp.cleanup)

    def put(self, files, *, root=None):
        for p, data in files.items():
            dest = (root or self.root) / p; dest.parent.mkdir(parents=True, exist_ok=True); dest.write_bytes(data)

    def build(self, sha, folder):
        self.put(self.payload, root=folder / "payload")
        return {p: d.digest(folder / "payload" / p) for p in self.payload}, []

    def remote(self, action, **payload):
        self.calls.append((action, payload))
        result = subprocess.run([sys.executable, "-c", self.code], input=json.dumps({"action": action, **payload}).encode(), capture_output=True)
        value = json.loads(result.stdout)
        if not value["ok"]: raise d.DeployError(value["error"])
        return value["result"]

    def transfer(self, source, destination, *, files=None):
        def resolve(p):
            if p.startswith(d.HOST + ":"): p = p.split(":",1)[1].replace(d.STAGING,str(self.stage))
            return Path(p)
        source, destination = resolve(source), resolve(destination)
        names = files.read_text().splitlines() if files else [p.relative_to(source).as_posix() for p in source.rglob("*") if p.is_file()]
        for name in names:
            target = destination / name; target.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(source / name, target)

    def urlopen(self, request, **kwargs):
        self.requests.append(request)
        path = d.urlsplit(request.full_url).path.strip("/")
        rel = "index.html" if not path else path if Path(path).suffix else path + "/index.html"
        body = (self.root / rel).read_bytes()
        class Response:
            status = 200
            url = request.full_url
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self, *args): return body
        return Response()

    def assert_preserved(self):
        self.assertEqual((self.root / "uploads/keep.bin").read_bytes(), b"user upload")
        self.assertEqual((self.root / "server-only.txt").read_bytes(), b"preserve")

    def test_success_and_unchanged_commit_is_quiet_no_upload_or_purge(self):
        result = d.deploy()
        self.assertEqual(result["state"], "deployed")
        self.assertEqual(d.load_state()["deployed"]["sha"], self.sha)
        for p, data in self.payload.items(): self.assertEqual((self.root / p).read_bytes(), data)
        self.assert_preserved()
        self.assertTrue(all(request.get_method() == "GET" and "send.php" not in request.full_url for request in self.requests))
        self.calls.clear(); self.mocks[6].reset_mock()
        self.assertEqual(d.deploy()["state"], "unchanged")
        self.assertEqual(self.calls, [])
        self.mocks[6].assert_not_called()

    def test_dry_run_never_changes_production_or_saved_release(self):
        result = d.deploy(dry_run=True)
        self.assertTrue(result["dry_run"])
        self.assertIsNone(d.load_state()["deployed"])
        self.assertFalse((d.STATE / "state.json").exists())
        self.assertEqual([x[0] for x in self.calls], ["snapshot"])
        self.assertEqual({p:(self.root/p).read_bytes() for p in self.old}, self.original)

    def test_missing_token_prevents_upload(self):
        with patch.object(d, "read_token", side_effect=d.DeployError("token missing")):
            with self.assertRaisesRegex(d.DeployError, "token missing"): d.deploy()
        self.assertNotIn("prepare", [x[0] for x in self.calls])
        self.assertIsNone(d.load_state()["pending"])
        self.assertEqual((self.root/"index.html").read_bytes(), self.original["index.html"])

    def test_build_failure_leaves_production_untouched(self):
        with patch.object(d, "build", side_effect=d.DeployError("build failed")):
            with self.assertRaisesRegex(d.DeployError, "build failed"): d.deploy()
        self.assertEqual(self.calls, [])
        self.assertEqual(d.load_state()["last_attempt"]["phase"], "preflight")

    def test_upload_network_failure_retries_stage_before_touching_site(self):
        original_transfer = self.transfer
        def fail(source, dest, **kwargs):
            if dest.startswith(d.HOST): raise d.DeployError("network dropped")
            return original_transfer(source, dest, **kwargs)
        with patch.object(d, "transfer", fail):
            with self.assertRaisesRegex(d.DeployError, "network dropped"): d.deploy()
        self.assertEqual(d.load_state()["pending"]["phase"], "prepare")
        self.assertEqual((self.root/"index.html").read_bytes(), self.original["index.html"])
        self.assertEqual(d.deploy()["state"], "deployed")

    def test_interrupted_promotion_resumes_without_losing_original_backup(self):
        original_remote = self.remote
        interrupted = False
        def partial(action, **payload):
            nonlocal interrupted
            if action == "promote" and not interrupted:
                interrupted = True
                rel = "assets/site.css"
                os.replace(self.stage / payload["id"] / "new" / rel, self.root / rel)
                raise d.DeployError("connection lost during promotion")
            return original_remote(action, **payload)
        with patch.object(d, "remote", partial):
            with self.assertRaises(d.DeployError): d.deploy()
            tx = d.load_state()["pending"]
            self.assertEqual(tx["phase"], "upload")
            self.assertEqual(d.deploy()["state"], "deployed")
        self.assertEqual((d.STATE / "releases" / tx["id"] / "backup/assets/site.css").read_bytes(), b"old bytes")

    def test_cache_failure_retries_only_cache_and_verification(self):
        with patch.object(d, "purge", side_effect=d.DeployError("cache unavailable")):
            with self.assertRaises(d.DeployError): d.deploy()
        self.assertEqual(d.load_state()["pending"]["phase"], "cache")
        self.calls.clear()
        self.assertEqual(d.deploy()["state"], "deployed")
        self.assertNotIn("promote", [x[0] for x in self.calls])
        self.assertNotIn("prepare", [x[0] for x in self.calls])

    def test_verification_failure_does_not_record_success_or_repeat_purge(self):
        with patch.object(d, "verify", side_effect=d.DeployError("stale CDN")):
            with self.assertRaises(d.DeployError): d.deploy()
        self.assertIsNone(d.load_state()["deployed"])
        self.assertEqual(d.load_state()["pending"]["phase"], "verify")
        self.calls.clear(); self.mocks[6].reset_mock()
        self.assertEqual(d.deploy()["state"], "deployed")
        self.mocks[6].assert_not_called()

    def test_managed_removals_preserve_unmanaged_files(self):
        self.payload["assets/old.css"] = b"obsolete"
        d.deploy()
        del self.payload["assets/old.css"]; self.sha = "b" * 40
        d.deploy()
        self.assertFalse((self.root / "assets/old.css").exists())
        self.assert_preserved()

    def test_production_drift_aborts_before_any_write(self):
        d.deploy(); self.sha = "b" * 40
        (self.root / "index.html").write_bytes(b"independent live edit")
        self.calls.clear()
        with self.assertRaisesRegex(d.DeployError, "Production drift"): d.deploy()
        self.assertEqual([x[0] for x in self.calls], ["snapshot"])
        self.assertEqual((self.root / "index.html").read_bytes(), b"independent live edit")

    def test_bootstrap_rollback_restores_original_site_and_pauses(self):
        d.deploy()
        self.assertEqual(d.rollback()["state"], "rolled_back")
        self.assertTrue((d.STATE / "paused").exists())
        for p, data in self.original.items(): self.assertEqual((self.root/p).read_bytes(),data)
        self.assert_preserved()
        self.assertIsNone(d.load_state()["deployed"]["sha"])

    def test_rollback_previous_release_restores_changed_and_deleted_files(self):
        self.payload["assets/old.css"] = b"first css"; d.deploy()
        first = dict(self.payload)
        self.sha = "b" * 40; self.payload["index.html"] = b"<html>second</html>"; del self.payload["assets/old.css"]
        d.deploy(); result = d.rollback()
        self.assertEqual(result["commit"], "a" * 40)
        for p,data in first.items(): self.assertEqual((self.root/p).read_bytes(),data)

    def test_failed_rollback_cache_purge_is_recorded_and_resumable(self):
        d.deploy()
        with patch.object(d,"purge",side_effect=d.DeployError("cache unavailable")):
            with self.assertRaises(d.DeployError): d.rollback()
        self.assertEqual(d.load_state()["pending"]["phase"],"cache")
        self.assertEqual(d.load_state()["last_attempt"]["kind"],"rollback")
        self.calls.clear()
        self.assertEqual(d.rollback()["state"],"rolled_back")
        self.assertNotIn("promote",[x[0] for x in self.calls])

    def test_symlink_in_production_path_is_refused(self):
        (self.root / "assets/site.css").unlink()
        (self.root / "assets/site.css").symlink_to(self.root / "server-only.txt")
        with self.assertRaisesRegex(d.DeployError, "Symlink refused"): d.deploy()

    def test_symlink_in_staging_is_refused(self):
        self.stage.symlink_to(self.root, target_is_directory=True)
        with self.assertRaisesRegex(d.DeployError, "Symlink refused"): d.deploy()

    def test_resume_requires_verified_release_and_no_pending_step(self):
        with self.assertRaises(d.DeployError): d.resume()
        d.deploy(); d.pause(); d.resume()
        self.assertFalse((d.STATE / "paused").exists())
        self.assertIn(("scheduler", ("enable", "--now", d.TIMER)), self.calls)

    def test_scheduled_run_respects_pause(self):
        d.pause()
        self.assertEqual(d.deploy(scheduled=True)["state"], "paused")
        self.assertNotIn("snapshot", [x[0] for x in self.calls])

    def test_overlapping_deployment_is_refused(self):
        with d.locked():
            with self.assertRaisesRegex(d.DeployError, "Another GPS"):
                with d.locked(): pass


class PackagingTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / "checkout"; self.root.mkdir()
        self.output = Path(self.tmp.name) / "package"
        files = {"dist/index.html": '<html><img src="/assets/images/new.png"></html>',
                 "dist/contact/index.html": '<html><form action="/send.php"></form></html>',
                 "dist/.htaccess": "configuration", "dist/assets/site.css": "css", "dist/assets/site.js": "js",
                 "dist/assets/keep.png": "tracked dist asset", "assets/images/new.png": "source image",
                 "send.php": "<?php /* contact handler */", "src/pages/contact.html": "source fragment",
                 "submission-received/index.html": "<html>confirmation</html>", "dist/README-DEPLOY.txt": "private docs",
                 "dist/.DS_Store": "metadata", "dist/private/report.html": "private", "dist/staff/report.html": "staff",
                 "dist/hero-a.html": "<html>draft</html>", "dist/assets/credentials.json": "secret",
                 "dist/google123abc.html": "google-site-verification: google123abc.html",
                 "dist/assets/private-key.env": "secret", "dist/assets/search-index.json": "[]"}
        for p,text in files.items():
            f=self.root/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(text)

    def test_includes_required_assets_and_contact_but_excludes_private_sources(self):
        manifest,missing = d.package(self.root,self.output)
        self.assertEqual(missing, [])
        for p in ("assets/images/new.png", "assets/keep.png", "send.php", "submission-received/index.html", "assets/search-index.json", "google123abc.html"):
            self.assertIn(p,manifest)
        for p in ("README-DEPLOY.txt", ".DS_Store", "private/report.html", "staff/report.html", "hero-a.html", "assets/credentials.json", "assets/private-key.env"):
            self.assertNotIn(p,manifest)

    def test_broken_contact_form_is_blocked(self):
        (self.root/"dist/contact/index.html").write_text("<html>no form</html>")
        with self.assertRaisesRegex(d.DeployError,"Contact form"): d.package(self.root,self.output)

    def test_symlink_directory_is_blocked_before_overlay(self):
        shutil.rmtree(self.root/"dist/assets")
        (self.root/"dist/assets").symlink_to(self.root/"assets",target_is_directory=True)
        with self.assertRaisesRegex(d.DeployError,"symlink"): d.package(self.root,self.output)

    def test_traversal_is_rejected(self):
        for name in ("../outside", "assets/../outside", "/absolute", "assets/./file", "assets//file"):
            with self.assertRaises(d.DeployError): d.valid_path(name)

    def test_token_requires_private_owner_only_permissions(self):
        token=Path(self.tmp.name)/"token";token.write_text("test-token");token.chmod(0o644)
        with patch.object(d,"TOKEN_FILE",token):
            with self.assertRaisesRegex(d.DeployError,"mode 0600"): d.read_token()
            token.chmod(0o600)
            self.assertEqual(d.read_token(),"test-token")


if __name__ == "__main__": unittest.main()
