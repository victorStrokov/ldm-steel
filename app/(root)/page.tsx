import { Container, Title, TopBar, Filters, ProductsGroupList } from '@/components/shared';
import { prisma } from '@/prisma/prisma-client';

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true,
        },
      },
    },
  });

  return (
    <>
      <Container className="mt-10">
        <Title text="Вся продукция" size="lg" className="font-extrabold"></Title>
      </Container>
      <TopBar />

      <Container className="mt-10 mb-4">
        <div className="flex gap-[60px]">
          {/* Filtretion */}
          <div className="w-[250px]">
            <Filters />
          </div>
          {/* Product list */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                (category) =>
                  category.products.length > 0 && (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
