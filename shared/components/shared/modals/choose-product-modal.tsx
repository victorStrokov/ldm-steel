'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseProfileForm } from '../choose-profile-form';
import { hasVariations } from '@/shared/lib/utils';

interface Props {
  product: ProductWithRelations | null;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  if (!product) return null;

  const isProfileForm = hasVariations(product);
  console.log('items in modal:', product.items);
  console.log('modal product:', product);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          // ✅ адаптив: колонка на мобилке, строка на десктопе
          'p-4 md:p-6 w-full max-w-[1060px] min-h-[500px] bg-white overflow-hidden rounded-2xl flex flex-col md:flex-row gap-6',
          className,
        )}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>

        {isProfileForm ? (
          <ChooseProfileForm
            name={product.name}
            imageUrl={product.imageUrl}
            ingredients={product.ingredients}
            items={product.items}
          />
        ) : (
          <ChooseProductForm name={product.name} imageUrl={product.imageUrl} />
        )}
      </DialogContent>
    </Dialog>
  );
};
