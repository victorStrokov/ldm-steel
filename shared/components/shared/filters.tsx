'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Title } from './title';
// import { Input } from '../ui';
// import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useQueryFilters, useFilters } from '@/shared/hooks';
import { useProductFilters } from '@/shared/hooks/use-product-filters';
import { useCategoryStore } from '@/shared/store/category';
// import { SortPopup } from './sort-popup';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const filters = useFilters();
  const activeCategoryKey = useCategoryStore((state) => state.activeKey);
  const { filters: dynamicFilters, loading: filtersLoading } = useProductFilters(activeCategoryKey);

  useQueryFilters(filters);

  // const updatePrices = (prices: number[]) => {
  //   filters.setPrices('priceFrom', prices[0]);
  //   filters.setPrices('priceTo', prices[1]);
  // };

  // Note: когда список свёрнут и есть выбранные элементы — нужно выводить их
  // над кнопкой «Показать все» в CheckboxFiltersGroup. Отложено до v0.2.0.

  return (
    <div className={cn(className, 'flex flex-col gap-3 sm:gap-5 px-2 sm:px-4')}>
      {/* <SortPopup /> */}

      <Title text="Фильтрация" size="sm" className="mb-2 font-bold text-base sm:text-lg" />
      {/* верхние чекбоксы */}

      <div className="flex flex-col gap-3 sm:gap-4">
        <CheckboxFiltersGroup
          name="materials"
          className="mt-3 sm:mt-5"
          title="Материалы"
          onClickCheckbox={filters.setMaterialsTypes}
          selected={filters.materialsTypes}
          limit={5}
          loading={filtersLoading}
          searchInputPlaceholder="Поиск материалов..."
          items={dynamicFilters.materials.map((item) => ({ text: item.text, value: item.value }))}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <CheckboxFiltersGroup
          name="colors"
          className="mt-3 sm:mt-5"
          title="Цвет"
          onClickCheckbox={filters.setColors}
          selected={filters.colors}
          limit={5}
          loading={filtersLoading}
          searchInputPlaceholder="Поиск цвета..."
          items={dynamicFilters.colors.map((item) => ({ text: item.text, value: item.value }))}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <CheckboxFiltersGroup
          name="sizes"
          className="mt-3 sm:mt-5"
          title="Размеры"
          onClickCheckbox={filters.setSizes}
          selected={filters.sizes}
          limit={5}
          loading={filtersLoading}
          searchInputPlaceholder="Поиск размеров..."
          items={dynamicFilters.sizes.map((item) => ({ text: item.text, value: item.value }))}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <CheckboxFiltersGroup
          name="lengths"
          className="mt-3 sm:mt-5"
          title="Длина"
          onClickCheckbox={filters.setLength}
          selected={filters.length}
          limit={5}
          loading={filtersLoading}
          searchInputPlaceholder="Поиск длины..."
          items={dynamicFilters.lengths.map((item) => ({ text: item.text, value: item.value }))}
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        <CheckboxFiltersGroup
          name="thicknesses"
          className="mt-3 sm:mt-5"
          title="Толщина"
          onClickCheckbox={filters.setThickness}
          selected={filters.thickness}
          limit={5}
          loading={filtersLoading}
          searchInputPlaceholder="Поиск толщины..."
          items={dynamicFilters.thicknesses.map((item) => ({ text: item.text, value: item.value }))}
        />
      </div>
      {/* фильтр цен */}
      {/* <div className="mt-4 sm:mt-5 border-y border-y-neutral-100 py-4 sm:py-6 pb-5 sm:pb-7">
        <p className="mb-2 sm:mb-3 font-bold text-sm sm:text-base">Цена от и до</p>
        <div className="mb-4 sm:mb-5 flex gap-2 sm:gap-3">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={300000}
            value={filters.prices.priceFrom ?? 0}
            onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={0}
            max={300000}
            placeholder="300000"
            value={filters.prices.priceTo ?? 300000}
            onChange={(e) => filters.setPrices('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={300000}
          step={10}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 300000]}
          onValueChange={updatePrices}
        />
      </div> */}
    </div>
  );
};
