// import { ProductMaterial, VariantConfig, VariantField } from '@/@types/product.types';
// // import { getMapByFieldAndMaterial } from '../constants/profile';
// import { ProductItem } from '@prisma/client';
// import { Variant } from '../components/shared/group-variants';

// // type Variant = {
// //   name: string;
// //   value: string;
// //   disabled: boolean;
// // };

// export const buildVariants = (
//   items: ProductItem[],
//   config: Omit<VariantConfig, 'map'> & { material: ProductMaterial },
//   filters: Partial<Record<VariantField, string | number | null>> = {},
// ): Variant[] => {
//   if (!items || items.length === 0) return [];

//   const { field, prefix = '', suffix = '', material } = config;
//   const map = getMapByFieldAndMaterial(field, material);

//   const allValues: (string | number)[] = Array.from(
//     new Set(items.map((item) => item[field as keyof ProductItem]).filter((v) => v != null) as (string | number)[]),
//   );

//   return allValues.map((rawValue) => {
//     const option = map?.find((o) => String(o.value) === String(rawValue));
//     const displayValue = option ? option.name : String(rawValue);

//     console.log({ rawValue, displayValue });

//     const isAvailable = items.some((item) => {
//       if (filters.size && String(item.size) !== String(filters.size)) return false;
//       if (String(item[field as keyof ProductItem]) !== String(rawValue)) return false;
//       return Object.entries(filters).every(([filterField, filterValue]) => {
//         if (filterField === field) return true;
//         if (!filterValue) return true;
//         return String(item[filterField as keyof ProductItem]) === String(filterValue);
//       });
//     });

//     return {
//       name: `${prefix}${displayValue}${suffix}`, // теперь точно строка
//       value: String(rawValue),
//       disabled: !isAvailable,
//     };
//   });
// };
