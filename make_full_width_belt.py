import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# 1. Change <section class="wash"> to <section> (or just remove class="wash")
# We need to target the section containing "What a hub does"
# The string before it is `</section>\n<section class="wash">\n<div class="inner split">\n<div class="prose reveal">`

old_html = """</section>
<section class="wash">
<div class="inner split">
<div class="prose reveal"><h3 style="margin-top:0">What a hub does</h3>"""

new_html = """</section>
<section style="padding-bottom:80px;">
<div class="inner">
<div class="prose reveal" style="max-width:800px; margin-bottom:40px;"><h3 style="margin-top:0">What a hub does</h3>"""

if old_html in content:
    content = content.replace(old_html, new_html)
else:
    print("Warning: Could not find exact old_html start block")

# 2. Update the CSS for the belt to show more images since it's full width
content = content.replace('.hub-belt-wr { --wr-vis: 1.5; --wr-gap: 12px; margin: 0 -20px; padding: 0 20px; }',
                          '.hub-belt-wr { --wr-vis: 2.8; --wr-gap: 20px; margin: 0 -20px; padding: 0 20px; }')
content = content.replace('@media(max-width: 768px) { .hub-belt-wr { --wr-vis: 1.15; } }',
                          '@media(max-width: 900px) { .hub-belt-wr { --wr-vis: 2.15; } }\n    @media(max-width: 600px) { .hub-belt-wr { --wr-vis: 1.15; } }')

# 3. Update aspect ratio to maybe 16/10 or keep 4/3. 4/3 is fine.

with open('about-regional-hubs/index.html', 'w') as f:
    f.write(content)

print("Success updating layout")
