const fs = require('fs');
const path = require('path');

function card({ init, cv1, cv2, name, role, geo, bio, attrs = '', delay = '', img = '' }) {
  const photo = img
    ? '<img src="' + img + '" alt="' + name.replace(/"/g, '') + '" width="600" height="800" loading="lazy">'
    : '';
  return (
    '<article class="person reveal' + delay + '"' + (attrs ? ' ' + attrs : '') +
    ' aria-label="' + name.replace(/"/g, '') + ', ' + role.replace(/&amp;/g, 'and') + '">' +
    '<div class="person-inner">' +
    '<div class="person-face person-front">' +
    '<div class="person-photo" style="--cv1:' + cv1 + ';--cv2:' + cv2 + '">' + photo + '<span class="init">' + init + '</span></div>' +
    '<div class="person-caption"><h3>' + name + '</h3><span class="role">' + role + '</span></div>' +
    '</div>' +
    '<div class="person-face person-back">' +
    '<h3>' + name + '</h3><span class="role">' + role + '</span>' +
    (geo ? '<span class="geo">' + geo + '</span>' : '') +
    '<p class="bio">' + bio + '</p>' +
    '<button type="button" class="person-btn" data-person-open>See details</button>' +
    '</div></div></article>'
  );
}

const people = `<!--meta {"title":"People","desc":"The people of GPS — Board of Directors, Executive Leadership, International Advisory Board, Regional Leadership, Distinguished Contributors, and Young Leaders.","nav":"people","crumb":[["Home","/"],["About","/about"],["People & Governance"]],"eyebrow":"About · People & Governance","h1":"The people behind <span class='grad-ink'>the platform.</span>","lede":"GPS is powered by people, institutions, and ideas in motion. Founding appointments are announced progressively through 2026 — every seat below is structured, and filling.","subnav":[["#board","Board"],["#executive","Executive"],["#advisory","Advisory Board"],["#regional","Regional"],["#experts-link","Experts & Fellows"],["#contributors","Contributors"],["#young-leaders","Young Leaders"]]}-->
<section id="board" style="padding-top:30px">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Governance</div><h2 class="sec-h reveal">Board of Directors</h2><p class="sub reveal d1">Institutional oversight, fiduciary responsibility, and long-term strategic direction.</p></div><div class="more reveal"><a class="btn btn-ink" href="/about-governance">How governance works <span class="arrow">→</span></a></div></div>
<div class="people-grid">
${card({ init: '01', cv1: '#0B3D2E', cv2: '#09190B', name: 'Board Member', role: 'Board of Directors', geo: 'Announcement forthcoming', bio: 'Founding appointment — to be announced in 2026.' })}
${card({ init: '02', cv1: '#1A5C3A', cv2: '#0B3D2E', name: 'Board Member', role: 'Board of Directors', geo: 'Announcement forthcoming', bio: 'Founding appointment — to be announced in 2026.', delay: ' d1' })}
${card({ init: '03', cv1: '#2F6B3C', cv2: '#144028', name: 'Board Member', role: 'Board of Directors', geo: 'Announcement forthcoming', bio: 'Founding appointment — to be announced in 2026.', delay: ' d2' })}
${card({ init: '04', cv1: '#3D6B2E', cv2: '#1A4020', name: 'Board Member', role: 'Board of Directors', geo: 'Announcement forthcoming', bio: 'Founding appointment — to be announced in 2026.', delay: ' d3' })}
</div>
</div>
</section>
<section id="executive" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Management</div><h2 class="sec-h reveal">Executive Leadership</h2><p class="sub reveal d1">The Operational Team — day-to-day management, programs, partnerships, communications, and sustainability.</p></div></div>
<div class="people-grid">
${card({ init: '01', cv1: '#5C4A1A', cv2: '#2A220E', name: 'Team Member', role: 'Executive Leadership', geo: 'Kigali HQ', bio: 'Founding appointment — to be announced in 2026.' })}
${card({ init: '02', cv1: '#6B5218', cv2: '#3A2E0C', name: 'Team Member', role: 'Executive Leadership', geo: 'Kigali HQ', bio: 'Founding appointment — to be announced in 2026.', delay: ' d1' })}
${card({ init: '03', cv1: '#4A3A12', cv2: '#1E1808', name: 'Team Member', role: 'Executive Leadership', geo: 'Kigali HQ', bio: 'Founding appointment — to be announced in 2026.', delay: ' d2' })}
${card({ init: '04', cv1: '#7A5E20', cv2: '#3D2F10', name: 'Team Member', role: 'Executive Leadership', geo: 'Kigali HQ', bio: 'Founding appointment — to be announced in 2026.', delay: ' d3' })}
</div>
<p class="reveal" style="margin-top:18px;font-size:13px;color:var(--ink-faint)">Division Chiefs for the six core domains are appointed as domains activate — see <a href="/about-governance">Governance</a>.</p>
</div>
</section>
<section id="advisory">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Counsel</div><h2 class="sec-h reveal">International Advisory Board</h2><p class="sub reveal d1">A distinguished body being convened across the Global South and beyond — invitations are underway; members are announced as they accept.</p></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">Composition</span><h3>University &amp; academic leadership</h3><p>Presidents and secretaries-general of regional university associations across Africa, Latin America &amp; the Caribbean, Asia-Pacific, and the Arab world — and leading rectors and scholars.</p></div>
<div class="card reveal d1"><span class="kick">Composition</span><h3>Former ministers, diplomats &amp; public leaders</h3><p>Senior figures from foreign affairs, economy, and education portfolios — with deep South–South cooperation experience.</p></div>
<div class="card reveal d2"><span class="kick">Composition</span><h3>Entrepreneurs, philanthropists &amp; cultural figures</h3><p>Prominent builders and public voices who extend the platform's reach across business, philanthropy, sport, and culture.</p></div>
</div>
<div class="note reveal" style="margin-top:22px"><span>⟡</span><p><b>Announced progressively.</b> The founding IAB cohort is confirmed member by member through 2026–27. Profiles, photographs, and countries will appear here as each appointment is public.</p></div>
</div>
</section>
<section id="regional" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> The hubs</div><h2 class="sec-h reveal">Regional Leadership</h2><p class="sub reveal d1">Each hub is led by a Regional Coordinator — strategy, partnerships, programming, and institutional development in their region.</p></div><div class="more reveal"><a class="btn btn-ink" href="/about-regional-hubs">Hubs on the map <span class="arrow">→</span></a></div></div>
<div class="people-grid">
${card({ init: 'Ki', cv1: '#0E4A32', cv2: '#09190B', name: 'Kigali Headquarters', role: 'Head of Headquarters', geo: 'Rwanda · East Africa', bio: 'Institutional home, global strategy, and coordination across all hubs.' })}
${card({ init: 'Ad', cv1: '#1B5C40', cv2: '#0B2A1C', name: 'Addis Ababa Hub', role: 'Regional Coordinator', geo: 'Ethiopia · East &amp; Horn of Africa', bio: 'Continental institutions and the African Union ecosystem.', delay: ' d1' })}
${card({ init: 'Da', cv1: '#245C38', cv2: '#102818', name: 'Dakar Hub', role: 'Regional Coordinator', geo: 'Senegal · Francophone West Africa', bio: 'Research, culture, and Atlantic partnerships.', delay: ' d2' })}
${card({ init: 'Ac', cv1: '#2E6B3A', cv2: '#143020', name: 'Accra Hub', role: 'Regional Coordinator', geo: 'Ghana · Anglophone West Africa', bio: 'Enterprise, innovation ecosystems, and diaspora engagement.' })}
${card({ init: 'SP', cv1: '#8B5A18', cv2: '#3D280C', name: 'São Paulo Hub', role: 'Regional Coordinator', geo: 'Brazil · Latin America', bio: 'GCUB cooperation and the 2028 Convening.', delay: ' d1' })}
${card({ init: 'Ma', cv1: '#4A6B8B', cv2: '#1A2838', name: 'Martinique Hub', role: 'Regional Coordinator', geo: 'The Caribbean', bio: 'Island universities, cultural production, and climate resilience.', delay: ' d2' })}
</div>
</div>
</section>
<section id="experts-link" class="night">
<div class="aurora" aria-hidden="true"></div>
<div class="inner split">
<div><div class="eyebrow reveal"><span class="bar"></span> The wider bench</div><h2 class="sec-h reveal">Experts &amp; Fellows</h2><p class="reveal d1" style="color:var(--ink-inv-soft);max-width:56ch">Researchers, specialists, and fellows across the four pillars and every region — in a searchable, filterable directory that scales as the network grows.</p><div class="reveal d2" style="margin-top:24px"><a class="btn btn-grad" href="/people-experts">Open the directory <span class="arrow">→</span></a></div></div>
<div class="reveal d1"><div class="card dark"><span class="kick" style="color:var(--c2)">Directory filters</span><div class="tags" style="margin-top:10px"><span class="tag">Pillar</span><span class="tag">Region</span><span class="tag">Free-text search</span></div><p style="font-size:13px;margin-top:12px">Fellowship cohorts join from 2027 — <a href="/get-involved-opportunities#fellowships" style="color:var(--c2)">apply here</a>.</p></div></div>
</div>
</section>
<section id="contributors">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Voices</div><h2 class="sec-h reveal">Distinguished Contributors</h2><p class="sub reveal d1">Writers, thinkers, public figures, and innovators who contribute to GPS platforms — GPS Outlook, SouthPlus, dialogues, and convenings.</p></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">Editorial</span><h3>Writers &amp; essayists</h3><p>Contributing to GPS Outlook and SouthPlus — the South narrating itself. First contributor profiles appear with the 2027 launch issues.</p></div>
<div class="card reveal d1"><span class="kick">Public thought</span><h3>Thinkers &amp; public figures</h3><p>Keynotes, dialogues, and multimedia conversations across the convening calendar.</p></div>
<div class="card reveal d2"><span class="kick">Practice</span><h3>Innovators &amp; artists</h3><p>Creative production, exhibitions, and cultural programming — memory and imagination as infrastructure.</p></div>
</div>
</div>
</section>
<section id="young-leaders" class="wash">
<div class="inner">
<div class="sec-head"><div><div class="eyebrow reveal"><span class="bar"></span> Next generation</div><h2 class="sec-h reveal">Young Leaders</h2><p class="sub reveal d1">Emerging leaders across the network. Individual profiles arrive with the first cohort in 2027 — the pathway is open now.</p></div><div class="more reveal"><a class="btn btn-ink" href="/initiative-youth-leadership">Youth &amp; Leadership initiative <span class="arrow">→</span></a></div></div>
<div class="grid-3">
<div class="card reveal"><span class="kick">The cohort</span><h3>Selected across the network</h3><p>An annual cohort of students, early-career researchers, founders, and organizers, nominated by hub and university partners across all six regions.</p></div>
<div class="card reveal d1"><span class="kick">What they get</span><h3>Responsibility, not observation</h3><p>Mentorship from senior figures and the diaspora, a platform at the convenings, and real roles inside GPS programs.</p></div>
<div class="card reveal d2"><span class="kick">Nominations open</span><h3>This could be you</h3><p>The first cohort is named in 2027.</p><div class="foot"><a class="btn btn-ink btn-sm" href="/get-involved#join">Join the network <span class="arrow">→</span></a></div></div>
</div>
</div>
</section>
`;

const experts = [
  { init: 'SF', cv1: '#0B3D2E', cv2: '#09190B', name: 'Senior Fellow', role: 'Epistemologies of the South', geo: 'East Africa · Kigali hub', bio: 'Plural knowledge systems and curriculum reform. Profile forthcoming.', attrs: 'data-item data-pillar="knowledge" data-region="africa"' },
  { init: 'RF', cv1: '#1A5C3A', cv2: '#0B3D2E', name: 'Innovation Fellow', role: 'AI &amp; education', geo: 'West Africa · Accra hub', bio: 'Learning technologies for low-connectivity contexts. Profile forthcoming.', attrs: 'data-item data-pillar="innovation" data-region="africa"', delay: ' d1' },
  { init: 'PS', cv1: '#8B5A18', cv2: '#3D280C', name: 'Policy Fellow', role: 'Research–policy interfaces', geo: 'Latin America · São Paulo hub', bio: 'Evidence uptake in ministries of education. Profile forthcoming.', attrs: 'data-item data-pillar="policy" data-region="latam"', delay: ' d2' },
  { init: 'EA', cv1: '#5C4A1A', cv2: '#2A220E', name: 'Enterprise Advisor', role: 'Development finance', geo: 'East Africa · Addis hub', bio: 'Blended finance for research commercialization. Profile forthcoming.', attrs: 'data-item data-pillar="enterprise" data-region="africa"', delay: ' d3' },
  { init: 'RF', cv1: '#4A6B8B', cv2: '#1A2838', name: 'Artist Fellow', role: 'Memory &amp; archives', geo: 'Caribbean · Martinique hub', bio: 'Historical memory and cultural production. Profile forthcoming.', attrs: 'data-item data-pillar="knowledge" data-region="caribbean"' },
  { init: 'TS', cv1: '#2F6B3C', cv2: '#144028', name: 'Technology Specialist', role: 'Smart agriculture', geo: 'South Asia · partner network', bio: 'Climate-resilient food systems technology. Profile forthcoming.', attrs: 'data-item data-pillar="innovation" data-region="asia"', delay: ' d1' },
  { init: 'PA', cv1: '#6B5218', cv2: '#3A2E0C', name: 'Practitioner Fellow', role: 'Digital governance', geo: 'MENA · partner network', bio: 'AI governance frameworks for the region. Profile forthcoming.', attrs: 'data-item data-pillar="policy" data-region="mena"', delay: ' d2' },
  { init: 'VS', cv1: '#3D6B2E', cv2: '#1A4020', name: 'Visiting Scholar', role: 'Diaspora knowledge networks', geo: 'Diaspora · North America', bio: 'Transnational mentorship models. Profile forthcoming.', attrs: 'data-item data-pillar="knowledge" data-region="diaspora"', delay: ' d3' },
  { init: 'IL', cv1: '#0E4A32', cv2: '#09190B', name: 'Innovation Lead', role: 'Health innovation', geo: 'Latin America · São Paulo hub', bio: 'Community health technology pilots. Profile forthcoming.', attrs: 'data-item data-pillar="innovation" data-region="latam"' },
  { init: 'EF', cv1: '#245C38', cv2: '#102818', name: 'Enterprise Fellow', role: 'Creative industries', geo: 'Caribbean · Martinique hub', bio: 'Creative-economy ventures and export. Profile forthcoming.', attrs: 'data-item data-pillar="enterprise" data-region="caribbean"', delay: ' d1' },
  { init: 'SA', cv1: '#1B5C40', cv2: '#0B2A1C', name: 'Senior Advisor', role: 'Climate &amp; energy policy', geo: 'West Africa · Dakar hub', bio: 'Energy transition policy for coastal states. Profile forthcoming.', attrs: 'data-item data-pillar="policy" data-region="africa"', delay: ' d2' },
  { init: 'EE', cv1: '#7A5E20', cv2: '#3D2F10', name: 'Executive Educator', role: 'Executive education', geo: 'Southeast Asia · partner network', bio: 'Leadership programs for growth enterprises. Profile forthcoming.', attrs: 'data-item data-pillar="enterprise" data-region="asia"', delay: ' d3' },
];

const expertsPage = `<!--meta {"title":"Experts & Fellows","desc":"Searchable directory of GPS researchers, specialists, and fellows — filter by pillar and region.","nav":"people","crumb":[["Home","/"],["About","/about"],["People & Governance","/people"],["Experts & Fellows"]],"eyebrow":"About · Experts & Fellows","h1":"Experts &amp; <span class='grad-ink'>Fellows</span>","lede":"Researchers, specialists, and fellows across the four pillars and every region. The directory UI is live now; profiles populate as cohorts join from 2027."}-->
<section style="padding-top:26px">
<div class="inner" data-filter-scope>
<div class="filterbar reveal">
<label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" placeholder="Search expertise, e.g. climate, AI, food systems…" data-f-search aria-label="Search experts"></label>
<div class="chipset" role="group" aria-label="Filter by pillar"><button class="fchip on" data-f-key="pillar" data-f-val="all">All pillars</button><button class="fchip" data-f-key="pillar" data-f-val="knowledge">Knowledge</button><button class="fchip" data-f-key="pillar" data-f-val="innovation">Innovation</button><button class="fchip" data-f-key="pillar" data-f-val="enterprise">Enterprise</button><button class="fchip" data-f-key="pillar" data-f-val="policy">Policy</button></div>
<div class="chipset" role="group" aria-label="Filter by region"><button class="fchip on" data-f-key="region" data-f-val="all">All regions</button><button class="fchip" data-f-key="region" data-f-val="africa">Africa</button><button class="fchip" data-f-key="region" data-f-val="latam">Latin America</button><button class="fchip" data-f-key="region" data-f-val="caribbean">Caribbean</button><button class="fchip" data-f-key="region" data-f-val="asia">Asia</button><button class="fchip" data-f-key="region" data-f-val="mena">MENA</button><button class="fchip" data-f-key="region" data-f-val="diaspora">Diaspora</button></div>
<span class="fcount" data-f-count></span>
</div>
<div class="people-grid" data-filter-list>
${experts.map((e) => card(e)).join('\n')}
<div class="empty-msg">No profiles match those filters yet — the bench is still being built. Try widening your search.</div>
</div>
<div class="note reveal" style="margin-top:26px"><span>⟡</span><p><b>A scalable directory.</b> Cards shown are structured placeholders for the founding cohort; each becomes a full profile (photo, biography, publications) as fellows are confirmed. Want in? <a href="/get-involved-opportunities#fellowships">Fellowship opportunities</a>.</p></div>
</div>
</section>
`;

fs.writeFileSync(path.join('src/pages/people.html'), people);
fs.writeFileSync(path.join('src/pages/people-experts.html'), expertsPage);
console.log('wrote flip-card pages');
