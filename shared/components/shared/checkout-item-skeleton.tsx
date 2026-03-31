import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
}

export const CheckoutItemSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="h-10 w-10 sm:h-15 sm:w-15 animate-pulse rounded-md bg-gray-200" />
        <h2 className="h-4 w-24 sm:h-5 sm:w-40 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex gap-2 sm:gap-0 items-center">
        <div className="h-4 w-8 sm:h-5 sm:w-10 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-20 sm:h-8 sm:w-32 animate-pulse rounded bg-gray-200 ml-2 sm:ml-4" />
      </div>
    </div>
  );
};
