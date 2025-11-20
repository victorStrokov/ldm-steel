'use client';

import React from 'react';
import Image from 'next/image';

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CartDrawerItem } from './cart-drawer-item';
import { getCartItemDetails, productLengtRename } from '@/shared/lib';
import { useCartStore } from '@/shared/store';
import { ProductThickness, SteelSizes } from '@/shared/constants/profile';
import { Title } from './title';
import { DialogDescription } from '../ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const items = useCartStore((state) => state.items);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeCartItem = useCartStore((state) => state.removeCartItem);

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between pb-0 bg-[#ebddf7]">
        {totalAmount > 0 && (
          <SheetHeader>
            <SheetTitle>
              В корзине <span className="font-bold">{productLengtRename(items.length)}</span>
            </SheetTitle>
          </SheetHeader>
        )}

        {!totalAmount && (
          <div className="flex flex-col items-center justify-center w-72 mx-auto">
            <VisuallyHidden>
              <DialogDescription>Корзина пуста. Добавьте товары, чтобы оформить заказ.</DialogDescription>
            </VisuallyHidden>

            <Image src="/assets/empty-cart.png" width={200} height={200} alt="empty cart" />
            <Title size="sm" text="Ваша корзина пуста" className="text-center font-bold my-2" />
          </div>
        )}

        {totalAmount > 0 && (
          <>
            <div className="mx-1 mt-5 overflow-auto scrollbar flex-1">
              {items.map((item) => (
                <div key={item.id} className="mb-2">
                  <CartDrawerItem
                    id={item.id}
                    imageUrl={item.imageUrl}
                    details={
                      item.steelSize && item.productThickness
                        ? getCartItemDetails(
                            item.ingredients,
                            item.productThickness as ProductThickness,
                            item.steelSize as SteelSizes,
                          )
                        : ''
                    }
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

            <SheetFooter className="w-full bg-white p-8">
              <div className="w-full">
                <div className="flex mb-4">
                  <span className="flex flex-1 text-lg text-neutral-500">
                    Итого
                    <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                  </span>

                  <span className="font-bold text-lg">{totalAmount} ₽</span>
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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
