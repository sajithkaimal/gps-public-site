/* GPS interactive world map — d3-geo + Natural Earth (world-atlas 110m). Progressive enhancement:
   pages keep full static hub content; this draws the signature map into [data-map] stages.
   Extensible: add future hubs to GPS_HUBS (or pass extras via a data-map-extra JSON block). */
(function(){
'use strict';
window.GPS_HUBS=[
 {id:'kigali',name:'Kigali',country:'Rwanda',region:'East Africa',role:'Headquarters',status:'hq',lon:30.0619,lat:-1.9441,blurb:'Global headquarters — strategy, coordination, and the Kigali Knowledge Crossroads Week.'},
 {id:'addis',name:'Addis Ababa',country:'Ethiopia',region:'East & Horn of Africa',role:'Regional Hub',status:'hub',lon:38.7578,lat:9.0107,blurb:'Gateway to continental institutions and the African Union ecosystem.'},
 {id:'dakar',name:'Dakar',country:'Senegal',region:'West Africa (Francophone)',role:'Regional Hub',status:'hub',lon:-17.4467,lat:14.6928,blurb:'Francophone West Africa — research, culture, and Atlantic partnerships.'},
 {id:'accra',name:'Accra',country:'Ghana',region:'West Africa (Anglophone)',role:'Regional Hub',status:'hub',lon:-0.187,lat:5.6037,blurb:'Anglophone West Africa — enterprise, innovation, and diaspora engagement.'},
 {id:'saopaulo',name:'São Paulo',country:'Brazil',region:'Latin America',role:'Regional Hub',status:'hub',lon:-46.6333,lat:-23.5505,blurb:'Latin America — university cooperation with GCUB and the 2028 convening.'},
 {id:'martinique',name:'Martinique',country:'France (Caribbean)',region:'The Caribbean',role:'Regional Hub',status:'hub',lon:-61.0742,lat:14.6104,blurb:'Caribbean node — linking island universities, culture, and climate resilience.'},
 {id:'caribbean',name:'Caribbean',country:'Location in consultation',region:'The Wider Caribbean',role:'Under Consultation',status:'plan',lon:-77.5,lat:20.6,blurb:'Planned — extending Caribbean presence beyond the Martinique hub, in consultation with island universities and regional bodies.'},
 {id:'mena',name:'Middle East',country:'Location in consultation',region:'MENA',role:'Under Consultation',status:'plan',lon:35.93,lat:31.95,blurb:'Planned — consultations underway with regional partners.'},
 {id:'asia',name:'South & SE Asia',country:'Location in consultation',region:'Asia-Pacific',role:'Under Consultation',status:'plan',lon:101.69,lat:3.14,blurb:'Planned — exploratory partnerships across South and Southeast Asia.'}
];
function ready(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}
ready(function(){
var stages=document.querySelectorAll('[data-map]');
if(!stages.length)return;
if(typeof d3==='undefined'||typeof topojson==='undefined')return;
d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function(topo){
  var world=topojson.feature(topo,topo.objects.countries);
  stages.forEach(function(stage){draw(stage,world);});
}).catch(function(){/* static fallback stays visible */});
/* ---------- hero: full-bleed Global South network background ---------- */
var NORTH=['United States of America','United States','Canada','Greenland','Iceland','Norway','Sweden','Finland','Denmark','United Kingdom','Ireland','France','Germany','Netherlands','Belgium','Luxembourg','Switzerland','Austria','Italy','Spain','Portugal','Greece','Malta','Cyprus','N. Cyprus','Poland','Czechia','Czech Rep.','Slovakia','Hungary','Slovenia','Croatia','Bosnia and Herz.','Bosnia and Herzegovina','Serbia','Republic of Serbia','Montenegro','Kosovo','Albania','North Macedonia','Macedonia','Bulgaria','Romania','Moldova','Ukraine','Belarus','Russia','Estonia','Latvia','Lithuania','Japan','South Korea','Republic of Korea','Korea','Australia','New Zealand','Israel','Antarctica','Fr. S. Antarctic Lands'];
var NSET={};NORTH.forEach(function(n){NSET[n]=1;});
function drawHero(stage,world){
  var svg=d3.select(stage).append('svg').attr('aria-hidden','true').attr('focusable','false').attr('preserveAspectRatio','none');
  var lay=document.createElement('div');lay.className='h-labels';stage.appendChild(lay);
  var hubs=(window.GPS_HUBS||[]).slice();
  var byId={};hubs.forEach(function(h){byId[h.id]=h;});
  var ROUTES=[['kigali','saopaulo'],['kigali','dakar'],['kigali','asia'],['accra','saopaulo'],['dakar','martinique'],['addis','asia'],['martinique','accra'],['kigali','mena'],['saopaulo','asia'],['addis','dakar'],['caribbean','saopaulo'],['kigali','caribbean']];
  var isSouth=function(f){var n=(f.properties&&f.properties.name)||'';return !NSET[n];};
  var southF=world.features.filter(isSouth),northF=world.features.filter(function(f){return !isSouth(f);});
  var labs=hubs.map(function(h){
    var el=document.createElement('span');
    el.className='h-lab'+(h.status==='plan'?' plan':'');
    el.textContent=h.name;lay.appendChild(el);
    return{h:h,el:el};
  });
  var raf=null;
  function render(){
    var bw=stage.clientWidth,bh=stage.clientHeight;
    if(!bw||!bh)return;
    /* viewBox === real pixel box, so nothing is ever sliced off */
    var proj=d3.geoNaturalEarth1().rotate([30,0]);
    /* shrink slightly and shift right so no hub label lands in the copy column */
    var wide=bw>=900,sc=wide?0.88:1,dx=wide?bw*0.13:0;
    proj.fitWidth(bw*sc,{type:'Sphere'});
    var bn=d3.geoPath(proj).bounds({type:'Sphere'});
    var mh=bn[1][1]-bn[0][1],t=proj.translate();
    proj.translate([t[0]+dx,t[1]-bn[0][1]+(bh-mh)/2]);
    var path=d3.geoPath(proj);
    svg.attr('viewBox','0 0 '+bw+' '+bh);
    svg.selectAll('*').remove();
    var defs=svg.append('defs');
    var sg=defs.append('linearGradient').attr('id','hSouth').attr('gradientUnits','userSpaceOnUse').attr('x1',0).attr('y1',0).attr('x2',bw).attr('y2',bh);
    sg.append('stop').attr('offset','0%').attr('stop-color','#12414a');
    sg.append('stop').attr('offset','45%').attr('stop-color','#14384e');
    sg.append('stop').attr('offset','100%').attr('stop-color','#1b3352');
    var ag=defs.append('linearGradient').attr('id','hArc').attr('gradientUnits','userSpaceOnUse').attr('x1',0).attr('y1',0).attr('x2',bw).attr('y2',0);
    ag.append('stop').attr('offset','0%').attr('stop-color','#00d6a4');
    ag.append('stop').attr('offset','50%').attr('stop-color','#3ae0c0');
    ag.append('stop').attr('offset','100%').attr('stop-color','#19a7ff');
    svg.append('path').attr('class','h-grat').attr('d',path(d3.geoGraticule10()));
    svg.append('g').selectAll('path').data(northF).join('path').attr('class','h-north').attr('d',path);
    svg.append('g').selectAll('path').data(southF).join('path').attr('class','h-south').attr('d',path);
    var arcs=svg.append('g');
    ROUTES.forEach(function(r,i){
      var a=byId[r[0]],b=byId[r[1]];if(!a||!b)return;
      var dd=path({type:'LineString',coordinates:[[a.lon,a.lat],[b.lon,b.lat]]});
      if(!dd)return;
      arcs.append('path').attr('class','h-arc').attr('d',dd);
      var c=arcs.append('path').attr('class','h-comet').attr('d',dd).attr('stroke','url(#hArc)');
      var L=c.node().getTotalLength();
      c.style('stroke-dasharray','22 '+L).style('stroke-dashoffset',L+22)
       .style('--hL',(L+22)+'px')
       .style('animation','hflow '+(7+(i%5)*1.9).toFixed(1)+'s linear '+(i*1.35).toFixed(2)+'s infinite');
    });
    var hg=svg.append('g');
    hubs.forEach(function(h){
      var xy=proj([h.lon,h.lat]);if(!xy)return;
      var g=hg.append('g').attr('class','h-hub'+(h.status==='plan'?' plan':'')).attr('transform','translate('+xy[0]+','+xy[1]+')');
      g.append('circle').attr('class','h-ring').attr('r',6).attr('stroke',h.status==='hq'?'#a3e635':null).style('animation-delay',(Math.random()*3).toFixed(2)+'s');
      g.append('circle').attr('class','h-node').attr('r',h.status==='hq'?5.5:4).attr('fill',h.status==='hq'?'#a3e635':null);
    });
    var placed=[];
    labs.forEach(function(l){
      var xy=proj([l.h.lon,l.h.lat]);
      if(!xy){l.el.style.visibility='hidden';return;}
      var w=l.el.offsetWidth||64,lh=l.el.offsetHeight||16;
      var R=xy[0]+12,L=xy[0]-12-w;
      var cands=[[R,xy[1]],[L,xy[1]],[R,xy[1]-lh-3],[L,xy[1]-lh-3],[R,xy[1]+lh+3],[L,xy[1]+lh+3]];
      var pick=null;
      for(var i=0;i<cands.length&&!pick;i++){
        var cx=cands[i][0],cy=cands[i][1];
        if(cx<6||cx+w>bw-6)continue;
        if(wide&&cx<bw*0.45&&cy<bh*0.72)continue;
        var r={l:cx,r:cx+w,t:cy-lh/2,b:cy+lh/2};
        var hit=false;
        for(var j=0;j<placed.length;j++){var q=placed[j];
          if(r.l<q.r+5&&q.l<r.r+5&&r.t<q.b+3&&q.t<r.b+3){hit=true;break;}}
        if(!hit)pick=r;
      }
      if(!pick){var fx=Math.max(wide?bw*0.45:6,Math.min(R,bw-w-6));pick={l:fx,r:fx+w,t:xy[1]-lh/2,b:xy[1]+lh/2};}
      placed.push(pick);
      l.el.style.left=Math.round(pick.l)+'px';
      l.el.style.top=Math.round(Math.max(8,Math.min((pick.t+pick.b)/2,bh-8)))+'px';
      l.el.style.visibility='visible';
    });
  }
  function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(render);}
  render();setTimeout(render,80);
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(stage);else window.addEventListener('resize',schedule);
  stage.classList.add('ready');
}

function drawGlobe(stage,world){
  var hubs=(window.GPS_HUBS||[]).slice();
  var hq=hubs.filter(function(h){return h.status==='hq';})[0]||hubs[0];
  var panel=stage.querySelector('[data-hub-panel]');
  var pinCol={hq:'#a3e635',hub:'#00d6a4',plan:'#ffd23f'};
  function fillPanel(h){
    if(!panel)return;
    panel.style.setProperty('--hc',pinCol[h.status]||'#a3e635');
    panel.querySelector('.hp-kick').textContent=h.role;
    panel.querySelector('.hp-name').textContent=h.name;
    panel.querySelector('.hp-rg').textContent=(h.country&&h.country!==h.region?h.country+' · ':'')+h.region;
    panel.querySelector('.hp-blurb').textContent=h.blurb||'';
  }
  var svg=d3.select(stage).append('svg').attr('class','globe-svg').attr('aria-hidden','true');
  var lay=document.createElement('div');lay.className='g-labels';stage.appendChild(lay);
  var labs=hubs.map(function(h){var e=document.createElement('span');e.className='g-lab'+(h.status==='plan'?' plan':'');e.textContent=h.name;lay.appendChild(e);return{h:h,el:e};});
  var raf=null;
  function render(){
    var bw=stage.clientWidth,bh=stage.clientHeight;
    if(!bw||!bh)return;
    /* globe is intentionally larger than the frame and offset — the world
       runs past the edge, so the full picture lives on the network page */
    var R=Math.max(bw*0.48,bh*0.80);
    var cx=bw*0.56,cy=bh*0.50;
    var proj=d3.geoOrthographic().rotate([-10,-8]).scale(R).translate([cx,cy]).clipAngle(90);
    var path=d3.geoPath(proj);
    svg.attr('viewBox','0 0 '+bw+' '+bh);
    svg.selectAll('*').remove();
    var defs=svg.append('defs');
    var lg=defs.append('radialGradient').attr('id','gS').attr('cx','32%').attr('cy','26%');
    lg.append('stop').attr('offset','0%').attr('stop-color','#1f6b52');
    lg.append('stop').attr('offset','60%').attr('stop-color','#14524a');
    lg.append('stop').attr('offset','100%').attr('stop-color','#0d3b3c');
    var og=defs.append('radialGradient').attr('id','gO').attr('cx','34%').attr('cy','26%');
    og.append('stop').attr('offset','0%').attr('stop-color','#0a2b2a');
    og.append('stop').attr('offset','70%').attr('stop-color','#071c20');
    og.append('stop').attr('offset','100%').attr('stop-color','#040f14');
    svg.append('path').attr('class','g-ocean').attr('d',path({type:'Sphere'})).attr('fill','url(#gO)');
    svg.append('path').attr('class','g-grat').attr('d',path(d3.geoGraticule10()));
    var isSouth=function(f){return !NSET[(f.properties&&f.properties.name)||''];};
    svg.append('g').selectAll('path').data(world.features.filter(function(f){return !isSouth(f);}))
      .join('path').attr('class','g-north').attr('d',path);
    svg.append('g').selectAll('path').data(world.features.filter(isSouth))
      .join('path').attr('class','g-south').attr('d',path).attr('fill','url(#gS)');
    svg.append('path').attr('class','g-rim').attr('d',path({type:'Sphere'}));
    var arcs=svg.append('g');
    hubs.forEach(function(h){
      if(h.id===hq.id)return;
      var d=path({type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]});
      if(d)arcs.append('path').attr('class','g-arc').attr('d',d);
    });
    var hg=svg.append('g');
    labs.forEach(function(l){
      var h=l.h,xy=proj([h.lon,h.lat]);
      var vis=xy&&d3.geoDistance([h.lon,h.lat],[-proj.rotate()[0],-proj.rotate()[1]])<Math.PI/2;
      if(!vis){l.el.style.visibility='hidden';return;}
      var g=hg.append('g').attr('class','g-hub'+(h.status==='plan'?' plan':'')).attr('transform','translate('+xy[0]+','+xy[1]+')').style('--pc',pinCol[h.status]);
      g.append('circle').attr('class','g-ping').attr('r',5).style('animation-delay',(Math.random()*3).toFixed(2)+'s');
      g.append('circle').attr('class','g-dot').attr('r',h.status==='hq'?6:4.5);
      g.on('mouseenter',function(){fillPanel(h);if(panel)panel.classList.add('live');})
       .on('mouseleave',function(){if(panel)panel.classList.remove('live');});
      var w=l.el.offsetWidth||60;
      var x=(xy[0]+13+w>bw-8)?xy[0]-13-w:xy[0]+13;
      l.el.style.left=Math.round(x)+'px';
      l.el.style.top=Math.round(xy[1])+'px';
      l.el.style.visibility=(xy[0]<-30||xy[0]>bw+30||xy[1]<0||xy[1]>bh)?'hidden':'visible';
    });
  }
  function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(render);}
  render();setTimeout(render,80);
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(stage);else window.addEventListener('resize',schedule);
  fillPanel(hq);
  stage.classList.add('ready');
}

function draw(stage,world){
  var mode=stage.getAttribute('data-map')||'hubs';
  if(mode==='hero')return drawHero(stage,world);
  if(mode==='globe')return drawGlobe(stage,world);
  var W=980,H=520;
  var svg=d3.select(stage).append('svg').attr('viewBox','0 0 '+W+' '+H).attr('role','img')
    .attr('aria-label','World map showing GPS regional hubs in Kigali, Addis Ababa, Dakar, Accra, São Paulo, and Martinique');
  var proj=d3.geoNaturalEarth1().fitExtent([[6,-30],[W-6,H+6]],{type:'Sphere'});
  var path=d3.geoPath(proj);
  svg.append('path').attr('class','graticule').attr('d',path(d3.geoGraticule10()));
  svg.append('g').selectAll('path').data(world.features).join('path').attr('class','land').attr('d',path);
  var defs=svg.append('defs');
  var g=defs.append('linearGradient').attr('id','arcGrad').attr('gradientUnits','userSpaceOnUse').attr('x1',0).attr('y1',0).attr('x2',W).attr('y2',0);
  g.append('stop').attr('offset','0%').attr('stop-color','#00d6a4');
  g.append('stop').attr('offset','55%').attr('stop-color','#19a7ff');
  g.append('stop').attr('offset','100%').attr('stop-color','#a3e635');
  var hubs=window.GPS_HUBS.slice();
  var extraEl=stage.parentNode.querySelector('[data-map-extra]');
  if(extraEl){try{hubs=hubs.concat(JSON.parse(extraEl.textContent));}catch(e){}}
  var hq=hubs.filter(function(h){return h.status==='hq';})[0]||hubs[0];
  /* arcs HQ -> hubs */
  hubs.forEach(function(h){
    if(h.id===hq.id)return;
    var line={type:'LineString',coordinates:[[hq.lon,hq.lat],[h.lon,h.lat]]};
    svg.append('path').attr('class','hub-arc').attr('d',path(line));
  });
  /* tooltip — or a docked panel inside the stage when the page provides one */
  var panel=stage.querySelector('[data-hub-panel]');
  function fillPanel(h){
    if(!panel)return;
    panel.style.setProperty('--hc',pinCol[h.status]||'#00d6a4');
    panel.querySelector('.hp-kick').textContent=h.role;
    panel.querySelector('.hp-name').textContent=h.name;
    panel.querySelector('.hp-rg').textContent=(h.country&&h.country!==h.region?h.country+' · ':'')+h.region;
    panel.querySelector('.hp-blurb').textContent=h.blurb||'';
  }
  var tip=document.createElement('div');tip.className='map-tip';stage.appendChild(tip);
  function showTip(h,x,y){
    tip.innerHTML='<div class="r">'+h.role+'</div><h4>'+h.name+'</h4><p>'+(h.blurb||h.region)+'</p>';
    var bw=stage.clientWidth;var px=x/W*bw,py=y/(H)*stage.clientWidth*(H/W);
    tip.style.left=Math.min(Math.max(px+14,8),bw-230)+'px';tip.style.top=(py+10)+'px';tip.classList.add('show');
  }
  /* pins */
  var pinCol={hq:'#00d6a4',hub:'#19a7ff',plan:'#ffd23f'};
  hubs.forEach(function(h){
    var xy=proj([h.lon,h.lat]);if(!xy)return;
    var pin=svg.append('g').attr('class','pin'+(h.status==='plan'?' dim2':'')).attr('transform','translate('+xy[0]+','+xy[1]+')').style('--pinc',pinCol[h.status]||'#00d6a4');
    pin.append('circle').attr('class','pulse').attr('r',5);
    pin.append('circle').attr('class','c').attr('r',h.status==='hq'?6:4.5).attr('stroke-dasharray',h.status==='plan'?'2 2':null);
    var anchor=(xy[0]>W-120)?'end':'start';
    pin.append('text').attr('x',anchor==='end'?-10:10).attr('y',4).attr('text-anchor',anchor).text(h.name+(h.status==='hq'?' · HQ':h.status==='plan'?' · under consultation':''));
    pin.on('mouseenter',function(){if(panel){fillPanel(h);panel.classList.add('live');}else showTip(h,xy[0],xy[1]);})
       .on('mouseleave',function(){if(panel)panel.classList.remove('live');else tip.classList.remove('show');})
       .on('click',function(){var card=document.getElementById('hub-'+h.id);if(card){window.scrollTo({top:card.getBoundingClientRect().top+window.scrollY-110,behavior:'auto'});card.style.boxShadow='0 0 0 3px rgba(0,214,164,.45)';setTimeout(function(){card.style.boxShadow='';},1600);}});
  });
  if(panel)fillPanel(hq);
  stage.classList.add('ready');
}
});
})();
