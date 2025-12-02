import { Container, Title, TopBar, Filters, ProductsGroupList, Stories } from '@/shared//components/shared';
import { Suspense } from 'react';
import { findProducts } from '@/shared/lib';
import { GetSearchParams } from '@/shared/lib/find-products';

export default async function Home({ searchParams }: { searchParams: GetSearchParams }) {
  const params = await searchParams;
  const categories = await findProducts(params);
  return (
    <>
      <Container className="mt-10">
        <Title size="lg" className="font-extrabold text-blue-deep/90">
          Каталог
        </Title>
      </Container>

      <Stories />
      <TopBar categories={categories.filter((category) => category.products.length > 0)} />
      <Container className="mt-10 mb-4">
        <div className="flex gap-[60px]">
          <div className="w-[250px]">
            <Suspense fallback={<div>Loading...</div>}>
              <Filters />
            </Suspense>
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
