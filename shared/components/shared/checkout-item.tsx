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
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-md bg-white',
        {
          'opacity-50 pointer-events-none': disabled, // pointer-events-none - убирает возможность кликать на элемент
        },
        className,
      )}
    >
      <div className="flex items-start gap-4 flex-1">
        <CartItemDetails.Image src={imageUrl} id={id} />
        <CartItemDetails.Info className="flex-1 min-w-0" name={name} details={details} />
      </div>
      <div className="flex items-center gap-3 sm:gap-5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
        <CartItemDetails.Price value={price} />

        <CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
        <button type="button" onClick={onClickRemove}>
          <X className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};
