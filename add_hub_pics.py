with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

old_html = '<div class="ph r16x9"><span>Photography — hub coordination meeting, Addis Ababa</span></div>'

new_html = '''<figure class="dual-hist-fig" style="margin:0;display:flex;flex-direction:column;gap:10px;border-radius:var(--r);overflow:hidden">
<img src="/assets/images/hub-meeting-1.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;display:block;object-fit:cover;max-height:320px" loading="lazy">
<img src="/assets/images/hub-meeting-2.jpg" alt="Hub coordination meeting, Addis Ababa" style="width:100%;display:block;object-fit:cover;max-height:220px" loading="lazy">
<figcaption style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);padding:6px 2px">Hub coordination meeting, Addis Ababa</figcaption>
</figure>'''

content = content.replace(old_html, new_html)

with open('about-regional-hubs/index.html', 'w') as f:
    f.write(content)
