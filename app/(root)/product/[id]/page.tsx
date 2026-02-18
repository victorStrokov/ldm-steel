import { Container, ProductForm } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      items: true,
      images: true, // ← изображения продукта

      ingredients: {
        include: {
          images: true,
        },
      },

      category: {
        include: {
          products: {
            include: {
              items: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!product) return notFound();

  return (
    <Container className="flex flex-col my-10">
      <ProductForm product={product} />
    </Container>
  );
}
