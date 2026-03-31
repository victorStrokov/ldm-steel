import { cn } from '@/shared/lib/utils';

interface Props {
  name: string;
  details: string;
  className?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details, className }) => {
  return (
    <div>
      <div className={cn('flex items-center justify-between', className)}>
        <h2 className="flex-1 text-base sm:text-lg leading-5 sm:leading-6 font-bold">{name}</h2>
      </div>
      {details && <p className="w-[98%] sm:w-[90%] text-xs sm:text-sm text-gray-400">{details}</p>}
    </div>
  );
};
