import { prisma } from './prisma-client';
import { categories, _ingredients, products } from './constants';

function slugifySeed(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Tenant" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
}

async function up() {
  // Создание тенанта
  const tenant = await prisma.tenant.create({
    data: {
      name: 'LDM Steel',
    },
  });

  // Создание категорий
  await prisma.category.createMany({
    data: categories.map((category) => ({
      ...category,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
      tenantId: tenant.id,
    })),
  });

  // Создание базовых товаров каталога
  for (const [index, product] of products.entries()) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        slug: `${slugifySeed(product.name)}-${index + 1}`,
        tenantId: tenant.id,
        categoryId: product.categoryId,
        images: {
          create: [
            {
              url: product.imageUrl,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.productItem.create({
      data: {
        productId: createdProduct.id,
        price: 1000,
        sku: `SEED-PRODUCT-${index + 1}`,
        inventory: {
          create: {
            quantity: 0,
            tenantId: tenant.id,
          },
        },
      },
    });
  }

  // Legacy ingredients переезжают в обычные товары категории "Крепеж"
  for (const ingredient of _ingredients) {
    const createdProduct = await prisma.product.create({
      data: {
        name: ingredient.name,
        slug: `${slugifySeed(ingredient.name)}-fastener-${ingredient.id}`,
        tenantId: tenant.id,
        categoryId: 8,
        images: {
          create: [
            {
              url: ingredient.imageUrl,
              sortOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.productItem.create({
      data: {
        productId: createdProduct.id,
        price: ingredient.price,
        sku: `SEED-FASTENER-${ingredient.id}`,
        inventory: {
          create: {
            quantity: 0,
            tenantId: tenant.id,
          },
        },
      },
    });
  }

  console.log('✅ База данных успешно заполнена!');
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
