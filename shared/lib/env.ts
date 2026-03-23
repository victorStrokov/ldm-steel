import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),

  // YooKassa
  YOOKASSA_SHOP_ID: z.string().min(1, 'YOOKASSA_SHOP_ID is required'),
  YOOKASSA_SECRET_KEY: z.string().min(1, 'YOOKASSA_SECRET_KEY is required'),
  YOOKASSA_CALLBACK_URL: z.string().url('YOOKASSA_CALLBACK_URL must be a valid URL'),

  // Email
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

  // OAuth — optional (app works without them)
  MAILRU_CLIENT_ID: z.string().optional(),
  MAILRU_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  // Sentry — optional in local dev, required in production to send events
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('NEXT_PUBLIC_SENTRY_DSN must be a valid URL').optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ENABLE_DEV: z.enum(['0', '1']).optional(),
  SENTRY_DEBUG: z.enum(['0', '1']).optional(),

  // Public
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').optional(),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  const missing = _parsed.error.errors.map((e) => `  ${e.path.join('.')}: ${e.message}`).join('\n');
  throw new Error(`❌ Invalid environment variables:\n${missing}`);
}

export const env = _parsed.data;
