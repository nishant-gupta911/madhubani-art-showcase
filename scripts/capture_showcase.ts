import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const TARGET_DIR = '/Users/nishant/.gemini/antigravity/brain/70197484-b51f-407e-82a7-f58618dd1632/showcase';

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch();
  
  // 1. Desktop Viewport (1280x800)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const desktopPage = await desktopContext.newPage();

  console.log('Capturing Desktop Home...');
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-home.png'), fullPage: false });

  console.log('Capturing Desktop Shop...');
  await desktopPage.goto('http://localhost:3000/shop', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-shop.png'), fullPage: false });

  console.log('Capturing Desktop Product Detail...');
  await desktopPage.goto('http://localhost:3000/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-product.png'), fullPage: false });

  console.log('Capturing Desktop Gallery...');
  await desktopPage.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-gallery.png'), fullPage: false });

  console.log('Capturing Desktop Cart...');
  await desktopPage.goto('http://localhost:3000/cart', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-cart.png'), fullPage: false });

  console.log('Capturing Admin Login & Dashboard...');
  await desktopPage.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  const emailInput = desktopPage.locator('input[type="email"]');
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill('vernikaenterprises14@gmail.com');
    await desktopPage.fill('input[type="password"]', 'VernikaArt@2026');
    await desktopPage.click('button[type="submit"]');
    await desktopPage.waitForTimeout(1000);
  }
  await desktopPage.screenshot({ path: path.join(TARGET_DIR, 'desktop-admin.png'), fullPage: false });

  // 2. Mobile Viewport (iPhone 14: 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();

  console.log('Capturing Mobile Home...');
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(TARGET_DIR, 'mobile-home.png'), fullPage: false });

  console.log('Capturing Mobile Product...');
  await mobilePage.goto('http://localhost:3000/shop/surya-deepavali-maiden-3-panel-wall-hanging-organizer', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(TARGET_DIR, 'mobile-product.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully in:', TARGET_DIR);
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
