import { hashSync } from 'bcrypt';
import { prisma } from './prisma-client';
import { categories, ingredients, products } from './constants';
import { Prisma } from '@prisma/client';

const randomDecimalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10;
};

const generateProductItem = ({
  productId,
  profileType,
  size,
  length,
}: {
  productId: number;
  profileType?: 1 | 2 | 3;
  size?: 1 | 2 | 3;
  length?: 1 | 2 | 3;
}) => {
  return {
    productId,
    price: randomDecimalNumber(190, 600),
    profileType,
    size,
    length,
  } as Prisma.ProductItemUncheckedCreateInput;
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: 'user@test.ru',
        password: hashSync('1111', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        password: hashSync('1111', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
    ],
  });

  await prisma.category.createMany({
    data: categories,
  });
  await prisma.ingredient.createMany({
    data: ingredients,
  });
  await prisma.product.createMany({
    data: products,
  });

  const profile1 = await prisma.product.create({
    data: {
      name: 'REHAU 245536',
      imageUrl: 'assets/REHAU_245536.png',
      price: randomDecimalNumber(1900, 2500),
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(0, 7).map((i) => ({ id: i.id })),
      },
    },
  });
  const profile2 = await prisma.product.create({
    data: {
      name: 'Труба сварная 40х50х2мм (6м)',
      imageUrl: '/assets/Truba_svsrnaia40х50х2мм_(6м).jpg',
      price: randomDecimalNumber(1900, 2500),
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(7, 13).map((i) => ({ id: i.id })),
      },
    },
  });
  const profile3 = await prisma.product.create({
    data: {
      name: 'Полоса оцинкованная 100х6мм (6м)',
      imageUrl: 'assets/Polosa_cink_100х6мм_(6м).jpg',
      price: randomDecimalNumber(1900, 2500),
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(14, 21).map((i) => ({ id: i.id })),
      },
    },
  });

  await prisma.productItem.createMany({
    data: [
      // Профиль REHAU 245536
      generateProductItem({
        productId: profile1.id,
        profileType: 1,
        length: 2,
      }),
      generateProductItem({
        productId: profile1.id,
        profileType: 1,
        length: 2,
      }),
      generateProductItem({
        productId: profile1.id,
        profileType: 1,
        length: 2,
      }),

      generateProductItem({
        productId: profile1.id,
        profileType: 2,
        length: 2,
      }),
      generateProductItem({
        productId: profile1.id,
        profileType: 2,
        length: 2,
      }),
      generateProductItem({
        productId: profile1.id,
        profileType: 2,
        length: 2,
      }),
      generateProductItem({
        productId: profile1.id,
        profileType: 2,
        length: 2,
      }),

      // Труба сварная 40х50х2мм (6м)
      generateProductItem({
        productId: profile2.id,
        profileType: 2,
        length: 1,
      }),
      generateProductItem({
        productId: profile2.id,
        profileType: 2,
        size: 2.0,
        length: 1,
      }),

      // Полоса оцинкованная 100х6мм (6м)
      generateProductItem({
        productId: profile3.id,
        length: 2,
      }),
      generateProductItem({
        productId: profile3.id,
        length: 2,
      }),

      // Остальные продукты
      generateProductItem({ productId: 1 }),
      generateProductItem({ productId: 2 }),
      generateProductItem({ productId: 3 }),
      generateProductItem({ productId: 4 }),
      generateProductItem({ productId: 5 }),
      generateProductItem({ productId: 6 }),
      generateProductItem({ productId: 7 }),
      generateProductItem({ productId: 8 }),
      generateProductItem({ productId: 9 }),
      generateProductItem({ productId: 10 }),
      generateProductItem({ productId: 11 }),
      generateProductItem({ productId: 12 }),
      generateProductItem({ productId: 13 }),
      generateProductItem({ productId: 14 }),
      generateProductItem({ productId: 15 }),
      generateProductItem({ productId: 16 }),
      generateProductItem({ productId: 17 }),
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        token: 'token1',
        totalAmount: 0,
      },
      {
        userId: 2,
        token: 'token2',
        totalAmount: 0,
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });
}

async function down() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "ProductItem", "Product", "Ingredient", "Category", "Cart", "CartItem", "User" RESTART IDENTITY CASCADE`,
  );
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
