import { mapProductThickness, SteelSizes } from './../constants/profile';
import { ProductThickness } from '@/shared/constants/profile';
import { CartStateItem } from './get-cart-details';
export const getCartItemDetails = (
  ingredients: CartStateItem['ingredients'],
  productThickness: ProductThickness,
  steelSize: SteelSizes,
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
