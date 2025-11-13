import { Ingredient } from '@prisma/client';
import { mapProductThickness, SteelSizes } from './../constants/profile';
import { ProductThickness } from '@/shared/constants/profile';
export const getCartItemDetails = (
  productThickness: ProductThickness,
  steelSize: SteelSizes,
  ingredients: Ingredient[],
): string => {
  const details = [];

  if (steelSize && productThickness) {
    const thiknessName = mapProductThickness[productThickness];

    details.push(`${thiknessName} мм, ${steelSize} мм`);
  }

  if (ingredients) {
    details.push(...ingredients.map((ingredient) => ingredient.name));
  }

  return details.join(', ');
};
