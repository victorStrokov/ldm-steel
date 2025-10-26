'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type Variant = {
  name: string;
  value: string;
  disable?: boolean;
};
interface Props {
  items: readonly Variant[];
  onClick?: (value: Variant['value']) => void;
  className?: string;
  selectedValue?: Variant['value'];
}

export const GroupVariants: React.FC<Props> = ({ items, onClick, selectedValue, className }) => {
  return (
    <div className={cn(className, 'flex justify-between bg-[#F3F3F7] rounded-3xl p-1 select-none')}>
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => onClick?.(item.value)}
          className={cn(
            'flex items-center justify-center cursor-pointer h-[35px] px-5 flex-1 rounded-3xl transition-all duration-500 text-sm',
            {
              'bg-white shadow-md ': item.value === selectedValue,
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
