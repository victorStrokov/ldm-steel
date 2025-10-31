'use client';

import { GroupVariants } from '@/shared/components/shared';
import { useVariants } from '@/shared/hooks/use-variants';

export const ProductVariants = ({ items }: { items: any[] }) => {
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

  return (
    <>
      {sizeVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Размер:</p>
          <GroupVariants items={sizeVariants} selectedValue={selectedSize} onClick={setSelectedSize} />
        </>
      )}

      {lengthVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Длина профиля:</p>
          <GroupVariants items={lengthVariants} selectedValue={selectedLength} onClick={setSelectedLength} />
        </>
      )}

      {typeVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Толщина:</p>
          <GroupVariants items={typeVariants} selectedValue={selectedType} onClick={setSelectedType} />
        </>
      )}

      {colorVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Цвет:</p>
          <GroupVariants items={colorVariants} selectedValue={selectedColor} onClick={setSelectedColor} />
        </>
      )}

      {shapeVariants.length > 0 && (
        <>
          <p className="text-2xl font-semibold">Форма:</p>
          <GroupVariants items={shapeVariants} selectedValue={selectedShape} onClick={setSelectedShape} />
        </>
      )}
    </>
  );
};
