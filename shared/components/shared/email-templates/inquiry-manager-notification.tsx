import React from 'react';
import { Html, Head, Body, Container, Text, Hr, Section, Link } from '@react-email/components';

type InquiryEmailItem = {
  name: string;
  sku: string;
  quantity: number;
  categoryName?: string;
};

interface Props {
  inquiryId: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: string;
  items: InquiryEmailItem[];
  inquiryUrl?: string;
  introText?: string;
  feedbackLinks?: {
    accept: string;
    complete: string;
    cancel: string;
  };
}

const buttonStyle = {
  display: 'inline-block',
  marginRight: '8px',
  marginBottom: '8px',
  padding: '10px 14px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 'bold',
  textDecoration: 'none',
} as const;

export const InquiryManagerNotificationTemplate: React.FC<Props> = ({
  inquiryId,
  clientName,
  clientPhone,
  clientEmail,
  address,
  items,
  inquiryUrl,
  introText,
  feedbackLinks,
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <Container
          style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', maxWidth: 560, margin: '0 auto' }}
        >
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Новая заявка №{inquiryId}</Text>

          <Text style={{ fontSize: '15px', marginBottom: '10px' }}>
            {introText ?? 'Вам назначены позиции из новой заявки. Ниже состав только по вашим группам товаров.'}
          </Text>

          <Section style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Клиент: {clientName}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Телефон: {clientPhone}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Email: {clientEmail}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Адрес: {address}</Text>
            <Text style={{ fontSize: '13px', margin: '3px 0' }}>Позиций для вас: {items.length}</Text>
          </Section>

          <Hr style={{ margin: '14px 0' }} />

          <Section>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Состав заявки</Text>
            {items.map((item, index) => (
              <Text key={`${item.sku}-${index}`} style={{ fontSize: '13px', margin: '6px 0', lineHeight: '1.5' }}>
                {index + 1}. {item.name} ({item.sku}){item.categoryName ? `, ${item.categoryName}` : ''} —{' '}
                {item.quantity} шт.
              </Text>
            ))}
          </Section>

          {(feedbackLinks || inquiryUrl) && <Hr style={{ margin: '14px 0' }} />}

          {feedbackLinks && (
            <Section style={{ marginBottom: '10px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Быстрая обратная связь</Text>
              <Link
                href={feedbackLinks.accept}
                style={{ ...buttonStyle, backgroundColor: '#1d4ed8', color: '#ffffff' }}
              >
                Принята в работу
              </Link>
              <Link
                href={feedbackLinks.complete}
                style={{ ...buttonStyle, backgroundColor: '#15803d', color: '#ffffff' }}
              >
                Выполнена
              </Link>
              <Link
                href={feedbackLinks.cancel}
                style={{ ...buttonStyle, backgroundColor: '#b91c1c', color: '#ffffff' }}
              >
                Отменена
              </Link>
              <Text style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Кнопка откроет страницу подтверждения. После подтверждения статус обновится в админ-панели.
              </Text>
            </Section>
          )}

          {inquiryUrl && (
            <Text style={{ fontSize: '13px', color: '#555' }}>
              Открыть заявку: <Link href={inquiryUrl}>{inquiryUrl}</Link>
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};
