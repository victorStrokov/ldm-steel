import { cn } from '@/lib/utils';
import React from 'react';
import { ProductImage } from './product-image';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
  imageUrl?: string;
  name: string;
  className?: string;
  ingredients?: any[];
  items?: any[];
  onClickAdd?: VoidFunction;
}

export const ChooseProfileForm: React.FC<Props> = ({ imageUrl, name, className, ingredients, items, onClickAdd }) => {
  const textDitails =
    'ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const totalPrice = items?.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className={cn('flex, flex-1', className)}>
      <ProductImage imageUrl={imageUrl} size={1.5} />

      <div className="w-[490px] bg-[#f7f6f5]">
        <Title text={name} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-500">{textDitails}</p>
        <Button
          //   loading={loading}
          onClick={onClickAdd}
          className="h-[55px] px-10 text-base rounded-[18px] w-full"
        >
          Добавить в корзину за {totalPrice} ₽
        </Button>
      </div>
    </div>
  );
};
