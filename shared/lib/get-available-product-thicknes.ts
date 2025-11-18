import { ProductItem } from '@prisma/client';
import { Variant } from '../components/shared/group-variants';
import { ProductThickness, steelSize } from '../constants/profile';
// import { SIZE_MAP } from '../constants/profile';

// type Option = { value: number | string; name: string };
// type AvailableOption = Option & { disabled: boolean };

export const getAvailableProductThickness = (thickness: ProductThickness, items: ProductItem[]): Variant[] => {
  // фильтруем товары по толщине
  const filteredProductsByThickness = items.filter((item) => item.productThickness === thickness);

  // строим список размеров
  return steelSize.map((item) => ({
    name: item.name,
    value: item.value,
    disabled: !filteredProductsByThickness.some((product) => product.steelSize === Number(item.value)),
  }));
};
