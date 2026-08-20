/* GPS site JS — nav, reveals, scrollspy, filters, calendar, ecosystem, forms. Vanilla, progressive enhancement. */
(function(){
'use strict';
var d=document;
/* ---------- header nav ---------- */
var body=d.body,toggle=d.getElementById('navToggle'),nav=d.querySelector('nav.main');
if(toggle&&nav){toggle.addEventListener('click',function(){var open=body.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',open?'true':'false');toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});}
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
  li.addEventListener('mouseenter',function(){if(window.matchMedia('(min-width:1100px)').matches)open();});
  li.addEventListener('mouseleave',function(){if(window.matchMedia('(min-width:1100px)').matches){clearTimeout(hoverTimer);hoverTimer=setTimeout(close,180);}});
  sub.addEventListener('mouseenter',function(){clearTimeout(hoverTimer);});
  li.addEventListener('focusin',function(){if(window.matchMedia('(min-width:1100px)').matches)open();});
  li.addEventListener('focusout',function(e){if(window.matchMedia('(min-width:1100px)').matches&&!li.contains(e.relatedTarget))close();});
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
    if(c){c.click();var t=scope.closest('section')||scope;setTimeout(function(){var r=t.getBoundingClientRect();window.scrollTo({top:r.top+window.scrollY-120,behavior:'smooth'});},60);}
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
      if(dateStr){evs.forEach(function(ev){if(ev.date===dateStr||(ev.end&&dateStr>=ev.date&&dateStr<=ev.end)){html+='<a class="cal-ev '+(ev.cls||'')+'" href="'+(ev.href||'/events')+'" title="'+ev.title+'">'+ev.title+'</a>';}});}
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
    var out='';
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
    ds.forEach(function(o){var isRing=o.k.indexOf('core')<0&&o.k.indexOf('impact')<0;out+='<path class="eco2-flow'+(isRing?' ring':'')+'" data-f="'+o.k+'" d="'+o.d+'" stroke="#EEB232"></path>';});
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
/* ---------- featured carousel ---------- */
(function(){
  var root=d.querySelector('[data-feat]');
  if(!root)return;
  var slides=[].slice.call(root.querySelectorAll('[data-feat-slide]'));
  var tabs=[].slice.call(root.querySelectorAll('[data-feat-tab]'));
  var bar=root.querySelector('.feat-progress i');
  var i=0,delay=20000,started=0,elapsed=0,paused=false,raf=0;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setBar(p){if(bar)bar.style.transform='scaleX('+Math.max(0,Math.min(1,p))+')';}
  function stopBar(){if(raf)cancelAnimationFrame(raf);raf=0;}
  function tick(now){
    if(paused||reduce)return;
    if(!started)started=now-elapsed;
    elapsed=now-started;
    var p=elapsed/delay;
    setBar(p);
    if(p>=1){go(i+1);return;}
    raf=requestAnimationFrame(tick);
  }
  function playBar(){
    stopBar();
    started=0;
    elapsed=0;
    paused=false;
    setBar(0);
    if(reduce){setBar(1);return;}
    raf=requestAnimationFrame(tick);
  }
  function pauseBar(){
    paused=true;
    stopBar();
    if(started)elapsed=performance.now()-started;
  }
  function resumeBar(){
    if(reduce||!paused)return;
    paused=false;
    started=0;
    raf=requestAnimationFrame(tick);
  }
  function go(n){
    i=(n+slides.length)%slides.length;
    var activeSlide=slides[i];
    slides.forEach(function(s,k){
      var on=k===i;
      s.classList.toggle('is-on',on);
      s.setAttribute('aria-hidden',on?'false':'true');
      var v=s.querySelector('video');
      if(v){
        if(on){var p=v.play();if(p&&p.catch)p.catch(function(){});}
        else if(!v.paused)v.pause();
      }
    });
    tabs.forEach(function(t,k){
      var on=k===i;
      t.classList.toggle('is-on',on);
      t.setAttribute('aria-selected',on?'true':'false');
      t.tabIndex=on?0:-1;
    });
    playBar();
    if(activeSlide){
      setTimeout(function(){
        activeSlide.querySelectorAll('[data-map].ready').forEach(function(){window.dispatchEvent(new Event('resize'));});
      },80);
    }
  }
  tabs.forEach(function(t,k){t.addEventListener('click',function(){go(k);});});
  var prev=root.querySelector('[data-feat-prev]'),next=root.querySelector('[data-feat-next]');
  if(prev)prev.addEventListener('click',function(){go(i-1);});
  if(next)next.addEventListener('click',function(){go(i+1);});
  root.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){e.preventDefault();go(i+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();go(i-1);}
  });
  d.addEventListener('visibilitychange',function(){
    if(d.hidden)pauseBar();
    else resumeBar();
  });
  go(0);
  var mapWait=setInterval(function(){
    if(d.querySelector('.feat-rail [data-map].ready')){clearInterval(mapWait);window.dispatchEvent(new Event('resize'));}
  },150);
  setTimeout(function(){clearInterval(mapWait);},10000);
})();
/* ---------- work-area card carousel ---------- */
d.querySelectorAll('[data-rail]').forEach(function(rail){
  var track=rail.querySelector('.wr-track');
  if(!track)return;
  var wrap=rail.closest('.work-rail')||rail.parentElement;
  var prev=wrap.querySelector('[data-rail-prev]');
  var next=wrap.querySelector('[data-rail-next]');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var originals=[].slice.call(track.querySelectorAll('.wr-card'));
  var n=originals.length;
  if(!n)return;
  originals.forEach(function(c){
    var clone=c.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.tabIndex=-1;
    track.appendChild(clone);
  });
  var dots=d.createElement('div');
  dots.className='wr-dots';
  dots.setAttribute('role','tablist');
  dots.setAttribute('aria-label','Our work slides');
  originals.forEach(function(_,k){
    var b=d.createElement('button');
    b.type='button';
    b.setAttribute('aria-label','Show work card '+(k+1));
    if(k===0)b.className='is-on';
    b.addEventListener('click',function(){goTo(k);play();});
    dots.appendChild(b);
  });
  rail.appendChild(dots);
  var i=0,timer=null,delay=5000,locked=false;
  function vis(){
    var v=parseFloat(getComputedStyle(rail).getPropertyValue('--wr-vis'));
    return v>0?v:3;
  }
  function gap(){
    var g=parseFloat(getComputedStyle(track).gap);
    return isFinite(g)?g:14;
  }
  function apply(instant){
    var card=track.querySelector('.wr-card');
    if(!card)return;
    var w=card.getBoundingClientRect().width+gap();
    if(instant)track.style.transition='none';
    track.style.transform='translateX(' + (-i*w) + 'px)';
    if(instant){void track.offsetWidth;track.style.transition='';}
    [].slice.call(dots.children).forEach(function(b,k){
      b.classList.toggle('is-on',k===(i%n));
    });
  }
  function goTo(idx){
    i=((idx%n)+n)%n;
    apply(false);
  }
  function step(dir){
    if(locked)return;
    i+=dir;
    apply(false);
    if(i>=n){
      locked=true;
      var done=function(){
        track.removeEventListener('transitionend',done);
        i=0;
        apply(true);
        locked=false;
      };
      if(reduce){done();return;}
      track.addEventListener('transitionend',done);
    }else if(i<0){
      locked=true;
      i=n;
      apply(true);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          i=n-1;
          apply(false);
          locked=false;
        });
      });
    }
  }
  function play(){
    clearInterval(timer);
    if(reduce)return;
    timer=setInterval(function(){step(1);},delay);
  }
  function pause(){clearInterval(timer);}
  if(prev)prev.addEventListener('click',function(){step(-1);play();});
  if(next)next.addEventListener('click',function(){step(1);play();});
  wrap.addEventListener('mouseenter',pause);
  wrap.addEventListener('mouseleave',play);
  wrap.addEventListener('focusin',pause);
  wrap.addEventListener('focusout',function(e){if(!wrap.contains(e.relatedTarget))play();});
  d.addEventListener('visibilitychange',function(){if(d.hidden)pause();else play();});
  window.addEventListener('resize',function(){apply(true);});
  var sx=0,dx=0,drag=false;
  rail.addEventListener('pointerdown',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    drag=true;sx=e.clientX;dx=0;
  });
  rail.addEventListener('pointerup',function(e){
    if(!drag)return;
    drag=false;
    dx=e.clientX-sx;
    if(Math.abs(dx)>40){step(dx<0?1:-1);play();}
  });
  rail.addEventListener('pointercancel',function(){drag=false;});
  apply(true);
  play();
});
/* ---------- hero video: eager for featured hero, lazy elsewhere ---------- */
d.querySelectorAll('video.hf-video').forEach(function(v){
  function go(){v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){});}
  if(v.closest('[data-feat]')){go();return;}
  if(!('IntersectionObserver' in window)){go();return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(en.isIntersecting){go();}
      else if(!v.paused){v.pause();}
    });
  },{threshold:.2});
  io.observe(v);
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
/* ---------- people flip + profile modal ---------- */
(function(){
  var modal=null,lastFocus=null;
  function ensureModal(){
    if(modal)return modal;
    modal=d.createElement('div');
    modal.id='personModal';
    modal.className='person-modal';
    modal.setAttribute('hidden','');
    modal.innerHTML='<button type="button" class="person-modal-backdrop" aria-label="Close profile"></button>'+
      '<div class="person-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="personModalTitle">'+
      '<div class="person-modal-media" data-pm-media><span class="init" data-pm-init></span></div>'+
      '<div class="person-modal-body">'+
      '<button type="button" class="person-modal-close" aria-label="Close">&times;</button>'+
      '<span class="person-modal-role" data-pm-role></span>'+
      '<h2 id="personModalTitle" data-pm-name></h2>'+
      '<p class="person-modal-geo" data-pm-geo></p>'+
      '<p class="person-modal-bio" data-pm-bio></p>'+
      '</div></div>';
    d.body.appendChild(modal);
    modal.querySelector('.person-modal-backdrop').addEventListener('click',closeModal);
    modal.querySelector('.person-modal-close').addEventListener('click',closeModal);
    return modal;
  }
  function openModal(card){
    if(!card)return;
    var m=ensureModal();
    var photo=card.querySelector('.person-photo');
    var img=photo&&photo.querySelector('img');
    var media=m.querySelector('[data-pm-media]');
    var initEl=m.querySelector('[data-pm-init]');
    var old=media.querySelector('img');
    if(old)old.remove();
    if(img){
      var clone=img.cloneNode(true);
      clone.removeAttribute('loading');
      media.insertBefore(clone,initEl);
    }
    initEl.textContent=(card.querySelector('.init')||{}).textContent||'';
    if(photo){
      media.style.setProperty('--cv1',photo.style.getPropertyValue('--cv1')||'#1A5C3A');
      media.style.setProperty('--cv2',photo.style.getPropertyValue('--cv2')||'#09190B');
    }
    m.querySelector('[data-pm-name]').textContent=(card.querySelector('.person-caption h3')||card.querySelector('.person-back h3')||{}).textContent||'';
    m.querySelector('[data-pm-role]').textContent=(card.querySelector('.person-caption .role')||card.querySelector('.person-back .role')||{}).textContent||'';
    var geo=(card.querySelector('.person-back .geo')||{}).textContent||'';
    var geoEl=m.querySelector('[data-pm-geo]');
    geoEl.textContent=geo;
    geoEl.hidden=!geo;
    m.querySelector('[data-pm-bio]').textContent=(card.querySelector('.person-back .bio')||{}).textContent||'';
    lastFocus=d.activeElement;
    m.removeAttribute('hidden');
    requestAnimationFrame(function(){m.classList.add('is-open');});
    body.classList.add('person-modal-open');
    m.querySelector('.person-modal-close').focus();
  }
  function closeModal(){
    if(!modal)return;
    modal.classList.remove('is-open');
    body.classList.remove('person-modal-open');
    setTimeout(function(){if(modal&&!modal.classList.contains('is-open'))modal.setAttribute('hidden','');},280);
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  d.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&modal&&modal.classList.contains('is-open'))closeModal();
  });
  d.querySelectorAll('.person').forEach(function(card){
    if(!card.querySelector('.person-inner'))return;
    card.setAttribute('tabindex','0');
    card.addEventListener('click',function(e){
      if(e.target.closest('[data-person-open]'))return;
      if(window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){
        if(e.target.closest('[data-person-open]'))return;
        e.preventDefault();
        if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
          var btn=card.querySelector('[data-person-open]');
          if(btn)btn.click();
        }else card.classList.toggle('is-flipped');
      }
    });
    var openBtn=card.querySelector('[data-person-open]');
    if(openBtn){
      openBtn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        openModal(card);
      });
    }
  });
})();
/* ---------- cookie consent ---------- */
(function(){
  var KEY='gps_consent';
  var MAX_AGE=365*24*60*60;
  function readCookie(n){
    var m=d.cookie.match(new RegExp('(?:^|; )'+n.replace(/([.$?*|{}()[\]\\/+^])/g,'\\$1')+'=([^;]*)'));
    return m?decodeURIComponent(m[1]):null;
  }
  function writeCookie(v){
    var secure=location.protocol==='https:'?'; Secure':'';
    d.cookie=KEY+'='+encodeURIComponent(v)+'; Path=/; Max-Age='+MAX_AGE+'; SameSite=Lax'+secure;
    try{localStorage.setItem(KEY,v);}catch(e){}
  }
  function getChoice(){
    var c=readCookie(KEY);
    if(c==='all'||c==='essential')return c;
    try{c=localStorage.getItem(KEY);}catch(e){c=null;}
    return (c==='all'||c==='essential')?c:null;
  }
  function emit(choice){
    try{d.dispatchEvent(new CustomEvent('gps-consent',{detail:{choice:choice}}));}catch(e){}
  }
  function hide(banner){
    if(!banner)return;
    banner.classList.remove('is-in');
    body.classList.remove('cookie-open');
    setTimeout(function(){if(banner.parentNode)banner.parentNode.removeChild(banner);},280);
  }
  function apply(choice,banner){
    writeCookie(choice);
    emit(choice);
    hide(banner);
  }
  function show(){
    if(d.getElementById('gpsCookie'))return;
    var el=d.createElement('div');
    el.id='gpsCookie';
    el.className='cookie-banner';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','false');
    el.setAttribute('aria-labelledby','cookie-title');
    el.setAttribute('aria-describedby','cookie-desc');
    el.innerHTML='<div class="cookie-in">'+
      '<div class="cookie-copy"><h2 id="cookie-title">Cookies on this site</h2>'+
      '<p id="cookie-desc">We use an essential preference to remember your choice. Optional cookies (for example analytics) are only used if you accept. '+
      '<a href="/privacy">Privacy &amp; cookies</a></p></div>'+
      '<div class="cookie-actions">'+
      '<button type="button" class="btn btn-ghost cookie-btn" data-choice="essential">Essential only</button>'+
      '<button type="button" class="btn btn-ink cookie-btn" data-choice="all">Accept all</button>'+
      '</div></div>';
    d.body.appendChild(el);
    body.classList.add('cookie-open');
    requestAnimationFrame(function(){el.classList.add('is-in');});
    el.querySelectorAll('[data-choice]').forEach(function(btn){
      btn.addEventListener('click',function(){apply(btn.getAttribute('data-choice'),el);});
    });
    var focusBtn=el.querySelector('[data-choice="all"]')||el.querySelector('button');
    if(focusBtn)focusBtn.focus();
  }
  window.GPSConsent={
    get:getChoice,
    acceptedOptional:function(){return getChoice()==='all';},
    open:show
  };
  d.querySelectorAll('[data-cookie-open]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();show();});
  });
  if(!getChoice())show();
  else emit(getChoice());
})();
/* ---------- scroll to top ---------- */
(function(){
  var btn=d.createElement('button');
  btn.type='button';
  btn.className='to-top';
  btn.setAttribute('aria-label','Back to top');
  btn.innerHTML='<svg class="tt-ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="tt-track" cx="27" cy="27" r="24"/><circle class="tt-prog" cx="27" cy="27" r="24"/></svg><span class="tt-core"><svg class="tt-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="m6 11 6-6 6 6"/></svg></span>';
  d.body.appendChild(btn);
  var circ=btn.querySelector('.tt-prog');
  var C=2*Math.PI*24;
  if(circ){circ.style.strokeDasharray=String(C);circ.style.strokeDashoffset=String(C);}
  var ticking=false;
  function measure(){
    var doc=d.documentElement;
    var max=Math.max(1,doc.scrollHeight-window.innerHeight);
    var p=Math.min(1,window.scrollY/max);
    var need=window.matchMedia('(max-width:899px)').matches?80:360;
    btn.classList.toggle('is-in',window.scrollY>need);
    if(circ)circ.style.strokeDashoffset=String(C*(1-p));
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){ticking=true;requestAnimationFrame(measure);}
  },{passive:true});
  measure();
  btn.addEventListener('click',function(){
    btn.classList.add('is-going');
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(function(){btn.classList.remove('is-going');},700);
  });
})();
/* ---------- global site search (overlay + shared engine) ---------- */
(function(){
  var KIND_LABEL={page:'Page',publication:'Publication',news:'News',partner:'Partner',opportunity:'Opportunity',event:'Event',person:'People',hub:'Hub'};
  var KIND_ORDER=['page','publication','news','event','opportunity','partner','person','hub'];
  var SUGGEST=['Fellowships','Policy','Kigali 2027','Partnership','Publications','Regional hubs','Opportunities','GPS Journal'];
  var idx=null,idxPromise=null,cacheV='';
  var scr=d.querySelector('script[src*="site.js"]');
  if(scr&&scr.src){var vm=scr.src.match(/[?&]v=([^&]+)/);if(vm)cacheV=vm[1];}

  function norm(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  }
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function markAll(text,terms){
    if(!terms||!terms.length)return esc(text);
    var raw=String(text||'');
    var lower=raw.toLowerCase();
    var parts=[],i=0;
    while(i<raw.length){
      var best=-1,blen=0,t;
      for(var ti=0;ti<terms.length;ti++){
        t=terms[ti];
        if(!t)continue;
        var at=lower.indexOf(t,i);
        if(at===i&&t.length>blen){best=at;blen=t.length;}
      }
      if(best===i&&blen){
        var end=i+blen;
        while(end<raw.length&&/[A-Za-z0-9]/.test(raw.charAt(end)))end++;
        parts.push('<mark>'+esc(raw.slice(i,end))+'</mark>');
        i=end;
      }else{
        var next=raw.length;
        for(ti=0;ti<terms.length;ti++){
          t=terms[ti];if(!t)continue;
          at=lower.indexOf(t,i);
          if(at>=0&&at<next)next=at;
        }
        if(next===i){parts.push(esc(raw.charAt(i)));i++;}
        else{parts.push(esc(raw.slice(i,next)));i=next;}
      }
    }
    return parts.join('');
  }
  function editDist(a,b){
    if(a===b)return 0;
    var al=a.length,bl=b.length;
    if(Math.abs(al-bl)>1)return 2;
    if(al>bl){var tmp=a;a=b;b=tmp;al=a.length;bl=b.length;}
    if(al===0)return bl;
    var prev=0;
    for(var i=0,j=0;i<bl;i++){
      if(j<al&&a.charAt(j)===b.charAt(i))j++;
      else prev++;
      if(prev>1)return prev;
    }
    return prev+(al-j);
  }
  function fuzzyHit(term,hayWords){
    if(term.length<5)return false;
    for(var i=0;i<hayWords.length;i++){
      var w=hayWords[i];
      if(w.length<4)continue;
      if(editDist(term,w)<=1)return true;
    }
    return false;
  }

  function loadIndex(){
    if(idx)return Promise.resolve(idx);
    if(idxPromise)return idxPromise;
    var url='/assets/search-index.json'+(cacheV?'?v='+cacheV:'');
    idxPromise=fetch(url,{credentials:'same-origin'}).then(function(r){
      if(!r.ok)throw new Error('search index');
      return r.json();
    }).then(function(data){
      idx=Array.isArray(data)?data:[];
      idx.forEach(function(p){
        p._n=norm(p.t+' '+p.s+' '+p.d+' '+(p.kw||'')+' '+(p.k||''));
        p._tw=norm(p.t).split(' ').filter(Boolean);
      });
      return idx;
    }).catch(function(){
      var el=d.getElementById('gps-search-index');
      if(el){
        try{idx=JSON.parse(el.textContent);}catch(e){idx=[];}
      }else idx=[];
      idx.forEach(function(p){
        p._n=norm(p.t+' '+p.s+' '+p.d+' '+(p.kw||'')+' '+(p.k||''));
        p._tw=norm(p.t).split(' ').filter(Boolean);
      });
      return idx;
    });
    return idxPromise;
  }

  function search(q,opts){
    opts=opts||{};
    var kind=opts.kind||'';
    var limit=opts.limit||40;
    q=norm(q);
    if(!q)return {hits:[],terms:[],suggestions:SUGGEST.slice()};
    var terms=q.split(' ').filter(Boolean);
    var list=idx||[];
    var hits=[];
    for(var i=0;i<list.length;i++){
      var p=list[i];
      if(kind&&p.k!==kind)continue;
      var score=0,all=true;
      for(var ti=0;ti<terms.length;ti++){
        var t=terms[ti];
        var tn=norm(p.t),sn=norm(p.s),dn=norm(p.d+' '+(p.kw||''));
        if(tn.indexOf(t)>=0){
          score+=10;
          if(tn.indexOf(t)===0||(' '+tn+' ').indexOf(' '+t)===0)score+=4;
          if(p._tw.some(function(w){return w.indexOf(t)===0;}))score+=2;
        }else if(sn.indexOf(t)>=0)score+=4;
        else if(dn.indexOf(t)>=0||p._n.indexOf(t)>=0)score+=2;
        else if(fuzzyHit(t,p._tw))score+=3;
        else{all=false;break;}
      }
      if(all)hits.push({p:p,score:score});
    }
    hits.sort(function(a,b){return b.score-a.score||a.p.t.localeCompare(b.p.t);});
    var suggestions=[];
    if(hits.length){
      hits.slice(0,6).forEach(function(h){if(suggestions.indexOf(h.p.t)<0)suggestions.push(h.p.t);});
    }else{
      SUGGEST.forEach(function(s){if(norm(s).indexOf(terms[0])>=0||terms[0].length<2)suggestions.push(s);});
      if(!suggestions.length)suggestions=SUGGEST.slice(0,4);
    }
    return {hits:hits.slice(0,limit),terms:terms,suggestions:suggestions,total:hits.length};
  }

  function kindLabel(k){return KIND_LABEL[k]||k||'Result';}

  function renderHit(h,terms,cls){
    var p=h.p;
    return '<a class="'+(cls||'sr-item')+'" href="'+esc(p.u)+'" data-sr-href="'+esc(p.u)+'">'+
      '<div class="sr-meta"><span class="sr-kind">'+esc(kindLabel(p.k))+'</span>'+
      (p.s?'<span class="sr-sec">'+esc(p.s)+'</span>':'')+'</div>'+
      '<h3>'+markAll(p.t,terms)+'</h3>'+
      (p.d?'<p>'+markAll(p.d,terms)+'</p>':'')+
      '</a>';
  }

  window.GPSSearch={
    load:loadIndex,
    search:search,
    kindLabel:kindLabel,
    kindOrder:KIND_ORDER,
    mark:markAll,
    esc:esc,
    suggestions:SUGGEST,
    renderHit:renderHit
  };

  /* overlay */
  var overlay=null,ovInput=null,ovList=null,ovEmpty=null,ovStart=null,ovCount=null,ovActive=-1,ovHits=[],debounce=null,lastFocus=null,suppressOpen=false;

  function ensureOverlay(){
    if(overlay)return overlay;
    overlay=d.createElement('div');
    overlay.id='gpsSearchOverlay';
    overlay.className='gps-search';
    overlay.setAttribute('hidden','');
    overlay.innerHTML=
      '<button type="button" class="gps-search-backdrop" aria-label="Close search"></button>'+
      '<div class="gps-search-panel" role="dialog" aria-modal="true" aria-label="Search the site">'+
      '<div class="gps-search-bar">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>'+
      '<input type="search" id="gpsSearchInput" placeholder="Search pages, publications, events…" autocomplete="off" aria-autocomplete="list" aria-controls="gpsSearchList" enterkeyhint="search">'+
      '<kbd class="gps-search-esc">Esc</kbd>'+
      '<button type="button" class="gps-search-close" aria-label="Close">&times;</button>'+
      '</div>'+
      '<div class="gps-search-body">'+
      '<div id="gpsSearchStart" class="gps-search-start">'+
      '<p class="gps-search-hint">Search across the whole platform</p>'+
      '<div class="gps-search-sugs" data-sugs></div>'+
      '</div>'+
      '<div id="gpsSearchCount" class="gps-search-count" hidden></div>'+
      '<div id="gpsSearchList" class="gps-search-list" role="listbox" aria-label="Search results"></div>'+
      '<div id="gpsSearchEmpty" class="gps-search-empty" hidden>'+
      '<p><b>No matches.</b> Try a broader term, or browse <a href="/what-we-do">Our Work</a>, <a href="/knowledge-hub">Knowledge &amp; News</a>, or the <a href="/roadmap">Roadmap</a>.</p>'+
      '</div>'+
      '<div class="gps-search-foot" data-foot hidden><a class="btn btn-ink btn-sm" data-view-all href="/search">View all results</a></div>'+
      '</div></div>';
    d.body.appendChild(overlay);
    ovInput=overlay.querySelector('#gpsSearchInput');
    ovList=overlay.querySelector('#gpsSearchList');
    ovEmpty=overlay.querySelector('#gpsSearchEmpty');
    ovStart=overlay.querySelector('#gpsSearchStart');
    ovCount=overlay.querySelector('#gpsSearchCount');
    var sugs=overlay.querySelector('[data-sugs]');
    sugs.innerHTML=SUGGEST.map(function(s){return '<button type="button" class="tag" data-sug="'+esc(s)+'">'+esc(s)+'</button>';}).join('');
    overlay.querySelector('.gps-search-backdrop').addEventListener('click',closeOverlay);
    overlay.querySelector('.gps-search-close').addEventListener('click',closeOverlay);
    sugs.addEventListener('click',function(e){
      var b=e.target.closest('[data-sug]');
      if(!b)return;
      ovInput.value=b.getAttribute('data-sug');
      runOverlay(ovInput.value);
      ovInput.focus();
    });
    ovInput.addEventListener('input',function(){
      clearTimeout(debounce);
      debounce=setTimeout(function(){runOverlay(ovInput.value);},120);
    });
    ovInput.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();moveActive(1);}
      else if(e.key==='ArrowUp'){e.preventDefault();moveActive(-1);}
      else if(e.key==='Enter'){
        if(ovActive>=0&&ovHits[ovActive]){
          e.preventDefault();
          location.href=ovHits[ovActive].p.u;
        }else if(ovInput.value.trim()){
          e.preventDefault();
          location.href='/search?q='+encodeURIComponent(ovInput.value.trim());
        }
      }else if(e.key==='Escape'){e.preventDefault();closeOverlay();}
    });
    ovList.addEventListener('mousemove',function(e){
      var a=e.target.closest('[data-sr-href]');
      if(!a)return;
      var items=[].slice.call(ovList.querySelectorAll('[data-sr-href]'));
      var i=items.indexOf(a);
      if(i>=0)setActive(i);
    });
    return overlay;
  }

  function setActive(i){
    var items=ovList.querySelectorAll('[data-sr-href]');
    ovActive=i;
    items.forEach(function(el,n){el.classList.toggle('is-active',n===i);});
    if(items[i])items[i].scrollIntoView({block:'nearest'});
  }
  function moveActive(dir){
    if(!ovHits.length)return;
    var n=ovActive+dir;
    if(n<0)n=ovHits.length-1;
    if(n>=ovHits.length)n=0;
    setActive(n);
  }

  function runOverlay(q){
    var foot=overlay.querySelector('[data-foot]');
    var viewAll=overlay.querySelector('[data-view-all]');
    q=(q||'').trim();
    if(!q){
      ovList.innerHTML='';
      ovCount.hidden=true;
      ovEmpty.hidden=true;
      ovStart.hidden=false;
      foot.hidden=true;
      ovHits=[];
      ovActive=-1;
      return;
    }
    ovStart.hidden=true;
    var res=search(q,{limit:12});
    ovHits=res.hits;
    ovActive=ovHits.length?0:-1;
    ovCount.hidden=false;
    ovCount.textContent=res.total+(res.total===1?' result':' results');
    ovEmpty.hidden=!!res.hits.length;
    ovList.innerHTML=res.hits.map(function(h){return renderHit(h,res.terms,'gps-sr');}).join('');
    foot.hidden=!res.hits.length&&!q;
    if(viewAll){
      viewAll.href='/search?q='+encodeURIComponent(q);
      viewAll.hidden=!q;
      foot.hidden=!q;
    }
    if(ovActive>=0)setActive(ovActive);
  }

  function openOverlay(prefill){
    ensureOverlay();
    lastFocus=d.activeElement;
    loadIndex().then(function(){
      overlay.removeAttribute('hidden');
      requestAnimationFrame(function(){
        overlay.classList.add('is-open');
        body.classList.add('gps-search-open');
        ovInput.value=prefill||'';
        runOverlay(ovInput.value);
        ovInput.focus();
        ovInput.select&&ovInput.value&&ovInput.select();
      });
    });
  }
  function closeOverlay(){
    if(!overlay)return;
    suppressOpen=true;
    overlay.classList.remove('is-open');
    body.classList.remove('gps-search-open');
    setTimeout(function(){
      if(overlay&&!overlay.classList.contains('is-open'))overlay.setAttribute('hidden','');
      suppressOpen=false;
    },280);
    if(lastFocus&&lastFocus.blur)try{lastFocus.blur();}catch(e){}
  }

  d.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&overlay&&overlay.classList.contains('is-open'))closeOverlay();
    if((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey)){
      e.preventDefault();
      openOverlay('');
    }
  });

  function wireTriggers(){
    d.querySelectorAll('form.hd-search').forEach(function(form){
      var inp=form.querySelector('input[type="search"],input[data-gps-search-trigger]');
      if(!inp||inp._gpsSearch)return;
      inp._gpsSearch=true;
      function open(e){
        if(suppressOpen){if(inp.blur)inp.blur();return;}
        if(overlay&&overlay.classList.contains('is-open'))return;
        if(e)e.preventDefault();
        openOverlay(inp.value||'');
      }
      inp.addEventListener('focus',open);
      inp.addEventListener('click',open);
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var q=(inp.value||'').trim();
        if(q)location.href='/search?q='+encodeURIComponent(q);
        else openOverlay('');
      });
    });
  }
  wireTriggers();

  /* full search page */
  var pageInp=d.getElementById('sq');
  if(pageInp){
    var out=d.getElementById('srResults');
    var cnt=d.getElementById('srCount');
    var empty=d.getElementById('srEmpty');
    var start=d.getElementById('srStart');
    var chips=d.getElementById('srKinds');
    var kindFilter='';
    function runPage(q){
      q=(q||'').trim();
      if(!q){
        if(out)out.innerHTML='';
        if(cnt)cnt.textContent='';
        if(empty)empty.style.display='none';
        if(start)start.style.display='';
        return;
      }
      if(start)start.style.display='none';
      var res=search(q,{kind:kindFilter,limit:80});
      if(cnt)cnt.textContent=res.total+(res.total===1?' result':' results');
      if(empty)empty.style.display=res.hits.length?'none':'flex';
      if(out)out.innerHTML=res.hits.map(function(h){return renderHit(h,res.terms,'sr-item');}).join('');
      if(chips){
        var counts={};
        (idx||[]).forEach(function(){});
        var allRes=search(q,{limit:500});
        allRes.hits.forEach(function(h){counts[h.p.k]=(counts[h.p.k]||0)+1;});
        chips.querySelectorAll('[data-kind]').forEach(function(btn){
          var k=btn.getAttribute('data-kind');
          var n=k?counts[k]||0:allRes.total;
          btn.hidden=k?!counts[k]:false;
          var label=btn.getAttribute('data-label')||btn.textContent.replace(/\s*\d+$/,'').trim();
          btn.textContent=label+(n?' '+n:'');
          btn.classList.toggle('on',(k||'')===kindFilter);
        });
      }
    }
    loadIndex().then(function(){
      var q=new URLSearchParams(location.search).get('q')||'';
      if(q)pageInp.value=q;
      runPage(q);
      var t=null;
      pageInp.addEventListener('input',function(){
        clearTimeout(t);
        t=setTimeout(function(){
          var v=pageInp.value;
          var url=new URL(location.href);
          if(v.trim())url.searchParams.set('q',v.trim());else url.searchParams.delete('q');
          history.replaceState(null,'',url.pathname+url.search);
          runPage(v);
        },130);
      });
      if(chips){
        chips.addEventListener('click',function(e){
          var b=e.target.closest('[data-kind]');
          if(!b)return;
          kindFilter=b.getAttribute('data-kind')||'';
          runPage(pageInp.value);
        });
      }
    });
  }
})();
})();
