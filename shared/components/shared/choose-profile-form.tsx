'use client';

import React from 'react';
import { ProductItem } from '@prisma/client';

import { ProductImage } from './product-image';
import { Title } from './title';
import { Button } from '../ui';
import { PriceMode, canShowPrices, shouldShowPriceOnRequestLabel } from '@/shared/lib/catalog-mode';
import { GroupVariants } from './group-variants';
import { cn } from '@/shared/lib/utils';
import { useProductOptions } from '@/shared/hooks';
import { X } from 'lucide-react';
// import { SIZE_MAP, LENGTH_MAP, COLOR_MAP, SHAPE_MAP, TYPE_MAP } from '@/shared/constants/profile';
// import { getLabel } from '@/shared/lib';
// import { ProductVariants } from './product-variants';

interface Props {
  imageUrl: string;
  name: string;
  items: ProductItem[];
  priceMode?: PriceMode;
  loading?: boolean;
  onSubmit: (itemId: number) => void;
  onClickImage?: () => void;
  className?: string;
}

export const ChooseProfileForm: React.FC<Props> = ({
  imageUrl,
  name,
  className,
  items,
  priceMode,
  onSubmit,
  onClickImage,
  loading,
}) => {
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';
  const { optionGroups, currentItemId, textDetails, resetFilters } = useProductOptions(items);
  const selectedItem = items.find((item) => item.id === currentItemId);
  const totalPrice = selectedItem?.price ?? 0;

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId);
    }
  };

  return (
    <div className={cn('flex flex-1 flex-col gap-4 sm:gap-6 md:flex-row', className)}>
      {/* Левая часть: картинка + характеристики */}
      <div className="flex w-full flex-col items-center md:w-1/2 mb-4 md:mb-0">
        <div className="flex h-55 sm:h-75 w-full max-w-55 sm:max-w-75 items-center justify-center rounded-lg bg-gray-50 p-2 sm:p-0">
          <ProductImage
            imageUrl={imageUrl}
            onClickImage={onClickImage}
            imgClassName="object-contain w-full h-full cursor-pointer"
          />
        </div>

        {currentItemId && (
          <div className="mt-3 w-full max-w-55 sm:max-w-75 rounded-lg bg-[#f7f6f5] px-3 py-2 text-sm text-gray-700 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Выбранные характеристики</p>
            {optionGroups
              .filter((g) => g.value)
              .map((g) => {
                const selectedOption = g.items.find((i) => i.value === g.value);
                return (
                  <div key={g.key} className="flex justify-between gap-2">
                    <span className="text-gray-500">{g.title}:</span>
                    <span className="font-medium text-right">{selectedOption?.name ?? g.value}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Правая часть: текст + варианты + кнопка */}
      <div className="flex max-h-[80vh] w-full flex-col rounded-lg bg-[#f7f6f5] p-3 sm:p-4 md:w-1/2 md:p-6">
        <Title text={name} size="md" className="mb-2 sm:mb-3 font-extrabold" />
        <p className="mb-3 sm:mb-4 text-gray-500 text-sm sm:text-base">{textDetails}</p>
        <div className="mb-3 sm:mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-red-600"
          >
            <X size={16} />
            Сбросить фильтры
          </button>
        </div>

        {/* Контент с прокруткой */}
        <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto pr-1 sm:pr-2">
          {optionGroups.map((group) => (
            <div key={group.key} className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 sm:text-base">{group.title}</p>
              <GroupVariants items={group.items} value={group.value} onClick={group.onChange} />
            </div>
          ))}
        </div>

        {/* Кнопка всегда внизу на md+ */}
        <div className="pt-3 sm:pt-4 md:sticky md:bottom-0 bg-[#f7f6f5]">
          <Button
            loading={loading}
            disabled={!currentItemId}
            onClick={handleClickAdd}
            className="h-12 sm:h-13.75 w-full rounded-[14px] sm:rounded-[18px] text-base sm:text-lg"
          >
            {canShowPrices(effectivePriceMode)
              ? `Добавить в корзину за ${totalPrice} ₽`
              : shouldShowPriceOnRequestLabel(effectivePriceMode)
                ? 'Добавить в заявку'
                : 'Добавить в заявку'}
          </Button>
        </div>
      </div>
    </div>
  );
};
// const {
//   selectedSize: size,
//   setSelectedSize: setSize,
//   selectedLength: length,
//   setSelectedLength: setLength,
//   selectedType: type,
//   setSelectedType: setType,
//   selectedColor: color,
//   setSelectedColor: setColor,
//   selectedShape: shape,
//   setSelectedShape: setShape,
//   resetFilters,
// } = useVariants(items);

// const material = items[0]?.material ?? null;
// const sizeLabel = material ? getLabel(SIZE_MAP, material, size) : null;
// const lengthLabel = material ? getLabel(LENGTH_MAP, material, length) : null;
// const typeLabel = material ? getLabel(TYPE_MAP, material, type) : null;
// const colorLabel = material ? getLabel(COLOR_MAP, material, color) : null;
// const shapeLabel = material ? getLabel(SHAPE_MAP, material, shape) : null;

/* Варианты */

/* <ProductVariants
            items={items}
            onSizeChange={setSize}
            onLengthChange={setLength}
            onTypeChange={setType}
            onColorChange={setColor}
            onShapeChange={setShape}
          /> */
// const textDetails = [
//   name,
//   // lengthLabel ? `длина ${lengthLabel} ` : null,
//   // sizeLabel ? `размер ${sizeLabel} ` : null,
//   // typeLabel ? `толщина ${typeLabel}` : null,
//   // colorLabel ? `цвет ${colorLabel}` : null,
//   // shapeLabel ? `форма ${shapeLabel}` : null,
// ]
//   .filter(Boolean)
//   .join(', ');
