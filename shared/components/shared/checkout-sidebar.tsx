'use client';

import React, { useState } from 'react';
import { WhiteBlock } from './white-block';
import { ArrowBigRight, PackagePlus, RussianRuble, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { CheckoutItemDetails } from './checkout-item-details';
import { cn } from '@/shared/lib/utils';

const VAT = 22;
const DELIVERY_PRICE = 4000;

interface Props {
  totalAmount: number;
  loading?: boolean;
  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ className, loading, totalAmount }) => {
  const [isDelivery, setIsDelivery] = useState(true);

  const packingPrice = totalAmount < 300000 ? 500 : 0;
  const deliveryPrice = isDelivery ? (totalAmount < 100000 ? DELIVERY_PRICE : 0) : 0;
  const vatPrice = Math.round(((totalAmount + packingPrice + deliveryPrice) * VAT) / 100);
  const totalPrice = totalAmount + deliveryPrice + packingPrice;

  return (
    <WhiteBlock className={cn('sticky top-4 p-6', className)}>
      <div className="mb-5 flex overflow-hidden rounded-xl border border-gray-200 text-sm font-medium">
        <button
          type="button"
          onClick={() => setIsDelivery(true)}
          className={cn(
            'flex-1 py-2.5 transition-colors',
            isDelivery ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Доставка
        </button>
        <button
          type="button"
          onClick={() => setIsDelivery(false)}
          className={cn(
            'flex-1 py-2.5 transition-colors',
            !isDelivery ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Самовывоз
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого:</span>
        {loading ? (
          <Skeleton className="h-11 w-48" />
        ) : (
          <span className="h-11 text-[34px] font-extrabold">{`${totalPrice} ₽`}</span>
        )}
      </div>
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
        value={loading ? <Skeleton className="h-6 w-14 rounded-[6px]" /> : `${packingPrice} ₽`}
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
            <span className="font-medium text-green-600">Бесплатно</span>
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
      <Button
        loading={loading}
        type="submit"
        disabled={false}
        className="mt-6 h-14 w-full rounded-2xl text-base font-bold"
      >
        Перейти к оплате
        <ArrowBigRight size={20} className="ml-2 w-5" />
      </Button>
    </WhiteBlock>
  );
};
