# Project Rules — Vernika Enterprises

## 1. Stack & Runtime
- Next.js 16 (App Router, RSC by default, `"use client"` only for interactivity)
- MongoDB Atlas with Mongoose (cached singleton connection in `src/lib/db.ts`)
- TypeScript (strict mode, zero unhandled errors, no `any` without justification)
- Tailwind CSS with design tokens defined in CSS variables (`--ivory`, `--vermilion`, `--ink`, etc.)

## 2. Integrity & Money Rules
- **Paise Only:** Store, calculate, and transmit money strictly as integers in paise (₹1,499 = 149900). Never use floating point math for currency.
- **Server Validates Everything:** Prices, stock availability, shipping fees, COD eligibility, and totals are recomputed server-side on checkout. Client payloads are never trusted.
- **Atomic Stock:** Original paintings have `stock = 1`. Always reserve stock via atomic MongoDB operators (`findOneAndUpdate` with `{ stock: { $gte: qty } }`).

## 3. Honesty & Verification Tags
- Every verification must be tagged `REAL`, `SIMULATED`, or `NOT RUN`.
- Never claim live payment, email, or cloud upload functionality when running against local mocks or stubs.
- No false claims, invented reviews, UNESCO accolades, or unverified claims.

## 4. Security & Secrets
- Never commit secrets or credentials. Use `.env.local` locally and environment variables in deployment.
- Server-side authorization required on every admin route (`/api/admin/*`).
- Timing-safe comparisons for authentication tokens and passwords.

## 5. Architecture & Ownership
- **One Owner Per Path:** During multi-agent work, each file is owned by exactly one agent. Shared configuration files (`package.json`, `next.config.mjs`, `src/config/site.ts`) are edited only by the Orchestrator.
- Folder conventions: `src/app` (pages/routes), `src/components` (UI), `src/lib` (utilities), `src/models` (database schemas), `src/config` (constants), `tests` (unit/integration), `e2e` (browser tests).
