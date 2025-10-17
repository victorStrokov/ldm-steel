"use client";

import React from "react";
import { Title } from "./title";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useQueryFilters,useFilters,useIngredients } from "@/hooks";




interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {

  const {ingredients, loading}= useIngredients();
  const filters = useFilters();

  useQueryFilters(filters);

  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: String(item.name),
  }));

  const updatePrice = (prices: number[]) => { 
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  }



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
            { text: "Сталь", value: "steel" },
            { text: "Алюминий", value: "aluminum" },
            { text: "ПВХ", value: "plastic" },
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
            { text: "1.2", value: "1.2" },
            { text: "1.3", value: "1.3" },
            { text: "1.4", value: "1.4" },
            { text: "1.5", value: "1.5" },
            { text: "1.8", value: "1.8" },
            { text: "2.0", value: "2.0" },
            { text: "2.5", value: "2.5" },
            { text: "3.0", value: "3.0" },
            { text: "4.0", value: "4.0" },
            { text: "4.5", value: "4.5" },
            { text: "5.0", value: "5.0" },
            { text: "5.5", value: "5.5" },
            { text: "6.0", value: "6.0" },
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
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>filters.setPrices("priceFrom", Number(e.target.value))}
          />
          <Input
            type="number"
            min={0}
            max={300000}
            placeholder="300000"
            value={String(filters.prices.priceTo)}
            onChange={(e) => filters.setPrices("priceTo", Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={300000}
          step={10}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 300000]}
          onValueChange={updatePrice}
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
