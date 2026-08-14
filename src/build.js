/* GPS build — nav, footer, page assembly. Run via run_script: eval(await readFile('src/build.js'))
   Exposes: GPSBUILD.run(version) */
globalThis.GPSBUILD = (() => {
/* Five top-level items. Secondary pages live in submenus or on landing pages.
   Pages with no real material yet are reached from roadmap.html, not the menu. */
const NAV = [
 {id:'about',label:'About',href:'about.html',sub:[
   ['about-why-gps.html','Why GPS?'],
   ['about-mission-vision.html','Mission &amp; Vision'],
   ['about-our-approach.html','Our Approach'],
   ['people.html','People &amp; Governance'],
   ['impact.html','Impact'],
   ['roadmap.html','Roadmap']]},
 {id:'work',label:'Our Work',href:'what-we-do.html',sub:[
   ['work-knowledge.html','Knowledge Co-Creation, Sharing &amp; Dissemination'],
   ['work-innovation.html','Technology &amp; Innovation'],
   ['work-policy.html','Policy, Governance &amp; Public Leadership'],
   ['work-enterprise.html','Enterprise &amp; Sustainable Development'],
   ['initiatives.html','Activities']]},
 {id:'network',label:'Network',href:'network.html',sub:[
   ['about-regional-hubs.html','Regional Coordination'],
   ['network-partners.html','Partners'],
   ['network-diaspora.html','Diaspora Network'],
   ['network-institutions.html','Partner Institutions']]},
 {id:'knowledge',label:'Knowledge &amp; News',href:'knowledge-hub.html',cols2:true,sub:[
   ['kh-journal.html','GPS Journal'],
   ['kh-outlook.html','GPS Outlook'],
   ['kh-library.html','Publications'],
   ['news.html','Updates'],
   ['events.html','Events'],
   ['events-calendar.html','Calendar']]},
 {id:'involved',label:'Get Involved',href:'get-involved.html',sub:[
   ['get-involved.html#partner','Partner with GPS'],
   ['get-involved.html#join','Join GPS'],
   ['get-involved.html#collaborate','Collaborate'],
   ['get-involved.html#contribute','Contribute Knowledge'],
   ['get-involved.html#support','Support an Initiative'],
   ['get-involved-opportunities.html','Opportunities'],
   ['contact.html','Contact Us']]}
];
function navHtml(active){
  let items = NAV.map(n=>{
    const a = '<a href="'+n.href+'"'+(n.id===active?' class="active"':'')+'>'+n.label+'</a>';
    const btn = '<button class="sub-toggle" aria-expanded="false" aria-label="Open '+n.label.replace(/&amp;/g,'and')+' menu"><span class="car" aria-hidden="true"></span></button>';
    const sub = '<div class="sub'+(n.cols2?' cols2':'')+'"><a class="head" href="'+n.href+'">'+n.label+'</a><hr>'+n.sub.map(s=>'<a href="'+s[0]+'">'+s[1]+'</a>').join('')+'</div>';
    return '<li>'+a+btn+sub+'</li>';
  }).join('');
  return '<header id="header"><div class="hd-in">'+
    '<a class="brand" href="index.html"><span class="dot"></span><span class="bwrap">GPS<small>Global Platform for the South</small></span></a>'+
    '<button id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span></button>'+
    '<nav class="main" aria-label="Primary"><ul>'+items+SEARCH_M+
    '<li><a class="donate-btn m-donate" href="donate.html">Donate</a></li></ul></nav>'+SEARCH_D+
    '<a class="donate-btn hd-donate" href="donate.html">Donate</a>'+
    '</div></header>';
}
const FOOTER = '<footer class="site"><div class="ft-in"><div class="ft-grid">'+
'<div class="ft-brand"><a class="brand" href="index.html"><span class="dot"></span><span class="bwrap">GPS<small style="color:var(--ink-inv-faint)">Global Platform for the South</small></span></a><p>Connecting knowledge, technology and innovation, policy, and enterprise into measurable impact across the Global South. Headquartered in Kigali, Rwanda.</p><div class="ft-cta"><a class="donate-btn" href="donate.html">Donate</a><a class="btn btn-ghost btn-sm" href="get-involved.html#partner">Partner with GPS</a></div></div>'+
'<div><h5>About</h5><ul><li><a href="about-why-gps.html">Why GPS?</a></li><li><a href="about-mission-vision.html">Mission &amp; Vision</a></li><li><a href="about-our-approach.html">Our Approach</a></li><li><a href="people.html">People &amp; Governance</a></li><li><a href="impact.html">Impact</a></li><li><a href="roadmap.html">Roadmap</a></li></ul></div>'+
'<div><h5>Our Work</h5><ul><li><a href="work-knowledge.html">Knowledge Co-Creation</a></li><li><a href="work-innovation.html">Technology &amp; Innovation</a></li><li><a href="work-policy.html">Policy, Governance &amp; Public Leadership</a></li><li><a href="work-enterprise.html">Enterprise &amp; Sustainable Development</a></li><li><a href="initiatives.html">Activities</a></li></ul></div>'+
'<div><h5>Knowledge &amp; News</h5><ul><li><a href="kh-journal.html">GPS Journal</a></li><li><a href="kh-outlook.html">GPS Outlook</a></li><li><a href="kh-library.html">Publications</a></li><li><a href="news.html">Updates</a></li><li><a href="events.html">Events</a></li><li><a href="events-calendar.html">Calendar</a></li></ul></div>'+
'<div><h5>Network</h5><ul><li><a href="about-regional-hubs.html">Regional Coordination</a></li><li><a href="network-partners.html">Partners</a></li><li><a href="network-diaspora.html">Diaspora Network</a></li><li><a href="network-institutions.html">Partner Institutions</a></li></ul></div>'+
'<div><h5>Get Involved</h5><ul><li><a href="get-involved.html#partner">Partner with GPS</a></li><li><a href="get-involved.html#join">Join GPS</a></li><li><a href="get-involved.html#collaborate">Collaborate</a></li><li><a href="get-involved.html#contribute">Contribute Knowledge</a></li><li><a href="get-involved-opportunities.html">Opportunities</a></li><li><a href="donate.html">Donate</a></li><li><a href="contact.html">Contact Us</a></li><li><a href="search.html">Search the site</a></li><li><a href="mailto:info@gpsouth.org">info@gpsouth.org</a></li></ul></div>'+
'</div><div class="ft-legal"><span>© <span data-year>2026</span> Global Platform for the South · Headquartered in Kigali, Rwanda</span><span>Knowledge · Policy · Impact</span></div></div></footer>';
const SEARCH_D = '<form class="hd-search" role="search" action="search.html" method="get"><label for="q-d" class="vh">Search this site</label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input id="q-d" type="search" name="q" placeholder="Search" autocomplete="off"></form>';
const SEARCH_M = '<li class="m-search"><form class="hd-search" role="search" action="search.html" method="get"><label for="q-m" class="vh">Search this site</label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input id="q-m" type="search" name="q" placeholder="Search the site" autocomplete="off"></form></li>';
const THUMB = '<template id="__bundler_thumbnail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#07060f"/><circle cx="50" cy="50" r="20" fill="none" stroke="#00d6a4" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="#a3e635"/></svg></template>';
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Newsreader:ital,opsz,wght@1,6..72,300;1,6..72,400;1,6..72,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">';
const D3 = '<script src="https://unpkg.com/d3@7.9.0/dist/d3.min.js" integrity="sha384-CjloA8y00+1SDAUkjs099PVfnY2KmDC2BZnws9kh8D/lX1s46w6EPhpXdqMfjK6i" crossorigin="anonymous"><\/script><script src="https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js" integrity="sha384-Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67" crossorigin="anonymous"><\/script>';
const GATE = '<script>document.documentElement.classList.add("js")<\/script>';
const CRIT = '<style id="gps-critical">.hero-top{position:relative}.hero-map{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}.hero-map svg{width:100%;height:100%;display:block}.hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none}.hero-top>.inner{position:relative;z-index:2}.hf-frame{position:relative;overflow:hidden}.hf-video{width:100%;height:100%;display:block;object-fit:contain;background:#07060f}</style>';
async function run(V, io){
  const {readFile, saveFile, ls, log} = io;
  const eco = await readFile('src/ecosystem.frag.html');
  let SEARCH_IDX='[]';
  try{ SEARCH_IDX = await readFile('src/search-index.json'); }catch(e){ log('no search index'); }
  const files = await ls('src/pages');
  let n = 0;
  for(const f of files){
    const raw = await readFile('src/pages/'+f);
    const m = raw.match(/^<!--meta\s+([\s\S]*?)\s*-->/);
    if(!m){ log('NO META: '+f); continue; }
    let meta; try{ meta = JSON.parse(m[1]); }catch(e){ log('BAD META '+f+': '+e.message); continue; }
    const body = raw.slice(m[0].length).split('<!--@eco-->').join(eco).split('<!--@searchindex-->').join(SEARCH_IDX);
    const title = meta.home ? 'GPS — The Global South, Connected' : 'GPS — '+meta.title;
    const q = '?v='+V;
    const head = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+GATE+'\n'+CRIT+'\n<title>'+title+'</title>\n<meta name="description" content="'+meta.desc.replace(/"/g,'&quot;')+'">\n'+FONTS+
      '\n<link rel="stylesheet" href="assets/site.css'+q+'"><link rel="stylesheet" href="assets/ui.css'+q+'"><link rel="stylesheet" href="assets/theme.css'+q+'">\n'+(meta.map?D3+'\n':'')+'</head>\n<body>\n<a class="skip-link" href="#main">Skip to content</a>\n';
    let hero = '';
    if(!meta.noHero){
      const crumbs=(meta.crumb||[]).map((c,i,arr)=> c[1] ? '<a href="'+c[1]+'">'+c[0]+'</a>'+(i<arr.length-1?'<span class="sep">/</span>':'') : '<span>'+c[0]+'</span>').join('');
      hero='<header class="page-hero"><div class="inner">'+(crumbs?'<div class="crumbs">'+crumbs+'</div>':'')+
        '<div class="eyebrow reveal"><span class="bar"></span> '+meta.eyebrow+'</div><h1 class="reveal d1">'+meta.h1+'</h1>'+
        (meta.lede?'<p class="lede reveal d2">'+meta.lede+'</p>':'')+'</div></header>';
    }
    const subnav = meta.subnav ? '<div class="subnav"><ul>'+meta.subnav.map(s=>'<li><a href="'+s[0]+'">'+s[1]+'</a></li>').join('')+'</ul></div>' : '';
    const label = (meta.home ? 'Home' : meta.title).replace(/"/g,'&quot;');
    await saveFile(f, head + navHtml(meta.nav) + '<main id="main" data-screen-label="'+label+'">\n' + hero + subnav + body +
      '\n</main>\n' + FOOTER + '\n<script src="assets/site.js'+q+'" defer><\/script>\n' + (meta.map?'<script src="assets/map.js'+q+'" defer><\/script>\n':'') + THUMB + '\n</body>\n</html>');
    n++;
  }
  log('built '+n+' pages at '+V);
  return n;
}
return {run, NAV};
})();
