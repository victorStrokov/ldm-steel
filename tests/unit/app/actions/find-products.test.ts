import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
    },
  },
}));

import { findProducts } from '@/app/actions/find-products';
import { prisma } from '@/prisma/prisma-client';

describe('findProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.category.findMany).mockResolvedValue([] as never);
  });

  it('calls prisma with default price range when filters are empty', async () => {
    await findProducts({});

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          products: expect.objectContaining({
            where: expect.objectContaining({
              items: {
                some: expect.objectContaining({
                  price: { gte: 0, lte: 300000 },
                }),
              },
            }),
          }),
        }),
      }),
    );
  });

  it('maps materialTypes filter into ProductMaterial enum values', async () => {
    await findProducts({ materialTypes: '1,2', priceFrom: '100', priceTo: '500' });

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          products: expect.objectContaining({
            where: expect.objectContaining({
              items: {
                some: expect.objectContaining({
                  productMaterials: { in: ['STEEL', 'PVC'] },
                  price: { gte: 100, lte: 500 },
                }),
              },
            }),
          }),
        }),
      }),
    );
  });
});
