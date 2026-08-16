# Insert / update favicon link tags on built HTML pages
from pathlib import Path
import re

ROOT = Path(r"d:\Projects\gps-public-site")
BLOCK = (
    '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-48.png" type="image/png" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-96.png" type="image/png" sizes="96x96">\n'
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n'
    '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n'
    '<meta name="theme-color" content="#07060f">'
)
OLD = re.compile(
    r'\n<link rel="icon"[^>]*>\n(?:<link rel="icon"[^>]*>\n)*'
    r'(?:<link rel="apple-touch-icon"[^>]*>\n)?'
    r'(?:<meta name="theme-color"[^>]*>)?'
)
NEEDLE = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
SKIP = {"hero-a.html", "hero-b.html", "hero-c.html"}

n = 0
for folder in (ROOT, ROOT / "dist"):
    for path in folder.glob("*.html"):
        if path.name in SKIP:
            continue
        text = path.read_text(encoding="utf-8")
        if NEEDLE not in text:
            continue
        if 'rel="icon"' in text:
            text = OLD.sub("\n" + BLOCK, text, count=1)
        else:
            text = text.replace(NEEDLE, NEEDLE + "\n" + BLOCK, 1)
        path.write_text(text, encoding="utf-8", newline="\n")
        n += 1
print(f"favicon: patched {n} pages")
