import React from 'react';
import { ProductItem } from '@prisma/client';
import { Variant } from '../components/shared/group-variants';
import { mapProductMaterial, mapProductShape, mapProductColor } from '@/shared/constants/profile';

// Только display-поля + productMaterials (enum) + productShape + productColors
type OptionKey =
  | 'materialDisplay'
  | 'productMaterials'
  | 'widthDisplay' // объединённый размер Ш×В
  | 'sizeDisplay' // ручной размер (когда нет Ш×В)
  | 'thicknessDisplay'
  | 'lengthDisplay'
  | 'productColors' // первый colorId из productColors[]
  | 'productShape';

type OptionGroup = {
  key: OptionKey;
  title: string;
  items: Variant[];
  value: string;
  onChange: (value: string) => void;
};

interface ReturnProps {
  optionGroups: OptionGroup[];
  textDetails: string;
  currentItemId?: number;
  resetFilters: () => void;
}

const ORDERED_KEYS: OptionKey[] = [
  'productMaterials',
  'materialDisplay',
  'widthDisplay',
  'sizeDisplay',
  'thicknessDisplay',
  'lengthDisplay',
  'productColors',
  'productShape',
];

const TITLES: Record<OptionKey, string> = {
  productMaterials: 'Материал',
  materialDisplay: 'Материал',
  widthDisplay: 'Размер',
  sizeDisplay: 'Размер',
  thicknessDisplay: 'Толщина',
  lengthDisplay: 'Длина',
  productColors: 'Цвет',
  productShape: 'Форма',
};

const normalizeSizeValue = (value: string): string => value.replace(/\s+/g, '').replace(/[xхXХ]/g, '×');

const getUnifiedSizeValue = (item: ProductItem): string => {
  const w = item.widthDisplay?.trim();
  const h = item.heightDisplay?.trim();
  if (w || h) return normalizeSizeValue([w, h].filter(Boolean).join('×'));
  return '';
};

const getPrimaryColorId = (item: ProductItem): string => {
  const first = item.productColors?.[0];
  if (!first) return '';
  return first.includes(':') ? first.split(':')[0] : first;
};

const getColorRal = (item: ProductItem, colorId: string): string | null => {
  for (const entry of item.productColors ?? []) {
    const idx = entry.indexOf(':');
    if (idx !== -1 && entry.slice(0, idx) === colorId) return entry.slice(idx + 1);
  }
  return null;
};

const getMappedColorLabel = (colorId: string): string =>
  mapProductColor[Number(colorId) as keyof typeof mapProductColor] ?? colorId;

const getItemValue = (item: ProductItem, key: OptionKey): string => {
  switch (key) {
    case 'widthDisplay':
      return getUnifiedSizeValue(item);
    case 'sizeDisplay':
      return normalizeSizeValue(item.sizeDisplay?.trim() ?? '');
    case 'thicknessDisplay':
      return item.thicknessDisplay?.trim() ?? '';
    case 'lengthDisplay':
      return item.lengthDisplay?.trim() ?? '';
    case 'materialDisplay':
      return item.materialDisplay?.trim() ?? '';
    case 'productMaterials':
      return item.productMaterials ?? '';
    case 'productColors':
      return getPrimaryColorId(item);
    case 'productShape':
      return item.productShape != null ? String(item.productShape) : '';
  }
};

const isSameValue = (key: OptionKey, a: string, b: string): boolean => {
  if (key === 'widthDisplay' || key === 'sizeDisplay') {
    return normalizeSizeValue(a) === normalizeSizeValue(b);
  }
  return a === b;
};

const getMappedLabel = (key: OptionKey, rawValue: string): string => {
  if (key === 'productMaterials') {
    return mapProductMaterial[rawValue as keyof typeof mapProductMaterial] ?? rawValue;
  }
  if (key === 'productShape') {
    return mapProductShape[Number(rawValue) as keyof typeof mapProductShape] ?? rawValue;
  }
  if (key === 'productColors') {
    return getMappedColorLabel(rawValue);
  }
  return rawValue;
};

const getDefaults = (items: ProductItem[], keys: OptionKey[]): Record<OptionKey, string> => {
  const first = items[0];
  return Object.fromEntries(keys.map((key) => [key, first ? getItemValue(first, key) : ''])) as Record<
    OptionKey,
    string
  >;
};

export const useProductOptions = (items: ProductItem[]): ReturnProps => {
  const presentKeys = React.useMemo((): OptionKey[] => {
    const hasUnifiedSize = items.some((i) => getUnifiedSizeValue(i) !== '');
    const hasSizeDisplay = items.some((i) => i.sizeDisplay);
    const hasThickness = items.some((i) => i.thicknessDisplay);
    const hasLength = items.some((i) => i.lengthDisplay);
    const hasMaterialEnum = items.some((i) => i.productMaterials);
    const hasMaterialDisplay = items.some((i) => i.materialDisplay);
    const hasColors = items.some((i) => (i.productColors?.length ?? 0) > 0);
    const hasShape = items.some((i) => i.productShape != null);

    return ORDERED_KEYS.filter((key) => {
      if (key === 'widthDisplay') return hasUnifiedSize;
      if (key === 'sizeDisplay') return hasSizeDisplay && !hasUnifiedSize;
      if (key === 'thicknessDisplay') return hasThickness;
      if (key === 'lengthDisplay') return hasLength;
      // Если есть materialDisplay — используем его, enum скрываем
      if (key === 'materialDisplay') return hasMaterialDisplay;
      if (key === 'productMaterials') return hasMaterialEnum && !hasMaterialDisplay;
      if (key === 'productColors') return hasColors;
      if (key === 'productShape') return hasShape;
      return false;
    });
  }, [items]);

  const defaults = React.useMemo(() => getDefaults(items, presentKeys), [items, presentKeys]);
  const [selected, setSelected] = React.useState<Record<OptionKey, string>>(defaults);

  React.useEffect(() => {
    setSelected(defaults);
  }, [defaults]);

  const findBestItem = React.useCallback(
    (wish: Record<OptionKey, string>): ProductItem | undefined => {
      const exact = items.find((item) =>
        presentKeys.every((key) => {
          const target = wish[key];
          if (!target) return true;
          const val = getItemValue(item, key);
          return val ? isSameValue(key, val, target) : false;
        }),
      );
      if (exact) return exact;

      return items
        .map((item) => {
          let score = 0;
          for (const key of presentKeys) {
            const target = wish[key];
            if (!target) continue;
            const val = getItemValue(item, key);
            if (val && isSameValue(key, val, target)) score++;
          }
          return { item, score };
        })
        .sort((a, b) => b.score - a.score)[0]?.item;
    },
    [items, presentKeys],
  );

  const optionGroupsData = React.useMemo(
    () =>
      presentKeys.map((key) => {
        const uniqueValues = Array.from(new Set(items.map((i) => getItemValue(i, key)).filter(Boolean)));
        const options: Variant[] = uniqueValues.map((rawValue) => ({
          name: getMappedLabel(key, rawValue),
          value: rawValue,
          disabled: false,
        }));
        return { key, title: TITLES[key], items: options };
      }),
    [items, presentKeys],
  );

  const currentItem = React.useMemo(
    () =>
      items.find((item) =>
        presentKeys.every((key) => {
          const sel = selected[key];
          if (!sel) return true;
          const val = getItemValue(item, key);
          return val ? isSameValue(key, val, sel) : false;
        }),
      ),
    [items, presentKeys, selected],
  );

  const textDetails = React.useMemo(() => {
    return presentKeys
      .map((key) => {
        const val = selected[key];
        if (!val) return null;
        const label = getMappedLabel(key, val);
        if (key === 'widthDisplay' || key === 'sizeDisplay') return `размер ${label}`;
        if (key === 'thicknessDisplay') return `толщина ${label}`;
        if (key === 'lengthDisplay') return `длина ${label}`;
        if (key === 'productMaterials' || key === 'materialDisplay') return `материал ${label}`;
        if (key === 'productShape') return `форма ${label}`;
        if (key === 'productColors') {
          const ral = currentItem ? getColorRal(currentItem, val) : null;
          return ral ? `цвет ${label} (${ral})` : `цвет ${label}`;
        }
        return label;
      })
      .filter(Boolean)
      .join(', ');
  }, [currentItem, presentKeys, selected]);

  const optionGroups = React.useMemo(
    () =>
      optionGroupsData.map((group) => ({
        ...group,
        value: selected[group.key] ?? '',
        onChange: (value: string) => {
          setSelected((prev) => {
            const wish: Record<OptionKey, string> = { ...prev, [group.key]: value };
            const best = findBestItem(wish);
            if (!best) return wish;
            const next = { ...prev };
            for (const key of presentKeys) {
              next[key] = getItemValue(best, key) || '';
            }
            next[group.key] = value;
            return next;
          });
        },
      })),
    [optionGroupsData, selected, presentKeys, findBestItem],
  );

  const resetFilters = React.useCallback(() => setSelected(defaults), [defaults]);

  return {
    optionGroups,
    textDetails,
    currentItemId: currentItem?.id,
    resetFilters,
  };
};
