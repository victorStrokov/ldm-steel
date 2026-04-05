import React from 'react';
import { Html, Head, Body, Container, Text, Hr, Section } from '@react-email/components';

interface Props {
  inquiryId: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  itemsCount: number;
}

export const InquiryManagerNotificationTemplate: React.FC<Props> = ({
  inquiryId,
  clientName,
  clientPhone,
  clientEmail,
  address,
  itemsCount,
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container
          style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', maxWidth: 420, margin: '0 auto' }}
        >
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Новая заявка №{inquiryId}</Text>

          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Вам назначена новая заявка. Свяжитесь с клиентом для уточнения цены и условий.
          </Text>

          <Section style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Клиент: {clientName}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Телефон: {clientPhone}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Email: {clientEmail}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Адрес: {address}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Позиций в заявке: {itemsCount}</Text>
          </Section>

          <Hr style={{ margin: '14px 0' }} />

          <Text style={{ fontSize: '13px', color: '#555' }}>
            Откройте админ-панель, чтобы посмотреть состав заявки и обработать ее.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
