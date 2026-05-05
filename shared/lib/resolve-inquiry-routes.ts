import { prisma } from '@/prisma/prisma-client';
import { UserRole } from '@prisma/client';

export interface InquiryRoutingItem {
  productId: number;
  categoryId: number;
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

  if (leftPriority && !rightPriority) return -1;
  if (!leftPriority && rightPriority) return 1;

  return sortManagers(left, right);
}

function pickBestCandidate(
  managers: CandidateManager[],
  getPriority: (manager: CandidateManager) => boolean,
): CandidateManager | null {
  const sorted = managers.slice().sort((left, right) => sortWithPriority(left, right, getPriority));
  return sorted[0] ?? null;
}

async function resolveManagerForTenant(
  tenantId: number,
  items: InquiryRoutingItem[],
): Promise<Omit<InquiryRouteGroup, 'items'>> {
  const normalizedItems = items.filter((item) => Number.isInteger(item.productId) && Number.isInteger(item.categoryId));
  const uniqueCategoryIds = [...new Set(normalizedItems.map((item) => item.categoryId))];

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

  if (managers.length === 0) {
    return {
      tenantId,
      managerId: null,
      managerMode: 'UNASSIGNED',
      coveredCategoryIds: [],
      missingCategoryIds: uniqueCategoryIds,
    };
  }

  const candidates: CandidateManager[] = managers.map((manager) => ({
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

  const universalManagers = candidates.filter((candidate) => candidate.handlesAllCategories).sort(sortManagers);
  const resolvedManagers = normalizedItems
    .map((item) => {
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

      return null;
    })
    .filter((manager): manager is CandidateManager => Boolean(manager));

  const uniqueResolvedManagerIds = [...new Set(resolvedManagers.map((manager) => manager.id))];

  if (uniqueResolvedManagerIds.length === 1 && resolvedManagers.length === normalizedItems.length) {
    return {
      tenantId,
      managerId: uniqueResolvedManagerIds[0],
      managerMode: 'FULL',
      coveredCategoryIds: uniqueCategoryIds,
      missingCategoryIds: [],
    };
  }

  if (
    universalManagers.length > 0 &&
    (uniqueResolvedManagerIds.length > 1 || resolvedManagers.length < normalizedItems.length)
  ) {
    return {
      tenantId,
      managerId: universalManagers[0].id,
      managerMode: 'UNIVERSAL',
      coveredCategoryIds: uniqueCategoryIds,
      missingCategoryIds: [],
    };
  }

  if (uniqueCategoryIds.length > 0) {
    const fullCoverageManagers = candidates
      .filter((candidate) => uniqueCategoryIds.every((categoryId) => candidate.categories.has(categoryId)))
      .sort(sortManagers);

    if (fullCoverageManagers.length > 0) {
      return {
        tenantId,
        managerId: fullCoverageManagers[0].id,
        managerMode: 'FULL',
        coveredCategoryIds: uniqueCategoryIds,
        missingCategoryIds: [],
      };
    }

    const partialCoverageManagers = candidates
      .map((candidate) => ({
        candidate,
        coverage: uniqueCategoryIds.filter((categoryId) => candidate.categories.has(categoryId)).length,
      }))
      .filter((item) => item.coverage > 0)
      .sort((left, right) => {
        if (left.coverage !== right.coverage) {
          return right.coverage - left.coverage;
        }
        return sortManagers(left.candidate, right.candidate);
      });

    if (partialCoverageManagers.length > 0) {
      const winner = partialCoverageManagers[0].candidate;
      const coveredCategoryIds = uniqueCategoryIds.filter((categoryId) => winner.categories.has(categoryId));
      const missingCategoryIds = uniqueCategoryIds.filter((categoryId) => !winner.categories.has(categoryId));

      return {
        tenantId,
        managerId: winner.id,
        managerMode: 'PARTIAL',
        coveredCategoryIds,
        missingCategoryIds,
      };
    }
  }

  const fallbackManager = candidates.sort(sortManagers)[0];
  return {
    tenantId,
    managerId: fallbackManager?.id ?? null,
    managerMode: fallbackManager ? 'FALLBACK' : 'UNASSIGNED',
    coveredCategoryIds: [],
    missingCategoryIds: uniqueCategoryIds,
  };
}

/**
 * Разбивает товары по tenantId (исполняющей компании) и маршрутизирует в каждой группе независимо
 */
export async function resolveInquiryRoutes(items: InquiryRoutingItem[]): Promise<InquiryRouteGroup[]> {
  // Группируем по tenantId (исполняющей компании)
  const groupsByTenant = new Map<number, InquiryRoutingItem[]>();

  for (const item of items) {
    const tenantId = item.fulfillmentTenantId;
    if (!groupsByTenant.has(tenantId)) {
      groupsByTenant.set(tenantId, []);
    }
    groupsByTenant.get(tenantId)!.push(item);
  }

  // Для каждой группы находим менеджера в этом тенанте
  const routes: InquiryRouteGroup[] = [];

  for (const [tenantId, groupItems] of groupsByTenant) {
    const resolution = await resolveManagerForTenant(tenantId, groupItems);
    routes.push({
      ...resolution,
      items: groupItems,
    });
  }

  return routes;
}
