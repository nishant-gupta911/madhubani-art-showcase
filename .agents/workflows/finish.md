---
description: Run master verify audit, analyze results, and summarize failures
---

1. Execute the master verification suite:
   ```bash
   npm run verify
   ```
2. Inspect `docs/audit/evidence/verify-summary.txt`.
3. If any step failed, identify the failing test/file, analyze the root cause, and formulate a targeted fix.
4. Output a summary of pass/fail status and next required actions.
