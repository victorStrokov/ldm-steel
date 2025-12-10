'use client';

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
  return (
    <div className={cn('flex items-center justify-center flex-1 relative w-full', className)}>
      <div className="flex items-center justify-center bg-gray-50 rounded-lg w-full max-w-[400px] aspect-square">
        <img
          src={imageUrl}
          onClick={handleClick}
          alt="product"
          className={cn('object-contain w-full h-full cursor-pointer', imgClassName)}
        />
      </div>
    </div>
  );
};
