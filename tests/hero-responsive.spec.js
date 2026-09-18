const { test, expect } = require('@playwright/test');

test('hero layout stays within the viewport and matches its baseline', async ({ page }, testInfo) => {
  await page.goto('/#hero', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const photo = document.querySelector('.hero-photo-bg');
    const heroBox = hero.getBoundingClientRect();
    const photoStyle = getComputedStyle(photo);

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      documentScrollWidth: document.documentElement.scrollWidth,
      hero: {
        top: Math.round(heroBox.top),
        height: Math.round(heroBox.height),
        bottom: Math.round(heroBox.bottom),
      },
      photo: {
        backgroundPosition: photoStyle.backgroundPosition,
        backgroundSize: photoStyle.backgroundSize,
        transform: photoStyle.transform,
      },
    };
  });

  await testInfo.attach('hero-layout.json', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });

  expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.viewport.width);
  expect(metrics.hero.height).toBeGreaterThan(0);

  await expect(page.locator('.hero')).toHaveScreenshot('hero.png', {
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
    maxDiffPixels: 250,
  });
});
