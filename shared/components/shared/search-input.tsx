'use client';

import { createClientLogger } from '@/shared/lib/client-logger';
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';

const log = createClientLogger('SearchInput');

import { cn } from '@/shared/lib/utils';
import { Api } from '@/shared/services/api-client';
import { Product } from '@prisma/client';
import { Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useClickAway, useDebounce } from 'react-use';

type SearchProduct = Product & {
  images: { url: string }[];
};

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<SearchProduct[]>([]);
  const ref = React.useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(
    async () => {
      try {
        const response = await Api.products.search(searchQuery);
        setProducts(response);
      } catch (error) {
        log.error('Failed to search products', error);
      }
    },
    250,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery('');
    setProducts([]);
  };

  return (
    <>
      {focused && <div className="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black/50" />}

      <div ref={ref} className={cn('relative z-30 flex h-11 flex-1 justify-between rounded-2xl', className)}>
        <Search className="absolute top-1/2 left-3 h-5 translate-y-[-50%] text-gray-400" />
        <input
          className="w-full rounded-2xl bg-gray-100 pl-11 outline-none"
          type="text"
          placeholder="Найти продукт..."
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {products.length > 0 && (
          <div
            className={cn(
              'invisible absolute top-14 z-30 w-full rounded-xl bg-white py-2 opacity-0 shadow-md transition-all duration-200',
              focused && 'visible top-12 opacity-100',
            )}
          >
            {products.map((product) => (
              <Link
                onClick={onClickItem}
                key={product.id}
                className="hover:bg-primary/10 flex w-full items-center gap-3 px-3 py-2"
                href={`/product/${product.id}`}
              >
                <img
                  className="h-8 w-8 rounded-sm"
                  src={normalizeImageUrl(product.images[0]?.url) ?? '/placeholder.png'}
                  alt={product.name}
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
