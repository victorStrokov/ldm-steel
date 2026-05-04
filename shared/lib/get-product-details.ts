import { ProductItem } from '@prisma/client';
import { calcTotalProductPrice } from './calc-total-product-price';
import { PriceMode } from './catalog-mode';

export const getProductDetails = (
  thickness: string,
  size: string,
  items: ProductItem[],
  priceMode: PriceMode = 'visible',
) => {
  const totalPrice = calcTotalProductPrice(thickness, size, items, priceMode);
  const textDetails = `${size}, толщина ${thickness}`;

  return { totalPrice, textDetails };
};
