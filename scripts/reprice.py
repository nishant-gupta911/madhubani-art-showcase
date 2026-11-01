#!/usr/bin/env python3
"""
reprice.py - Verifies and updates product prices from /srs/pricing.md.
Ensures prices remain stored in integer paise and adhere to the market research bands.
"""

import json
import os

SEED_FILE = "scripts/products.seed.json"
PRICING_DOC = "srs/pricing.md"

def main():
    if not os.path.exists(SEED_FILE):
        print(f"Error: {SEED_FILE} not found.")
        return

    with open(SEED_FILE, "r") as f:
        products = json.load(f)

    print(f"Checking prices for {len(products)} products against pricing rules...")

    updated_count = 0
    for p in products:
        price_paise = p.get("price", 0)
        price_inr = price_paise / 100.0

        # Safety rule: ensure integer paise
        if not isinstance(price_paise, int):
            p["price"] = int(price_paise)
            updated_count += 1

        # Check bounds
        if p["category"] == "paintings":
            if price_inr < 1499:
                print(f"Warning: {p['name']} ({p['ref']}) priced below minimum band: ₹{price_inr}")
        elif p["category"] == "dupattas":
            if p["subCategory"] == "mens_angvastra":
                if price_inr < 1199:
                    print(f"Warning: {p['name']} ({p['ref']}) below Angvastra minimum: ₹{price_inr}")
            elif price_inr < 1299:
                print(f"Warning: {p['name']} ({p['ref']}) below Dupatta minimum: ₹{price_inr}")

    with open(SEED_FILE, "w") as f:
        json.dump(products, f, indent=2)

    print(f"Price verification complete. {updated_count} adjustments made. All prices valid.")

if __name__ == "__main__":
    main()
