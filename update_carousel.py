import re

with open('index.html', 'r') as f:
    html = f.read()

# 1. Remove GPS Journal Article
# Look for <article class="feat-slide" data-feat-slide aria-hidden="true">\n<div class="feat-visual feat-v-journal"> ... </article>
journal_article_pattern = re.compile(r'<article class="feat-slide" data-feat-slide aria-hidden="true">\s*<div class="feat-visual feat-v-journal">.*?</article>', re.DOTALL)
html = re.sub(journal_article_pattern, '', html)

# 2. Remove GPS Journal Tab
journal_tab_pattern = re.compile(r'<button type="button" class="feat-tab" role="tab" aria-selected="false" tabindex="-1" data-feat-tab>\s*<span class="feat-mini feat-thumb-journal">.*?</button>', re.DOTALL)
html = re.sub(journal_tab_pattern, '', html)

# 3. Create new Video Article
new_article = """<article class="feat-slide is-on" data-feat-slide>
<div class="feat-visual feat-v-webvideo">
<video class="hf-video" src="/assets/video/gps-web.mp4" poster="/assets/images/gps-web-thumb.png" loop muted playsinline preload="auto" fetchpriority="high" disablepictureinpicture aria-label="GPS Introduction Video"></video>
</div>
<div class="feat-copy">
<p class="feat-tag">Introduction</p>
<h1>Welcome to the Global Platform for the South</h1>
<p class="feat-lede">Connecting people, knowledge, technology, policy, and enterprise across the Global South.</p>
<div class="feat-actions">
<a class="btn btn-grad" href="/what-we-do">Explore Our Work <span class="arrow">→</span></a>
</div>
</div>
</article>
"""

# 4. Create new Video Tab
new_tab = """<button type="button" class="feat-tab is-on" role="tab" aria-selected="true" data-feat-tab>
<span class="feat-mini feat-mini-webvideo">
<img class="feat-thumb-img" src="/assets/images/gps-web-thumb.png" alt="" width="320" height="180" loading="eager" fetchpriority="high" decoding="sync" aria-hidden="true">
</span>
<span class="feat-cap">Overview</span>
</button>
"""

# 5. Remove is-on from existing first article and tab
# Find the first article which currently has 'feat-slide is-on'
old_first_article = '<article class="feat-slide is-on" data-feat-slide>'
html = html.replace(old_first_article, '<article class="feat-slide" data-feat-slide aria-hidden="true">', 1)

old_first_tab = '<button type="button" class="feat-tab is-on" role="tab" aria-selected="true" data-feat-tab>'
html = html.replace(old_first_tab, '<button type="button" class="feat-tab" role="tab" aria-selected="false" tabindex="-1" data-feat-tab>', 1)

# 6. Insert new article at the beginning of the stage
stage_marker = '<div class="feat-progress" aria-hidden="true"><i></i></div>'
html = html.replace(stage_marker, stage_marker + '\n' + new_article)

# 7. Insert new tab at the beginning of the rail
rail_marker = '<div class="feat-rail" role="tablist" aria-label="Featured items">'
html = html.replace(rail_marker, rail_marker + '\n' + new_tab)

with open('index.html', 'w') as f:
    f.write(html)

print("Success updating index.html")
