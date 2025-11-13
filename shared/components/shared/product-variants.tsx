// 'use client';

// import { GroupVariants } from '@/shared/components/shared';
// // import { useVariants } from '@/shared/hooks/use-variants';
// import { ProductItem } from '@prisma/client';
// import React from 'react';

// interface ProductVariantsProps {
//   items: ProductItem[];
//   onSizeChange?: (value: string) => void;
//   onLengthChange?: (value: string) => void;
//   onTypeChange?: (value: string) => void;
//   onColorChange?: (value: string) => void;
//   onShapeChange?: (value: string) => void;
// }

// export const ProductVariants: React.FC<ProductVariantsProps> = ({
//   items,
//   onSizeChange,
//   onLengthChange,
//   onTypeChange,
//   onColorChange,
//   onShapeChange,
// }) => {
//   const {
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
//   } = useVariants(items);

//   React.useEffect(() => {
//     if (selectedSize) onSizeChange?.(selectedSize);
//   }, [selectedSize, onSizeChange]);

//   React.useEffect(() => {
//     if (selectedLength) onLengthChange?.(selectedLength);
//   }, [selectedLength, onLengthChange]);

//   React.useEffect(() => {
//     if (selectedType) onTypeChange?.(selectedType);
//   }, [selectedType, onTypeChange]);

//   React.useEffect(() => {
//     if (selectedColor) onColorChange?.(selectedColor);
//   }, [selectedColor, onColorChange]);

//   React.useEffect(() => {
//     if (selectedShape) onShapeChange?.(selectedShape);
//   }, [selectedShape, onShapeChange]);

//   return (
//     <>
//       {sizeVariants.length > 0 && (
//         <>
//           <p className="flex flex-col  text-2xl font-semibold">Размер:</p>
//           <GroupVariants items={sizeVariants} value={selectedSize} onClick={setSelectedSize} />
//         </>
//       )}

//       {lengthVariants.length > 0 && (
//         <>
//           <p className="text-2xl font-semibold">Длина профиля:</p>
//           <GroupVariants items={lengthVariants} value={selectedLength} onClick={setSelectedLength} />
//         </>
//       )}

//       {typeVariants.length > 0 && (
//         <>
//           <p className="text-2xl font-semibold">Толщина:</p>
//           <GroupVariants items={typeVariants} value={selectedType} onClick={setSelectedType} />
//         </>
//       )}

//       {colorVariants.length > 0 && (
//         <>
//           <p className="text-2xl font-semibold">Цвет:</p>
//           <GroupVariants items={colorVariants} value={selectedColor} onClick={setSelectedColor} />
//         </>
//       )}

//       {shapeVariants.length > 0 && (
//         <>
//           <p className="text-2xl font-semibold">Форма:</p>
//           <GroupVariants items={shapeVariants} value={selectedShape} onClick={setSelectedShape} />
//         </>
//       )}
//     </>
//   );
// };
