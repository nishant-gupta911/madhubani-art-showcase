#!/usr/bin/env python3
"""
image_pipeline.py - Optimizes product photos from madu/ into high-performance WebP formats.
Generates:
- Full hero images (max 1600px)
- Product card thumbnails (max 640px)
- Base64 blur placeholders for zero-CLS lazy loading
Saves to public/products/ and generates public/products/manifest.json
"""

import os
import json
import base64
import io
from PIL import Image

SRC_DIR = "madu"
OUT_DIR = "public/products"

def generate_blur_data_url(img):
    """Creates a tiny 16px blurred placeholder as a base64 Data URL."""
    tiny = img.copy()
    tiny.thumbnail((16, 16), Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    tiny.save(buffer, format="WEBP", quality=20)
    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/webp;base64,{b64}"

def main():
    if not os.path.exists(SRC_DIR):
        print(f"Error: {SRC_DIR} not found.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(os.listdir(SRC_DIR), key=lambda x: (int(x.split(".")[0]) if x.split(".")[0].isdigit() else 999, x))
    print(f"Processing {len(files)} product images from {SRC_DIR}...")

    manifest = {}

    for idx, fname in enumerate(files):
        if not fname.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            continue

        base_name = os.path.splitext(fname)[0]
        src_path = os.path.join(SRC_DIR, fname)
        
        try:
            with Image.open(src_path) as img:
                # Convert RGBA to RGB with white background if saving as WebP
                if img.mode in ("RGBA", "LA", "P"):
                    bg = Image.new("RGB", img.size, (255, 255, 255))
                    if img.mode == "P":
                        img = img.convert("RGBA")
                    bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                    rgb_img = bg
                else:
                    rgb_img = img.convert("RGB")

                blur_url = generate_blur_data_url(rgb_img)

                # 1. Full view (max 1600px, quality 85)
                full_img = rgb_img.copy()
                full_img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                full_filename = f"{base_name}.webp"
                full_path = os.path.join(OUT_DIR, full_filename)
                full_img.save(full_path, "WEBP", quality=85, method=6)

                # 2. Card view (max 640px, quality 80)
                card_img = rgb_img.copy()
                card_img.thumbnail((640, 640), Image.Resampling.LANCZOS)
                card_filename = f"{base_name}-card.webp"
                card_path = os.path.join(OUT_DIR, card_filename)
                card_img.save(card_path, "WEBP", quality=80)

                width, height = full_img.size
                manifest[fname] = {
                    "original": fname,
                    "url": f"/products/{full_filename}",
                    "cardUrl": f"/products/{card_filename}",
                    "width": width,
                    "height": height,
                    "blurDataUrl": blur_url
                }

        except Exception as e:
            print(f"Failed processing {fname}: {e}")

        if (idx + 1) % 15 == 0 or (idx + 1) == len(files):
            print(f"Processed {idx + 1}/{len(files)} images...")

    manifest_path = os.path.join(OUT_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Done! {len(manifest)} web-optimized images created in {OUT_DIR}/.")

if __name__ == "__main__":
    main()
