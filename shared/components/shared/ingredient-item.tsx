import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { cn } from '@/shared/lib/utils';
import { CircleCheck } from 'lucide-react';
import React from 'react';

interface Props {
  imageUrl?: string;
  name?: string;
  price: number;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

export const IngredientItem: React.FC<Props> = ({ imageUrl, name, price, active, onClick, className }) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl) ?? '/no-image.png';

  return (
    <div
      className={cn(
        'relative flex w-24 sm:w-32 cursor-pointer flex-col items-center rounded-md bg-white p-1 sm:p-2 text-center shadow-md transition-all duration-200',
        { 'border-primary border-2': active },
        className,
      )}
      onClick={onClick}
    >
      {active && <CircleCheck className="text-primary absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6" />}
      <img
        src={normalizedImageUrl}
        alt={name}
        className="object-contain rounded max-w-full h-16 sm:h-20 md:h-24 mb-1"
        width={110}
        height={110}
      />
      <span className="mb-1 text-xs sm:text-sm md:text-base">{name}</span>
      <span className="font-bold text-xs sm:text-sm md:text-base">{price} ₽</span>
    </div>
  );
};
