/**
 * Harvest site content into src/search-index.json + assets/search-index.json.
 * No extra deps — regex/light HTML parsing to match the rest of the build.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');
const SKIP_PAGES = new Set(['404.html', 'search.html', 'network-institutions.html', 'hero-a.html', 'hero-b.html', 'hero-c.html']);

const KIND_LABEL = {
  page: 'Pages',
  publication: 'Publications',
  news: 'News',
  partner: 'Partners',
  opportunity: 'Opportunities',
  event: 'Events',
  person: 'People',
  hub: 'Hubs',
};

function decode(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(s) {
  return decode(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function pageUrl(file) {
  if (file === 'index.html') return '/';
  return '/' + file.replace(/\.html$/, '');
}

function rec(t, u, s, d, k, kw) {
  const title = decode(t);
  if (!title) return null;
  return {
    t: title,
    u: u,
    s: decode(s) || KIND_LABEL[k] || 'GPS',
    d: decode(d).slice(0, 280),
    k: k,
    kw: decode(kw || ''),
  };
}

function first(html, re) {
  const m = html.match(re);
  return m ? m[1] : '';
}

function harvestPages(records, seen) {
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html') && !SKIP_PAGES.has(f));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    const m = raw.match(/^<!--meta\s+([\s\S]*?)\s*-->/);
    if (!m) continue;
    let meta;
    try {
      meta = JSON.parse(m[1]);
    } catch (e) {
      continue;
    }
    const u = pageUrl(f);
    const title = meta.home ? 'The Global South, Connected' : meta.title;
    const section = (meta.eyebrow || meta.nav || 'GPS').replace(/·/g, '·');
    const r = rec(title, u, section, meta.desc || '', 'page', meta.nav || '');
    if (r && !seen.has(u + '|' + r.t)) {
      seen.add(u + '|' + r.t);
      records.push(r);
    }
  }
}

function harvestDataItems(records, seen, file, parentUrl, kind, section) {
  const p = path.join(pagesDir, file);
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf8');
  const blocks = html.split(/(?=<div\b[^>]*\bdata-item\b)/i).slice(1);
  for (const block of blocks) {
    const chunk = block.slice(0, 2500);
    const title =
      first(chunk, /<h3[^>]*>([\s\S]*?)<\/h3>/i) ||
      first(chunk, /class="logo"[^>]*>[\s\S]*?<\/span>([\s\S]*?)<\/div>/i) ||
      first(chunk, /<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const desc =
      first(chunk, /<p[^>]*>([\s\S]*?)<\/p>/i) ||
      first(chunk, /class="meta"[^>]*>([\s\S]*?)<\/div>/i) ||
      '';
    const type = first(chunk, /data-type="([^"]+)"/i) || first(chunk, /data-cat="([^"]+)"/i) || '';
    const href = first(chunk, /href="(\/[^"#]+(?:#[^"]*)?)"/i);
    const slug = slugify(title);
    const u = href && href.indexOf(parentUrl) === 0 ? href : parentUrl + (slug ? '#' + slug : '');
    const r = rec(title, u, section, desc, kind, type);
    if (r && !seen.has(kind + '|' + r.t)) {
      seen.add(kind + '|' + r.t);
      records.push(r);
    }
  }
}

function harvestPartnerProfiles(records, seen) {
  const p = path.join(pagesDir, 'network-partners.html');
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf8');
  const arts = html.split(/(?=<article\b[^>]*\bpp\b)/i).slice(1);
  for (const art of arts) {
    const chunk = art.slice(0, 4000);
    const id = first(chunk, /\bid="([^"]+)"/i);
    const title = first(chunk, /<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const meta = first(chunk, /class="pp-meta"[^>]*>([\s\S]*?)<\/p>/i);
    const blurb = first(chunk, /<p>([\s\S]*?)<\/p>/i);
    const u = '/network-partners' + (id ? '#' + id : '');
    const r = rec(title, u, 'Partners · Private sector', blurb || meta, 'partner', meta);
    if (r && !seen.has('partner|' + r.t)) {
      seen.add('partner|' + r.t);
      records.push(r);
    }
  }
}

function harvestPeople(records, seen, file, parentUrl) {
  const p = path.join(pagesDir, file);
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf8');
  const parts = html.split(/(?=<article\b[^>]*\bperson\b)/i).slice(1);
  for (const part of parts) {
    const chunk = part.slice(0, 2000);
    const name =
      first(chunk, /class="person-caption"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/i) ||
      first(chunk, /<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const role = first(chunk, /class="role"[^>]*>([\s\S]*?)<\/span>/i);
    const bio = first(chunk, /class="bio"[^>]*>([\s\S]*?)<\/p>/i);
    const geo = first(chunk, /class="geo"[^>]*>([\s\S]*?)<\/span>/i);
    const slug = slugify(name + '-' + role);
    const r = rec(name, parentUrl + (slug ? '#' + slug : ''), role || 'People', bio || geo, 'person', geo);
    if (r && !seen.has('person|' + r.t + '|' + role)) {
      seen.add('person|' + r.t + '|' + role);
      records.push(r);
    }
  }
}

function harvestCalendar(records, seen) {
  const p = path.join(pagesDir, 'events-calendar.html');
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf8');
  const m = html.match(/id="gps-events"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return;
  let events;
  try {
    events = JSON.parse(m[1]);
  } catch (e) {
    return;
  }
  events.forEach(function (ev) {
    const u = ev.href || '/events-calendar';
    const r = rec(ev.title, u, 'Events · Calendar', ev.date || '', 'event', ev.date || '');
    if (r && !seen.has('event|' + r.t)) {
      seen.add('event|' + r.t);
      records.push(r);
    }
  });
}

function harvestHubs(records, seen) {
  const p = path.join(root, 'assets', 'map.js');
  if (!fs.existsSync(p)) return;
  const js = fs.readFileSync(p, 'utf8');
  const m = js.match(/window\.GPS_HUBS\s*=\s*(\[[\s\S]*?\]);/);
  if (!m) return;
  let hubs;
  try {
    // eslint-disable-next-line no-new-func
    hubs = Function('return (' + m[1] + ')')();
  } catch (e) {
    return;
  }
  hubs.forEach(function (h) {
    const title = h.name + (h.role ? ' — ' + h.role : '');
    const d = [h.country, h.region, h.blurb].filter(Boolean).join(' · ');
    const r = rec(title, '/about-regional-hubs#' + (h.id || slugify(h.name)), 'Network · Hubs', d, 'hub', h.status || '');
    if (r && !seen.has('hub|' + h.id)) {
      seen.add('hub|' + h.id);
      records.push(r);
    }
  });
}

function harvestOpportunitiesLinks(records, seen) {
  const p = path.join(pagesDir, 'get-involved-opportunities.html');
  if (!fs.existsSync(p)) return;
  const html = fs.readFileSync(p, 'utf8');
  const blocks = html.split(/(?=<div\b[^>]*\bdata-item\b)/i).slice(1);
  for (const block of blocks) {
    const chunk = block.slice(0, 2000);
    const title = first(chunk, /<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const meta = first(chunk, /class="meta"[^>]*>([\s\S]*?)<\/div>/i);
    const type = first(chunk, /data-type="([^"]+)"/i);
    const href = first(chunk, /href="([^"]+)"/i) || '/get-involved-opportunities';
    const r = rec(title, href.startsWith('/') ? href : '/get-involved-opportunities', 'Opportunities', meta, 'opportunity', type);
    if (r && !seen.has('opportunity|' + r.t)) {
      seen.add('opportunity|' + r.t);
      records.push(r);
    }
  }
}

function main() {
  const records = [];
  const seen = new Set();

  harvestPages(records, seen);
  harvestDataItems(records, seen, 'kh-library.html', '/kh-library', 'publication', 'Publications');
  harvestDataItems(records, seen, 'news.html', '/news', 'news', 'News');
  harvestDataItems(records, seen, 'network-partners.html', '/network-partners', 'partner', 'Partners');
  harvestPartnerProfiles(records, seen);
  harvestOpportunitiesLinks(records, seen);
  harvestCalendar(records, seen);
  harvestDataItems(records, seen, 'events.html', '/events', 'event', 'Events');
  harvestPeople(records, seen, 'people.html', '/people');
  harvestPeople(records, seen, 'people-experts.html', '/people-experts');
  harvestHubs(records, seen);

  records.sort(function (a, b) {
    if (a.k !== b.k) return a.k < b.k ? -1 : 1;
    return a.t.localeCompare(b.t);
  });

  const json = JSON.stringify(records);
  const pretty = JSON.stringify(records, null, 0);
  fs.writeFileSync(path.join(root, 'src', 'search-index.json'), pretty, 'utf8');
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets', 'search-index.json'), pretty, 'utf8');
  console.log('search index:', records.length, 'records');
  const byKind = {};
  records.forEach(function (r) {
    byKind[r.k] = (byKind[r.k] || 0) + 1;
  });
  console.log(byKind);
  return records.length;
}

if (require.main === module) {
  main();
}

module.exports = { main, KIND_LABEL };
