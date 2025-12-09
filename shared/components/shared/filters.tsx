'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useQueryFilters, useFilters, useIngredients } from '@/shared/hooks';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useIngredients();
  const filters = useFilters();

  useQueryFilters(filters);

  const items = ingredients.map((item) => ({ value: String(item.id), text: item.name }));

  const updatePrices = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices('priceTo', prices[1]);
  };

  // TODO: добавить ВЫВОД ВЫБРАННЫХ ЧЕКБОКСОВ НА ВЕРХ ЕСЛИ СПИСОК СКРЫТ И ТАМ ЕСТЬ ВЫБРАННЫЕ

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb font-bold" />
      {/* верхние чекбоксы */}

      <div className="flex flex-col gap-4">
        <CheckboxFiltersGroup
          name="materials"
          className="mt-5"
          title="Материалы"
          onClickCheckbox={filters.setMaterialsTypes}
          selected={filters.materialsTypes}
          limit={5}
          loading={false}
          searchInputPlaceholder="Поиск материалов..."
          items={[
            { text: 'Армирование', value: '1' },
            { text: 'Алюминий', value: '2' },
            { text: 'Резина', value: '3' },
            { text: 'Пластик', value: '4' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-4">
        <CheckboxFiltersGroup
          name="sizes"
          className="mt-5"
          title="Размеры"
          onClickCheckbox={filters.setSizes}
          selected={filters.sizes}
          limit={5}
          loading={false}
          searchInputPlaceholder="Поиск размеров..."
          items={[
            { text: '15×30', value: '1' },
            { text: '30×28', value: '2' },
            { text: '31×34', value: '3' },
            { text: '35×20', value: '4' },
            { text: '40×40', value: '5' },
            { text: '40×50', value: '6' },
            { text: '50×50', value: '7' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-4">
        <CheckboxFiltersGroup
          name="lengths"
          className="mt-5"
          title="Длинна"
          onClickCheckbox={filters.setLength}
          selected={filters.length}
          limit={5}
          loading={false}
          searchInputPlaceholder="Поиск длинны..."
          items={[
            { text: '2 м', value: '1' },
            { text: '6 м', value: '2' },
            { text: '6.5 м', value: '3' },
          ]}
        />
      </div>
      {/* фильтр цен */}
      <div className="mt-5  border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до</p>
        <div className="flex gap-3 mb-5">
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
      </div>
      <CheckboxFiltersGroup
        loading={loading}
        title="Комплектующие"
        name="ingredients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        onClickCheckbox={filters.setSelectedIngredients}
        searchInputPlaceholder="Поиск комплектующих..."
        selected={filters.selectedIngredients}
      />
    </div>
  );
};
