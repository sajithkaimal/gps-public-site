#!/bin/bash
# GPS8 cleanup — removes accidental nested site copies and legacy flat pages.
# Run from inside the GPS8 folder:   cd ~/Downloads/GPS8 && bash cleanup-gps8.sh
# Safe: only deletes duplicates; the live site (folder/index.html pages, assets/, src/, scripts/) is untouched.
set -e
cd "$(dirname "$0")"
[ -f src/build.js ] && [ -f people/index.html ] || { echo "Run this from inside GPS8."; exit 1; }

echo "1/4 nested copies inside assets/ …"
for d in assets/*/; do
  n=$(basename "$d")
  case "$n" in images|video) ;;                       # keep real asset folders
    *) rm -rf "$d"; echo "   rm assets/$n/";;
  esac
done
for f in assets/*.html assets/*.md assets/*.php assets/*.xml assets/*.txt assets/*.htm assets/*.docx assets/*.ico assets/gps*.js assets/gps.css; do
  [ -e "$f" ] && rm -f "$f" && echo "   rm $f"
done

echo "2/4 nested copies inside src/ …"
for d in src/*/; do
  n=$(basename "$d")
  case "$n" in pages) ;;                               # keep the page sources
    *) rm -rf "$d"; echo "   rm src/$n/";;
  esac
done

echo "3/4 legacy flat pages + one-off scripts at root …"
for f in *.html; do
  case "$f" in index.html|404.html|hero-a.html|hero-b.html|hero-c.html|googlee1970bc05a0bac5d.html) ;;
    *) rm -f "$f"; echo "   rm $f";;
  esac
done
rm -f *.py Doc1.htm gps-backgrounds.js gps-site.js gps.css "Bandung Conference.jpg" "contemporary Global South.webp" "GPS members missing photo or bio.docx" .DS_Store assets/.DS_Store assets/images/.DS_Store
rm -rf gps-site docs-extracted screenshots "GPS Staff Pictures" "GPS about pictures" uploads _ds

echo "4/4 done. Remaining top level:"
ls -1
echo
echo "Now:  git add -A && git commit -m 'Remove nested duplicate copies' && git push"
