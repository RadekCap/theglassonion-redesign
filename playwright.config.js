const { defineConfig } = require('@playwright/test');

const viewports = [
  ['desktop-1366x768', { width: 1366, height: 768 }],
  ['desktop-1440x900', { width: 1440, height: 900 }],
  ['desktop-1920x1080', { width: 1920, height: 1080 }],
  ['mobile-390x844', { width: 390, height: 844, isMobile: true, hasTouch: true }],
  ['mobile-414x896', { width: 414, height: 896, isMobile: true, hasTouch: true }],
  ['tablet-768x1024', { width: 768, height: 1024, isMobile: true, hasTouch: true }],
];

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    colorScheme: 'dark',
    locale: 'cs-CZ',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4173',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 10_000,
  },
  projects: viewports.map(([name, viewport]) => ({ name, use: { viewport } })),
});
