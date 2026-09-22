from pathlib import Path
import re
import shutil

ROOT = Path(r"d:\Projects\gps-public-site")
BRAND = (
    '<a class="brand" href="index.html">'
    '<img class="brand-logo" src="assets/images/logo.png" '
    'alt="GPS — Global Platform for the South" width="168" height="48"></a>'
)
OLD_BRAND = re.compile(
    r'<a class="brand" href="index.html">.*?</a>',
    re.S,
)
ICON_BLOCK = (
    '<link rel="icon" href="/favicon.ico" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-48.png" type="image/png" sizes="48x48">\n'
    '<link rel="icon" href="assets/favicon-96.png" type="image/png" sizes="96x96">\n'
    '<link rel="shortcut icon" href="/favicon.ico">\n'
    '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n'
    '<link rel="manifest" href="assets/site.webmanifest">\n'
    '<meta name="theme-color" content="#07060f">'
)
OLD_ICON = re.compile(
    r'<link rel="icon" href="(?:/favicon.ico|https://gpsouth.org/favicon.ico)"[^>]*>\n'
    r'(?:<link rel="(?:icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>\n)*'
    r'(?:<meta name="theme-color"[^>]*>)?'
)
SKIP = {"hero-a.html", "hero-b.html", "hero-c.html"}

n = 0
for folder in (ROOT, ROOT / "dist"):
    for path in folder.glob("*.html"):
        if path.name in SKIP:
            continue
        text = path.read_text(encoding="utf-8")
        text = OLD_BRAND.sub(BRAND, text)
        text = text.replace("assets/site.css?v=20260814h", "assets/site.css?v=20260816b")
        text = text.replace(
            "https://gpsouth.org/assets/hero-poster.png",
            "https://gpsouth.org/assets/images/logo.png",
        )
        if OLD_ICON.search(text):
            text = OLD_ICON.sub(ICON_BLOCK, text, count=1)
        path.write_text(text, encoding="utf-8", newline="\n")
        n += 1

dist_img = ROOT / "dist" / "assets" / "images"
dist_img.mkdir(parents=True, exist_ok=True)
for name in ("logo.png", "logo-nav.png", "favicon.jpg"):
    src = ROOT / "assets" / "images" / name
    if src.exists():
        shutil.copy2(src, dist_img / name)
for name in (
    "favicon.png",
    "favicon-48.png",
    "favicon-96.png",
    "favicon-192.png",
    "apple-touch-icon.png",
    "site.webmanifest",
):
    shutil.copy2(ROOT / "assets" / name, ROOT / "dist" / "assets" / name)
shutil.copy2(ROOT / "favicon.ico", ROOT / "dist" / "favicon.ico")
shutil.copy2(ROOT / "robots.txt", ROOT / "dist" / "robots.txt")
print(f"brand: patched {n} pages")
