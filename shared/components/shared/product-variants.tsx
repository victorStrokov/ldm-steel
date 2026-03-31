// "use client";

// import { GroupVariants } from '@/shared/components/shared';
//  import { useVariants } from '@/shared/hooks/use-variants';
// import { ProductItem } from '@prisma/client';
// import React from 'react';

// interface ProductVariantsProps {
// 	items: ProductItem[];
// 	onSizeChange?: (value: string) => void;
// 	onLengthChange?: (value: string) => void;
// 	onTypeChange?: (value: string) => void;
// 	onColorChange?: (value: string) => void;
// 	onShapeChange?: (value: string) => void;
// }

// // ВАЖНО: раскомментируйте строку импорта useVariants, когда хук будет доступен!
// // import { useVariants } from '@/shared/hooks/use-variants';

// export const ProductVariants: React.FC<ProductVariantsProps> = ({
// 	items,
// 	onSizeChange,
// 	onLengthChange,
// 	onTypeChange,
// 	onColorChange,
// 	onShapeChange,
// }) => {
// 	// ВАЖНО: раскомментируйте следующую строку, когда хук будет доступен!
// 	// const {
// 	//   sizeVariants, selectedSize, setSelectedSize,
// 	//   lengthVariants, selectedLength, setSelectedLength,
// 	//   typeVariants, selectedType, setSelectedType,
// 	//   colorVariants, selectedColor, setSelectedColor,
// 	//   shapeVariants, selectedShape, setSelectedShape,
// 	// } = useVariants(items);

// 	// Заглушки для примера адаптивной вёрстки:
// 	const sizeVariants: string[] = [];
// 	const selectedSize = '';
// 	const setSelectedSize = () => {};
// 	const lengthVariants: string[] = [];
// 	const selectedLength = '';
// 	const setSelectedLength = () => {};
// 	const typeVariants: string[] = [];
// 	const selectedType = '';
// 	const setSelectedType = () => {};
// 	const colorVariants: string[] = [];
// 	const selectedColor = '';
// 	const setSelectedColor = () => {};
// 	const shapeVariants: string[] = [];
// 	const selectedShape = '';
// 	const setSelectedShape = () => {};

// 	// ...existing useEffect-ы (раскомментировать при наличии useVariants)

// 	return (
// 		<div className="flex flex-col gap-4 md:gap-6">
// 			{sizeVariants.length > 0 && (
// 				<div>
// 					<p className="text-base md:text-xl font-semibold mb-2 md:mb-3">Размер:</p>
// 					<GroupVariants items={sizeVariants} value={selectedSize} onClick={setSelectedSize} />
// 				</div>
// 			)}
// 			{lengthVariants.length > 0 && (
// 				<div>
// 					<p className="text-base md:text-xl font-semibold mb-2 md:mb-3">Длина профиля:</p>
// 					<GroupVariants items={lengthVariants} value={selectedLength} onClick={setSelectedLength} />
// 				</div>
// 			)}
// 			{typeVariants.length > 0 && (
// 				<div>
// 					<p className="text-base md:text-xl font-semibold mb-2 md:mb-3">Толщина:</p>
// 					<GroupVariants items={typeVariants} value={selectedType} onClick={setSelectedType} />
// 				</div>
// 			)}
// 			{colorVariants.length > 0 && (
// 				<div>
// 					<p className="text-base md:text-xl font-semibold mb-2 md:mb-3">Цвет:</p>
// 					<GroupVariants items={colorVariants} value={selectedColor} onClick={setSelectedColor} />
// 				</div>
// 			)}
// 			{shapeVariants.length > 0 && (
// 				<div>
// 					<p className="text-base md:text-xl font-semibold mb-2 md:mb-3">Форма:</p>
// 					<GroupVariants items={shapeVariants} value={selectedShape} onClick={setSelectedShape} />
// 				</div>
// 			)}
// 		</div>
// 	);
// };
