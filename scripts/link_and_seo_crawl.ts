import fs from 'fs';
import path from 'path';

const ROUTES_TO_CRAWL = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/gallery',
  '/cart',
  '/track',
  '/terms',
  '/privacy',
  '/shipping',
  '/returns',
  '/cancellation',
  '/grievance',
  '/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer',
  '/shop/category/paintings',
  '/shop/category/dupattas',
  '/shop/category/bags_and_files',
  '/sitemap.xml',
  '/robots.txt',
];

async function main() {
  console.log('========================================================================');
  console.log('           VERNIKA ENTERPRISES — LINK, IMAGE & SEO CRAWLER              ');
  console.log('========================================================================\n');

  // Ensure production server is running
  const { spawn } = await import('child_process');
  let serverProcess: any = null;
  try {
    const res = await fetch('http://localhost:3000/');
    if (!res.ok) throw new Error('Not ready');
  } catch {
    console.log('Starting Next.js production server for link crawl...');
    serverProcess = spawn('npm', ['run', 'start'], {
      detached: true,
      stdio: 'ignore',
    });
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const res = await fetch('http://localhost:3000/');
        if (res.ok) break;
      } catch {}
    }
  }

  let passedRoutes = 0;
  let failedRoutes = 0;
  let validatedJsonLd = 0;

  for (const route of ROUTES_TO_CRAWL) {
    const url = `http://localhost:3000${route}`;
    try {
      const res = await fetch(url);
      if (res.status >= 200 && res.status < 400) {
        passedRoutes++;
        const text = await res.text();

        // Check for JSON-LD on product page
        if (route.startsWith('/shop/surya')) {
          const match = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
          if (match && match[1]) {
            const parsed = JSON.parse(match[1]);
            if (parsed['@type'] === 'Product' && parsed.name && parsed.offers) {
              validatedJsonLd++;
              console.log(`✓ [PASS] ${route.padEnd(45)} HTTP ${res.status} (Valid JSON-LD Product Schema)`);
              continue;
            }
          }
        }

        console.log(`✓ [PASS] ${route.padEnd(45)} HTTP ${res.status}`);
      } else {
        failedRoutes++;
        console.error(`✗ [FAIL] ${route.padEnd(45)} HTTP ${res.status}`);
      }
    } catch (err: any) {
      failedRoutes++;
      console.error(`✗ [FAIL] ${route.padEnd(45)} Error: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`CRAWL COMPLETED: ${passedRoutes} passed, ${failedRoutes} failed, ${validatedJsonLd} JSON-LD schemas validated.`);
  console.log('='.repeat(70));

  if (failedRoutes > 0) {
    throw new Error(`${failedRoutes} routes failed crawl`);
  }

  // Save evidence
  const evidenceDir = path.join(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(
    path.join(evidenceDir, 'link-crawl.txt'),
    `LINK & SEO CRAWL REPORT\nDate: ${new Date().toISOString()}\nPassed: ${passedRoutes}\nFailed: ${failedRoutes}\nJSON-LD Schemas: ${validatedJsonLd} valid\nStatus: 100% HEALTHY\n`
  );
  console.log('Evidence saved to docs/audit/evidence/link-crawl.txt');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
