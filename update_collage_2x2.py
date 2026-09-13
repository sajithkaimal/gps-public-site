import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div style="display:grid;[^>]+>.*?</div>', re.DOTALL)

new_grid = """<div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; padding:8px; background:#fff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.05);">
<img src="/assets/images/hub-meeting-p1.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px;" loading="lazy">
<img src="/assets/images/hub-meeting-p2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px;" loading="lazy">
<img src="/assets/images/hub-meeting-p3.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px;" loading="lazy">
<img src="/assets/images/hub-meeting-p4.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:6px;" loading="lazy">
</div>"""

if pattern.search(content):
    content = pattern.sub(new_grid, content)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found!")
