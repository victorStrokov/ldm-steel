import React from 'react';

interface Props {
  code: string;
}

export const VerificationUserTemplate: React.FC<Props> = ({ code }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 360, margin: '0 auto', padding: 16, fontSize: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <span>Код подтверждения:</span>
        <div style={{ fontSize: 24, fontWeight: 'bold', margin: '8px 0', letterSpacing: 2 }}>{code}</div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <a
          href={`http://localhost:3000/api/auth/verify?code=${code}`}
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Подтвердить регистрацию
        </a>
      </div>
      <div style={{ color: '#888', fontSize: 13, marginTop: 16 }}>
        Если вы не запрашивали регистрацию, просто проигнорируйте это письмо.
      </div>
    </div>
  );
};
