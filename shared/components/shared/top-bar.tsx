'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Container } from './container';
import { Categories } from './categories';
import { StorefrontCategory } from '@/app/actions/find-products';

interface Props {
  categories: StorefrontCategory[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  return (
    <div className={cn('sticky top-0 z-10 bg-white py-3 md:py-5 shadow-lg shadow-black/5', className)}>
      <Container className="flex items-center justify-between px-4 md:px-8">
        <Categories items={categories} />
      </Container>
    </div>
  );
};
