'use client';

import React, { useState } from 'react';
import { WhiteBlock } from './white-block';
import { ArrowBigRight, PackagePlus, RussianRuble, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { CheckoutItemDetails } from './checkout-item-details';
import { cn } from '@/shared/lib/utils';
import { canShowPrices, CheckoutMode, isInquiryMode, PriceMode } from '@/shared/lib/catalog-mode';

const VAT = 22;
const DELIVERY_PRICE = 4000;

interface Props {
  totalAmount: number;
  loading?: boolean;
  className?: string;
  priceMode?: PriceMode;
  checkoutMode?: CheckoutMode;
}

export const CheckoutSidebar: React.FC<Props> = ({
  className,
  loading,
  totalAmount,
  priceMode = 'visible',
  checkoutMode = 'order',
}) => {
  const [isDelivery, setIsDelivery] = useState(true);
  const [isPacking, setIsPacking] = useState(true); // true = с упаковкой, false = без упаковки

  const packingPrice = isPacking && totalAmount < 30000 ? 500 : 0;
  const deliveryPrice = isDelivery ? (totalAmount < 100000 ? DELIVERY_PRICE : 0) : 0;
  const vatPrice = Math.round(((totalAmount + packingPrice + deliveryPrice) * VAT) / 100);
  const totalPrice = totalAmount + deliveryPrice + packingPrice;

  return (
    <WhiteBlock className={cn('p-3 sm:p-4 md:p-6', 'md:sticky md:top-4', className)}>
      <div className="mb-2 sm:mb-3 flex overflow-hidden rounded-xl border border-gray-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => setIsDelivery(true)}
          className={cn(
            'flex-1 py-2 transition-colors',
            isDelivery ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Доставка
        </button>
        <button
          type="button"
          onClick={() => setIsDelivery(false)}
          className={cn(
            'flex-1 py-2 transition-colors',
            !isDelivery ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Самовывоз
        </button>
      </div>
      <div className="mb-4 sm:mb-5 flex overflow-hidden rounded-xl border border-gray-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => setIsPacking(true)}
          className={cn(
            'flex-1 py-2 transition-colors',
            isPacking ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Упаковка
        </button>
        <button
          type="button"
          onClick={() => setIsPacking(false)}
          className={cn(
            'flex-1 py-2 transition-colors',
            !isPacking ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Без упаковки
        </button>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <span className="text-lg sm:text-xl">Итого:</span>
        {loading ? (
          <Skeleton className="h-10 sm:h-11 w-32 sm:w-48" />
        ) : canShowPrices(priceMode) ? (
          <span className="h-10 sm:h-11 text-2xl sm:text-[34px] font-extrabold">{`${totalPrice} ₽`}</span>
        ) : (
          <span className="h-10 sm:h-11 text-lg sm:text-xl text-gray-500">Цена по запросу</span>
        )}
      </div>
      {canShowPrices(priceMode) && (
        <>
          <CheckoutItemDetails
            title={
              <div className="flex items-center">
                <RussianRuble size={18} className="mr-3 text-gray-400" />
                Сумма заказа:
              </div>
            }
            value={loading ? <Skeleton className="h-6 w-16 rounded-[6px]" /> : `${totalAmount} ₽`}
          />
          <CheckoutItemDetails
            title={
              <div className="flex items-center">
                <PackagePlus size={18} className="mr-3 text-gray-400" />
                Услуги упаковки:
              </div>
            }
            value={
              loading ? (
                <Skeleton className="h-6 w-14 rounded-[6px]" />
              ) : isPacking && packingPrice > 0 ? (
                `${packingPrice} ₽`
              ) : (
                <span className="font-medium text-green-600">Без упаковки</span>
              )
            }
          />
          <CheckoutItemDetails
            title={
              <div className="flex items-center">
                <Truck size={18} className="mr-3 text-gray-400" />
                Доставка:
              </div>
            }
            value={
              loading ? (
                <Skeleton className="h-6 w-16 rounded-[6px]" />
              ) : isDelivery ? (
                `${deliveryPrice} ₽`
              ) : (
                <span className="font-medium text-green-600">Самовывоз</span>
              )
            }
          />
          <CheckoutItemDetails
            title={
              <div className="flex items-center">
                <ArrowBigRight size={18} className="mr-3 text-gray-400" />
                НДС (22%):
              </div>
            }
            value={loading ? <Skeleton className="h-6 w-18 rounded-[6px]" /> : `${vatPrice} ₽`}
          />
        </>
      )}
      <Button
        loading={loading}
        type="submit"
        disabled={false}
        className="mt-4 sm:mt-6 h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold"
      >
        {isInquiryMode(checkoutMode) ? 'Отправить заявку менеджеру' : 'Перейти к оплате'}
        <ArrowBigRight size={20} className="ml-2 w-5" />
      </Button>
    </WhiteBlock>
  );
};
