#!/usr/bin/env python3
"""
Build public/favicon.ico from the shipped badge.

    python3 scripts/build-favicon-ico.py

Everything else in the icon set comes ready-made in 602medicare-logo-pack.zip
(favicon-32, apple-touch-icon-180, icon-192, icon-512). The .ico does not, and
it is still the only icon some older browsers and Windows shortcuts look for —
so it is generated here from icon-512.png rather than hand-drawn.

Two decisions worth keeping:

  • It is composited onto WHITE, not left transparent. The badge's circle is
    navy on a light field; on a dark browser-tab strip a transparent version
    loses its outer ring entirely and reads as a floating red-and-navy smudge.

  • The mark is inset by ~6%. The badge is a full-bleed circle in the source,
    and at 16px a circle touching all four edges of the tile clips visibly on
    the diagonals.

Needs only pillow — no numpy, no scipy.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo" / "icon-512.png"
OUT = ROOT / "public" / "favicon.ico"

# What Windows, Chrome and Safari actually pull out of an .ico between them.
SIZES = [16, 32, 48]

# Share of the tile the badge occupies. 0.88 leaves a 6% margin on each side.
INSET = 0.88


def main() -> None:
    badge = Image.open(SRC).convert("RGBA")

    frames = []
    for size in SIZES:
        tile = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        inner = max(1, round(size * INSET))
        scaled = badge.resize((inner, inner), Image.LANCZOS)
        offset = (size - inner) // 2
        tile.alpha_composite(scaled, (offset, offset))
        frames.append(tile.convert("RGB"))

    # Pillow writes every requested size into the one file; the largest frame is
    # the one passed to save(), the rest ride along in `append_images`.
    frames[-1].save(
        OUT,
        format="ICO",
        sizes=[(s, s) for s in SIZES],
        append_images=frames[:-1],
    )
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes, {SIZES})")


if __name__ == "__main__":
    main()
