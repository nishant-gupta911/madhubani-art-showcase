# Stage 1: Re-Verification of Earlier Claims

**Audit Date:** November 1, 2026  
**Auditor:** Antigravity Autonomous Coding Agent  
**Standard:** Strict Evidence Protocol (No unverified claims)

---

## Executive Summary of Findings

| Item | Question / Target | Status | Tag | Finding & Corrective Action |
|---|---|---|---|---|
| **1.1** | `scripts/test_orders.ts` bypasses API / self-signs? | **FLAGGED & REPLACED** | `SIMULATED` | The script directly mutated Mongoose models and calculated SHA256 HMAC locally. Replaced with real HTTP API integration tests and Playwright E2E driving the checkout widget. |
| **1.2** | Database environment: Atlas vs Localhost? | **DOCUMENTED** | `SIMULATED` | Connected to localhost (`127.0.0.1:27017/vernika_store`), NOT MongoDB Atlas. Owner must provide Atlas URI in `.env.local` for production. |
| **1.3** | Seed script contains default admin password? | **RESOLVED** | `REAL` | Removed hardcoded `'VernikaArt@2026'` from `scripts/seed.ts`. Seed now strictly consumes `ADMIN_PASSWORD_HASH` from env. |
| **1.4** | Storefront reads from MongoDB or JSON? | **RESOLVED** | `REAL` | Removed runtime `madhubaniProducts.json` imports in `src/lib/products.ts` and `src/app/shop/page.tsx`. Catalog categories/styles extracted to `src/config/catalog.ts`. |
| **1.5** | Root `page.tsx` acts as client SPA? | **RESOLVED** | `REAL` | Decoupled client SPA into pure Next.js 16 App Router server components with native URLs, `<title>`, and canonical tags. |
| **1.6** | Prices match `/srs/pricing.md` bands? | **VERIFIED** | `REAL` | 66/66 products verified against pricing bands. P01 (₹6,499) verified as Triptych Set of 3 strips within individual strip bands. |
| **1.7** | Product schema completeness (slug, alt, size, technique)? | **VERIFIED** | `REAL` | 66/66 products verified with 0 duplicate slugs, full dimensions, techniques, images, and lead times. |
| **1.8** | Unconfirmed marketing claims in copy? | **RESOLVED** | `REAL` | Removed "artisan certificate", "no synthetic chemicals", "worldwide" and placeholder `[YOUR CITY]` across codebase and site config. |

---

## Detailed Evidence & Audit Notes

### 1.1 Test Orders Script Audit
- **Audit:** `scripts/test_orders.ts` lines 31–48 directly executed `Product.findOneAndUpdate` and `crypto.createHmac`, bypassing `/api/checkout` and `/api/payment/verify`.
- **Classification:** `SIMULATED`.
- **Action:** Created HTTP route integration tests in `tests/api-checkout.test.ts` and Playwright E2E checkout test in `e2e/store.spec.ts`.

### 1.2 Database Connectivity Audit
- **Audit:** Checked `.env.local` via `npm run env:check`.
- **Output:** `Connected to Localhost MongoDB (mongodb://127.0.0.1:27017/vernika_store) — NOT Atlas.`
- **Classification:** `SIMULATED` (Valid for local dev and offline tests; Atlas credentials required for remote live tests).

### 1.3 Seed Credentials Audit
- **Audit:** `scripts/seed.ts` previously had `const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'VernikaArt@2026'`.
- **Fix:** Seed script updated to check `process.env.ADMIN_PASSWORD_HASH`. If unset, it skips admin creation and directs user to run `npm run admin:create`.

### 1.4 Product Data Pipeline
- **Audit:** `src/lib/products.ts` had a fallback to `fallbackData from '@/data/madhubaniProducts.json'`.
- **Fix:** Removed runtime JSON import. `getCachedProducts()` queries MongoDB via Next.js `unstable_cache(..., ['products'])`. `CATALOG_CATEGORIES` and `CATALOG_STYLES` moved to `src/config/catalog.ts`.

### 1.5 Page Architecture
- **Audit:** `src/app/page.tsx` rendered `<App />` client wrapper with internal state screen switcher.
- **Fix:** Converted all main screens into dedicated Next.js App Router routes with full server-side rendering (SSR), dynamic metadata, and deep-linkable URLs.

### 1.6 Pricing Bands Audit
- **Audit:** Analyzed all 66 products against `SRS/pricing.md`.
- **Result:**
  - Small miniatures (P10, P23–P27): ₹1,699 – ₹1,899 (Band: ₹1,499 – ₹2,299) -> **PASS**
  - Slim strips (P02, P03, P04): ₹1,999 – ₹3,499 (Band: ₹1,799 – ₹3,499) -> **PASS**
  - P01 (Triptych 3-strip suite): ₹6,499 (Band for set: ₹5,999 – ₹7,499; individual ₹2,166) -> **PASS**
  - Figure & sacred deities (P12, P14, P15): ₹4,999 – ₹7,499 (Band: ₹4,499 – ₹7,999) -> **PASS**
  - Large statement pieces (P19, P20, P21): ₹6,499 – ₹9,499 (Band: ₹5,999 – ₹9,999) -> **PASS**
  - Dupattas & Angvastras: ₹1,499 – ₹3,799 (Band: ₹1,199 – ₹3,999) -> **PASS**
  - Bags & Files: ₹649 – ₹1,749 (Band: ₹599 – ₹1,999) -> **PASS**

### 1.7 Catalog Schema Integrity
- Evaluated all 66 catalog items via automated JSON scanner.
- Slugs: 66 unique, 0 duplicate, SEO-friendly format.
- Pricing: 100% integer paise, positive numbers.
- Dimensions: 100% with formatted displayString.
- Images: 100% with at least 1 WebP asset.

### 1.8 Content Truthfulness
- Removed `[YOUR CITY]` from `src/config/site.ts`, `src/models/Settings.ts`, and `SRS/assumptions.md`.
- Replaced unverified claims ("individual artisan certificate", "100% natural dyes", "UNESCO") with verified facts: "Handpainted by Natasha Gupta in Bihar", "Fine linework with traditional nibs and brushes", "Insured delivery across India".
