import re

with open('assets/map.js', 'r') as f:
    content = f.read()

# Replace hardcoded ROUTES in drawHero
old_hero_routes = "var ROUTES=[['kigali','saopaulo'],['kigali','africa'],['kigali','asia'],['africa','saopaulo'],['africa','caribbean'],['africa','mena'],['caribbean','saopaulo'],['kigali','mena'],['saopaulo','asia'],['kigali','caribbean'],['mena','asia'],['asia','africa']];"
new_hero_routes = "var ROUTES=[]; for(var i=0;i<hubs.length;i++){for(var j=i+1;j<hubs.length;j++){ROUTES.push([hubs[i].id,hubs[j].id]);}}"
content = content.replace(old_hero_routes, new_hero_routes)

# Replace hardcoded routes in drawGlobe
old_globe_routes = "var routes = [['kigali','saopaulo'],['kigali','africa'],['kigali','asia'],['africa','saopaulo'],['africa','caribbean'],['africa','mena'],['caribbean','saopaulo'],['kigali','mena'],['saopaulo','asia'],['kigali','caribbean'],['mena','asia'],['asia','africa']];"
new_globe_routes = "var routes=[]; for(var i=0;i<hubs.length;i++){for(var j=i+1;j<hubs.length;j++){routes.push([hubs[i].id,hubs[j].id]);}}"
content = content.replace(old_globe_routes, new_globe_routes)

with open('assets/map.js', 'w') as f:
    f.write(content)

print("Updated all routes to fully connect the graph")
