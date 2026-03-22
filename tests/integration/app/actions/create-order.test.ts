import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    },
  },
}));

import { cookies } from 'next/headers';
import { createOrder } from '@/app/actions/create-order';
import { createPayment, sendEmail } from '@/shared/lib';
import { prisma } from '@/prisma/prisma-client';

describe('createOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns payment url on successful order creation', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'cart-token-1' }),
    } as never);

    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      totalAmount: 1500,
      user: { tenantId: 2 },
      items: [
        {
          productItem: { product: { tenantId: 2 } },
        },
      ],
    } as never);

    vi.mocked(prisma.order.create).mockResolvedValue({
      id: 10,
      totalAmount: 1500,
    } as never);

    vi.mocked(createPayment).mockResolvedValue({
      id: 'pay_1',
      confirmation: { confirmation_url: 'https://pay.example/1' },
    } as never);

    const result = await createOrder({
      firstName: 'Ivan',
      lastName: 'Petrov',
      email: 'ivan@example.com',
      phone: '+79991234567',
      address: 'Moscow',
      comment: 'call me',
    });

    expect(result).toBe('https://pay.example/1');
    expect(prisma.order.create).toHaveBeenCalled();
    expect(prisma.cart.update).toHaveBeenCalled();
    expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { paymentId: 'pay_1' },
    });
    expect(sendEmail).toHaveBeenCalled();
  });

  it('returns undefined when cart token is missing', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);

    const result = await createOrder({
      firstName: 'Ivan',
      lastName: 'Petrov',
      email: 'ivan@example.com',
      phone: '+79991234567',
      address: 'Moscow',
      comment: '',
    });

    expect(result).toBeUndefined();
    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});
