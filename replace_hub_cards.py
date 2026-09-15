import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# Locate the <div class="hub-cards"> section
start_tag = '<div class="hub-cards">'
end_tag = '</div>\n</div>\n</section>'

start_idx = content.find(start_tag)
# find the corresponding end of the hub-cards block
end_idx = content.find(end_tag, start_idx)

if start_idx != -1 and end_idx != -1:
    old_block = content[start_idx:end_idx]
    
    new_block = """<div class="hub-cards">
<div class="hub-card reveal" id="hub-kigali" style="--hc:var(--c1)"><h3><i></i>Kigali</h3><div class="rg">Headquarters</div><p>Global headquarters — institutional home, strategy and coordination, and host of the Kigali Knowledge Crossroads Week in October 2027.</p></div>
<div class="hub-card reveal d1" id="hub-africa" style="--hc:var(--c5)"><h3><i></i>Africa</h3><div class="rg">Ethiopia, Senegal and Ghana</div><p>Regional coordination across East, Francophone, and Anglophone West Africa, driving policy, enterprise, and cultural partnerships.</p></div>
<div class="hub-card reveal d2" id="hub-mena" style="--hc:var(--c4)"><h3><i></i>Middle East</h3><div class="rg">Lebanon — Beirut</div><p>Consultations underway with regional universities and institutions.</p></div>
<div class="hub-card reveal" id="hub-saopaulo" style="--hc:var(--c5)"><h3><i></i>Latin America</h3><div class="rg">São Paulo</div><p>University cooperation with GCUB and Latin American networks; host of the 2028 GPS Convening.</p></div>
<div class="hub-card reveal d1" id="hub-caribbean" style="--hc:var(--c5)"><h3><i></i>The Caribbean</h3><div class="rg">Martinique</div><p>Caribbean node — island universities, cultural production, and climate resilience.</p></div>
<div class="hub-card reveal d2" id="hub-asia" style="--hc:var(--c4)"><h3><i></i>South &amp; Southeast Asia</h3><div class="rg">Asia-Pacific</div><p>Exploratory partnerships across South and Southeast Asia.</p></div>
<div class="hub-card reveal" style="--hc:var(--ink-faint);border-style:dashed"><h3><i style="box-shadow:none;background:var(--line)"></i>Your region next</h3><div class="rg">Extensible by design</div><p>The hub architecture — governance, coordination, and this map — is built to add new hubs without redesign. <a href="/get-involved#partner" class="link-arrow" style="font-size:12.5px">Propose a hub</a></p></div>
"""
    
    # Replace old block with new block
    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success updating hub cards")
else:
    print("Could not find hub-cards block")

