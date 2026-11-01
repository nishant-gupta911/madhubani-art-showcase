# SRS Changelog

## [2026-10-31] - Master Prompt Alignment & Catalog Synthesis

### Added
- Created `/srs/assumptions.md` with explicit legal, fulfillment, currency, and architecture assumptions.
- Created `/srs/pricing.md` featuring market-researched pricing bands, seed prices in paise, shipping thresholds, and COD convenience fees.
- Created `/srs/catalog.md` establishing the 1-to-1 mapping of all 84 images in `madhubani.pdf` and `/madu/` to real products.
- Created `/scripts/catalog-map.json` and `/scripts/products.seed.json` with 66 complete products.

### Changed
- Replaced temporary brand names with **Vernika Enterprises** and tagline "Madhubani art, handpainted by Natasha Gupta".
- Updated contact details everywhere to Phone/WhatsApp `+91 7870909889` and Email `vernikaenterprises14@gmail.com`.
- Corrected marketing claims: Madhubani art is GI-tagged (Geographical Indication) under Indian Law; removed erroneous "UNESCO" claims found in catalog graphics.
- Structured categories into 3 top-level classifications: Madhubani Paintings, Dupattas and Angvastras, Bags and Files.
- Configured money representation to integers in paise (INR).
