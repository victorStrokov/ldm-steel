import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { IngredientWithImages } from '@/@types/IngredientWithImages';
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: IngredientWithImages[];
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, price, imageUrl, ingredients, className }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';

  return (
    <div className={cn('h-full min-h-[320px] sm:min-h-[340px] md:min-h-[360px] flex', className)}>
      <Link
        href={`/product/${id}`}
        className="flex h-full flex-col justify-between rounded-md sm:rounded-lg bg-white dark:bg-neutral-900 shadow-sm px-2 py-2 sm:px-4 sm:py-4 gap-2 sm:gap-3"
      >
        {/* Верхняя часть */}
        <div>
          <div className="bg-secondary flex aspect-[3/2] items-center justify-center rounded-md sm:rounded-lg">
            <img
              src={normalizedImageUrl}
              alt={name}
              className="max-h-32 sm:max-h-40 md:max-h-48 max-w-full cursor-pointer object-contain transition-transform duration-200 hover:scale-105"
            />
          </div>

          <Title text={name} size="xs" className="mt-2 mb-1 line-clamp-2 font-bold text-base sm:text-lg" />
          <p className="line-clamp-2 text-xs sm:text-sm text-gray-500">
            {ingredients.map((ingredient) => ingredient.name).join(', ')}
          </p>
        </div>

        {/* Нижняя часть */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg md:text-xl">
            от <b>{price} ₽</b>
          </span>
          <Button
            variant="default"
            className="text-xs sm:text-sm md:text-base font-bold flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
          >
            <Plus size={18} className="" />
            Купить
          </Button>
        </div>
      </Link>
    </div>
  );
};
