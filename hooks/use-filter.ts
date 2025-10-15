import { useRouter, useSearchParams } from "next/navigation";
import { useFilterIngredients } from "./use-filter-ingredients";
import { useSet } from "react-use";

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

export const useFilters = () => {
   const router = useRouter();
    const searchParams = useSearchParams() as unknown as Map<
        keyof QueryFilters,
        string
      >;
/* фильтрация ингредиентов */
        const [selectedIngredients, { toggle: toggleIngedients }] = useSet(new Set<string>(searchParams.get("ingredients")?.split(",") || []));
  
/* фильтрация размеров */
   const [sizes, { toggle: togglesizes }] = useSet(
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
        const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: Number(searchParams.get("priceFrom")) || undefined,
    priceTo: Number(searchParams.get("priceTo")) || undefined,
  });
};
