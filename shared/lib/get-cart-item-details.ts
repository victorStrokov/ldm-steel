import { mapProductThickness, SteelSizes } from './../constants/profile';
import { ProductThickness } from '@/shared/constants/profile';
export const getCartItemDetails = (productThickness?: ProductThickness, steelSize?: SteelSizes): string => {
  const details = [];

  if (steelSize && productThickness) {
    const thiknessName = mapProductThickness[productThickness];

    details.push(`${thiknessName} мм, ${steelSize} мм`);
  }

  return details.join(', ');
};
