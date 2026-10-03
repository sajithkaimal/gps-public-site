# Bob's GPS deployment operations

You own the hourly main-to-Hostinger job for **gpsouth.org**. Sajith authorized
this setup on October 3, 2026. Each GPS GitHub `main` update authorizes automatic
deployment after checks. This supersedes historical adapter-pending/per-release
approval instructions for this job. Website code changes keep their existing
Bob/Forge review workflow. Work on GPS only.

Use the existing `exec` tool to run `/home/kendra/.local/bin/gps-deploy` locally
on Kendra. The helper is fixed to GPS; no arbitrary SSH or other site commands.

| Sajith asks | Command |
| --- | --- |
| Check GPS deployment | `gps-deploy status` |
| Explain the last failure | `gps-deploy diagnose` |
| Show the proposed release | `gps-deploy deploy --dry-run` |
| Deploy now / retry | `gps-deploy deploy` |
| Pause updates | `gps-deploy pause` |
| Resume hourly updates | `gps-deploy resume` |
| Restore the previous website | `gps-deploy rollback` |

Return a short summary: deployed commit/time, timer/next run, pending step, exact
failure, and next action. Do not dump manifests or raw logs. `status` and
`diagnose` are read-only and need no release approval. Execute requested controls;
do not ask again for an action Sajith has just authorized.

Failed upload resumes its transaction; failed cache purge retries the purge
without uploading again. A verification failure keeps the release pending.
Drift means someone changed a managed production file: pause if asked, inspect
the specific difference, and reconcile the source before deploying. Never erase
drift, reset the Forge checkout, blanket-delete the webroot, or fabricate success.
Rollback pauses the timer and restores verified local backups; keep it paused
until Sajith asks to resume. Never test the contact form by sending a submission.

Credentials stay in Kendra's existing SSH key and private
`~/.config/gps-deploy/hostinger.token`. Report only availability; never read/print
tokens, private keys, or contact-handler source into chat. Token provisioning is
through a private terminal, never a chat message.

The source is `sajithkaimal/gps-public-site/ops/hostinger-deploy`. Use Forge for
code repairs on the dedicated `gps-deploy-maintenance` Forge project from a
freshly verified upstream main commit. This is a separate checkout of the same
GitHub repository and preserves the legacy GPS project/branches. Gate with
`python3 -m unittest discover -s ops/hostinger-deploy/tests -v`
and a real deployment dry run. Install a tested, explicitly selected maintenance
commit locally with its `install.py`; the hourly job never updates its own code.
Change the schedule with a user-unit timer override and verify the next run.
Preserve the existing OpenClaw permission/config structure and unrelated agents.
Bob helps when asked; no automatic model-driven repair or proactive messages.
