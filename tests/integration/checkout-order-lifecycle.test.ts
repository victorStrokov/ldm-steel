import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/shared/lib', () => ({
  createPayment: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    cart: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      deleteMany: vi.fn(),
    },
    order: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { cookies } from 'next/headers';
import { createOrder } from '@/app/actions/create-order';
import { POST as checkoutCallback } from '@/app/api/checkout/callback/route';
import { createPayment, sendEmail } from '@/shared/lib';
import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';

describe('checkout order lifecycle integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs happy-path: create order and mark succeeded in callback', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'cart-token-happy' }),
    } as never);

    const cartItems = [
      {
        id: 1,
        quantity: 2,
        productItem: { product: { tenantId: 7 } },
        ingredients: [],
      },
    ];

    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      totalAmount: 2500,
      user: { tenantId: 7 },
      items: cartItems,
    } as never);

    vi.mocked(prisma.order.create).mockResolvedValue({
      id: 101,
      totalAmount: 2500,
    } as never);

    vi.mocked(createPayment).mockResolvedValue({
      id: 'pay_happy_101',
      confirmation: { confirmation_url: 'https://pay.example/happy-101' },
    } as never);

    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 101,
      email: 'buyer@example.com',
      items: [{ id: 1, quantity: 2, productName: 'Профиль', unitPrice: 1250 }],
      totalAmount: 2500,
    } as never);

    const paymentUrl = await createOrder({
      firstName: 'Ivan',
      lastName: 'Petrov',
      email: 'buyer@example.com',
      phone: '+79991234567',
      address: 'Moscow, Tverskaya 1',
      comment: 'Call before delivery',
    });

    expect(paymentUrl).toBe('https://pay.example/happy-101');
    expect(prisma.order.create).toHaveBeenCalled();
    expect(prisma.cart.update).toHaveBeenCalledWith({
      where: { token: 'cart-token-happy' },
      data: { totalAmount: 0 },
    });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 101 },
      data: { paymentId: 'pay_happy_101' },
    });

    const callbackRes = (await checkoutCallback({
      json: async () => ({
        object: {
          metadata: { order_id: '101' },
          status: 'succeeded',
        },
      }),
    } as never)) as Response;

    expect(callbackRes.status).toBe(200);

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 101 },
      data: { status: OrderStatus.SUCCEEDED },
    });

    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it('returns 404 on malformed callback payload when order cannot be resolved', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValue(null as never);

    const res = (await checkoutCallback({
      json: async () => ({ object: { metadata: {}, status: 'succeeded' } }),
    } as never)) as Response;

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: 'Order not found' });
  });

  it('full lifecycle: main product + quick-added related product → order snapshot → callback success', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'cart-token-related' }),
    } as never);

    // Cart contains: 1× main profile + 2× related accessory (both without ingredients)
    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      totalAmount: 5600,
      user: { tenantId: 7 },
      items: [
        {
          id: 1,
          quantity: 1,
          productItemId: 101,
          ingredients: [],
          productItem: {
            id: 101,
            price: 5000,
            sku: 'PROF-001',
            steelSize: 6,
            productThickness: 2,
            product: {
              id: 1001,
              name: 'Профиль ПВХ',
              tenantId: 7,
              images: [{ url: '/img/prof.jpg' }],
            },
          },
        },
        {
          id: 2,
          quantity: 2,
          productItemId: 202,
          ingredients: [],
          productItem: {
            id: 202,
            price: 300,
            sku: 'ACC-001',
            steelSize: null,
            productThickness: null,
            product: {
              id: 2002,
              name: 'Крепёж универсальный',
              tenantId: 7,
              images: [],
            },
          },
        },
      ],
    } as never);

    vi.mocked(prisma.order.create).mockResolvedValue({
      id: 200,
      totalAmount: 5600,
    } as never);

    vi.mocked(createPayment).mockResolvedValue({
      id: 'pay_related_200',
      confirmation: { confirmation_url: 'https://pay.example/related-200' },
    } as never);

    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 200,
      email: 'buyer@example.com',
      totalAmount: 5600,
      items: [
        { productItemId: 101, productName: 'Профиль ПВХ', unitPrice: 5000, quantity: 1, lineTotal: 5000 },
        { productItemId: 202, productName: 'Крепёж универсальный', unitPrice: 300, quantity: 2, lineTotal: 600 },
      ],
    } as never);

    const paymentUrl = await createOrder({
      firstName: 'Sergei',
      lastName: 'Nikitin',
      email: 'buyer@example.com',
      phone: '+79001112233',
      address: 'Novosibirsk',
      comment: '',
    });

    expect(paymentUrl).toBe('https://pay.example/related-200');

    // Verify snapshot contains both items with correct lineTotals
    const createCall = vi.mocked(prisma.order.create).mock.calls[0][0];
    const snapshot = createCall.data.items as Array<{
      productItemId: number;
      lineTotal: number;
      ingredients: unknown[];
    }>;
    expect(snapshot).toHaveLength(2);
    expect(snapshot.find((i) => i.productItemId === 101)?.lineTotal).toBe(5000);
    expect(snapshot.find((i) => i.productItemId === 202)?.lineTotal).toBe(600);
    expect(snapshot.every((i) => i.ingredients.length === 0)).toBe(true);

    expect(prisma.cart.update).toHaveBeenCalledWith({
      where: { token: 'cart-token-related' },
      data: { totalAmount: 0 },
    });
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();

    // Simulate payment callback → SUCCEEDED
    const callbackRes = (await checkoutCallback({
      json: async () => ({
        object: {
          metadata: { order_id: '200' },
          status: 'succeeded',
        },
      }),
    } as never)) as Response;

    expect(callbackRes.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 200 },
      data: { status: OrderStatus.SUCCEEDED },
    });
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });
});
