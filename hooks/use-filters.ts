
import {  useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import React from "react";


interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
  onChangePriceFrom?: (value: number) => void;
  onChangePriceTo?: (value: number) => void;
  className?: string;
}

 interface QueryFilters extends PriceProps {
  ingredients: string;
  sizes: string;
  profileType: string;
}
 export interface Filters {
  sizes: Set<string>;
  materialsTypes: Set<string>;
  selectedIngredients: Set<string>;
  prices: PriceProps;

  // setPrices: (name: keyof PriceProps, value: number) => void;
  // setMaterialsTypes: (value: string) => void;
  // setSizes: (value: string) => void;
  // setIngredients: (value: string) => void;
}

interface ReturnProps extends Filters {
 setPrices: (name: keyof PriceProps, value: number) => void;
 setMaterialsTypes: (value: string) => void;
 setSizes: (value: string) => void;
 setSelectedIngredients: (value: string) => void;
  
}
export const useFilters = (): ReturnProps => {
 
    const searchParams = useSearchParams() as unknown as Map<
        keyof QueryFilters,
        string
      >;
/* фильтрация ингредиентов */
        const [selectedIngredients, { toggle: toggleIngredients }] = useSet(new Set<string>(searchParams.get("ingredients")?.split(",") || []));
  
/* фильтрация размеров */
   const [sizes, { toggle: toggleSizes }] = useSet(
      new Set<string>(
        searchParams.has("sizes") ? searchParams.get("sizes")?.split(",") : []
      )
    );
/* фильтрация типов профиля */
    const [materialsTypes, { toggle: toggleMaterialsTypes }] = useSet(
        new Set<string>(
          searchParams.has("profileType")
            ? searchParams.get("profileType")?.split(",")
            : []
        )
      );
/* фильтрация по цене */
        const [prices, setPrices] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get("priceFrom")) || undefined,
    priceTo: Number(searchParams.get("priceTo")) || undefined,
  });

   const updatePrice = (name: keyof PriceProps, value: number) => {
      setPrices({
        ...prices,
        [name]: value,
      });
    };

    

  return {
    sizes,
    materialsTypes,
    selectedIngredients,
    prices,
    setPrices: updatePrice ,
    setMaterialsTypes: toggleMaterialsTypes,
    setSizes: toggleSizes,
    setSelectedIngredients: toggleIngredients
  }
};
