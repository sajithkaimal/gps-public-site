import re

with open('assets/map.js', 'r') as f:
    content = f.read()

# Replace the GPS_HUBS array
start_idx = content.find('window.GPS_HUBS=[')
end_idx = content.find('];', start_idx) + 2

new_hubs = """window.GPS_HUBS=[
 {id:'kigali',name:'Kigali',country:'',region:'Headquarters',role:'Headquarters',status:'hq',lon:30.0619,lat:-1.9441,blurb:''},
 {id:'africa',name:'Africa',country:'',region:'Ethiopia, Senegal and Ghana',role:'',status:'hub',lon:19.0,lat:5.0,blurb:''},
 {id:'mena',name:'Middle East',country:'',region:'Lebanon — Beirut',role:'',status:'plan',lon:35.5018,lat:33.8938,blurb:''},
 {id:'saopaulo',name:'Latin America',country:'',region:'São Paulo',role:'',status:'hub',lon:-46.6333,lat:-23.5505,blurb:''},
 {id:'caribbean',name:'The Caribbean',country:'',region:'Martinique',role:'',status:'hub',lon:-61.0742,lat:14.6104,blurb:''},
 {id:'asia',name:'South & Southeast Asia',country:'',region:'Asia-Pacific',role:'',status:'plan',lon:101.69,lat:3.14,blurb:''}
];"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_hubs + content[end_idx:]
    with open('assets/map.js', 'w') as f:
        f.write(content)
    print("Success updating GPS_HUBS")
else:
    print("Could not find GPS_HUBS block")
