import { cn } from '@/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
  imageUrl?: string;
  name: string;
  className?: string;
  ingredients?: any[];
  items?: any[];
  onClickAdd?: VoidFunction;
}

export const ChooseProductForm: React.FC<Props> = ({ imageUrl, name, className, ingredients, items, onClickAdd }) => {
  const textDetails =
    'профиль аррмирующий п-образный, профиль пвх 70 мм, двухкамерный стеклопакет, фурнитура стандарт, цвет белый, монтажная пена, доставка и установка включены в стоимость';
  const totalPrice = items?.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className={cn('flex, flex-1', className)}>
      <div className="flex items-center justify-center flex-1 relative w-full">
        <img src={imageUrl} alt={name} className="relative left-2 top-2 transition-all duration-300 w-[300] h-[300]" />
      </div>
      <div className="w-[490px] bg-[#f7f6f5]">
        <Title text={name} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-500">{textDetails}</p>
        <Button
          //   loading={loading}
          onClick={onClickAdd}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
        >
          Добавить в корзину за {totalPrice} ₽
        </Button>
      </div>
    </div>
  );
};
