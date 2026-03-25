import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('crypto', () => ({
  default: {
    randomUUID: vi.fn(() => 'generated-cart-token'),
  },
}));

vi.mock('@/shared/lib/find-or-create-cart', () => ({
  findOrCreateCart: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  updateCartTotalAmount: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    cart: {
      findFirst: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/cart/route';
import { prisma } from '@/prisma/prisma-client';
import { findOrCreateCart } from '@/shared/lib/find-or-create-cart';
import { updateCartTotalAmount } from '@/app/actions';

describe('GET /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty cart when token cookie is missing', async () => {
    const res = await GET({
      cookies: { get: vi.fn().mockReturnValue(undefined) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
    } as never);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ totalAmount: 0, items: [] });
  });

  it('returns cart payload when cart exists', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      totalAmount: 777,
      items: [{ id: 1 }],
    } as never);

    const res = await GET({
      cookies: { get: vi.fn().mockReturnValue({ value: 'cart-token-1' }) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
    } as never);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ totalAmount: 777, items: [{ id: 1 }] });
  });
});

describe('POST /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('increments quantity when identical cart item already exists', async () => {
    vi.mocked(findOrCreateCart).mockResolvedValue({ id: 10 } as never);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue({ id: 20, quantity: 2 } as never);
    vi.mocked(prisma.cartItem.update).mockResolvedValue({ id: 20, quantity: 3 } as never);
    vi.mocked(updateCartTotalAmount).mockResolvedValue({ totalAmount: 300, items: [] } as never);

    const res = await POST({
      cookies: { get: vi.fn().mockReturnValue({ value: 'cart-token-1' }) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
      json: async () => ({ productItemId: 5, ingredients: [1, 2] }),
    } as never);

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 20 },
      data: { quantity: 3 },
    });
    expect(prisma.cartItem.create).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it('creates cart item when there is no identical item', async () => {
    vi.mocked(findOrCreateCart).mockResolvedValue({ id: 10 } as never);
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null as never);
    vi.mocked(prisma.cartItem.create).mockResolvedValue({ id: 21, quantity: 1 } as never);
    vi.mocked(updateCartTotalAmount).mockResolvedValue({ totalAmount: 500, items: [] } as never);

    const res = await POST({
      cookies: { get: vi.fn().mockReturnValue(undefined) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
      json: async () => ({ productItemId: 5, ingredients: [1] }),
    } as never);

    expect(prisma.cartItem.create).toHaveBeenCalled();
    expect(updateCartTotalAmount).toHaveBeenCalledWith('generated-cart-token');
    expect(res.status).toBe(200);
  });
});
