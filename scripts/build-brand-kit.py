#!/usr/bin/env python3
"""
Build the Daisy Mountain Medicare brand kit into public/brand/.

Input is the master badge artwork (a 1024x1024 RGBA PNG). Everything in
public/brand/ is GENERATED — never hand-edit those files, edit this script and
re-run it:

    python3 scripts/build-brand-kit.py

About the source file's alpha channel
------------------------------------
The master PNG's alpha is a *white-knockout* matte, not a badge silhouette:
every white pixel is transparent, including the badge's own white interior
field, and the RGB underneath the transparent region is a leftover dark
vignette. Using that alpha directly would punch the badge's interior out and
leave a navy halo. So we ignore it and composite over white first, which
restores the original flat artwork exactly, then rebuild the masks ourselves
from the geometry.

Emblem extraction
-----------------
The badge is a ring of chrome around a central emblem. Labelling the ink into
connected components separates them cleanly:

  * the two rings          -> a bbox spanning >80% of the canvas
  * the arc text + dots    -> centroid >=319px from centre
  * the emblem             -> centroid <=199px from centre

That 199 / 319 gap is what the extraction leans on, so the two never mix.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "brand" / "badge-master.png"
OUT = ROOT / "public" / "brand"

# Anything lighter than this counts as background/negative space, not ink.
INK_LUM = 225
# A component whose bbox spans more than this fraction of the canvas is a ring.
RING_SPAN = 0.80
# Emblem components sit within this radius of the badge centre; the nearest
# piece of chrome (a stray 1px speck) is at 319, the nearest letter at 333.
EMBLEM_RADIUS = 300
# Pure-ink luminances, measured from the artwork, used to recover edge coverage.
NAVY_LUM = 45.0
GOLD_LUM = 160.0


def luminance(rgb: np.ndarray) -> np.ndarray:
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]


def flatten_on_white(path: Path) -> Image.Image:
    """Composite the master over white, recovering the original flat artwork."""
    src = Image.open(path).convert("RGBA")
    canvas = Image.new("RGBA", src.size, (255, 255, 255, 255))
    canvas.alpha_composite(src)
    return canvas.convert("RGB")


def coverage_matte(flat: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """
    Turn a hard component mask into an anti-aliased alpha channel.

    Edge pixels in `flat` are ink blended toward white, so their coverage is
    recoverable from how far they fall from white relative to their own pure
    ink colour. Gold and navy have very different luminances, so each pixel is
    normalised against whichever family it belongs to (hue survives blending).
    """
    lum = luminance(flat)
    is_gold = flat[..., 0] > flat[..., 2] + 25
    pure = np.where(is_gold, GOLD_LUM, NAVY_LUM)
    cov = np.clip((255.0 - lum) / (255.0 - pure), 0.0, 1.0)
    # Let coverage bleed a few px past the hard mask to keep the AA fringe,
    # but no further — the chrome is 100+px away, so this can't leak into it.
    return cov * ndi.binary_dilation(mask, iterations=3)


def unpremultiply(flat: np.ndarray, cov: np.ndarray) -> np.ndarray:
    """
    Recover ink colour from a white-composited pixel: flat = cov*ink + (1-cov)*white.

    Solving for ink amplifies noise as coverage tends to 0, so the divisor has
    a floor. Fringe pixels land slightly white-ward of true, which is invisible
    once the emblem is scaled down to icon sizes.
    """
    safe = np.maximum(cov, 0.35)[..., None]
    ink = 255.0 + (flat - 255.0) / safe
    return np.clip(ink, 0, 255)


def to_rgba(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    out = np.zeros(rgb.shape[:2] + (4,), dtype=np.uint8)
    out[..., :3] = rgb.astype(np.uint8)
    out[..., 3] = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def fit_square(img: Image.Image, size: int, pad: float, bg=None) -> Image.Image:
    """Centre `img` in a square canvas, scaled to leave `pad` fraction of margin."""
    inner = int(round(size * (1.0 - 2.0 * pad)))
    scale = min(inner / img.width, inner / img.height)
    w, h = max(1, round(img.width * scale)), max(1, round(img.height * scale))
    resized = img.resize((w, h), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    canvas.alpha_composite(resized, ((size - w) // 2, (size - h) // 2))
    return canvas


def scale_to_height(img: Image.Image, height: int) -> Image.Image:
    w = max(1, round(img.width * height / img.height))
    return img.resize((w, height), Image.LANCZOS)


def on_white(img: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", img.size, (255, 255, 255, 255))
    canvas.alpha_composite(img)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    flat_img = flatten_on_white(SRC)
    flat = np.array(flat_img).astype(float)
    h, w = flat.shape[:2]

    ink = luminance(flat) < INK_LUM
    labels, count = ndi.label(ink)
    boxes = ndi.find_objects(labels)
    cy, cx = ndi.center_of_mass(ink)

    disc_mask = np.zeros((h, w), bool)
    emblem_mask = np.zeros((h, w), bool)
    kept = 0

    for i in range(count):
        label = i + 1
        ys, xs = boxes[i]
        spans_canvas = (xs.stop - xs.start) > RING_SPAN * w or (ys.stop - ys.start) > RING_SPAN * h
        comp = labels == label
        if spans_canvas:
            # A ring. Filling it yields the badge silhouette, which is very
            # slightly elliptical — taking it from the art beats assuming a
            # perfect circle.
            disc_mask |= ndi.binary_fill_holes(comp)
            continue
        ccy, ccx = ndi.center_of_mass(comp)
        if ((ccx - cx) ** 2 + (ccy - cy) ** 2) ** 0.5 < EMBLEM_RADIUS:
            emblem_mask |= comp
            kept += 1

    print(f"components={count}  emblem components={kept}")

    # ---- Badge -----------------------------------------------------------
    disc_alpha = ndi.gaussian_filter(disc_mask.astype(float), 0.7)
    badge = to_rgba(flat, disc_alpha).crop(to_rgba(flat, disc_alpha).getbbox())
    badge.save(OUT / "logo-badge-transparent.png")
    on_white(badge).convert("RGB").save(OUT / "logo-badge-white.png")
    print(f"badge trimmed to {badge.size}")

    fit_square(badge, 1024, 0.04, (255, 255, 255, 255)).convert("RGB").save(
        OUT / "badge-1024-white.png"
    )
    fit_square(badge, 512, 0.02, (255, 255, 255, 255)).convert("RGB").save(
        OUT / "gbp-avatar-512-white.png"
    )

    # ---- Emblem ----------------------------------------------------------
    cov = coverage_matte(flat, emblem_mask)
    emblem = to_rgba(unpremultiply(flat, cov), cov)
    emblem = emblem.crop(emblem.getbbox())
    emblem.save(OUT / "icon-transparent.png")
    print(f"emblem trimmed to {emblem.size}")

    # The emblem is 1.74:1, so a square canvas always has spare height. Tab
    # favicons therefore get zero padding — every pixel of width counts at
    # 16/32px — while the big platform icons get a margin, which is what iOS
    # and Android expect.
    #
    # 192 and 512 also sit on solid white rather than transparency. Those two
    # sizes feed the apple-touch-icon, the webmanifest and the JSON-LD logo,
    # and all three composite transparency badly: iOS falls back to black, and
    # the mountains' ridge lines are negative space, so on a dark ground the
    # silhouette flattens into an unreadable navy mass. The small tab icons
    # stay transparent so they sit cleanly on any browser chrome.
    for size in (64, 32, 16):
        fit_square(emblem, size, 0.0).save(OUT / f"icon-{size}.png")
    for size in (512, 192):
        fit_square(emblem, size, 0.06, (255, 255, 255, 255)).save(OUT / f"icon-{size}.png")

    # ---- Right-sized derivatives for the UI -------------------------------
    # The masters are ~300KB and ~750KB. The header draws the emblem at 40px and
    # the footer the badge at 90px, on every page, so serving the masters there
    # would ship most of a megabyte to paint a few thousand pixels. These two
    # are cut for their display size at ~2.5x for high-DPI screens. Anything
    # laying out these files must use THEIR dimensions, not the masters'.
    scale_to_height(emblem, 96).save(OUT / "emblem-96.png")
    scale_to_height(badge, 256).save(OUT / "badge-256.png")

    ico = fit_square(emblem, 64, 0.0)
    ico.save(OUT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    ico.save(ROOT / "public" / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    print("wrote:", ", ".join(sorted(p.name for p in OUT.iterdir())))


if __name__ == "__main__":
    main()
