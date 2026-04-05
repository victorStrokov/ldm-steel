'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Button } from '../ui';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { CartDrawer } from './cart-drawer';
import { useCartStore } from '@/shared/store';
import { useCatalogSettings } from '@/shared/hooks/use-catalog-settings';
import { canShowPrices } from '@/shared/lib/catalog-mode';

interface Props {
  className?: string;
}

export const CartButton: React.FC<Props> = ({ className }) => {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const items = useCartStore((state) => state.items);
  const loading = useCartStore((state) => state.loading);
  const { priceMode } = useCatalogSettings();
  return (
    <CartDrawer>
      <div>
        <Button
          loading={loading}
          className={cn(
            'group relative px-2 sm:px-4 py-2 sm:py-3 min-w-20 h-10 sm:h-12',
            { 'w-20': loading },
            className,
          )}
        >
          {canShowPrices(priceMode) ? (
            <b className="text-sm sm:text-base">{totalAmount} ₽</b>
          ) : (
            <b className="text-sm sm:text-base">Корзина</b>
          )}
          <span className="mx-2 sm:mx-3 h-full w-px bg-white/30 hidden sm:inline-block" />
          <div className="flex items-center gap-1 sm:gap-2 transition duration-300 group-hover:opacity-0">
            <ShoppingCart size={15} className="relative" strokeWidth={2} />
            <b className="text-sm sm:text-base">{items.length}</b>
          </div>
          <ArrowRight
            size={18}
            className="absolute right-3 sm:right-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </Button>
      </div>
    </CartDrawer>
  );
};
