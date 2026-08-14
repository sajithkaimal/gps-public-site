/* GPS site JS — nav, reveals, scrollspy, filters, calendar, ecosystem, forms. Vanilla, progressive enhancement. */
(function(){
'use strict';
var d=document;
/* ---------- header nav ---------- */
var body=d.body,toggle=d.getElementById('navToggle'),nav=d.querySelector('nav.main');
if(toggle&&nav){toggle.addEventListener('click',function(){var open=body.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',open?'true':'false');});}
var drops=d.querySelectorAll('nav.main>ul>li');
var hoverTimer=null;
function closeAll(except){drops.forEach(function(li){if(li!==except){li.classList.remove('open');var b=li.querySelector(':scope>.sub-toggle');if(b)b.setAttribute('aria-expanded','false');}});}
drops.forEach(function(li){
  var sub=li.querySelector(':scope>.sub'),btn=li.querySelector(':scope>.sub-toggle');
  if(!sub||!btn)return;
  function open(){clearTimeout(hoverTimer);closeAll(li);li.classList.add('open');btn.setAttribute('aria-expanded','true');}
  function close(){li.classList.remove('open');btn.setAttribute('aria-expanded','false');}
  btn.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    var was=li.classList.contains('open');closeAll(null);
    if(!was){li.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });
  li.addEventListener('mouseenter',function(){if(window.matchMedia('(min-width:900px)').matches)open();});
  li.addEventListener('mouseleave',function(){if(window.matchMedia('(min-width:900px)').matches){clearTimeout(hoverTimer);hoverTimer=setTimeout(close,260);}});
  sub.addEventListener('mouseenter',function(){clearTimeout(hoverTimer);});
  li.addEventListener('focusin',function(){if(window.matchMedia('(min-width:900px)').matches)open();});
  li.addEventListener('focusout',function(e){if(window.matchMedia('(min-width:900px)').matches&&!li.contains(e.relatedTarget))close();});
});
d.addEventListener('click',function(e){if(nav&&!nav.contains(e.target)&&!(toggle&&toggle.contains(e.target)))closeAll(null);});
d.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll(null);body.classList.remove('nav-open');}});
/* ---------- reveals (fail-open: .js gate added inline in <head>; timeout reveals all) ---------- */
var revs=[].slice.call(d.querySelectorAll('.reveal'));
function revealAll(){revs.forEach(function(el){el.classList.add('in');});}
if('IntersectionObserver' in window){
  var vh=window.innerHeight||d.documentElement.clientHeight;
  revs.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<vh&&r.bottom>0)el.classList.add('in');});
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  revs.forEach(function(el){if(!el.classList.contains('in'))io.observe(el);});
  setTimeout(function(){var vh2=window.innerHeight||d.documentElement.clientHeight;revs.forEach(function(el){if(!el.classList.contains('in')){var r=el.getBoundingClientRect();if(r.top<vh2&&r.bottom>0)el.classList.add('in');}});},1000);
  setTimeout(revealAll,2500);
}else{revealAll();}
/* ---------- subnav scrollspy ---------- */
var spy=d.querySelector('.subnav');
if(spy){
  var links=[].slice.call(spy.querySelectorAll('a[href^="#"]'));
  var secs=links.map(function(a){return d.getElementById(a.getAttribute('href').slice(1));}).filter(Boolean);
  var onscroll=function(){
    var y=window.scrollY+140,cur=null;
    secs.forEach(function(s){if(s.offsetTop<=y)cur=s;});
    links.forEach(function(a){a.classList.toggle('now',cur&&a.getAttribute('href')==='#'+cur.id);});
  };
  window.addEventListener('scroll',onscroll,{passive:true});onscroll();
}
/* ---------- filter engine ---------- */
d.querySelectorAll('[data-filter-scope]').forEach(function(scope){
  var list=scope.querySelector('[data-filter-list]');if(!list)return;
  var items=[].slice.call(list.querySelectorAll('[data-item]'));
  var chips=[].slice.call(scope.querySelectorAll('.fchip'));
  var search=scope.querySelector('[data-f-search]');
  var count=scope.querySelector('[data-f-count]');
  var state={key:{},q:''};
  function apply(){
    var shown=0;
    items.forEach(function(it){
      var ok=true;
      for(var k in state.key){var v=state.key[k];if(v&&v!=='all'){var iv=(it.getAttribute('data-'+k)||'').split(/\s+/);if(iv.indexOf(v)<0)ok=false;}}
      if(ok&&state.q){var t=(it.textContent||'').toLowerCase();if(t.indexOf(state.q)<0)ok=false;}
      it.style.display=ok?'':'none';if(ok)shown++;
    });
    list.classList.toggle('is-empty',shown===0);
    if(count)count.textContent=shown+' of '+items.length;
  }
  chips.forEach(function(c){
    c.addEventListener('click',function(){
      var k=c.getAttribute('data-f-key'),v=c.getAttribute('data-f-val');
      chips.forEach(function(o){if(o.getAttribute('data-f-key')===k)o.classList.remove('on');});
      c.classList.add('on');state.key[k]=v;apply();
    });
  });
  if(search)search.addEventListener('input',function(){state.q=search.value.trim().toLowerCase();apply();});
  /* hash preset: #policy-briefs matches chip[data-hash="policy-briefs"] */
  function fromHash(){
    var h=location.hash.slice(1);if(!h)return;
    var c=scope.querySelector('.fchip[data-hash="'+h+'"]');
    if(c){c.click();var t=scope.closest('section')||scope;setTimeout(function(){var r=t.getBoundingClientRect();window.scrollTo({top:r.top+window.scrollY-120,behavior:'auto'});},60);}
  }
  window.addEventListener('hashchange',fromHash);fromHash();
  apply();
});
/* ---------- calendar ---------- */
var calEl=d.querySelector('[data-calendar]');
if(calEl){
  var src=d.getElementById('gps-events');var evs=[];
  try{evs=JSON.parse(src.textContent);}catch(e){}
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var today=new Date();var view=new Date(today.getFullYear(),today.getMonth(),1);
  var title=d.querySelector('[data-cal-title]');
  function pad(n){return (n<10?'0':'')+n;}
  function render(){
    var y=view.getFullYear(),m=view.getMonth();
    if(title)title.textContent=MON[m]+' '+y;
    var first=new Date(y,m,1),startDow=(first.getDay()+6)%7;/* Mon start */
    var days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();
    var html='';var dows=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    dows.forEach(function(w){html+='<div class="cal-dow">'+w+'</div>';});
    var cells=Math.ceil((startDow+days)/7)*7;
    for(var i=0;i<cells;i++){
      var dayNum,cls='cal-cell',dateStr=null;
      if(i<startDow){dayNum=prevDays-startDow+1+i;cls+=' dim';}
      else if(i>=startDow+days){dayNum=i-startDow-days+1;cls+=' dim';}
      else{dayNum=i-startDow+1;dateStr=y+'-'+pad(m+1)+'-'+pad(dayNum);
        if(y===today.getFullYear()&&m===today.getMonth()&&dayNum===today.getDate())cls+=' today';}
      html+='<div class="'+cls+'"><span class="dn">'+dayNum+'</span>';
      if(dateStr){evs.forEach(function(ev){if(ev.date===dateStr||(ev.end&&dateStr>=ev.date&&dateStr<=ev.end)){html+='<a class="cal-ev '+(ev.cls||'')+'" href="'+(ev.href||'events.html')+'" title="'+ev.title+'">'+ev.title+'</a>';}});}
      html+='</div>';
    }
    calEl.innerHTML=html;
  }
  var prev=d.querySelector('[data-cal-prev]'),next=d.querySelector('[data-cal-next]');
  if(prev)prev.addEventListener('click',function(){view.setMonth(view.getMonth()-1);render();});
  if(next)next.addEventListener('click',function(){view.setMonth(view.getMonth()+1);render();});
  render();
}
/* ---------- ecosystem diagram: connectors measured from live layout ---------- */
d.querySelectorAll('[data-eco2]').forEach(function(root){
  var svg=root.querySelector('.eco2-net');if(!svg)return;
  var PAIRS=[['core','k'],['core','t'],['core','p'],['core','e'],['k','t'],['t','e'],['e','p'],['p','k'],['e','impact']];
  function box(id){var el=root.querySelector('[data-eco-node="'+id+'"]');if(!el)return null;
    var b=el.getBoundingClientRect(),r=root.getBoundingClientRect();
    return{x:b.left-r.left+b.width/2,y:b.top-r.top+b.height/2,w:b.width,h:b.height,round:id==='core'};}
  function edge(a,b){var dx=b.x-a.x,dy=b.y-a.y;
    if(a.round){var m=Math.sqrt(dx*dx+dy*dy)||1,rr=a.w/2+5;return{x:a.x+dx/m*rr,y:a.y+dy/m*rr};}
    var hw=a.w/2+5,hh=a.h/2+5;
    var sx=dx?hw/Math.abs(dx):1e9,sy=dy?hh/Math.abs(dy):1e9,s=Math.min(sx,sy);
    return{x:a.x+dx*s,y:a.y+dy*s};}
  function draw(){
    var r=root.getBoundingClientRect(),W=r.width,H=r.height;
    if(!W||!H||window.matchMedia('(max-width:860px)').matches)return;
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    var out='<defs><linearGradient id="ecoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00d6a4"/><stop offset="55%" stop-color="#3ae0c0"/><stop offset="100%" stop-color="#19a7ff"/></linearGradient></defs>';
    var C=box('core'),K=box('k'),T=box('t');
    if(C&&K&&T){var rx=Math.abs(C.x-T.x),ry=Math.abs(C.y-K.y);
      out+='<ellipse class="eco2-orbit" cx="'+C.x.toFixed(1)+'" cy="'+C.y.toFixed(1)+'" rx="'+rx.toFixed(1)+'" ry="'+ry.toFixed(1)+'"></ellipse>';}
    var ds=[];
    PAIRS.forEach(function(pr){
      var A=box(pr[0]),B=box(pr[1]);if(!A||!B)return;
      var p1=edge(A,B),p2=edge(B,A);
      var mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2;
      var bow=(pr[0]==='core'||pr[1]==='core'||pr[1]==='impact')?0:.17;
      var q=(mx-(p2.y-p1.y)*bow)+','+(my+(p2.x-p1.x)*bow);
      var dd='M'+p1.x.toFixed(1)+','+p1.y.toFixed(1)+' Q'+q+' '+p2.x.toFixed(1)+','+p2.y.toFixed(1);
      ds.push({d:dd,k:pr[0]+'-'+pr[1]});
      out+='<path class="eco2-base" d="'+dd+'"></path>';
    });
    ds.forEach(function(o){var isRing=o.k.indexOf('core')<0&&o.k.indexOf('impact')<0;out+='<path class="eco2-flow'+(isRing?' ring':'')+'" data-f="'+o.k+'" d="'+o.d+'" stroke="url(#ecoG)"></path>';});
    svg.innerHTML=out;
    svg.querySelectorAll('.eco2-flow').forEach(function(p,i){
      var L=p.getTotalLength();
      p.style.strokeDasharray='15 '+L;
      p.style.setProperty('--eL',(L+15)+'px');
      p.style.animation='ecoflow '+(5.4+(i%4)*1.7).toFixed(1)+'s linear '+(i*0.62).toFixed(2)+'s infinite';
    });
  }
  draw();setTimeout(draw,140);
  if(window.ResizeObserver)new ResizeObserver(draw).observe(root);else window.addEventListener('resize',draw);
  root.querySelectorAll('[data-eco-node]').forEach(function(el){
    var id=el.getAttribute('data-eco-node');
    function lite(on){svg.querySelectorAll('.eco2-flow').forEach(function(p){
      var k=(p.getAttribute('data-f')||'').split('-');
      p.classList.toggle('lit',on&&k.indexOf(id)>=0);});}
    el.addEventListener('mouseenter',function(){lite(true);});
    el.addEventListener('mouseleave',function(){lite(false);});
    el.addEventListener('focus',function(){lite(true);},true);
    el.addEventListener('blur',function(){lite(false);},true);
  });
});
/* ---------- hero video: lazy, below-the-fold playback ---------- */
d.querySelectorAll('video.hf-video').forEach(function(v){
  function go(){v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){});}
  if(!('IntersectionObserver' in window)){go();return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting){go();}
      else if(!v.paused){v.pause();}
    });
  },{threshold:.2});
  io.observe(v);
  setTimeout(function(){if(v.readyState===0&&v.preload!=='auto')go();},2500);
});
/* ---------- forms → send.php (one inbox) ---------- */
d.querySelectorAll('form[data-demo]').forEach(function(f){
  if(!f.getAttribute('action')){f.setAttribute('action','send.php');f.setAttribute('method','post');}
  if(!f.querySelector('[name="_form"]')){
    var t=d.createElement('input');t.type='hidden';t.name='_form';
    t.value=f.getAttribute('aria-label')||f.getAttribute('data-demo')||'Website form';
    f.appendChild(t);
  }
  if(!f.querySelector('[name="website"]')){
    var hp=d.createElement('div');
    hp.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';
    hp.setAttribute('aria-hidden','true');
    hp.innerHTML='<label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
    f.appendChild(hp);
  }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=f.querySelector('button[type="submit"]'),label=btn?btn.innerHTML:'';
    var msg=f.querySelector('.form-msg');
    if(!msg){msg=d.createElement('p');msg.className='form-msg';msg.setAttribute('role','status');msg.style.cssText='margin-top:14px;font-weight:600;font-size:14px';f.appendChild(msg);}
    msg.style.color='var(--ink-faint)';msg.textContent='Sending…';
    if(btn){btn.disabled=true;btn.innerHTML='Sending…';}
    function done(ok,text){
      msg.style.color=ok?'var(--teal-ink)':'#b4322c';
      msg.textContent=text;
      if(btn){btn.disabled=false;btn.innerHTML=label;}
      if(ok)f.reset();
    }
    fetch(f.getAttribute('action'),{method:'POST',body:new FormData(f)})
      .then(function(r){return r.json().catch(function(){return{ok:r.ok};});})
      .then(function(j){
        if(j&&j.ok)done(true,'Thank you — your message has been sent to info@gpsouth.org. Our team will follow up at the address you provided.');
        else done(false,(j&&j.error?j.error+' ':'')+'Please try again, or email us directly at info@gpsouth.org.');
      })
      .catch(function(){done(false,'We could not send that just now. Please email us directly at info@gpsouth.org.');});
  });
});
/* ---------- donate amount picker ---------- */
d.querySelectorAll('.amount-row').forEach(function(row){
  var wrap=d.getElementById('customAmtWrap'),inp=d.getElementById('customAmt'),out=d.getElementById('giveAmt');
  function setOut(v){if(out)out.textContent=v;}
  row.querySelectorAll('.amt-btn').forEach(function(b){
    b.addEventListener('click',function(){
      row.querySelectorAll('.amt-btn').forEach(function(o){o.classList.remove('on');});b.classList.add('on');
      var other=b.hasAttribute('data-amt-other');
      if(wrap)wrap.hidden=!other;
      if(other){setOut(inp&&inp.value?'$'+inp.value:'—');if(inp)inp.focus();}
      else setOut(b.textContent);
    });
  });
  if(inp)inp.addEventListener('input',function(){setOut(inp.value?'$'+inp.value:'—');});
});
/* ---------- year ---------- */
d.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear();});
})();
