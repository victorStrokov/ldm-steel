'use client';

import React from 'react';
import { useIntersection } from 'react-use';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { ProductCard } from './product-card';
import { useCategoryStore } from '@/shared/store/category';

interface ProductVariant {
  price: number;
}

interface ProductData {
  id: number;
  name: string;
  imageUrl?: string | null;
  items?: ProductVariant[];
}

interface Props {
  title: string;
  items: ProductData[];
  categoryId: number;
  className?: string;
  listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ title, items, listClassName, categoryId, className }) => {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
    threshold: 0.4,
  });

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, setActiveCategoryId]);

  return (
    <div className={className} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />

      <div
        className={cn(
          // Адаптивная сетка: 1 колонка на мобилках, 2 на планшетах, 3 на десктопах
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch',
          listClassName,
        )}
      >
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name || 'Без названия'}
            imageUrl={product.imageUrl || '/no-image.png'}
            price={product.items?.[0]?.price ?? 0}
          />
        ))}
      </div>
    </div>
  );
};
