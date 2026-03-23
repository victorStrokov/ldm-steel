import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate required environment variables at server startup.
    // If any are missing the process throws immediately instead of failing silently at runtime.
    await import('@/shared/lib/env');

    // Initialize Sentry for Node.js runtime.
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Sentry for Edge runtime.
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
