import { expect, test } from '@playwright/test';

test.describe('landing /', () => {
  test('hero, stack chips and CTAs render', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (e) => errors.push(e));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('1 色から生成');
    for (const label of ['React', 'Next.js', 'Vue', 'Tailwind CSS v4']) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
    expect(errors).toHaveLength(0);
  });

  test('CTA navigates to the studio', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Studio を開く' }).first().click();
    await expect(page).toHaveURL(/\/studio/);
  });

  test('presets CTA navigates to /presets', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'プリセットを見る' }).click();
    await expect(page.getByRole('heading', { name: /スターター/ })).toBeVisible();
  });
});
