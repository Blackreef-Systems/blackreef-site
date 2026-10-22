import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/notes/', name: 'notes' },
  { path: '/sample-report/', name: 'sample-report' },
];
const sizes = [
  { name: 'mobile', viewport: { width: 390, height: 844 } },
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'ultrawide', viewport: { width: 2560, height: 1080 } },
];
for (const size of sizes) {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} / ${size.name}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: size.viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto('http://127.0.0.1:4173' + pageInfo.path, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `horizontal overflow: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 2);
      expect(errors).toEqual([]);
      if (size.name === 'mobile' && pageInfo.name === 'home') {
        const toggle = page.getByRole('button', { name: /toggle navigation/i });
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'AxiomIQ' })).toBeVisible();
      }
      await page.screenshot({ path: `screenshots/${pageInfo.name}-${size.name}.png`, fullPage: true });
      await context.close();
    });
  }
}
