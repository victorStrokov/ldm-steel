'use client';

import React from 'react';
import { ProductItem } from '@prisma/client';

import { ProductImage } from './product-image';
import { Title } from './title';
import { Button } from '../ui';
import { PriceMode, canShowPrices, shouldShowPriceOnRequestLabel } from '@/shared/lib/catalog-mode';
import { GroupVariants } from './group-variants';
import { SteelSizes, ProductThickness } from '@/shared/constants/profile';
import { IngredientItem } from './ingredient-item';
import { cn } from '@/shared/lib/utils';
import { getProductDetails } from '@/shared/lib/get-product-details';
import { useProductOptions } from '@/shared/hooks';
import { X } from 'lucide-react';
import { IngredientWithImages } from '@/@types/IngredientWithImages';
// import { SIZE_MAP, LENGTH_MAP, COLOR_MAP, SHAPE_MAP, TYPE_MAP } from '@/shared/constants/profile';
// import { getLabel } from '@/shared/lib';
// import { ProductVariants } from './product-variants';

interface Props {
  imageUrl: string;
  name: string;
  items: ProductItem[];
  ingredients: IngredientWithImages[];
  priceMode?: PriceMode;
  loading?: boolean;
  onSubmit: (itemId: number, ingredients: number[]) => void;
  onClickImage?: () => void;
  className?: string;
}

export const ChooseProfileForm: React.FC<Props> = ({
  imageUrl,
  name,
  className,
  ingredients,
  items,
  priceMode,
  onSubmit,
  onClickImage,
  loading,
}) => {
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';
  const {
    thickness,
    size,
    selectedIngredients,
    availableSizes,
    availableThicknesses,
    currentItemId,
    setSize,
    setThickness,
    addIngredient,
  } = useProductOptions(items);

  // Разобраться с ценообразованием профилей

  const { totalPrice, textDetails } = getProductDetails(
    thickness,
    size,
    items,
    ingredients,
    selectedIngredients,
    effectivePriceMode,
  );

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn('flex flex-1 flex-col gap-4 sm:gap-6 md:flex-row', className)}>
      {/* Левая часть: картинка */}
      <div className="flex w-full items-center justify-center md:w-1/2 mb-4 md:mb-0">
        <div className="flex h-55 sm:h-75 w-full max-w-55 sm:max-w-75 items-center justify-center rounded-lg bg-gray-50 p-2 sm:p-0">
          <ProductImage
            imageUrl={imageUrl}
            onClickImage={onClickImage}
            imgClassName="object-contain w-full h-full cursor-pointer"
          />
        </div>
      </div>

      {/* Правая часть: текст + варианты + ингредиенты + кнопка */}
      <div className="flex max-h-[80vh] w-full flex-col rounded-lg bg-[#f7f6f5] p-3 sm:p-4 md:w-1/2 md:p-6">
        <Title text={name} size="md" className="mb-2 sm:mb-3 font-extrabold" />
        <p className="mb-3 sm:mb-4 text-gray-500 text-sm sm:text-base">{textDetails}</p>
        <div className="mb-3 sm:mb-4 flex items-center justify-end">
          <button
            type="button"
            // onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-red-600"
          >
            <X size={16} />
            Сбросить фильтры
          </button>
        </div>

        {/* Контент с прокруткой */}
        <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto pr-1 sm:pr-2">
          <GroupVariants
            items={availableSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as SteelSizes)}
          />

          <GroupVariants
            items={availableThicknesses}
            value={String(thickness)}
            onClick={(value) => setThickness(Number(value) as ProductThickness)}
          />

          {/* Ингредиенты */}
          <div className="rounded-md bg-gray-50 p-3 sm:p-5">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">С этим товаром берут</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {ingredients?.map((ingredient) => (
                <IngredientItem
                  key={ingredient.id}
                  imageUrl={ingredient.images?.[0]?.url ?? '/no-image.png'}
                  name={ingredient.name || undefined}
                  price={ingredient.price}
                  onClick={() => addIngredient(ingredient.id)}
                  active={selectedIngredients.has(ingredient.id)}
                  className="mt-2 sm:mt-4"
                />
              ))}
            </div>
          </div>
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
