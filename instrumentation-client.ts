import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable tracing in the browser. Adjust the sampling rate in production.
  tracesSampleRate: 0.1,

  // Collect session-level errors as part of release health.
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,

  enabled: process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLE_DEV === '1',
  debug: process.env.SENTRY_DEBUG === '1',
});
