import { SteelSizes, ProductThickness } from '@/shared/constants/profile';
import { useSet } from 'react-use';
import { Variant } from '../components/shared/group-variants';
import React from 'react';
import { getAvailableProductSizes } from '../lib';
import { ProductItem } from '@prisma/client';

interface ReturnProps {
  size: SteelSizes;
  thickness: ProductThickness;
  selectedIngredients: Set<number>;
  availableSizes: Variant[];
  currentItemId?: number;
  setThickness: (thickness: ProductThickness) => void;
  setSize: (size: SteelSizes) => void;
  addIngredient: (id: number) => void;
}

export const useProductOptions = (items: ProductItem[]): ReturnProps => {
  const [size, setSize] = React.useState<SteelSizes>(2);
  const [thickness, setThickness] = React.useState<ProductThickness>(4);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(new Set<number>([]));

  const availableSizes = getAvailableProductSizes(size, items);

  const currentItemId = items.find((item) => item.steelSize === size && item.productThickness === thickness)?.id;

  React.useEffect(() => {
    const isAvailableSize = availableSizes?.find((item) => Number(item.value) === Number(size) && !item.disabled);
    const availableSize = availableSizes?.find((item) => !item.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as SteelSizes);
    }
  }, [availableSizes, size, thickness]);

  return {
    thickness,
    size,
    availableSizes,
    selectedIngredients,
    currentItemId,
    setSize,
    setThickness,
    addIngredient,
  };
};
