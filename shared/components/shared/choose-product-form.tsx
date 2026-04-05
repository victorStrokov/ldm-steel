'use client';

import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { PriceMode, canShowPrices, shouldShowPriceOnRequestLabel } from '@/shared/lib/catalog-mode';
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
  priceMode?: PriceMode;
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
  priceMode,
  onClickImage,
}) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';

  return (
    <div className={cn('flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:flex-row md:p-6', className)}>
      {/* Левая часть: картинка */}
      <div className="flex w-full items-center justify-center md:w-1/2 mb-4 md:mb-0">
        <div className="flex h-45 sm:h-60 md:h-75 w-full max-w-45 sm:max-w-60 md:max-w-75 items-center justify-center rounded-lg bg-gray-50 p-2 sm:p-0">
          <img
            src={normalizedImageUrl}
            onClick={onClickImage}
            alt={name}
            className="h-full w-full cursor-pointer object-contain"
          />
        </div>
      </div>

      {/* Правая часть: текст + кнопка */}
      <div className="flex w-full flex-col rounded-lg bg-[#f7f6f5] p-3 sm:p-4 md:w-1/2 md:p-6">
        <Title text={name} size="md" className="mb-2 sm:mb-3 font-extrabold" />
        {/* <p className="text-gray-500 mb-4">{textDetails}</p> */}

        <div className="mt-auto">
          <Button
            loading={loading}
            onClick={() => onSubmit?.()}
            className="h-11 sm:h-14 w-full rounded-[14px] sm:rounded-[18px] px-4 sm:px-6 text-base sm:text-lg whitespace-normal"
          >
            {canShowPrices(effectivePriceMode)
              ? `Добавить в корзину за ${price} ₽`
              : shouldShowPriceOnRequestLabel(effectivePriceMode)
                ? 'Добавить в заявку'
                : 'Добавить в заявку'}
          </Button>
        </div>
      </div>
    </div>
  );
};
