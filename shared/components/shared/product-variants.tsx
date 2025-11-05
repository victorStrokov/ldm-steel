'use client';

import { GroupVariants } from '@/shared/components/shared';
import { useVariants } from '@/shared/hooks/use-variants';
import { ProductItem } from '@prisma/client';

export const ProductVariants = ({ items }: { items: ProductItem[] }) => {
  const {
    sizeVariants,
    selectedSize,
    setSelectedSize,
    lengthVariants,
    selectedLength,
    setSelectedLength,
    typeVariants,
    selectedType,
    setSelectedType,
    colorVariants,
    selectedColor,
    setSelectedColor,
    shapeVariants,
    selectedShape,
    setSelectedShape,
  } = useVariants(items);

  console.log(items);

  return (
    <>
      {sizeVariants.length > 0 && (
        <>
          <p className="flex flex-col  text-2xl font-semibold">Размер:</p>
          <GroupVariants items={sizeVariants} value={selectedSize} onClick={setSelectedSize} />
        </>
      )}

      {lengthVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Длина профиля:</p>
          <GroupVariants items={lengthVariants} value={selectedLength} onClick={setSelectedLength} />
        </>
      )}

      {typeVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Толщина:</p>
          <GroupVariants items={typeVariants} value={selectedType} onClick={setSelectedType} />
        </>
      )}

      {colorVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Цвет:</p>
          <GroupVariants items={colorVariants} value={selectedColor} onClick={setSelectedColor} />
        </>
      )}

      {shapeVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Форма:</p>
          <GroupVariants items={shapeVariants} value={selectedShape} onClick={setSelectedShape} />
        </>
      )}
    </>
  );
};
