import { Cart, CartItem, Product, ProductItem, ProductImage } from '@prisma/client';

export type CartItemDTO = CartItem & {
  productItem: ProductItem & {
    product: Product & {
      images: ProductImage[]; // ✔ добавили картинки
    };
  };
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productItemId: number;
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
  sizeDisplay: string | null;
  thicknessDisplay: string | null;
}
