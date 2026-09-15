import re

with open('index.html', 'r') as f:
    content = f.read()

old_btn = """<button class="btn btn-ghost" type="button" style="padding: 0 16px; font-size: 20px; min-width: 0;" aria-label="Toggle Audio" onclick="const v = this.closest('.feat-slide').querySelector('video'); v.muted = !v.muted; this.innerHTML = v.muted ? '🔇' : '🔊';">🔊</button>"""
new_btn = """<button class="btn btn-ghost" type="button" style="padding: 0 16px; font-size: 20px; min-width: 0;" aria-label="Toggle Audio" onclick="const v = this.closest('.feat-slide').querySelector('video'); v.muted = !v.muted; if(v.paused) v.play(); this.innerHTML = v.muted ? '🔇' : '🔊';">🔊</button>"""

content = content.replace(old_btn, new_btn)

with open('index.html', 'w') as f:
    f.write(content)

print("Success updating button logic")
