import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { Html, Head, Body, Container, Text, Hr, Section } from '@react-email/components';

import React from 'react';
import { calcTotalOrder } from '@/shared/lib';

interface Props {
  orderId: number;
  totalAmount: number;
  items: CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, totalAmount, items }) => {
  const { packingPrice, deliveryPrice, totalWithExtras } = calcTotalOrder(totalAmount);

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', maxWidth: 360, margin: '0 auto' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Спасибо за покупку!</Text>
          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>Ваш заказ №{orderId} успешно оплачен.</Text>
          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Стоимость товаров: {totalAmount} ₽<br />
            Упаковка: {packingPrice} ₽<br />
            Доставка: {deliveryPrice} ₽<br />
            <b>Итого: {totalWithExtras} ₽</b>
          </Text>
          <Hr style={{ margin: '14px 0' }} />

          <Text style={{ fontSize: '15px', marginBottom: '7px' }}>Список покупок:</Text>
          <Section>
            <ul style={{ paddingLeft: '16px', fontSize: 14 }}>
              {items.map((item) => (
                <li key={item.id} style={{ marginBottom: '4px' }}>
                  {item.productItem.product.name} — {item.productItem.price}₽ × {item.quantity} = {item.productItem.price! * item.quantity}₽
                </li>
              ))}
            </ul>
          </Section>

          <Hr style={{ margin: '14px 0' }} />

          <Text style={{ fontSize: '13px', color: '#555' }}>
            Мы ценим ваш выбор и надеемся снова увидеть вас в нашем магазине!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
