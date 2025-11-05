import { ProfileMaterial, VariantConfig, VariantField } from '@/@types/profile.types';
import { getMapByFieldAndMaterial } from '../constants/profile';
import { ProductItem } from '@prisma/client';

type VariantValue = number | null;

// build-variants.ts
export const buildVariants = (
  items: ProductItem[],
  config: Omit<VariantConfig, 'map'> & { material: ProfileMaterial },
  filters: Partial<Record<VariantField, string | number | null>> = {},
) => {
  if (!items || items.length === 0) return [];

  const { field, prefix = '', suffix = '', material } = config;
  const map = getMapByFieldAndMaterial(field, material);

  // Собираем уникальные значения по полю
  const allValues: VariantValue[] = Array.from(
    new Set(items.map((item) => item[field as keyof ProductItem] as VariantValue).filter((v) => v !== null)),
  );

  return allValues.map((rawValue) => {
    const displayValue = map?.[rawValue as number] ?? String(rawValue);

    const isAvailable = items.some((item) => {
      const itemValue = item[field as keyof ProductItem];
      if (String(itemValue) !== String(rawValue)) return false;

      return Object.entries(filters).every(([filterField, filterValue]) => {
        if (filterField === field) return true;
        if (filterValue === null || filterValue === undefined || filterValue === '') return true;

        const itemFilterValue = item[filterField as keyof ProductItem];
        return String(itemFilterValue) === String(filterValue);
      });
    });

    return {
      name: `${prefix}${displayValue}${suffix}`,
      value: String(rawValue),
      disable: false,
      available: isAvailable,
    };
  });
};
