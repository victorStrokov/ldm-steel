'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseProfileForm } from '../choose-profile-form';
// import { hasVariations } from '@/shared/lib/utils';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  if (!product) return null;

  // const isProductWithVariations = hasVariations(product);

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          'w-full h-full md:h-auto md:max-w-[1060px] max-h-[90vh] bg-white overflow-hidden md:rounded-2xl rounded-none flex flex-col',
          className,
        )}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>

        <ChooseProfileForm
          name={product.name}
          imageUrl={product.imageUrl}
          ingredients={product.ingredients}
          items={product.items}
        />

        <ChooseProductForm name={product.name} imageUrl={product.imageUrl} />
      </DialogContent>
    </Dialog>
  );
};
