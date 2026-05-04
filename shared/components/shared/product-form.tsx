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
import { Check } from 'lucide-react';

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
  priceMode?: PriceMode;
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit: _onSubmit, priceMode }) => {
  const firstItem = product.items?.[0];
  const isProfileForm = React.useMemo(
    () =>
      product.items.some(
        (item) =>
          item.productMaterials != null ||
          (item as { materialDisplay?: string | null }).materialDisplay != null ||
          item.sizeDisplay != null ||
          item.thicknessDisplay != null ||
          item.lengthDisplay != null ||
          item.productColors.length > 0 ||
          item.productShape != null ||
          (item as { widthDisplay?: string | null }).widthDisplay != null ||
          (item as { heightDisplay?: string | null }).heightDisplay != null,
      ),
    [product.items],
  );
  const effectivePriceMode: PriceMode = priceMode ?? 'visible';
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);

  const [selectedRelatedIds, setSelectedRelatedIds] = React.useState<Set<number>>(new Set());

  const toggleRelated = (relatedProductId: number) => {
    setSelectedRelatedIds((prev) => {
      const next = new Set(prev);
      if (next.has(relatedProductId)) {
        next.delete(relatedProductId);
      } else {
        next.add(relatedProductId);
      }
      return next;
    });
  };

  const relatedProducts = (product.relatedProducts ?? []).filter((relation) => Boolean(relation.relatedProduct));
  const relatedKinds: Array<'RECOMMENDED' | 'ACCESSORY' | 'COMPATIBLE'> = ['RECOMMENDED', 'ACCESSORY', 'COMPATIBLE'];

  const groupedRelatedProducts = React.useMemo(() => {
    const grouped: Record<'RECOMMENDED' | 'ACCESSORY' | 'COMPATIBLE', typeof relatedProducts> = {
      RECOMMENDED: [],
      ACCESSORY: [],
      COMPATIBLE: [],
    };

    for (const relation of relatedProducts) {
      grouped[relation.kind].push(relation);
    }

    return grouped;
  }, [relatedProducts]);

  const onSubmit = async (productItemId?: number) => {
    try {
      const itemId = productItemId ?? firstItem?.id;

      await addCartItem({ productItemId: itemId });

      // Добавляем выбранные сопутствующие товары вместе с основным
      if (selectedRelatedIds.size > 0) {
        const selectedRelations = relatedProducts.filter((r) => selectedRelatedIds.has(r.relatedProductId));
        await Promise.all(
          selectedRelations.map(async (relation) => {
            const relatedItemId = relation.relatedProduct?.items?.[0]?.id;
            if (relatedItemId) {
              await addCartItem({ productItemId: relatedItemId });
            }
          }),
        );
        const addedNames = selectedRelations.map((r) => r.relatedProduct?.name).filter(Boolean);
        toast.success(
          `${product.name} + ${addedNames.length} доп. товар${addedNames.length > 1 ? 'а' : ''} добавлены в заявку`,
        );
      } else {
        toast.success(product.name + ' добавлен в заявку');
      }

      setSelectedRelatedIds(new Set());
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

  const getKindTitle = (kind: 'RECOMMENDED' | 'ACCESSORY' | 'COMPATIBLE') => {
    if (kind === 'ACCESSORY') return 'Аксессуары';
    if (kind === 'COMPATIBLE') return 'Совместимые товары';
    return 'Рекомендуем добавить';
  };

  const renderRelatedProducts = () => {
    if (!relatedProducts.length) return null;

    return (
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h3 className="mb-1 text-lg font-semibold">С этим товаром берут</h3>
        <p className="mb-4 text-xs text-gray-400">
          Нажмите на товар, чтобы выбрать — он добавится в заявку вместе с основным.
        </p>

        <div className="space-y-5">
          {relatedKinds.map((kind) => {
            const relations = groupedRelatedProducts[kind];
            if (!relations.length) return null;

            return (
              <section key={kind} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">{getKindTitle(kind)}</h4>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{relations.length}</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {relations.map((relation) => {
                    const related = relation.relatedProduct;
                    const relatedImage = normalizeImageUrl(related.images?.[0]?.url) ?? '/no-image.png';
                    const relatedPrice = related.items?.[0]?.price ?? 0;
                    const isSelected = selectedRelatedIds.has(relation.relatedProductId);

                    return (
                      <div
                        key={relation.id}
                        onClick={() => toggleRelated(relation.relatedProductId)}
                        className={`relative flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all select-none ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-gray-100 bg-[#f7f6f5] hover:border-gray-300'
                        }`}
                      >
                        {/* Галочка выбора — только когда выбран */}
                        {isSelected && (
                          <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </div>
                        )}

                        <img
                          src={relatedImage}
                          alt={related.name}
                          className="mt-3 h-16 w-16 shrink-0 rounded-lg object-contain bg-white"
                          onError={(e) => {
                            e.currentTarget.src = '/no-image.png';
                          }}
                        />

                        <div className="min-w-0 flex-1 pr-5">
                          <p className="truncate text-sm font-medium">{related.name}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1">
                            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-700">
                              {getKindLabel(relation.kind)}
                            </span>
                            {relation.isRequired ? (
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">
                                Обязательно
                              </span>
                            ) : null}
                          </div>
                          {relation.compatibilityNote ? (
                            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{relation.compatibilityNote}</p>
                          ) : null}
                        </div>

                        <Button
                          type="button"
                          loading={loading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddRelated(relation.relatedProductId);
                          }}
                          className="h-9 shrink-0 whitespace-nowrap rounded-lg px-3 text-xs"
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
              </section>
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
          items={product.items}
          priceMode={effectivePriceMode}
          onSubmit={onSubmit}
          loading={loading}
          onClickImage={handleImageClick}
        />
        {product.fullDesc && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 space-y-2">
            <p className="text-sm sm:text-base text-gray-500 whitespace-pre-line">{product.fullDesc}</p>
          </div>
        )}
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
      {product.fullDesc && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 space-y-2">
          <p className="text-sm sm:text-base text-gray-500 whitespace-pre-line">{product.fullDesc}</p>
        </div>
      )}
      {renderRelatedProducts()}
    </>
  );
};
