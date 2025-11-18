'use client';

import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import React from 'react';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface Filters {
  sizes: Set<string>;
  length: Set<string>;
  thickness: Set<string>;
  materialsTypes: Set<string>;
  selectedIngredients: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setMaterialsTypes: (value: string) => void;
  setSizes: (value: string) => void;
  setLength: (value: string) => void;
  setThickness: (value: string) => void;
  setSelectedIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams();

  const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
    new Set(searchParams.get('ingredients')?.split(',') ?? []),
  );

  const [sizes, { toggle: toggleSizes }] = useSet(new Set(searchParams.get('steelSize')?.split(',') ?? []));
  const [length, { toggle: toggleLength }] = useSet(new Set(searchParams.get('profileLength')?.split(',') ?? []));
  const [thickness, { toggle: toggleThickness }] = useSet(new Set(searchParams.get('thickness')?.split(',') ?? []));

  const [materialsTypes, { toggle: toggleMaterialsTypes }] = useSet(
    new Set(searchParams.get('material')?.split(',') ?? []),
  );

  const [prices, setPrices] = React.useState<PriceProps>(() => ({
    priceFrom: searchParams.get('priceFrom') ? Number(searchParams.get('priceFrom')) : undefined,
    priceTo: searchParams.get('priceTo') ? Number(searchParams.get('priceTo')) : undefined,
  }));

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    sizes,
    materialsTypes,
    selectedIngredients,
    length,
    thickness,
    prices,
    setPrices: updatePrice,
    setMaterialsTypes: toggleMaterialsTypes,
    setSizes: toggleSizes,
    setThickness: toggleThickness,
    setLength: toggleLength,
    setSelectedIngredients: toggleIngredients,
  };
};
