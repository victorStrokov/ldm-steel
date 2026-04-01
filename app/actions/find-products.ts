'use server';

import { prisma } from '@/prisma/prisma-client';
import { logger } from '@/shared/lib/logger';
import { Prisma, ProductMaterial } from '@prisma/client';

type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        images: true;
        ingredients: {
          include: {
            images: true;
          };
        };
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
  ingredients?: string;
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
  const sizes = params.sizes?.split(',').map(Number) ?? [];
  const materialTypes = params.materialTypes?.split(',').map(Number) ?? [];
  const length = params.length?.split(',').map(Number) ?? [];
  const ingredientsIdArr = params.ingredients?.split(',').map(Number) ?? [];
  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;
  const mapProductMaterialEnum: Record<number, ProductMaterial> = {
    1: ProductMaterial.STEEL,
    2: ProductMaterial.PVC,
    3: ProductMaterial.ALUMINIUM,
    4: ProductMaterial.PLASTIC,
    5: ProductMaterial.RUBBER,
  };

  const itemWhere: Prisma.ProductItemWhereInput = {};

  if (sizes.length > 0) {
    itemWhere.OR = [{ steelSize: { in: sizes } }, { pvcSize: { in: sizes } }, { productSizes: { in: sizes } }];
  }

  if (length.length > 0) {
    itemWhere.productLength = { in: length };
  }

  if (materialTypes.length > 0) {
    itemWhere.productMaterials = {
      in: materialTypes.map((id) => mapProductMaterialEnum[id]).filter(Boolean),
    };
  }

  itemWhere.price = { gte: minPrice, lte: maxPrice };

  try {
    const categories = await findCategoriesWithRetry({
      include: {
        products: {
          orderBy: { id: 'desc' },
          where: {
            ingredients: ingredientsIdArr.length ? { some: { id: { in: ingredientsIdArr } } } : undefined,
            items: { some: itemWhere },
          },
          include: {
            images: true,
            ingredients: {
              include: {
                images: true,
              },
            },
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
