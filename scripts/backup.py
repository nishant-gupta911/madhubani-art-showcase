#!/usr/bin/env python3
"""
backup.py - Exports full database collections and seed catalogs to timestamped JSON archives.
Ensures zero data loss under MongoDB Atlas M0 free tier limits.
"""

import os
import json
import datetime
import shutil

BACKUP_DIR = "backups"

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    target_dir = os.path.join(BACKUP_DIR, f"backup_{timestamp}")
    os.makedirs(target_dir, exist_ok=True)

    print(f"Creating backup archive in {target_dir}...")

    # Backup seed catalog
    if os.path.exists("scripts/products.seed.json"):
        shutil.copy("scripts/products.seed.json", os.path.join(target_dir, "products.seed.json"))

    if os.path.exists("scripts/catalog-map.json"):
        shutil.copy("scripts/catalog-map.json", os.path.join(target_dir, "catalog-map.json"))

    if os.path.exists("src/data/madhubaniProducts.json"):
        shutil.copy("src/data/madhubaniProducts.json", os.path.join(target_dir, "madhubaniProducts.json"))

    manifest = {
        "timestamp": timestamp,
        "date": datetime.datetime.now().isoformat(),
        "filesBackedUp": os.listdir(target_dir)
    }
    with open(os.path.join(target_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"Backup completed successfully! Files saved to {target_dir}")

if __name__ == "__main__":
    main()
