import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    cart: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/shared/lib/calc-cart-item-total-price', () => ({
  calcCartItemTotalPrice: vi.fn(),
}));

import { updateCartTotalAmount } from '@/app/actions/update-cart-total-amount';
import { prisma } from '@/prisma/prisma-client';
import { calcCartItemTotalPrice } from '@/shared/lib/calc-cart-item-total-price';

describe('updateCartTotalAmount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 0 when cart is not found', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue(null as never);

    const result = await updateCartTotalAmount('token-1');

    expect(result).toBe(0);
    expect(prisma.cart.update).not.toHaveBeenCalled();
  });

  it('updates cart total amount based on cart item totals', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      id: 55,
      items: [{ id: 1 }, { id: 2 }],
    } as never);

    vi.mocked(calcCartItemTotalPrice).mockReturnValueOnce(100).mockReturnValueOnce(250);

    vi.mocked(prisma.cart.update).mockResolvedValue({
      id: 55,
      totalAmount: 350,
      items: [],
    } as never);

    const result = await updateCartTotalAmount('token-1');

    expect(calcCartItemTotalPrice).toHaveBeenCalledTimes(2);
    expect(prisma.cart.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 55 },
        data: { totalAmount: 350 },
      }),
    );
    expect(result).toEqual({ id: 55, totalAmount: 350, items: [] });
  });
});
