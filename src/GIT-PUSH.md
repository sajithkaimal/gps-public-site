# Pushing the GPS site to GitHub — step by step

Repository: **https://github.com/sajithkaimal/gps-public-site**
Branch: **main**

Two routes. Pick ONE.

- **Route A — github.com in your browser.** No software to install, no commands.
  Best if you don't already use Git. ~5 minutes.
- **Route B — command line.** Faster once set up, and what you'll want if you
  push regularly. ~2 minutes.

Both end in the same place. Route A is the safe default.

---------------------------------------------------------------------------
BEFORE YOU START (both routes)
---------------------------------------------------------------------------

1. Unzip the download somewhere you can find it, e.g. your Desktop.
   You should see `index.html`, an `assets` folder, `send.php`, a `src` folder.

2. Decide what NOT to upload. These are working files, not part of the site:

       hero-a.html  hero-b.html  hero-c.html   (3 unpicked hero designs)
       screenshots/                            (my working screenshots)
       docs-extracted/                         (text pulled from your documents)
       uploads/                                (your original uploads)
       gps.css  gps-site.js  gps-backgrounds.js
       gps-site/                               (archive of the old 4-page site)
       _ds/                                    (design-system files, unused here)
       .thumbnail

   Delete them from the unzipped folder now. Nothing on the live site links to
   them. Keeping them does no harm — it just makes the repository harder to read.

3. Know that four files in your repository are OLD and must go:
   `index.html`, `impact.html`, `network.html`, `what-we-do.html` — each around
   690 KB, from the original 4-page version of the site. The new build has files
   with the same names but ~15 KB each. Both routes below replace them.

---------------------------------------------------------------------------
ROUTE A — UPLOAD VIA GITHUB.COM  (no commands)
---------------------------------------------------------------------------

STEP 1 — Delete the four old files

  a. Go to https://github.com/sajithkaimal/gps-public-site
  b. Click `index.html` in the file list.
  c. Click the "..." button (top right of the file view) → **Delete file**.
  d. Scroll to the bottom, click the green **Commit changes** button.
  e. Repeat a–d for `impact.html`, `network.html`, and `what-we-do.html`.

  The repository should now contain only `README.md`.

STEP 2 — Upload the new site

  a. On the repository home page, click **Add file** → **Upload files**.
  b. Open your unzipped folder. Select ALL the files and folders inside it
     (Ctrl+A on Windows, Cmd+A on Mac) and drag them onto the GitHub page.
  c. Wait for every file to finish uploading. There are about 60 — the
     `assets/hero.webm` video is 11 MB and will take the longest.
     Do not close the tab while it uploads.
  d. In the "Commit changes" box at the bottom, type:

         Rebuild: 48-page static site, single contact address, review changes

  e. Click **Commit changes**.

STEP 3 — Check it

  The file list should now show `index.html`, `about.html`, `contact.html` and
  the rest, plus `assets`, `src`, and `send.php`. Click `index.html` and confirm
  the size reads roughly 15 KB, not 690 KB.

  Done.

  NOTE: GitHub's web uploader will not accept a folder that contains more than
  100 files at once, and skips empty folders. This project is well under that.
  If a folder fails to upload, drag that one folder on its own and commit again.

---------------------------------------------------------------------------
ROUTE B — COMMAND LINE
---------------------------------------------------------------------------

STEP 1 — Confirm Git is installed

  Open Terminal (Mac: Cmd+Space, type "Terminal") or Git Bash / PowerShell
  (Windows). Type:

      git --version

  If you see a version number, continue. If you see "command not found",
  install Git from https://git-scm.com/downloads first.

STEP 2 — Go to your unzipped folder

  Type `cd ` (with the space), then drag the unzipped folder onto the terminal
  window — it fills in the path for you. Press Enter. Then confirm you are in
  the right place:

      ls

  You should see `index.html`, `assets`, `send.php`, `src`.
  If you don't, you are in the wrong folder. Do not continue until you do.

STEP 3 — Set up the repository

      git init
      git remote add origin https://github.com/sajithkaimal/gps-public-site.git
      git branch -M main

STEP 4 — Stage and commit

      git add -A
      git status

  `git status` lists what will be committed. Skim it. If you see anything from
  the "do not upload" list in step 2 of the preamble, delete it and run
  `git add -A` again.

      git commit -m "Rebuild: 48-page static site, single contact address, review changes"

STEP 5 — Push

      git push --force origin main

  **Why `--force`:** your repository's history contains the four old bundle
  files. This commit is a fresh start that replaces them, so the two histories
  have no common ancestor and a normal push is refused. `--force` tells GitHub
  to accept this version as the new `main`.

  This overwrites the repository's history. That is intended here — the only
  thing in it is the superseded version of this same site. If you want that
  history preserved, stop and use Route C below instead.

  You will be asked to sign in. GitHub no longer accepts your account password
  here — see AUTHENTICATION below.

STEP 6 — Check it

      git log --oneline

  One commit. Then reload the repository page in your browser and confirm the
  new files are listed.

---------------------------------------------------------------------------
ROUTE C — COMMAND LINE, KEEPING THE OLD HISTORY
---------------------------------------------------------------------------

Use this instead of Route B if you want the old bundles to remain in the
repository's history rather than being overwritten.

      git clone https://github.com/sajithkaimal/gps-public-site.git
      cd gps-public-site
      git rm index.html impact.html network.html what-we-do.html

  Now copy everything from your unzipped folder into this `gps-public-site`
  folder, replacing files when asked. Then:

      git add -A
      git commit -m "Rebuild: 48-page static site"
      git push origin main

  No `--force` needed, because you started from the repository's own history.

---------------------------------------------------------------------------
AUTHENTICATION (Route B and C)
---------------------------------------------------------------------------

When Git asks for a password, your GitHub account password will be rejected.
Use a Personal Access Token:

  1. Go to https://github.com/settings/tokens
  2. **Generate new token** → **Generate new token (classic)**
  3. Note: "gps site push".  Expiration: 30 days is fine.
  4. Tick the **repo** checkbox (this ticks its sub-items automatically).
  5. **Generate token**, then copy it. You cannot view it again after leaving
     the page.
  6. When Git prompts:
        Username: sajithkaimal
        Password: paste the token

To avoid re-entering it, run this once:

      git config --global credential.helper store

---------------------------------------------------------------------------
IF SOMETHING GOES WRONG
---------------------------------------------------------------------------

"src refspec main does not match any"
    You skipped `git add` / `git commit`. Run step 4.

"failed to push some refs" / "Updates were rejected"
    Route B step 5 without `--force`. Add it, or switch to Route C.

"remote origin already exists"
    You ran `git remote add` twice. Fix it with:
        git remote set-url origin https://github.com/sajithkaimal/gps-public-site.git

"Authentication failed"
    You used your account password. Use a token — see AUTHENTICATION.

"fatal: not a git repository"
    You are outside the folder, or skipped `git init`. Redo steps 2 and 3.

The video file is rejected as too large
    GitHub's hard limit is 100 MB per file; `hero.webm` is 11 MB, so this
    shouldn't happen. If it does, you have a different large file — find it with:
        find . -size +50M

---------------------------------------------------------------------------
AFTER THE PUSH — TWO THINGS TO KNOW
---------------------------------------------------------------------------

1. This does NOT update gpsouth.org.

   GitHub is version control; Hostinger serves the live site. They are separate.
   To update the live site, upload the `dist/` folder contents to `public_html/`
   in Hostinger's File Manager, as before.

   If you would rather have a push to GitHub deploy to Hostinger automatically,
   say so and I will write the GitHub Action for it.

2. Do not turn on GitHub Pages for this repository.

   `send.php` needs PHP, and GitHub Pages serves static files only — the contact
   and partnership forms would appear to submit but silently send nothing.
   Hostinger runs PHP, which is why the forms work on gpsouth.org.

---------------------------------------------------------------------------
EDITING THE SITE FROM NOW ON
---------------------------------------------------------------------------

`src/` is the source of truth. The 48 `.html` files at the top level are
generated output — edit one directly and your change is lost the next time the
site is rebuilt.

To change a page's content, edit `src/pages/<page>.html`.
To change the navigation or footer, edit `src/build.js`.
Then ask me to rebuild, and I'll regenerate all 48 pages.
