import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# Replace margin-bottom on the prose
content = content.replace('style="max-width:800px; margin-bottom:40px;"', 'style="max-width:800px; margin-bottom:12px;"')

# Replace margin-top on the work-rail
content = content.replace('class="reveal d1 work-rail" style="margin-top:20px;"', 'class="reveal d1 work-rail" style="margin-top:0;"')

with open('about-regional-hubs/index.html', 'w') as f:
    f.write(content)
    
print("Success")
