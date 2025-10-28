import { ChooseProductModal } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({ params: { id } }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: { items: true },
          },
        },
      },
    },
  });
  if (!product) {
    notFound();
  }

  return <ChooseProductModal product={product!} />;
}
