import { ProductItem } from '@prisma/client';
import { calcTotalProductPrice } from './calc-total-product-price';
import { SteelSizes, ProductThickness, mapProductThickness, mapSteelSize } from '../constants/profile';
import { PriceMode } from './catalog-mode';

export const getProductDetails = (
  thickness: ProductThickness,
  size: SteelSizes,
  items: ProductItem[],
  priceMode: PriceMode = 'visible',
) => {
  const totalPrice = calcTotalProductPrice(thickness, size, items, priceMode);
  const textDetails = `${mapSteelSize[size]} мм, толщина ${mapProductThickness[thickness]} мм`;

  return { totalPrice, textDetails };
};
