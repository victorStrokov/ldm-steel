import React from 'react';
import { useCartStore } from '../store';
import { CreateCartItemValues } from '../services/dto/cart.dto';
import { CartStateItem } from '../lib/get-cart-details';

type ReturnProps = {
  totalAmount: number;
  items: CartStateItem[];
  loading: boolean;
  updateItemQuantity: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  addCartItem: (value: CreateCartItemValues) => void;
};

export const useCart = (): ReturnProps => {
  //   const totalAmount = useCartStore((state) => state.totalAmount);
  //   const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  //   const items = useCartStore((state) => state.items);
  //   const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  //   const removeCartItem = useCartStore((state) => state.removeCartItem);
  //   const loading = useCartStore((state) => state.loading);
  //   const addCartItem = useCartStore((state) => state.addCartItem);
  const cartState = useCartStore((state) => state);
  React.useEffect(() => {
    cartState.fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return cartState;
};
