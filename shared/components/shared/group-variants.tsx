'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';

export type Variant = {
  name: string;
  value: string;
  disabled?: boolean;
};

interface Props {
  items: readonly Variant[];
  onClick?: (value: Variant['value']) => void;
  value?: Variant['value'];
  className?: string;
}

export const GroupVariants: React.FC<Props> = ({ items, value, onClick, className }) => {
  return (
    <div
      className={cn(
        className,
        'flex flex-wrap justify-between gap-1 sm:gap-2 rounded-2xl sm:rounded-3xl bg-[#F3F3F7] p-1 sm:p-2 select-none',
      )}
    >
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onClick?.(item.value)}
          className={cn(
            'flex h-8 sm:h-9 flex-1 min-w-[80px] max-w-full cursor-pointer items-center justify-center rounded-2xl sm:rounded-3xl px-3 sm:px-5 text-xs sm:text-sm transition-all duration-400',
            {
              'bg-white shadow': item.value === value,
              'pointer-events-none text-gray-500 opacity-50': item.disabled,
            },
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
