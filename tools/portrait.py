"""Make a People-page portrait in the site's style: square crop around the face,
then a warm ink-on-paper duotone with light grain, so all portraits read as one set.
usage: python3 tools/portrait.py <input image> <person-id> <x> <y> <size>
  (x, y, size) = the square to crop, in pixels of the input image (keep the face centred, filling ~60%).
Writes public/media/people/<person-id>.webp; then set photo + photo_ok: true in src/content/people/<id>.md."""
import sys, random
from PIL import Image, ImageOps, ImageFilter

src, pid, x, y, s = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:6])
INK, PAPER, MID = (32, 29, 27), (236, 226, 206), (132, 118, 100)
im = Image.open(src).convert("RGB").crop((x, y, x + s, y + s)).resize((480, 480), Image.LANCZOS)
g = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=1).filter(ImageFilter.UnsharpMask(2, 60, 2))
out = ImageOps.colorize(g, black=INK, white=PAPER, mid=MID)
random.seed(1)
grain = ImageOps.colorize(Image.effect_noise((480, 480), 18).convert("L"), black=INK, white=PAPER)
Image.blend(out, grain, 0.06).save(f"public/media/people/{pid}.webp", quality=82)
print(f"public/media/people/{pid}.webp")
