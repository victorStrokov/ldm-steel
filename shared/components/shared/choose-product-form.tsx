'use client';

import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
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
  price: number;
  onSubmit?: VoidFunction;
  onClickImage?: () => void;
}

export const ChooseProductForm: React.FC<Props> = ({
  imageUrl,
  name,
  className,
  onSubmit,
  loading,
  price,
  onClickImage,
}) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';

  return (
    <div
      className={cn(
        // на мобилке — колонка, на md+ — строка
        'flex flex-1 flex-col gap-6 p-4 md:flex-row md:p-6',
        className,
      )}
    >
      {/* Левая часть: картинка */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="flex h-[300px] w-full max-w-[300px] items-center justify-center rounded-lg bg-gray-50">
          <img
            src={normalizedImageUrl}
            onClick={onClickImage}
            alt={name}
            className="h-full w-full cursor-pointer object-contain"
          />
        </div>
      </div>

      {/* Правая часть: текст + кнопка */}
      <div className="flex w-full flex-col rounded-lg bg-[#f7f6f5] p-4 md:w-1/2 md:p-6">
        <Title text={name} size="md" className="mb-3 font-extrabold" />
        {/* <p className="text-gray-500 mb-4">{textDetails}</p> */}

        <div className="mt-auto">
          <Button
            loading={loading}
            onClick={() => onSubmit?.()}
            className="h-[55px] w-full rounded-[18px] px-6 text-base whitespace-normal"
          >
            Добавить в корзину за {price} ₽
          </Button>
        </div>
      </div>
    </div>
  );
};
