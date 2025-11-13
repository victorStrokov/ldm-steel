'use client';

import React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails } from '@/shared/lib';

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between pb-0 bg-[#ebddf7]">
        <SheetHeader>
          <SheetTitle>
            В корзине <span className="font-bold">3 товара</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mx-1 mt-5 overflow-auto scrollbar flex-1">
          <div className="mb-2">
            <CartDrawerItem
              id={1}
              imageUrl="http://localhost:3000/assets/REHAU_245536.png"
              details={getCartItemDetails(2, 2, [
                { name: 'Соединитель механический ' },
                { name: 'импоста Montblanc Eco 60' },
              ])}
              name="Соединитель механический импоста Montblanc Eco 60"
              price={500}
              quantity={2}
            />
          </div>
        </div>

        <SheetFooter className="w-full bg-white p-8">
          <div className="w-full">
            <div className="flex mb-4">
              <span className="flex flex-1 text-lg text-neutral-500">
                Итого
                <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
              </span>

              <span className="font-bold text-lg">{500} ₽</span>
            </div>

            <Link href="/cart">
              <Button
                //   onClick={() => setRedirecting(true)}
                //   loading={loading || redirecting}
                type="submit"
                className="w-full h-12 text-base"
              >
                Оформить заказ
                <ArrowRight size={16} className="w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
