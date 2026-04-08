This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ldm-steel

## API Documentation

- API routes documentation page: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Swagger UI (Try it out): [http://localhost:3000/api-docs/swagger](http://localhost:3000/api-docs/swagger)
- OpenAPI JSON spec: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

Both endpoints are generated from a single source: `shared/lib/openapi.ts`.

## Sentry Monitoring

Sentry is integrated for server, edge and browser runtimes.

Required in production:

```bash
SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
NEXT_PUBLIC_SENTRY_DSN=https://<key>@o<org>.ingest.sentry.io/<project>
```

Optional (source maps upload in CI/CD):

```bash
SENTRY_ORG=<org-slug>
SENTRY_PROJECT=<project-slug>
SENTRY_AUTH_TOKEN=<token>
```

## Настройка окружения

- Для локальной разработки: скопируйте `.env.example` в `.env`
- Для production: используйте `.env.production.example` как шаблон для секретов в CI/CD или на сервере
- Не коммитьте реальные секреты (`.env`, `.env.production` и т.п.)

Минимально обязательные переменные:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`
- `YOOKASSA_CALLBACK_URL`
- `RESEND_API_KEY`

Sentry-переменные опциональны локально, но рекомендуются для production.

## Prisma и миграции

- `ldm-steel` не является владельцем Prisma-миграций.
- Любые изменения схемы и запуск миграций выполняются только из `admin-panel`.
- Команда `npm run prisma:migrate` в этом проекте намеренно заблокирована.
- Папка [prisma/migrations/0000_baseline](prisma/migrations/0000_baseline) хранится только как исторический baseline-артефакт и не должна рассматриваться как актуальная схема БД.
- Актуальный источник истины для схемы и миграций: `../admin-panel/prisma/schema.prisma` и `../admin-panel/prisma/migrations`.
