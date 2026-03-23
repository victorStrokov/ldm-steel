import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { prisma } from '../../prisma/prisma-client';

const sandboxEnabled = process.env.E2E_SANDBOX_ENABLED === '1';

test.describe('Checkout sandbox payment flow', () => {
  test.skip(!sandboxEnabled, 'Set E2E_SANDBOX_ENABLED=1 to run real checkout sandbox flow');

  test('creates order and confirms payment callback in sandbox mode', async ({ page, context }) => {
    const productItem = await prisma.productItem.findFirst({ select: { id: true } });

    test.skip(!productItem, 'No product items found in DB. Seed test data first.');
    if (!productItem) {
      return;
    }

    const cartToken = `e2e-${randomUUID()}`;

    await context.addCookies([
      {
        name: 'cartToken',
        value: cartToken,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    const addToCartRes = await page.request.post('/api/cart', {
      data: {
        productItemId: productItem.id,
        ingredients: [],
      },
    });

    expect(addToCartRes.ok()).toBeTruthy();

    await page.goto('/checkout');

    await page.getByPlaceholder('Имя').fill('Иван');
    await page.getByPlaceholder('Фамилия').fill('Петров');
    await page.getByPlaceholder('E-mail').fill('ivan.sandbox@example.com');
    await page.getByPlaceholder('Телефон').fill('+79991234567');

    // Address input is rendered by react-dadata without a stable placeholder.
    await page.locator('input').nth(4).fill('Москва, Тверская 1');
    await page.getByPlaceholder('Комментарий к заказу').fill('sandbox checkout e2e');

    await page.getByRole('button', { name: 'Перейти к оплате' }).click();

    await expect
      .poll(() => page.url(), { timeout: 20000, message: 'Checkout did not redirect to payment page/url in time' })
      .not.toContain('/checkout');

    const createdOrder = await prisma.order.findFirst({
      where: { token: cartToken },
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    expect(createdOrder?.id).toBeDefined();

    const callbackRes = await page.request.post('/api/checkout/callback', {
      data: {
        object: {
          metadata: { order_id: String(createdOrder!.id) },
          status: 'succeeded',
        },
      },
    });

    expect(callbackRes.ok()).toBeTruthy();

    const updatedOrder = await prisma.order.findUnique({
      where: { id: createdOrder!.id },
      select: { status: true },
    });

    expect(updatedOrder?.status).toBe('SUCCEEDED');
  });
});
