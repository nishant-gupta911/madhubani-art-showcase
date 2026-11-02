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
      details: stdout.slice(-300).trim(),
    };
  } catch (err: any) {
    const durationMs = Date.now() - start;
    console.error(`✗ [FAIL] ${name} (${(durationMs / 1000).toFixed(1)}s)`);
    const output = (err.stdout || err.stderr || err.message || '').slice(-400).trim();
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

  // 2. Content & Catalog Truthfulness Audit
  results.push(runStep('2. Content & Forbidden Claims Audit', 'npm run content:audit', 'REAL'));

  // 3. Strict TypeScript Compilation
  results.push(runStep('3. Strict TypeScript Compilation', 'npx tsc --noEmit', 'REAL'));

  // 4. Vitest Unit & Integration Suites (Pricing, Order IDs, Razorpay HMAC, Concurrency, Security)
  results.push(runStep('4. Vitest Unit & Integration Suites', 'npm test', 'REAL'));

  // 5. Playwright E2E Browser & Device Matrix (Chromium & WebKit)
  results.push(runStep('5. Playwright E2E Device & Browser Matrix', 'npx playwright test --project=chromium --project=webkit', 'REAL'));

  // 6. Axe-Core WCAG 2.1 AA Accessibility Audit
  results.push(runStep('6. Axe-Core WCAG 2.1 AA Accessibility Audit', 'npm run a11y:check', 'REAL'));

  // 7. High-Concurrency Load Test & Rate Limit Verification
  results.push(runStep('7. Autocannon Concurrency & Load Benchmark', 'npm run load:test', 'REAL'));

  // 8. Security Dependency Audit
  results.push(runStep('8. Production Dependency Security Audit', 'npm audit --omit=dev', 'REAL'));

  // 9. Database Backup & Restoration Drill
  results.push(runStep('9. Database Backup & Restore Drill', 'npx tsx scripts/backup_restore_drill.ts', 'REAL'));

  // 10. Full Route Link, Image & SEO Schema Crawl
  results.push(runStep('10. Full Route Link & SEO Schema Crawl', 'npx tsx scripts/link_and_seo_crawl.ts', 'REAL'));

  // 11. Production Route Smoke Checks
  results.push(runStep('11. Production Route Smoke Suite', 'npm run smoke:prod', 'REAL'));

  // Print Master Scorecard Table
  console.log('\n' + '='.repeat(88));
  console.log('                         MASTER VERIFICATION SCORECARD                          ');
  console.log('='.repeat(88));
  console.log(
    `${'STEP'.padEnd(46)} | ${'STATUS'.padEnd(6)} | ${'TAG'.padEnd(9)} | TIME`
  );
  console.log('-'.repeat(88));

  let allPassed = true;
  for (const r of results) {
    if (r.status === 'FAIL') allPassed = false;
    console.log(
      `${r.step.padEnd(46)} | ${r.status.padEnd(6)} | ${r.tag.padEnd(9)} | ${(r.durationMs / 1000).toFixed(1)}s`
    );
  }
  console.log('='.repeat(88));

  const totalTime = results.reduce((acc, r) => acc + r.durationMs, 0);
  console.log(`TOTAL AUDIT DURATION: ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`VERDICT: ${allPassed ? 'ALL AUDIT STEPS PASSED' : 'SOME AUDIT STEPS FAILED'}\n`);

  // Save audit evidence
  const evidenceDir = path.resolve(process.cwd(), 'docs/audit/evidence');
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

  const reportText = [
    `# Automated Master Verification Run`,
    `Generated: ${new Date().toISOString()}`,
    `Total Duration: ${(totalTime / 1000).toFixed(1)}s`,
    `Verdict: ${allPassed ? 'PASS' : 'FAIL'}`,
    '',
    '| Step | Status | Tag | Duration |',
    '| :--- | :---: | :---: | :---: |',
    ...results.map(r => `| ${r.step} | **${r.status}** | ${r.tag} | ${(r.durationMs / 1000).toFixed(1)}s |`),
    '',
    '## Step Details',
    ...results.map(r => `### ${r.step}\nCommand: \`${r.command}\`\nStatus: ${r.status}\n\`\`\`\n${r.details}\n\`\`\`\n`)
  ].join('\n');

  fs.writeFileSync(path.join(evidenceDir, 'master-verification-output.md'), reportText, 'utf-8');
  console.log(`Saved master evidence to docs/audit/evidence/master-verification-output.md`);

  if (!allPassed) process.exit(1);
}

main().catch((err) => {
  console.error('Fatal master verify error:', err);
  process.exit(1);
});
