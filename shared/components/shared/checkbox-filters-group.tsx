'use client';

import React from 'react';
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Input, Skeleton } from '../ui';

type Item = FilterCheckboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  loading: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (id: string) => void;
  defaultValue?: string[];
  selected?: Set<string>;
  className?: string;
  name?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Поиск...',
  className,
  loading,
  onClickCheckbox,
  selected,
  name,
  //defaultValue,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  if (loading) {
    return (
      <div className={className}>
        <p className="mb-2 sm:mb-3 font-bold">{title}</p>
        {...Array(limit)
          .fill(0)
          .map((_, index) => <Skeleton key={index} className="mb-2 sm:mb-4 h-4 sm:h-5 rounded-xl" />)}
        <Skeleton className="mb-2 sm:mb-4 h-4 sm:h-5 w-25 sm:w-35 rounded-xl" />
      </div>
    );
  }

  const list = showAll
    ? items.filter((item) => item.text.toLowerCase().includes(searchValue.toLowerCase()))
    : (defaultItems || items).slice(0, limit);

  return (
    <div className={className}>
      <p className="mb-2 sm:mb-3 font-bold">{title}</p>
      {showAll && (
        <div className="mb-3 sm:mb-5">
          <Input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
            className="border-none bg-gray-50 text-sm py-2"
          />
        </div>
      )}
      <div className="scrollbar flex max-h-60 sm:max-h-96 flex-col gap-2 sm:gap-4 overflow-x-auto pr-1 sm:pr-2">
        {list.map((item, index) => (
          <FilterCheckbox
            key={index}
            text={item.text}
            value={item.value}
            endAdornment={item.endAdornment}
            checked={selected?.has(item.value) || false}
            onCheckedChange={() => onClickCheckbox?.(item.value)}
            name={name}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={showAll ? 'mt-3 sm:mt-4 border-t border-t-neutral-100' : ''}>
          <button onClick={() => setShowAll(!showAll)} className="text-primary mt-2 sm:mt-3 text-sm sm:text-base">
            {showAll ? 'Скрыть' : `+ Показать все (${items.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
