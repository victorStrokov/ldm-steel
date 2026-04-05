'use client';

import { createClientLogger } from '@/shared/lib/client-logger';

const log = createClientLogger('ProductForm');

import { ProductWithRelations } from '@/@types/prisma';
import { PriceMode, canShowPrices, shouldShowPriceOnRequestLabel } from '@/shared/lib/catalog-mode';
import { useCartStore } from '@/shared/store';
import React from 'react';
import toast from 'react-hot-toast';
import { ChooseProfileForm } from './choose-profile-form';
import { ChooseProductForm } from './choose-product-form';
import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { Button } from '../ui';

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
  priceMode?: PriceMode;
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit, priceMode }) => {
  const firstItem = product.items?.[0];
  const isProfileForm = Boolean(firstItem?.steelSize);
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  const relatedProducts = (product.relatedProducts ?? []).filter((relation) => relation.relatedProduct?.items?.length);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem?.id;

      await addCartItem({
        productItemId: itemId,
        ingredients,
      });

      toast.success(product.name + '  добавлен в корзину');

      _onSubmit?.();
    } catch (error) {
      toast.error('Не удалось добавить товар в корзину');
      log.error('addCartItem failed', error);
    }
  };
  const handleImageClick = () => {
    window.location.href = `/product/${product.id}`;
  };

  const handleAddRelated = async (relatedProductId: number) => {
    const relation = relatedProducts.find((item) => item.relatedProductId === relatedProductId);

    const relatedItemId = relation?.relatedProduct?.items?.[0]?.id;
    const relatedName = relation?.relatedProduct?.name ?? 'Товар';

    if (!relatedItemId) {
      toast.error('У сопутствующего товара нет доступных вариантов');
      return;
    }

    try {
      await addCartItem({ productItemId: relatedItemId });
      toast.success(`${relatedName} добавлен в корзину`);
    } catch (error) {
      toast.error('Не удалось добавить сопутствующий товар');
      log.error('add related product failed', error);
    }
  };

  const getKindLabel = (kind: 'RECOMMENDED' | 'ACCESSORY' | 'COMPATIBLE') => {
    if (kind === 'ACCESSORY') return 'Аксессуар';
    if (kind === 'COMPATIBLE') return 'Совместимо';
    return 'Рекомендуем';
  };

  const renderRelatedProducts = () => {
    if (!relatedProducts.length) return null;

    return (
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold">С этим товаром берут</h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedProducts.map((relation) => {
            const related = relation.relatedProduct;
            const relatedImage = normalizeImageUrl(related.images?.[0]?.url) ?? '/no-image.png';
            const relatedPrice = related.items?.[0]?.price ?? 0;

            return (
              <div
                key={relation.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f7f6f5] p-3"
              >
                <img
                  src={relatedImage}
                  alt={related.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-contain bg-white"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{related.name}</p>
                  <p className="text-xs text-gray-500">{getKindLabel(relation.kind)}</p>
                  {relation.compatibilityNote ? (
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{relation.compatibilityNote}</p>
                  ) : null}
                </div>

                <Button
                  type="button"
                  loading={loading}
                  onClick={() => handleAddRelated(relation.relatedProductId)}
                  className="h-9 whitespace-nowrap rounded-lg px-3 text-xs"
                >
                  {canShowPrices(effectivePriceMode)
                    ? `Добавить за ${relatedPrice} ₽`
                    : shouldShowPriceOnRequestLabel(effectivePriceMode)
                      ? 'В заявку'
                      : 'В заявку'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  // const variants = product?.items.map((item) => ({
  //   name:
  //     item.pvcSize != null
  //       ? `ПВХ ${item.pvcSize}мм`
  //       : item.steelSize != null
  //       ? `Сталь ${item.steelSize}мм`
  //       : item.productLength != null
  //       ? `Длина ${item.productLength}м`
  //       : 'Вариант',
  //   value: String(item.id),
  // }));
  if (isProfileForm) {
    return (
      <>
        <ChooseProfileForm
          imageUrl={product.images?.[0]?.url ?? '/no-image.png'}
          name={product.name}
          ingredients={[]}
          items={product.items}
          priceMode={effectivePriceMode}
          onSubmit={onSubmit}
          loading={loading}
          onClickImage={handleImageClick}
        />
        {renderRelatedProducts()}
      </>
    );
  }
  return (
    <>
      <ChooseProductForm
        name={product.name}
        imageUrl={product.images?.[0]?.url ?? '/no-image.png'}
        price={firstItem?.price ?? 0}
        priceMode={effectivePriceMode}
        onSubmit={onSubmit}
        loading={loading}
        onClickImage={handleImageClick}
      />
      {renderRelatedProducts()}
    </>
  );
};
