"""People-page portrait in the site's style. All portraits on /about/people/ were made with this.

usage: python3 tools/portrait.py <input image> <person-id> <x> <y> <size>
  Writes public/media/people/<person-id>.webp (480x480). Then set in src/content/people/<id>.md:
    photo: "/media/people/<id>.webp"
    photo_ok: true          # only with the person's consent

What it does (keep it this way so the set stays consistent):
  1. Square crop (x, y, size) in pixels of the input. The square may run past the photo's edges
     (negative x/y, or size larger than the photo) to zoom out a tight shot; the extra space is
     filled with the photo's own background colour (median of its border pixels). No fades, no
     white bars. A transparent background becomes white first.
  2. Grayscale, autocontrast (2% clip), contrast x1.25, light unsharp mask.
  3. Warm ink-on-paper duotone: ink #100f0e, mid #8c7c68, paper #f7f0e2; 4% grain.
  The page shows it as a circle (124 px desktop, 84 px phone), so the corners are hidden.

Choosing the crop (what Pavel asked for, Nov 2026):
  - Head and shoulders, not a tight face: head about 45-55% of the square's height, eyes a little
    above centre, some shoulders visible. Too tight reads as cramped in the circle.
  - Avoid padding at the bottom (a strip under the shirt shows); pad top/sides instead.
  - Preview it as a circle against the dark page before committing.
  Crops used: pavel-chvykov (closeup.png) 150 100 440; robert-marsland (Bobby.jpeg) -102 38 1035;
  matthew-mccarthy (Matthew.jpeg) 16 50 330; francis-heylighen (Francis.webp) -80 -10 540;
  john-dunne (JohnDunne_HS-2025.webp) 125 20 480.
  Source photos: LiveDrive projects/cscsc-community/promo/AV_content/people/ (Pavel's: ~/Pictures/mepix/26eva/).
"""
import sys, random
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

src, pid, x, y, s = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:6])
INK, PAPER, MID = (16, 15, 14), (247, 240, 226), (140, 124, 104)
im = Image.open(src)
if im.mode in ("RGBA", "LA", "P"):  # transparent background -> white
    im = im.convert("RGBA"); bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
im = im.convert("RGB")
# a square that runs past the image edge (to zoom out a tight photo) is filled with the photo's
# own background colour: the median of its outermost pixels
from statistics import median
px = im.load()
border = [px[i, 0] for i in range(im.width)] + [px[1, j] for j in range(im.height)] + [px[im.width - 2, j] for j in range(im.height)]
fill = tuple(int(median(c[k] for c in border)) for k in range(3))
canvas = Image.new("RGB", (s, s), fill)
canvas.paste(im, (-x, -y))
im = canvas.resize((480, 480), Image.LANCZOS)
g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=2)
g = ImageEnhance.Contrast(g).enhance(1.25).filter(ImageFilter.UnsharpMask(2, 80, 2))
out = ImageOps.colorize(g, black=INK, white=PAPER, mid=MID)
random.seed(1)
grain = ImageOps.colorize(Image.effect_noise((480, 480), 18).convert("L"), black=INK, white=PAPER)
Image.blend(out, grain, 0.04).save(f"public/media/people/{pid}.webp", quality=82)
print(f"public/media/people/{pid}.webp")
