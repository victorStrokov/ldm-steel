'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { ProductCard } from './product-card';
import { useCategoryStore } from '@/shared/store/category';
import { ProductWithRelations } from '@/@types/prisma';
import { useSortStore } from '@/shared/store';
import { PriceMode } from '@/shared/lib/catalog-mode';

interface Props {
  title: string;
  items: ProductWithRelations[];
  categoryKey: string;
  priceMode?: PriceMode;
  className?: string;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryKey,
  priceMode,
  className,
}) => {
  const setActiveCategoryKey = useCategoryStore((state) => state.setActiveKey);
  const { order } = useSortStore();
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
    threshold: 0.2,
    rootMargin: '-80px 0px 0px 0px',
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryKey(categoryKey);
    }
  }, [categoryKey, intersection?.isIntersecting, setActiveCategoryKey, title]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((asc, desc) => {
      const priceAsc = asc.items?.[0]?.price ?? 0;
      const priceDesc = desc.items?.[0]?.price ?? 0;
      return order === 'asc' ? priceAsc - priceDesc : priceDesc - priceAsc;
    });
  }, [items, order]);

  return (
    <div
      className={cn('px-2 py-4 sm:px-4 md:px-8 ', className)}
      id={title}
      ref={intersectionRef}
      style={{ scrollMarginTop: '120px' }}
    >
      <Title
        text={title}
        size="lg"
        className="mb-4 sm:mb-5 font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center sm:text-left"
      />
      <div
        className={cn(
          // Адаптивная сетка: 1 колонка на мобилках, 2 на планшетах, 3 на десктопах
          'grid grid-cols-1 items-stretch gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3',
          listClassName,
        )}
        style={{ minWidth: 0 }}
      >
        {sortedItems.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name || 'Без названия'}
            shortDesc={product.shortDesc}
            imageUrl={product.images?.[0]?.url ?? '/no-image.png'}
            price={product.items?.[0]?.price ?? 0}
            priceMode={priceMode}
          />
        ))}
      </div>
    </div>
  );
};
