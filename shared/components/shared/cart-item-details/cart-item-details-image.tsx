/* eslint-disable jsx-a11y/alt-text */
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

interface Props {
  src: string;
  id: number;
  className?: string;
}

export const CartItemDetailsImage: React.FC<Props> = ({ src, id, className }) => {
  return (
    <Link href={`/product/${id}`}>
      <img className={cn('w-[60px] h-[60px]', className)} src={src} />
    </Link>
  );
};
