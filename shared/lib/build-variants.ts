import { ProfileMaterial, VariantConfig, VariantField } from '@/@types/profile.types';
import { getMapByFieldAndMaterial } from '../constants/profile';
import { ProductItem } from '@prisma/client';

type VariantValue = string | number;

// build-variants.ts
export const buildVariants = (
  items: ProductItem[],
  config: Omit<VariantConfig, 'map'> & { material: ProfileMaterial },
  filters: Partial<Record<VariantField, string | number | null>> = {},
) => {
  if (!items || items.length === 0) return [];

  const { field, prefix = '', suffix = '', material } = config;
  const map = getMapByFieldAndMaterial(field, material);

  const allValues: VariantValue[] = Array.from(
    new Set(
      items
        .map((item) => item[field as keyof ProductItem])
        .filter((v) => v !== null && v !== undefined) as VariantValue[],
    ),
  );

  return allValues.map((rawValue) => {
    const numKey = Number(rawValue);
    const strKey = String(rawValue);

    // пробуем по числу, затем по строке, иначе — сырой ключ
    const displayValue = (map?.[numKey] as string | undefined) ?? (map?.[strKey] as string | undefined) ?? strKey;

    const isAvailable = items.some((item) => {
      const itemValue = item[field as keyof ProductItem];
      if (String(itemValue) !== strKey) return false;

      return Object.entries(filters).every(([filterField, filterValue]) => {
        if (filterField === field) return true;
        if (filterValue === null || filterValue === undefined || filterValue === '') return true;

        const itemFilterValue = item[filterField as keyof ProductItem];
        return String(itemFilterValue) === String(filterValue);
      });
    });

    return {
      name: `${prefix}${displayValue}${suffix}`,
      value: strKey,
      disable: false,
      available: isAvailable,
    };
  });
};
