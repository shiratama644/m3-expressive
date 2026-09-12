import { expect, test } from '@playwright/test';

test.describe('docs + tokens reference', () => {
  test('docs setup explorer switches across frameworks and package managers', async ({ page }) => {
    await page.goto('/docs');
    await page.getByRole('button', { name: 'React' }).first().click();
    await expect(page.getByText('pnpm create vite my-app')).toBeVisible();
    await page.getByRole('button', { name: 'Yarn', exact: true }).click();
    await expect(page.getByText('yarn create vite my-app')).toBeVisible();
    await expect(page.getByText('yarn add tailwindcss', { exact: false })).toBeVisible();
  });

  test('tokens page lists the full role set', async ({ page }) => {
    await page.goto('/tokens');
    for (const role of [
      'primary-fixed-dim',
      'on-primary-fixed-variant',
      'surface-container-highest',
    ]) {
      await expect(page.getByText(role).first()).toBeVisible();
    }
    await expect(page.getByText(/display-large/).first()).toBeVisible();
  });
});
