# 📋 Структура проекта LDM Steel

## 🎯 Общая информация

**Название проекта:** LDM Steel (nextsteel)  
**Версия:** 0.1.0  
**Тип:** E-commerce платформа с мультитенантностью  
**Framework:** Next.js 16.0.7 (App Router + Turbopack)  
**Язык:** TypeScript 5  
**База данных:** PostgreSQL + Prisma ORM 7.4.0 (Neon Serverless)  
**Последний аудит:** 24 февраля 2026 г.  
**Статус:** 🟡 В разработке (65% готовности к production)

---

## 📁 Структура файлов и директорий

```
ldm-steel/
│
├── 📂 app/                          # Next.js App Router
│   ├── globals.css                  # Глобальные стили
│   ├── layout.tsx                   # Корневой layout
│   ├── favicon.ico                  # Иконка сайта
│   │
│   ├── 📂 (root)/                   # Layout Group: Публичная часть
│   │   ├── layout.tsx               # Layout пользовательского интерфейса
│   │   ├── page.tsx                 # Главная страница (каталог)
│   │   ├── 📂 @modal/               # Parallel route для модалок
│   │   │   └── (.)product/          # Intercepting route для product modal
│   │   ├── 📂 not-auth/             # Страница для неавторизованных
│   │   │   └── page.tsx
│   │   ├── 📂 product/              # Страницы товаров
│   │   │   └── 📂 [id]/
│   │   │       └── page.tsx         # Детальная страница товара
│   │   └── 📂 profile/              # Профиль пользователя
│   │       └── page.tsx
│   │
│   ├── 📂 (checkout)/               # Layout Group: Оформление заказа
│   │   ├── layout.tsx               # Layout checkout
│   │   └── 📂 checkout/
│   │       └── page.tsx             # Страница оформления заказа
│   │
│   ├── 📂 (dashboard)/              # Layout Group: Админ-панель
│   │   ├── layout.tsx               # Layout dashboard
│   │   └── 📂 dashboard/
│   │       └── page.tsx             # Dashboard page
│   │
│   ├── 📂 actions/                  # Server Actions
│   │   ├── index.ts                 # Экспорт всех actions
│   │   ├── create-order.ts          # Создание заказа
│   │   ├── find-products.ts         # Поиск товаров (с фильтрами)
│   │   ├── register-user.ts         # Регистрация пользователя
│   │   ├── update-cart-total-amount.ts # Обновление суммы корзины
│   │   └── update-userInfo.ts       # Обновление информации пользователя
│   │
│   └── 📂 api/                      # API Routes (REST API)
│       ├── 📂 auth/                 # NextAuth endpoints
│       │   └── 📂 [...nextauth]/
│       │       └── route.ts
│       ├── 📂 cart/                 # Корзина API
│       │   └── route.ts             # GET, PATCH /api/cart
│       ├── 📂 checkout/             # Checkout API
│       │   └── 📂 callback/         # POST /api/checkout/callback (ЮКасса)
│       │       └── route.ts
│       ├── 📂 ingredients/          # Ингредиенты
│       │   └── route.ts             # GET /api/ingredients
│       ├── 📂 products/             # Товары
│       │   ├── route.ts             # GET /api/products
│       │   └── 📂 search/           # GET /api/products/search
│       │       └── route.ts
│       ├── 📂 stories/              # Stories (истории)
│       │   └── route.ts             # GET /api/stories
│       └── 📂 users/                # Пользователи
│           └── route.ts             # GET /api/users
│
├── 📂 prisma/                       # Prisma ORM
│   ├── schema.prisma                # Схема базы данных
│   ├── prisma-client.ts             # Neon Serverless adapter
│   ├── prisma.config.ts             # Конфигурация Prisma
│   ├── seed.ts                      # Скрипт заполнения БД тестовыми данными
│   └── 📂 migrations/               # Миграции БД
│       └── 📂 [timestamp]_[name]/
│
├── 📂 shared/                       # Переиспользуемый код
│   │
│   ├── 📂 components/               # React компоненты
│   │   ├── index.ts
│   │   ├── 📂 shared/               # Бизнес-компоненты
│   │   │   ├── cart-button.tsx
│   │   │   ├── cart-drawer.tsx
│   │   │   ├── cart-item.tsx
│   │   │   ├── categories.tsx
│   │   │   ├── checkout-item.tsx
│   │   │   ├── checkout-sidebar.tsx
│   │   │   ├── choose-product-form.tsx
│   │   │   ├── container.tsx
│   │   │   ├── count-button.tsx
│   │   │   ├── filters.tsx
│   │   │   ├── header.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── product-image.tsx
│   │   │   ├── products-group-list.tsx
│   │   │   ├── profile-form.tsx
│   │   │   ├── range-slider.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── stories.tsx
│   │   │   ├── title.tsx
│   │   │   ├── top-bar.tsx
│   │   │   ├── checkout-form-input.tsx
│   │   │   ├── checkout-personal-form.tsx
│   │   │   ├── 📂 email-templates/  # React Email шаблоны
│   │   │   │   ├── pay-order.tsx
│   │   │   │   └── verification-user.tsx
│   │   │   └── 📂 modals/           # Модальные окна
│   │   │       ├── auth-modal/
│   │   │       └── choose-product-modal.tsx
│   │   └── 📂 ui/                   # UI компоненты (Radix UI + shadcn/ui)
│   │       ├── button.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── input.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       └── ... (другие UI компоненты)
│   │
│   ├── 📂 constants/                # Константы
│   │   ├── auth-options.ts          # NextAuth конфигурация
│   │   ├── checkout-form-schema.ts  # Zod схема для checkout
│   │   └── index.ts
│   │
│   ├── 📂 hooks/                    # Кастомные хуки
│   │   ├── index.ts
│   │   ├── use-cart.ts              # Работа с корзиной (Zustand)
│   │   ├── use-filters.ts           # Фильтры товаров
│   │   ├── use-ingredients.ts       # Загрузка ингредиентов
│   │   └── use-query-filters.ts     # Синхронизация фильтров с query params
│   │
│   ├── 📂 lib/                      # Утилиты и вспомогательные функции
│   │   ├── index.ts
│   │   ├── build-variants.ts        # Генерация вариантов продуктов
│   │   ├── calc-cart-item-total-price.ts # Расчет цены товара в корзине
│   │   ├── calc-total-order.ts      # Расчет итоговой суммы заказа
│   │   ├── calc-total-product-price.ts # Расчет цены продукта
│   │   ├── calculate-price.ts       # Общий расчет цен
│   │   ├── creat-payment.ts         # Создание платежа (ЮКасса)
│   │   ├── find-or-create-cart.ts   # Найти или создать корзину
│   │   ├── get-available-product-thicknes.ts # Доступные толщины
│   │   ├── get-cart-details.ts      # Детали корзины
│   │   ├── get-cart-item-details.ts # Детали элемента корзины
│   │   ├── get-product-details.ts   # Детали продукта
│   │   ├── get-user-session.ts      # Получение сессии пользователя
│   │   ├── getLabel.ts              # Получение лейблов для UI
│   │   ├── product-length-rename.ts # Переименование длин продуктов
│   │   ├── sendEmail.ts             # Отправка email (Resend)
│   │   └── utils.ts                 # Общие утилиты (cn, clsx, etc.)
│   │
│   ├── 📂 services/                 # API клиенты
│   │   ├── api-client.ts            # Axios instance
│   │   ├── api-constants.ts         # API endpoint константы
│   │   ├── axios-instance.ts        # Настроенный axios
│   │   ├── auth.ts                  # Auth API
│   │   ├── cart.ts                  # Cart API
│   │   ├── ingredients.ts           # Ingredients API
│   │   ├── products.ts              # Products API
│   │   ├── stories.ts               # Stories API
│   │   └── 📂 dto/                  # Data Transfer Objects
│   │       ├── cart.dto.ts
│   │       └── ... (другие DTO)
│   │
│   └── 📂 store/                    # Zustand стейт-менеджмент
│       └── cart.ts                  # Глобальное состояние корзины
│
├── 📂 @types/                       # Глобальные типы
│   ├── base.types.ts                # Базовые типы
│   ├── fittings.types.ts            # Типы фурнитуры
│   ├── IngredientBase.ts            # Базовый тип ингредиента
│   ├── IngredientWithImages.ts      # Ингредиент с изображениями
│   ├── next-auth.d.ts               # Расширение типов NextAuth
│   ├── prisma.ts                    # Типы Prisma
│   ├── product.types.ts             # Типы продуктов
│   └── youkassa.ts                  # Типы ЮКассы
│
├── 📂 public/                       # Статические файлы
│   └── 📂 assets/                   # Ассеты (изображения, шрифты)
│
├── 📄 .env                           # Переменные окружения (не в git)
├── 📄 .gitignore                    # Git ignore файл
├── 📄 .prettierignore               # Prettier ignore
├── 📄 .prettierrc.json              # Prettier конфигурация
├── 📄 components.json               # Конфигурация shadcn/ui
├── 📄 eslint.config.mjs             # Конфигурация ESLint
├── 📄 next-env.d.ts                 # Типы Next.js
├── 📄 next.config.ts                # Конфигурация Next.js
├── 📄 package.json                  # Зависимости и скрипты
├── 📄 postcss.config.mjs            # Конфигурация PostCSS
├── 📄 prisma.config.ts              # Конфигурация Prisma
├── 📄 README.md                     # Базовая документация
├── 📄 tsconfig.json                 # Конфигурация TypeScript
├── 📄 update.ps1                    # PowerShell скрипт для обновления
├── 📄 AUDIT_REPORT.md               # Отчет об аудите проекта
├── 📄 CHANGES_SUMMARY.md            # Итоги миграции imageUrl → images[]
└── 📄 FIX_IMAGES.md                 # Инструкция по исправлению изображений
```

---

## 🗄️ База данных (Prisma Schema)

### Основные модели:

#### **Tenant** (Мультитенантность)

- `id`, `name`, `createdAt`
- Связи: `users[]`, `products[]`, `orders[]`, `categories[]`, `inventory[]`, `inventoryLogs[]`

#### **User** (Пользователи)

- `id`, `fullName`, `email`, `passwordHash`, `role`, `tenantId`
- `verified`, `provider`, `providerId`, `mustChangePassword`, `banned`
- Роли: `USER`, `ADMIN`, `MANAGER`
- Связи: `sessions[]`, `activityLogs[]`, `orders[]`, `cart`, `tenant`

#### **Session** (Сессии пользователей)

- `id`, `userId`, `refreshToken`, `userAgent`, `ip`, `deviceId`, `expiresAt`
- Связи: `user` (cascade delete)

#### **ActivityLog** (Логи активности)

- `id`, `userId`, `action`, `ip`, `userAgent`, `requestId`, `method`, `url`, `latencyMs`, `meta`, `createdAt`
- Связи: `user` (cascade delete)

#### **Category** (Категории)

- `id`, `name`, `slug`, `tenantId`, `parentId`, `createdAt`, `updatedAt`
- Связи: `parent`, `children[]`, `products[]`, `tenant`
- Поддержка вложенных категорий

#### **Product** (Товары)

- `id`, `name`, `slug`, `tenantId`, `categoryId`, `shortDesc`, `fullDesc`, `status`
- Статусы: `ACTIVE`, `ARCHIVED`, `DRAFT`
- Связи: `items[]`, `images[]`, `ingredients[]`, `category`, `tenant`

#### **ProductImage** (Изображения товаров)

- `id`, `productId`, `url`, `sortOrder`
- Связи: `product`
- Поддержка множественных изображений с сортировкой

#### **ProductItem** (Варианты товаров)

- `id`, `sku`, `price`, `productId`
- Характеристики: `productColor`, `productLength`, `productMaterials`, `productShape`, `productSizes`, `productThickness`, `pvcSize`, `steelSize`
- Материалы: `STEEL`, `PVC`, `ALUMINIUM`, `PLASTIC`, `RUBBER`
- Связи: `product`, `cartItem[]`, `inventory`

#### **Inventory** (Инвентаризация)

- `id`, `productItemId`, `quantity`, `tenantId`, `createdAt`, `updatedAt`
- Связи: `productItem`, `tenant`, `logs[]`

#### **InventoryLog** (Логи инвентаря)

- `id`, `inventoryId`, `productItemId`, `tenantId`, `userId`, `change`, `oldQuantity`, `newQuantity`, `reason`, `requestId`, `createdAt`
- Связи: `inventory`, `tenant`

#### **Ingredient** (Ингредиенты/Дополнения)

- `id`, `name`, `price`, `createdAt`, `updatedAt`
- Связи: `images[]`, `cartItem[]`, `products[]`

#### **IngredientImage** (Изображения ингредиентов)

- `id`, `ingredientId`, `url`, `sortOrder`
- Связи: `ingredient`

#### **Cart** (Корзины)

- `id`, `userId`, `token`, `totalAmount`, `createdAt`, `updatedAt`
- Связи: `user`, `items[]`

#### **CartItem** (Элементы корзины)

- `id`, `cartId`, `productItemId`, `quantity`, `createdAt`, `updatedAt`
- Связи: `cart`, `productItem`, `ingredients[]`

#### **Order** (Заказы)

- `id`, `userId`, `tenantId`, `token`, `totalAmount`, `status`, `paymentId`
- `items` (JSON), `fullName`, `email`, `phone`, `address`, `comment`
- Статусы: `PENDING`, `SUCCEEDED`, `CANCELLED`
- Связи: `user`, `tenant`

#### **VerificationCode** (Коды подтверждения)

- `id`, `userId`, `code`, `expiresAt`, `createdAt`
- Связи: `user`

#### **Story** & **StoryItem** (Истории)

- Stories функциональность (как в Instagram)
- `Story`: `id`, `previewImageUrl`, `createdAt`
- `StoryItem`: `id`, `storyId`, `sourceUrl`, `createdAt`

---

## 🛠️ Технологический стек

### Frontend

- **React** 19.2.1
- **Next.js** 16.0.7 (App Router + Turbopack)
- **TypeScript** 5
- **Tailwind CSS** 4.1.11
- **Radix UI** (headless UI components)
- **Lucide React** 0.525.0 (иконки)

### State Management & Data Fetching

- **Zustand** 5.0.6 (глобальное состояние корзины)
- **React Hook Form** 7.59.0
- **Server Actions** (для мутаций)
- **SWR** (через react-use для некоторых запросов)

###Backend & Database

- **Prisma ORM** 7.4.0
- **PostgreSQL** (через Neon Serverless)
- **@prisma/adapter-neon** 7.4.1
- **@neondatabase/serverless** 1.0.2

### Authentication & Security

- **NextAuth.js** 4.24.13
- **bcryptjs** 3.0.3 (password hashing)
- **JWT** (через NextAuth)

### Validation & Forms

- **Zod** 3.25.76
- **@hookform/resolvers** 5.2.2

### Integrations

- **ЮКасса** (платежная система)
- **Resend** 6.5.2 (email отправка)
- **@react-email/components** 1.0.1 (email шаблоны)
- **react-dadata** 2.28.0-beta.0 (автозаполнение адресов)
- **axios** 1.11.0 (HTTP клиент)

### UI/UX

- **NextJS TopLoader** 3.9.17 (loading bar)
- **react-hot-toast** 2.6.0 (уведомления)
- **react-insta-stories** 2.8.0 (stories компонент)
- **react-use** 17.6.0 (utility hooks)
- **vaul** 1.1.2 (drawer component)

### Development Tools

- **ESLint** 9
- **Prettier** (с конфигурацией)
- **TypeScript** 5
- **tsx** 4.21.0 (для запуска TypeScript)
- **dotenv-cli** 11.0.0 (для env переменных)
- **baseline-browser-mapping** 2.9.19

### Other

- **ws** 8.19.0 (WebSocket)
- **qs** 6.14.0 (query string parsing)

---

## 📜 Доступные скрипты

```bash
# Разработка
npm run dev              # Запуск dev сервера с Turbopack

# Сборка
npm run build            # Production build
npm run start            # Запуск production сервера

# Линтинг
npm run lint             # Проверка кода ESLint

# Prisma
npm run prisma:generate  # Генерация Prisma Client
npm run prisma:migrate   # Создание и применение миграций
npm run prisma:studio    # Открыть Prisma Studio (GUI)
npm run prisma:reset     # Сброс БД
npm run prisma:push      # Push schema без миграций
npm run prisma:preview   # Pull schema из БД

# Seeding
npm run seed             # Заполнение БД тестовыми данными

# Обновление
npm run update           # PowerShell скрипт обновления зависимостей
```

---

## 🔐 Система аутентификации

### Основные возможности:

- ✅ NextAuth v4 интеграция
- ✅ Credentials provider (email + password)
- ✅ JWT токены
- ✅ Session management
- ✅ Password hashing (bcryptjs)
- ✅ Логирование активности (ActivityLog)
- ✅ IP трекинг
- ✅ User-Agent парсинг
- ✅ Device tracking (deviceId, userAgent)
- ✅ Email верификация (VerificationCode)
- ✅ Обязательная смена пароля (mustChangePassword)
- ✅ Блокировка пользователей (banned)

### Роли пользователей:

- **USER** — обычный пользователь (покупатель)
- **ADMIN** — администратор (полный доступ)
- **MANAGER** — менеджер (управление заказами, товарами)

### NextAuth Configuration:

Файл: [shared/constants/auth-options.ts](shared/constants/auth-options.ts)

- Credentials provider с bcryptjs verification
- JWT strategy
- Session callbacks
- SignIn/SignUp callbacks с activity logging

---

## 🏢 Мультитенантность

Проект поддерживает мультитенантность через модель **Tenant**:

- Каждый пользователь привязан к тенанту (`tenantId`)
- Товары, заказы, категории, инвентарь изолированы по тенантам
- Возможность создания нескольких независимых магазинов/организаций

---

## 🧩 Архитектурные особенности

### Паттерны:

- **App Router** (Next.js 16) с Route Groups
- **Server Components** по умолчанию
- **Server Actions** для мутаций
- **Parallel Routes** для модальных окон (`@modal`)
- **Intercepting Routes** для product modal
- **Zustand** для глобального стейта (корзина)
- **Prisma** для типобезопасной работы с БД
- **Zod** для валидации форм

### Route Groups структура:

1. **(root)** - публичная часть (главная, товары, профиль)
2. **(checkout)** - процесс оформления заказа
3. **(dashboard)** - админ-панель

### Структура кода:

- Разделение на `app/` (роуты, actions) и `shared/` (переиспользуемый код)
- Компоненты разделены на `ui/` (чистые UI) и `shared/` (бизнес-логика)
- Централизованные константы в `shared/constants/`
- API клиенты в `shared/services/`
- Типы в `@types/`

---

## 📊 Основные функции системы

### Пользовательские функции:

- ✅ Регистрация и вход через NextAuth
- ✅ Каталог товаров с фильтрацией
  - Фильтры: материал, размер, толщина, длина, цена
  - Поиск по названию
  - Группировка по категориям
- ✅ Детальная страница товара (modal + full page)
- ✅ Конфигуратор товара (выбор характеристик, ингредиентов)
- ✅ Корзина покупок
  - Real-time обновление
  - Расчет цен с ингредиентами
  - Drawer UI
- ✅ Checkout процесс
  - Форма с адресом (DaData автозаполнение)
  - Интеграция с ЮКасса
  - Email уведомления
- ✅ Профиль пользователя
  - Редактирование данных
  - История заказов
- ✅ Stories (истории как в Instagram)

### Административные функции:

- ✅ Dashboard
- ✅ Управление товарами
- ✅ Управление заказами
- ✅ Управление пользователями
- ⏳ Управление инвентарем (модель готова)

### API Endpoints:

#### Аутентификация

- `POST /api/auth/signin` - Вход
- `POST /api/auth/signup` - Регистрация
- `POST /api/auth/signout` - Выход
- `GET /api/auth/session` - Получить сессию

#### Товары

- `GET /api/products` - Список товаров (с фильтрами)
- `GET /api/products/search?query=...` - Поиск товаров

#### Корзина

- `GET /api/cart` - Получить корзину
- `PATCH /api/cart` - Обновить корзину

#### Ингредиенты

- `GET /api/ingredients` - Список ингредиентов

#### Stories

- `GET /api/stories` - Список историй

#### Checkout

- `POST /api/checkout/callback` - Callback от ЮКасса

#### Пользователи

- `GET /api/users` - Список пользователей

---

## 💳 Интеграции

### ЮКасса (Платежная система)

- Создание платежей: [shared/lib/creat-payment.ts](shared/lib/creat-payment.ts)
- Callback обработка: [app/api/checkout/callback/route.ts](app/api/checkout/callback/route.ts)
- Статусы: `PENDING`, `SUCCEEDED`, `CANCELLED`

### Resend (Email сервис)

- Отправка email: [shared/lib/sendEmail.ts](shared/lib/sendEmail.ts)
- Шаблоны:
  - [pay-order.tsx](shared/components/shared/email-templates/pay-order.tsx) - уведомление о заказе
  - [verification-user.tsx](shared/components/shared/email-templates/verification-user.tsx) - верификация email

### DaData (Автозаполнение адресов)

- Компонент: `react-dadata`
- Используется в checkout форме
- Автоматическое определение адреса

---

## 📝 Примечания

- Проект использует **Next.js 16** с **React 19** (новейшие версии)
- База данных **PostgreSQL** через **Neon Serverless** (автоскейлинг)
- **Turbopack** для fast refresh в development
- UI построен на **Radix UI** + **Tailwind CSS 4**
- Аутентификация через **NextAuth v4**
- Поддержка **TypeScript** на всех уровнях

---

## 🚨 Критические задачи перед production

### ❌ Отсутствует (Priority: HIGH)

1. **Тесты**
   - Нет unit тестов
   - Нет integration тестов
   - Нет e2e тестов
   - ❌ Vitest или Jest не настроены

2. **Docker & Deployment**
   - Нет Dockerfile
   - Нет docker-compose.yml
   - Нет .dockerignore

3. **CI/CD**
   - Нет GitHub Actions workflows
   - Нет автоматизации lint/test/build

4. **Безопасность**
   - Нет rate limiting
   - Нет CSRF protection
   - Нет security headers
   - Прямое использование env переменных без валидации

5. **Monitoring & Observability**
   - Нет health check endpoint
   - Нет error tracking (Sentry)
   - Много console.log вместо структурированных логов
   - Нет request tracing

6. **Документация**
   - Нет API документации
   - Базовый README
   - Нет deployment guide

### ⚠️ Требует улучшения (Priority: MEDIUM)

- TypeScript ошибка: `as any` в prisma-client.ts
- Незавершенные TODO в коде (5+ штук)
- Миграция данных imageUrl → images[] (есть FIX_IMAGES.md)
- DEBUG логи в production коде
- Отсутствие backup стратегии
- Нет gracefulshutdown
- WebSocket зависимость без явного использования

### 📊 Текущие метрики

| Метрика             | Значение | Статус |
| ------------------- | -------- | ------ |
| TypeScript покрытие | 100%     | ✅     |
| Test покрытие       | 0%       | ❌     |
| Безопасность        | 70%      | ⚠️     |
| Production-ready    | 65%      | ⚠️     |
| Code Quality        | 75%      | ✅     |

---

## 📚 Дополнительная документация

- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Полный отчет об аудите проекта
- [FIX_IMAGES.md](./FIX_IMAGES.md) - Инструкция по исправлению проблемы с изображениями
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Итоги миграции imageUrl → images[]

---

## 📞 Контакты и поддержка

Проект находится в активной разработке. Для вопросов и предложений обращайтесь к команде разработки.

---

**Дата создания документа:** 24 февраля 2026 г.  
**Последнее обновление:** 24 февраля 2026 г.  
**Версия проекта:** 0.1.0  
**Статус:** В активной разработке (65% готовности к production)
