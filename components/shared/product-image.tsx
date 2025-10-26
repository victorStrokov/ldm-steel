import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl?: string;
  size?: 1.2 | 1.5 | 2 | 3;
}

export const ProductImage: React.FC<Props> = ({ imageUrl, size, className }) => {
  return (
    <div className={cn('flex items-center justify-center flex-1 relative w-full', className)}>
      <img
        src={imageUrl}
        alt="logo"
        className={cn('relative left-2 top-2 transition-all z-10 duration-300 w-[400px] h-[400px]', {
          'w-[300px] h-[300px]': size === 1.2,
          'w-[400px] h-[400px]': size === 1.5,
          'w-[500px] h-[500px]': size === 2,
          'w-[600px] h-[600px]': size === 3,
        })}
      />

      {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2  bg-gray-200 w-[450px] h-[450px] " />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2  bg-gray-200 w-[370px] h-[370px] " /> */}
    </div>
  );
};
