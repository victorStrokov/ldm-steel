import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { prisma } from '../../prisma/prisma-client';

test.afterAll(async () => {
  await prisma.$disconnect();
});

test.describe('Inquiry flow', () => {
  test('single-variant profile product can be added to cart and submitted as inquiry', async ({ page }) => {
    const requestMarker = `e2e-inquiry-${randomUUID()}`;
    const email = `${requestMarker}@example.com`;

    await page.goto('/product/159');

    await expect(page.getByRole('heading', { name: 'Steel Pipe 40x20' })).toBeVisible();
    await expect(page.getByText('31×34 мм, толщина 1.8 мм')).toBeVisible();

    const addButton = page.getByRole('button', { name: 'Добавить в заявку' });
    await expect(addButton).toBeEnabled({ timeout: 15000 });
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/api/cart') && response.request().method() === 'POST',
      ),
      addButton.click(),
    ]);

    await expect(page.getByRole('button', { name: /Корзина 1/ })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Корзина 1/ }).click();
    await expect(page.getByText('В корзине 1 товар')).toBeVisible();

    const inquiryResponse = await page.request.post('/api/inquiries', {
      data: {
        firstName: 'Иван',
        lastName: 'Петров',
        email,
        phone: '+79991234567',
        address: 'г Санкт-Петербург, г Колпино',
        comment: requestMarker,
      },
    });

    expect(inquiryResponse.ok()).toBeTruthy();

    await expect
      .poll(async () => {
        const cartResponse = await page.request.get('/api/cart');
        const cart = await cartResponse.json();

        return {
          ok: cartResponse.ok(),
          itemsLength: cart.items.length,
        };
      })
      .toMatchObject({ ok: true, itemsLength: 0 });

    await expect
      .poll(
        async () =>
          prisma.inquiry.findFirst({
            where: { email },
            orderBy: { id: 'desc' },
            include: {
              manager: { select: { email: true, fullName: true } },
              items: { select: { productItemId: true, quantity: true } },
            },
          }),
        { timeout: 15000 },
      )
      .toMatchObject({
        email,
        fullName: 'Иван Петров',
        manager: {
          email: 'manager2@ldm.ru',
          fullName: 'Manager 2 LDM',
        },
        items: [{ productItemId: 180, quantity: 1 }],
      });

    const inquiry = await prisma.inquiry.findFirst({
      where: { email },
      orderBy: { id: 'desc' },
      select: {
        comment: true,
        routeModeSnapshot: true,
      },
    });

    expect(inquiry?.routeModeSnapshot).toBe('FULL');
    expect(inquiry?.comment).toContain(requestMarker);
  });
});
