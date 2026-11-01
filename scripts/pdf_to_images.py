#!/usr/bin/env python3
"""
pdf_to_images.py - Converts madhubani.pdf into optimized web pages for the Portfolio Flip-Book.
Saves pages as WebP to public/portfolio-pages/ and generates public/portfolio-pages/index.json
"""

import os
import json
import pymupdf
from PIL import Image

PDF_PATH = "madhubani.pdf"
OUT_DIR = "public/portfolio-pages"

def main():
    if not os.path.exists(PDF_PATH):
        print(f"Error: {PDF_PATH} not found.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    doc = pymupdf.open(PDF_PATH)
    total_pages = len(doc)
    print(f"Processing {total_pages} pages from {PDF_PATH}...")

    manifest = []

    for i in range(total_pages):
        page_num = i + 1
        page = doc[i]
        
        # 1.5x zoom provides crisp 150-200 DPI without massive file sizes
        pix = page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5))
        
        webp_filename = f"page-{page_num:02d}.webp"
        webp_path = os.path.join(OUT_DIR, webp_filename)
        thumb_filename = f"page-{page_num:02d}-thumb.webp"
        thumb_path = os.path.join(OUT_DIR, thumb_filename)

        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Save full page in WebP (max 1400px long edge, quality 82)
        img.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
        img.save(webp_path, "WEBP", quality=82, method=6)
        
        # Generate thumbnail for grid / flip-book slider (280px, quality 65)
        thumb = img.copy()
        thumb.thumbnail((320, 320), Image.Resampling.LANCZOS)
        thumb.save(thumb_path, "WEBP", quality=65)

        width, height = img.size
        manifest.append({
            "pageNumber": page_num,
            "imageUrl": f"/portfolio-pages/{webp_filename}",
            "thumbUrl": f"/portfolio-pages/{thumb_filename}",
            "width": width,
            "height": height,
            "aspectRatio": round(width / height, 3)
        })
        
        if page_num % 10 == 0 or page_num == total_pages:
            print(f"Rendered {page_num}/{total_pages} pages...")

    manifest_path = os.path.join(OUT_DIR, "index.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Done! {total_pages} pages saved to {OUT_DIR}/ and index.json created.")

if __name__ == "__main__":
    main()
