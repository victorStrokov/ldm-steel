import React from 'react';
import { Html, Head, Body, Container, Text, Hr, Section, Link } from '@react-email/components';

import { calcTotalOrder } from '@/shared/lib';

interface Props {
  orderId: string;
  totalAmount: number;
  paymentUrl: string;
}
export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl }) => {
  const { packingPrice, deliveryPrice, totalWithExtras } = calcTotalOrder(totalAmount);

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container
          style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', maxWidth: 360, margin: '0 auto' }}
        >
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            Здравствуйте! Заказ №{orderId} создан
          </Text>

          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Для завершения покупки оплатите заказ на сумму <b>{totalWithExtras} ₽</b>.
          </Text>

          <Section style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Товары: {totalAmount} ₽</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Упаковка: {packingPrice} ₽</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Доставка: {deliveryPrice} ₽</Text>
            <Hr style={{ margin: '10px 0' }} />
            <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>Итого: {totalWithExtras} ₽</Text>
          </Section>

          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Перейдите по ссылке ниже, чтобы оплатить заказ:
          </Text>

          <Link
            href={paymentUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >
            Оплатить заказ
          </Link>

          <Hr style={{ margin: '14px 0' }} />

          <Text style={{ fontSize: '13px', color: '#555' }}>
            Спасибо за заказ! Мы ценим ваш выбор и будем рады видеть вас снова.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
