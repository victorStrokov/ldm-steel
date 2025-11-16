'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@/shared/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ChooseProductForm } from '../choose-product-form';
import { ProductWithRelations } from '@/@types/prisma';
import { ChooseProfileForm } from '../choose-profile-form';
import { useCartStore } from '@/shared/store';
import toast from 'react-hot-toast';
// import { hasVariations } from '@/shared/lib/utils';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();
  const firstItem = product.items?.[0];
  const isProfileForm = Boolean(firstItem?.steelSize);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);
  if (!product) return null;

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      if (isProfileForm && productItemId && ingredients) {
        await addCartItem({
          productItemId,
          ingredients,
        });
      } else {
        await addCartItem({
          productItemId: firstItem.id,
        });
      }
      toast.success('Товар добавлен в корзину');
      router.back();
    } catch (error) {
      toast.error('Не удалось добавить в корзину');
      console.error(error);
    }
  };
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

        {isProfileForm ? (
          <ChooseProfileForm
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            items={product.items}
            onSubmit={onSubmit}
            loading={loading}
          />
        ) : (
          <ChooseProductForm
            name={product.name}
            imageUrl={product.imageUrl}
            price={firstItem?.price ?? 0}
            onSubmit={onSubmit}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
