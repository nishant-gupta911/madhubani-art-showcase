# Pricing Strategy & Seed Pricing Matrix

> Researched from live Indian artisan marketplaces (IndiaHandmade, iTokri, Memeraki, IndiaMART, HunarSetu).
> Positioned as **"Affordable Premium"**: above anonymous mass-market listings, accessible compared to luxury boutiques.
> All prices stored as integers in **paise** (e.g. ₹1,499 = 149900 paise).
> Prices are inclusive of all taxes (GST).

## 1. Product Price Bands

| Category / Product Group | Launch Price Band (₹) | Seed Launch Price (₹) | Seed (Paise) | Notes |
|---|---|---|---|---|
| **Paintings — Small Miniature (14-19 cm / 6-8 in)** (P10, P23–P27) | ₹1,499 – ₹2,299 | ₹1,699 – ₹1,899 | 169900 – 189900 | Framed, ready to hang. Small peacock/fish entry point |
| **Paintings — Slim Vertical Strips** (P01–P04, P16–P18) | ₹1,799 – ₹3,499 | ₹1,999 – ₹3,499 | 199900 – 349900 | P02 (11x26 in) statement strip at ₹3,499 |
| **Paintings — Medium Vertical Fish Mandalas** (P05–P09) | ₹3,499 – ₹4,499 | ₹3,999 – ₹4,299 | 399900 – 429900 | Singles ₹3,999; Triptych Set P08 at ₹10,499 (12% bundle saving) |
| **Paintings — Figures & Sacred Deities** (P12, P14, P15) | ₹4,499 – ₹7,999 | ₹4,999 – ₹7,499 | 499900 – 749900 | Kali P12 large format at ₹7,499; Bride P15 at ₹5,499 |
| **Paintings — Large Landscape / Statement Pieces** (P19–P22) | ₹5,999 – ₹9,999 | ₹6,499 – ₹9,499 | 649900 – 949900 | Grand Peacock P20 at ₹9,499; Kohbar P19 at ₹8,499 |
| **Dupattas — Fine Cotton, Classic Border** | ₹1,299 – ₹1,799 | ₹1,599 – ₹1,799 | 159900 – 179900 | 100% fine cotton, temple borders |
| **Dupattas — Full Painted Pallu & Detailed Border** | ₹1,999 – ₹2,799 | ₹2,199 – ₹2,799 | 219900 – 279900 | Mainstream sweet spot for festive gifting |
| **Dupattas — Premium Handloom / All-over Jaal** | ₹2,999 – ₹3,999 | ₹2,999 – ₹3,799 | 299900 – 379900 | D13 (Bird Grid Jaal) at ₹3,799; Silk blends |
| **Angvastras — Men's Ceremonial Stoles (Tussar Look)** | ₹1,199 – ₹1,799 | ₹1,499 | 149900 | 2.0 m x 55 cm, finished tassels |
| **Bags & Files — Hand-Painted File Folders** | ₹599 – ₹749 | ₹649 | 64900 | A4 / legal size, eco-friendly board |
| **Bags & Files — Hand-Painted Zipper Pouches (Set of 3)** | ₹899 – ₹1,199 | ₹999 | 99900 | Individual pouch ₹399 |
| **Bags & Files — Classic Canvas Tote Bags (18x14x4 in)** | ₹899 – ₹1,299 | ₹1,099 – ₹1,299 | 109900 – 129900 | Full fish/peacock mandala |
| **Bags & Files — Structured Leather-Base Tote Bags** | ₹1,299 – ₹1,599 | ₹1,449 | 144900 | Wipe-clean black faux leather bottom |
| **Bags & Files — Hand Purses & Handbags** | ₹999 – ₹1,499 | ₹1,099 – ₹1,399 | 109900 – 139900 | Blue silk bag with wooden handle: ₹1,399 |
| **Bags & Files — Padded Canvas Laptop Bag** | ₹1,499 – ₹1,999 | ₹1,749 | 174900 | Fits 15.6 in laptop, red faux leather trim |
| **Bags & Files — 3-Panel Wall Hanging Organizer (22x10 in)** | ₹1,199 – ₹1,499 | ₹1,349 | 134900 | 3 utility storage pockets |

## 2. Shipping & Payment Charges

- **Prepaid Shipping Standard:** ₹79 flat (free across India on orders ≥ ₹1,499)
- **Original Paintings:** Free shipping on all framed paintings regardless of order value
- **Cash on Delivery (COD):** ₹49 convenience fee; allowed on cart subtotals up to ₹3,000; requires OTP phone verification
- **Gift Wrapping Option:** ₹99 per order, includes handmade paper wrap & handwritten personalized gift note

## 3. Dynamic Repricing Script
The script `/scripts/reprice.ts` reads `/srs/pricing.md` and synchronizes the active catalog database.
