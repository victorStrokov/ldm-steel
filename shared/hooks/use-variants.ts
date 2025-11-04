// use-variants.ts
import { useState } from 'react';
import type { ProfileMaterial, VariantField } from '@/@types/profile.types';
import { buildVariants } from '../lib/build-variants';

export const useVariants = (items: any[], material?: ProfileMaterial) => {
  const mat: ProfileMaterial = material ?? (items[0]?.material as ProfileMaterial) ?? 'STEEL';

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const filters: Partial<Record<VariantField, string | null>> = {
    size: selectedSize,
    length: selectedLength,
    profileType: selectedType,
    color: selectedColor,
    shape: selectedShape,
  };

  const sizeVariants = buildVariants(items, { field: 'size', prefix: 'Размер ', material: mat }, filters);
  const lengthVariants = buildVariants(items, { field: 'length', material: mat }, filters);
  const typeVariants = buildVariants(items, { field: 'profileType', prefix: 'Толщина ', material: mat }, filters);
  const colorVariants = buildVariants(items, { field: 'color', prefix: 'Цвет: ', material: mat }, filters);
  const shapeVariants = buildVariants(items, { field: 'shape', prefix: 'Форма: ', material: mat }, filters);

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
