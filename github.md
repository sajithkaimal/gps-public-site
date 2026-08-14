repo: sajithkaimal/gps-public-site
branch: main

## Last sync
date: 2026-08-14T09:07:28Z
direction: project → repository (pending push by repo owner)

### Updated in this project
- Rebuilt the site from 4 self-contained bundles into 48 linked static pages sharing `assets/`.
- Added `send.php` so all website forms email info@gpsouth.org.
- Applied the 2 Aug 2026 website review: 8 nav headings, renamed pillars, consolidated Publications & Multimedia.
- Repository still holds the superseded 690 KB single-file bundles; the push replaces them.

## Screen map
| Screen | Built from |
| --- | --- |
| Home | `src/pages/index.html`, `src/ecosystem.frag.html`, `assets/map.js` |
| About (9 pages) | `src/pages/about-*.html`, `src/pages/impact.html` |
| Our Work (4 pillars + landing) | `src/pages/what-we-do.html`, `src/pages/work-*.html` |
| People | `src/pages/people.html`, `src/pages/people-experts.html` |
| Network | `src/pages/network*.html`, `src/pages/about-regional-hubs.html` |
| Activities | `src/pages/initiatives.html`, `src/pages/initiative-*.html` |
| Publications & Multimedia | `src/pages/knowledge-hub.html`, `src/pages/kh-*.html` |
| News & Events | `src/pages/news*.html`, `src/pages/events*.html` |
| Get Involved | `src/pages/get-involved*.html`, `donate`, `contact` |
| Shared shell (nav/footer) | `src/build.js` |
| Styles / behaviour | `assets/site.css`, `assets/ui.css`, `assets/theme.css`, `assets/site.js`, `assets/map.js` |
| Form handler | `send.php` |

## Notes
- Repository files are **older** than this project. Nothing was imported from it; the four
  `*.html` bundles at the repo root predate the multi-page rebuild and should be deleted
  in the same commit (`index.html`, `impact.html`, `network.html`, `what-we-do.html` —
  the new `index.html`, `impact.html`, `network.html`, `what-we-do.html` replace them,
  but at ~15 KB each rather than ~690 KB).
- `src/` is the source of truth: edit `src/pages/*.html` fragments, then regenerate the
  root pages with `src/build.js`. Never hand-edit a root `.html` — the next build
  overwrites it.
