import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, price, imageUrl, className }) => {
  return (
    <div className={`${className} h-full`}>
      <Link href={`/products/${id}`} className="flex flex-col justify-between h-full">
        {/* Верхняя часть */}
        <div>
          <div className="bg-secondary rounded-lg aspect-[3/2] flex items-center justify-center">
            <img src={imageUrl} alt={name} className="max-w-full max-h-full object-contain" />
          </div>

          <Title text={name} size="xs" className="mb-1 mt-3 font-bold line-clamp-2" />
          <p className="text-sm text-gray-500 line-clamp-2">
            ALUPLAST 229001, п-образный, APM 30 x 30, длинна 6-метров, 600 метров
          </p>
        </div>

        {/* Нижняя часть */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-[18px] sm:text-[20px]">
            от <b>{price} ₽</b>
          </span>
          <Button variant="default" className="font-bold text-sm sm:text-base">
            <Plus size={18} className="mr-1" />
            Купить
          </Button>
        </div>
      </Link>
    </div>
  );
};
