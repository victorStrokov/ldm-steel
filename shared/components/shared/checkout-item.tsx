'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import * as CartItemDetails from './cart-item-details';

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void; // вызов функции из родительского компонента для изменения количества товара в корзине
  onClickRemove?: () => void;
  className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  quantity,
  details,
  className,
  disabled,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-md border bg-white p-4 sm:flex-row sm:items-center sm:justify-between',
        {
          'pointer-events-none opacity-50': disabled, // pointer-events-none - убирает возможность кликать на элемент
        },
        className,
      )}
    >
      <div className="flex flex-1 items-start gap-4">
        <CartItemDetails.Image src={imageUrl ?? '/no-image.png'} id={id} />
        <CartItemDetails.Info className="min-w-0 flex-1" name={name} details={details} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:justify-end sm:gap-5">
        <CartItemDetails.Price value={price} />

        <CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
        <button type="button" onClick={onClickRemove}>
          <X className="cursor-pointer text-gray-400 hover:text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};
