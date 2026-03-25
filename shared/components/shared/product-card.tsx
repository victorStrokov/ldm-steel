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
    <div className={`${className} h-full`}>
      <Link href={`/product/${id}`} className="flex h-full flex-col justify-between">
        {/* Верхняя часть */}
        <div>
          <div className="bg-secondary flex aspect-[3/2] items-center justify-center rounded-lg">
            <img src={normalizedImageUrl} alt={name} className="max-h-full max-w-full cursor-pointer object-contain" />
          </div>

          <Title text={name} size="xs" className="mt-3 mb-1 line-clamp-2 font-bold" />
          <p className="line-clamp-2 text-sm text-gray-500">
            {ingredients.map((ingredient) => ingredient.name).join(', ')}
          </p>
        </div>

        {/* Нижняя часть */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[18px] sm:text-[20px]">
            от <b>{price} ₽</b>
          </span>
          <Button variant="default" className="text-sm font-bold sm:text-base">
            <Plus size={18} className="mr-1" />
            Купить
          </Button>
        </div>
      </Link>
    </div>
  );
};
