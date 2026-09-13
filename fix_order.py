import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

content = content.replace(
    '<img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">',
    '<img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">'
).replace(
    '<img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">',
    '<img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">',
    1 # Only replace the first occurrence (which was originally p12)
)

# Actually, safer way:
import sys

def replace_slides():
    with open('about-regional-hubs/index.html', 'r') as file:
        data = file.read()
    
    # Just replace the whole track block
    old_track = """<div class="hub-carousel-track" id="hubTrack">
      <div class="hub-carousel-slide" data-index="0">
        <img src="/assets/images/hub-meeting-p11.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="1">
        <img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="2">
        <img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="3">
        <img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
    </div>"""
    
    new_track = """<div class="hub-carousel-track" id="hubTrack">
      <div class="hub-carousel-slide" data-index="0">
        <img src="/assets/images/hub-meeting-p11.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="1">
        <img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="2">
        <img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="3">
        <img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
    </div>"""
    
    if old_track in data:
        data = data.replace(old_track, new_track)
        with open('about-regional-hubs/index.html', 'w') as file:
            file.write(data)
        print("Success order fix")
    else:
        print("Could not find track block")

replace_slides()
