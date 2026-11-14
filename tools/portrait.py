"""Make a People-page portrait in the site's style: square crop around the face,
then a warm ink-on-paper duotone with light grain, so all portraits read as one set.
usage: python3 tools/portrait.py <input image> <person-id> <x> <y> <size>
  (x, y, size) = the square to crop, in pixels of the input image (keep the face centred, filling ~60%).
Writes public/media/people/<person-id>.webp; then set photo + photo_ok: true in src/content/people/<id>.md."""
import sys, random
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

src, pid, x, y, s = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:6])
INK, PAPER, MID = (16, 15, 14), (247, 240, 226), (140, 124, 104)
im = Image.open(src)
if im.mode in ("RGBA", "LA", "P"):  # transparent background -> white
    im = im.convert("RGBA"); bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
im = im.convert("RGB")
# a square that runs past the image edge (to zoom out a tight photo) is filled with white
# and the photo's edges are feathered into it, so no seam shows
canvas = Image.new("RGB", (s, s), (255, 255, 255))
if x < 0 or y < 0 or x + s > im.width or y + s > im.height:
    f = max(8, s // 12)
    mask = Image.new("L", im.size, 0)
    mask.paste(255, (f if x < 0 else 0, f if y < 0 else 0, im.width - (f if x + s > im.width else 0), im.height - (f if y + s > im.height else 0)))
    canvas.paste(im, (-x, -y), mask.filter(ImageFilter.GaussianBlur(f / 2)))
else:
    canvas.paste(im, (-x, -y))
im = canvas.resize((480, 480), Image.LANCZOS)
g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=2)
g = ImageEnhance.Contrast(g).enhance(1.25).filter(ImageFilter.UnsharpMask(2, 80, 2))
out = ImageOps.colorize(g, black=INK, white=PAPER, mid=MID)
random.seed(1)
grain = ImageOps.colorize(Image.effect_noise((480, 480), 18).convert("L"), black=INK, white=PAPER)
Image.blend(out, grain, 0.04).save(f"public/media/people/{pid}.webp", quality=82)
print(f"public/media/people/{pid}.webp")
