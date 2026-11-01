#!/usr/bin/env python3
"""
sync_data_to_src.py - Syncs scripts/products.seed.json and siteConfig into src/data/madhubaniProducts.json
Ensures the UI immediately displays the 100% verified catalog with accurate images, prices, and categories.
"""

import json
import os

SEED_FILE = "scripts/products.seed.json"
CATALOG_MAP_FILE = "scripts/catalog-map.json"
TARGET_FILE = "src/data/madhubaniProducts.json"

def main():
    with open(SEED_FILE, "r") as f:
        products = json.load(f)

    with open(CATALOG_MAP_FILE, "r") as f:
        catalog_map = json.load(f)

    # Categories structure aligned with master prompt
    categories = [
        {
            "id": "paintings",
            "name": "Madhubani Paintings (Framed)",
            "short": "Paintings",
            "icon": "Frame",
            "count": len([p for p in products if p["category"] == "paintings"])
        },
        {
            "id": "dupattas",
            "name": "Dupattas & Angvastras",
            "short": "Dupattas",
            "icon": "Sparkles",
            "count": len([p for p in products if p["category"] == "dupattas"])
        },
        {
            "id": "bags_and_files",
            "name": "Bags, Purses & Files",
            "short": "Bags & Files",
            "icon": "Briefcase",
            "count": len([p for p in products if p["category"] == "bags_and_files"])
        }
    ]

    # Map each product to format expected by UI screens
    ui_products = []
    for p in products:
        hero_img = next((img for img in p["images"] if img.get("isHero")), p["images"][0])
        hero_filename = hero_img["filename"]
        base_name = os.path.splitext(hero_filename)[0]

        ui_p = {
            "id": p["id"],
            "ref": p["ref"],
            "title": p["name"],
            "name": p["name"],
            "slug": p["slug"],
            "category": p["category"],
            "subCategory": p["subCategory"],
            "categoryName": "Paintings" if p["category"] == "paintings" else ("Dupattas & Angvastras" if p["category"] == "dupattas" else "Bags & Files"),
            "categoryShort": "Paintings" if p["category"] == "paintings" else ("Dupattas" if p["category"] == "dupattas" else "Bags"),
            "price": p["price"] // 100, # Display in Rupees
            "pricePaise": p["price"],
            "compareAtPrice": (p["compareAtPrice"] // 100) if p.get("compareAtPrice") else None,
            "filename": hero_filename,
            "image": f"/products/{base_name}.webp",
            "cardImage": f"/products/{base_name}-card.webp",
            "galleryImages": [f"/products/{os.path.splitext(img['filename'])[0]}.webp" for img in p["images"]],
            "shortDescription": p["description"][:120] + "...",
            "longDescription": p["description"],
            "story": p["story"],
            "dimensions": p["dimensions"]["displayString"],
            "medium": p.get("paintMedium") or ("Fabric / Acrylic colors" if p["category"] != "paintings" else "Fine nib pen and pigments"),
            "material": p["material"],
            "technique": p["technique"],
            "type": p["type"],
            "stock": p["stock"],
            "leadTimeDays": p.get("leadTimeDays", 7),
            "isFramed": p.get("isFramed", False),
            "isFeatured": p["featured"],
            "isNew": p["ref"] in ("P01", "P02", "P12", "P20", "D01", "D13", "B03", "B09", "B10"),
            "tags": p["tags"]
        }
        ui_products.append(ui_p)

    output = {
        "brand": {
            "name": "Vernika Enterprises",
            "tagline": "Madhubani art, handpainted by Natasha Gupta",
            "phone": "+91 78709 09889",
            "whatsapp": "https://wa.me/917870909889",
            "email": "vernikaenterprises14@gmail.com"
        },
        "totalProducts": len(ui_products),
        "categories": categories,
        "styles": ["Bharni", "Kachni", "Tantrik", "Godna", "Kohbar"],
        "products": ui_products
    }

    with open(TARGET_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Synced {len(ui_products)} verified products to {TARGET_FILE} successfully!")

if __name__ == "__main__":
    main()
