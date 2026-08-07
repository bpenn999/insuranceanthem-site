#!/usr/bin/env python3
"""
Subset the two self-hosted webfonts down to the glyphs this site actually uses.

    python3 scripts/build-fonts.py

Why this exists: the full latin subsets Google serves are 67 KB (Fraunces) and
48 KB (Inter). 115 KB of font on the critical path is most of what stood between
this site and a 99 — under Lighthouse's simulated 4G that is roughly 575ms of
transfer, at the highest priority the browser has, competing with the document.

An insurance site in English uses a startlingly small character set. Subsetting
to the characters that appear in the built HTML, plus a safety margin of the
whole printable-ASCII range and the handful of typographic marks the copy uses
(en/em dashes, curly quotes, ·, ×, ½, the arrows), cuts both files by well over
half with no visible difference.

BOTH FONTS ARE VARIABLE AND STAY VARIABLE. `--flavor=woff2` plus retaining the
axes matters: the display face uses Fraunces' optical-size axis (the footer
wordmark is tuned against it — see the notes in Footer.astro), and the body face
uses weights 400–600. Dropping the axes would be a bigger saving and would break
both.

Re-run this after adding copy in a new language or with unusual symbols. The
build does NOT run it automatically — a missing glyph should be a deliberate
discovery, not a silent tofu box on a page nobody screenshotted.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
FONTS = ROOT / "public" / "fonts"

# Everything printable in ASCII, so any future copy edit stays safe.
BASE = "".join(chr(c) for c in range(0x20, 0x7F))

# The typographic marks this site's copy actually uses, plus room to grow.
EXTRA = (
    " "      # nbsp
    "–—"          # en dash, em dash
    "‘’“”‚„"      # curly quotes
    "…·•"         # ellipsis, middle dot, bullet
    "×÷±"         # math
    "°©®™"        # symbols
    "→←↑↓"        # arrows
    "½¼¾"         # fractions
    "£€¢"         # currency beyond $
    "áéíóúñüàèìòùâêîôûäëïöçÁÉÍÓÚÑÜÇ"  # accented latin, for names
)


def used_characters() -> set[str]:
    """Every character that appears in the built HTML, tags stripped."""
    if not DIST.exists():
        sys.exit("dist/ not found — run `npm run build` first.")
    chars: set[str] = set()
    for f in DIST.rglob("*.html"):
        text = f.read_text(encoding="utf-8", errors="ignore")
        text = re.sub(r"<script[\s\S]*?</script>", " ", text)
        text = re.sub(r"<style[\s\S]*?</style>", " ", text)
        text = re.sub(r"<[^>]+>", " ", text)
        chars |= set(text)
    return chars


def subset(src: Path, out: Path, chars: str) -> None:
    before = src.stat().st_size
    cmd = [
        sys.executable, "-m", "fontTools.subset", str(src),
        f"--text={chars}",
        "--flavor=woff2",
        f"--output-file={out}",
        # Keep the variable axes — see the module docstring.
        "--layout-features=kern,liga,calt,ccmp,locl,tnum",
        "--drop-tables+=DSIG",
        "--no-hinting",
        "--desubroutinize",
        "--name-IDs=*",
        "--notdef-outline",
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    after = out.stat().st_size
    print(f"  {out.name:<28} {before/1024:6.1f} KB -> {after/1024:6.1f} KB "
          f"({100 - after / before * 100:4.1f}% smaller)")


def main() -> None:
    chars = "".join(sorted(set(BASE) | set(EXTRA) | used_characters()))
    # Strip control characters the subsetter will not accept.
    chars = "".join(c for c in chars if c.isprintable() or c == " ")
    print(f"subsetting to {len(chars)} characters\n")

    for stem in ("fraunces", "inter"):
        src = FONTS / f"{stem}-latin.woff2"
        if not src.exists():
            sys.exit(f"missing {src} — see BaseHead.astro for where these come from")
        subset(src, FONTS / f"{stem}-subset.woff2", chars)

    print("\nWired in src/components/BaseHead.astro as /fonts/<name>-subset.woff2")


if __name__ == "__main__":
    main()
