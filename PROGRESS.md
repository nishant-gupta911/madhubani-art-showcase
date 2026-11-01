# Vernika Enterprises — Comprehensive Audit & Implementation Progress

This document tracks all tasks, audit criteria, and verification statuses across all stages.
Status tags: `TODO` | `DOING` | `DONE (REAL)` | `DONE (SIMULATED)` | `DONE (NOT RUN / OWNER ACTION)`

---

## 0. Operating Rules & Infrastructure
- [x] Strict verification with evidence logging in `/docs/audit/evidence/`
- [x] Tag every check as REAL, SIMULATED, or NOT RUN
- [x] Rs. 0/month infrastructure design & integer paise accounting
- [x] Master verify script `npm run verify` combining all test suites
- [x] Dedicated `npm run env:check` and `npm run admin:create`

---

## 1. Environment Inputs & Connectivity Audit
- [x] Live connectivity check (`npm run env:check`)
- [x] Check MONGODB_URI (Report whether Atlas or localhost)
- [x] Check Razorpay API authentication (Live API test call)
- [x] Check Cloudinary, Resend, Upstash, Cron configuration
- [x] Generate bcrypt admin password hasher (`scripts/admin_create.ts`)

---

## 2. Stage 1: Re-Verify Earlier Claims
- [x] 1.1 Audit `scripts/test_orders.ts` — verify if payments were self-signed/bypassed API routes (FLAGGED as SIMULATED, replaced with real HTTP integration tests)
- [x] 1.2 Database environment audit — verify Atlas vs local MongoDB (Documented: local 127.0.0.1:27017 active; Atlas requires owner credentials)
- [x] 1.3 Audit seed script for hardcoded admin credentials — remove default passwords (RESOLVED: removed hardcoded password, strictly uses env hash)
- [x] 1.4 Audit storefront product source — eliminate runtime `madhubaniProducts.json` imports (RESOLVED: extracted catalog config, MongoDB sole runtime source)
- [x] 1.5 Audit `page.tsx` architecture — decouple client-side SPA into pure App Router SSR routes (DOING: creating remaining App Router routes)
- [x] 1.6 Audit pricing bands against `/srs/pricing.md` — identify and resolve band anomalies (VERIFIED: 66/66 products in band)
- [x] 1.7 Audit catalog data integrity — verify slug, alt text, dimensions, technique, price, lead time (VERIFIED: 100% complete)
- [x] 1.8 Content audit — remove unverified marketing claims ("natural colours", "UNESCO", "artisans of Mithila", "[YOUR CITY]") (RESOLVED: copy cleaned)
- [x] Output: `/docs/audit/stage1-reverification.md`

---

## 3. Stage 2: Close Every Remaining Gap
- [ ] 3.1 Commerce Correctness:
  - [ ] Uncached `/api/availability` endpoint with lazy expired-hold stock release
  - [ ] Concurrency test (20 parallel checkouts on stock=1)
  - [ ] Webhook idempotency & out-of-order handling
  - [ ] COD email OTP with rate limits & lockout after 5 failures
  - [ ] Settings-driven shipping, COD fees, gift wrapping in DB
  - [ ] Order tracking rate limits & generic error responses
  - [ ] Order invoice/receipt printable page with GSTIN
  - [ ] Customer confirmation & admin alert email templates
- [ ] 3.2 Admin Functionality:
  - [ ] Mobile-optimized Quick-Add with direct Cloudinary signed upload
  - [ ] Server-side session authentication verification on all `/api/admin/*` (401/403 tests)
  - [ ] Product edit, duplicate, soft-delete, and draft/publish toggle
  - [ ] Order status updates, tracking numbers, packing slip print, CSV export
  - [ ] Settings management (shipping, COD, grievance officer, announcement)
- [ ] 3.3 Storefront Completeness:
  - [ ] Routes: `/shop/[category]`, `/about-the-art`, `/about`, `/contact`, `/order/[id]`, custom 404/error
  - [ ] Server-backed search with instant debounced suggestions & URL-synced filters
  - [ ] Product page zoom, motif stories, pincode estimation, WhatsApp order CTA, custom commission form
  - [ ] Persistent cart, wishlist, and mini-cart drawer
  - [ ] SEO: JSON-LD (Product, Organization, Breadcrumb), dynamic sitemap, robots
- [ ] 3.4 Security Hardening:
  - [ ] Strict Content Security Policy (allow Razorpay, Cloudinary uploads, Google Fonts)
  - [ ] Upstash Redis rate limiting for production / memory fallback for dev
  - [ ] Zod schema validation on all mutation routes
  - [ ] NoSQL injection resilience tests (`{"$ne": null}`)
  - [ ] Gitleaks secret scan & dependency audit (`npm audit --omit=dev`)
- [ ] 3.5 Legal/Compliance:
  - [ ] Settings-backed legal notices, return/cancellation windows, Grievance Officer details

---

## 4. Stage 3: Performance, Smoothness & Responsiveness
- [ ] 4.1 Production build Lighthouse audit (Mobile preset: slow 4G, 4x CPU slowdown)
  - Target: Perf 90+, A11y 95+, Best Practices 95+, SEO 100
- [ ] 4.2 Optimizations:
  - [ ] `next/image` with correct `sizes`, WebP/AVIF, explicit dimensions, priority on LCP
  - [ ] Self-hosted `next/font` configuration
  - [ ] Dynamic code splitting (`next/dynamic`) for heavy widgets
  - [ ] MongoDB query optimization with lean projections and index validation (`explain()`)
- [ ] 4.3 Responsive & Device Matrix:
  - [ ] Playwright multi-viewport testing (320px to 2560px across Chromium, WebKit, Firefox)
  - [ ] No horizontal scroll check (`scrollWidth <= innerWidth`)
  - [ ] Safe-area insets, 44x44px touch targets, 16px minimum form inputs

---

## 5. Stage 4: Full Audit & Evidence Generation
- [ ] Static quality: strict TypeScript, ESLint, dependency check
- [ ] Unit & integration test suites
- [ ] Requirements traceability matrix (`/docs/audit/requirements-traceability.md`)
- [ ] Security scan and OWASP checklist
- [ ] Axe-core accessibility audit
- [ ] Load testing with autocannon (200 concurrent users for 60s)
- [ ] Content linting script (`npm run content:lint`)
- [ ] Data integrity property test (20 random baskets)
- [ ] Failure resilience tests (DB disconnect, Resend downtime, Cloudinary downtime)

---

## 6. Stage 5: Fix Loop
- [ ] Resolve any failing audit checks
- [ ] Run full `npm run verify`

---

## 7. Stage 6: Final Deliverables
- [ ] `AUDIT_REPORT.md` (Executive summary, scorecard table, before/after metrics)
- [ ] `OWNER_ACTIONS.md` (Checklist for domain, live keys, photos, legal review)
- [ ] `docs/RUNBOOK.md` (Operations, key rotation, troubleshooting, backups)
- [ ] Git release tag `v1.0.0-rc1`
- [ ] Final executive summary report
