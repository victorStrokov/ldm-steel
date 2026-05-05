'use client';

import React from 'react';

export interface FilterItem {
  value: string;
  text: string;
}

export interface ProductFilters {
  materials: FilterItem[];
  colors: FilterItem[];
  sizes: FilterItem[];
  lengths: FilterItem[];
  thicknesses: FilterItem[];
}

const EMPTY_FILTERS: ProductFilters = {
  materials: [],
  colors: [],
  sizes: [],
  lengths: [],
  thicknesses: [],
};

export const useProductFilters = (categoryName?: string | undefined) => {
  const [filters, setFilters] = React.useState<ProductFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const url = categoryName
      ? `/api/products/filters?categoryName=${encodeURIComponent(categoryName)}`
      : '/api/products/filters';

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data: ProductFilters) => setFilters(data))
      .catch(() => setFilters(EMPTY_FILTERS))
      .finally(() => setLoading(false));
  }, [categoryName]);

  return { filters, loading };
};
