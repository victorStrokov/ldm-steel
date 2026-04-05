export const PRICE_MODES = ['visible', 'hidden', 'request'] as const;
export const CHECKOUT_MODES = ['order', 'inquiry'] as const;

export type PriceMode = (typeof PRICE_MODES)[number];
export type CheckoutMode = (typeof CHECKOUT_MODES)[number];

export interface CatalogSettings {
  priceMode: PriceMode;
  checkoutMode: CheckoutMode;
}

export const DEFAULT_CATALOG_SETTINGS: CatalogSettings = {
  priceMode: 'request',
  checkoutMode: 'inquiry',
};

export function isPriceMode(value: string): value is PriceMode {
  return PRICE_MODES.includes(value as PriceMode);
}

export function isCheckoutMode(value: string): value is CheckoutMode {
  return CHECKOUT_MODES.includes(value as CheckoutMode);
}

export function canShowPrices(priceMode: PriceMode): boolean {
  return priceMode === 'visible';
}

export function shouldShowPriceOnRequestLabel(priceMode: PriceMode): boolean {
  return priceMode === 'request';
}

export function isInquiryMode(checkoutMode: CheckoutMode): boolean {
  return checkoutMode === 'inquiry';
}
