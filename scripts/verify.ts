import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface StepResult {
  step: string;
  command: string;
  status: 'PASS' | 'FAIL';
  tag: 'REAL' | 'SIMULATED';
  durationMs: number;
  details: string;
}

function runStep(name: string, command: string, tag: 'REAL' | 'SIMULATED' = 'REAL'): StepResult {
  const start = Date.now();
  console.log(`\n▶ [RUNNING] ${name} ...`);
  console.log(`  $ ${command}`);

  try {
    const stdout = execSync(command, { stdio: 'pipe', encoding: 'utf-8' });
    const durationMs = Date.now() - start;
    console.log(`✓ [PASS] ${name} (${(durationMs / 1000).toFixed(1)}s)`);
    return {
      step: name,
      command,
      status: 'PASS',
      tag,
      durationMs,
      details: stdout.slice(-200).trim(),
    };
  } catch (err: any) {
    const durationMs = Date.now() - start;
    console.error(`✗ [FAIL] ${name} (${(durationMs / 1000).toFixed(1)}s)`);
    const output = (err.stdout || err.stderr || err.message || '').slice(-300).trim();
    return {
      step: name,
      command,
      status: 'FAIL',
      tag,
      durationMs,
      details: output,
    };
  }
}

async function main() {
  console.log('========================================================================');
  console.log('           VERNIKA ENTERPRISES — COMPREHENSIVE MASTER AUDIT             ');
  console.log('========================================================================');

  const results: StepResult[] = [];

  // 1. Environment Connectivity Audit
  results.push(runStep('1. Environment & Connectivity Audit', 'npm run env:check', 'REAL'));

  // 2. Content & Catalog Integrity Lint
  results.push(runStep('2. Content & Catalog Truthfulness Lint', 'npm run content:lint', 'REAL'));

  // 3. Strict TypeScript Typecheck
  results.push(runStep('3. Strict TypeScript Compilation', 'npx tsc --noEmit', 'REAL'));

  // 4. Unit & Integration Test Suite (Pricing, Order IDs, Razorpay HMAC, Concurrency, Security)
  results.push(runStep('4. Vitest Unit & Integration Suites', 'npm test', 'REAL'));

  // 5. Playwright E2E Storefront & Admin Test Suite
  results.push(runStep('5. Playwright E2E Browser Matrix', 'npx playwright test', 'REAL'));

  // 6. High-Concurrency Load Test & Rate Limit Verification
  results.push(runStep('6. Autocannon Concurrency & Load Benchmark', 'npm run load:test', 'REAL'));

  // 7. Security Dependency Audit
  results.push(runStep('7. Production Dependency Security Audit', 'npm audit --omit=dev', 'REAL'));

  // 8. Database Backup & Restoration Drill
  results.push(runStep('8. Database Backup & Restore Drill', 'npx tsx scripts/backup_restore_drill.ts', 'REAL'));

  // 9. Full Route Link, Image & SEO Schema Crawl
  results.push(runStep('9. Full Route Link & SEO Schema Crawl', 'npx tsx scripts/link_and_seo_crawl.ts', 'REAL'));

  // Print Master Scorecard Table
  console.log('\n' + '='.repeat(85));
  console.log('                     MASTER VERIFICATION SCORECARD                      ');
  console.log('='.repeat(85));
  console.log(
    `${'STEP'.padEnd(42)} | ${'STATUS'.padEnd(6)} | ${'TAG'.padEnd(9)} | TIME`
  );
  console.log('-'.repeat(85));

  let allPassed = true;
  for (const r of results) {
    if (r.status === 'FAIL') allPassed = false;
    console.log(
      `${r.step.padEnd(42)} | ${r.status.padEnd(6)} | ${r.tag.padEnd(9)} | ${(r.durationMs / 1000).toFixed(1)}s`
    );
  }
  console.log('='.repeat(85));

  const totalTime = results.reduce((acc, r) => acc + r.durationMs, 0);
  console.log(`TOTAL AUDIT DURATION: ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`VERDICT: ${allPassed ? 'ALL AUDIT STEPS PASSED' : 'SOME AUDIT STEPS FAILED'}\n`);

  // Save evidence
  const evidenceDir = path.resolve(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(
    path.join(evidenceDir, 'verify-summary.txt'),
    JSON.stringify(results, null, 2)
  );

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
