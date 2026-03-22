import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/actions', () => ({
  updateCartTotalAmount: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    cartItem: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { PATCH, DELETE } from '@/app/api/cart/[id]/route';
import { prisma } from '@/prisma/prisma-client';
import { updateCartTotalAmount } from '@/app/actions';

describe('PATCH /api/cart/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 404 when cartToken is missing', async () => {
    const res = await PATCH(
      {
        cookies: { get: vi.fn().mockReturnValue(undefined) },
        json: async () => ({ quantity: 3 }),
      } as never,
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(res.status).toBe(404);
  });

  it('updates item quantity and returns updated cart', async () => {
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue({ id: 1 } as never);
    vi.mocked(updateCartTotalAmount).mockResolvedValue({ totalAmount: 200 } as never);

    const res = await PATCH(
      {
        cookies: { get: vi.fn().mockReturnValue({ value: 'cart-token-1' }) },
        json: async () => ({ quantity: 3 }),
      } as never,
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { quantity: 3 },
    });
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/cart/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 404 when cartItem is not found', async () => {
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null as never);

    const res = await DELETE(
      {
        cookies: { get: vi.fn().mockReturnValue({ value: 'cart-token-1' }) },
      } as never,
      { params: Promise.resolve({ id: '2' }) },
    );

    expect(res.status).toBe(404);
  });

  it('deletes cart item and returns updated cart', async () => {
    vi.mocked(prisma.cartItem.findFirst).mockResolvedValue({ id: 2 } as never);
    vi.mocked(updateCartTotalAmount).mockResolvedValue({ totalAmount: 0, items: [] } as never);

    const res = await DELETE(
      {
        cookies: { get: vi.fn().mockReturnValue({ value: 'cart-token-1' }) },
      } as never,
      { params: Promise.resolve({ id: '2' }) },
    );

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(res.status).toBe(200);
  });
});
