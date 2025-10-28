'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const isProfile = Boolean(product.items[0]?.profileType);
  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent className={cn('p-0 w-[1060] max-w-[1060] min-h-[500] bg-white overflow-hidden', className)}>
        <DialogTitle className="text-center">{product.name}</DialogTitle>
        {isProfile ? (
          'ProfileForm'
        ) : (
          <ChooseProductForm name={product.name} imageUrl={product.imageUrl} ingredients={[]} />
        )}
      </DialogContent>
    </Dialog>
  );
};
