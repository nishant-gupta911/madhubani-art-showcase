import { execSync } from 'child_process';
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

async function runLighthouse(url: string, name: string): Promise<AuditResult> {
  const tmpJson = path.join(process.cwd(), `lh-temp-${Date.now()}.json`);
  const cmd = `npx --yes lighthouse "${url}" --output=json --output-path="${tmpJson}" --preset=experimental --emulated-form-factor=mobile --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo --quiet`;

  try {
    execSync(cmd, { stdio: 'ignore' });
    const data = JSON.parse(fs.readFileSync(tmpJson, 'utf-8'));
    fs.unlinkSync(tmpJson);

    const categories = data.categories;
    const audits = data.audits;

    return {
      route: name,
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
      route: name,
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
  console.log('='.repeat(85));
  console.log('       POST-REDESIGN LIGHTHOUSE AUDIT (THEME/POSTER)       ');
  console.log('='.repeat(85) + '\n');

  const results: AuditResult[] = [];
  for (const r of ROUTES) {
    const fullUrl = `http://localhost:3000${r.path}`;
    console.log(`Auditing ${r.name} (${fullUrl})...`);
    const res = await runLighthouse(fullUrl, r.name);
    results.push(res);
    console.log(`  ✓ Perf: ${res.performance} | A11y: ${res.accessibility} | LCP: ${res.lcpMs}ms | CLS: ${res.cls} | TBT: ${res.tbtMs}ms`);
  }

  console.log('\n' + '='.repeat(85));
  console.log('ROUTE       | PERF | A11Y | BP   | SEO  | LCP (ms) | CLS   | TBT (ms)');
  console.log('-'.repeat(85));
  for (const r of results) {
    console.log(
      `${r.route.padEnd(11)} | ` +
      `${String(r.performance).padEnd(4)} | ` +
      `${String(r.accessibility).padEnd(4)} | ` +
      `${String(r.bestPractices).padEnd(4)} | ` +
      `${String(r.seo).padEnd(4)} | ` +
      `${String(r.lcpMs).padEnd(8)} | ` +
      `${String(r.cls).padEnd(5)} | ` +
      `${String(r.tbtMs)}`
    );
  }
  console.log('='.repeat(85) + '\n');

  // Save evidence
  const outDir = path.join(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'post-redesign-lighthouse.json'),
    JSON.stringify(results, null, 2)
  );

  let textReport = 'POST-REDESIGN LIGHTHOUSE MOBILE AUDIT REPORT\n' + '='.repeat(50) + '\n';
  textReport += `Audit Timestamp: ${new Date().toISOString()}\n\n`;
  for (const r of results) {
    textReport += `${r.route} (${r.url}):\n  Performance: ${r.performance}\n  Accessibility: ${r.accessibility}\n  Best Practices: ${r.bestPractices}\n  SEO: ${r.seo}\n  LCP: ${r.lcpMs}ms\n  CLS: ${r.cls}\n  TBT: ${r.tbtMs}ms\n\n`;
  }
  fs.writeFileSync(path.join(outDir, 'post-redesign-lighthouse.txt'), textReport);
  console.log('Post-redesign evidence saved to docs/audit/evidence/post-redesign-lighthouse.*');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
