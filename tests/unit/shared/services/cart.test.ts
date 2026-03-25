import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/shared/services/axios-instance', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

import { axiosInstance } from '@/shared/services/axios-instance';
import * as cartService from '@/shared/services/cart';

describe('shared/services/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCart returns response data', async () => {
    const payload = { totalAmount: 1000, items: [] };
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: payload } as never);

    const result = await cartService.getCart();

    expect(axiosInstance.get).toHaveBeenCalledWith('/cart');
    expect(result).toEqual(payload);
  });

  it('updateCartItemQuantity sends patch request with quantity', async () => {
    const payload = { totalAmount: 1200, items: [{ id: 1 }] };
    vi.mocked(axiosInstance.patch).mockResolvedValue({ data: payload } as never);

    const result = await cartService.updateCartItemQuantity(7, 3);

    expect(axiosInstance.patch).toHaveBeenCalledWith('/cart/7', { quantity: 3 });
    expect(result).toEqual(payload);
  });

  it('removeCartItem sends delete request', async () => {
    const payload = { totalAmount: 900, items: [] };
    vi.mocked(axiosInstance.delete).mockResolvedValue({ data: payload } as never);

    const result = await cartService.removeCartItem(5);

    expect(axiosInstance.delete).toHaveBeenCalledWith('/cart/5');
    expect(result).toEqual(payload);
  });

  it('addCartItem posts values and returns cart payload', async () => {
    const payload = { totalAmount: 1500, items: [{ id: 10 }] };
    const values = { productItemId: 42, ingredients: [1, 2] };
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: payload } as never);

    const result = await cartService.addCartItem(values);

    expect(axiosInstance.post).toHaveBeenCalledWith('/cart', values);
    expect(result).toEqual(payload);
  });
});
