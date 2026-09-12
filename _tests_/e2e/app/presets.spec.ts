import { expect, test } from '@playwright/test';

test.describe('presets library', () => {
  test('built-in seeds are shown and deep-link into the studio', async ({ page }) => {
    await page.goto('/presets');
    await expect(page.getByText('Purple 40 (M3 baseline)')).toBeVisible();
    await page.locator('a[href="/studio?s=b3261e"]').click();
    await expect(page).toHaveURL(/s=b3261e/);
  });

  test('save flow persists to IndexedDB and appears on /presets', async ({ page }) => {
    const name = `E2E ${test.info().workerIndex}-${Date.now() % 100000}`;
    await page.goto('/studio?s=e8710a');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByLabel('プリセット名').fill(name);
    await page.getByRole('button', { name: '保存', exact: true }).click();
    await expect(page.getByText('IndexedDB に保存しました')).toBeVisible();

    await page.goto('/presets');
    await expect(page.getByText(name)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Studio で開く' }).last()).toBeVisible();
  });
});
