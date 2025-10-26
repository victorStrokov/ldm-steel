import { Container, GroupVariants, ProductImage, Title } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
  });

  if (!product) return notFound();
  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-1">
        <ProductImage imageUrl={product.imageUrl} size={20} />
        <div className="w-[490px] bg-[#F7F6F5] p-7">
          <Title text={product.name} size="md" className="font-extrabold mb-1" />
          <p className="text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat nam provident voluptatibus accusantium
            rerum accusamus maxime sint, consectetur voluptas, eum vel, repellendus amet tenetur esse quasi voluptatem
            culpa in maiores
          </p>
          <p className="text-2xl font-semibold text-violet-600">{product.price} ₽</p>
          <p className="text-2xl font-semibold">Толщина:</p>
          <GroupVariants
            selectedValue="3"
            items={[
              { name: ' тонкий ', value: '1', disable: true },
              { name: ' средний ', value: '2' },
              { name: ' толстый ', value: '3' },
            ]}
          />
        </div>
      </div>
    </Container>
  );
}
