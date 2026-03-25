/* eslint-disable jsx-a11y/alt-text */
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';

interface Props {
  src: string;
  id: number;
  className?: string;
}

export const CartItemDetailsImage: React.FC<Props> = ({ src, id, className }) => {
  const normalizedImageUrl = normalizeImageUrl(src) ?? '/no-image.png';

  return (
    <Link href={`/product/${id}`}>
      <img className={cn('h-[60px] w-[60px]', className)} src={normalizedImageUrl} />
    </Link>
  );
};
