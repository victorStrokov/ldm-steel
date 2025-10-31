import { ProductWithRelations } from '@/@types/prisma';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildOptions = <T extends Record<string | number, string>>(map: T) =>
  Object.entries(map).map(([value, name]) => ({
    value,
    name,
  }));

/**
 * Проверяет, есть ли у продукта вариации по указанным полям.
 * @param product - продукт с items
 * @param variationKeys - список полей для проверки (по умолчанию: profileType, size, color, length)
 */
export function hasVariations(
  product: ProductWithRelations,
  variationKeys: (keyof NonNullable<ProductWithRelations['items']>[0])[] = ['profileType', 'size', 'color', 'length'],
): boolean {
  if (!product.items || product.items.length <= 1) {
    return false; // один item — вариаций нет
  }

  return variationKeys.some((key) => {
    const values = product.items!.map((item) => item[key]);
    return new Set(values).size > 1; // если больше одного уникального значения → вариация
  });
}
