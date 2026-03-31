import { cn } from '@/shared/lib/utils';
import React from 'react';
import { CountIconButton } from './count-icon-button';

export interface CountButtonProps {
  value?: number;
  size?: 'sm' | 'lg';
  onClick?: (type: 'plus' | 'minus') => void;
  className?: string;
}

export const CountButton: React.FC<CountButtonProps> = ({ className, onClick, value = 1, size = 'sm' }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-between gap-2 sm:gap-3 min-w-[96px]',
        className
      )}
    >
      <CountIconButton
        onClick={() => onClick?.('minus') ?? (() => {})}
        disabled={value === 1}
        size={size}
        type="minus"
      />

      <b
        className={
          size === 'sm'
            ? 'text-sm sm:text-base'
            : 'text-base sm:text-lg'
        }
      >
        {value}
      </b>

      <CountIconButton onClick={() => onClick?.('plus')} size={size} type="plus" />
    </div>
  );
};
