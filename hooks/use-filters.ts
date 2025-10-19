"use client";

import { useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import React from "react";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export interface Filters {
  sizes: Set<string>;
  materialsTypes: Set<string>;
  selectedIngredients: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setMaterialsTypes: (value: string) => void;
  setSizes: (value: string) => void;
  setSelectedIngredients: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams();

  const [selectedIngredients, { toggle: toggleIngredients }] = useSet(
    new Set(searchParams.get("ingredients")?.split(",") ?? [])
  );

  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set(searchParams.get("sizes")?.split(",") ?? [])
  );

  const [materialsTypes, { toggle: toggleMaterialsTypes }] = useSet(
    new Set(searchParams.get("profileType")?.split(",") ?? [])
  );

  const [prices, setPrices] = React.useState<PriceProps>(() => ({
    priceFrom: searchParams.get("priceFrom")
      ? Number(searchParams.get("priceFrom"))
      : undefined,
    priceTo: searchParams.get("priceTo")
      ? Number(searchParams.get("priceTo"))
      : undefined,
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
    prices,
    setPrices: updatePrice,
    setMaterialsTypes: toggleMaterialsTypes,
    setSizes: toggleSizes,
    setSelectedIngredients: toggleIngredients,
  };
};