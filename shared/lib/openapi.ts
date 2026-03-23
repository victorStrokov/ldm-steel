export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'LDM Steel API',
    version: '0.1.0',
    description: 'OpenAPI спецификация для публичных и служебных API-роутов проекта LDM Steel.',
  },
  servers: [
    {
      url: '/api',
      description: 'Relative API base URL',
    },
  ],
  tags: [
    { name: 'auth', description: 'Аутентификация и профиль' },
    { name: 'cart', description: 'Корзина и позиции корзины' },
    { name: 'checkout', description: 'Checkout и callbacks' },
    { name: 'catalog', description: 'Каталог и справочные данные' },
    { name: 'system', description: 'Системные и технические endpoints' },
    { name: 'users', description: 'Пользователи' },
  ],
  components: {
    schemas: {
      // ─── Общие ────────────────────────────────────────────────────────
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Описание ошибки' },
          message: { type: 'string', example: 'Дополнительное сообщение' },
        },
      },
      // ─── Корзина ──────────────────────────────────────────────────────
      CartAddItemRequest: {
        type: 'object',
        required: ['productItemId'],
        properties: {
          productItemId: {
            type: 'integer',
            description: 'ID варианта товара (ProductItem)',
            example: 42,
          },
          ingredients: {
            type: 'array',
            items: { type: 'integer' },
            description: 'Массив ID ингредиентов (опционально)',
            example: [1, 3, 7],
          },
        },
      },
      CartPatchRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Новое количество единиц товара',
            example: 3,
          },
        },
      },
      Ingredient: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Сыр моцарелла' },
          price: { type: 'number', example: 59 },
          images: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 10 },
                url: { type: 'string', example: '/assets/ingredients/cheese.png' },
              },
            },
          },
        },
      },
      ProductImage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 5 },
          url: { type: 'string', example: '/assets/products/pizza.png' },
        },
      },
      ProductItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 42 },
          price: { type: 'number', example: 449 },
          size: { type: 'integer', nullable: true, example: 30 },
          pizzaType: { type: 'integer', nullable: true, example: 1 },
          productId: { type: 'integer', example: 7 },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 7 },
          name: { type: 'string', example: 'Пицца Маргарита' },
          imageUrl: { type: 'string', example: '/assets/products/pizza.png' },
          categoryId: { type: 'integer', example: 2 },
          images: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductImage' },
          },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 101 },
          cartId: { type: 'integer', example: 5 },
          productItemId: { type: 'integer', example: 42 },
          quantity: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time', example: '2026-03-01T12:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-03-01T12:30:00.000Z' },
          productItem: {
            allOf: [
              { $ref: '#/components/schemas/ProductItem' },
              {
                type: 'object',
                properties: {
                  product: { $ref: '#/components/schemas/Product' },
                },
              },
            ],
          },
          ingredients: {
            type: 'array',
            items: { $ref: '#/components/schemas/Ingredient' },
          },
        },
      },
      CartResponse: {
        type: 'object',
        properties: {
          totalAmount: { type: 'number', example: 898 },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' },
          },
        },
        example: {
          totalAmount: 898,
          items: [
            {
              id: 101,
              cartId: 5,
              productItemId: 42,
              quantity: 2,
              productItem: {
                id: 42,
                price: 449,
                size: 30,
                pizzaType: 1,
                productId: 7,
                product: {
                  id: 7,
                  name: 'Пицца Маргарита',
                  images: [{ id: 5, url: '/assets/products/pizza.png' }],
                },
              },
              ingredients: [{ id: 1, name: 'Сыр моцарелла', price: 59 }],
            },
          ],
        },
      },
      // ─── Checkout ─────────────────────────────────────────────────────
      YooKassaAmount: {
        type: 'object',
        required: ['value', 'currency'],
        properties: {
          value: { type: 'string', example: '898.00' },
          currency: { type: 'string', enum: ['RUB'], example: 'RUB' },
        },
      },
      CheckoutCallbackRequest: {
        type: 'object',
        required: ['type', 'event', 'object'],
        description: 'Webhook от ЮКасса',
        properties: {
          type: { type: 'string', example: 'notification' },
          event: { type: 'string', example: 'payment.succeeded' },
          object: {
            type: 'object',
            required: ['id', 'status', 'amount', 'metadata'],
            properties: {
              id: { type: 'string', example: '2d8dc3ee-000f-5000-a000-1e9df5c5f13e' },
              status: { type: 'string', enum: ['succeeded', 'canceled', 'pending'], example: 'succeeded' },
              amount: { $ref: '#/components/schemas/YooKassaAmount' },
              description: { type: 'string', example: 'Оплата заказа №123' },
              paid: { type: 'boolean', example: true },
              refundable: { type: 'boolean', example: false },
              metadata: {
                type: 'object',
                required: ['order_id'],
                properties: {
                  order_id: { type: 'string', example: '123' },
                },
              },
            },
          },
        },
      },
      CheckoutCallbackResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
        },
      },
      // ─── Пользователи ─────────────────────────────────────────────────
      UserCreateRequest: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        properties: {
          fullName: { type: 'string', example: 'Иван Иванов' },
          email: { type: 'string', format: 'email', example: 'ivan@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'securepass' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          fullName: { type: 'string', example: 'Иван Иванов' },
          email: { type: 'string', format: 'email', example: 'ivan@example.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN', 'MANAGER'], example: 'USER' },
          verified: { type: 'string', format: 'date-time', nullable: true, example: '2026-03-01T10:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-01-15T08:00:00.000Z' },
        },
      },
      UserMe: {
        type: 'object',
        properties: {
          fullName: { type: 'string', example: 'Иван Иванов' },
          email: { type: 'string', format: 'email', example: 'ivan@example.com' },
        },
      },
      // ─── Каталог ──────────────────────────────────────────────────────
      ProductSearchItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 7 },
          name: { type: 'string', example: 'Пицца Маргарита' },
          categoryId: { type: 'integer', example: 2 },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductItem' },
          },
          images: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductImage' },
          },
          ingredients: {
            type: 'array',
            items: { $ref: '#/components/schemas/Ingredient' },
          },
        },
      },
      StoryItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          previewImageUrl: { type: 'string', example: '/assets/stories/story1.jpg' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 10 },
                sourceUrl: { type: 'string', example: '/assets/stories/story1-full.jpg' },
              },
            },
          },
        },
      },
      // ─── System ───────────────────────────────────────────────────────
      HealthOk: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['ok'], example: 'ok' },
          db: { type: 'string', enum: ['ok'], example: 'ok' },
          uptime: { type: 'integer', description: 'Uptime процесса в секундах', example: 3600 },
        },
        example: { status: 'ok', db: 'ok', uptime: 3600 },
      },
      HealthError: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['error'], example: 'error' },
          db: { type: 'string', enum: ['unreachable'], example: 'unreachable' },
          error: { type: 'string', example: 'connection refused' },
          uptime: { type: 'integer', example: 120 },
        },
      },
    },
  },
  paths: {
    '/auth/me': {
      get: {
        tags: ['auth'],
        summary: 'Получить профиль текущего пользователя',
        description:
          'Возвращает `fullName` и `email` авторизованного пользователя. Требуется активная NextAuth сессия.',
        responses: {
          '200': {
            description: 'Данные профиля',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserMe' },
                example: { fullName: 'Иван Иванов', email: 'ivan@example.com' },
              },
            },
          },
          '401': {
            description: 'Пользователь не авторизован',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { message: '[USER_GET] Unauthorized / Вы не авторизованы' },
              },
            },
          },
        },
      },
    },
    '/auth/verify': {
      get: {
        tags: ['auth'],
        summary: 'Подтверждение email по коду верификации',
        description:
          'Принимает одноразовый `code` из письма, помечает пользователя как verified и делает redirect на `/?verified`.',
        parameters: [
          {
            name: 'code',
            in: 'query',
            required: true,
            description: 'Одноразовый код верификации из письма',
            schema: { type: 'string', example: 'abc123def456' },
          },
        ],
        responses: {
          '302': { description: 'Redirect на /?verified после успешной верификации' },
          '400': {
            description: 'Код отсутствует или недействителен',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Code is invalid/ Код не верный' },
              },
            },
          },
        },
      },
    },
    '/auth/[...nextauth]': {
      get: {
        tags: ['auth'],
        summary: 'NextAuth handler (GET)',
        description: 'Обрабатывает OAuth callbacks, sign-in, sign-out и прочие GET-запросы NextAuth.',
        responses: {
          '200': { description: 'OK — зависит от конкретного action' },
        },
      },
      post: {
        tags: ['auth'],
        summary: 'NextAuth handler (POST)',
        description: 'Обрабатывает Credentials sign-in и прочие POST-запросы NextAuth.',
        responses: {
          '200': { description: 'OK — зависит от конкретного action' },
        },
      },
    },
    '/cart': {
      get: {
        tags: ['cart'],
        summary: 'Получить корзину текущего пользователя',
        description:
          'Идентификация корзины по `cartToken` cookie. Если корзина не найдена — возвращает пустую (`totalAmount: 0, items: []`).',
        responses: {
          '200': {
            description: 'Содержимое корзины',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartResponse' },
              },
            },
          },
          '500': {
            description: 'Внутренняя ошибка сервера',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['cart'],
        summary: 'Добавить товар в корзину',
        description:
          'Если товар с теми же `productItemId` и `ingredients` уже в корзине — увеличивает `quantity` на 1. Иначе создаёт новую позицию.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CartAddItemRequest' },
              examples: {
                simple: {
                  summary: 'Без ингредиентов',
                  value: { productItemId: 42 },
                },
                withIngredients: {
                  summary: 'С ингредиентами',
                  value: { productItemId: 42, ingredients: [1, 3, 7] },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Обновлённая корзина',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartResponse' },
              },
            },
          },
          '400': {
            description: 'Некорректный запрос',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '500': {
            description: 'Внутренняя ошибка сервера',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/cart/{id}': {
      patch: {
        tags: ['cart'],
        summary: 'Изменить количество позиции корзины',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID позиции корзины (CartItem.id)',
            schema: { type: 'integer', example: 101 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CartPatchRequest' },
              example: { quantity: 3 },
            },
          },
        },
        responses: {
          '200': {
            description: 'Обновлённая корзина',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartResponse' },
              },
            },
          },
          '404': {
            description: 'Позиция корзины не найдена',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'cartItem не найден' },
              },
            },
          },
          '500': {
            description: 'Внутренняя ошибка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['cart'],
        summary: 'Удалить позицию из корзины',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID позиции корзины (CartItem.id)',
            schema: { type: 'integer', example: 101 },
          },
        ],
        responses: {
          '200': {
            description: 'Обновлённая корзина',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CartResponse' },
              },
            },
          },
          '404': {
            description: 'Позиция/cartToken не найдены',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'cartItem не найден' },
              },
            },
          },
          '500': {
            description: 'Внутренняя ошибка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/checkout/callback': {
      post: {
        tags: ['checkout'],
        summary: 'Webhook-callback от ЮКасса',
        description: 'Принимает уведомление о статусе платежа. Обновляет статус заказа и отправляет email покупателю.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckoutCallbackRequest' },
              examples: {
                succeeded: {
                  summary: 'Успешная оплата',
                  value: {
                    type: 'notification',
                    event: 'payment.succeeded',
                    object: {
                      id: '2d8dc3ee-000f-5000-a000-1e9df5c5f13e',
                      status: 'succeeded',
                      amount: { value: '898.00', currency: 'RUB' },
                      description: 'Оплата заказа №123',
                      paid: true,
                      refundable: false,
                      metadata: { order_id: '123' },
                    },
                  },
                },
                canceled: {
                  summary: 'Отменённая оплата',
                  value: {
                    type: 'notification',
                    event: 'payment.canceled',
                    object: {
                      id: '2d8dc3ee-000f-5000-a000-1e9df5c5f13e',
                      status: 'canceled',
                      amount: { value: '898.00', currency: 'RUB' },
                      description: 'Оплата заказа №123',
                      paid: false,
                      refundable: false,
                      metadata: { order_id: '123' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Callback обработан успешно',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CheckoutCallbackResponse' },
                example: { success: true },
              },
            },
          },
          '404': {
            description: 'Заказ или позиции заказа не найдены',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { error: 'Order not found' },
              },
            },
          },
          '500': {
            description: 'Внутренняя ошибка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['system'],
        summary: 'Health check сервиса и БД',
        description: 'Проверяет доступность базы данных (`SELECT 1`) и возвращает uptime процесса.',
        responses: {
          '200': {
            description: 'Сервис и БД работают нормально',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthOk' },
                example: { status: 'ok', db: 'ok', uptime: 3600 },
              },
            },
          },
          '503': {
            description: 'БД недоступна',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthError' },
                example: { status: 'error', db: 'unreachable', error: 'connection refused', uptime: 120 },
              },
            },
          },
        },
      },
    },
    '/ingredients': {
      get: {
        tags: ['catalog'],
        summary: 'Список всех ингредиентов',
        description: 'Возвращает полный список ингредиентов с изображениями.',
        responses: {
          '200': {
            description: 'Массив ингредиентов',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ingredient' },
                },
                example: [
                  {
                    id: 1,
                    name: 'Сыр моцарелла',
                    price: 59,
                    images: [{ id: 10, url: '/assets/ingredients/cheese.png' }],
                  },
                  { id: 2, name: 'Пепперони', price: 79, images: [] },
                ],
              },
            },
          },
        },
      },
    },
    '/products/search': {
      get: {
        tags: ['catalog'],
        summary: 'Поиск товаров по названию',
        description:
          'Полнотекстовый поиск (case-insensitive). Возвращает до 5 товаров с вариантами, изображениями и ингредиентами.',
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            description: 'Строка поиска (часть названия товара)',
            schema: { type: 'string', example: 'маргарита' },
          },
        ],
        responses: {
          '200': {
            description: 'Список найденных товаров (максимум 5)',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ProductSearchItem' },
                },
                example: [
                  {
                    id: 7,
                    name: 'Пицца Маргарита',
                    categoryId: 2,
                    items: [{ id: 42, price: 449, size: 30, pizzaType: 1, productId: 7 }],
                    images: [{ id: 5, url: '/assets/products/pizza.png' }],
                    ingredients: [{ id: 1, name: 'Сыр моцарелла', price: 59, images: [] }],
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/stories': {
      get: {
        tags: ['catalog'],
        summary: 'Список stories',
        description: 'Возвращает все активные истории с превью и вложенными кадрами.',
        responses: {
          '200': {
            description: 'Массив историй',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/StoryItem' },
                },
                example: [
                  {
                    id: 1,
                    previewImageUrl: '/assets/stories/story1.jpg',
                    items: [{ id: 10, sourceUrl: '/assets/stories/story1-full.jpg' }],
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['users'],
        summary: 'Получить список пользователей',
        responses: {
          '200': {
            description: 'Массив пользователей',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
                example: [
                  {
                    id: 1,
                    fullName: 'Иван Иванов',
                    email: 'ivan@example.com',
                    role: 'USER',
                    verified: '2026-03-01T10:00:00.000Z',
                    createdAt: '2026-01-15T08:00:00.000Z',
                  },
                ],
              },
            },
          },
        },
      },
      post: {
        tags: ['users'],
        summary: 'Создать пользователя',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserCreateRequest' },
              example: { fullName: 'Мария Петрова', email: 'maria@example.com', password: 'securepass' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Созданный пользователь',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
                example: {
                  id: 2,
                  fullName: 'Мария Петрова',
                  email: 'maria@example.com',
                  role: 'USER',
                  verified: null,
                  createdAt: '2026-03-22T09:00:00.000Z',
                },
              },
            },
          },
          '400': {
            description: 'Ошибка валидации',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};
