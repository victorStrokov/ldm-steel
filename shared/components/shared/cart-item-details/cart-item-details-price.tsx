import { cn } from '@/shared/lib/utils';

interface Props {
  value: number;
  className?: string;
}

export const CartItemDetailsPrice: React.FC<Props> = ({ value, className }) => {
  return <h2 className={cn('font-bold text-base sm:text-lg', className)}>{value} ₽</h2>;
};
