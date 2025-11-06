'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react';
import { Title } from './title';
import { Button } from '../ui';
import { ProductImage } from './product-image';
import { ProductVariants } from './product-variants';
import { Ingredient, ProductItem } from '@prisma/client';
import { IngredientItem } from './ingredient-item';
import { useSet } from 'react-use';
import { SIZE_MAP, LENGTH_MAP, COLOR_MAP, SHAPE_MAP } from '@/shared/constants/profile';
import getLabel from '@/shared/lib/getLabel';
import { X } from 'lucide-react';
import { useVariants } from '@/shared/hooks/use-variants';

interface Props {
  imageUrl?: string;
  name: string;
  className?: string;
  ingredients?: Ingredient[];
  items: ProductItem[];
  onClickAddCart?: VoidFunction;
}

export const ChooseProfileForm: React.FC<Props> = ({
  imageUrl,
  name,
  className,
  ingredients,
  items,
  onClickAddCart,
}) => {
  const {
    selectedSize: size,
    setSelectedSize: setSize,
    selectedLength: length,
    setSelectedLength: setLength,
    selectedType: type,
    setSelectedType: setType,
    selectedColor: color,
    setSelectedColor: setColor,
    selectedShape: shape,
    setSelectedShape: setShape,
    resetFilters,
  } = useVariants(items);

  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));
  const material = items[0].material;
  const sizeLabel = getLabel(SIZE_MAP, material, size);
  const lengthLabel = getLabel(LENGTH_MAP, material, length);
  const colorLabel = getLabel(COLOR_MAP, material, color);
  const shapeLabel = getLabel(SHAPE_MAP, material, shape);

  // Разобраться с ценообразованием профилей
  const profilePrice =
    items.find((item) => item.profileType === items[0].profileType && item.size === items[0].size)?.price || 0;
  const ingredientsPrice =
    ingredients
      ?.filter((ingredient) => selectedIngredients.has(ingredient.id))
      .reduce((acc, ingredient) => acc + ingredient.price, 0) || 0;
  const totalPrice = profilePrice + ingredientsPrice;

  const textDetails = [
    name,
    lengthLabel ? `длина ${lengthLabel} ` : null,
    sizeLabel ? `размер ${sizeLabel} ` : null,
    type ? `толщина ${type} ` : null,
    colorLabel ? `цвет ${colorLabel}` : null,
    shapeLabel ? `форма ${shapeLabel}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const handleClickAdd = () => {
    onClickAddCart?.();
    console.log({
      size,
      length,
      type,
      color,
      shape,
      ingredients: selectedIngredients,
    });
  };

  // const availableProducts = items.filter((item) => item.size === size && item.profileType === type);
  // const availableProductsSizes = availableProducts.map((item) => ({
  //   name: item.profileType,
  //   value: item.size,
  //   disabled: !availableProducts.some((prod) => prod.size === item.size && prod.profileType === item.profileType),
  // }));

  // console.log(items, availableProducts);

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
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <X size={16} />
            Сбросить фильтры
          </button>
        </div>

        {/* Контент с прокруткой */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5">
          {/* Варианты */}
          <ProductVariants
            items={items}
            onSizeChange={setSize}
            onLengthChange={setLength}
            onTypeChange={setType}
            onColorChange={setColor}
            onShapeChange={setShape}
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
          <Button onClick={handleClickAdd} className="h-[55px] w-full rounded-[18px]">
            Добавить в корзину за {totalPrice} ₽
          </Button>
        </div>
      </div>
    </div>
  );
};
