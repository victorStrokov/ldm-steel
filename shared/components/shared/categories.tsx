'use client';

import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { Category } from '@prisma/client';
import React from 'react';

interface Props {
  items: Category[];
  className?: string;
}

export const Categories: React.FC<Props> = ({ items, className }) => {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  const setActiveId = useCategoryStore((state) => state.setActiveId);

  return (
    <div className={cn('inline-flex gap-1 rounded-2xl bg-gray-50 p-1', className)}>
      {items.map(({ name, id }) => (
        <a
          key={id}
          href={`/#${name}`}
          onClick={(e) => {
            e.preventDefault(); // отменяем стандартный переход
            setActiveId(id);
            document.getElementById(name)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
          className={cn(
            'flex h-11 items-center rounded-2xl px-5 font-bold',
            categoryActiveId === id && 'text-blue-medium bg-white shadow-md shadow-gray-200',
          )}
        >
          {name}
        </a>
      ))}
    </div>
  );
};
