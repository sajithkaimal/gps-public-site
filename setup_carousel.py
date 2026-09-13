import re

with open('about-regional-hubs/index.html', 'r') as f:
    content = f.read()

# CSS to inject
css = """
<style>
.hub-carousel-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.hub-carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
}
.hub-carousel-track::-webkit-scrollbar {
  display: none;
}
.hub-carousel-slide {
  flex: 0 0 100%;
  scroll-snap-align: center;
  position: relative;
  aspect-ratio: 4/3;
  cursor: zoom-in;
  overflow: hidden;
}
.hub-carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.hub-carousel-slide:hover img {
  transform: scale(1.05);
}
.hub-carousel-controls {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}
.hub-carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.hub-carousel-dot:hover {
  background: rgba(255,255,255,0.8);
}
.hub-carousel-dot.is-active {
  background: #fff;
  transform: scale(1.2);
}
.hub-lightbox {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.9);
  z-index: 9999;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.hub-lightbox[open] {
  opacity: 1;
  visibility: visible;
}
.hub-lightbox::backdrop {
  background: transparent;
}
.hub-lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hub-lightbox-img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}
.hub-lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 32px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  opacity: 0.8;
}
.hub-lightbox-close:hover {
  opacity: 1;
}
.hub-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.hub-lightbox-nav:hover {
  background: rgba(0,0,0,0.8);
}
.hub-lightbox-prev { left: -60px; }
.hub-lightbox-next { right: -60px; }
@media(max-width: 800px) {
  .hub-lightbox-nav { display: none; }
  .hub-lightbox-close { right: 10px; top: -40px; }
}
</style>
"""

# New HTML
new_html = """<div class="reveal d1">
  <div class="hub-carousel-wrapper" id="hubCarousel">
    <div class="hub-carousel-track" id="hubTrack">
      <div class="hub-carousel-slide" data-index="0">
        <img src="/assets/images/hub-meeting-p11.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="1">
        <img src="/assets/images/hub-meeting-p13.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="2">
        <img src="/assets/images/hub-meeting-p12.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
      <div class="hub-carousel-slide" data-index="3">
        <img src="/assets/images/hub-meeting-p14.jpg" alt="Hub coordination meeting, Addis Ababa" loading="lazy">
      </div>
    </div>
    <div class="hub-carousel-controls" id="hubControls">
      <button class="hub-carousel-dot is-active" data-slide="0" aria-label="Go to slide 1"></button>
      <button class="hub-carousel-dot" data-slide="1" aria-label="Go to slide 2"></button>
      <button class="hub-carousel-dot" data-slide="2" aria-label="Go to slide 3"></button>
      <button class="hub-carousel-dot" data-slide="3" aria-label="Go to slide 4"></button>
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
  const track = document.getElementById('hubTrack');
  const slides = document.querySelectorAll('.hub-carousel-slide');
  const dots = document.querySelectorAll('.hub-carousel-dot');
  const lightbox = document.getElementById('hubLightbox');
  const lightboxImg = document.getElementById('hubLightboxImg');
  const closeBtn = document.getElementById('hubLightboxClose');
  const prevBtn = document.getElementById('hubLightboxPrev');
  const nextBtn = document.getElementById('hubLightboxNext');
  
  let currentIndex = 0;
  const images = Array.from(slides).map(s => s.querySelector('img').src);

  // Sync scroll with dots
  track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
    currentIndex = index;
  });

  // Click dot to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.slide);
      track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
    });
  });

  // Open Lightbox
  slides.forEach((slide) => {
    slide.addEventListener('click', () => {
      const idx = parseInt(slide.dataset.index);
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightbox.showModal();
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeLightbox() {
    lightbox.close();
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(); // click outside to close
  });

  // Lightbox Navigation
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

# Replace in content
old_fig_pattern = re.compile(r'<div class="reveal d1">\s*<figure style="margin:0; display:flex; flex-direction:column; gap:12px;">.*?</figure>\s*</div>', re.DOTALL)

if old_fig_pattern.search(content):
    content = old_fig_pattern.sub(new_html, content)
    # Insert CSS before </head>
    if '</head>' in content and '.hub-carousel-wrapper' not in content:
        content = content.replace('</head>', css + '\n</head>')
    
    with open('about-regional-hubs/index.html', 'w') as f:
        f.write(content)
    print("Success replacing old figure")
else:
    # If the exact previous layout wasn't matched, try matching from <figure to </figure>
    # The previous code was: <div class="reveal d1"><figure style="margin:0; display:flex; flex-direction:column; gap:12px;"> ... </figure></div>
    print("Failed to find exact block. Let's try alternative regex.")
