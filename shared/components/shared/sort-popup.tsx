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
        'relative inline-flex items-center bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer select-none',
        className,
      )}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <ArrowUpDown size={16} />
      <b className="ml-2 ">Сортировка:</b>
      <b className="ml-1 text-primary">{order === 'asc' ? 'по возрастанию цены' : 'по убыванию цены'}</b>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white shadow-md rounded-xl p-2 z-20">
          <button
            onClick={(e) => onClickSort('asc', e)}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            Цена: от меньшей к большей
          </button>
          <button
            onClick={(e) => onClickSort('desc', e)}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
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
