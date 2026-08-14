repo: sajithkaimal/gps-public-site
branch: main

## Last sync
date: 2026-08-14T18:33:00Z
direction: project → repository (pending push by repo owner)

### Updated in this project
- Header navigation: dropdown caret no longer overlaps the hover/open pill on any menu item.
- Nav gap tightened to 2px so the header keeps the same overall width.
- Applies to both `assets/site.css` and the deploy copy in `dist/assets/site.css`.

## Screen map
| Screen | Built from |
| --- | --- |
| Home | `src/pages/index.html`, `src/ecosystem.frag.html`, `assets/map.js` |
| About (9 pages) | `src/pages/about-*.html`, `src/pages/impact.html` |
| Our Work (4 pillars + landing) | `src/pages/what-we-do.html`, `src/pages/work-*.html` |
| People | `src/pages/people.html`, `src/pages/people-experts.html` |
| Network | `src/pages/network*.html`, `src/pages/about-regional-hubs.html` |
| Activities | `src/pages/initiatives.html`, `src/pages/initiative-*.html` |
| Knowledge & News | `src/pages/knowledge-hub.html`, `src/pages/kh-*.html`, `src/pages/news*.html`, `src/pages/events*.html` |
| Get Involved | `src/pages/get-involved*.html`, `donate`, `contact` |
| Roadmap | `src/pages/roadmap.html` |
| Search | `search.html`, `src/search-index.json` |
| Shared shell (nav/footer) | `src/build.js` |
| Styles / behaviour | `assets/site.css`, `assets/ui.css`, `assets/theme.css`, `assets/site.js`, `assets/map.js` |
| Form handler | `send.php` |

## Notes
- `src/` is the source of truth: edit `src/pages/*.html` fragments, then regenerate the
  root pages with `src/build.js`. Never hand-edit a root `.html` — the next build
  overwrites it.
- `dist/` is the Hostinger deploy folder. GitHub does not update the live site.

## Sync history
### 2026-08-14T09:07:28Z
- Rebuilt the site from 4 self-contained bundles into 48 linked static pages sharing `assets/`.
- Added `send.php` so all website forms email info@gpsouth.org.
- Applied the 2 Aug 2026 website review: nav headings, renamed pillars, consolidated Publications & Multimedia.
- Replaced the superseded 690 KB single-file bundles at the repo root.
