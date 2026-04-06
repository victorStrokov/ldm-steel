import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { PriceMode, canShowPrices, shouldShowPriceOnRequestLabel } from '@/shared/lib/catalog-mode';

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  priceMode?: PriceMode;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, price, imageUrl, priceMode, className }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';

  return (
    <div className={cn('flex h-full min-h-80 sm:min-h-85 md:min-h-90', className)}>
      <Link
        href={`/product/${id}`}
        className="flex h-full flex-col justify-between rounded-md sm:rounded-lg bg-white dark:bg-neutral-900 shadow-sm px-2 py-2 sm:px-4 sm:py-4 gap-2 sm:gap-3"
      >
        {/* Верхняя часть */}
        <div>
          <div className="bg-secondary flex aspect-3/2 items-center justify-center rounded-md sm:rounded-lg">
            <img
              src={normalizedImageUrl}
              alt={name}
              className="max-h-32 sm:max-h-40 md:max-h-48 max-w-full cursor-pointer object-contain transition-transform duration-200 hover:scale-105"
            />
          </div>

          <Title text={name} size="xs" className="mt-2 mb-1 line-clamp-2 font-bold text-base sm:text-lg" />
        </div>

        {/* Нижняя часть */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {canShowPrices(effectivePriceMode) ? (
            <span className="text-base sm:text-lg md:text-xl">
              от <b>{price} ₽</b>
            </span>
          ) : shouldShowPriceOnRequestLabel(effectivePriceMode) ? (
            <span className="text-sm sm:text-base font-semibold text-gray-700">Цена по запросу</span>
          ) : (
            <span className="text-sm sm:text-base font-semibold text-gray-700">Уточните у менеджера</span>
          )}
          <Button
            variant="default"
            className="text-xs sm:text-sm md:text-base font-bold flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
          >
            <Plus size={18} className="" />
            Запросить цену
          </Button>
        </div>
      </Link>
    </div>
  );
};
