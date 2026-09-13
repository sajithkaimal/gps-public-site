import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# We need to insert the two new slides right before </div> <!-- end of wr-track -->
# The track block:
#     <div class="wr-track" id="hubBeltTrack">
#       <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p11.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
#       ...
#       <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
#     </div>

insert_target = '<div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>'
new_slides = """<div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p15.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p16.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>"""

if insert_target in content:
    content = content.replace(insert_target, new_slides)
    
    # Also add data-delay="8000" (or 9000?) to the wrapper to "increase number of time to slide"
    # Actually I already updated the default in site.js to 8000! Let's explicitly put data-delay="8000" so it's clear.
    content = content.replace('class="wr hub-belt-wr" data-rail role="region"', 'class="wr hub-belt-wr" data-rail data-delay="8000" role="region"')

    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success inserting slides")
else:
    print("Could not find insert target")
