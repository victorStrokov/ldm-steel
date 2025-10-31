import { useState } from 'react';
import {
  mapProfileSize,
  mapProfileLength,
  mapProfileType,
  mapProfileColor,
  mapProfileShape,
} from '@/shared/constants/profile';
import { buildVariants } from '../lib/build-variants';

export const useVariants = (items: any[]) => {
  const sizeVariants = buildVariants(items, { field: 'size', prefix: 'Размер ', map: mapProfileSize });
  const lengthVariants = buildVariants(items, { field: 'length', map: mapProfileLength });
  const typeVariants = buildVariants(items, { field: 'profileType', prefix: 'Толщина ', map: mapProfileType });
  const colorVariants = buildVariants(items, { field: 'color', prefix: 'Цвет: ', map: mapProfileColor });
  const shapeVariants = buildVariants(items, { field: 'shape', prefix: 'Форма: ', map: mapProfileShape });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  console.log('mapProfileSize:', mapProfileSize);
  console.log('mapProfileLength:', mapProfileLength);
  console.log('sizeVariants:', sizeVariants);
  console.log('lengthVariants:', lengthVariants);
  console.log('sizeVariants:', JSON.stringify(sizeVariants, null, 2));
  return {
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
  };
};
