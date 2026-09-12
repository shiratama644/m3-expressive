import { defineConfig, devices } from '@playwright/test';

/**
 * E2E suite (tests/e2e/**) against the PRODUCTION build (`next start`).
 * Run: pnpm build && pnpm test:e2e   (first time: pnpm exec playwright install --with-deps chromium)
 * In CI the e2e job builds first; locally an already-running :3100 server is reused.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // package-manager agnostic: node_modules/.bin exists for bun|pnpm|npm|yarn
    command: 'node_modules/.bin/next start -H 127.0.0.1 -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
