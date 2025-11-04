import { ProfileMaterial, VariantConfig, VariantField } from '@/@types/profile.types';
import { getMapByFieldAndMaterial } from '../constants/profile';

// build-variants.ts
export const buildVariants = (
  items: any[],
  config: Omit<VariantConfig, 'map'> & { material: ProfileMaterial },
  filters: Partial<Record<VariantField, string | number | null>> = {},
) => {
  if (!items) return [];
  const { field, prefix = '', suffix = '', material } = config;

  const map = getMapByFieldAndMaterial(field, material);

  const allValues = Array.from(new Set(items.map((i) => i[field]).filter((v) => v !== null && v !== undefined)));

  return allValues.map((rawValue) => {
    const displayValue = map?.[rawValue as any] ?? String(rawValue);

    const isAvailable = items.some((item) => {
      if (String(item[field]) !== String(rawValue)) return false;
      return Object.entries(filters).every(([f, v]) => {
        if (f === field) return true; // игнорируем текущий фильтр
        if (v === null || v === undefined || v === '') return true;
        return String(item[f]) === String(v);
      });
    });
    console.log(field, rawValue, '=>', isAvailable);
    return {
      name: `${prefix}${displayValue}${suffix}`,
      value: String(rawValue),
      disable: false, // всегда кликабельно
      available: isAvailable, // для подсветки
    };
  });
};
