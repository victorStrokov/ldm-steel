'use client';

import { Product } from '@prisma/client';
import { cn } from '@/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Title } from '../title';
import { useRouter } from 'next/navigation';
import { ChooseProfileForm } from '../choose-profile-form';

interface Props {
  product: Product;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent className={cn('p-0 w-[1060] max-w-[1060] min-h-[500] bg-white overflow-hidden', className)}>
        <DialogTitle className="text-center">{product.name}</DialogTitle>
        <ChooseProfileForm name={product.name} imageUrl={product.imageUrl} ingredients={[]} />
      </DialogContent>
    </Dialog>
  );
};
