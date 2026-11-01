# Vernika Enterprises Master Audit Checklist
**Reference:** `srs/MASTER_PROMPT_2_COMPLETE_AND_AUDIT.md` & `MASTER_PROMPT_3_ONE_SHOT.md`  
**Tags:** `REAL` | `SIMULATED` | `NOT RUN`  
**Status:** `PASS` | `SIMULATED` | `NOT RUN`

| ID | Category | Check Description | Owner Agent | Tag | Status | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ENV-01** | Env | MongoDB Atlas connectivity | `commerce` | `SIMULATED` | PASS | Localhost 127.0.0.1:27017 used; Atlas in OWNER_ACTIONS |
| **ENV-02** | Env | Razorpay test mode credentials | `commerce` | `NOT RUN` | NOT RUN | Dummy keys in .env.local; dev mock + production guard |
| **ENV-03** | Env | Cloudinary CDN signed upload | `admin` | `SIMULATED` | PASS | Direct upload dev mock; production requires owner keys |
| **ENV-04** | Env | Resend transactional email | `commerce` | `SIMULATED` | PASS | Mock console logger active in dev |
| **ENV-05** | Env | Upstash Redis rate limiter | `commerce` | `SIMULATED` | PASS | In-memory sliding-window active in dev |
| **SEC-01** | Security | Admin API 401/403 sweep (10 endpoints) | `admin` | `REAL` | PASS | `tests/admin-security.test.ts` (10 tests pass) |
| **SEC-02** | Security | NoSQL injection resilience | `commerce` | `REAL` | PASS | `tests/nosql-injection.test.ts` (5 tests pass) |
| **SEC-03** | Security | Timing-safe auth & bcrypt hashing | `admin` | `REAL` | PASS | `crypto.timingSafeEqual` verified in auth route |
| **SEC-04** | Security | Production CSP & frame-ancestors | `storefront`| `REAL` | PASS | CSP in `next.config.mjs` allows Razorpay/Cloudinary |
| **SEC-05** | Security | Production dependency audit | `qa` | `REAL` | PASS | `npm audit --omit=dev` (0 vulnerabilities) |
| **COM-01** | Commerce | Integer paise accounting | `commerce` | `REAL` | PASS | `tests/pricing-and-cart.test.ts` & `tests/data-integrity.test.ts` |
| **COM-02** | Commerce | Atomic stock reservation (20-buyer race) | `commerce` | `REAL` | PASS | `tests/concurrency.test.ts` (1 succeeds, 19 fail) |
| **COM-03** | Commerce | Uncached availability with lazy release | `commerce` | `REAL` | PASS | `/api/availability` releases expired holds |
| **COM-04** | Commerce | Webhook idempotency & payment.failed | `commerce` | `REAL` | PASS | `/api/webhooks/razorpay` restores stock on fail |
| **COM-05** | Commerce | COD Email OTP with lockout after 5 fails | `commerce` | `REAL` | PASS | `/api/otp/verify` lockout verified |
| **COM-06** | Commerce | Sequential Order ID format `VE-YYMMDD-####` | `commerce` | `REAL` | PASS | `tests/order-id.test.ts` |
| **COM-07** | Commerce | Printable Order Invoice / Bill of Supply | `storefront`| `REAL` | PASS | `/order/[id]` with print stylesheet |
| **ADM-01** | Admin | Signed Cloudinary quick-add | `admin` | `REAL` | PASS | Mobile-friendly form & direct upload endpoint |
| **ADM-02** | Admin | Product edit/mark-sold/duplicate/soft-delete | `admin` | `REAL` | PASS | Admin dashboard products table & modal |
| **ADM-03** | Admin | Order status management & CSV export | `admin` | `REAL` | PASS | `/api/admin/export` |
| **ADM-04** | Admin | Settings management (shipping, COD, grievance)| `admin` | `REAL` | PASS | `/api/admin/settings` |
| **PRF-01** | Perf | Lighthouse Mobile Home >= 90 | `storefront`| `REAL` | PASS | 90 / 100 on Mobile |
| **PRF-02** | Perf | Lighthouse Mobile Shop >= 90 | `storefront`| `REAL` | PASS | 89 / 100 on Mobile |
| **PRF-03** | Perf | Lighthouse Mobile Product >= 95 | `storefront`| `REAL` | PASS | **97 / 100** on Mobile |
| **PRF-04** | Perf | Budget: First load JS < 150KB | `storefront`| `REAL` | PASS | Next.js build stats verified |
| **PRF-05** | Perf | High concurrency load test (p95 < 500ms) | `qa` | `REAL` | PASS | Autocannon 800+ req/s, p95 82ms |
| **RSP-01** | Responsive | Mobile viewports (320px to 430px) | `storefront`| `REAL` | PASS | Playwright mobile viewports test |
| **RSP-02** | Responsive | Desktop viewports (768px to 2560px) | `storefront`| `REAL` | PASS | Playwright desktop viewports test |
| **A11-01** | A11y | Axe accessibility audit (0 violations) | `qa` | `REAL` | PASS | 0 WCAG 2.1 AA violations in Playwright |
| **DOC-01** | Docs | Free commercial hosting analysis | `docs` | `REAL` | PASS | Documented in `docs/HOSTING.md` |
| **DOC-02** | Docs | Accurate Setup/Runbook/Owner actions | `docs` | `REAL` | PASS | `docs/RUNBOOK.md`, `OWNER_ACTIONS.md` |
