'use client';

import { ProductWithRelations } from '@/@types/prisma';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';
import { ChooseProfileForm } from './choose-profile-form';
import { ChooseProductForm } from './choose-product-form';

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit }) => {
  const firstItem = product.items?.[0];
  const isProfileForm = Boolean(firstItem?.steelSize);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem?.id;

      await addCartItem({
        productItemId: itemId,
        ingredients,
      });

      toast.success(product.name + '  добавлен в корзину');

      _onSubmit?.();
    } catch (error) {
      toast.error('Не удалось добавить товар в корзину');
      console.error(error);
    }
  };
  const handleImageClick = () => {
    window.location.href = `/product/${product.id}`;
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
        imageUrl={product.images?.[0]?.url ?? '/no-image.png'}
        name={product.name}
        ingredients={product.ingredients}
        items={product.items}
        onSubmit={onSubmit}
        loading={loading}
        onClickImage={handleImageClick}
      />
    );
  }
  return (
    <ChooseProductForm
      name={product.name}
      imageUrl={product.images?.[0]?.url ?? '/no-image.png'}
      price={firstItem?.price ?? 0}
      onSubmit={onSubmit}
      loading={loading}
      onClickImage={handleImageClick}
    />
  );
};
