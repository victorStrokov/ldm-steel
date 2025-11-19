'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';
import { ChooseProfileForm } from './choose-profile-form';
import { ChooseProductForm } from './choose-product-form';

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ProductForm: React.FC<Props> = ({ product }) => {
  const firstItem = product.items?.[0];
  const isProfileForm = Boolean(firstItem?.steelSize);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem?.id;
      console.log('DEBUG values:', { productItemId: itemId, ingredients });

      await addCartItem({
        productItemId: itemId,
        ingredients,
      });

      toast.success(product.name + '  добавлен в корзину');
    } catch (error) {
      toast.error('Не удалось добавить товар в корзину');
      console.error(error);
    }
  };
  // const variants = product?.items.map((item) => ({
  //   name:
  //     item.pvcSize != null
  //       ? `ПВХ ${item.pvcSize}мм`
  //       : item.steelSize != null
  //       ? `Сталь ${item.steelSize}мм`
  //       : item.productLength != null
  //       ? `Длина ${item.productLength}м`
  //       : 'Вариант',
  //   value: String(item.id),
  // }));
  if (isProfileForm) {
    return (
      <ChooseProfileForm
        imageUrl={product.imageUrl}
        name={product.name}
        ingredients={product.ingredients}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
      />
    );
  }
  return (
    <ChooseProductForm
      name={product.name}
      imageUrl={product.imageUrl}
      price={firstItem?.price ?? 0}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};
