from PIL import Image, ImageDraw, ImageFilter
import math
from pathlib import Path

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

stops = [
    (0, (0, 214, 164)),
    (0.28, (58, 224, 192)),
    (0.5, (163, 230, 53)),
    (0.72, (255, 210, 63)),
    (1, (25, 167, 255)),
]

def color_at(t):
    t = max(0, min(1, t))
    for i in range(len(stops) - 1):
        t0, c0 = stops[i]
        t1, c1 = stops[i + 1]
        if t <= t1:
            u = 0 if t1 == t0 else (t - t0) / (t1 - t0)
            return lerp(c0, c1, u)
    return stops[-1][1]

def make(size, r_frac=0.30, corner=0.22):
    img = Image.new("RGBA", (size, size), (7, 6, 15, 255))
    cx = cy = size / 2
    r = size * r_frac
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse(
        [cx - r * 1.45, cy - r * 1.45, cx + r * 1.45, cy + r * 1.45],
        fill=(0, 214, 164, 70),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(1, size * 0.06)))
    img = Image.alpha_composite(img, glow)
    pix = img.load()
    for y in range(size):
        for x in range(size):
            dx = x + 0.5 - cx
            dy = y + 0.5 - cy
            if dx * dx + dy * dy <= r * r:
                ang = (math.atan2(dy, dx) + math.pi) / (2 * math.pi)
                c = color_at(ang)
                pix[x, y] = c + (255,)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=int(size * corner), fill=255
    )
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, mask=mask)
    return out.convert("RGB")

root = Path(r"d:\Projects\gps-public-site\assets")
make(180).save(root / "apple-touch-icon.png", optimize=True)
make(32, 0.32).save(root / "favicon.png", optimize=True)
print("ok")
