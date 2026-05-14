import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/prisma/prisma-client';
import { resolveInquiryRoutes } from '@/shared/lib/resolve-inquiry-routes';

type ManagerForRouting = {
  id: number;
  createdAt: Date;
  handlesAllCategories: boolean;
  _count: { managedInquiries: number };
  managerAssignments: Array<{
    categoryId: number | null;
    productId: number | null;
    isPrimary: boolean;
  }>;
};

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
    },
  },
}));

describe('resolveInquiryRoutes', () => {
  beforeEach(() => {
    const managers: ManagerForRouting[] = [
      {
        id: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        handlesAllCategories: false,
        _count: { managedInquiries: 1 },
        managerAssignments: [{ categoryId: 1, productId: null, isPrimary: true }],
      },
      {
        id: 20,
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        handlesAllCategories: false,
        _count: { managedInquiries: 1 },
        managerAssignments: [{ categoryId: 2, productId: null, isPrimary: true }],
      },
    ];

    vi.mocked(prisma.user.findMany).mockResolvedValue(
      managers as unknown as Awaited<ReturnType<typeof prisma.user.findMany>>,
    );
  });

  it('creates separate routes for different managers inside one tenant', async () => {
    const routes = await resolveInquiryRoutes([
      {
        productId: 100,
        categoryId: 1,
        productName: 'Труба',
        quantity: 2,
        sku: 'SKU-100',
        fulfillmentTenantId: 1,
      },
      {
        productId: 200,
        categoryId: 2,
        productName: 'Лист',
        quantity: 1,
        sku: 'SKU-200',
        fulfillmentTenantId: 1,
      },
    ]);

    expect(routes).toHaveLength(2);
    expect(routes.map((route) => route.managerId).sort()).toEqual([10, 20]);
    expect(routes.every((route) => route.items.length === 1)).toBe(true);
  });
});
