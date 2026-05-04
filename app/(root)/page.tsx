import { Container, Title, TopBar, Filters, ProductsGroupList, Stories } from '@/shared//components/shared';
import { Suspense } from 'react';
import { findProducts, GetSearchParams } from '../actions/find-products';
import { getCatalogSettings } from '../actions/get-catalog-settings';

export default async function Home({ searchParams }: { searchParams: Promise<GetSearchParams> }) {
  const params: GetSearchParams = await searchParams;

  const catalogSettings = await getCatalogSettings();
  const categories = await findProducts(params);
  return (
    <>
      <Stories />
      <Container className="mt-10">
        <Title size="lg" className="text-blue-deep/90 font-extrabold text-2xl md:text-4xl">
          Каталог
        </Title>
      </Container>

      <TopBar categories={categories.filter((category) => category.products.length > 0)} />
      <Container className="mt-10 mb-4">
        <div className="flex flex-col gap-6 md:flex-row md:gap-15 md:items-start">
          <div className="w-full md:w-62.5 md:sticky md:top-23 md:self-start md:max-h-[calc(100vh-108px)] md:overflow-y-auto">
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
                      priceMode={catalogSettings.priceMode}
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
