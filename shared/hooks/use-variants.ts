// // use-variants.ts
// import { useState } from 'react';
// import type { ProductMaterial, VariantField } from '@/@types/product.types';
// import { buildVariants } from '../lib/build-variants';
// import { ProductItem } from '@prisma/client';

// export const useVariants = (items: ProductItem[], material?: ProductMaterial) => {
//   const mat: ProductMaterial = material ?? (items[0]?.material as ProductMaterial) ?? 'STEEL';

//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedLength, setSelectedLength] = useState<string | null>(null);
//   const [selectedType, setSelectedType] = useState<string | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedShape, setSelectedShape] = useState<string | null>(null);

//   const filters: Partial<Record<VariantField, string | null>> = {
//     size: selectedSize,
//     length: selectedLength,
//     thickness: selectedType,
//     color: selectedColor,
//     shape: selectedShape,
//   };

//   const sizeVariants = buildVariants(items, { field: 'size', prefix: 'Размер ', material: mat }, filters);
//   const lengthVariants = buildVariants(items, { field: 'length', material: mat }, filters);
//   const typeVariants = buildVariants(items, { field: 'thickness', prefix: 'Толщина ', material: mat }, filters);
//   const colorVariants = buildVariants(items, { field: 'color', prefix: 'Цвет: ', material: mat }, filters);
//   const shapeVariants = buildVariants(items, { field: 'shape', prefix: 'Форма: ', material: mat }, filters);

//   const resetFilters = () => {
//     setSelectedSize(null);
//     setSelectedLength(null);
//     setSelectedType(null);
//     setSelectedColor(null);
//     setSelectedShape(null);
//   };

//   return {
//     sizeVariants,
//     selectedSize,
//     setSelectedSize,
//     lengthVariants,
//     selectedLength,
//     setSelectedLength,
//     typeVariants,
//     selectedType,
//     setSelectedType,
//     colorVariants,
//     selectedColor,
//     setSelectedColor,
//     shapeVariants,
//     selectedShape,
//     setSelectedShape,
//     resetFilters,
//   };
// };
