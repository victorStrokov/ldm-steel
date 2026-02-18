import { prisma } from '@/prisma/prisma-client';
import { ChooseProductModal } from '@/shared/components/shared';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      items: true,
      ingredients: {
        include: {
          images: true,
        },
      },
      images: true,
    },
  });
  if (!product) return notFound();
  return <ChooseProductModal product={product} />;
}
