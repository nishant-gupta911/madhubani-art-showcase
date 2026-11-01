# Ponytail Scope Rule

Apply ponytail minimalist patterns (lean code, standard library, minimal abstractions) **ONLY** within these paths:
- `src/components/**`
- `src/styles/**`
- `docs/**`
- `scripts/**`

**STRICT EXCLUSIONS (Do NOT apply ponytail shortcuts here):**
- `src/app/api/**`
- `src/lib/razorpay*`
- `src/lib/stock*`
- `src/lib/auth*`
- `src/lib/ratelimit*`
- `src/lib/email*`
- `src/models/**`
- `src/config/**`
- Any payment, authentication, concurrency, or cryptographic code. These require full defensive engineering, comprehensive error handling, and complete test suites.
