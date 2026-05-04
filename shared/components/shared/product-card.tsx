import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { Plus } from 'lucide-react';
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { PriceMode, canShowPrices } from '@/shared/lib/catalog-mode';

interface Props {
  id: number;
  name: string;
  shortDesc?: string | null;
  price: number;
  imageUrl: string;
  priceMode?: PriceMode;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({ id, name, shortDesc, price, imageUrl, priceMode, className }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';

  return (
    <div className={cn('flex h-full min-h-80 min-w-0 sm:min-h-85 md:min-h-90', className)}>
      <Link
        href={`/product/${id}`}
        className="flex h-full w-full min-w-0 flex-col justify-between gap-2 rounded-md bg-white px-2 py-2 shadow-sm sm:gap-3 sm:rounded-lg sm:px-4 sm:py-4 dark:bg-neutral-900"
      >
        {/* Верхняя часть */}
        <div>
          <div className="bg-secondary flex aspect-3/2 items-center justify-center rounded-md sm:rounded-lg">
            <img
              src={normalizedImageUrl}
              alt={name}
              className="max-h-32 sm:max-h-40 md:max-h-48 max-w-full cursor-pointer object-contain transition-transform duration-200 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/no-image.png';
              }}
            />
          </div>

          <Title text={name} size="xs" className="mt-2 mb-1 line-clamp-2 font-bold text-base sm:text-lg" />
          {shortDesc ? <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{shortDesc}</p> : null}
        </div>

        {/* Нижняя часть */}
        <div className="mt-3">
          {canShowPrices(effectivePriceMode) ? (
            <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
              <span className="text-base sm:text-lg md:text-xl">
                от <b>{price} ₽</b>
              </span>
              <Button
                variant="default"
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-xs font-bold sm:gap-2 sm:px-4 sm:text-sm md:text-base xl:w-auto"
              >
                <Plus size={18} />
                Запросить цену
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              className="w-full text-xs sm:text-sm md:text-base font-bold flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2"
            >
              <Plus size={18} />
              Запросить цену
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
};
