import { Product, ProductImage, ProductItem } from '@prisma/client';
import { IngredientWithImages } from './IngredientWithImages';

export type ProductWithRelations = Product & {
  ingredients: IngredientWithImages[];
  items: ProductItem[];
  images: ProductImage[];
};
