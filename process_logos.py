# -*- coding: utf-8 -*-
"""Przycina białe marginesy wokół logotypów (na białym tle), żeby ładnie wypełniały kafelek."""
import os
from PIL import Image

def trim_white(path, thr=245, pad=6):
    if not os.path.exists(path):
        print("pomijam (brak):", path); return
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 10 and not (r > thr and g > thr and b > thr):
                found = True
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
    if not found:
        print("brak treści:", path); return
    minx = max(0, minx - pad); miny = max(0, miny - pad)
    maxx = min(w, maxx + 1 + pad); maxy = min(h, maxy + 1 + pad)
    out = im.crop((minx, miny, maxx, maxy))
    out.save(path)
    print(f"przycięto {os.path.basename(path)}: {w}x{h} -> {out.size[0]}x{out.size[1]}")

for f in ["logo-pb.png", "logo-szpital.png", "logo-ptkt.png"]:
    trim_white(os.path.join(os.path.dirname(__file__), f))
