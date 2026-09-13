import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

old_block = """<figure style="margin:0; display:flex; flex-direction:column; gap:12px;">
<div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:6px; padding:8px; background:#fff; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04); border:1px solid rgba(0,0,0,0.05);">"""

new_block = """<figure style="margin:0; display:flex; flex-direction:column; gap:12px;">
<div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:8px;">"""

if old_block in content:
    content = content.replace(old_block, new_block)
    # Also I might want to increase the border-radius on the images since the outer frame is gone.
    # Currently: border-radius:6px;
    content = content.replace('border-radius:6px;"', 'border-radius:8px;"')
    
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Old block not found!")
