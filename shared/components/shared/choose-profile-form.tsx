'use client';

import React from 'react';
import { Ingredient, ProductItem } from '@prisma/client';

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
// import { SIZE_MAP, LENGTH_MAP, COLOR_MAP, SHAPE_MAP, TYPE_MAP } from '@/shared/constants/profile';
// import { getLabel } from '@/shared/lib';
// import { ProductVariants } from './product-variants';

interface Props {
  imageUrl: string;
  name: string;
  items: ProductItem[];
  ingredients: Ingredient[];
  loading?: boolean;
  className?: string;
  onClickAddCart?: VoidFunction;
}

export const ChooseProfileForm: React.FC<Props> = ({
  imageUrl,
  name,
  className,
  ingredients,
  items,
  onClickAddCart,
  loading,
}) => {
  const { thickness, size, selectedIngredients, availableSizes, currentItemId, setSize, setThickness, addIngredient } =
    useProductOptions(items);

  // Разобраться с ценообразованием профилей

  const { totalPrice, textDetails } = getProductDetails(thickness, size, items, ingredients, selectedIngredients);

  const handleClickAdd = () => {
    onClickAddCart?.();
    console.log({
      items,
      size,
      thickness,
      ingredients: selectedIngredients,
      currentItemId,
      setThickness,
    });
  };

  return (
    <div className={cn('flex flex-col md:flex-row flex-1 gap-6', className)}>
      {/* Левая часть: картинка */}
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <ProductImage imageUrl={imageUrl} className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      {/* Правая часть: текст + варианты + ингредиенты + кнопка */}
      <div className="w-full md:w-1/2 bg-[#f7f6f5] rounded-lg p-4 md:p-6 flex flex-col max-h-[80vh]">
        <Title text={name} size="md" className="font-extrabold mb-3" />
        <p className="text-gray-500 mb-4">{textDetails}</p>
        <div className="flex items-center justify-end mb-4">
          <button
            // onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <X size={16} />
            Сбросить фильтры
          </button>
        </div>

        {/* Контент с прокруткой */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
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
          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="text-lg font-semibold mb-4">С этим товаром берут</h3>

            <div className="grid grid-cols-3 gap-4">
              {ingredients?.map((ingredient) => (
                <IngredientItem
                  key={ingredient.id}
                  imageUrl={ingredient.imageUrl || undefined}
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
