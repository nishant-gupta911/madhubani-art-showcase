---
description: Perform environment check, catalog lint, security scan, and load benchmark
---

1. Execute environment connectivity audit:
   ```bash
   npm run env:check
   ```
2. Execute content & catalog truthfulness lint:
   ```bash
   npm run content:lint
   ```
3. Run security dependency audit:
   ```bash
   npm audit --omit=dev
   ```
4. Run load test:
   ```bash
   npm run load:test
   ```
5. Report findings and update `docs/audit/CHECKLIST.md`.
