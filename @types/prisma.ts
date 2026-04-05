import { Product, ProductImage, ProductItem } from '@prisma/client';
import { IngredientWithImages } from './IngredientWithImages';

export type ProductRelatedProductWithTarget = {
  id: number;
  relatedProductId: number;
  kind: 'RECOMMENDED' | 'ACCESSORY' | 'COMPATIBLE';
  sortOrder: number;
  isRequired: boolean;
  compatibilityNote: string | null;
  relatedProduct: Product & {
    items: ProductItem[];
    images: ProductImage[];
  };
};

export type ProductWithRelations = Product & {
  ingredients: IngredientWithImages[];
  items: ProductItem[];
  images: ProductImage[];
  relatedProducts?: ProductRelatedProductWithTarget[];
};
