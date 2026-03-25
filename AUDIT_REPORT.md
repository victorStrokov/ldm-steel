# 📊 Отчет об аудите проекта LDM Steel

**Дата проведения:** 24 февраля 2026 г.  
**Версия проекта:** 0.1.0  
**Аудитор:** Автоматический анализ кодовой базы

---

## 📝 Резюме

Проект **LDM Steel** представляет собой е-commerce платформу на базе Next.js 16 с мультитенантностью, NextAuth аутентификацией и интеграцией с платежными системами. Проект имеет хорошую архитектуру, но требует значительных доработок перед production.

**Общий статус:** 🟡 Требуется доработка перед production  
**Готовность к production:** ~68%

---

## ✅ Что сделано хорошо

### 🏗️ Архитектура и структура

1. ✅ **Современный стек**
   - Next.js 16.0.7 с App Router
   - React 19.2.1 (новейшая версия)
   - TypeScript с strict mode
   - Turbopack для разработки

2. ✅ **Организация кода**
   - Route Groups: `(root)`, `(dashboard)`, `(checkout)`
   - Shared библиотеки (`components/`, `hooks/`, `lib/`, `services/`)
   - Server Actions для бизнес-логики
   - Zustand для state management

3. ✅ **База данных**
   - Prisma ORM 7.4.0
   - PostgreSQL через Neon Serverless
   - Продуманная схема с мультитенантностью
   - Миграции под контролем версий

### 🎨 Frontend

4. ✅ **UI/UX компоненты**
   - Radix UI для accessibility
   - Tailwind CSS 4.1.11
   - Responsive design
   - Модальные окна, формы, валидация

5. ✅ **Пользовательские функции**
   - Каталог товаров с фильтрацией
   - Корзина с real-time обновлением
   - Checkout процесс
   - Профиль пользователя
   - Stories (как в Instagram)

### 🔐 Безопасность и аутентификация

6. ✅ **NextAuth v4 интеграция**
   - Credentials provider
   - Session management
   - JWT токены
   - Защита роутов

7. ✅ **Password hashing**
   - bcryptjs для хеширования паролей
   - Безопасное хранение

8. ✅ **RBAC**
   - Роли: USER, ADMIN, MANAGER
   - Мультитенантность через Tenant модель

### 💳 Интеграции

9. ✅ **ЮКасса (Платежи)**
   - Создание платежей
   - Callback обработка
   - Статусы заказов

10. ✅ **Resend (Email)**
    - Email отправка
    - React Email шаблоны
    - Уведомления о заказах

11. ✅ **React Dadata**
    - Автозаполнение адресов
    - Валидация адресов

### 📊 Observability

12. ✅ **Activity Logging**
    - Логи действий пользователей
    - IP, User-Agent tracking
    - Request metadata

13. ✅ **Inventory tracking**
    - Учет остатков товаров
    - Логи изменений инвентаря

---

## ⚠️ Что требует доработки

### 🚨 Критичные проблемы (Priority: HIGH)

#### 1. **Отсутствие тестов**

- ✅ Vitest конфигурация добавлена (`vitest.config.ts`)
- ✅ Добавлены базовые unit тесты (валидация checkout и расчет цены)
- ✅ Добавлены integration тесты для критичных сценариев (checkout callback, cart API, create-order)
- ✅ Добавлены Playwright e2e smoke-тесты (`tests/e2e/smoke.spec.ts`)
- ✅ E2E прогон проходит: 6/6 passed (smoke + checkout + негативные сценарии)
- ✅ Текущий baseline покрытия после расширения тестов: lines 60.04%, statements 59.87%, functions 50.00%, branches 51.26%
- ✅ Цель 50% по lines/statements/branches/functions достигнута
- ✅ Добавлен интеграционный lifecycle-тест: createOrder -> paymentId -> callback succeeded
- ✅ Добавлен opt-in браузерный sandbox e2e-тест checkout (`tests/e2e/checkout-sandbox.spec.ts`)
- 📌 **Действие:** Настроить sandbox env/data (DB + платежные ключи) и включить `E2E_SANDBOX_ENABLED=1` в отдельном пайплайне
- ⏸️ **Временный статус:** этап sandbox e2e осознанно отложен до появления отдельной test/sandbox БД
- 🔐 **Секреты для sandbox job (GitHub Actions Secrets):** `SANDBOX_DATABASE_URL`, `SANDBOX_NEXTAUTH_SECRET`, `SANDBOX_NEXTAUTH_URL`, `SANDBOX_YOOKASSA_SHOP_ID`, `SANDBOX_YOOKASSA_SECRET_KEY`, `SANDBOX_YOOKASSA_CALLBACK_URL`, `SANDBOX_RESEND_API_KEY`
- 📌 **Когда будут основная и тестовая БД:**
  - Развести окружения: production БД только для prod, отдельная test/sandbox БД только для автотестов
  - Заполнить sandbox secrets реальными sandbox-значениями провайдеров и URL тестового контура
  - Подготовить данные в test/sandbox БД (минимум товар/`productItem` для checkout)
  - Запускать `release-gate` с `run_sandbox_e2e=true` (или `E2E_SANDBOX_ENABLED=1`) и держать этот прогон отдельным от обязательного smoke

#### 2. **Docker конфигурация (базовый уровень закрыт)**

- ✅ Добавлен `Dockerfile` (multi-stage build для Next.js standalone)
- ✅ Добавлен `docker-compose.yml` (app + postgres + healthcheck)
- ✅ Добавлен `.dockerignore`
- ✅ Добавлен deploy runbook (`docs/deploy-runbook.md`)
- ✅ Добавлен CI workflow для Docker image (`.github/workflows/docker-image.yml`, GHCR)
- ✅ `output: 'standalone'` убран из `next.config.ts` (Vercel не поддерживает standalone); Dockerfile выставляет `NEXT_OUTPUT=standalone` самостоятельно
- 📌 **Текущий prod:** Vercel (Git push → автодеплой). Docker актуален при переходе на собственный VPS/сервер

#### 3. **CI/CD pipeline в процессе**

- ✅ Добавлен GitHub Actions workflow (`.github/workflows/ci.yml`)
- ✅ Базовая автоматизация lint/test/build/e2e smoke настроена
- ✅ Добавлен отдельный CI status check для форматирования: `Format Check` (`npm run format:check`)
- ✅ Добавлен ручной release-gate workflow (`.github/workflows/release-gate.yml`)
- ✅ Добавлен workflow сборки/публикации Docker image (`.github/workflows/docker-image.yml`)
- ✅ Branch protection на `main` включен (required checks: Format Check; Lint, Unit/Integration, Build; E2E Smoke)
- ✅ **Production deploy:** Vercel автодеплой при пуше в `main` (Git Integration), env vars в Vercel Dashboard
- ✅ **Модель ownership миграций для общей БД:** schema migrations и seed выполняются только через `admin-panel` (single source of truth)
- ✅ В `ldm-steel` скрипт `vercel-build` переведен на `next build` (без `prisma migrate deploy`), чтобы исключить конфликт миграций
- 📌 **Статус:** Готово

#### 4. **TypeScript ошибка в prisma-client.ts**

- ✅ Убран `any` и исправлена типизация Prisma Neon adapter
- 📌 **Действие:** Поддерживать zero-`as any` политику в CI

#### 5. **Нет health check endpoint**

- ✅ `/api/health` — endpoint с проверкой БД (`SELECT 1`) и uptime
- ✅ Docker Compose healthcheck обновлён на `/api/health`
- 📌 **Статус:** Готово

#### 6. **Чувствительные данные в коде**

- ✅ `shared/lib/env.ts` — Zod-схема для всех обязательных env vars
- ✅ `instrumentation.ts` — fail-fast валидация при старте (только `nodejs` runtime)
- ✅ Покрыты: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `YOOKASSA_*`, `RESEND_API_KEY`
- ✅ OAuth переменные (Google/GitHub/MAILRU) — опциональные, не блокируют старт
- 📌 **Статус:** Готово

#### 7. **Недокументированные TODO**

- ✅ `app/api/checkout/callback/route.ts` — исправлен баг: ранний `return 404` делал ветку `else` мёртвым кодом (статус CANCELLED не обновлялся); переписан полностью
- ✅ `email-templates/order-failed.tsx` — создан шаблон для отправки письма при неудачной оплате; добавлен в `index.ts`
- ✅ `email-templates/pay-order.tsx` — устаревший `todo` удалён (функция уже была реализована через `calcTotalOrder`)
- ✅ `checkout-sidebar.tsx` — реализован переключатель «Доставка / Самовывоз» (состояние, динамическое ценообразование)
- ✅ `filters.tsx` — TODO задокументирован как отложенная задача v0.2.0 (показ выбранных фильтров поверх свёрнутого списка)
- 📌 **Статус:** Готово

### ⚠️ Важные проблемы (Priority: MEDIUM)

#### 8. **Логирование не структурировано**

- ✅ Создан серверный логгер: `shared/lib/logger.ts` (pino, JSON в prod / pretty в dev)
- ✅ Создан browser-safe клиентский логгер: `shared/lib/client-logger.ts` (console-враппер с labelling)
- ✅ 9 серверных файлов (API routes, actions, auth-options) → `logger.child({ module })`
- ✅ 8 клиентских файлов (компоненты, store, hooks) → `createClientLogger`
- ✅ `prisma/seed.ts` оставлен с `console.log` (CLI-скрипт — уместно)
- 📌 **Статус:** Готово

#### 9. **Отсутствие API документации**

- ✅ Добавлена OpenAPI спецификация: `/api/openapi`
- ✅ Добавлена страница документации API routes: `/api-docs`
- ✅ Добавлен интерактивный Swagger UI: `/api-docs/swagger`
- ✅ Описаны все текущие route handlers из `app/api/**/route.ts`
- 📌 **Статус:** Готово

#### 10. **Нет мониторинга и error tracking**

- ✅ Интегрирован Sentry SDK: `@sentry/nextjs`
- ✅ Добавлен error tracking для server/edge/browser runtime
- ✅ Добавлен global error boundary: `app/global-error.tsx`
- ✅ Включен базовый performance monitoring (`tracesSampleRate`)
- ✅ Проведен ручной smoke-тест Sentry: подтвержден прием server и client событий в проекте `next-steel`
- 📌 **Статус:** Готово

#### 11. **Миграция данных не завершена**

- ✅ Для общей БД зафиксирован единый владелец миграций: `admin-panel`
- ✅ `ldm-steel` не применяет schema/data миграции самостоятельно
- 📌 **Действие:** Поддерживать совместимость чтения схемы в `ldm-steel`; любые изменения схемы/seed делать через `admin-panel`

#### 12. **Нет rate limiting**

- ✅ Добавлен Upstash rate limiting (fallback pass-through, если Redis env не задан)
- ✅ Лимиты включены для auth и чувствительных API (`/api/auth/[...nextauth]` POST, `/api/auth/verify`, `/api/users`, `/api/cart` POST)
- 📌 **Действие:** На production подключить `UPSTASH_REDIS_REST_URL/TOKEN` и откалибровать окна/лимиты через env
- 📌 **Действие (после релиза):** выделить отдельные `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` для `ldm-steel` (не делить ключи/URL с `admin-panel`)

#### 13. **Отсутствие backup стратегии**

- ✅ Для общей БД зафиксирован владелец backup/restore: `admin-panel`
- ✅ **Neon** предоставляет автоматические backup и Point-in-Time Recovery (PITR) на платных планах (Launch+)
- ⚠️ **Текущий план: Free** — только 7 дней истории, PITR недоступен
- 📌 **Действие (owner: `admin-panel`):** При переходе в prod перейти на Launch+ для полноценного PITR, зафиксировать регламент backup/restore и проводить регулярный restore-drill
- 📌 **Действие (для `ldm-steel`):** После каждого восстановления БД выполнять post-restore compatibility smoke-check (критичные чтения каталога, auth/checkout сценарии, проверка совместимости схемы)
- 📌 **Регламент:** Детальные шаги и критерии PASS/FAIL описаны в `docs/deploy-runbook.md` (раздел Post-Restore Compatibility Smoke Check)

#### 14. **DEBUG код в production**

- ✅ Убран `console.log('Resend result:', ...)` из `sendEmail.ts`
- ✅ `console.log` заменён на `console.error` во всех API-маршрутах (`cart`, `checkout/callback`, `auth/verify`, `auth/me`) и server actions (`update-userInfo`)
- ✅ Дублирующий лог в `auth/verify` удалён
- 📌 **Статус:** Готово

### 📋 Желательные улучшения (Priority: LOW)

#### 15. **Оптимизация конфигурации Next.js**

- ✅ Расширена конфигурация в `next.config.ts` (включен `reactStrictMode`, отключен `X-Powered-By`)
- ✅ Добавлены базовые security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- ✅ Добавлен baseline Content Security Policy (CSP) в `next.config.ts` (dev/prod профили)
- ✅ Усилена image optimization конфигурация (`avif/webp`, `minimumCacheTTL`, SVG hardening)
- ✅ Зафиксирован baseline allowlist внешних image-hosts (`images.remotePatterns` + CSP `img-src`)
- ✅ Legacy `http` изображения переведены на `https` (источник `ldm-steel.com`)
- ✅ CSP ужесточен: `connect-src` переведен с общего `https:` на явный allowlist runtime-интеграций (DaData, Sentry, same-origin)
- 📌 **Действие:** Периодически пересматривать CSP allowlist и удалять неиспользуемые источники

#### 16. **Отсутствие линтера для styles**

- ✅ Внедрен `prettier-plugin-tailwindcss` для стабильной сортировки Tailwind-классов
- ✅ Добавлены команды форматирования: `npm run format` и `npm run format:check`
- ✅ `npm run format:check` добавлен в CI как отдельный status check
- 📌 **Действие:** При росте объема кастомного CSS добавить `stylelint` как второй слой контроля

#### 17. **Нет graceful shutdown**

- ⚠️ Приложение не закрывает соединения при остановке
- 📌 **Действие:** Добавить SIGTERM/SIGINT handlers

#### 18. **WebSocket не используется эффективно**

- ⚠️ `ws: ^8.19.0` в dependencies, но не ясно где используется
- 📌 **Действие:** Документировать использование WebSocket или удалить зависимость

---

## 🔍 Найденные конфликты и проблемы

### Конфликт #1: Схема изображений

- **Проблема:** Риск рассинхрона при независимых миграциях в двух приложениях с одной БД
- **Решение:**
  - Закрепить single source of truth: миграции и seed только через `admin-panel`
  - В `ldm-steel` не запускать `prisma migrate deploy` в деплой-пайплайне
  - Проверять обратную совместимость чтения полей в `ldm-steel` после миграций `admin-panel`

### Конфликт #2: TypeScript strict mode

- **Проблема:** Использование `as any` в prisma-client.ts
- **Решение:** Правильно типизировать Neon adapter

### Конфликт #3: Environment variables

- **Проблема:** Нет валидации переменных окружения
- **Критично:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `YOOKASSA_*`, `RESEND_API_KEY`
- **Решение:** Добавить Zod схему с проверкой при старте приложения

---

## 🗺️ Roadmap до production

### Фаза 1: Критические исправления (2-3 недели)

- [ ] **Написать тесты**
  - Unit тесты для server actions
  - Integration тесты для API routes
  - E2E тесты для checkout flow
  - Покрытие минимум 50%

- [x] **Docker setup**
  - ✅ Dockerfile для production
  - ✅ docker-compose.yml (app + postgres)
  - ✅ Multi-stage builds

- [x] **CI/CD (базовый уровень)**
  - GitHub Actions для lint/test/build
  - Automated deployment в staging
  - Environment secrets management

- [x] **Исправить TypeScript ошибки**
  - Правильная типизация Prisma Neon adapter
  - Убрать все `as any`

- [ ] **Environment validation**
  - Zod схема для переменных окружения
  - Fail-fast при отсутствии обязательных переменных

- [ ] **Health checks**
  - `/api/health` endpoint
  - Database connectivity check
  - Graceful shutdown

### Фаза 2: Важные улучшения (1-2 недели)

- [x] **Мониторинг**
  - ✅ Sentry интеграция
  - ✅ Error tracking
  - ✅ Performance monitoring (baseline tracing)

- [ ] **Логирование**
- [x] **Логирование**
  - ✅ Внедрён Pino logger (`shared/lib/logger.ts`)
  - ✅ Заменены все console.\* на logger (server) / createClientLogger (client)
  - ⏳ Structured logs с correlation IDs (correlation IDs — v0.2.0)

- [ ] **Security**
  - Rate limiting на auth endpoints
  - CSRF protection (если нужно)
  - ✅ Security headers + baseline CSP в `next.config.ts`
  - Input validation везде

- [x] **API документация**
  - ✅ OpenAPI спецификация (`/api/openapi`)
  - ✅ Документация API routes (`/api-docs`)
  - ✅ Интерактивный Swagger UI (`/api-docs/swagger`)

- [x] **Политика миграций для общей БД зафиксирована**
  - ✅ Schema/data миграции и seed выполняются только через `admin-panel`
  - ✅ В `ldm-steel` отключен запуск миграций в `vercel-build`
  - 📌 Проверка: после миграций `admin-panel` прогонять smoke в `ldm-steel`

### Фаза 3: Оптимизация (1-2 недели)

- [ ] **Performance**
  - Оптимизация запросов к БД (N+1 queries)
  - Image optimization
  - Caching стратегия
  - Bundle size optimization

- [ ] **Backup strategy (owner: admin-panel)**
  - Automated DB backups + PITR policy
  - Recovery процедуры и restore-drill
  - Post-restore compatibility smoke-check в `ldm-steel`

- [ ] **Next.js optimization**
  - Security headers
  - Image domains whitelist
  - Compression
  - Static generation где возможно

### Фаза 4: Документация (3-5 дней)

- [ ] **Техническая документация**
  - Architecture Decision Records (ADR)
  - Deployment guide
  - Environment setup guide
  - Troubleshooting guide

- [ ] **User documentation**
  - API integration guide
  - Checkout flow documentation

---

## 📊 Метрики проекта

| Метрика             | Значение    | Оценка                     |
| ------------------- | ----------- | -------------------------- |
| TypeScript покрытие | 100%        | ✅ Отлично                 |
| Test покрытие       | ~60% lines  | ✅ Базовый порог достигнут |
| Безопасность        | 70%         | ⚠️ Удовлетворительно       |
| Документация        | 30%         | ⚠️ Требуется работа        |
| Production-ready    | 68%         | ⚠️ Требуется работа        |
| Performance         | Не измерено | ⚠️ Требуется тестирование  |
| Code Quality        | 75%         | ✅ Хорошо                  |

---

## 🎯 Рекомендации по приоритетам

### Сделать прямо сейчас:

1. ✅ Исправить TypeScript ошибку (as any)
2. ⏳ Добавить env validation
3. ⏳ Убрать DEBUG логи
4. ✅ Базовый Docker setup внедрен
5. ⏳ Добавить health check

### Сделать до первого production deploy:

1. ✅ Написать базовые тесты (минимум 50%)
2. ✅ Настроить CI/CD
3. ✅ Интегрировать Sentry
4. ✅ Структурированное логирование
5. ✅ Rate limiting (базовый уровень)
6. ✅ Security headers + baseline CSP
7. ⏳ Backup/restore ownership + post-restore compatibility check
8. ⏳ Завершить миграцию данных

### Можно отложить на v0.2.0:

1. ✅ E2E smoke тесты уже добавлены
2. ✅ OpenAPI документация
3. ⏳ Advanced monitoring (APM)
4. ⏳ Stylelint
5. ⏳ Bundle optimization

---

## 🔒 Чеклист безопасности для production

- [ ] HTTPS только (enforce)
- [x] Password hashing (bcryptjs)
- [x] Rate limiting на auth endpoints
- [x] Rate limiting на API routes
- [x] SQL injection защита (Prisma ORM)
- [x] XSS защита (Content Security Policy, baseline)
- [x] Security headers (X-Frame-Options, etc.)
- [ ] Dependency vulnerability scanning
- [ ] Secret management (не хардкодить)
- [x] Input validation (Zod)
- [ ] Environment variables validation
- [ ] CSRF protection (если нужно)
- [x] Activity logging
- [ ] Regular security updates
- [ ] Error messages без чувствительной информации

---

## 📝 Отличия от admin-panel

### ✅ Преимущества ldm-steel:

1. **NextAuth интеграция** - проще, чем кастомный JWT auth
2. **Neon Serverless** - автоскейлинг PostgreSQL
3. **Route Groups** - лучшая организация роутов
4. **Email интеграция** - Resend + React Email шаблоны
5. **Stories функция** - дополнительный UX
6. **DaData** - автозаполнение адресов

### ⚠️ Недостатки ldm-steel:

1. **Меньше observability** - нет OpenTelemetry, нет request tracing
2. **Нет RBAC middleware** - менее структурированная авторизация
3. **Меньше security headers** - нет CORS настроек
4. ~~**Больше console.log**~~ — ✅ Внедрён pino + client-logger, все `console.*` заменены
5. **Меньше готовности к prod** - 68% vs 70% у admin-panel

---

## 📈 Сравнение готовности проектов

| Критерий     | admin-panel | ldm-steel |
| ------------ | ----------- | --------- |
| Архитектура  | ✅ 90%      | ✅ 85%    |
| Безопасность | ✅ 85%      | ⚠️ 70%    |
| Тесты        | ❌ 0%       | ✅ ~52%   |
| Docker       | ❌ 0%       | ✅ 60%    |
| CI/CD        | ❌ 0%       | ⚠️ 60%    |
| Мониторинг   | ⚠️ 40%      | ⚠️ 20%    |
| Документация | ⚠️ 40%      | ⚠️ 30%    |
| **ИТОГО**    | **70%**     | **68%**   |

---

## 📝 Заключение

Проект **LDM Steel** представляет собой **современное е-commerce приложение** с хорошей архитектурой и функциональностью. Основные компоненты реализованы качественно:

✅ **Сильные стороны:**

- Современный стек (Next.js 16, React 19)
- NextAuth для аутентификации
- Качественный UI/UX
- Интеграция с платежами
- Email уведомления
- Мультитенантность

❌ **Основные проблемы:**

- Нет deploy-автоматизации
- Недостаточная безопасность
- Нет мониторинга
- Много console.log
- Незавершенная миграция данных

**Оценка времени до production-ready:** 4-5 недель при fulltime работе

**Рекомендация:** Сфокусироваться на Фазе 1 и Фазе 2 roadmap'а. После их завершения проект будет готов к безопасному production deploy.

---

**Дата отчета:** 24 февраля 2026 г.  
**Следующий аудит:** После реализации Фазы 1

---

## 📌 История изменений (март 2026)

- ✅ Восстановлен и вмержен в `main` контур качества из ветки восстановления через PR
- ✅ Включены required checks для `main`: `Format Check`, `Lint, Unit/Integration, Build` и `E2E Smoke`
- ✅ Расширен e2e-контур checkout-сценариями и негативными кейсами (актуально: 6/6 тестов)
- ✅ Добавлен интеграционный checkout order lifecycle тест (happy-path + callback)
- ✅ Добавлен opt-in браузерный sandbox e2e checkout flow (по умолчанию skipped без sandbox env)
- ✅ Добавлен Docker baseline: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- ✅ Добавлен deploy runbook (`docs/deploy-runbook.md`) для env/миграций/rollback
- ✅ Добавлен Docker image workflow для GHCR (`.github/workflows/docker-image.yml`)
- ✅ Устранен флаки-тест расчета цены через детерминированный контроль `Math.random()` в unit-тесте
- ✅ Добавлена Zod-валидация env vars: `shared/lib/env.ts` + `instrumentation.ts` (fail-fast)
- ✅ Добавлен `/api/health` с проверкой БД; Docker Compose healthcheck обновлён
- ✅ Убраны debug-логи: `console.log` → `console.error` во всех маршрутах; removed `Resend result` log
- ✅ Исправлен `output: 'standalone'` в `next.config.ts`: Vercel не поддерживает standalone, `NEXT_OUTPUT=standalone` перенесён в Dockerfile
- ✅ Подтверждено: prod = Vercel + Neon Serverless; Docker сохранён для будущего VPS/миграции
- ✅ Исправлен критичный баг в `checkout/callback`: ранний `return 404` делал статус CANCELLED и email о неудаче недостижимыми; маршрут переписан
- ✅ Создан `email-templates/order-failed.tsx` — письмо покупателю при неудачной оплате
- ✅ Реализован переключатель «Доставка / Самовывоз» в `checkout-sidebar.tsx` с динамическим расчётом стоимости
- ✅ Все TODO комментарии устранены или задокументированы (items 7 закрыт)
- ✅ Все TODO комментарии устранены или задокументированы (items 7 закрыт)
- ✅ Добавлена API документация: OpenAPI endpoint (`/api/openapi`), страница маршрутов (`/api-docs`) и Swagger UI (`/api-docs/swagger`) (item 9 закрыт)
- ✅ Интегрирован Sentry monitoring: `@sentry/nextjs`, конфиг для server/edge/client, `app/global-error.tsx`, базовый tracing (item 10 закрыт)
- ✅ Подтверждено на практике: в Sentry приходят и server event (`GET /api/test-sentry`), и client event (`/test-sentry`) в одном trace
- ⚠️ Vercel Preview может оставаться красным и не блокирует merge, пока не добавлен в required checks

---

## ✅ Чек-лист расхождений ldm-steel относительно admin-panel

### 🔴 Критично (закрыть до следующего релиза)

- [ ] Закрыть публичный `GET/POST /api/users` и оставить только защищенный доступ по роли
  - Файл: `app/api/users/route.ts`
- [ ] Защитить `POST /api/checkout/callback` от подделки
  - Проверка подписи/секрета webhook
  - Верификация статуса платежа через trusted API провайдера
  - Файл: `app/api/checkout/callback/route.ts`
- [ ] Сделать атомарный сценарий создания заказа
  - Перенести критичный путь (создание заказа + фиксация платежа + очистка корзины) в транзакцию
  - Не очищать корзину до успешной фиксации заказа и `paymentId`
  - Файл: `app/actions/create-order.ts`
- [ ] Включить tenant-изоляцию во всех публичных выборках каталога
  - Файлы: `app/actions/find-products.ts`, `app/api/products/search/route.ts`, `app/api/ingredients/route.ts`
- [ ] Убрать жестко заданный `tenantId: 1` из регистрации и OAuth-создания пользователей
  - Файлы: `app/actions/register-user.ts`, `shared/constants/auth-options.ts`

### 🟠 Высокий приоритет (безопасность и корректность)

- [ ] Поднять парольную политику до `min(8)` и синхронизировать текст ошибок
  - Файл: `shared/components/shared/modals/auth-modal/forms/schemas.ts`
- [ ] Проверять `expiresAt` при подтверждении email-кода
  - Файл: `app/api/auth/verify/route.ts`
- [ ] Убрать `Math.random()` из критичных мест
  - Идемпотентность платежа: криптостойкий `Idempotence-Key`
  - Ценообразование: детерминированный расчет без random offset
  - Файлы: `shared/lib/creat-payment.ts`, `shared/lib/calculate-price.ts`
- [ ] Ввести единый error-handling контракт в server actions/API
  - Явные коды/ошибки вместо немых `catch` и `console.log`
- [x] Внедрить структурированное логирование (pino) вместо `console.*`
  - ✅ `shared/lib/logger.ts` (pino server), `shared/lib/client-logger.ts` (browser wrapper)
  - ✅ 9 server + 8 client файлов обновлены
- ✅ Все TODO комментарии устранены или задокументированы (items 7 закрыт)
- ✅ Внедрено структурированное логирование: pino (`shared/lib/logger.ts`) + browser wrapper (`shared/lib/client-logger.ts`); заменены все `console.*` в 17 файлах (item 8 закрыт)

### 🟡 Средний приоритет (production baseline)

- [x] Добавить централизованную Zod-валидацию env + fail-fast на старте
  - `shared/lib/env.ts` + `instrumentation.ts`
- [x] Добавить security headers и CSP в `next.config.ts`
- [x] Включить `reactStrictMode: true`
- [ ] Внедрить структурированное логирование (pino) вместо `console.*`
- [x] Добавить health endpoint `/api/health` с проверкой БД
- [x] Добавить rate limiting на auth и чувствительные API
- [ ] Добавить базовый request tracing (requestId + latency)

### 🧪 Тестовый контур и quality gate

- [x] Подключить Vitest (unit + integration)
- [x] Добавить Playwright smoke e2e (минимум checkout/auth/navigation)
- [x] Добавить coverage thresholds в CI
- [x] Добавить pre-commit/pre-push проверки
- [x] pre-commit: `npm run lint`
- [x] pre-push: `npm run test:coverage && npm run build`
- [x] Создать GitHub Actions workflow: lint + test + build
- [x] Добавить отдельный CI check для форматирования: `npm run format:check`
- [x] Добавить ручной release-gate workflow: lint + test:coverage + build + e2e
- [x] Добавить документацию по branch protection: `docs/branch-protection.md`
- [x] Включить required checks на ветке `main` (CI / Format Check; CI / Lint, Unit/Integration, Build; CI / E2E Smoke)
- [ ] После выделения отдельной test/sandbox БД: заполнить sandbox secrets и включить регулярный sandbox e2e прогон в release-gate

### 🧱 Deploy/операционка

- [x] Добавить `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- [x] Добавить deploy runbook (env, миграции, rollback)
- [⚠️] Backup strategy: owner в `admin-panel`; проверить PITR/restore-drill и внедрить post-restore compatibility smoke-check для `ldm-steel`
- [x] Добавить базовый мониторинг ошибок (Sentry)

### 🔁 Интеграция клиент ↔ админка (контракт данных)

- [ ] Зафиксировать единый контракт по товарам и заказам (поля, статусы, tenant-границы)
- [ ] Определить источник истины по каталогу (admin-panel) и стратегию синхронизации
- [ ] Ввести идемпотентность для входящих заказов и callback событий
- [ ] Добавить инварианты на стороне БД и API
  - `order.tenantId` обязателен и согласован с товарами заказа
  - Нельзя менять статус заказа без валидного платежного события
- [ ] Добавить smoke-check после деплоя
  - Товар создан в admin-panel → доступен в ldm-steel
  - Заказ из ldm-steel → виден в admin-panel
  - Email покупателю отправляется только после подтвержденной оплаты

### 📌 Definition of Done (для ревизии 3)

- [ ] Нет публичных опасных endpoint'ов без auth
- [ ] Checkout callback защищен и идемпотентен
- [ ] Заказ создается атомарно
- [ ] Tenant-изоляция подтверждена тестами
- [ ] Включены env validation, health checks, rate limiting, security headers
- [x] Запущены unit/integration/e2e smoke тесты в CI (required checks включены и проходят)
- [ ] Подготовлены Docker + runbook + backups + post-restore compatibility checks + error monitoring
