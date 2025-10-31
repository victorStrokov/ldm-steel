// типы для вариантов
export type VariantField = 'size' | 'length' | 'profileType' | 'color' | 'shape';

export interface VariantConfig {
  field: VariantField; // какое поле берём из items
  prefix?: string; // текст перед значением
  suffix?: string; // текст после значения
  map?: Record<number, string>; // словарь для отображения числовых кодов
}

export const buildVariants = (items: any[], config: VariantConfig) => {
  if (!items) return [];

  const { field, prefix = '', suffix = '', map } = config;

  return Array.from(
    new Map(
      items
        .filter((i) => i[field] !== null && i[field] !== undefined)
        .map((i) => {
          const rawValue = Number(i[field]); // приводим к числу
          const displayValue = map ? map[rawValue] : rawValue;
          return [
            `${field}-${rawValue}`,
            {
              name: `${prefix}${displayValue}${suffix}`,
              value: String(rawValue),
            },
          ] as const;
        }),
    ).values(),
  );
};
