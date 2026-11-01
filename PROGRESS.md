# Vernika Enterprises — Master Progress Tracking (Orchestrator Run)
**Reference:** `MASTER_PROMPT_3_ONE_SHOT.md`  
**Caffeinate Status:** ⚠️ `caffeinate` is NOT running in macOS processes. (Reminder: run `caffeinate -dimsu` in a separate terminal window to prevent Mac from sleeping).  
**Initial Baseline Lighthouse Scores:**
- Home: Perf 88 | A11y 91 | Best 96 | SEO 100 | LCP: 3774ms
- Shop: Perf 89 | A11y 88 | Best 96 | SEO 100 | LCP: 3797ms
- Product: Perf 76 | A11y 96 | Best 96 | SEO 100 | LCP: 6764ms
- Gallery: Perf 88 | A11y 94 | Best 96 | SEO 100 | LCP: 3895ms
- Cart: Perf 99 | A11y 95 | Best 96 | SEO 100 | LCP: 909ms

---

## Stage 0: Orchestrator Initialization
- [x] Deleted withdrawn local tag `v1.0.0-rc1`
- [x] Read `/srs/rules.md` and `/srs/architecture.md`
- [x] Ran `npm run env:check` (Reported REAL vs SIMULATED capability)
- [x] Generated `docs/audit/CHECKLIST.md`
- [x] Generated `docs/REPO_MAP.md` (compact codebase guide)
- [x] Created `.agents/rules/project.md` and `.agents/rules/ponytail-scope.md`
- [x] Created `.agents/workflows/finish.md` and `.agents/workflows/audit.md`
- [x] Created `.antigravityignore` and updated `.gitignore`
- [x] Captured production baseline Lighthouse mobile metrics (`docs/audit/evidence/baseline-lighthouse.*`)

---

## Wave 1: Sub-Agent Missions & Work Allocations

### 1. `storefront` Mission
- Target: Lighthouse Mobile Perf >= 90 (Home/Product >= 95), A11y >= 95, Best Practices >= 95, SEO 100. LCP < 2.5s.
- Replace raw `<img>` tags with optimized `next/image` using `sizes`, `priority` on above-the-fold heroes.
- Fix button aria-labels, touch target sizes (>= 44px), form input sizes (>= 16px).
- Dynamic code splitting for heavy modals and below-the-fold visualizers.
- Optimize Gallery and Product detail pages for mobile LCP.

### 2. `commerce` Mission
- Hardened Razorpay production safeguards: fail loudly if invalid in production; maintain test/dev fallback.
- Uncached availability endpoint with automatic lazy-release of expired order reservations.
- Webhook idempotency and handling of `payment.failed` stock restoration.
- COD email OTP with 5-attempt rate-limiting and temporary lockout.
- Order tracking rate limits with generic error responses.
- Resend email templates with fallback.

### 3. `admin` Mission
- Cloudinary signed upload integration with CSP validation.
- Quick-add artwork form tested on 375px mobile viewports.
- Product edit, duplicate, soft-delete, and draft/publish toggle.
- Order management workflow, tracking number assignment, and CSV export.
- Server-side authorization verification on all `/api/admin/*` endpoints.

### 4. `qa` Mission
- Extend `npm run verify` to include:
  - Axe accessibility test across all key routes.
  - Multi-viewport responsive tests (320px to 1920px).
  - Security suite (admin 401/403 sweep, NoSQL injection, timing-safe auth).
  - Dependency audit (`npm audit --omit=dev`).
  - Content linting (`npm run content:lint`).
  - Concurrency & load testing.
- Requirements traceability matrix (`docs/audit/requirements-traceability.md`).

### 5. `docs` Mission
- Update `docs/HOSTING.md` with honest analysis of free commercial hosting (Cloudflare Pages, Netlify, Render, Railway vs Vercel terms).
- Update `OWNER_ACTIONS.md` and `docs/RUNBOOK.md` with verified, step-by-step instructions.
- Ensure all SRS docs reflect reality.

---

## Gate A: Integration & Build Verification
- [ ] TypeScript strict compilation (`npx tsc --noEmit`)
- [ ] ESLint check
- [ ] Unit & integration test execution (`npm test`)
- [ ] Production build (`npm run build`)

---

## Wave 2 & Gate B: Verification & Master Audit Report
- [ ] Post-optimization Lighthouse mobile re-measurement
- [ ] Comprehensive `npm run verify` execution
- [ ] Final `AUDIT_REPORT.md` generation with honesty verdict
- [ ] Tagging `v1.0.0-rc2` (if SHIP-READY or SHIP-WITH-CONDITIONS)
