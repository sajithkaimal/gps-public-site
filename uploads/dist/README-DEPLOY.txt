GPS — gpsouth.org · deploy build
Build 20260809a · generated 2026-07-27

UPLOAD
  Upload the CONTENTS of this folder into public_html/ on Hostinger
  (index.html must sit directly in public_html/, not in a subfolder).
  Overwrite the existing files, INCLUDING .htaccess.

AFTER UPLOADING — DO THIS ONCE
  hPanel > Advanced > Cache Manager > "Purge All"
  Then hard-reload the site once (Ctrl/Cmd + Shift + R).

WHY THE HOMEPAGE BROKE BEFORE
  The previous .htaccess cached CSS/JS for 1 year but HTML for only 1 hour.
  After an hour browsers fetched the new HTML but kept the year-old
  stylesheet, so new markup was styled by an old CSS file — the hero map
  escaped its container and the video/legend lost their layout.

  Fixed two ways:
   1. Every CSS/JS/image URL now carries ?v=20260809a. Any future change to a
      file changes its URL, so a stale cache can never be used.
   2. HTML is now served no-cache; only version-stamped assets cache long.
   3. A small inline <style> in each page pins the hero's containment, so
      even a failed or stale stylesheet cannot blow up the layout again.

  When you next change a CSS or JS file, bump the ?v= value in the pages
  (or ask for a rebuild) so visitors pick it up immediately.

CONTENTS
  48 .html pages (static, no build step, no server code)
  assets/  site.css, ui.css, theme.css, site.js, map.js,
           hero.webm, hero-poster.png
  .htaccess  compression, cache policy, webm MIME type

NOTES
  - The world maps load d3 + Natural Earth data from a CDN at runtime.
    They need outbound internet; pages degrade gracefully without it.
  - hero.webm is 11.1 MB. Compressing it to 2-3 MB is recommended before
    heavy traffic. Replace assets/hero.webm in place, then bump ?v=.
  - Contact forms show a confirmation but do not send email yet.

CHANGES IN THIS BUILD (20260809a)
  - Removed repeated placeholder cards within single sections.
  - Universities now lists the eight real regional university associations
    named in the founding documents (GCUB, AAU, UDUALC, AUAP, AArU, AUA,
    Universities Caribbean, CCU) with honest engagement status.
  - International Organizations now names the actual frameworks cited in
    the founding docs (UN/SDGs, African Union ecosystem, CELAC & CARICOM,
    ASEAN & Arab regional bodies).
  - Private Sector and Civil Society cards given distinct titles.
  - Regional Leadership cards now lead with the hub name.
  - Young Leaders: three identical placeholder people replaced with the
    real pathway (cohort, what they get, nominations).
  - Advisory Board individual names are deliberately NOT published: the
    source document marks them "to be contacted" / "under discussion".

CHANGES IN THIS BUILD (20260809a)
  - Added a planned "Caribbean" hub (yellow) to the maps, in the northern
    Caribbean, alongside Middle East and South & SE Asia.
  - Matching planned card added to Regional Hubs; Network page note updated.
  - Hero map labels now avoid each other automatically (side and vertical
    alternatives are tried before a label is placed).

CHANGES IN THIS BUILD (20260809a)
  - Homepage network section enriched: the map now also plots 24 partner
    and dialogue cities in gold (was hubs only), with a colour key.
  - Seven flat name chips replaced by six real hub cards (colour-coded,
    with region and role) linking into Regional Hubs.
  - Added a stats strip (6 hubs / 3 planned / 8 associations / 24 cities)
    and a university-association logo strip.
  - "Explore the network" is now a solid button in the section header,
    plus a gradient CTA pair at the foot of the section.

CHANGES IN THIS BUILD (20260809a)
  - All 18 section-header calls to action are now solid pill buttons,
    matching "Explore the network": "Our approach", "All initiatives",
    "The Knowledge Hub", "The stories", "News & Events", "All news",
    "Full calendar", "All calls", "Hubs on the map", "Support GPS",
    "Open the library", "Partner with GPS", "How governance works",
    "Youth & Leadership initiative", "Interactive calendar" and the rest.
  - Dark sections use the gradient variant so the button stays legible
    (measured 8.8-11:1); light sections use the dark variant (18.8:1).
  - On narrow screens the button goes full-width under the heading.

CHANGES IN THIS BUILD (20260809a)
  - Homepage network section is now just heading + button + the map.
  - The four numbers (6 / 3 / 8 / 24) moved to the Explore the network
    page, at the top of its hubs section.
  - Everything that sat below the map now lives inside it: a hub detail
    panel (defaults to Kigali, updates as you hover any pin), the colour
    legend, and the eight university-association badges in an internal
    footer bar. The six hub cards and the association strip are gone.
  - Below 820px the panel and footer stack under the map instead of
    overlaying it.

CHANGES IN THIS BUILD (20260809a) — INVENTED DATA REMOVED
  - Deleted the 24 "partner cities" and the 12 "diaspora cities". Both
    lists were fabricated: they appear nowhere in the source documents.
    Removed from the map engine, the hero legend, the homepage copy, the
    "24 partner & dialogue cities" stat, and the captions on Global
    Positioning and Diaspora Network.
  - Everything now plotted comes from the documented hub list only:
    6 operating hubs, 3 planned.
  - Homepage map redesigned as a globe, visually distinct from the flat
    hero map: green/lime palette instead of blue, circular instead of
    rectangular, and deliberately cropped so the world runs past the
    frame. A "The world keeps going" link leads to the network page.
  - Hub detail panel and legend retained inside the globe.

CHANGES IN THIS BUILD (20260809a)
  - GPS Outlook tile now renders the publication as a physical object
    (angled cover with masthead, issue line and cover title) instead of
    a flat gradient, and tilts slightly on hover.
  - The tile has a photo layer ready: put a file at assets/outlook.jpg
    and add <img src="assets/outlook.jpg" alt=""> inside the tile's
    <span class="ed-figure"> to use a real photograph instead. The
    .ed-figure / .ed-cover pattern works on any editorial tile.

CHANGES IN THIS BUILD (20260809a)
  - Kigali Knowledge Crossroads Week tile now renders a delegate badge as
    a physical object (lanyard clip, lime header band, DELEGATE line,
    barcode, October 2027 / Kigali) instead of a flat gradient.
  - Corrected invented dates: the calendar said "18-22 Oct 2027". The
    concept note only says "October 2027", so the calendar entry and the
    list now read "dates to be confirmed".
  - Both feature tiles keep a photo layer: add an <img> inside the tile's
    <span class="ed-figure"> to use a real photograph instead.

CHANGES IN THIS BUILD (20260809a)
  - People page: Board of Directors section kept, but the officer titles
    (Chairperson, Vice-Chair, Treasurer, Directors) are removed. Four
    neutral "Board Member" placeholders remain, numbered 01-04, each
    marked "Announcement forthcoming".

CHANGES IN THIS BUILD (20260809a)
  - People page: Executive Leadership titles (Executive Director,
    Director of Programs / Partnerships / Technology) removed. Four
    neutral "Team Member" placeholders remain, numbered 01-04.

CHANGES IN THIS BUILD (20260809a) — WEBSITE REVIEW, SECTIONS 1-3

  1. NAVIGATION AND STRUCTURE
   - Eight main headings: About | Our Work | People | Network | Activities |
     Publications & Multimedia | News & Events | Get Involved.
     ("Initiatives" is now "Activities"; "Knowledge Hub" is now
     "Publications & Multimedia".)
   - Every dropdown cut to 4-5 grouped items (previously up to 13).
     Pages removed from menus are still reachable from their landing pages,
     so no URL breaks and no page is orphaned.
   - In Development / Planned items hidden from the Activities landing page
     and the menu: GPS Impact Observatory (2029), Global South Data &
     Foresight Platform (2029), Community-Based Initiatives (2028). Their
     files remain in place so existing links do not 404.
   - Policy Briefs, Reports, Working Papers, Books and Case Studies are now
     one "Publications" page; Podcasts, Videos and Recorded Conversations
     are one "Multimedia" page.
   - "The platform, in motion" removed; that content is now Latest Updates.
     Newsroom -> Latest Updates. Impact Stories -> GPS in Action.
   - Regional information consolidated on one "Regional Coordination" page
     (moved under Network). The duplicate hub grid on the Network page is
     replaced by a link to it.

  2. TERMINOLOGY
   - Knowledge Generation -> Knowledge Co-Creation, Sharing & Dissemination
   - Policy & Public Leadership -> Policy, Governance & Public Leadership
   - Enterprise -> Enterprise & Sustainable Development
   - Kigali Knowledge Week -> Kigali Knowledge Crossroads Week (in full)
   - GPS International Convenings -> GPS Dialogues (umbrella term)
   - "Partner With Us" / "Become a Partner" -> "Partner with GPS" everywhere
   - Pillar order is now Knowledge | Technology & Innovation | Policy,
     Governance & Public Leadership | Enterprise & Sustainable Development,
     renumbered 01-04 on the pillar pages, the Our Work landing page and the
     ecosystem diagram. Building interconnected ecosystems is described as
     the GPS approach, not a fifth pillar.

  3. HOMEPAGE HERO
   - Periods removed from the headline; the four pillars are now separated
     by vertical marks and the headline flows on three lines instead of five.
   - Supporting copy cut from 232 to 158 characters, one sentence.
   - Two calls to action only: "Explore Our Work" and "Partner with GPS".

  NOT CHANGED (deliberately)
   - File names are unchanged (initiatives.html, knowledge-hub.html,
     about-regional-hubs.html). Renaming them would 404 every existing
     link, bookmark and search result for gpsouth.org. Only the labels
     changed. Say the word if you want the URLs renamed with redirects.

CHANGES IN THIS BUILD (20260809a)
  - Menu heading links no longer read "<Section> — overview"; each
    dropdown's first link is now just the section name.
  - Ecosystem diagram made symmetric: the four pillars now form a proper
    cross (01 Knowledge top, 02 Technology & Innovation left,
    03 Policy right, 04 Enterprise bottom) around the GPS core, with the
    actor chips in matching corners and the Impact spoke running from
    Enterprise. The caption paragraph beneath it has been removed.
  - Header no longer overflows between 900-961px: the Donate button in
    the bar is hidden below 990px (it remains in the mobile drawer and
    the footer).
  - Hero headline narrowed and the hero map reframed so no hub label
    lands in the copy column.

CHANGES IN THIS BUILD (20260809a) — CONTACT EMAIL
  - All five placeholder addresses (hello@ / partnerships@ / press@ /
    giving@ / journal@ gps.global) are gone. One real address is used
    everywhere: info@gpsouth.org.
  - Every form (Contact, Partnership enquiry, Join the Network, Volunteer)
    now actually sends email to info@gpsouth.org via send.php.

  IMPORTANT — UPLOAD send.php TOO
    send.php must sit in public_html/ next to index.html. It uses PHP
    mail(), which Hostinger shared hosting supports out of the box.
    Nothing to configure. To change the destination later, edit the
    single line at the top of send.php:  const TO = 'info@gpsouth.org';

  HOW IT BEHAVES
    - Submits by fetch and shows an inline confirmation without leaving
      the page; on failure it tells the visitor to email us directly.
    - With JavaScript disabled the form still posts to send.php normally.
    - Includes a hidden honeypot field for basic spam protection, and
      sets Reply-To to the sender so you can reply straight from the mail.

  TEST AFTER UPLOADING
    Submit the contact form once and confirm the mail arrives at
    info@gpsouth.org. If nothing arrives, check hPanel > Emails that the
    mailbox exists, and that PHP is enabled for the domain.

  - Hero headline now uses clean spacing only: "Connecting Knowledge
    Innovation Policy Enterprise" — no periods, no separator marks.
