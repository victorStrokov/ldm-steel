import { ProfileMaterial } from './../@types/profile.types';
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
  color,
  shape,
  material,
}: {
  productId: number;
  profileType?: 1 | 2 | 3;
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  length?: 1 | 2 | 3;
  color?: 1 | 2 | 3 | 4;
  shape?: 1 | 2 | 3 | 4;
  material?: ProfileMaterial;
}) => {
  return {
    productId,
    price: randomDecimalNumber(190, 600),
    profileType,
    size,
    length,
    color,
    shape,
    material,
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

  // категории, ингредиенты, продукты
  await prisma.category.createMany({
    data: categories,
  });
  await prisma.ingredient.createMany({
    data: ingredients,
  });
  await prisma.product.createMany({
    data: products,
  });

  // примеры продуктов с материалами
  const profileSteel = await prisma.product.create({
    data: {
      name: 'REHAU 245536',
      imageUrl: '/assets/REHAU_245536.png',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(0, 7).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileSteel2 = await prisma.product.create({
    data: {
      name: 'Труба сварная',
      imageUrl: '/assets/Truba_svsrnaia40х50х2мм_(6м).jpg',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(8, 13).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileSteel3 = await prisma.product.create({
    data: {
      name: 'Полоса оцинкованная',
      imageUrl: '/assets/Polosa_cink_100х6мм_(6м).jpg',
      categoryId: 1,
      ingredients: {
        connect: ingredients.slice(14, 21).map((i) => ({ id: i.id })),
      },
    },
  });

  const profilePvc1 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Рама',
      imageUrl: '/assets/REACHMONT_Rama_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: ingredients.slice(0, 10).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc2 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Импост',
      imageUrl: '/assets/REACHMONT_Inpost_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: ingredients.slice(11, 18).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc3 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Створка',
      imageUrl: '/assets/REACHMONT_Stvorka_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: ingredients.slice(19, 27).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc4 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Соединительный 60мм',
      imageUrl: '/assets/REACHMONT_Profile_Soedenetel_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: ingredients.slice(15, 29).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileAl1 = await prisma.product.create({
    data: {
      name: 'Рама Нижняя Provedal КПС 034',
      imageUrl: '/assets/Rama_Niz_Provedal_КПС_034.jpg',
      categoryId: 2,
      ingredients: { connect: ingredients.slice(7, 10).map((i) => ({ id: i.id })) },
    },
  });
  const profileAl2 = await prisma.product.create({
    data: {
      name: 'Рама Нижняя Provedal КПС 034',
      imageUrl: '/assets/Rama_Niz_Provedal_КПС_034.jpg',
      categoryId: 2,
      ingredients: { connect: ingredients.slice(11, 18).map((i) => ({ id: i.id })) },
    },
  });
  const profileAl3 = await prisma.product.create({
    data: {
      name: 'Рама Нижняя Provedal КПС 034',
      imageUrl: '/assets/Rama_Niz_Provedal_КПС_034.jpg',
      categoryId: 2,
      ingredients: { connect: ingredients.slice(19, 27).map((i) => ({ id: i.id })) },
    },
  });

  await prisma.productItem.createMany({
    data: [
      //ПВХ профиль REACHMONT Рама 60мм
      generateProductItem({
        productId: profilePvc1.id,
        size: 2,
        length: 3,
        color: 1,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        size: 3,
        color: 2,
        length: 2,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        size: 4,
        length: 2,
        color: 3,
        material: 'PVC',
      }),
      //ПВХ профиль REACHMONT Импост 60мм
      generateProductItem({
        productId: profilePvc2.id,
        size: 1,
        length: 3,
        color: 1,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        size: 3,
        length: 2,
        color: 2,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        size: 4,
        length: 2,
        color: 3,
        material: 'PVC',
      }),
      //ПВХ профиль REACHMONT Створка 60мм
      generateProductItem({
        productId: profilePvc3.id,
        size: 2,
        length: 2,
        color: 1,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc3.id,
        size: 3,
        length: 3,
        color: 2,
        material: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc3.id,
        size: 4,
        length: 3,
        color: 3,
        material: 'PVC',
      }),

      generateProductItem({ productId: profilePvc4.id, size: 2, length: 2, color: 1, material: 'PVC' }),
      generateProductItem({ productId: profilePvc4.id, size: 3, length: 3, color: 2, material: 'PVC' }),
      generateProductItem({ productId: profilePvc4.id, size: 4, length: 3, color: 3, material: 'PVC' }),

      // Профиль REHAU 245536 — разные типы профиля и длины
      generateProductItem({
        productId: profileSteel.id,
        profileType: 1,
        length: 1,
        size: 1,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        profileType: 1,
        length: 2,
        size: 1,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        profileType: 1,
        length: 2,
        size: 3,
        material: 'STEEL',
      }),

      generateProductItem({
        productId: profileSteel.id,
        profileType: 2,
        length: 2,
        size: 2,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        profileType: 2,
        length: 2,
        size: 3,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        profileType: 3,
        length: 2,
        size: 4,
        material: 'STEEL',
      }),

      // Труба сварная 40х50х2мм (6м) — разные размеры и длины
      generateProductItem({
        productId: profileSteel2.id,
        profileType: 2,
        length: 1,
        size: 5,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel2.id,
        profileType: 2,
        length: 1,
        size: 6,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel2.id,
        profileType: 2,
        length: 1,
        size: 4,
        material: 'STEEL',
      }),

      // Полоса оцинкованная 100х6мм (6м) — разные длины
      generateProductItem({
        productId: profileSteel3.id,
        profileType: 3,
        length: 2,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel3.id,
        profileType: 2,
        length: 2,
        material: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel3.id,
        profileType: 1,
        length: 2,
        material: 'STEEL',
      }),
      generateProductItem({ productId: profileAl1.id, color: 1, length: 1, material: 'ALUMINIUM' }),
      generateProductItem({ productId: profileAl2.id, color: 2, length: 2, material: 'ALUMINIUM' }),
      generateProductItem({ productId: profileAl3.id, color: 3, length: 2, material: 'ALUMINIUM' }),

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

// async function down() {
//   await prisma.$executeRawUnsafe(
//     `TRUNCATE TABLE "ProductItem", "Product", "Ingredient", "Category", "Cart", "CartItem", "User" RESTART IDENTITY CASCADE`,
//   );
// }
async function down() {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ProductItem') THEN
        TRUNCATE TABLE "ProductItem", "Product", "Ingredient", "Category", "Cart", "CartItem", "User" RESTART IDENTITY CASCADE;
      END IF;
    END$$;
  `);
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
