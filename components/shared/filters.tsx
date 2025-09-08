'use client';

import React from 'react';
import { Title } from './title';
import { FilterCheckbox } from './filter-checkbox';
import { Input } from '../ui';
import { RangeSlider } from './range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/use-filter-ingredients';

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useFilterIngredients();

  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: String(item.name),
  }));

  return (
    <div className={className}>
      <Title
        text='Фильтрация'
        size='sm'
        className='mb font-bold'
      />
      {/* верхние чекбоксы */}
      <div className='flex flex-col gap-4'>
        <FilterCheckbox
          text='Можно Собиррать'
          value='1'
        />
        <FilterCheckbox
          text='Новинки'
          value='2'
        />
      </div>
      {/* фильтр цен */}
      <div className='mt-5  border-y border-y-neutral-100 py-6 pb-7'>
        <p className='font-bold mb-3'>Цена от и до</p>
        <div className='flex gap-3 mb-5'>
          <Input
            type='number'
            placeholder='0'
            min={0}
            max={300000}
            defaultValue={0}
          />
          <Input
            type='number'
            min={0}
            max={300000}
            placeholder='300000'
          />
        </div>
        <RangeSlider
          min={0}
          max={300000}
          step={10}
          value={[0, 300000]}
        />
      </div>
      <CheckboxFiltersGroup
        loading={loading}
        title='Комплектующие'
        className='mt-5'
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
      />
    </div>
  );
};
