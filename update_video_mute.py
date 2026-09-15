import re

with open('index.html', 'r') as f:
    content = f.read()

# Remove 'muted' from the video tag
old_video = '<video class="hf-video" src="/assets/video/gps-web.mp4" poster="/assets/images/gps-web-thumb.png" loop muted playsinline'
new_video = '<video class="hf-video" src="/assets/video/gps-web.mp4" poster="/assets/images/gps-web-thumb.png" loop playsinline'
content = content.replace(old_video, new_video)

# Update the button to be icon-only and start as 'Mute' since video is unmuted
old_btn = """<button class="btn btn-ghost" type="button" onclick="const v = this.closest('.feat-slide').querySelector('video'); v.muted = !v.muted; this.textContent = v.muted ? '🔊 Unmute Audio' : '🔇 Mute Audio';">🔊 Unmute Audio</button>"""
new_btn = """<button class="btn btn-ghost" type="button" style="padding: 0 16px; font-size: 20px; min-width: 0;" aria-label="Toggle Audio" onclick="const v = this.closest('.feat-slide').querySelector('video'); v.muted = !v.muted; this.innerHTML = v.muted ? '🔇' : '🔊';">🔊</button>"""
content = content.replace(old_btn, new_btn)

with open('index.html', 'w') as f:
    f.write(content)

print("Success updating video and button")
