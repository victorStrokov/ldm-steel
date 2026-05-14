import { prisma } from '@/prisma/prisma-client';
import { UserRole } from '@prisma/client';

export interface InquiryRoutingItem {
  productId: number;
  productItemId?: number;
  categoryId: number;
  categoryName?: string;
  productName?: string;
  quantity?: number;
  sku?: string;
  fulfillmentTenantId: number;
}

export interface InquiryRouteGroup {
  tenantId: number;
  managerId: number | null;
  managerMode: 'UNASSIGNED' | 'UNIVERSAL' | 'FULL' | 'PARTIAL' | 'FALLBACK';
  coveredCategoryIds: number[];
  missingCategoryIds: number[];
  items: InquiryRoutingItem[];
}

interface CandidateManager {
  id: number;
  createdAt: Date;
  handlesAllCategories: boolean;
  managedInquiriesCount: number;
  categoryPriorities: Map<number, boolean>;
  productPriorities: Map<number, boolean>;
  categories: Set<number>;
  products: Set<number>;
}

function sortManagers(left: CandidateManager, right: CandidateManager): number {
  if (left.managedInquiriesCount !== right.managedInquiriesCount) {
    return left.managedInquiriesCount - right.managedInquiriesCount;
  }

  return left.createdAt.getTime() - right.createdAt.getTime();
}

function sortWithPriority(
  left: CandidateManager,
  right: CandidateManager,
  getPriority: (manager: CandidateManager) => boolean,
) {
  const leftPriority = getPriority(left);
  const rightPriority = getPriority(right);

  if (leftPriority !== rightPriority) {
    return leftPriority ? -1 : 1;
  }

  return sortManagers(left, right);
}

function pickBestCandidate(
  managers: CandidateManager[],
  getPriority: (manager: CandidateManager) => boolean,
): CandidateManager | null {
  return managers.slice().sort((left, right) => sortWithPriority(left, right, getPriority))[0] ?? null;
}

function getUniqueCategoryIds(items: InquiryRoutingItem[]) {
  return [...new Set(items.map((item) => item.categoryId))];
}

async function getTenantManagers(tenantId: number): Promise<CandidateManager[]> {
  const managers = await prisma.user.findMany({
    where: {
      tenantId,
      role: UserRole.MANAGER,
      banned: false,
    },
    select: {
      id: true,
      createdAt: true,
      handlesAllCategories: true,
      _count: {
        select: {
          managedInquiries: true,
        },
      },
      managerAssignments: {
        select: {
          categoryId: true,
          productId: true,
          isPrimary: true,
        },
      },
    },
  });

  return managers.map((manager) => ({
    id: manager.id,
    createdAt: manager.createdAt,
    handlesAllCategories: manager.handlesAllCategories,
    managedInquiriesCount: manager._count.managedInquiries,
    categories: new Set(
      manager.managerAssignments.flatMap((assignment) =>
        typeof assignment.categoryId === 'number' ? [assignment.categoryId] : [],
      ),
    ),
    products: new Set(
      manager.managerAssignments.flatMap((assignment) =>
        typeof assignment.productId === 'number' ? [assignment.productId] : [],
      ),
    ),
    categoryPriorities: new Map(
      manager.managerAssignments
        .filter((assignment) => Number.isInteger(assignment.categoryId))
        .map((assignment) => [assignment.categoryId as number, assignment.isPrimary]),
    ),
    productPriorities: new Map(
      manager.managerAssignments
        .filter((assignment) => Number.isInteger(assignment.productId))
        .map((assignment) => [assignment.productId as number, assignment.isPrimary]),
    ),
  }));
}

function assignManagerToItem(
  item: InquiryRoutingItem,
  candidates: CandidateManager[],
  universalManagers: CandidateManager[],
  fallbackManager: CandidateManager | null,
) {
  const productCandidates = candidates.filter((candidate) => candidate.products.has(item.productId));
  if (productCandidates.length > 0) {
    return pickBestCandidate(
      productCandidates,
      (candidate) => candidate.productPriorities.get(item.productId) === true,
    );
  }

  const categoryCandidates = candidates.filter((candidate) => candidate.categories.has(item.categoryId));
  if (categoryCandidates.length > 0) {
    return pickBestCandidate(
      categoryCandidates,
      (candidate) => candidate.categoryPriorities.get(item.categoryId) === true,
    );
  }

  if (universalManagers.length > 0) {
    return universalManagers[0];
  }

  return fallbackManager;
}

function buildRouteGroup(
  tenantId: number,
  manager: CandidateManager | null,
  items: InquiryRoutingItem[],
): InquiryRouteGroup {
  const categoryIds = getUniqueCategoryIds(items);

  if (!manager) {
    return {
      tenantId,
      managerId: null,
      managerMode: 'UNASSIGNED',
      coveredCategoryIds: [],
      missingCategoryIds: categoryIds,
      items,
    };
  }

  if (manager.handlesAllCategories) {
    return {
      tenantId,
      managerId: manager.id,
      managerMode: 'UNIVERSAL',
      coveredCategoryIds: categoryIds,
      missingCategoryIds: [],
      items,
    };
  }

  const coveredCategoryIds = [
    ...new Set(
      items
        .filter((item) => manager.products.has(item.productId) || manager.categories.has(item.categoryId))
        .map((item) => item.categoryId),
    ),
  ];
  const missingCategoryIds = categoryIds.filter((categoryId) => !coveredCategoryIds.includes(categoryId));

  let managerMode: InquiryRouteGroup['managerMode'] = 'FALLBACK';
  if (missingCategoryIds.length === 0) {
    managerMode = 'FULL';
  } else if (coveredCategoryIds.length > 0) {
    managerMode = 'PARTIAL';
  }

  return {
    tenantId,
    managerId: manager.id,
    managerMode,
    coveredCategoryIds,
    missingCategoryIds,
    items,
  };
}

async function resolveTenantRoutes(tenantId: number, items: InquiryRoutingItem[]): Promise<InquiryRouteGroup[]> {
  const candidates = await getTenantManagers(tenantId);
  if (candidates.length === 0) {
    return [
      {
        tenantId,
        managerId: null,
        managerMode: 'UNASSIGNED',
        coveredCategoryIds: [],
        missingCategoryIds: getUniqueCategoryIds(items),
        items,
      },
    ];
  }

  const universalManagers = candidates.filter((candidate) => candidate.handlesAllCategories).sort(sortManagers);
  const fallbackManager = candidates.slice().sort(sortManagers)[0] ?? null;
  const managerById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const groupedItems = new Map<number | null, InquiryRoutingItem[]>();

  for (const item of items) {
    const manager = assignManagerToItem(item, candidates, universalManagers, fallbackManager);
    const key = manager?.id ?? null;
    const bucket = groupedItems.get(key) ?? [];
    bucket.push(item);
    groupedItems.set(key, bucket);
  }

  return [...groupedItems.entries()].map(([managerId, routeItems]) =>
    buildRouteGroup(tenantId, managerId === null ? null : (managerById.get(managerId) ?? null), routeItems),
  );
}

export async function resolveInquiryRoutes(items: InquiryRoutingItem[]): Promise<InquiryRouteGroup[]> {
  const groupsByTenant = new Map<number, InquiryRoutingItem[]>();

  for (const item of items) {
    const bucket = groupsByTenant.get(item.fulfillmentTenantId) ?? [];
    bucket.push(item);
    groupsByTenant.set(item.fulfillmentTenantId, bucket);
  }

  const routes: InquiryRouteGroup[] = [];
  for (const [tenantId, tenantItems] of groupsByTenant) {
    const tenantRoutes = await resolveTenantRoutes(tenantId, tenantItems);
    routes.push(...tenantRoutes);
  }

  return routes;
}
