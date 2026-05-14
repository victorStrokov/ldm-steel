import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { Resend } from 'resend';

export type SendEmailResult = {
  provider: 'smtp' | 'resend';
  messageId: string | null;
};

function normalizeEmail(value: string | undefined | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getSmtpConfig() {
  const host = normalizeEmail(process.env.SMTP_HOST);
  const user = normalizeEmail(process.env.SMTP_USER);
  const pass = normalizeEmail(process.env.SMTP_PASS);
  const portRaw = normalizeEmail(process.env.SMTP_PORT);
  const secureRaw = normalizeEmail(process.env.SMTP_SECURE);

  if (host && user && pass) {
    const port = Number(portRaw || '465');
    const secure = secureRaw ? secureRaw === 'true' : port === 465;
    return { host, port, secure, auth: { user, pass } };
  }

  if (user && pass) {
    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    };
  }

  return null;
}

function getFromAddress() {
  return (
    normalizeEmail(process.env.SMTP_FROM_EMAIL) ||
    normalizeEmail(process.env.RESEND_FROM_EMAIL) ||
    normalizeEmail(process.env.RESEND_FROM) ||
    normalizeEmail(process.env.SMTP_USER) ||
    'onboarding@resend.dev'
  );
}

async function sendViaSmtp(to: string, subject: string, template: React.ReactNode) {
  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) return null;

  const transporter = nodemailer.createTransport(smtpConfig);
  const html = await render(template as React.ReactElement);
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
  });

  return { provider: 'smtp', messageId: info.messageId ?? null } satisfies SendEmailResult;
}

async function sendViaResend(to: string, subject: string, template: React.ReactNode) {
  const resendKey = normalizeEmail(process.env.RESEND_API_KEY);
  if (!resendKey) {
    throw new Error('Email provider is not configured: set SMTP_* or RESEND_API_KEY');
  }

  const resend = new Resend(resendKey);
  const { data, error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    react: template,
  });

  if (error) throw error;
  return { provider: 'resend', messageId: data?.id ?? null } satisfies SendEmailResult;
}

export const sendEmail = async (to: string, subject: string, template: React.ReactNode) => {
  const normalizedTo = normalizeEmail(to);
  if (!normalizedTo) {
    throw new Error('Recipient email is empty');
  }

  try {
    const smtpResult = await sendViaSmtp(normalizedTo, subject, template);
    if (smtpResult) return smtpResult;
  } catch (smtpError) {
    if (!normalizeEmail(process.env.RESEND_API_KEY)) {
      throw smtpError;
    }
  }

  return sendViaResend(normalizedTo, subject, template);
};
