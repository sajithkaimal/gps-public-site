# Updating the GitHub repo — you already pushed once

Repository: **https://github.com/sajithkaimal/gps-public-site**
Branch: **main**

This is an **update**, not a first push. The repo already has the 48-page site
in it. Nothing needs deleting, and you must **not** use `--force` this time.

The zip you downloaded is already clean — working files (`screenshots/`,
`uploads/`, `docs-extracted/`, `gps-site/`, `_ds/`, the old `gps.css` /
`gps-site.js`) have been left out. Unzip it and upload everything inside.

---------------------------------------------------------------------------
WHAT CHANGED SINCE YOUR LAST PUSH
---------------------------------------------------------------------------

  assets/site.css
  dist/assets/site.css
  github.md

The dropdown caret (˅) in the header no longer overlaps the grey pill that
appears when you hover or open a menu item. Nav spacing tightened by 3px so the
header stays the same width.

If you made no other edits since this morning, those are the only files that
differ. Everything else in the zip is byte-identical to what is already in the
repo, so Git will simply ignore it.

---------------------------------------------------------------------------
ROUTE A — GITHUB.COM, NO COMMANDS  (~2 minutes)
---------------------------------------------------------------------------

Only three files changed, so upload just those three.

STEP 1 — Replace `assets/site.css`

  a. Go to https://github.com/sajithkaimal/gps-public-site
  b. Click **Add file** → **Upload files**.
  c. Open your unzipped folder, go into `assets/`, and drag `site.css`
     onto the GitHub page.

     IMPORTANT: you must be *inside* the `assets` folder view on GitHub first,
     or the file lands at the repo root. Easiest way: click `assets` in the
     file list, THEN Add file → Upload files.

  d. Commit message:  `Nav: caret no longer overlaps menu highlight`
  e. Click **Commit changes**.

STEP 2 — Replace `dist/assets/site.css`

  Same as step 1, but navigate into `dist` → `assets` first, then upload the
  `site.css` from your unzipped `dist/assets/` folder.

STEP 3 — Replace `github.md`

  Repo root → **Add file** → **Upload files** → drag `github.md` → commit.

  GitHub overwrites a file of the same name in the same folder automatically.
  You will see "1 changed file" on the commit screen — that confirms it
  matched an existing file rather than creating a new one.

Done.

---------------------------------------------------------------------------
ROUTE B — COMMAND LINE  (~1 minute)
---------------------------------------------------------------------------

If you kept the folder you pushed from last time, and it is a Git clone
(it has a hidden `.git` folder inside):

      cd /path/to/your/gps-public-site       # or drag the folder onto Terminal

  Copy everything from the newly unzipped folder into it, replacing files when
  asked. Then:

      git status                             # should list the 3 files above
      git add -A
      git commit -m "Nav: caret no longer overlaps menu highlight"
      git push origin main

  No `--force`. If Git asks for a password, use your Personal Access Token —
  see AUTHENTICATION in `GIT-PUSH.md`.

If you do NOT still have that folder, start fresh from the repo instead:

      git clone https://github.com/sajithkaimal/gps-public-site.git
      cd gps-public-site

  Copy the unzipped contents in over the top, then run the four commands above.

---------------------------------------------------------------------------
IF SOMETHING GOES WRONG
---------------------------------------------------------------------------

"Updates were rejected / fetch first"
    Someone (or you, in the browser) committed since your last pull. Run:
        git pull --rebase origin main
    then push again. Do not use --force — it would erase that commit.

"nothing to commit, working tree clean"
    The files you copied in are identical to what is already committed. Check
    you copied from the NEW zip, not the old one.

The upload created `site.css` at the repo root instead of in `assets/`
    Delete the stray file (click it → "..." → Delete file → Commit), then redo
    step 1, clicking into the `assets` folder BEFORE Add file → Upload files.

---------------------------------------------------------------------------
UPDATING THE LIVE SITE (separate from GitHub)
---------------------------------------------------------------------------

GitHub does not touch gpsouth.org. To push this fix live:

  1. Hostinger → File Manager → `public_html/assets/`
  2. Upload `dist/assets/site.css` from the zip, overwriting the existing file.
  3. Purge the Hostinger cache, then hard-reload the site
     (Ctrl+Shift+R / Cmd+Shift+R) to see the change.

Nothing else needs re-uploading — no HTML changed.
