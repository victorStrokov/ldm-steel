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
    <div className={cn('relative flex w-full flex-1 items-center justify-center', className)}>
      <div className="flex aspect-square w-full max-w-[400px] items-center justify-center rounded-lg bg-gray-50">
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
