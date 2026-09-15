import re

with open('assets/map.js', 'r') as f:
    content = f.read()

start_idx = content.find('window.GPS_HUBS=[')
end_idx = content.find('];', start_idx) + 2

new_hubs = """window.GPS_HUBS=[
 {id:'kigali',name:'Kigali (Headquarters)',country:'',region:'',role:'',status:'hq',lon:30.0619,lat:-1.9441,blurb:''},
 {id:'africa',name:'Africa (Ethiopia, Senegal and Ghana)',country:'',region:'',role:'',status:'hub',lon:19.0,lat:5.0,blurb:''},
 {id:'mena',name:'Middle East (Lebanon — Beirut)',country:'',region:'',role:'',status:'plan',lon:35.5018,lat:33.8938,blurb:''},
 {id:'saopaulo',name:'Latin America (São Paulo)',country:'',region:'',role:'',status:'hub',lon:-46.6333,lat:-23.5505,blurb:''},
 {id:'caribbean',name:'The Caribbean (Martinique)',country:'',region:'',role:'',status:'hub',lon:-61.0742,lat:14.6104,blurb:''},
 {id:'asia',name:'South & Southeast Asia',country:'',region:'',role:'',status:'plan',lon:101.69,lat:3.14,blurb:''}
];"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_hubs + content[end_idx:]
    with open('assets/map.js', 'w') as f:
        f.write(content)
    print("Success updating GPS_HUBS with brackets")
else:
    print("Could not find GPS_HUBS block")
