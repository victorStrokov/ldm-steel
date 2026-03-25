'use client';

import { cn } from '@/shared/lib/utils';
import { useSortStore } from '@/shared/store';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  const { order, setOrder } = useSortStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const onClickSort = (value: 'asc' | 'desc', e: React.MouseEvent) => {
    e.stopPropagation();
    setOrder(value);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        'relative inline-flex h-[52px] cursor-pointer items-center rounded-2xl bg-gray-50 px-5 select-none',
        className,
      )}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <ArrowUpDown size={16} />
      <b className="ml-2">Сортировка:</b>
      <b className="text-primary ml-1">{order === 'asc' ? 'по возрастанию цены' : 'по убыванию цены'}</b>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 rounded-xl bg-white p-2 shadow-md">
          <button
            onClick={(e) => onClickSort('asc', e)}
            className="block w-full rounded-md px-3 py-2 text-left hover:bg-gray-100"
          >
            Цена: от меньшей к большей
          </button>
          <button
            onClick={(e) => onClickSort('desc', e)}
            className="block w-full rounded-md px-3 py-2 text-left hover:bg-gray-100"
          >
            Цена: от большей к меньшей
          </button>
        </div>
      )}
    </div>
  );
};

{
  /* <div className="absolute top-full mt-2 left-0 bg-white shadow-md rounded-xl p-2 z-20"></div> */
}
