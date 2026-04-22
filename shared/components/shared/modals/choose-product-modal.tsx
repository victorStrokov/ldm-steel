'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/@types/prisma';
import { ProductForm } from '../product-form';
import { PriceMode } from '@/shared/lib/catalog-mode';

interface Props {
  product: ProductWithRelations;
  priceMode?: PriceMode;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, priceMode, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'flex h-[96dvh] max-h-[96dvh] w-full flex-col overflow-hidden rounded-none bg-white p-0 sm:h-[90vh] sm:max-h-[90vh] sm:p-6 md:max-w-265 md:rounded-2xl',
          className,
        )}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="shrink-0 px-3 pt-3 sm:px-0 sm:pt-0">
          Настройте параметры товара перед добавлением в заказ
        </DialogDescription>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ProductForm product={product} priceMode={priceMode} onSubmit={() => router.back()} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
