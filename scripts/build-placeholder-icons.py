#!/usr/bin/env python3
"""
Generate the PLACEHOLDER icon set into public/brand/ and public/favicon.ico.

    python3 -m pip install pillow
    python3 scripts/build-placeholder-icons.py

There is no 602Medicare logo yet. Rather than ship the retired Daisy Mountain
badge under a new name — or 404 every icon link in BaseHead.astro and the web
manifest — this renders a deliberately plain stand-in: a navy tile carrying the
gold "602" half of the wordmark. It is a placeholder, not a mark, and it is
meant to be thrown away.

When the real logo lands, replace this script with a proper brand-kit builder
and RENAME THE OUTPUT FILES. `public/_headers` caches `/*.png` for seven days,
so re-using these filenames means the edge keeps serving the placeholder for up
to a week after the real mark ships. New artwork, new filename — every time.

Two constraints the sizes encode:

  * 192 and 512 are opaque. iOS composites a transparent apple-touch-icon onto
    black, and gold-on-black is not the intended lockup.
  * 16 and 32 are too small for three legible digits. They are effectively a
    navy tile with a gold band, which is all a browser tab needs from a
    placeholder. Do not spend time tuning them.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "brand"

NAVY = (15, 58, 92, 255)  # --navy      #0F3A5C
GOLD = (213, 151, 31, 255)  # --gold    #D5971F  (6.0:1 on the navy ground)

# A serif in the spirit of Fraunces, which is a webfont and not installed here.
FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/Library/Fonts/Georgia.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
]


def load_font(px: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, px)
    return ImageFont.load_default()


def tile(size: int) -> Image.Image:
    """One icon. Rendered at 8x and downsampled — the rounded corners and the
    digit edges both alias badly if drawn at the target size directly."""
    scale = 8
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Rounded square, near-full-bleed. The radius is a fraction of the tile so
    # every size reads as the same shape.
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=NAVY)

    text = "602"
    # Bisect for the largest size that fits inside the safe area rather than
    # guessing a ratio — the metrics differ between the fallback fonts.
    target = s * 0.68
    lo, hi = 1, s
    font = load_font(1)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        f = load_font(mid)
        if d.textlength(text, font=f) <= target:
            lo, font = mid, f
        else:
            hi = mid - 1

    box = d.textbbox((0, 0), text, font=font)
    d.text(
        ((s - (box[2] - box[0])) / 2 - box[0], (s - (box[3] - box[1])) / 2 - box[1]),
        text,
        font=font,
        fill=GOLD,
    )
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)

    for size in (16, 32, 192, 512):
        out = BRAND / f"mark-{size}.png"
        tile(size).save(out, "PNG", optimize=True)
        print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size} bytes)")

    # favicon.ico carries the classic four sizes; it is the only icon older
    # browsers look for, and the one filename here that convention pins down.
    ico = ROOT / "public" / "favicon.ico"
    tile(64).save(ico, "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"wrote {ico.relative_to(ROOT)} ({ico.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
