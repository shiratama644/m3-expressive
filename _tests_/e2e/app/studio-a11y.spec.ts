import { expect, test } from '@playwright/test';

test.describe('studio a11y audit + one-click fix', () => {
  test('default theme passes AA: all-clear summary, no fix button', async ({ page }) => {
    await page.goto('/studio?s=6750a4');
    await page.getByRole('button', { name: 'A11y' }).click();
    await expect(page.getByText(/すべて基準以上/)).toBeVisible();
    await expect(page.getByRole('button', { name: /自動修復|改善 →|自動修復不可/ })).toHaveCount(0);
  });

  test('AAA fix: contrast rewritten to 0.9 and summary clears (deterministic)', async ({
    page,
  }) => {
    const errors: Error[] = [];
    page.on('pageerror', (e) => errors.push(e));

    await page.goto('/studio?s=6750a4');
    await page.getByRole('button', { name: 'A11y' }).click();
    await page.getByRole('button', { name: 'AAA text' }).click();

    await expect(page.getByText('12 ペアが基準未達')).toBeVisible();
    const fix = page.getByRole('button', { name: '自動修復 → contrast 0.9' });
    await expect(fix).toBeEnabled();
    await fix.click();

    await expect(page).toHaveURL(/[?&]c=0\.9/);
    await expect(page.getByText(/すべて基準以上/)).toBeVisible();
    await expect(fix).toHaveCount(0);
    expect(errors).toHaveLength(0);
  });

  test('failures-only filter shrinks the table', async ({ page }) => {
    await page.goto('/studio?s=6750a4');
    await page.getByRole('button', { name: 'A11y' }).click();
    await page.getByRole('button', { name: 'AAA text' }).click();
    const all = await page.locator('tbody tr').count();
    await page.getByRole('button', { name: '失敗のみ' }).click();
    const failing = await page.locator('tbody tr').count();
    expect(failing).toBeLessThan(all);
    expect(failing).toBeGreaterThan(0);
  });
});
