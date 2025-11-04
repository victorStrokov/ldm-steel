import { ProfileMaterial, VariantField } from '@/@types/profile.types';

// Размеры
export const SIZE_MAP: Record<ProfileMaterial, Record<number, string>> = {
  STEEL: {
    1: '30×28',
    2: '15×30',
    3: '31×34',
    4: '35×20',
    5: '40×40',
    6: '40×50',
  },
  PVC: {
    1: '6.5 мм',
    2: '60 мм',
    3: '70 мм',
    4: '30×70 мм',
  },
  ALUMINIUM: {
    1: '40×40',
    2: '60×40',
    3: '60×60',
  },
};

// Длины
export const LENGTH_MAP: Record<ProfileMaterial, Record<number, string>> = {
  STEEL: { 1: '2 м', 2: '6 м' },
  PVC: { 1: '6 м', 2: '6.5 м' },
  ALUMINIUM: { 1: '6 м', 2: '6.5 м' },
};

// Толщина (условные коды)
export const TYPE_MAP: Record<ProfileMaterial, Record<number, string>> = {
  STEEL: { 1: '1.5 мм', 2: '2 мм', 3: '6 мм' },
  PVC: {},
  ALUMINIUM: {},
};

// Цвета
export const COLOR_MAP: Record<ProfileMaterial, Record<string, string>> = {
  STEEL: { 1: 'Оцинкованный' },
  PVC: { 1: 'Белый', 2: 'Коричневый', 3: 'Антрацит' },
  ALUMINIUM: { 1: 'Белый', 2: 'Коричневый', 3: 'Антрацит' },
};

// Форма
export const SHAPE_MAP: Record<ProfileMaterial, Record<string, string>> = {
  STEEL: { 1: 'П‑образный', 2: 'Замкнутый', 3: 'Другой' },
  PVC: {},
  ALUMINIUM: {},
};

export const getMapByFieldAndMaterial = (
  field: VariantField,
  material: ProfileMaterial,
): Record<number | string, string> => {
  switch (field) {
    case 'size':
      return SIZE_MAP[material];
    case 'length':
      return LENGTH_MAP[material];
    case 'profileType':
      return TYPE_MAP[material];
    case 'color':
      return COLOR_MAP[material];
    case 'shape':
      return SHAPE_MAP[material];
    default:
      return {};
  }
};
