import { expect, test } from '@playwright/test';

test.describe('Smoke', () => {
  test('not-auth page renders forbidden state', async ({ page }) => {
    await page.goto('/not-auth');

    await expect(page).toHaveURL(/\/not-auth$/);
    await expect(page.getByText('Доступ запрещен')).toBeVisible();
  });

  test('dashboard page renders title', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('dashboard products page renders title', async ({ page }) => {
    await page.goto('/dashboard/products');

    await expect(page).toHaveURL(/\/dashboard\/products$/);
    await expect(page.getByRole('heading', { name: 'Products Page' })).toBeVisible();
  });
});
