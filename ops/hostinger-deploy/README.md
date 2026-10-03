# GPS hourly Hostinger deployment

Kendra checks `sajithkaimal/gps-public-site` branch `main` at minute 17 every hour.
Systemd runs deterministic Python/Git/Node/SSH/rsync commands, independently of
Qwen or OpenClaw. The persistent timer catches up once after downtime. Bob is the
chat operator; see BOB.md for commands and troubleshooting.

## Install and activate

Use Python 3.12+, Git, Node, SSH and rsync on the existing Kendra account.
Hostinger requires Python 3.6+ and rsync; the remote helper uses only standard
libraries and streaming hashes to support shared hosting's older Python.
The fixed site account is `u775171676@62.72.50.26:65002`, webroot
`/home/u775171676/domains/gpsouth.org/public_html`. Authentication reuses
`~/.ssh/gps_hostinger_ed25519` and `~/.ssh/gps_hostinger_known_hosts` with strict
host-key checking. There are no generic target/credential overrides.

From a tested copy of this directory on Kendra:

```sh
python3 install.py
gps-deploy deploy --dry-run
```

Generate a Hostinger API token in hPanel → Profile → API. Put **only the token**,
on one line, in `~/.config/gps-deploy/hostinger.token`, owned by Kendra, mode 0600.
Use a private terminal; never paste it into a chat or commit it. Then:

```sh
gps-deploy deploy
gps-deploy resume
gps-deploy status
```

The installer leaves a new timer disabled. `resume` requires a successful,
verified deployment, no pending transaction, and a readable private token.
Missing token is detected before any upload. The cache request is a DELETE to
Hostinger's fixed GPS account/domain cache endpoint and also purges Hostinger
CDN when enabled. Browser caches and external CDN/plugin caches are separate.

## Release and recovery

Each run locks `~/.local/state/gps-deploy/lock`, observes an exact main SHA, exports
it from a dedicated source cache, and runs `node scripts/run-build.js` in an
isolated directory. The existing tracked `dist/` assets are retained. Public
source assets and the contact confirmation page are copied into `dist/` because
the repository's build copies only selected assets. Packaging permits built
pages, static media/CSS/JS/fonts, the search index, favicons, robots/sitemap,
`.htaccess`, and the PHP contact handler. It excludes source/ops/docs, hidden
metadata, private/staff/draft paths, unknown JSON/config files, archives and
symlinks. Referenced assets absent from the package must already exist on GPS.

Unmanaged production files remain intact. Only previously managed files can be
removed. The release aborts if previously deployed file hashes have drifted.
The first deployment snapshots the existing files it will replace; it does not
pretend a historical Git SHA is already deployed.

Backups and receipts stay under `~/.local/state/gps-deploy/releases/<id>` on
Kendra. New files are staged under the GPS domain's `.gps-deploy` directory,
outside `public_html`. Stage and backup hashes are verified before promotion.
Each file is atomically replaced, assets before HTML, obsolete managed files
last. This is a per-file promotion, not an atomic whole-site switch.

The durable phases are prepare → upload → cache → verify. An interrupted upload
accepts only its old or desired hashes and resumes. Cache/verification failures
retain their phase without repeating upload. A pending release is finished
before checking for a newer main commit. Success requires server hashes and
HTTPS homepage, contact page, CSS/JS, and changed public page/asset content.
No PHP-source HTTP request or contact-form submission is performed.

`gps-deploy rollback` pauses the timer and restores the previous live files
from verified local backups, purges cache, and verifies restoration. A bootstrap
rollback has no known historical Git commit. Resolve drift and missing backup
errors before retrying; the timer remains paused. Backups are retained for
operator review and are not deleted automatically.

## Maintenance

```sh
gps-deploy status
gps-deploy diagnose
journalctl --user -u gps-deploy.service -n 30 --no-pager
python3 -m unittest discover -s ops/hostinger-deploy/tests -v
```

Bob makes code repairs through the existing Forge workflow and installs a
tested maintenance version explicitly. Installing does not automatically run a
release or enable the timer. Prior installed versions and changed instruction
files are backed up. Installation preserves existing instructions and adds a
small GPS control block near their start for the local model's context limit.

Change timing with `~/.config/systemd/user/gps-deploy.timer.d/schedule.conf`
using an empty `OnCalendar=` followed by the replacement schedule. Run
`systemctl --user daemon-reload` and restart the timer, then verify `status`.
No new API server, GitHub Action, browser automation, or AI cron job is needed.
