import crypto from 'crypto';

const FEEDBACK_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export type InquiryFeedbackTokenPayload = {
  taskId: number;
  inquiryId: number;
  managerId: number;
  tenantId: number;
  iat: number;
  exp: number;
};

function getFeedbackSecret() {
  const secret = process.env.INQUIRY_FEEDBACK_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('INQUIRY_FEEDBACK_SECRET or NEXTAUTH_SECRET is required');
  }

  return secret;
}

function sign(b64: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(b64).digest('base64url');
}

export function signInquiryFeedbackToken(payload: Omit<InquiryFeedbackTokenPayload, 'iat' | 'exp'>): string {
  const now = Date.now();
  const full = { ...payload, iat: now, exp: now + FEEDBACK_TOKEN_TTL_MS };
  const b64 = Buffer.from(JSON.stringify(full)).toString('base64url');
  const sig = sign(b64, getFeedbackSecret());
  return `${b64}.${sig}`;
}
