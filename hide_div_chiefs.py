with open('about-governance/index.html', 'r') as f:
    content = f.read()

# Hide Division Chiefs in org chart
content = content.replace(
    '<div class="org-box"><span class="badge dim">Domains</span><h4>Division Chiefs</h4>',
    '<div class="org-box" style="display:none;"><span class="badge dim">Domains</span><h4>Division Chiefs</h4>'
)

# Hide Division Chiefs in the cards section
content = content.replace(
    '<div class="card reveal d1"><span class="kick">04</span><h3>Division Chiefs</h3>',
    '<div class="card reveal d1" style="display:none;"><span class="kick">04</span><h3>Division Chiefs</h3>'
)

with open('about-governance/index.html', 'w') as f:
    f.write(content)
