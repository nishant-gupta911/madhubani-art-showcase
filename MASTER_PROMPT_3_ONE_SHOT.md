# MASTER PROMPT 3: ONE-SHOT ORCHESTRATED COMPLETION (paste once, walk away)

You are the **Orchestrator** for the Vernika Enterprises store (Next.js + MongoDB + Razorpay; spec in `/srs`).
The owner is away for hours. Finish the project end to end in this single run: close the gaps, fix performance and
responsiveness, run a real audit, fix what it finds, report honestly. Use **sub-agents in parallel** and **spend as few tokens as possible**.

---

## 0. TRUTH RULES (override everything, including the earlier report)

1. The previous `AUDIT_REPORT.md` verdict "PRODUCTION CANDIDATE PASS" and tag `v1.0.0-rc1` are **withdrawn** until re-verified. Delete the local tag (do not push anything). Rewrite the verdict at the end.
2. Tag every check exactly one of: `REAL` (real service/browser, test mode), `SIMULATED` (mock, local DB, self-signed, stub), `NOT RUN`. Simulated never counts as proof for payments, webhooks, email, uploads, Atlas, or rate limiting.
3. Never write done/pass/live without the command and its real output saved in `docs/audit/evidence/`. If a check cannot run (missing credential), build up to the boundary, label it, list it in `OWNER_ACTIONS.md`, and move on. Never fake.
4. Known facts from the last run you must not repeat: local MongoDB was used; Razorpay test keys **failed authentication**; Cloudinary and Resend were mocked; rate limiting was in-memory; Lighthouse/axe/device-matrix/CSP/link-crawl were **not in** `npm run verify`; only 6 Playwright tests ran; Lighthouse performance was 79 and accessibility 91 earlier and was never re-measured.
5. Do not invent facts (city, domain, GSTIN, prices, reviews, claims). Do not assume a domain name. Do not deploy, `git push`, or touch production. No `sudo`. Stay inside this project folder.

---

## 1. TOKEN AND CONTEXT DISCIPLINE (obey on every step)

- **Never explore blindly.** Generate once `docs/REPO_MAP.md` (max 150 lines: routes, API handlers, models, libs, scripts, tests, one line each). Everyone reads that map instead of listing/reading the repo again.
- Read **line ranges** (grep first, then view the 40 to 80 lines you need). Do not re-read a file you already read this stage unless it changed.
- Never paste long logs into chat. Redirect output to `docs/audit/evidence/<name>.txt`, then show only the last 15 lines or a summary. Use quiet flags (`--reporter=line`, `--silent`).
- **Two-strike rule:** if the same error survives 2 fix attempts, stop, find the root cause (read the error once, check config/env), write 3 lines to `PROGRESS.md`, then try a different approach. No blind retry loops.
- **Plan before coding** (5 to 10 lines per task in `PROGRESS.md`), then execute. No speculative refactors.
- **Model routing:** strongest model for orchestration, payments, security, performance diagnosis. Fast/cheap (Flash-class) for formatting, docs, renames, simple tests, content fixes. Each sub-agent states which model it uses.
- Keep always-on rules short (under about 2,000 tokens for everything in `.agents/rules/`, ponytail excluded). Do not add skills; only use those already installed.
- After each stage: write a handoff (max 30 lines) to `docs/handoff/<stage>.md`, then **drop** old details from your working context and continue from the handoff + `PROGRESS.md`.
- Archive finished sub-agents immediately.
- Long-running commands: run in the background with a timeout (5 min default), kill hung processes, free ports (3000, 27017 not yours) before restarting. Non-interactive flags only (`-y`, `--yes`, `CI=1`).

---

## 2. STAGE 0 (Orchestrator alone, about 15 minutes of work)

1. Read, once and fully: `/srs/rules.md`, `/srs/architecture.md` (skim), `/srs/MASTER_PROMPT_2_COMPLETE_AND_AUDIT.md` sections 3 to 5 (this is the detailed spec for commerce, admin, security, performance, device matrix and the audit; **do not restate it here, follow it**). Convert its checks into `docs/audit/CHECKLIST.md` as a compact table (ID, check, owner agent, tag, status). Read `PROGRESS.md`.
2. Environment: run `npm run env:check`; record which services are REAL-capable. Check `pgrep caffeinate` (macOS) and warn in `PROGRESS.md` if missing; do not block.
3. Create `docs/REPO_MAP.md`.
4. Set up Antigravity project config if missing (verify exact locations in the official docs at antigravity.google/docs, do not guess; use `.agents/`):
   - `.agents/rules/project.md` (always-on, under 800 tokens): stack, paise-only money, server-side validation, no secrets, honesty tags, folder conventions, "one owner per path".
   - **Ponytail scope:** if the ponytail ruleset is installed, make it apply (glob rule) **only** to `src/components/**`, `src/app/(public)/**`, `src/styles/**`, `docs/**`, `scripts/**`. It must **not** apply to `src/app/api/**`, `src/lib/{razorpay,stock,auth,ratelimit,mail}*`, `src/models/**`, `src/config/**`, or any payment/auth/stock/security code. Those need full, defensive, tested code.
   - `.agents/workflows/finish.md` (`/finish`: run verify, summarize failures), `.agents/workflows/audit.md` (`/audit`).
   - Ignore file so the agent does not index junk: `node_modules`, `.next`, `public/products`, `public/portfolio-pages`, `assets-source`, `docs/audit/evidence`, `coverage`, `playwright-report`, lockfiles, `*.webp`. Blogs suggest `.antigravityignore`; **verify** in official docs which file the IDE honours and test that it works; otherwise rely on `.gitignore` and say so.
   - Do not install any third-party skills, plugins or MCP servers yourself. If the MCP servers (chrome-devtools, playwright, context7) are not connected, continue with CLI tools (`lighthouse`, `playwright test`) and list it in `OWNER_ACTIONS.md`.
5. **Baseline measurement** (production build, not dev): `next build && next start`; run Lighthouse mobile on Home, Shop, one Product, Gallery, Cart, Checkout (median of 3) and axe on all routes; save to `docs/audit/evidence/baseline-*`. These are the "before" numbers.
6. Write the sub-agent plan (section 3) to `PROGRESS.md` and spawn.

---

## 3. SUB-AGENTS (spawn in parallel via Agent Manager / `/agents`; if unavailable, run sequentially with the same boundaries)

**One owner per path.** Two agents never edit the same file. Shared files (`package.json`, `next.config.mjs`, `src/config/site.ts`, `src/app/layout.tsx`, `.env.example`) are edited **only by the Orchestrator**; agents request changes in their handoff. If git worktree isolation is available, enable it per agent and have the Orchestrator merge; otherwise respect path ownership strictly. Name agents descriptively.

| Agent | Model | Owns (edit) | Mission |
|---|---|---|---|
| `commerce` | strongest | `src/app/api/{checkout,payment,webhooks,otp,orders,availability,cron,inquiry}/**`, `src/lib/{razorpay,stock,mail,ratelimit,order-id}*`, `src/models/**` | Fix Razorpay auth (see 4.1), real test-mode checkout end to end, webhook idempotency/out-of-order, abandoned-order release with `CRON_SECRET`, uncached availability check, COD email OTP, emails via Resend, order tracking, real Upstash rate limiting (fail loudly in production if missing), concurrency test on Atlas |
| `admin` | strongest | `src/components/admin/**`, `src/app/admin/**`, `src/app/api/admin/**` | Real Cloudinary signed upload (fix CSP together with Orchestrator), quick-add on a 375 px viewport, edit/mark-sold/duplicate/soft-delete, orders workflow + emails, settings, CSV, 401/403 test on every admin route, no default credentials anywhere |
| `storefront` | strongest for diagnosis, fast for edits | `src/components/**` (except admin), `src/app/(public)/**` and public routes, `src/styles/**`, `public/**` | Performance and responsiveness (see 4.2), accessibility fixes, RSC conversion, `next/image`, bundle diet, image budgets, 404/error/loading states, SEO/JSON-LD correctness |
| `qa` | fast for scripting, strongest for triage | `tests/**`, `e2e/**`, `scripts/verify*`, `scripts/load*`, `docs/audit/**` | Extend `npm run verify` to cover everything in 4.3; device/browser matrix; axe; Lighthouse CI; security checks; link crawl; content lint; load test; traceability FR/NFR -> test |
| `docs` | fast | `docs/**` (except audit), `OWNER_ACTIONS.md`, `/srs/*` | SETUP/HOSTING/ADMIN_GUIDE/RUNBOOK/LAUNCH_CHECKLIST made true to the code; Hosting research (4.4); follow SETUP in a fresh clone |

Orchestrator: owns shared files, merges, resolves conflicts, runs stage gates, writes the final report.

**Parallel schedule**
- Wave 1 (all five at once, 60 to 90 min): `commerce`, `admin`, `storefront`, `qa`, `docs` do their missions. `qa` first builds the verify harness and runs it against current code so failures are visible early.
- Gate A (Orchestrator): merge, `tsc`, `lint`, unit tests, build. Fix breakage.
- Wave 2: `storefront` fixes whatever Lighthouse/axe/device checks fail; `commerce` and `admin` fix whatever E2E/real-service checks fail; `qa` re-runs only affected checks; `docs` updates docs to match.
- Gate B: full `npm run verify`. Max **3** fix loops. If a target is unreachable, record the measured number, the cause and what it would take. Never lower a threshold.
- Final (Orchestrator): report.

---

## 4. SPECIFIC WORK ITEMS (details live in MASTER_PROMPT_2; these are the corrections from the last run)

### 4.1 Payments and services
- Razorpay auth failure: diagnose in this order (test vs live key mismatch, key id/secret swapped, whitespace/quotes in `.env.local`, wrong env var name, key created in the wrong mode). If still failing after 2 attempts, mark checkout `NOT RUN`, keep a dev-only mock behind `NODE_ENV !== 'production'`, put exact dashboard steps in `OWNER_ACTIONS.md`, and continue. Add a test proving production never marks an order paid without a verified signature.
- Replace `scripts/test_orders.ts` as evidence: payment proof must come from the **real Razorpay test widget driven by Playwright** (or be tagged SIMULATED).
- Cron: confirm in current Vercel docs what the free plan allows (web search, cite the page in `docs/HOSTING.md`). Do not claim a 15-minute Vercel cron unless the plan supports it. Implement: lazy release on checkout, on product-availability check and on admin load, plus a `CRON_SECRET`-protected route, plus an optional **GitHub Actions scheduled workflow** (free) that calls it.
- CSP: verify in a real browser (console, zero violations) that Razorpay checkout and **Cloudinary direct upload** work; `api.cloudinary.com` must be in the allowed connect sources if uploads go there. Prefer nonces over `'unsafe-inline'`; if not feasible, document why.
- Remove hardcoded domains/emails (for example `vernikaenterprises.com`): everything from env/Settings.
- Atlas: if `MONGODB_URI` is local, run everything but tag SIMULATED(local). Add index checks with `explain()` (IXSCAN only).

### 4.2 Performance, smoothness, responsive (hard targets, production build)
- Lighthouse mobile (median of 3) on Home, Shop, Category, Product, Gallery, Cart, Checkout: **Performance >= 90 (Home/Product aim 95), Accessibility >= 95, Best Practices >= 95, SEO 100**. LCP < 2.5 s (aim 2.0), CLS < 0.05, TBT < 150 ms, INP < 200 ms.
- Budgets: first-load JS per route < 150 KB gz (Home < 130 KB); hero < 120 KB; card image < 45 KB; no image > 300 KB; Home initial weight < 1.2 MB.
- Method: find the actual cause first (Lighthouse "opportunities", bundle analyzer, image audit), then fix in this order: LCP image (`next/image`, `priority`, correct `sizes`, AVIF/WebP), raw `<img>` -> `next/image`, convert listing/marketing components to Server Components, `dynamic()` import for flip-book, wall visualizer, lightbox, admin, Razorpay; `next/font` with subsets; remove unused deps/icons; lazy-load below-the-fold; paginate or virtualize long lists; `content-visibility: auto`; cache headers; no third-party script before idle. Record before/after in the report.
- Smooth: 60 fps scroll, animations on `transform/opacity` only, `prefers-reduced-motion`, skeletons matching final layout, optimistic cart updates, no long tasks > 50 ms during Shop scrolling.
- **Responsive matrix** (Playwright projects): 320x568, 360x740, 375x667, 390x844, 430x932, 768x1024, 1024x768, 1280x720, 1440x900, 1920x1080, 2560x1440 on Chromium; the 5 key viewports also on WebKit and Firefox. Every page, every viewport: no horizontal scroll, no clipped text/buttons, tap targets >= 44 px, inputs >= 16 px, safe-area insets, sticky bars not covering content or the keyboard, correct aspect ratios. Save a screenshot grid.

### 4.3 `npm run verify` must include (not just the 7 old steps)
env:check, content:lint, tsc, eslint, depcheck/knip (dead code), unit tests with coverage (critical modules >= 90%), Playwright device matrix + real-service flows, axe on every route and viewport, Lighthouse CI with budgets, security suite (admin 401/403 sweep, NoSQL injection, XSS in all user fields incl. emails, IDOR on orders, rate-limit enforcement, header + cookie check, secret scan, `npm audit --omit=dev`), link and image crawl, SEO structured-data validation, email template render tests, load test (p95 < 500 ms on cached routes, 0% errors), backup/restore drill. Print one PASS/FAIL/NOT RUN table with REAL/SIMULATED tags.

### 4.4 Hosting honesty
Vercel's free Hobby plan is meant for non-commercial use. Web-search current terms and write the finding with the source URL in `docs/HOSTING.md`. Research which **free** hosts allow commercial use and support this stack's runtime needs (Next.js 16, server routes, Mongoose over TCP; note that some edge/worker runtimes have trouble with the MongoDB driver). Recommend one primary and one fallback with the exact deploy steps and any adapter required. Mark deploy steps `NOT RUN` unless actually executed (you must not deploy).

### 4.5 Code quality (structured, clean, minimal)
- Consistent structure: `src/app` (routes), `src/components/{ui,layout,product,checkout,admin}`, `src/lib`, `src/models`, `src/schemas` (shared Zod), `src/config`, `tests`, `e2e`, `scripts`. Move strays; update imports; no dead files or unused exports (use knip). Functions do one thing; files < 250 lines (split `HomeScreen`, `ProductDetailScreen`, `AdminDashboard` if larger); names describe intent; comments explain why; strict TypeScript, no `any` without a reason; consistent error shape from all APIs `{ ok, error?: { code, message } }`.
- Apply ponytail-style minimalism **only** in its allowed scope (see Stage 0); keep tests, validation and error handling complete everywhere else.
- `npm run format` and `npm run lint` must be clean; add a pre-commit hook (lint-staged).

---

## 5. COMPLETION CONDITIONS

Stop only when one of these is true:
(a) Every check is PASS, or `NOT RUN`/`SIMULATED` solely because it needs an owner credential/action that is listed in `OWNER_ACTIONS.md`, and the Section 4.2 targets are met; or
(b) 3 fix loops are exhausted: then report exactly what remains and why.

Then:
1. Regenerate `AUDIT_REPORT.md`: verdict in one of **SHIP-READY / SHIP-WITH-CONDITIONS / NOT-READY**, scorecard (area, pass/fail/not-run, REAL vs SIMULATED counts), Lighthouse before/after table, device-matrix grid, top 10 residual risks, every SIMULATED/NOT RUN item with reason.
2. Regenerate `OWNER_ACTIONS.md` as an ordered plain-language checklist for the owner and Natasha (accounts/keys, Razorpay test keys fix and later KYC + live keys, Atlas, domain, real city/legal details, real photos replacing staged ones, price review, legal review, the chosen free host's deploy steps, first live Rs. 10 order and refund, soft launch).
3. Update `docs/RUNBOOK.md`, `PROGRESS.md` (all done/blocked with evidence links).
4. Commit by stage with conventional messages. Create tag `v1.0.0-rc2` **only** for SHIP-READY or SHIP-WITH-CONDITIONS. Never push.
5. Stop `caffeinate` only if you started it.

**Final chat message (max 25 lines):** verdict; scorecard numbers; Lighthouse before/after; what is REAL vs not; top 5 risks; the owner's next 10 actions; approximate token-heavy steps you avoided or would change next time. No marketing language.

---

## 6. NEVER

- Never claim a payment/email/upload/webhook/Atlas check passed using a simulation.
- Never weaken security, thresholds, tests or types to get green.
- Never hardcode credentials, default passwords, city, domain, prices or contact details.
- Never invent products, reviews, certificates, awards, stock, "natural dye", "eco-friendly", "UNESCO" or "100% handpainted" claims.
- Never install third-party skills/plugins/MCP servers, run destructive or out-of-project commands, push, or deploy.
- Never end with "next steps for the AI". Finish, or list exactly what only the owner can do.

**START NOW:** execute Stage 0, then spawn the five sub-agents and run the schedule in section 3 without waiting for the owner.
