export const PACKING_PRICE = 500;
export const DELIVERY_PRICE = 4000;
export const VAT = 20;

export function calcTotalOrder(amount: number) {
  const packingPrice = amount < 300000 ? PACKING_PRICE : 0;
  const deliveryPrice = amount < 100000 ? DELIVERY_PRICE : 0;
  const vatPrice = ((amount + packingPrice + deliveryPrice) * VAT) / 100;
  const totalWithExtras = amount + packingPrice + deliveryPrice;

  return { packingPrice, deliveryPrice, vatPrice, totalWithExtras };
}
