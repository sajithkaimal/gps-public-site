# Insert favicon link tags into built HTML pages
from pathlib import Path
import re

ROOT = Path(r"d:\Projects\gps-public-site")
BLOCK = (
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n'
    '<link rel="icon" href="assets/favicon.png" sizes="32x32" type="image/png">\n'
    '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n'
    '<meta name="theme-color" content="#07060f">'
)
NEEDLE = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
SKIP = {"hero-a.html", "hero-b.html", "hero-c.html"}

n = 0
for folder in (ROOT, ROOT / "dist"):
    for path in folder.glob("*.html"):
        if path.name in SKIP:
            continue
        text = path.read_text(encoding="utf-8")
        if "favicon.svg" in text:
            continue
        if NEEDLE not in text:
            continue
        text = text.replace(NEEDLE, NEEDLE + "\n" + BLOCK, 1)
        path.write_text(text, encoding="utf-8", newline="\n")
        n += 1
print(f"favicon: patched {n} pages")
