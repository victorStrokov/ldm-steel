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
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Спасибо за покупку!</Text>
          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>Ваш заказ №{orderId} успешно оплачен.</Text>
          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
            Стоимость товаров: {totalAmount} ₽
            <br />
            Упаковка: {packingPrice} ₽
            <br />
            Доставка: {deliveryPrice} ₽
            <br />
            <b>Итого: {totalWithExtras} ₽</b>
          </Text>
          <Hr style={{ margin: '20px 0' }} />

          <Text style={{ fontSize: '16px', marginBottom: '8px' }}>Список покупок:</Text>
          <Section>
            <ul style={{ paddingLeft: '20px' }}>
              {items.map((item) => (
                <li key={item.id} style={{ marginBottom: '6px' }}>
                  {item.productItem.product.name} — {item.productItem.price}₽ × {item.quantity} ={' '}
                  {item.productItem.price! * item.quantity}₽
                </li>
              ))}
            </ul>
          </Section>

          <Hr style={{ margin: '20px 0' }} />

          <Text style={{ fontSize: '14px', color: '#555' }}>
            Мы ценим ваш выбор и надеемся снова увидеть вас в нашем магазине!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
