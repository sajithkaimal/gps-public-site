import re

with open('index.html', 'r') as f:
    content = f.read()

# Put 'muted' back on the video
old_video = '<video class="hf-video" src="/assets/video/gps-web.mp4" poster="/assets/images/gps-web-thumb.png" loop playsinline'
new_video = '<video class="hf-video" src="/assets/video/gps-web.mp4" poster="/assets/images/gps-web-thumb.png" loop muted playsinline'
content = content.replace(old_video, new_video)

# Add unmute button
old_actions = """<div class="feat-actions">
<a class="btn btn-grad" href="/what-we-do">Explore Our Work <span class="arrow">→</span></a>
</div>"""
new_actions = """<div class="feat-actions">
<a class="btn btn-grad" href="/what-we-do">Explore Our Work <span class="arrow">→</span></a>
<button class="btn btn-ghost" type="button" onclick="const v = this.closest('.feat-slide').querySelector('video'); v.muted = !v.muted; this.textContent = v.muted ? '🔊 Unmute Audio' : '🔇 Mute Audio';">🔊 Unmute Audio</button>
</div>"""
content = content.replace(old_actions, new_actions)

with open('index.html', 'w') as f:
    f.write(content)

print("Success updating video with unmute button")
