# Vernika Enterprises Codebase Map (REPO_MAP)
*Max 150 lines. Consult this map instead of listing or wandering the filesystem.*

## 1. App Router Public Pages & Routes (`src/app/`)
- `src/app/page.tsx` — ISR Homepage with HeaderBar, HomeScreen, Footer
- `src/app/shop/page.tsx` — ISR Shop Gallery catalog with category & style filtering
- `src/app/shop/[slug]/page.tsx` — SSG Product details (66 paths), JSON-LD, zoom, pincode estimate
- `src/app/shop/category/[category]/page.tsx` — SSG Category hub (`paintings`, `dupattas`, `bags_and_files`)
- `src/app/cart/page.tsx` — Client Cart screen backed by Zustand persistent storage
- `src/app/checkout/page.tsx` — Redirects to `/cart`
- `src/app/order/[id]/page.tsx` — Server-rendered printable Order Invoice / Bill of Supply
- `src/app/track/page.tsx` — Customer order tracking screen by Order ID or phone/email
- `src/app/about/page.tsx` — Editorial storytelling page on Natasha Gupta & Mithila heritage
- `src/app/about-the-art/page.tsx` — Redirects to `/about`
- `src/app/gallery/page.tsx` — Digital portfolio viewer with WebP page previews
- `src/app/contact/page.tsx` — Commission request and studio inquiry form
- `src/app/terms/page.tsx` — Draft Terms of Service policy
- `src/app/privacy/page.tsx` — Draft Privacy Policy
- `src/app/shipping/page.tsx` — Draft Shipping & Delivery Policy
- `src/app/returns/page.tsx` — Draft Returns & Refunds Policy
- `src/app/cancellation/page.tsx` — Draft Cancellation Policy
- `src/app/grievance/page.tsx` — Draft Grievance Redressal Mechanism & Officer Details
- `src/app/not-found.tsx` — Custom branded 404 page
- `src/app/error.tsx` — Custom client error boundary
- `src/app/loading.tsx` — Clean Mithila lotus loading skeleton
- `src/app/sitemap.xml/route.ts` — Dynamic XML sitemap generator
- `src/app/robots.txt/route.ts` — Robots.txt crawler directives

## 2. API Routes (`src/app/api/`)
- `src/app/api/products/route.ts` — GET /api/products (cached catalog query)
- `src/app/api/availability/route.ts` — GET/POST /api/availability (uncached stock check + lazy expired release)
- `src/app/api/checkout/route.ts` — POST /api/checkout (atomic inventory reservation & order initialization)
- `src/app/api/payment/verify/route.ts` — POST /api/payment/verify (Razorpay HMAC signature verification)
- `src/app/api/webhooks/razorpay/route.ts` — POST /api/webhooks/razorpay (Idempotent capture & failure release)
- `src/app/api/otp/send/route.ts` — POST /api/otp/send (COD email OTP generator)
- `src/app/api/otp/verify/route.ts` — POST /api/otp/verify (COD OTP validation with 5-attempt lockout)
- `src/app/api/orders/track/route.ts` — POST /api/orders/track (Rate-limited order status lookup)
- `src/app/api/contact/route.ts` — POST /api/contact (Saves custom commission requests to DB)
- `src/app/api/cron/release-abandoned-orders/route.ts` — GET cron trigger for 15-minute stock release
- `src/app/api/admin/auth/route.ts` — POST /api/admin/auth (timing-safe login, bcrypt compare, session cookie)
- `src/app/api/admin/products/route.ts` — GET/POST/PUT/DELETE /api/admin/products (Protected CRUD)
- `src/app/api/admin/orders/route.ts` — GET/PATCH /api/admin/orders (Protected order status updates)
- `src/app/api/admin/settings/route.ts` — GET/PUT /api/admin/settings (Protected dynamic configuration)
- `src/app/api/admin/cloudinary-sign/route.ts` — POST /api/admin/cloudinary-sign (Protected signed uploads)
- `src/app/api/admin/export/route.ts` — GET /api/admin/export (Protected CSV order export)

## 3. Data Models (`src/models/`)
- `src/models/Product.ts` — MongoDB schema with text, category, style, and slug indexes
- `src/models/Order.ts` — MongoDB schema for orders, integer paise pricing, tracking, and items
- `src/models/User.ts` — Admin user credentials schema
- `src/models/Otp.ts` — TTL-indexed COD OTP schema with attempt tracking
- `src/models/Settings.ts` — Dynamic site settings schema (shipping, COD fees, contact, GSTIN)
- `src/models/Inquiry.ts` — Commission & contact inquiry schema

## 4. Core Libraries (`src/lib/`)
- `src/lib/db.ts` — Cached singleton Mongoose connection helper
- `src/lib/products.ts` — Product mapper and cached ISR loader
- `src/lib/settings.ts` — Dynamic settings loader with fallback defaults
- `src/lib/ratelimit.ts` — Sliding-window rate limiter (Upstash Redis + in-memory fallback)
- `src/lib/email.ts` — Resend email templates with development console fallback
- `src/lib/auth.ts` — Session cookie encryption and verification helpers
- `src/config/site.ts` — Brand configuration, seller city validation, contacts
- `src/config/catalog.ts` — Catalog categories and Mithila style definitions
- `src/store/cart-store.ts` — Zustand persistent shopping cart store

## 5. UI Components (`src/components/`)
- `src/components/HeaderBar.tsx` — Global navigation header with search and cart badge
- `src/components/Footer.tsx` — Global footer with newsletter and heritage disclaimers
- `src/components/MithilaMotif.tsx` — Hand-crafted SVG motif dividers and decorative elements
- `src/components/screens/HomeScreen.tsx` — Editorial hero, traditions, featured collection
- `src/components/screens/ShopGalleryScreen.tsx` — Catalog grid with sticky desktop/mobile filters
- `src/components/screens/ProductDetailScreen.tsx` — Gallery zoom, dimensions, lead time, Add to Bag
- `src/components/screens/CartCheckoutScreen.tsx` — Multi-step guest checkout, gift wrap, Razorpay & COD
- `src/components/screens/AdminDashboard.tsx` — Natasha's mobile-friendly control center

## 6. Scripts & Verification Tools (`scripts/`)
- `scripts/verify.ts` — Master test runner (`npm run verify`)
- `scripts/env_check.ts` — Environment and live connectivity verification (`npm run env:check`)
- `scripts/content_lint.ts` — Zero forbidden tokens & catalog integrity validator (`npm run content:lint`)
- `scripts/load_test.ts` — Autocannon high-concurrency load testing (`npm run load:test`)
- `scripts/admin_create.ts` — Secure bcrypt password hash generator (`npm run admin:create`)
- `scripts/seed.ts` — Seeds 66 products and indexes into MongoDB (`npm run seed`)

## 7. Tests (`tests/` & `e2e/`)
- `tests/pricing-and-cart.test.ts` — Integer paise calculations
- `tests/order-id.test.ts` — `VE-YYMMDD-####` ID generation tests
- `tests/razorpay.test.ts` — HMAC signature and production guard tests
- `tests/concurrency.test.ts` — 20 parallel buyers atomic stock contention test
- `tests/admin-security.test.ts` — 401 unauthenticated sweep on all 10 admin API endpoints
- `tests/nosql-injection.test.ts` — Resilience against `{"$ne": null}` and `$where` payloads
- `tests/data-integrity.test.ts` — Property-based 20 random basket test
- `e2e/store.spec.ts` — Playwright multi-step storefront and admin testing matrix
