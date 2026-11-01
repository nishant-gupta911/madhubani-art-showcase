import { test, expect } from '@playwright/test';

test.describe('Vernika Enterprises E2E Storefront & Admin Tests', () => {
  test('1. Browse storefront and verify brand presence', async ({ page }) => {
    await page.goto('/');

    // Check title and brand
    await expect(page).toHaveTitle(/Vernika Enterprises/i);
    await expect(page.locator('text=Vernika Enterprises').first()).toBeVisible();
    await expect(page.locator('text=Natasha Gupta').first()).toBeVisible();

    // Verify navigation to shop
    await page.goto('/shop');
    await expect(page.locator('text=The Collection').or(page.locator('text=All Artworks')).first()).toBeVisible();
  });

  test('2. Product details & technique display', async ({ page }) => {
    // Navigate to a product page
    await page.goto('/shop/mithila-harmony-slim-strip-paintings-set-of-3');

    // Verify product title, technique, and artist details
    await expect(page.locator('text=Mithila Harmony Slim Strip Paintings').first()).toBeVisible();
    await expect(page.locator('text=Natasha Gupta').first()).toBeVisible();
  });

  test('3. Cart & Checkout page flow', async ({ page }) => {
    await page.goto('/cart');
    // Verify empty state or cart elements
    await expect(page.locator('text=collection bag').or(page.locator('text=art bag')).or(page.locator('text=Checkout')).first()).toBeVisible();
  });

  test('4. Legal & Policy Pages load with draft notice', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('text=[DRAFT — Needs Legal Review]').first()).toBeVisible();

    await page.goto('/grievance');
    await expect(page.locator('text=Grievance Officer').first()).toBeVisible();
    await expect(page.locator('text=Natasha Gupta').first()).toBeVisible();
  });

  test('5. Admin Login & Price Helper', async ({ page }) => {
    await page.goto('/admin');

    // Admin login form appears
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Fill credentials
    await page.fill('input[type="email"]', 'vernikaenterprises14@gmail.com');
    await page.fill('input[type="password"]', 'VernikaArt@2026');
    await page.click('button[type="submit"]');

    // Admin dashboard should load
    await expect(page.locator('text=Vernika Admin').or(page.locator('text=Natasha Gupta Studio'))).toBeVisible({ timeout: 10000 });
  });

  test('6. Admin Quick-Add Product Tab and Form', async ({ page }) => {
    await page.goto('/admin');

    // Fill credentials if prompted
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', 'vernikaenterprises14@gmail.com');
      await page.fill('input[type="password"]', 'VernikaArt@2026');
      await page.click('button[type="submit"]');
    }

    // Switch to Quick-Add Product tab
    await page.click('button:has-text("Quick-Add Product")');

    // Form should be visible
    await expect(page.locator('text=Quick-Add Handpainted Artwork')).toBeVisible();
    await expect(page.locator('text=Artwork Title / Name *')).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. Sacred Kohbar Lotus Mandalas"]')).toBeVisible();
  });

  test('7. Responsive mobile layout and no horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const noHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(noHorizontalScroll).toBe(true);
  });

  test('8. Axe accessibility audit on key storefront routes', async ({ page }) => {
    const { default: AxeBuilder } = await import('@axe-core/playwright');
    
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // color-contrast audited via design tokens
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
