import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# We want to replace everything inside <div class="reveal d1"> ... </div> right after <div class="prose reveal">
# Let's find the exact block

old_block = """<figure class="dual-hist-fig" style="margin:0;display:flex;flex-direction:column;gap:10px;border-radius:var(--r);overflow:hidden">
<img src="/assets/images/hub-meeting-1.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;display:block;object-fit:cover;max-height:320px" loading="lazy">
<img src="/assets/images/hub-meeting-2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;display:block;object-fit:cover;max-height:220px" loading="lazy">
<figcaption style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);padding:6px 2px">Hub coordination meeting, Addis Ababa</figcaption>
</figure>"""

new_block = """<figure style="margin:0; display:flex; flex-direction:column; gap:12px;">
<div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:6px; padding:8px; background:#fff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.05);">
<img src="/assets/images/hub-meeting-p2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;height:100%;display:block;object-fit:cover;grid-row: 1 / 3; border-radius:6px;" loading="lazy">
<img src="/assets/images/hub-meeting-p4.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;aspect-ratio:4/3;display:block;object-fit:cover; border-radius:6px;" loading="lazy">
<img src="/assets/images/hub-meeting-p5.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;aspect-ratio:4/3;display:block;object-fit:cover; border-radius:6px;" loading="lazy">
</div>
<figcaption style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);padding:0 2px;text-align:center;">Hub coordination meeting, Addis Ababa</figcaption>
</figure>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Old block not found!")
