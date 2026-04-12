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
          id: 1,
          quantity: 1,
          productItemId: 101,
          productItem: {
            id: 101,
            price: 1500,
            sku: 'SKU-101',
            steelSize: null,
            productThickness: null,
            product: {
              id: 1001,
              name: 'Тестовый профиль',
              tenantId: 2,
              images: [{ url: '/uploads/products/test.png' }],
            },
          },
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
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          items: [
            expect.objectContaining({
              productName: expect.any(String),
              productItemId: expect.any(Number),
              unitPrice: expect.any(Number),
              lineTotal: expect.any(Number),
            }),
          ],
        }),
      }),
    );
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

  it('builds correct snapshot for cart with main product and related accessory', async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'cart-token-related' }),
    } as never);

    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      totalAmount: 5600,
      user: { tenantId: 3 },
      items: [
        {
          id: 1,
          quantity: 1,
          productItemId: 101,
          productItem: {
            id: 101,
            price: 5000,
            sku: 'PROF-001',
            steelSize: 6,
            productThickness: 2,
            product: {
              id: 1001,
              name: 'Профиль ПВХ',
              tenantId: 3,
              images: [{ url: '/uploads/prof.jpg' }],
            },
          },
        },
        {
          id: 2,
          quantity: 2,
          productItemId: 202,
          productItem: {
            id: 202,
            price: 300,
            sku: 'ACC-001',
            steelSize: null,
            productThickness: null,
            product: {
              id: 2002,
              name: 'Крепёж универсальный',
              tenantId: 3,
              images: [],
            },
          },
        },
      ],
    } as never);

    vi.mocked(prisma.order.create).mockResolvedValue({
      id: 20,
      totalAmount: 5600,
    } as never);

    vi.mocked(createPayment).mockResolvedValue({
      id: 'pay_related',
      confirmation: { confirmation_url: 'https://pay.example/related' },
    } as never);

    const result = await createOrder({
      firstName: 'Anna',
      lastName: 'Ivanova',
      email: 'anna@example.com',
      phone: '+79990000000',
      address: 'SPb',
      comment: '',
    });

    expect(result).toBe('https://pay.example/related');

    const createCall = vi.mocked(prisma.order.create).mock.calls[0][0];
    const snapshot = createCall.data.items as Array<{
      productItemId: number;
      productName: string;
      sku: string;
      unitPrice: number;
      lineTotal: number;
      imageUrl: string | null;
    }>;

    expect(snapshot).toHaveLength(2);

    const mainItem = snapshot.find((i) => i.productItemId === 101)!;
    expect(mainItem.productName).toBe('Профиль ПВХ');
    expect(mainItem.sku).toBe('PROF-001');
    expect(mainItem.unitPrice).toBe(5000);
    expect(mainItem.lineTotal).toBe(5000); // 5000 × 1
    expect(mainItem.imageUrl).toBe('/uploads/prof.jpg');

    const accessoryItem = snapshot.find((i) => i.productItemId === 202)!;
    expect(accessoryItem.productName).toBe('Крепёж универсальный');
    expect(accessoryItem.sku).toBe('ACC-001');
    expect(accessoryItem.unitPrice).toBe(300);
    expect(accessoryItem.lineTotal).toBe(600); // 300 × 2
    expect(accessoryItem.imageUrl).toBeNull();

    // Legacy ingredient payload must not be present in order snapshot.
    for (const item of snapshot as Array<Record<string, unknown>>) {
      expect(item).not.toHaveProperty('ingredients');
      expect(item).not.toHaveProperty('ingredientId');
      expect(item).not.toHaveProperty('ingredientName');
      expect(item).not.toHaveProperty('ingredientPrice');
    }
  });
});
