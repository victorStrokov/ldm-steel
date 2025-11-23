import React from 'react';
import { WhiteBlock } from './white-block';
import { ArrowBigRight, Coins, PackagePlus, RussianRuble, Truck } from 'lucide-react';
import { Button } from '../ui';
import { CheckoutItemDetails } from './checkout-item-details';
import { cn } from '@/shared/lib/utils';

const VAT = 20;
const DELIVERY_PRICE = 4000;

interface Props {
  totalAmount: number;
  className?: string;
}

export const CheckoutSidebar: React.FC<Props> = ({ className, totalAmount }) => {
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
        <span className="text-[34px] font-extrabold">{`${totalPrice} ₽`}</span>
      </div>
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <RussianRuble size={18} className="mr-3 text-gray-400" />
            Сумма заказа:
          </div>
        }
        value={`${totalAmount} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <PackagePlus size={18} className="mr-3  text-gray-400" />
            Услуги упаковки:
          </div>
        }
        value={`${packingPrice} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Truck size={18} className="mr-3  text-gray-400" />
            Доставка:
          </div>
        }
        value={`${deliveryPrice} ₽`}
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Coins size={18} className="mr-3  text-gray-400" />
            НДС (20%):
          </div>
        }
        value={`${vatPrice} ₽`}
      />
      <Button type="submit" disabled={false} className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
        Перейти к оплате
        <ArrowBigRight size={20} className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
