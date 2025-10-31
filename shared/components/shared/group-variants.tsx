'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';

type Variant = {
  name: string;
  value: string;
  disable?: boolean;
};
interface Props {
  items: readonly Variant[];
  onClick?: (value: string) => void;
  className?: string;
  selectedValue?: string | null;
}

export const GroupVariants: React.FC<Props> = ({ items, onClick, selectedValue, className }) => {
  return (
    <div className={cn(className, 'flex flex-wrap gap-2 bg-[#F3F3F7] rounded-3xl p-2 select-none')}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => !item.disable && onClick?.(item.value)}
          disabled={item.disable}
          className={cn(
            'flex items-center justify-center cursor-pointer h-[35px] px-5 rounded-3xl transition-all duration-300 text-sm',
            {
              'bg-white shadow-md text-primary': item.value === selectedValue,
              'text-gray-500 opacity-50 pointer-events-none': item.disable,
            },
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
