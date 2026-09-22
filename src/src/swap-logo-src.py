from pathlib import Path
n = 0
for folder in [Path(r"d:\Projects\gps-public-site"), Path(r"d:\Projects\gps-public-site\dist")]:
    for p in folder.glob("*.html"):
        t = p.read_text(encoding="utf-8")
        u = t.replace("assets/images/logo-nav.png", "assets/images/logo.png")
        if u != t:
            p.write_text(u, encoding="utf-8", newline="\n")
            n += 1
print(n)
