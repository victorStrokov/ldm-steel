'use server';

import { prisma } from '@/prisma/prisma-client';
import {
  DEFAULT_CATALOG_SETTINGS,
  type CatalogSettings,
  type CheckoutMode,
  type PriceMode,
} from '@/shared/lib/catalog-mode';

export async function getCatalogSettings(): Promise<CatalogSettings> {
  const tenantId = Number(process.env.LDM_TENANT_ID);
  if (!tenantId) return DEFAULT_CATALOG_SETTINGS;

  const row = await prisma.tenantSettings.findUnique({ where: { tenantId } });
  if (!row) return DEFAULT_CATALOG_SETTINGS;

  return {
    priceMode: row.priceMode as PriceMode,
    checkoutMode: row.checkoutMode as CheckoutMode,
  };
}
