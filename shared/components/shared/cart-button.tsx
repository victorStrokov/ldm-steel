'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart } from 'lucide-react';

interface Props {
  className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
  return (
    <div>
      <Button
        // loading={loading}
        className={cn('group relative', className)}
      >
        <b>1125 ₽</b>
        <span className="h-full w-[1px] bg-white/30 mx-3" />
        <div className="flex items-center  gap-2 transition duration-300 group-hover:opacity-0">
          <ShoppingCart size={16} className="relative" strokeWidth={2} />
          <b>15</b>
        </div>
        <ArrowRight
          size={20}
          className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
        />
      </Button>
    </div>
  );
};
