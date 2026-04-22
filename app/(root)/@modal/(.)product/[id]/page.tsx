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
      images: true,
      relatedProducts: {
        include: {
          relatedProduct: {
            include: {
              items: true,
              images: true,
            },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      },
      relatedToProducts: {
        include: {
          product: {
            include: {
              items: true,
              images: true,
            },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      },
    },
  });

  if (!product) return notFound();

  const incomingRelations = product.relatedToProducts.map((relation) => ({
    ...relation,
    relatedProductId: relation.productId,
    relatedProduct: relation.product,
  }));

  const mergedRelationsMap = new Map<number, (typeof product.relatedProducts)[number]>();
  for (const relation of [...product.relatedProducts, ...incomingRelations]) {
    if (!mergedRelationsMap.has(relation.relatedProductId)) {
      mergedRelationsMap.set(relation.relatedProductId, relation);
    }
  }

  const productForView = {
    ...product,
    relatedProducts: Array.from(mergedRelationsMap.values()),
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-8">
      <ChooseProductModal product={productForView} priceMode={catalogSettings.priceMode} />
    </div>
  );
}
