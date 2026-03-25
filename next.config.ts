import path from 'node:path';
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const isDev = process.env.NODE_ENV !== 'production';
const imageSourceAllowlist = [
  "'self'",
  'data:',
  'blob:',
  'https://avatars.mds.yandex.net',
  'https://github.githubassets.com',
  'https://fonts.gstatic.com',
  'https://home.imgsmail.ru',
  'https://ldm-steel.com',
  'https://pub-aa61297af29a479090855b2c8344706d.r2.dev',
];
const connectSourceAllowlist = [
  "'self'",
  'https://suggestions.dadata.ru',
  'https://cleaner.dadata.ru',
  'https://*.sentry.io',
  isDev ? 'ws:' : 'wss:',
];
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `img-src ${imageSourceAllowlist.join(' ')}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  `connect-src ${connectSourceAllowlist.join(' ')}`,
].join('; ');

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // standalone output is only needed for Docker/Node.js deployments.
  // On Vercel this must NOT be set — Vercel manages its own output.
  ...(process.env.NEXT_OUTPUT === 'standalone' ? { output: 'standalone' } : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    contentDispositionType: 'attachment',
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.mds.yandex.net',
      },
      {
        protocol: 'https',
        hostname: 'ldm-steel.com',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'home.imgsmail.ru',
      },
      {
        protocol: 'https',
        hostname: 'pub-aa61297af29a479090855b2c8344706d.r2.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
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
