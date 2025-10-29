'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseProfileForm } from '../choose-profile-form';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const isProfileForm = Boolean(product.items[0]?.profileType);
  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent className={cn('p-0 w-[1060] max-w-[1060] min-h-[500] bg-white overflow-hidden', className)}>
        <DialogTitle className="text-center hidden">{product.name}</DialogTitle>
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
