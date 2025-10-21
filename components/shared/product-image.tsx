import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl?: string;
  size?: number;
}

export const ProductImage: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <img
        src={imageUrl}
        alt="logo"
        className={cn('relative left-2 top-2 transition-all z-10 duration-300', {
          'w-[300px] h-[300px]': size === 1.2,
        })}
      />
    </div>
  );
};
