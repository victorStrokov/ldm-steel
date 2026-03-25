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
      items: JSON.stringify([{ id: 1, quantity: 2 }]),
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
});
