# -*- coding: utf-8 -*-
"""Dopasowuje zdjęcie zespołu do stylu strony: kadr + chłodny grading navy-turkus + winieta."""
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter

im = Image.open("zespol-raw.png").convert("RGB")
# kadr: utnij sufit u góry i nadmiar u dołu, zachowaj głowy i skrzyżowane ramiona
W0, H0 = im.size
im = im.crop((0, int(H0*0.05), W0, int(H0*0.90)))

# delikatny grading
im = ImageEnhance.Color(im).enhance(0.90)
im = ImageEnhance.Contrast(im).enhance(1.06)
im = ImageEnhance.Brightness(im).enhance(1.02)

# chłodny tint (mniej czerwieni, więcej błękitu — spójnie z paletą)
r, g, b = im.split()
r = r.point(lambda v: int(v*0.97))
b = b.point(lambda v: min(255, int(v*1.05)))
im = Image.merge("RGB", (r, g, b))

# winieta
w, h = im.size
mask = Image.new("L", (w, h), 0)
ImageDraw.Draw(mask).ellipse([-w*0.18, -h*0.18, w*1.18, h*1.18], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(int(w*0.13)))
dark = ImageEnhance.Brightness(im).enhance(0.74)
im = Image.composite(im, dark, mask)

im.save("zespol.jpg", "JPEG", quality=88)
print("Zapisano zespol.jpg", im.size)
