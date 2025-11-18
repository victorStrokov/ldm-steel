import { Container, GroupVariants, ProductImage, Title } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: true,
    },
  });
  const variants = product?.items.map((item) => ({
    name:
      item.pvcSize != null
        ? `ПВХ ${item.pvcSize}мм`
        : item.steelSize != null
        ? `Сталь ${item.steelSize}мм`
        : item.productLength != null
        ? `Длина ${item.productLength}м`
        : 'Вариант',
    value: String(item.id),
  }));

  if (!product) return notFound();

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <ProductImage imageUrl={product.imageUrl} />
        <div className="w-[490px] bg-[#F7F6F5] p-7">
          <Title text={product.name} size="md" className="font-extrabold mb-1" />
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nam provident voluptatibus accusantium
            rerum accusamus maxime sint.
          </p>
          <p className="text-2xl font-semibold text-violet-600">₽</p>

          {/* <GroupVariants
            items={variants ?? []}
            value={variants?.[0]?.value}
            onClick={(value) => console.log('Выбран вариант:', value)}
          /> */}
        </div>
      </div>
    </Container>
  );
}
