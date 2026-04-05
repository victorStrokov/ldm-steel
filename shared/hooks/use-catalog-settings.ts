'use client';

import React from 'react';
import { CatalogSettings, DEFAULT_CATALOG_SETTINGS } from '@/shared/lib/catalog-mode';
import { getCatalogSettings } from '@/app/actions/get-catalog-settings';

/**
 * Reads current catalog settings (priceMode / checkoutMode) once on mount.
 * Starts with DEFAULT_CATALOG_SETTINGS so the first render already shows
 * the correct B2B mode without a visual flash.
 */
export function useCatalogSettings(): CatalogSettings {
  const [settings, setSettings] = React.useState<CatalogSettings>(DEFAULT_CATALOG_SETTINGS);

  React.useEffect(() => {
    getCatalogSettings().then(setSettings);
  }, []);

  return settings;
}
