import { prisma } from '@/prisma/prisma-client';
import { Prisma, ProductMaterial } from '@prisma/client';

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

export const findProducts = async (params: GetSearchParams) => {
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

  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: { id: 'desc' },
        where: {
          ingredients: ingredientsIdArr.length ? { some: { id: { in: ingredientsIdArr } } } : undefined,
          items: { some: itemWhere },
        },
        include: {
          ingredients: true,
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
};
