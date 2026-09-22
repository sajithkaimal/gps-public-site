from pathlib import Path
import re

root = Path(r"d:\Projects\gps-public-site")
for p in (root / "src" / "pages").glob("*.html"):
    t = p.read_text(encoding="utf-8")
    n = t.replace('action="send.php"', 'action="/send.php"')
    n = re.sub(r'(src|poster|href)="(assets/[^"]+)"', r'\1="/\2"', n)
    if n != t:
        p.write_text(n, encoding="utf-8")
        print("fixed", p.name)
print("done")
