import re

with open('assets/map.js', 'r') as f:
    content = f.read()

# 1. Update ROUTES in drawHero
old_routes = "var ROUTES=[['kigali','saopaulo'],['kigali','dakar'],['kigali','asia'],['accra','saopaulo'],['dakar','martinique'],['addis','asia'],['martinique','accra'],['kigali','mena'],['saopaulo','asia'],['addis','dakar'],['caribbean','saopaulo'],['kigali','caribbean']];"
new_routes = "var ROUTES=[['kigali','saopaulo'],['kigali','africa'],['kigali','asia'],['africa','saopaulo'],['africa','caribbean'],['africa','mena'],['caribbean','saopaulo'],['kigali','mena'],['saopaulo','asia'],['kigali','caribbean'],['mena','asia'],['asia','africa']];"
content = content.replace(old_routes, new_routes)

# 2. Update drawGlobe to draw a web instead of just HQ-centric
# Old: 
# hubs.forEach(function(h){
#   if(h.id===hq.id)return;
#   var d=path({type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]});
#   if(d)arcs.append('path').attr('class','g-arc').attr('d',d);
# });
old_globe_arcs = """hubs.forEach(function(h){
      if(h.id===hq.id)return;
      var d=path({type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]});
      if(d)arcs.append('path').attr('class','g-arc').attr('d',d);
    });"""

new_globe_arcs = """// Connect nodes to form a network
    var routes = [['kigali','saopaulo'],['kigali','africa'],['kigali','asia'],['africa','saopaulo'],['africa','caribbean'],['africa','mena'],['caribbean','saopaulo'],['kigali','mena'],['saopaulo','asia'],['kigali','caribbean'],['mena','asia'],['asia','africa']];
    var byId = {}; hubs.forEach(function(h){byId[h.id]=h;});
    routes.forEach(function(r){
      var a=byId[r[0]], b=byId[r[1]]; if(!a||!b)return;
      var d=path({type:'LineString',coordinates:[[a.lon,a.lat],[b.lon,b.lat]]});
      if(d)arcs.append('path').attr('class','g-arc').attr('d',d);
    });"""
content = content.replace(old_globe_arcs, new_globe_arcs)

# 3. Update draw to draw a web instead of just HQ-centric
# Old:
#  /* arcs HQ -> hubs */
#  hubs.forEach(function(h){
#    if(h.id===hq.id)return;
#    var line={type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]};
#    svg.append('path').attr('class','hub-arc').attr('d',path(line));
#  });
old_static_arcs = """/* arcs HQ -> hubs */
  hubs.forEach(function(h){
    if(h.id===hq.id)return;
    var line={type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]};
    svg.append('path').attr('class','hub-arc').attr('d',path(line));
  });"""

new_static_arcs = """/* network connections */
  var routes = [['kigali','saopaulo'],['kigali','africa'],['kigali','asia'],['africa','saopaulo'],['africa','caribbean'],['africa','mena'],['caribbean','saopaulo'],['kigali','mena'],['saopaulo','asia'],['kigali','caribbean'],['mena','asia'],['asia','africa']];
  var byId = {}; hubs.forEach(function(h){byId[h.id]=h;});
  routes.forEach(function(r){
    var a=byId[r[0]], b=byId[r[1]]; if(!a||!b)return;
    var line={type:'LineString',coordinates:[[a.lon,a.lat],[b.lon,b.lat]]};
    svg.append('path').attr('class','hub-arc').attr('d',path(line));
  });"""
content = content.replace(old_static_arcs, new_static_arcs)

with open('assets/map.js', 'w') as f:
    f.write(content)
print("Updated all map arc logic")

