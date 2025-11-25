import React from 'react';
import { WhiteBlock } from './white-block';
import { ArrowBigRight, Coins, PackagePlus, RussianRuble, Truck } from 'lucide-react';
import { Button, Skeleton } from '../ui';
import { CheckoutItemDetails } from './checkout-item-details';
import { cn } from '@/shared/lib/utils';

const VAT = 20;
const DELIVERY_PRICE = 4000;

interface Props {
  totalAmount: number;
  loading?: boolean;

  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ className, loading, totalAmount }) => {
  const packingPrice = totalAmount < 300000 ? 500 : 0;
  const vatPrice = ((totalAmount + packingPrice + DELIVERY_PRICE) * VAT) / 100;
  const deliveryPrice = totalAmount < 100000 ? DELIVERY_PRICE : 0;
  const totalPrice = totalAmount + deliveryPrice + packingPrice;

  // TODO:
  // const totalPriceWithoutDelivery = totalAmount + packingPrice;
  // реализоват выбор доставки или самовывоз
  return (
    <WhiteBlock className={cn('p-6 sticky top-4', className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого:</span>
        {loading ? (
          <Skeleton className=" h-11 w-48" />
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
        value={loading ? <Skeleton className=" h-6 w-16 rounded-[6px]" /> : `${totalAmount} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <PackagePlus size={18} className="mr-3  text-gray-400" />
            Услуги упаковки:
          </div>
        }
        value={loading ? <Skeleton className=" h-6 w-14 rounded-[6px]" /> : `${packingPrice} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-3  text-gray-400" />
            Доставка:
          </div>
        }
        value={loading ? <Skeleton className=" h-6 w-16 rounded-[6px]" /> : `${deliveryPrice} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Coins size={18} className="mr-3  text-gray-400" />
            НДС (20%):
          </div>
        }
        value={loading ? <Skeleton className=" h-6 w-18 rounded-[6px]" /> : `${vatPrice} ₽`}
      />
      <Button
        loading={loading}
        type="submit"
        disabled={false}
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
      >
        Перейти к оплате
        <ArrowBigRight size={20} className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
