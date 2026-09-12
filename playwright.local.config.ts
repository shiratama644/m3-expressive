import { defineConfig, devices } from '@playwright/test';

// Local-only config: uses a chromium extracted from the @sparticuz/chromium npm
// package (sandbox egress blocks cdn.playwright.dev). Not used in CI.
export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    launchOptions: {
      executablePath: '/tmp/chromium',
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--headless=new'],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node_modules/.bin/next start -H 127.0.0.1 -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
