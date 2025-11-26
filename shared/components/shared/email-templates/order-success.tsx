import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  items: CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, totalAmount, items }) => {
  return (
    <div>
      <h1>Спасибо за покупку!</h1>
      <p>
        Ваш заказ No {orderId} оплачен на сумму <b>{totalAmount}</b>₽
      </p>
      <hr />
      <p>Спасибо за заказ!</p>
      <p>Список покупок:</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.productItem.product.name} - {item.productItem.price}₽ x {item.quantity} ={' '}
            {item.productItem.price! * item.quantity}₽.
          </li>
        ))}
      </ul>
    </div>
  );
};
