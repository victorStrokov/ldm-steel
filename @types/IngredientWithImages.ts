import { Ingredient, IngredientImage } from '@prisma/client';

export type IngredientWithImages = Ingredient & {
  images: IngredientImage[];
};
