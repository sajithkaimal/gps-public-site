# Apply canonical / Open Graph tags to built HTML pages and write sitemap.xml
import re
import html as htmllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://gpsouth.org"
SKIP = {"hero-a.html", "hero-b.html", "hero-c.html"}
MAIN = {
    "index.html",
    "about.html",
    "what-we-do.html",
    "network.html",
    "knowledge-hub.html",
    "get-involved.html",
}
SEO_STRIP = re.compile(
    r'\n(?:<link rel="canonical"[^>]*>|<meta name="robots"[^>]*>|'
    r'<meta property="og:[^"]+"[^>]*>|<meta name="twitter:[^"]+"[^>]*>)'
)
HOME_DESC = (
    "The Global Platform for the South connects universities, governments, "
    "businesses, researchers, and communities to co-create knowledge and "
    "solutions across the Global South."
)


def canon(name: str) -> str:
    return SITE + "/" if name == "index.html" else f"{SITE}/{name}"


def seo_tags(name: str, title: str, desc: str) -> str:
    url = canon(name)
    d = desc.replace('"', "&quot;")
    t = title.replace('"', "&quot;")
    return (
        f'<link rel="canonical" href="{url}">\n'
        f'<meta name="robots" content="index,follow">\n'
        f'<meta property="og:type" content="website">\n'
        f'<meta property="og:site_name" content="Global Platform for the South">\n'
        f'<meta property="og:locale" content="en_US">\n'
        f'<meta property="og:title" content="{t}">\n'
        f'<meta property="og:description" content="{d}">\n'
        f'<meta property="og:url" content="{url}">\n'
        f'<meta property="og:image" content="{SITE}/assets/hero-poster.png">\n'
        f'<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{t}">\n'
        f'<meta name="twitter:description" content="{d}">'
    )


def apply_file(path: Path) -> bool:
    name = path.name
    if name in SKIP:
        return False
    text = path.read_text(encoding="utf-8")
    tm = re.search(r"<title>(.*?)</title>", text, re.S)
    dm = re.search(r'<meta name="description" content="([^"]*)"', text)
    if not tm or not dm:
        return False
    title = tm.group(1).strip()
    desc = dm.group(1)
    if name == "index.html":
        desc = HOME_DESC
        text = re.sub(
            r'<meta name="description" content="[^"]*"',
            f'<meta name="description" content="{desc}"',
            text,
            count=1,
        )
    text = SEO_STRIP.sub("", text)
    tags = seo_tags(name, title, htmllib.unescape(desc))
    text = re.sub(
        r'(<meta name="description" content="[^"]*">)',
        r"\1\n" + tags,
        text,
        count=1,
    )
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def write_sitemap(names):
    rows = []
    for n in sorted(names, key=lambda x: (x != "index.html", x)):
        pri = "1.0" if n == "index.html" else ("0.9" if n in MAIN else "0.7")
        rows.append(
            f"  <url>\n    <loc>{canon(n)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>{pri}</priority>\n  </url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(rows)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8", newline="\n")
    dist = ROOT / "dist"
    if dist.is_dir():
        (dist / "sitemap.xml").write_text(xml, encoding="utf-8", newline="\n")
        (dist / "robots.txt").write_text(
            (ROOT / "robots.txt").read_text(encoding="utf-8"), encoding="utf-8", newline="\n"
        )
        (dist / ".htaccess").write_text(
            (ROOT / ".htaccess").read_text(encoding="utf-8"), encoding="utf-8", newline="\n"
        )


def main():
    pages = [p.name for p in (ROOT / "src" / "pages").glob("*.html")]
    n = 0
    for name in pages:
        for folder in (ROOT, ROOT / "dist"):
            p = folder / name
            if p.is_file() and apply_file(p):
                n += 1
    write_sitemap(pages)
    print(f"seo: patched {n} html files, wrote sitemap.xml")


if __name__ == "__main__":
    main()
