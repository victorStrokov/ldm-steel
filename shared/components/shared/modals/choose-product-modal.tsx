'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/@types/prisma';
import { ProductForm } from '../product-form';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'w-full h-full md:h-auto md:max-w-[1060px] max-h-[90vh] bg-white overflow-hidden md:rounded-2xl rounded-none flex flex-col',
          className,
        )}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription>Настройте параметры товара перед добавлением в корзину</DialogDescription>

        <ProductForm product={product} onSubmit={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
};
