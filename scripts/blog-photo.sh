#!/bin/bash
# Featured photo for a blog post (Brian, 2026-10-12: real photos like the other sites,
# not the typographic card). Photos are self-hosted because the CSP is img-src 'self'.
#
#   scripts/blog-photo.sh try  <slug> "<4-7 word scene>" [index]   fetch a candidate → /tmp/602-photo/<slug>.jpg
#   scripts/blog-photo.sh keep <slug>                               save it → public/blog/<slug>-photo.jpg
#
# `try` uses Medicare On Main's stock-photo resolver. LOOK at the candidate before `keep`.
# Both steps refuse a photo that is byte-identical to one already in public/blog/.
set -euo pipefail
cd "$(dirname "$0")/.."
cmd="${1:?try|keep}"; slug="${2:?slug}"; tmp=/tmp/602-photo; mkdir -p "$tmp"
dupe() { local s; s=$(md5 -q "$1"); for f in public/blog/*-photo.jpg; do [ -e "$f" ] || continue; [ "$(md5 -q "$f")" = "$s" ] && { echo "$f"; return 0; }; done; return 1; }
case "$cmd" in
  try)
    q=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "${3:?query}"); i="${4:-0}"
    code=$(curl -s -m 40 -o "$tmp/$slug.jpg" -w '%{http_code} %{content_type}' "https://medicareonmain.com/api/blog-hero?q=$q&w=1200&i=$i")
    case "$code" in "200 image/"*) ;; *) echo "FAILED: $code"; exit 1;; esac
    if d=$(dupe "$tmp/$slug.jpg"); then echo "DUPLICATE of $d — change the words or the index"; exit 2; fi
    echo "candidate: $tmp/$slug.jpg — look at it before keeping" ;;
  keep)
    if d=$(dupe "$tmp/$slug.jpg"); then echo "DUPLICATE of $d"; exit 2; fi
    out="public/blog/$slug-photo.jpg"
    [ -e "$out" ] && { echo "$out exists — never overwrite; use a new slug"; exit 3; }
    cp "$tmp/$slug.jpg" "$out"; sips -z 630 1200 "$out" >/dev/null
    echo "saved $out ($(stat -f %z "$out") bytes) → image: /blog/$slug-photo.jpg" ;;
  *) echo "usage: try|keep"; exit 64 ;;
esac
