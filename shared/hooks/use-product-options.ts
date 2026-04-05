import { SteelSizes, ProductThickness } from '@/shared/constants/profile';
import { useSet } from 'react-use';
import { Variant } from '../components/shared/group-variants';
import React from 'react';
import { getAvailableProductThickness } from '../lib';
import { ProductItem } from '@prisma/client';

interface ReturnProps {
  size: SteelSizes;
  thickness: ProductThickness;
  selectedIngredients: Set<number>;
  availableSizes: Variant[];
  availableThicknesses: Variant[];
  currentItemId?: number;
  setThickness: (thickness: ProductThickness) => void;
  setSize: (size: SteelSizes) => void;
  addIngredient: (id: number) => void;
}

export const useProductOptions = (items: ProductItem[]): ReturnProps => {
  const defaultItem = items[0];
  const [size, setSize] = React.useState<SteelSizes>((defaultItem?.steelSize as SteelSizes) ?? 1);
  const [thickness, setThickness] = React.useState<ProductThickness>(
    (defaultItem?.productThickness as ProductThickness) ?? 1,
  );
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));
  const availableSizes = getAvailableProductThickness(thickness, items);
  const availableThicknesses = React.useMemo(
    () =>
      [1, 2, 3, 4].map((value) => ({
        name: String({ 1: '1.5', 2: '1.8', 3: '2', 4: '6' }[value as 1 | 2 | 3 | 4]),
        value: String(value),
        disabled: !items.some(
          (item) => item.productThickness === value && (item.steelSize === size || item.steelSize == null),
        ),
      })),
    [items, size],
  );
  const currentItemId = items.find((item) => item.productThickness === thickness && item.steelSize === size)?.id;

  React.useEffect(() => {
    const isAvailableSize = availableSizes?.find((item) => Number(item.value) === Number(size) && !item.disabled);
    const availableSize = availableSizes?.find((item) => !item.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as SteelSizes);
    }
  }, [availableSizes, size]);

  React.useEffect(() => {
    const isAvailableThickness = availableThicknesses.find(
      (item) => Number(item.value) === Number(thickness) && !item.disabled,
    );
    const fallbackItem = items.find((item) => item.steelSize === size) ?? items[0];

    if (!isAvailableThickness && fallbackItem?.productThickness != null) {
      setThickness(fallbackItem.productThickness as ProductThickness);
    }
  }, [availableThicknesses, items, size, thickness]);

  return {
    thickness,
    size,
    availableSizes,
    availableThicknesses,
    selectedIngredients,
    currentItemId,
    setSize,
    setThickness,
    addIngredient,
  };
};
