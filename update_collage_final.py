import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div style="display:grid;[^>]+>.*?</div>', re.DOTALL)

new_grid = """<div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
<img src="/assets/images/hub-meeting-p1.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p3.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p5.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:8px;" loading="lazy">
</div>"""

if pattern.search(content):
    content = pattern.sub(new_grid, content)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found!")
