import 'dotenv/config';
import { hashSync } from 'bcrypt';
import { prisma } from './prisma-client';
import { categories, _ingredients, products } from './constants';
import { Prisma } from '@prisma/client';
import { ProductMaterial } from '@/@types/product.types';
import { calculatePrice } from '../shared/lib/calculate-price';

const generateProductItem = ({
  productId,
  steelSize,
  pvcSize,
  productSizes,
  productLength,
  productColor,
  productShape,
  productMaterials,
  productThickness,
}: {
  productId: number;
  steelSize?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  pvcSize?: 1 | 2 | 3 | 4 | 5;
  productSizes?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  productLength?: 1 | 2 | 3;
  productColor?: 1 | 2 | 3 | 4;
  productShape?: 1 | 2;
  productThickness?: 1 | 2 | 3 | 4;
  productMaterials?: ProductMaterial;
}) => {
  const sizeField =
    productMaterials === 'STEEL' ? { steelSize } : productMaterials === 'PVC' ? { pvcSize } : { productSizes };
  return {
    productId,
    price: calculatePrice({
      ...sizeField,
      productLength,
      productMaterials,
      productShape,
      productColor,
      productThickness,
    }),
    ...sizeField,
    productLength,
    productColor,
    productShape,
    productMaterials,
    productThickness,
  } as Prisma.ProductItemUncheckedCreateInput;
};

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: 'user@test.ru',
        passwordHash: hashSync('1111', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        passwordHash: hashSync('2222', 10),
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
    data: _ingredients,
  });
  await prisma.product.createMany({
    data: products,
  });

  // примеры продуктов с материалами
  const profileSteel = await prisma.product.create({
    data: {
      name: 'REHAU 245536',
      imageUrl: '/assets/OIG2.jpg',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(0, 7).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileSteel2 = await prisma.product.create({
    data: {
      name: 'Труба сварная',
      imageUrl: '/assets/OIG3.jpg',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(8, 13).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileSteel3 = await prisma.product.create({
    data: {
      name: 'Полоса оцинкованная',
      imageUrl: '/assets/Polosa_cink_100х6мм_(6м).jpg',
      categoryId: 1,
      ingredients: {
        connect: _ingredients.slice(14, 21).map((i) => ({ id: i.id })),
      },
    },
  });

  const profilePvc1 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Рама',
      imageUrl: '/assets/REACHMONT_Rama_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: _ingredients.slice(0, 10).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc2 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Импост',
      imageUrl: '/assets/REACHMONT_Inpost_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: _ingredients.slice(11, 18).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc3 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Створка',
      imageUrl: '/assets/REACHMONT_Stvorka_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: _ingredients.slice(19, 27).map((i) => ({ id: i.id })),
      },
    },
  });
  const profilePvc4 = await prisma.product.create({
    data: {
      name: 'ПВХ профиль REACHMONT Соединительный',
      imageUrl: '/assets/REACHMONT_Profile_Soedenetel_60мм.jpg',
      categoryId: 3,
      ingredients: {
        connect: _ingredients.slice(15, 29).map((i) => ({ id: i.id })),
      },
    },
  });
  const profileAl1 = await prisma.product.create({
    data: {
      name: 'Рама Нижняя Provedal КПС 034',
      imageUrl: '/assets/Rama_Niz_Provedal_КПС_034.jpg',
      categoryId: 2,
      ingredients: { connect: _ingredients.slice(7, 10).map((i) => ({ id: i.id })) },
    },
  });
  const profileAl2 = await prisma.product.create({
    data: {
      name: 'Provedal Рама Верхняя (КПС 035)',
      imageUrl: '/assets/Provedal_Rama_Verh_(КПС_035).jpg',
      categoryId: 2,
      ingredients: { connect: _ingredients.slice(11, 18).map((i) => ({ id: i.id })) },
    },
  });
  const profileAl3 = await prisma.product.create({
    data: {
      name: 'Provedal Рама Боковая (КПС 036)',
      imageUrl: '/assets/Provedal_Rama_Bock_(КПС_036).jpg',
      categoryId: 2,
      ingredients: { connect: _ingredients.slice(19, 27).map((i) => ({ id: i.id })) },
    },
  });

  await prisma.productItem.createMany({
    data: [
      //ПВХ профиль REACHMONT Рама 60мм
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 2,
        productLength: 3,
        productColor: 1,

        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 2,
        productLength: 3,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 4,
        productLength: 2,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 4,
        productLength: 3,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 4,
        productLength: 3,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc1.id,
        pvcSize: 4,
        productLength: 2,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      //ПВХ профиль REACHMONT Импост 60мм
      generateProductItem({
        productId: profilePvc2.id,
        pvcSize: 1,
        productLength: 3,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        pvcSize: 2,
        productLength: 3,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        pvcSize: 4,
        productLength: 2,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        pvcSize: 4,
        productLength: 2,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc2.id,
        pvcSize: 4,
        productLength: 3,
        productColor: 3,
        productMaterials: 'PVC',
      }),
      //ПВХ профиль REACHMONT Створка 60мм
      generateProductItem({
        productId: profilePvc3.id,
        pvcSize: 4,
        productLength: 2,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc3.id,
        pvcSize: 3,
        productLength: 3,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc3.id,
        pvcSize: 2,
        productLength: 2,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc3.id,
        pvcSize: 5,
        productLength: 3,
        productColor: 2,
        productMaterials: 'PVC',
      }),

      generateProductItem({
        productId: profilePvc4.id,
        pvcSize: 2,
        productLength: 2,
        productColor: 1,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc4.id,
        pvcSize: 3,
        productLength: 3,
        productColor: 2,
        productMaterials: 'PVC',
      }),
      generateProductItem({
        productId: profilePvc4.id,
        pvcSize: 4,
        productLength: 3,
        productColor: 3,
        productMaterials: 'PVC',
      }),

      // Профиль REHAU 245536 — разные типы профиля и длины
      generateProductItem({
        productId: profileSteel.id,
        productLength: 1,
        steelSize: 1,
        productThickness: 1,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        productLength: 2,
        steelSize: 1,
        productThickness: 2,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        productLength: 2,
        steelSize: 3,
        productThickness: 3,
        productMaterials: 'STEEL',
      }),

      generateProductItem({
        productId: profileSteel.id,
        productLength: 2,
        steelSize: 2,
        productThickness: 1,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        productLength: 2,
        steelSize: 3,
        productThickness: 3,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel.id,
        productLength: 2,
        steelSize: 4,
        productThickness: 2,
        productMaterials: 'STEEL',
      }),

      // Труба сварная 40х50х2мм (6м) — разные размеры и длины
      generateProductItem({
        productId: profileSteel2.id,
        productLength: 1,
        steelSize: 5,
        productThickness: 3,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel2.id,
        productLength: 1,
        steelSize: 6,
        productThickness: 2,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel2.id,
        productLength: 1,
        steelSize: 4,
        productThickness: 3,
        productMaterials: 'STEEL',
      }),

      // Полоса оцинкованная 100х6мм (6м) — разные длины
      generateProductItem({
        productId: profileSteel3.id,
        productLength: 2,
        productThickness: 4,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel3.id,
        productLength: 2,
        productThickness: 2,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileSteel3.id,
        productLength: 2,
        productThickness: 3,
        productMaterials: 'STEEL',
      }),
      generateProductItem({
        productId: profileAl1.id,
        productColor: 1,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl1.id,
        productColor: 1,
        productLength: 2,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl1.id,
        productColor: 2,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl2.id,
        productColor: 1,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl2.id,
        productColor: 2,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl2.id,
        productColor: 1,
        productLength: 2,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl3.id,
        productColor: 1,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl3.id,
        productColor: 2,
        productLength: 1,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl3.id,
        productColor: 3,
        productLength: 2,
        productMaterials: 'ALUMINIUM',
      }),
      generateProductItem({
        productId: profileAl3.id,
        productColor: 2,
        productLength: 2,
        productMaterials: 'ALUMINIUM',
      }),
      // Остальные продукты
      generateProductItem({ productId: 1, productSizes: 1, productColor: 1 }),
      generateProductItem({ productId: 2, productSizes: 2, productColor: 2 }),
      generateProductItem({ productId: 3, productSizes: 3, productColor: 3 }),
      generateProductItem({ productId: 4, productSizes: 4, productColor: 4 }),
      generateProductItem({ productId: 5, productSizes: 5, productColor: 1 }),
      generateProductItem({ productId: 6, productSizes: 6, productColor: 2 }),
      generateProductItem({ productId: 7, productSizes: 7, productColor: 3 }),
      generateProductItem({ productId: 8, productSizes: 1, productColor: 4 }),
      generateProductItem({ productId: 9, productSizes: 2, productColor: 1 }),
      generateProductItem({ productId: 10, productSizes: 3, productColor: 2 }),
      generateProductItem({ productId: 11, productSizes: 4, productColor: 3 }),
      generateProductItem({ productId: 12, productSizes: 5, productColor: 4 }),
      generateProductItem({ productId: 13, productSizes: 6, productColor: 1 }),
      generateProductItem({ productId: 14, productSizes: 7, productColor: 2 }),
      generateProductItem({ productId: 15, productSizes: 1, productColor: 3 }),
      generateProductItem({ productId: 16, productSizes: 4, productColor: 3 }),
      generateProductItem({ productId: 17, productSizes: 1, productColor: 4 }),
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        token: '1111',
        totalAmount: 0,
      },
      {
        userId: 2,
        token: '2222',
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

  await prisma.story.createMany({
    data: [
      {
        previewImageUrl: '/assets/insta-react/aluplast.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/armiruyshaya-vstavka.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/artec.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/gealan.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/kbe.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/montblanc.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/plafen.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/provedal1.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/rehau.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/veka.jpg',
      },
      {
        previewImageUrl: '/assets/insta-react/wintech.jpg',
      },
    ],
  });

  await prisma.storyItem.createMany({
    data: [
      {
        storyId: 1,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/03.png',
      },
      {
        storyId: 1,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/image/certificates/sanzakl_sm.jpg',
      },
      {
        storyId: 1,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/image/certificates/sanzakl2_sm.jpg',
      },
      {
        storyId: 1,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/image/certificates/gigienharact_sm.jpg',
      },
      {
        storyId: 2,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/image/certificates/gigienharact2_sm.jpg',
      },
      {
        storyId: 2,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/se%60ndvich.jpg',
      },
      {
        storyId: 2,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/Sertifikat_do-2013-uplotneniya-e1369978366913.jpg',
      },
      {
        storyId: 3,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/P_20150323_163144.jpg',
      },
      {
        storyId: 2,
        sourceUrl: 'http://ldm-steel.com/wp-content/uploads/02.png',
      },
    ],
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
        TRUNCATE TABLE "ProductItem", "Product", "Ingredient", "Category", "Cart", "CartItem", "User", "Story", "StoryItem" RESTART IDENTITY CASCADE;
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
