'use server';

import { prisma } from '@/prisma/prisma-client';
import { logger } from '@/shared/lib/logger';
import { Prisma } from '@prisma/client';
import { mapProductMaterial } from '@/shared/constants/profile';

type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        images: true;
        items: true;
      };
    };
  };
}>;

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  materialTypes?: string;
  sizes?: string;
  length?: string;
  thickness?: string;
  colors?: string;
  priceFrom?: string;
  priceTo?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 300000;
const MAX_DB_ATTEMPTS = 2;
const RETRY_DELAY_MS = 250;

const log = logger.child({ module: 'find-products' });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientConnectionError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes('connection terminated unexpectedly') ||
    message.includes("can't reach database server") ||
    message.includes('connection closed') ||
    message.includes('timeout')
  );
};

const findCategoriesWithRetry = async <T extends Prisma.CategoryFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.CategoryFindManyArgs>,
): Promise<Prisma.CategoryGetPayload<T>[]> => {
  for (let attempt = 1; attempt <= MAX_DB_ATTEMPTS; attempt++) {
    try {
      return await prisma.category.findMany(args);
    } catch (error) {
      const canRetry = isTransientConnectionError(error) && attempt < MAX_DB_ATTEMPTS;

      if (!canRetry) {
        throw error;
      }

      log.warn({ attempt, error }, 'Transient DB error in find-products, retrying');
      await sleep(RETRY_DELAY_MS);
    }
  }

  return [] as Prisma.CategoryGetPayload<T>[];
};

export const findProducts = async (params: GetSearchParams): Promise<CategoryWithProducts[]> => {
  const sizeTokens = params.sizes?.split(',').filter(Boolean) ?? [];
  const sizesStr = sizeTokens;

  const lengthTokens = params.length?.split(',').filter(Boolean) ?? [];
  const lengthStr = lengthTokens;

  const materialTypes = params.materialTypes?.split(',').filter(Boolean) ?? [];
  const colors = params.colors?.split(',').filter(Boolean) ?? [];
  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const materialLabelToEnum = Object.entries(mapProductMaterial).reduce(
    (acc, [enumKey, label]) => {
      acc[label] = enumKey;
      return acc;
    },
    {} as Record<string, string>,
  );

  const itemWhere: Prisma.ProductItemWhereInput = {};

  if (sizeTokens.length > 0) {
    const orConditions: Prisma.ProductItemWhereInput[] = [];
    orConditions.push({ sizeDisplay: { in: sizesStr } });
    // Match widthDisplay×heightDisplay combined string
    for (const token of sizesStr) {
      const [w, h] = token.split('×');
      if (w && h) {
        orConditions.push({ widthDisplay: w, heightDisplay: h });
      }
    }
    itemWhere.OR = orConditions;
  }

  if (lengthTokens.length > 0) {
    const lengthOrConditions: Prisma.ProductItemWhereInput[] = [];
    lengthOrConditions.push({ lengthDisplay: { in: lengthStr } });
    if (itemWhere.OR) {
      itemWhere.AND = [{ OR: itemWhere.OR }, { OR: lengthOrConditions }];
      delete itemWhere.OR;
    } else {
      itemWhere.OR = lengthOrConditions;
    }
  }

  const thicknessTokens = params.thickness?.split(',').filter(Boolean) ?? [];
  if (thicknessTokens.length > 0) {
    const thicknessOrConditions: Prisma.ProductItemWhereInput[] = [];
    thicknessOrConditions.push({ thicknessDisplay: { in: thicknessTokens } });
    if (itemWhere.AND) {
      (itemWhere.AND as Prisma.ProductItemWhereInput[]).push({ OR: thicknessOrConditions });
    } else if (itemWhere.OR) {
      itemWhere.AND = [{ OR: itemWhere.OR }, { OR: thicknessOrConditions }];
      delete itemWhere.OR;
    } else {
      itemWhere.OR = thicknessOrConditions;
    }
  }

  if (colors.length > 0) {
    itemWhere.productColors = {
      hasSome: colors,
    };
  }

  if (materialTypes.length > 0) {
    const mappedEnumValues = materialTypes.map((label) => materialLabelToEnum[label]).filter(Boolean);

    const materialConditions: Prisma.ProductItemWhereInput[] = [
      { materialDisplay: { in: materialTypes } } as Prisma.ProductItemWhereInput,
    ];

    if (mappedEnumValues.length > 0) {
      materialConditions.push({
        productMaterials: {
          in: mappedEnumValues as Array<'STEEL' | 'PVC' | 'ALUMINIUM' | 'PLASTIC' | 'RUBBER'>,
        },
      });
    }

    if (itemWhere.AND) {
      (itemWhere.AND as Prisma.ProductItemWhereInput[]).push({ OR: materialConditions });
    } else if (itemWhere.OR) {
      itemWhere.AND = [{ OR: itemWhere.OR }, { OR: materialConditions }];
      delete itemWhere.OR;
    } else {
      itemWhere.OR = materialConditions;
    }
  }

  itemWhere.price = { gte: minPrice, lte: maxPrice };

  try {
    const categories = await findCategoriesWithRetry({
      include: {
        products: {
          orderBy: { id: 'desc' },
          where: {
            items: { some: itemWhere },
          },
          include: {
            images: true,
            items: {
              where: {
                price: { gte: minPrice, lte: maxPrice },
              },
              orderBy: { price: 'desc' },
            },
          },
        },
      },
    });

    return categories;
  } catch (error) {
    log.error({ error }, 'find-products failed, returning empty category list');
    return [];
  }
};
