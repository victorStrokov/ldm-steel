import React from 'react';
import { Html, Head, Body, Container, Text, Hr } from '@react-email/components';

interface Props {
  orderId: number;
  totalAmount: number;
}

export const OrderFailedTemplate: React.FC<Props> = ({ orderId, totalAmount }) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#dc2626' }}>
            Платёж не прошёл
          </Text>
          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
            К сожалению, оплата заказа №{orderId} на сумму <b>{totalAmount} ₽</b> не была завершена.
          </Text>
          <Text style={{ fontSize: '16px', marginBottom: '12px' }}>
            Возможные причины: недостаточно средств на карте, ошибка банка или истекло время ожидания оплаты.
          </Text>
          <Hr style={{ margin: '20px 0' }} />
          <Text style={{ fontSize: '14px', color: '#555' }}>
            Если у вас остались вопросы, свяжитесь с нашей поддержкой. Средства с вашей карты не были списаны.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
