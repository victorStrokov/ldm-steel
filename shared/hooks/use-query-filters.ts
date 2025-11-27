'use client';

import React from 'react';
import qs from 'qs';
import { Filters } from './use-filters';
import { useRouter, useSearchParams } from 'next/navigation';

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        ...filters.prices,
        sizes: Array.from(filters.sizes),
        materialsTypes: Array.from(filters.materialsTypes),
        length: Array.from(filters.length),
        ingredients: Array.from(filters.selectedIngredients),
      };

      const query = qs.stringify(params, {
        skipNulls: true,
        arrayFormat: 'comma',
      });

      const newUrl = `?${query}`;
      if (newUrl !== `?${currentQuery}`) {
        router.replace(newUrl, { scroll: false });
      }
    }
    isMounted.current = true;
  }, [filters, currentQuery, router]);
};
