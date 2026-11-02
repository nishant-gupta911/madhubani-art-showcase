import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { name: 'Home', url: 'http://localhost:3000/' },
  { name: 'Shop', url: 'http://localhost:3000/shop' },
  { name: 'Category', url: 'http://localhost:3000/shop/category/paintings' },
  { name: 'Product', url: 'http://localhost:3000/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer' },
  { name: 'Gallery', url: 'http://localhost:3000/gallery' },
  { name: 'Cart', url: 'http://localhost:3000/cart' },
];

async function checkAxe() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const r of ROUTES) {
    await page.goto(r.url, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    console.log(`\n=== Route: ${r.name} (${results.violations.length} violations) ===`);
    for (const v of results.violations) {
      console.log(`- [${v.impact}] ${v.id}: ${v.description}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`  Target: ${node.target.join(' ')}`);
        console.log(`  HTML: ${node.html}`);
        console.log(`  Failure: ${node.failureSummary}`);
      }
    }
  }

  await browser.close();
}

checkAxe().catch(console.error);
