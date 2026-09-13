import re

# Update HTML
with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()
content = content.replace('data-delay="8000"', 'data-delay="4000"')
with open('about-regional-hubs/index.html', 'w') as f:
    f.write(content)

# Update site.js
with open('assets/site.js', 'r') as f:
    content = f.read()
content = content.replace("var i=0,timer=null,delay=parseInt(rail.getAttribute('data-delay'))||8000,locked=false;", 
                          "var i=0,timer=null,delay=parseInt(rail.getAttribute('data-delay'))||5000,locked=false;")
with open('assets/site.js', 'w') as f:
    f.write(content)

print("Success updating delay")
