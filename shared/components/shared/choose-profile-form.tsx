'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { ProductImage } from './product-image';
import { ProductVariants } from './product-variants';

interface Props {
  imageUrl?: string;
  name: string;
  className?: string;
  ingredients?: any[];
  items: any[];
  onClickAdd?: VoidFunction;
}

export const ChooseProfileForm: React.FC<Props> = ({ imageUrl, name, className, ingredients, items, onClickAdd }) => {
  const textDetails =
    'профиль аррмирующий п-образный, профиль пвх 70 мм, двухкамерный стеклопакет, фурнитура стандарт, цвет белый, монтажная пена, доставка и установка включены в стоимость';

  const totalPrice = items?.reduce((sum, item) => sum + (item.price ?? 0), 0);

  return (
    <div className={cn('flex flex-col md:flex-row flex-1 gap-6 p-4 md:p-6', className)}>
      {/* Левая часть: картинка */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <ProductImage imageUrl={imageUrl} size={6} className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      {/* Правая часть: текст + варианты + кнопка */}
      <div className="w-full md:w-1/2 bg-[#f7f6f5] rounded-lg p-4 md:p-6 flex flex-col">
        <Title text={name} size="md" className="font-extrabold mb-3" />
        <p className="text-gray-500 mb-4">{textDetails}</p>

        {/* Варианты */}
        <div className="flex-1 overflow-y-auto pr-2">
          <ProductVariants items={items} />
        </div>

        {/* Кнопка */}
        <Button onClick={onClickAdd} className="mt-6 h-[55px] px-6 text-base rounded-[18px] w-full">
          Добавить в корзину за {totalPrice} ₽
        </Button>
      </div>
    </div>
  );
};
