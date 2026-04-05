import { CartItemDTO } from '../services/dto/cart.dto';
import { PriceMode, canShowPrices } from './catalog-mode';

export const calcCartItemTotalPrice = (item: CartItemDTO, priceMode: PriceMode = 'visible'): number => {
  const ingredientsPrice = canShowPrices(priceMode)
    ? item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0)
    : 0;

  return (ingredientsPrice + (item.productItem.price ?? 0)) * item.quantity;
};
