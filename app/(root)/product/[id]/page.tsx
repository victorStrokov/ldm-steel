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
    <Container className="w-full max-w-4xl mx-auto px-4 md:px-8 py-10 flex flex-col">
      <ProductForm product={product} priceMode={catalogSettings.priceMode} />
    </Container>
  );
}
