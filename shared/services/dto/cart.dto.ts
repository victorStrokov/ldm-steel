import { Cart, CartItem, Ingredient, Product, ProductItem, ProductImage } from '@prisma/client';

export type CartItemDTO = CartItem & {
  productItem: ProductItem & {
    product: Product & {
      images: ProductImage[]; // ✔ добавили картинки
    };
  };
  ingredients: Ingredient[];
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productItemId: number;
  ingredients?: number[];
}
