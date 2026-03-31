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
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', maxWidth: 360, margin: '0 auto' }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#dc2626' }}>
            Платёж не прошёл
          </Text>
          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            К сожалению, оплата заказа №{orderId} на сумму <b>{totalAmount} ₽</b> не была завершена.
          </Text>
          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Возможные причины: недостаточно средств на карте, ошибка банка или истекло время ожидания оплаты.
          </Text>
          <Hr style={{ margin: '14px 0' }} />
          <Text style={{ fontSize: '13px', color: '#555' }}>
            Если у вас остались вопросы, свяжитесь с нашей поддержкой. Средства с вашей карты не были списаны.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
