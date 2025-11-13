'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
  imageUrl?: string;
  name: string;
  className?: string;
  loading?: boolean;
  items?: { price?: number }[];
  onClickAdd?: VoidFunction;
}

export const ChooseProductForm: React.FC<Props> = ({ imageUrl, name, className, onClickAdd, loading }) => {
  const textDetails = 'профиль аррмирующий п-образный, профиль пвх 70 мм';

  const totalPrice = 100; // Placeholder price

  return (
    <div
      className={cn(
        // на мобилке — колонка, на md+ — строка
        'flex flex-col md:flex-row flex-1 gap-6 p-4 md:p-6',
        className,
      )}
    >
      {/* Левая часть: картинка */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <img src={imageUrl} alt={name} className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      {/* Правая часть: текст + кнопка */}
      <div className="w-full md:w-1/2 bg-[#f7f6f5] rounded-lg p-4 md:p-6 flex flex-col">
        <Title text={name} size="md" className="font-extrabold mb-3" />
        <p className="text-gray-500 mb-4">{textDetails}</p>

        <div className="mt-auto">
          <Button
            loading={loading}
            onClick={onClickAdd}
            className="h-[55px] px-6 text-base rounded-[18px] w-full whitespace-normal"
          >
            Добавить в корзину за {totalPrice} ₽
          </Button>
        </div>
      </div>
    </div>
  );
};
