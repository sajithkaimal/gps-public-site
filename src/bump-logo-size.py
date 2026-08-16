from pathlib import Path
n = 0
roots = [Path(r"d:\Projects\gps-public-site"), Path(r"d:\Projects\gps-public-site\dist")]
for folder in roots:
    for p in folder.glob("*.html"):
        t = p.read_text(encoding="utf-8")
        u = t.replace('width="220" height="64"', 'width="280" height="88"')
        u = u.replace("assets/site.css?v=20260816c", "assets/site.css?v=20260816d")
        if u != t:
            p.write_text(u, encoding="utf-8", newline="\n")
            n += 1
print(n)
