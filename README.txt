GPS — delta since build 20260923a → 20260924a
Overwrite these files in public_html/ and GPS8/.

NEW
  submission-received/index.html        confirmation page (forms redirect here on success)
  src/pages/submission-received.html    its source

CHANGED
  assets/site.js      redirect to /submission-received after successful submit; red borders clear once valid
  assets/ui.css       confirmation-page styles
  src/build.js        confirmation page excluded from sitemap; robots Disallow line
  robots.txt          Disallow: /submission-received
  scripts/run-build.js  version 20260924a
  index.html + every */index.html + 404.html   cache-bust ?v=20260924a (content unchanged except as noted)
  src/pages/index.html  synced to the live home page so future rebuilds keep the hero video
