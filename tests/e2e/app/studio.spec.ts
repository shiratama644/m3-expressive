import { expect, test } from '@playwright/test';

test.describe('studio /studio', () => {
  test('share-link seed is applied server-side and code tab follows', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (e) => errors.push(e));

    await page.goto('/studio?s=ff0000&v=fidelity');
    await expect(page.locator('span[aria-label="Seed color"]')).toHaveAttribute('title', /#ff0000/);
    await expect(page.getByText('Fidelity · contrast', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Code' }).click();
    await expect(page.getByText('app/globals.css').first()).toBeVisible();
    // switch framework → file list changes
    await page.getByRole('button', { name: 'Vue 3 + Vite + Tailwind v4' }).click();
    await expect(page.getByText('src/composables/useM3eTheme.ts')).toBeVisible();
    // README carries the pnpm command ladder by default
    await page.getByRole('button').filter({ hasText: 'README.md' }).click();
    await expect(page.getByText('pnpm add', { exact: false }).first()).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test('ZIP download bundles the selected framework', async ({ page }) => {
    await page.goto('/studio?s=0061a4');
    await page.getByRole('button', { name: 'Code' }).click();
    await page.getByRole('button', { name: 'Tailwind CSS' }).first().click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Download ZIP' }).click(),
    ]);
    expect(download.suggestedFilename()).toBe('m3e-tailwind.zip');
  });

  test('editing the seed updates the URL (shareable state)', async ({ page }) => {
    await page.goto('/studio');
    const seed = page.getByLabel('Pick seed color');
    await seed.evaluate((el: HTMLInputElement) => {
      el.value = '#00e676';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect.poll(() => page.url()).toContain('s=00e676');
  });
});
