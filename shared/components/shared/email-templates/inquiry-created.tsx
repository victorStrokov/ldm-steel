import React from 'react';
import { Html, Head, Body, Container, Text, Hr, Section } from '@react-email/components';

interface Props {
  inquiryId: number;
  fullName: string;
  phone: string;
  address: string;
  itemsCount: number;
}

export const InquiryCreatedTemplate: React.FC<Props> = ({ inquiryId, fullName, phone, address, itemsCount }) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container
          style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', maxWidth: 360, margin: '0 auto' }}
        >
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
            Заявка №{inquiryId} принята
          </Text>

          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            Здравствуйте, {fullName}. Мы получили вашу заявку и передадим ее менеджеру для уточнения цены и условий.
          </Text>

          <Section style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Контактный телефон: {phone}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Адрес: {address}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Позиций в заявке: {itemsCount}</Text>
          </Section>

          <Hr style={{ margin: '14px 0' }} />

          <Text style={{ fontSize: '13px', color: '#555' }}>Менеджер свяжется с вами после обработки заявки.</Text>
        </Container>
      </Body>
    </Html>
  );
};
