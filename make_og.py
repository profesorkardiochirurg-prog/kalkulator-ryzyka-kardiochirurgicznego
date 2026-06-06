# -*- coding: utf-8 -*-
"""Generuje og-image.png (1200x630) — podgląd linku przy udostępnianiu."""
import numpy as np, matplotlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 630
navy, teal = (10, 20, 48), (12, 58, 73)

# tło: gradient pionowy navy -> teal
arr = np.zeros((H, W, 3), dtype=np.uint8)
for y in range(H):
    t = y / H
    arr[y, :, :] = [int(navy[i] + (teal[i] - navy[i]) * t) for i in range(3)]
img = Image.fromarray(arr, "RGB").convert("RGBA")

# poświaty (jak w hero strony)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 380, -240, W + 200, 340], fill=(225, 29, 72, 160))   # czerwona, prawy-góra
gd.ellipse([-240, H - 280, 280, H + 240], fill=(14, 165, 164, 130))  # turkus, lewy-dół
glow = glow.filter(ImageFilter.GaussianBlur(130))
img = Image.alpha_composite(img, glow)

# linia EKG (subtelna)
ekg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ed = ImageDraw.Draw(ekg)
pts, x, base = [], 0, 470
seg = [(0, 0), (110, 0), (125, -42), (140, 70), (155, -95), (170, 60), (185, 0), (300, 0)]
while x < W:
    for dx, dy in seg:
        pts.append((x + dx, base + dy))
    x += 300
ed.line(pts, fill=(94, 234, 212, 70), width=3)
img = Image.alpha_composite(img, ekg)

d = ImageDraw.Draw(img)
fp = matplotlib.get_data_path() + "/fonts/ttf/"
f_title = ImageFont.truetype(fp + "DejaVuSans-Bold.ttf", 66)
f_logo  = ImageFont.truetype(fp + "DejaVuSans-Bold.ttf", 40)
f_sub   = ImageFont.truetype(fp + "DejaVuSans.ttf", 31)
f_badge = ImageFont.truetype(fp + "DejaVuSans-Bold.ttf", 30)
f_small = ImageFont.truetype(fp + "DejaVuSans.ttf", 25)
f_heart = ImageFont.truetype(fp + "DejaVuSans.ttf", 78)

# logo: kafelek + serce + nazwa CARMA
f_acr = ImageFont.truetype(fp + "DejaVuSans.ttf", 21)
d.rounded_rectangle([80, 70, 188, 178], radius=26, fill=(225, 29, 72))
d.text((134, 132), "♥", font=f_heart, fill=(255, 255, 255), anchor="mm")
d.text((210, 110), "CARMA", font=f_logo, fill=(255, 255, 255), anchor="lm")
d.text((212, 150), "CARdiac surgery Mortality Assessment", font=f_acr, fill=(94, 234, 212), anchor="lm")

# tytuł
d.multiline_text((80, 250), "Kalkulator ryzyka\n30-dniowej śmiertelności",
                 font=f_title, fill=(255, 255, 255), spacing=12)

# podtytuł
d.text((82, 432), "Uniwersalny model uczenia maszynowego · dane KROK (PL)",
        font=f_sub, fill=(201, 214, 232), anchor="lm")

# plakietka AUC
badge = "AUC 0,805   ·   bije EuroSCORE II 0,773"
bb = d.textbbox((0, 0), badge, font=f_badge)
bw, bh = bb[2] - bb[0], bb[3] - bb[1]
bx, by = 82, 478
d.rounded_rectangle([bx, by, bx + bw + 44, by + bh + 28], radius=24, fill=(225, 29, 72))
d.text((bx + 22, by + 14 + bh / 2), badge, font=f_badge, fill=(255, 255, 255), anchor="lm")

# stopka — disclaimer
d.text((82, 582), "Wyłącznie do celów badawczych — nie do decyzji klinicznych.",
        font=f_small, fill=(148, 163, 184), anchor="lm")

img.convert("RGB").save("og-image.png", "PNG")
print("Zapisano og-image.png", img.size)
