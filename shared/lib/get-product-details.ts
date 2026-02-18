import { ProductItem } from '@prisma/client';
import { calcTotalProductPrice } from './calc-total-product-price';
import { SteelSizes, ProductThickness, mapProductThickness, mapSteelSize } from '../constants/profile';
import { IngredientBase } from '@/@types/IngredientBase';

export const getProductDetails = (
  thickness: ProductThickness,
  size: SteelSizes,
  items: ProductItem[],
  ingredients: IngredientBase[],
  selectedIngredients: Set<number>,
) => {
  const totalPrice = calcTotalProductPrice(thickness, size, items, ingredients, selectedIngredients);
  const textDetails = `${mapSteelSize[size]} мм, толщина ${mapProductThickness[thickness]} мм`;

  return { totalPrice, textDetails };
};
