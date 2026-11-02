import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'mobile', width: 360, height: 740 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'shop', path: '/shop' },
  { name: 'product', path: '/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer' },
  { name: 'gallery', path: '/gallery' },
  { name: 'cart', path: '/cart' },
  { name: 'track', path: '/track' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: '404', path: '/404-test-page-not-found' },
  { name: 'admin', path: '/admin' }
];

async function capture() {
  const outputDir = path.resolve(process.cwd(), 'docs/design/screens/before');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch();
  console.log('Capturing before screenshots across viewports...');

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `http://localhost:3000${route.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(500); // Allow any layout transitions to settle

        const filename = `${route.name}-${vp.name}.png`;
        const filepath = path.join(outputDir, filename);
        await page.screenshot({ path: filepath, fullPage: false });
        console.log(`✓ Saved ${filename}`);
      } catch (err: any) {
        console.error(`✗ Error on ${route.name} (${vp.name}): ${err.message}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log(`\nAll before screenshots captured in: docs/design/screens/before/`);
}

capture().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
