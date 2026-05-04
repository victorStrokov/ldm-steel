import { CartDTO } from '../services/dto/cart.dto';
import { calcCartItemTotalPrice } from './calc-cart-item-total-price';

export type CartStateItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string | null;
  price: number | null;
  disabled?: boolean;
  sizeDisplay?: string | null;
  thicknessDisplay?: string | null;
};

interface ReturnProps {
  items: CartStateItem[];
  totalAmount: number;
}

export const getCartDetails = (data: CartDTO): ReturnProps => {
  const items = data.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.productItem.product.name,
    imageUrl: item.productItem.product.images[0]?.url ?? null,
    price: calcCartItemTotalPrice(item),
    sizeDisplay: item.productItem.sizeDisplay,
    thicknessDisplay: item.productItem.thicknessDisplay,
    disabled: false,
  })) as CartStateItem[];

  return {
    items,
    totalAmount: data.totalAmount,
  };
};
