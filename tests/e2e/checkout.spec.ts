import { expect, test } from '@playwright/test';

test.describe('Checkout', () => {
  test('checkout page renders core sections', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page.getByRole('heading', { name: 'Оформление заказа' })).toBeVisible();
    await expect(page.getByText('1. Корзина')).toBeVisible();
    await expect(page.getByText('2. Персональные данные')).toBeVisible();
    await expect(page.getByText('3. Адрес доставки')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Перейти к оплате' })).toBeVisible();
  });

  test('shows validation errors on empty checkout submit', async ({ page }) => {
    await page.goto('/checkout');

    await page.getByRole('button', { name: 'Перейти к оплате' }).click();

    await expect(page.getByText('Имя должно содержать минимум 2 символа')).toBeVisible();
    await expect(page.getByText('Фамилия должна содержать минимум 2 символа')).toBeVisible();
    await expect(page.getByText('Некорректный email')).toBeVisible();
    await expect(page.getByText('Телефон должен содержать минимум 7 символов')).toBeVisible();
    await expect(page.getByText('Введите корректный адрес')).toBeVisible();
  });

  test('empty cart state keeps order sum at zero', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page.getByText('Сумма заказа:')).toBeVisible();
    await expect(page.getByText('0 ₽').first()).toBeVisible();
  });

  test('not-auth page is available as unauthorized fallback', async ({ page }) => {
    await page.goto('/not-auth');

    await expect(page).toHaveURL(/\/not-auth$/);
    await expect(page.getByRole('heading', { name: 'Доступ запрещен' })).toBeVisible();
  });
});
