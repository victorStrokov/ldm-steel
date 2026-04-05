import { prisma } from '@/prisma/prisma-client';
import { getCatalogSettings } from '@/app/actions/get-catalog-settings';
import { ChooseProductModal } from '@/shared/components/shared';
import { notFound } from 'next/navigation';

export default async function ProductModalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalogSettings = await getCatalogSettings();
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
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-8">
      <ChooseProductModal product={product} priceMode={catalogSettings.priceMode} />
    </div>
  );
}
