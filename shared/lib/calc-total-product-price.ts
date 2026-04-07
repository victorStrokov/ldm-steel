import { ProductItem } from '@prisma/client';
import { SteelSizes, ProductThickness } from '../constants/profile';
import { PriceMode, canShowPrices } from './catalog-mode';

/**
 * Вычисляет общую цену продукта по выбранному варианту.
 * @example calcTotalProductPrice(1, 1, items)
 * @param type - толщина профиля
 * @param size - размер продукта
 * @param items - список вариантов продукта
 * @param priceMode - режим отображения цены
 * @returns - number общая цена продукта
 */
export const calcTotalProductPrice = (
  thickness: ProductThickness,
  size: SteelSizes,
  items: ProductItem[],
  priceMode: PriceMode = 'visible',
) => {
  if (!canShowPrices(priceMode)) {
    return 0;
  }

  const productPrice =
    items?.find((item) => item.steelSize === size && item.productThickness === thickness)?.price || 0;

  return productPrice;
};
