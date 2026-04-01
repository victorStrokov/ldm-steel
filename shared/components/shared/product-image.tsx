'use client';

import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl?: string;
  onClickImage?: () => void;
  imgClassName?: string;
}

export const ProductImage: React.FC<Props> = ({ imageUrl, className, onClickImage, imgClassName }) => {
  const handleClick = onClickImage ?? (() => {});
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';

  return (
    <div className={cn('relative flex w-full flex-1 items-center justify-center px-2 sm:px-4 md:px-0', className)}>
      <div
        className={cn(
          // Адаптивный max-w и скругление
          'flex aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg items-center justify-center rounded-md sm:rounded-lg bg-gray-50 dark:bg-neutral-900',
        )}
      >
        <img
          src={normalizedImageUrl}
          onClick={handleClick}
          alt="product"
          className={cn('h-full w-full cursor-pointer object-contain', imgClassName)}
        />
      </div>
    </div>
  );
};
