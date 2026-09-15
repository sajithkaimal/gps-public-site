import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

old_block = """<div class="hub-cards">
<div class="hub-card reveal" id="hub-kigali" style="--hc:var(--c1)"><h3><i></i>Kigali</h3><div class="rg">Head Quoter</div></div>
<div class="hub-card reveal d1" id="hub-africa" style="--hc:var(--c5)"><h3><i></i>Africa</h3><div class="rg">Ethiopia, Senegal and Ghana</div></div>
<div class="hub-card reveal d2" id="hub-mena" style="--hc:var(--c4)"><h3><i></i>Middle East</h3><div class="rg">Lebanon - Beirut</div></div>
<div class="hub-card reveal" id="hub-saopaulo" style="--hc:var(--c5)"><h3><i></i>latin america</h3><div class="rg">Sao Paolo</div></div>
<div class="hub-card reveal d1" id="hub-caribbean" style="--hc:var(--c5)"><h3><i></i>The Caribbean</h3><div class="rg">Martini</div></div>
<div class="hub-card reveal d2" id="hub-asia" style="--hc:var(--c4)"><h3><i></i>South &amp; Southeast Asia</h3></div>
<div class="hub-card reveal" style="--hc:var(--ink-faint);border-style:dashed"><h3><i style="box-shadow:none;background:var(--line)"></i>Your region next</h3><div class="rg">Extensible by design</div><p>The hub architecture — governance, coordination, and this map — is built to add new hubs without redesign. <a href="/get-involved#partner" class="link-arrow" style="font-size:12.5px">Propose a hub</a></p></div>
</div>"""

new_block = """<div class="hub-cards">
<div class="hub-card reveal" id="hub-kigali" style="--hc:var(--c1)"><h3><i></i>Kigali</h3><div class="rg">Headquarters</div></div>
<div class="hub-card reveal d1" id="hub-africa" style="--hc:var(--c5)"><h3><i></i>Africa</h3><div class="rg">Ethiopia, Senegal and Ghana</div></div>
<div class="hub-card reveal d2" id="hub-mena" style="--hc:var(--c4)"><h3><i></i>Middle East</h3><div class="rg">Lebanon — Beirut</div></div>
<div class="hub-card reveal" id="hub-saopaulo" style="--hc:var(--c5)"><h3><i></i>Latin America</h3><div class="rg">São Paulo</div></div>
<div class="hub-card reveal d1" id="hub-caribbean" style="--hc:var(--c5)"><h3><i></i>The Caribbean</h3><div class="rg">Martinique</div></div>
<div class="hub-card reveal d2" id="hub-asia" style="--hc:var(--c4)"><h3><i></i>South &amp; Southeast Asia</h3></div>
<div class="hub-card reveal" style="--hc:var(--ink-faint);border-style:dashed"><h3><i style="box-shadow:none;background:var(--line)"></i>Your region next</h3><div class="rg">Extensible by design</div><p>The hub architecture — governance, coordination, and this map — is built to add new hubs without redesign. <a href="/get-involved#partner" class="link-arrow" style="font-size:12.5px">Propose a hub</a></p></div>
</div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success updating hub cards")
else:
    print("Could not find hub-cards block")
