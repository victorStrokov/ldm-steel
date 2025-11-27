import React from 'react';
import { Html, Head, Body, Container, Text, Hr, Section, Link } from '@react-email/components';

import { calcTotalOrder } from '@/shared/lib';

interface Props {
  orderId: string;
  totalAmount: number;
  paymentUrl: string;
}
// todo сделать тоталэмоунт с доставкой и упаковкой
export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl }) => {
  const { packingPrice, deliveryPrice, totalWithExtras } = calcTotalOrder(totalAmount);

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Text style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>
            Здравствуйте! Заказ №{orderId} создан
          </Text>

          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
            Для завершения покупки оплатите заказ на сумму <b>{totalWithExtras} ₽</b>.
          </Text>

          <Section style={{ marginBottom: '16px' }}>
            <Text style={{ fontSize: '14px', margin: '4px 0' }}>Товары: {totalAmount} ₽</Text>
            <Text style={{ fontSize: '14px', margin: '4px 0' }}>Упаковка: {packingPrice} ₽</Text>
            <Text style={{ fontSize: '14px', margin: '4px 0' }}>Доставка: {deliveryPrice} ₽</Text>
            <Hr style={{ margin: '12px 0' }} />
            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>Итого: {totalWithExtras} ₽</Text>
          </Section>

          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
            Перейдите по ссылке ниже, чтобы оплатить заказ:
          </Text>

          <Link
            href={paymentUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Оплатить заказ
          </Link>

          <Hr style={{ margin: '20px 0' }} />

          <Text style={{ fontSize: '14px', color: '#555' }}>
            Спасибо за заказ! Мы ценим ваш выбор и будем рады видеть вас снова.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
