import { ProductItem } from '@prisma/client';
import { Variant } from '../components/shared/group-variants';
// import { SIZE_MAP } from '../constants/profile';

// type Option = { value: number | string; name: string };
// type AvailableOption = Option & { disabled: boolean };

export const getAvailableProductThickness = (thickness: string, items: ProductItem[]): Variant[] => {
  // фильтруем товары по display-значению толщины
  const filteredProductsByThickness = items.filter((item) => item.thicknessDisplay === thickness);

  // размеры берём из sizeDisplay
  const sizes = Array.from(new Set(items.map((item) => item.sizeDisplay).filter(Boolean)));

  return sizes.map((size) => ({
    name: size as string,
    value: size as string,
    disabled: !filteredProductsByThickness.some((product) => product.sizeDisplay === size),
  }));
};
