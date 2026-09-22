from pathlib import Path
from PIL import Image, ImageDraw
import json

ROOT = Path(r"d:\Projects\gps-public-site")
IMG = ROOT / "assets" / "images"
ASSETS = ROOT / "assets"

src = Image.open(IMG / "favicon.jpg").convert("RGBA")
side = min(src.size)
left = (src.size[0] - side) // 2
top = (src.size[1] - side) // 2
square = src.crop((left, top, left + side, top + side))


def round_icon(n):
    im = square.resize((n, n), Image.Resampling.LANCZOS)
    mask = Image.new("L", (n, n), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, n - 1, n - 1), fill=255)
    out = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    out.paste(im, mask=mask)
    return out


c32 = round_icon(32)
c48 = round_icon(48)
c96 = round_icon(96)
c192 = round_icon(192)
c32.save(ASSETS / "favicon.png", optimize=True)
c48.save(ASSETS / "favicon-48.png", optimize=True)
c96.save(ASSETS / "favicon-96.png", optimize=True)
c192.save(ASSETS / "favicon-192.png", optimize=True)
round_icon(180).save(ASSETS / "apple-touch-icon.png", optimize=True)
c48.save(ROOT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

manifest = {
    "name": "Global Platform for the South",
    "short_name": "GPS",
    "icons": [
        {"src": "favicon-48.png", "sizes": "48x48", "type": "image/png"},
        {"src": "favicon-96.png", "sizes": "96x96", "type": "image/png"},
        {"src": "favicon-192.png", "sizes": "192x192", "type": "image/png"},
    ],
    "theme_color": "#07060f",
    "background_color": "#faf9f5",
    "display": "browser",
}
(ASSETS / "site.webmanifest").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print("round favicons ready", c48.size)
