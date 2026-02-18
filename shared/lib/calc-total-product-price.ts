import { ProductItem } from '@prisma/client';
import { SteelSizes, ProductThickness } from '../constants/profile';
import { IngredientBase } from '@/@types/IngredientBase';

/**
 * Вычисляет общую цену продукта с учётом выбранных ингредиентов
 * @example calcTotalProductPrice(1, 1, items, ingredients, selectedIngredients)
 * @param type - толщина профиля
 * @param size - размер продукта
 * @param items - список вариантов продукта
 * @param ingredients - список доступных ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 *
 * @returns - number общая цена продукта
 */
export const calcTotalProductPrice = (
  thickness: ProductThickness,
  size: SteelSizes,
  items: ProductItem[],
  ingredients: IngredientBase[],
  selectedIngredients: Set<number> = new Set<number>(),
) => {
  const productPrice =
    items?.find((item) => item.steelSize === size && item.productThickness === thickness)?.price || 0;
  const totalIngredientsPrice =
    ingredients
      ?.filter((ingredient) => selectedIngredients.has(ingredient.id))
      .reduce((acc, ingredient) => acc + ingredient.price, 0) || 0;

  return productPrice + totalIngredientsPrice;
};
