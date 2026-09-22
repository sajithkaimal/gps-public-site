/* GPS shared site logic — background engine, theme dock, nav, reveals.
   Used by every page. Requires gps-backgrounds.js loaded first. */
(function(){
  var PALETTES = {
    tropic:  {name:'Tropic',  c:['#00d6a4','#3ae0c0','#a3e635','#ffd23f','#19a7ff','#0ea5e9']},
    emerald: {name:'Emerald', c:['#34d399','#10b981','#a3e635','#22d3ee','#0ea5e9','#6366f1']},
    spectrum:{name:'Spectrum',c:['#ff3d81','#ff7a45','#ffc24b','#16c2a3','#2e8bff','#7b5cff']},
    azure:   {name:'Azure',   c:['#22d3ee','#38bdf8','#34d399','#a3e635','#818cf8','#c084fc']}
  };
  var PAL_ORDER = ['tropic','emerald','spectrum','azure'];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VALID_MODES = ['aurora','meridian','network'];
  var sm = localStorage.getItem('gps-mode'), sp = localStorage.getItem('gps-pal');
  var state = {
    mode: VALID_MODES.indexOf(sm) >= 0 ? sm : 'aurora',
    pal: PALETTES[sp] ? sp : 'tropic',
    motion: localStorage.getItem('gps-motion') !== 'off'
  };

  function applyPalette(key){
    var c = PALETTES[key].c, root = document.documentElement.style;
    c.forEach(function(col,i){ root.setProperty('--c'+(i+1), col); });
    root.setProperty('--glow', c[0]);
  }
  applyPalette(state.pal);

  var bg = new GPSBackground(document.getElementById('bg-canvas'), {
    mode: state.mode, palette: PALETTES[state.pal].c, intensity: 1, reduced: reduced || !state.motion
  });
  bg.start();

  var globe = null, globeEl = document.getElementById('globe-canvas');
  if (globeEl){
    globe = new GPSBackground(globeEl, { mode:'meridian', palette: PALETTES[state.pal].c, intensity:1, reduced: reduced || !state.motion });
    globe.start();
  }

  // nav + parallax
  var nav = document.getElementById('nav'), lastY=0, ticking=false;
  function onScroll(){
    lastY = window.scrollY;
    if(!ticking){ requestAnimationFrame(function(){ nav.classList.toggle('scrolled', lastY>40); bg.setScroll(lastY); ticking=false; }); ticking=true; }
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // reveals
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // dock
  var toggle=document.getElementById('dockToggle'), panel=document.getElementById('dockPanel');
  if (toggle && panel){
    toggle.addEventListener('click', function(){ panel.classList.toggle('hidden'); });
    document.addEventListener('click', function(e){ if(!panel.contains(e.target) && !toggle.contains(e.target)) panel.classList.add('hidden'); });
    var seg = document.getElementById('modeSeg');
    seg.addEventListener('click', function(e){
      var b=e.target.closest('button'); if(!b) return;
      seg.querySelectorAll('button').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active'); state.mode=b.dataset.mode; localStorage.setItem('gps-mode',state.mode); bg.setMode(state.mode);
    });
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.dataset.mode===state.mode); });

    var palRow=document.getElementById('palRow');
    PAL_ORDER.forEach(function(key){
      var p=PALETTES[key], d=document.createElement('div');
      d.className='pal'+(key===state.pal?' active':''); d.title=p.name;
      d.style.background='linear-gradient(120deg,'+p.c.join(',')+')';
      d.addEventListener('click', function(){
        palRow.querySelectorAll('.pal').forEach(function(x){ x.classList.remove('active'); });
        d.classList.add('active'); state.pal=key; localStorage.setItem('gps-pal',key);
        applyPalette(key); bg.setPalette(p.c); if(globe) globe.setPalette(p.c);
      });
      palRow.appendChild(d);
    });

    var msw=document.getElementById('motionSwitch');
    function syncMotion(){
      msw.classList.toggle('on', state.motion);
      bg.setReduced(reduced || !state.motion); if(globe) globe.setReduced(reduced || !state.motion);
      if(state.motion && !reduced){ bg.start(); if(globe) globe.start(); } else { bg.stop(); if(globe) globe.stop(); }
    }
    msw.addEventListener('click', function(){ state.motion=!state.motion; localStorage.setItem('gps-motion', state.motion?'on':'off'); syncMotion(); });
    syncMotion();
  }
})();
