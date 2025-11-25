import React from 'react';

interface Props {
  orderId: string;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl }) => {
  return (
    <div>
      <h1>Здравствуйте,заказ No {orderId} создан </h1>
      <p>
        Оплатите заказ на сумму <b>{totalAmount}</b>₽. Перейдите <a href={paymentUrl}> по этой ссылке</a> для оплаты
        заказа.
      </p>
      <p>Спасибо за заказ!</p>
    </div>
  );
};
