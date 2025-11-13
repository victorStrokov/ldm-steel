import { ProductItem } from '@prisma/client';
import { Variant } from '../components/shared/group-variants';
import { steelSize, SteelSizes } from '../constants/profile';
// import { SIZE_MAP } from '../constants/profile';

// type Option = { value: number | string; name: string };
// type AvailableOption = Option & { disabled: boolean };

export const getAvailableProductSizes = (size: SteelSizes, items: ProductItem[]): Variant[] => {
  const filteredProductsBySize = items.filter((item) => item.steelSize === size);

  console.log(filteredProductsBySize, steelSize);

  return steelSize?.map((item) => ({
    name: item.name,
    value: item.value,
    disabled: !filteredProductsBySize.some((product) => Number(product.steelSize) === Number(item.value)),
  }));
};
// export const getAvailableProductSizes = (
//   material: ProductItem['material'] | null,
//   items: ProductItem[],
// ): AvailableOption[] => {
//   if (!material) return [];

//   const filteredProductsBySize = items.filter((item) => item.material === material);

//   return (
//     SIZE_MAP[material]?.map((item) => ({
//       name: item.name,
//       value: item.value,
//       disabled: !filteredProductsBySize.some((product) => Number(product.size) === Number(item.value)),
//     })) ?? []
//   );
// };
