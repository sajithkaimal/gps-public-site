import re

# 1. Update index.html
with open('index.html', 'r') as f:
    idx_content = f.read()

idx_old_p = '<p>University leaders from across the South, convening in Kigali.</p>'
idx_new_p = '<p>104 universities from Brasil, convening in Kigali, October 2027, inside the Knowledge Crossroads Week.</p>'

if idx_old_p in idx_content:
    idx_content = idx_content.replace(idx_old_p, idx_new_p)
    with open('index.html', 'w') as f:
        f.write(idx_content)
    print("Updated index.html")
else:
    print("Could not find the text in index.html")

# 2. Update initiative-gcub-assembly/index.html
with open('initiative-gcub-assembly/index.html', 'r') as f:
    gcub_content = f.read()

gcub_old_lede = 'University presidents, rectors, and institutional leaders from GCUB\'s member network — convening in Kigali, October 2027, inside the Knowledge Crossroads Week.'
gcub_new_lede = '104 universities from Brasil, convening in Kigali, October 2027, inside the Knowledge Crossroads Week.'

if gcub_old_lede in gcub_content:
    gcub_content = gcub_content.replace(gcub_old_lede, gcub_new_lede)
    with open('initiative-gcub-assembly/index.html', 'w') as f:
        f.write(gcub_content)
    print("Updated initiative-gcub-assembly/index.html")
else:
    print("Could not find exact text in initiative-gcub-assembly/index.html")
    
