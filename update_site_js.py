import re

with open('assets/site.js', 'r') as f:
    content = f.read()

# Replace hardcoded delay with a configurable one
old_line = "var i=0,timer=null,delay=5000,locked=false;"
new_line = "var i=0,timer=null,delay=parseInt(rail.getAttribute('data-delay'))||8000,locked=false;"

if old_line in content:
    content = content.replace(old_line, new_line)
    with open('assets/site.js', 'w') as f:
        f.write(content)
    print("Success updating site.js")
else:
    print("Could not find line in site.js")
