import { CartItemDTO } from '../services/dto/cart.dto';
import { PriceMode, canShowPrices } from './catalog-mode';

export const calcCartItemTotalPrice = (item: CartItemDTO, priceMode: PriceMode = 'visible'): number => {
  const basePrice = canShowPrices(priceMode) ? (item.productItem.price ?? 0) : 0;
  return basePrice * item.quantity;
};
