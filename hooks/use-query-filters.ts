
import React from "react";
import qs from "qs";
import { Filters } from "./use-filters";
import { useRouter } from "next/navigation";

export const useQueryFilters = (filters: Filters) => {
    const router = useRouter();
      React.useEffect(() => {
  const params = {
    ...filters.prices,
    sizes: Array.from(filters.sizes),
    materialsTypes: Array.from(filters.materialsTypes),
    ingredients: Array.from(filters.selectedIngredients),
  };

  const query = qs.stringify(params, {
    skipNulls: true,
    arrayFormat: "comma",
  });

  const newUrl = `?${query}`;
  if (newUrl !== window.location.search) {
    router.replace(newUrl, { scroll: false });
  }
}, [filters, router]);
};