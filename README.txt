GPS — ecosystem panel restyle, 5 Sep 2026  (cache-busted: ?v=20260905b)
========================================================================

Drag the CONTENTS of this zip into Hostinger File Manager -> public_html/,
overwriting when asked:

    assets/theme.css
    index.html
    what-we-do/index.html
    about-our-approach/index.html

These three pages now request theme.css?v=20260905b, which forces every
browser and the Hostinger cache to fetch the new stylesheet.

After upload: purge the Hostinger cache, then hard-reload
(Cmd+Shift+R / Ctrl+Shift+R). If it still looks old, open the page in a
private window — that bypasses your own browser cache.
