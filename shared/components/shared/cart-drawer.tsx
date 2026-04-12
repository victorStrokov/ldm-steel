'use client';

import React from 'react';
import Image from 'next/image';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails, productLengtRename } from '@/shared/lib';
import { ProductThickness, SteelSizes } from '@/shared/constants/profile';
import { Title } from './title';
import { cn } from '@/shared/lib/utils';
import { useCart } from '@/shared/hooks';
import { useCatalogSettings } from '@/shared/hooks/use-catalog-settings';
import { canShowPrices, isInquiryMode } from '@/shared/lib/catalog-mode';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart();
  const { priceMode, checkoutMode } = useCatalogSettings();
  const [redirecting, setRedirecting] = React.useState(false);

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between bg-[#ebddf7] pb-0 px-2 sm:px-0">
        <div className={cn('flex h-full flex-col', !totalAmount && 'justify-center')}>
          <SheetHeader className="sr-only">
            <SheetTitle>Заказ</SheetTitle>
          </SheetHeader>

          {totalAmount > 0 && (
            <SheetHeader>
              <SheetTitle>
                В заказе <span className="font-bold">{productLengtRename(items.length)}</span>
              </SheetTitle>
              <SheetDescription>Проверьте состав заказа перед оформлением</SheetDescription>
            </SheetHeader>
          )}

          {!totalAmount && (
            <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center px-2 sm:w-72">
              <Image src="/assets/empty-cart.png" width={160} height={160} alt="empty cart" className="mb-2 sm:mb-0" />
              <Title size="sm" text="Ваш заказ пуст" className="my-2 text-center font-bold" />
              <p className="mb-4 sm:mb-5 text-center text-neutral-500 text-sm sm:text-base">
                Добавьте товары в заказ, чтобы отправить заказ менеджеру
              </p>

              <SheetDescription className="sr-only"> Вернуться назад</SheetDescription>
              <SheetClose asChild>
                <Button className="h-11 sm:h-12 w-full sm:w-56 text-base" size="lg">
                  <ArrowLeft className="mr-2 w-5" />
                  Вернуться назад
                </Button>
              </SheetClose>
            </div>
          )}

          {totalAmount > 0 && (
            <>
              <div className="scrollbar mx-0 sm:mx-1 mt-3 sm:mt-5 flex-1 overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="mb-2">
                    <CartDrawerItem
                      id={item.id}
                      imageUrl={item.imageUrl}
                      details={getCartItemDetails(
                        item.productThickness as ProductThickness,
                        item.steelSize as SteelSizes,
                      )}
                      disabled={item.disabled}
                      name={item.name}
                      price={item.price ?? 0}
                      quantity={item.quantity}
                      onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                      onClickRemove={() => removeCartItem(item.id)}
                    />
                  </div>
                ))}
              </div>

              <SheetFooter className="w-full bg-white p-4 sm:p-8">
                <div className="w-full">
                  {canShowPrices(priceMode) && (
                    <div className="mb-3 sm:mb-4 flex">
                      <span className="flex flex-1 text-base sm:text-lg text-neutral-500">
                        Итого
                        <div className="relative -top-1 mx-1 sm:mx-2 flex-1 border-b border-dashed border-b-neutral-200" />
                      </span>
                      <span className="text-base sm:text-lg font-bold">{totalAmount} ₽</span>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button
                      onClick={() => setRedirecting(true)}
                      loading={redirecting}
                      type="submit"
                      className="h-11 sm:h-12 w-full text-base"
                    >
                      {isInquiryMode(checkoutMode) ? 'Отправить заказ менеджеру' : 'Оформить заказ'}
                      <ArrowRight size={16} className="ml-2 w-5" />
                    </Button>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
