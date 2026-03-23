import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/services/api-client', () => ({
  Api: {
    cart: {
      getCart: vi.fn(),
      updateCartItemQuantity: vi.fn(),
      removeCartItem: vi.fn(),
      addCartItem: vi.fn(),
    },
  },
}));

vi.mock('@/shared/lib', () => ({
  getCartDetails: vi.fn(),
}));

import { Api } from '@/shared/services/api-client';
import { getCartDetails } from '@/shared/lib';
import { useCartStore } from '@/shared/store/cart';

describe('shared/store/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({
      items: [],
      error: false,
      loading: true,
      totalAmount: 0,
    });
  });

  it('fetchCartItems updates state from getCartDetails', async () => {
    const apiCart = { totalAmount: 1000, items: [{ id: 1 }] };
    const mappedCart = { totalAmount: 1000, items: [{ id: 1, name: 'Item 1' }] };

    vi.mocked(Api.cart.getCart).mockResolvedValue(apiCart as never);
    vi.mocked(getCartDetails).mockReturnValue(mappedCart as never);

    await useCartStore.getState().fetchCartItems();

    expect(Api.cart.getCart).toHaveBeenCalledTimes(1);
    expect(getCartDetails).toHaveBeenCalledWith(apiCart);
    expect(useCartStore.getState().totalAmount).toBe(1000);
    expect(useCartStore.getState().items).toEqual(mappedCart.items);
    expect(useCartStore.getState().error).toBe(false);
    expect(useCartStore.getState().loading).toBe(false);
  });

  it('updateItemQuantity calls API and updates state', async () => {
    const apiCart = { totalAmount: 1200, items: [{ id: 2 }] };
    const mappedCart = { totalAmount: 1200, items: [{ id: 2, quantity: 3 }] };

    vi.mocked(Api.cart.updateCartItemQuantity).mockResolvedValue(apiCart as never);
    vi.mocked(getCartDetails).mockReturnValue(mappedCart as never);

    await useCartStore.getState().updateItemQuantity(2, 3);

    expect(Api.cart.updateCartItemQuantity).toHaveBeenCalledWith(2, 3);
    expect(useCartStore.getState().totalAmount).toBe(1200);
    expect(useCartStore.getState().items).toEqual(mappedCart.items);
    expect(useCartStore.getState().loading).toBe(false);
  });

  it('addCartItem calls API and updates state', async () => {
    const apiCart = { totalAmount: 1400, items: [{ id: 3 }] };
    const mappedCart = { totalAmount: 1400, items: [{ id: 3, quantity: 1 }] };

    vi.mocked(Api.cart.addCartItem).mockResolvedValue(apiCart as never);
    vi.mocked(getCartDetails).mockReturnValue(mappedCart as never);

    await useCartStore.getState().addCartItem({ productItemId: 44, ingredients: [1, 2] });

    expect(Api.cart.addCartItem).toHaveBeenCalledWith({ productItemId: 44, ingredients: [1, 2] });
    expect(useCartStore.getState().totalAmount).toBe(1400);
    expect(useCartStore.getState().items).toEqual(mappedCart.items);
    expect(useCartStore.getState().loading).toBe(false);
  });

  it('removeCartItem disables items during request and restores on error', async () => {
    useCartStore.setState({
      items: [
        { id: 10, disabled: false, quantity: 1 },
        { id: 11, disabled: false, quantity: 2 },
      ] as never,
      error: false,
      loading: false,
      totalAmount: 200,
    });

    vi.mocked(Api.cart.removeCartItem).mockRejectedValue(new Error('network'));

    await useCartStore.getState().removeCartItem(10);

    expect(Api.cart.removeCartItem).toHaveBeenCalledWith(10);
    expect(useCartStore.getState().error).toBe(true);
    expect(useCartStore.getState().loading).toBe(false);
    expect(useCartStore.getState().items.every((item) => item.disabled === false)).toBe(true);
  });
});
