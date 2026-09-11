"""Derive the responsive image set from the originals in assets/img/src/.

Writes 480/800/1280/1600 JPEG + WebP variants to assets/img/ and an image
manifest (dimensions + inline blur placeholder) to content/images.json.

    pip install Pillow
    python3 scripts/build-images.py
"""
import base64, io, json, os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "img", "src")
OUT = os.path.join(ROOT, "assets", "img")
WIDTHS = [480, 800, 1280, 1600]

# key: (source file, crop box as l,t,r,b fractions or None)
PLAN = {
    "olive-grove":     ("olive-grove.jpg", None),
    "deck-spa":        ("deck-spa.jpg", None),
    "lakeside-dusk":   ("lakeside-dusk.jpg", None),
    "bungalow-plinth": ("bungalow-plinth.jpg", None),
    "forest-module":   ("forest-module.jpg", (0.012, 0.02, 0.988, 0.775)),  # trims a supplier watermark
    "village-forest":  ("village-forest.jpg", None),
    "village-alpine":  ("village-alpine.jpg", None),
    "terrace":         ("terrace.jpg", None),
    "interior-open":   ("interior-open.jpg", None),
    "interior-kitchen":("interior-open.jpg", (0.0, 0.14, 0.66, 0.86)),
    "stair-wide":      ("stair-wide.jpg", None),
    "stair-detail":    ("stair-detail.jpg", None),
    "bathroom":        ("bathroom.jpg", None),
}


def lqip(img):
    t = img.resize((22, max(1, round(22 * img.height / img.width))), Image.LANCZOS)
    t = t.filter(ImageFilter.GaussianBlur(0.6))
    buf = io.BytesIO()
    t.save(buf, "JPEG", quality=42)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for key, (fname, box) in PLAN.items():
        img = Image.open(os.path.join(SRC, fname)).convert("RGB")
        if box:
            l, t, r, b = box
            img = img.crop((round(l * img.width), round(t * img.height),
                            round(r * img.width), round(b * img.height)))
        made = []
        for w in WIDTHS:
            if w > img.width * 1.02:
                continue
            h = round(img.height * w / img.width)
            r_ = img.resize((w, h), Image.LANCZOS)
            r_.save(os.path.join(OUT, f"{key}-{w}.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
            r_.save(os.path.join(OUT, f"{key}-{w}.webp"), "WEBP", quality=74, method=6)
            made.append(w)
        manifest[key] = {"w": img.width, "h": img.height, "sizes": made, "lqip": lqip(img)}
        print(f"{key:17} {img.width}x{img.height} -> {made}")

    path = os.path.join(ROOT, "content", "images.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(manifest, f, indent=2)
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)
                if os.path.isfile(os.path.join(OUT, f)))
    print(f"\n{len(manifest)} images, {total // 1024} KB written")


if __name__ == "__main__":
    main()
