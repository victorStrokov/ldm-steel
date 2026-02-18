import { prisma } from './prisma-client';
import { categories, _ingredients } from './constants';

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Tenant" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
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

  // Создание ингредиентов с изображениями
  for (const ingredient of _ingredients) {
    await prisma.ingredient.create({
      data: {
        name: ingredient.name,
        price: ingredient.price,
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
