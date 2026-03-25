'use client';

import React from 'react';
import { ProductItem } from '@prisma/client';

import { ProductImage } from './product-image';
import { Title } from './title';
import { Button } from '../ui';
import { GroupVariants } from './group-variants';
import { SteelSizes, ProductThickness, productThickness } from '@/shared/constants/profile';
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
  onSubmit,
  onClickImage,
  loading,
}) => {
  const { thickness, size, selectedIngredients, availableSizes, currentItemId, setSize, setThickness, addIngredient } =
    useProductOptions(items);

  // Разобраться с ценообразованием профилей

  const { totalPrice, textDetails } = getProductDetails(thickness, size, items, ingredients, selectedIngredients);

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn('flex flex-1 flex-col gap-6 md:flex-row', className)}>
      {/* Левая часть: картинка */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <div className="flex h-[300px] w-full max-w-[300px] items-center justify-center rounded-lg bg-gray-50">
          <ProductImage
            imageUrl={imageUrl}
            onClickImage={onClickImage}
            imgClassName="object-contain w-full h-full cursor-pointer"
          />
        </div>
      </div>

      {/* Правая часть: текст + варианты + ингредиенты + кнопка */}
      <div className="flex max-h-[80vh] w-full flex-col rounded-lg bg-[#f7f6f5] p-4 md:w-1/2 md:p-6">
        <Title text={name} size="md" className="mb-3 font-extrabold" />
        <p className="mb-4 text-gray-500">{textDetails}</p>
        <div className="mb-4 flex items-center justify-end">
          <button
            // onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-red-600"
          >
            <X size={16} />
            Сбросить фильтры
          </button>
        </div>

        {/* Контент с прокруткой */}
        <div className="flex-1 space-y-5 overflow-y-auto pr-2">
          <GroupVariants
            items={availableSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as SteelSizes)}
          />

          <GroupVariants
            items={productThickness}
            value={String(thickness)}
            onClick={(value) => setThickness(Number(value) as ProductThickness)}
          />

          {/* Ингредиенты */}
          <div className="rounded-md bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">С этим товаром берут</h3>

            <div className="grid grid-cols-3 gap-4">
              {ingredients?.map((ingredient) => (
                <IngredientItem
                  key={ingredient.id}
                  imageUrl={ingredient.images?.[0]?.url ?? '/no-image.png'}
                  name={ingredient.name || undefined}
                  price={ingredient.price}
                  onClick={() => addIngredient(ingredient.id)}
                  active={selectedIngredients.has(ingredient.id)}
                  className="mt-4"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка всегда внизу */}
        <div className="sticky bottom-0 bg-[#f7f6f5] pt-4">
          <Button loading={loading} onClick={handleClickAdd} className="h-[55px] w-full rounded-[18px]">
            Добавить в корзину за {totalPrice} ₽
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
