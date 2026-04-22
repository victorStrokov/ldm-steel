import { Container, ProductForm } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { notFound } from 'next/navigation';
import { getCatalogSettings } from '@/app/actions/get-catalog-settings';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalogSettings = await getCatalogSettings();

  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      items: true,
      images: true, // ← изображения продукта
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

  const outgoingRelations = product.relatedProducts;
  const incomingRelations = product.relatedToProducts.map((relation) => ({
    ...relation,
    relatedProductId: relation.productId,
    relatedProduct: relation.product,
  }));

  const mergedRelationsMap = new Map<number, (typeof outgoingRelations)[number]>();

  for (const relation of [...outgoingRelations, ...incomingRelations]) {
    if (!mergedRelationsMap.has(relation.relatedProductId)) {
      mergedRelationsMap.set(relation.relatedProductId, relation);
    }
  }

  const mergedRelatedProducts = Array.from(mergedRelationsMap.values());

  const productForView = {
    ...product,
    relatedProducts: mergedRelatedProducts,
  };

  return (
    <Container className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 flex flex-col">
      <ProductForm product={productForView} priceMode={catalogSettings.priceMode} />
    </Container>
  );
}
