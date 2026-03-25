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
        'relative flex w-32 cursor-pointer flex-col items-center rounded-md bg-white p-1 text-center shadow-md',
        { 'border-primary border-2': active },
        className,
      )}
      onClick={onClick}
    >
      {active && <CircleCheck className="text-primary absolute top-2 right-2" />}
      <img width={110} height={110} src={normalizedImageUrl} alt={name} />
      <span className="mb-1 text-sm">{name}</span>
      <span className="font-bold">{price} ₽</span>
    </div>
  );
};
