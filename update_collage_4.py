import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# We need to find the old <div style="display:grid; ..."> block and replace it.
# The block is inside <figure style="margin:0; display:flex; flex-direction:column; gap:12px;">

# Let's just use regex to replace the <div style="display:grid;...">...</div> completely.

pattern = re.compile(r'<div style="display:grid;[^>]+>.*?</div>', re.DOTALL)

new_grid = """<div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap:8px;">
<img src="/assets/images/hub-meeting-p1.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; height:100%; object-fit:cover; grid-column: 1 / 2; grid-row: 1 / 3; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p3.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:8px;" loading="lazy">
<img src="/assets/images/hub-meeting-p4.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%; height:100%; aspect-ratio:2/1; object-fit:cover; grid-column: 2 / 4; border-radius:8px;" loading="lazy">
</div>"""

if pattern.search(content):
    content = pattern.sub(new_grid, content)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found!")
