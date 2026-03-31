import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const ClearButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition',
        className
      )}
      type="button"
      tabIndex={0}
    >
      <X className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
};
