export const mapSteelSize = {
  1: '15×30',
  2: '30×28',
  3: '31×34',
  4: '35×20',
  5: '40×40',
  6: '40×50',
  7: '50×50',
} as const;
export const mapPvcSize = {
  1: '60',
  2: '70',
  3: '80',
  4: '90',
  5: '100',
  6: '6.5',
  7: '30×70',
};
export const mapAluminiumSize: Record<number, string> = {
  // тут пока пусто
};
export const mapProductSize = {
  1: '300',
  2: '500',
  3: '600',
  4: '32х5',
  5: '40х5',
  6: '34х6',
  7: '38х6',
};

export const mapProductLength = {
  1: '2',
  2: '6',
  3: '6.5',
};

export const mapProductThickness = {
  1: '1.5',
  2: '1.8',
  3: '2',
  4: '6',
} as const;

export const mapProductColor = {
  9016: 'Белый',
  2: 'Коричневый',
  3: 'Антрацит',
  4: 'Черный',
};

export const mapProductShape = {
  1: 'П-образный',
  2: 'Замкнутый',
};

export const mapProductMaterial = {
  STEEL: 'Сталь',
  PVC: 'ПВХ',
  ALUMINIUM: 'Алюминий',
  PLASTIC: 'Пластик',
  RUBBER: 'Резина',
};

// export const mapMaterialEnumToLabel: Record<ProductMaterial, string> = {
//   STEEL: 'Сталь',
//   PVC: 'ПВХ',
//   ALUMINIUM: 'Алюминий',
//   PLASTIC: 'Пластик',
//   RUBBER: 'Резина',
// };

export const steelSize = Object.entries(mapSteelSize).map(([value, name]) => ({
  name,
  value,
}));

export const pvcSize = Object.entries(mapPvcSize).map(([value, name]) => ({
  name,
  value,
}));

export const productLength = Object.entries(mapProductLength).map(([value, name]) => ({
  name,
  value,
}));

export const productColor = Object.entries(mapProductColor).map(([value, name]) => ({
  name,
  value,
}));

export const productShape = Object.entries(mapProductShape).map(([value, name]) => ({
  name,
  value,
}));

export const productThickness = Object.entries(mapProductThickness).map(([value, name]) => ({
  name,
  value,
}));

export const productSizes = Object.entries(mapProductSize).map(([value, name]) => ({
  name,
  value,
}));

export const productMaterials = Object.entries(mapProductMaterial).map(([value, name]) => ({
  name,
  value,
}));

export type SteelSizes = keyof typeof mapSteelSize;
export type PvcSizes = keyof typeof mapPvcSize;
export type ProductSizes = keyof typeof mapProductSize;
export type ProductLength = keyof typeof mapProductLength;
export type ProductColor = keyof typeof mapProductColor;
export type ProductShape = keyof typeof mapProductShape;
export type ProductThickness = keyof typeof mapProductThickness;
export type ProductMaterial = keyof typeof mapProductMaterial;

// import { ProductMaterial, VariantField } from '@/@types/product.types';

// // Размеры
// type Option = { value: number | string; name: string };

// // Размеры
// export const SIZE_MAP: Record<ProductMaterial, Option[]> = {
//   STEEL: [
//     { value: 1, name: '30×28 мм' },
//     { value: 2, name: '15×30 мм' },
//     { value: 3, name: '31×34 мм' },
//     { value: 4, name: '35×20 мм' },
//     { value: 5, name: '40×40 мм' },
//     { value: 6, name: '40×50 мм' },
//   ],
//   PVC: [
//     { value: 1, name: '6.5 мм' },
//     { value: 2, name: '60 мм' },
//     { value: 3, name: '70 мм' },
//     { value: 4, name: '30×70 мм' },
//   ],
//   ALUMINIUM: [
//     { value: 1, name: '40×40 мм' },
//     { value: 2, name: '60×40 мм' },
//     { value: 3, name: '60×60 мм' },
//   ],
// };

// // Длины
// export const LENGTH_MAP: Record<ProductMaterial, Option[]> = {
//   STEEL: [
//     { value: 1, name: '2 м' },
//     { value: 2, name: '6 м' },
//   ],
//   PVC: [
//     { value: 1, name: '6 м' },
//     { value: 2, name: '6.5 м' },
//   ],
//   ALUMINIUM: [
//     { value: 1, name: '6 м' },
//     { value: 2, name: '6.5 м' },
//   ],
// };

// // Толщина
// export const TYPE_MAP: Record<ProductMaterial, Option[]> = {
//   STEEL: [
//     { value: 1, name: '1.5 мм' },
//     { value: 2, name: '2 мм' },
//     { value: 3, name: '6 мм' },
//   ],
//   PVC: [],
//   ALUMINIUM: [],
// };

// // Цвета
// export const COLOR_MAP: Record<ProductMaterial, Option[]> = {
//   STEEL: [{ value: 1, name: 'Оцинкованный' }],
//   PVC: [
//     { value: 1, name: 'Белый' },
//     { value: 2, name: 'Коричневый' },
//     { value: 3, name: 'Антрацит' },
//   ],
//   ALUMINIUM: [
//     { value: 1, name: 'Белый' },
//     { value: 2, name: 'Коричневый' },
//     { value: 3, name: 'Антрацит' },
//   ],
// };

// // Форма
// export const SHAPE_MAP: Record<ProductMaterial, Option[]> = {
//   STEEL: [
//     { value: 1, name: 'П‑образный' },
//     { value: 2, name: 'Замкнутый' },
//     { value: 3, name: 'Другой' },
//   ],
//   PVC: [],
//   ALUMINIUM: [],
// };

// export const getMapByFieldAndMaterial = (field: VariantField, material: ProductMaterial): Option[] => {
//   switch (field) {
//     case 'size':
//       return SIZE_MAP[material];
//     case 'length':
//       return LENGTH_MAP[material];
//     case 'profileType':
//       return TYPE_MAP[material];
//     case 'color':
//       return COLOR_MAP[material];
//     case 'shape':
//       return SHAPE_MAP[material];
//     default:
//       return [];
//   }
// };
