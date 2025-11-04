import { BaseMaterial } from './base.types';

// материалы, допустимые для профилей
export type ProfileMaterial = Extract<BaseMaterial, 'STEEL' | 'PVC' | 'ALUMINIUM'>;

// поля, по которым строятся варианты профиля
export type VariantField = 'size' | 'length' | 'profileType' | 'color' | 'shape';

// конфигурация для функции buildVariants
export interface VariantConfig {
  field: VariantField; // какое поле берём из items
  prefix?: string; // текст перед значением (например "Размер ")
  suffix?: string; // текст после значения (например "мм")
  map?: Record<number | string, string>; // словарь для отображения (например {70: "70 мм"})
}
