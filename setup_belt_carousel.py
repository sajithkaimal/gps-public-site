import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# First, remove the old script and <style> block if they exist
# We added <style> .hub-carousel-wrapper ... </style> before </head>
style_pattern = re.compile(r'<style>\s*\.hub-carousel-wrapper.*?</style>\s*', re.DOTALL)
content = style_pattern.sub('', content)

# The HTML block to replace is the one starting with <div class="reveal d1">... and ending with </script>
html_pattern = re.compile(r'<div class="reveal d1">\s*<div class="hub-carousel-wrapper".*?</script>', re.DOTALL)

new_html = """<div class="reveal d1 work-rail" style="margin-top:20px;">
  <div class="wr-nav" style="display:flex; justify-content:flex-end; gap:8px; margin-bottom:12px;">
    <button type="button" class="wr-btn" data-rail-prev aria-label="Previous image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="M15 5 8 12l7 7"/></svg>
    </button>
    <button type="button" class="wr-btn" data-rail-next aria-label="Next image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;"><path d="m9 5 7 7-7 7"/></svg>
    </button>
  </div>
  
  <!-- Inline style to set visibility. Showing 1.5 images makes it feel like a continuous belt -->
  <style>
    .hub-belt-wr { --wr-vis: 1.5; --wr-gap: 12px; margin: 0 -20px; padding: 0 20px; }
    @media(max-width: 768px) { .hub-belt-wr { --wr-vis: 1.15; } }
    .hub-belt-card { padding: 0; background: transparent; aspect-ratio: 4/3; cursor: zoom-in; min-height: 0; }
    .hub-belt-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; transition: transform 0.4s ease; }
    .hub-belt-card:hover img { transform: scale(1.02); }
    
    /* Lightbox Styles */
    .hub-lightbox {
      position: fixed; inset: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.95);
      z-index: 9999; border: none; padding: 0; display: flex; align-items: center; justify-content: center;
      opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .hub-lightbox[open] { opacity: 1; visibility: visible; }
    .hub-lightbox::backdrop { background: transparent; }
    .hub-lightbox-content { position: relative; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; align-items: center; }
    .hub-lightbox-img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
    .hub-lightbox-close {
      position: absolute; top: -40px; right: 0; background: transparent; color: #fff; border: none;
      font-size: 36px; cursor: pointer; line-height: 1; padding: 0; opacity: 0.8;
    }
    .hub-lightbox-close:hover { opacity: 1; }
    .hub-lightbox-nav {
      position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: #fff;
      border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;
    }
    .hub-lightbox-nav:hover { background: rgba(0,0,0,0.8); }
    .hub-lightbox-prev { left: -60px; }
    .hub-lightbox-next { right: -60px; }
    @media(max-width: 800px) {
      .hub-lightbox-nav { display: none; }
      .hub-lightbox-close { right: 10px; top: -40px; }
    }
  </style>
  
  <div class="wr hub-belt-wr" data-rail role="region" aria-roledescription="carousel" aria-label="Hub meetings slider">
    <div class="wr-track" id="hubBeltTrack">
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p11.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
      <div class="wr-card hub-belt-card"><img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy"></div>
    </div>
  </div>
  <figcaption style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-faint);padding:10px 2px 0;text-align:center;">Hub coordination meeting, Addis Ababa</figcaption>
</div>

<dialog class="hub-lightbox" id="hubLightbox">
  <div class="hub-lightbox-content">
    <button class="hub-lightbox-close" id="hubLightboxClose" aria-label="Close fullscreen">&times;</button>
    <img src="" class="hub-lightbox-img" id="hubLightboxImg" alt="Fullscreen hub image">
    <button class="hub-lightbox-nav hub-lightbox-prev" id="hubLightboxPrev" aria-label="Previous image">&#10094;</button>
    <button class="hub-lightbox-nav hub-lightbox-next" id="hubLightboxNext" aria-label="Next image">&#10095;</button>
  </div>
</dialog>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('hubBeltTrack');
  const lightbox = document.getElementById('hubLightbox');
  const lightboxImg = document.getElementById('hubLightboxImg');
  const closeBtn = document.getElementById('hubLightboxClose');
  const prevBtn = document.getElementById('hubLightboxPrev');
  const nextBtn = document.getElementById('hubLightboxNext');
  
  // Create a list of unique image sources
  const images = Array.from(track.querySelectorAll('.wr-card img')).map(img => img.src).filter((v, i, a) => a.indexOf(v) === i);
  let currentIndex = 0;

  // Event delegation to catch clicks on original AND cloned cards
  track.addEventListener('click', (e) => {
    const card = e.target.closest('.hub-belt-card');
    if (card) {
      e.preventDefault();
      const img = card.querySelector('img');
      if (img) {
        currentIndex = images.indexOf(img.src);
        if (currentIndex === -1) currentIndex = 0;
        lightboxImg.src = images[currentIndex];
        lightbox.showModal();
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeLightbox() {
    lightbox.close();
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  }

  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape') closeLightbox();
  });
});
</script>"""

if html_pattern.search(content):
    content = html_pattern.sub(new_html, content)
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success inserting belt carousel")
else:
    print("Could not find the HTML block to replace")

