import { ProductItem } from '@prisma/client';
import { PriceMode, canShowPrices } from './catalog-mode';

/**
 * Вычисляет общую цену продукта по выбранному варианту.
 * @example calcTotalProductPrice('2', '30x28', items)
 * @param thickness - толщина профиля (display)
 * @param size - размер продукта (display)
 * @param items - список вариантов продукта
 * @param priceMode - режим отображения цены
 * @returns - number общая цена продукта
 */
export const calcTotalProductPrice = (
  thickness: string,
  size: string,
  items: ProductItem[],
  priceMode: PriceMode = 'visible',
) => {
  if (!canShowPrices(priceMode)) {
    return 0;
  }

  const productPrice =
    items?.find((item) => item.sizeDisplay === size && item.thicknessDisplay === thickness)?.price || 0;

  return productPrice;
};
