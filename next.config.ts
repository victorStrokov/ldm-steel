import path from 'node:path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // standalone output is only needed for Docker/Node.js deployments.
  // On Vercel this must NOT be set — Vercel manages its own output.
  ...(process.env.NEXT_OUTPUT === 'standalone' ? { output: 'standalone' } : {}),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a larger set of source maps for better stack traces in Sentry.
  widenClientFileUpload: true,

  // Keep build logs quieter in CI.
  silent: !process.env.CI,
});
