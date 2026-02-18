# Исправление проблемы с изображениями

## Проблема

После изменения схемы с `imageUrl` на `images` (массив изображений), картинки не отображаются на карточках товаров и категориях.

## Что было исправлено

### 1. API Endpoints

- ✅ **app/actions/find-products.ts** - добавлен `include: { images: true }` для загрузки изображений продуктов и ингредиентов
- ✅ **app/api/ingredients/route.ts** - добавлен `include: { images: true }` для загрузки изображений ингредиентов

### 2. Seed файл

- ✅ Создан **prisma/seed.ts** для заполнения базы данных тестовыми данными

## Следующие шаги

### 1. Обновите базу данных

Если у вас есть продукты в БД без изображений в таблице `ProductImage`, нужно их добавить.

Вариант А - Запуск сидов (очистит БД и заполнит тестовыми данными):

```bash
npm run seed
```

Вариант Б - Добавьте изображения в таблицы вручную через админ-панель

### 2. Если используете админ-панель

Убедитесь, что при создании продукта/ингредиента вы создаете записи в таблицах:

- `ProductImage` для продуктов
- `IngredientImage` для ингредиентов

### 3. Проверьте данные в БД

Выполните SQL запрос, чтобы убедиться, что у продуктов есть изображения:

```sql
SELECT p.id, p.name, COUNT(pi.id) as images_count
FROM "Product" p
LEFT JOIN "ProductImage" pi ON pi."productId" = p.id
GROUP BY p.id, p.name;
```

Если `images_count = 0`, значит у продукта нет изображений.

### 4. Добавить изображения продуктам

Если у вас уже есть продукты, но нет изображений, можно добавить их вручную:

```sql
-- Пример добавления изображения к продукту с id = 1
INSERT INTO "ProductImage" ("productId", "url", "sortOrder")
VALUES (1, '/assets/your-image.jpg', 0);
```

## Структура данных

### Product

```typescript
{
  id: number,
  name: string,
  images: [
    {
      id: number,
      productId: number,
      url: string,
      sortOrder: number
    }
  ]
}
```

### Ingredient

```typescript
{
  id: number,
  name: string,
  price: number,
  images: [
    {
      id: number,
      ingredientId: number,
      url: string,
      sortOrder: number
    }
  ]
}
```

## Проверка категорий

Категории отображаются только если у них есть продукты с items (вариантами). Убедитесь, что:

1. У категории есть продукты
2. У продуктов есть items (ProductItem)
3. У продуктов есть изображения в таблице ProductImage

Проверка:

```sql
SELECT
  c.id,
  c.name as category_name,
  COUNT(DISTINCT p.id) as products_count,
  COUNT(DISTINCT pi_item.id) as items_count,
  COUNT(DISTINCT pimg.id) as images_count
FROM "Category" c
LEFT JOIN "Product" p ON p."categoryId" = c.id
LEFT JOIN "ProductItem" pi_item ON pi_item."productId" = p.id
LEFT JOIN "ProductImage" pimg ON pimg."productId" = p.id
GROUP BY c.id, c.name
ORDER BY c.id;
```

## Примечания

- Ошибки в `migration.sql` - это ошибки SQL-линтера VS Code, который не понимает PostgreSQL синтаксис. Можете их игнорировать.
- Файл `prisma/constants.ts` использует старую структуру с `imageUrl`, но теперь seed.ts преобразует её в правильную структуру `images`.
