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

FRAUNCES IS INSTANCED AT opsz=40; INTER STAYS FULLY VARIABLE.

Fraunces' optical-size axis is 45% of its file — 51 KB with it, 28 KB without.
That axis buys one thing on this site: the footer wordmark rendered at 200px+
picked up tighter optical metrics than the 40px headings did. Keeping it cost
every visitor 23 KB on the critical path so that one decorative band could be
optically correct, and the font-swap repaint it delayed was the single thing
keeping Speed Index off a perfect score. The footer band's `cqw` tiers were
re-tuned for the pinned metrics instead — see Footer.astro.

`wght` stays variable on both: the site uses 400/500/600 of Inter and 500/600 of
Fraunces, and a single variable file is smaller than two static instances.

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


def pin_optical_size(path: Path, opsz: float = 40) -> None:
    """Drop Fraunces' `opsz` axis, pinning it at the value the headings ask for.

    45% of the file. See the module docstring for the trade and Footer.astro for
    the band that had to be re-tuned because of it.
    """
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    before = path.stat().st_size
    font = TTFont(path)
    inst = instancer.instantiateVariableFont(font, {"opsz": opsz}, inplace=False)
    inst.flavor = "woff2"
    inst.save(path)
    after = path.stat().st_size
    print(f"  {path.name:<28} {before/1024:6.1f} KB -> {after/1024:6.1f} KB "
          f"(opsz pinned at {opsz:g})")


def main() -> None:
    chars = "".join(sorted(set(BASE) | set(EXTRA) | used_characters()))
    # Strip control characters the subsetter will not accept.
    chars = "".join(c for c in chars if c.isprintable() or c == " ")
    print(f"subsetting to {len(chars)} characters\n")

    for stem in ("fraunces", "inter"):
        src = FONTS / f"{stem}-latin.woff2"
        if not src.exists():
            sys.exit(f"missing {src} — see BaseHead.astro for where these come from")
        out = FONTS / f"{stem}-subset.woff2"
        subset(src, out, chars)
        if stem == "fraunces":
            pin_optical_size(out)

    print("\nWired in src/components/BaseHead.astro as /fonts/<name>-subset.woff2")


if __name__ == "__main__":
    main()
