import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface AuditResult {
  route: string;
  url: string;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  lcpMs: number;
  cls: number;
  tbtMs: number;
}

const ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Category', path: '/shop/category/paintings' },
  { name: 'Product', path: '/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Cart', path: '/cart' },
  { name: 'Checkout', path: '/cart?step=checkout' },
];

async function runLighthouse(url: string): Promise<AuditResult> {
  const tmpJson = path.join(process.cwd(), `lighthouse-temp-${Date.now()}.json`);
  const cmd = `npx --yes lighthouse "${url}" --output=json --output-path="${tmpJson}" --preset=experimental --emulated-form-factor=mobile --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`;

  try {
    execSync(cmd, { stdio: 'ignore' });
    const data = JSON.parse(fs.readFileSync(tmpJson, 'utf-8'));
    fs.unlinkSync(tmpJson);

    const categories = data.categories;
    const audits = data.audits;

    return {
      route: url,
      url,
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      lcpMs: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
      cls: Number((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
      tbtMs: Math.round(audits['total-blocking-time']?.numericValue || 0),
    };
  } catch (err: any) {
    if (fs.existsSync(tmpJson)) fs.unlinkSync(tmpJson);
    console.error(`Failed to audit ${url}:`, err.message);
    return {
      route: url,
      url,
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
      lcpMs: 0,
      cls: 0,
      tbtMs: 0,
    };
  }
}

async function main() {
  console.log('========================================================================');
  console.log('           VERNIKA ENTERPRISES — BASELINE LIGHTHOUSE AUDIT              ');
  console.log('========================================================================\n');

  // 1. Ensure production server is running
  let serverProcess: any = null;
  try {
    const res = await fetch('http://localhost:3000/');
    if (!res.ok) throw new Error('Not running');
    console.log('✓ Next.js server already running on http://localhost:3000');
  } catch {
    console.log('Starting Next.js production server...');
    serverProcess = spawn('npm', ['run', 'start'], {
      detached: true,
      stdio: 'ignore',
    });

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch('http://localhost:3000/');
        if (res.ok) {
          console.log('✓ Server started successfully');
          break;
        }
      } catch {}
    }
  }

  const results: AuditResult[] = [];

  for (const r of ROUTES) {
    const targetUrl = `http://localhost:3000${r.path}`;
    console.log(`Auditing ${r.name} (${targetUrl}) ...`);
    const res = await runLighthouse(targetUrl);
    res.route = r.name;
    results.push(res);
    console.log(`  -> Perf: ${res.performance} | A11y: ${res.accessibility} | Best: ${res.bestPractices} | SEO: ${res.seo} | LCP: ${res.lcpMs}ms | CLS: ${res.cls}`);
  }

  // Print scorecard
  console.log('\n' + '='.repeat(85));
  console.log('                     BASELINE LIGHTHOUSE MOBILE SCORECARD               ');
  console.log('='.repeat(85));
  console.log(
    `${'ROUTE'.padEnd(14)} | ${'PERF'.padEnd(6)} | ${'A11Y'.padEnd(6)} | ${'BEST'.padEnd(6)} | ${'SEO'.padEnd(6)} | ${'LCP (ms)'.padEnd(10)} | CLS`
  );
  console.log('-'.repeat(85));
  for (const r of results) {
    console.log(
      `${r.route.padEnd(14)} | ${String(r.performance).padEnd(6)} | ${String(r.accessibility).padEnd(6)} | ${String(r.bestPractices).padEnd(6)} | ${String(r.seo).padEnd(6)} | ${String(r.lcpMs).padEnd(10)} | ${r.cls}`
    );
  }
  console.log('='.repeat(85) + '\n');

  // Save evidence
  const outDir = path.join(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'baseline-lighthouse.json'),
    JSON.stringify(results, null, 2)
  );

  let textReport = 'BASELINE LIGHTHOUSE MOBILE AUDIT REPORT\n' + '='.repeat(50) + '\n';
  for (const r of results) {
    textReport += `${r.route}:\n  Performance: ${r.performance}\n  Accessibility: ${r.accessibility}\n  Best Practices: ${r.bestPractices}\n  SEO: ${r.seo}\n  LCP: ${r.lcpMs}ms\n  CLS: ${r.cls}\n  TBT: ${r.tbtMs}ms\n\n`;
  }
  fs.writeFileSync(path.join(outDir, 'baseline-lighthouse.txt'), textReport);
  console.log('Baseline evidence saved to docs/audit/evidence/baseline-lighthouse.*');

  if (serverProcess) {
    try {
      process.kill(-serverProcess.pid);
    } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
