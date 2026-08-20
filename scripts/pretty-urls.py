from pathlib import Path
import re
import json

root = Path(r"d:\Projects\gps-public-site")


def pretty(href: str) -> str:
    if not href or href.startswith(("mailto:", "https:", "http:", "//", "tel:")):
        return href
    if href.startswith("#"):
        return href
    path, _, hashpart = href.partition("#")
    q = ""
    if "?" in path:
        path, q = path.split("?", 1)
        q = "?" + q
    path = path.strip()
    if path in ("", "/", "index.html"):
        out = "/"
    else:
        if path.endswith(".html"):
            path = path[:-5]
        if not path.startswith("/"):
            path = "/" + path
        out = path
    if hashpart:
        out += "#" + hashpart
    return out + q


idx_path = root / "src" / "search-index.json"
data = json.loads(idx_path.read_text(encoding="utf-8"))
for row in data:
    if "u" in row:
        row["u"] = pretty(row["u"])
idx_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("search-index", len(data), "entries")

attr_pat = re.compile(r'\b(href|action)=["\']([^"\']+)["\']')
meta_pat = re.compile(r'"([a-z0-9\-]+\.html(?:#[^"]*)?)"')


def rewrite_file(p: Path) -> bool:
    text = p.read_text(encoding="utf-8")
    orig = text

    def repl_attr(m):
        attr, val = m.group(1), m.group(2)
        if ".html" in val:
            return f'{attr}="{pretty(val)}"'
        return m.group(0)

    text = attr_pat.sub(repl_attr, text)
    text = meta_pat.sub(lambda m: json.dumps(pretty(m.group(1))), text)
    if text != orig:
        p.write_text(text, encoding="utf-8")
        return True
    return False


n = 0
paths = list((root / "src" / "pages").glob("*.html")) + [root / "src" / "ecosystem.frag.html"]
for p in paths:
    if rewrite_file(p):
        n += 1
        print("updated", p.name)
print("files updated", n)
