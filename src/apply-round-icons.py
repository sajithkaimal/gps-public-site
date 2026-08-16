from pathlib import Path
import re
import shutil

ROOT = Path(r"d:\Projects\gps-public-site")
ICON_BLOCK = (
    '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-48.png" type="image/png" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-96.png" type="image/png" sizes="96x96">\n'
    '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n'
    '<link rel="manifest" href="assets/site.webmanifest">\n'
    '<meta name="theme-color" content="#07060f">'
)
OLD_ICON = re.compile(
    r'<link rel="icon" href="/favicon.ico"[^>]*>\n'
    r'(?:<link rel="icon"[^>]*>\n)*'
    r'(?:<link rel="apple-touch-icon"[^>]*>\n)?'
    r'(?:<link rel="manifest"[^>]*>\n)?'
    r'(?:<meta name="theme-color"[^>]*>)?'
)
SKIP = {"hero-a.html", "hero-b.html", "hero-c.html"}
n = 0
for folder in (ROOT, ROOT / "dist"):
    for path in folder.glob("*.html"):
        if path.name in SKIP:
            continue
        text = path.read_text(encoding="utf-8")
        text = text.replace('width="168" height="48"', 'width="220" height="64"')
        text = text.replace("assets/site.css?v=20260816b", "assets/site.css?v=20260816c")
        text = text.replace("assets/site.css?v=20260814h", "assets/site.css?v=20260816c")
        if OLD_ICON.search(text):
            text = OLD_ICON.sub(ICON_BLOCK, text, count=1)
        path.write_text(text, encoding="utf-8", newline="\n")
        n += 1

dist_a = ROOT / "dist" / "assets"
dist_a.mkdir(parents=True, exist_ok=True)
for name in (
    "favicon.png",
    "favicon-48.png",
    "favicon-96.png",
    "favicon-192.png",
    "apple-touch-icon.png",
    "site.webmanifest",
    "site.css",
):
    src = ROOT / "assets" / name
    if src.exists():
        shutil.copy2(src, dist_a / name)
shutil.copy2(ROOT / "favicon.ico", ROOT / "dist" / "favicon.ico")
print(f"updated {n} pages")
