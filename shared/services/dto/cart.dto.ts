import { Cart, CartItem, Ingredient, Product, ProductItem, ProductImage } from '@prisma/client';

export type CartItemDTO = CartItem & {
  productItem: ProductItem & {
    product: Product & {
      images: ProductImage[]; // ✔ добавили картинки
    };
  };
  ingredients?: Ingredient[];
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productItemId: number;
  ingredients?: number[];
}

export interface OrderSnapshotIngredient {
  id: number;
  name: string;
  price: number;
}

export interface OrderSnapshotItem {
  id: number;
  cartItemId: number;
  quantity: number;
  productItemId: number;
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
  steelSize: number | null;
  productThickness: number | null;
  ingredients: OrderSnapshotIngredient[];
}
