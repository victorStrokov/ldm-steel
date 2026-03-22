import { calculatePrice } from '@/shared/lib/calculate-price';

describe('calculatePrice', () => {
  it('returns a number in expected range for STEEL base config', () => {
    const price = calculatePrice({
      productMaterials: 'STEEL',
      steelSize: 3,
      productLength: 2,
      productThickness: 1,
      productShape: 1,
      productColor: 2,
    });

    // Formula without random: 200 + 100 + 30 + 40 + 25 + 15 + 10 = 420
    // randomOffset is 0..49 in current implementation.
    expect(price).toBeGreaterThanOrEqual(420);
    expect(price).toBeLessThanOrEqual(469);
  });

  it('grows when productLength increases with same other params', () => {
    const short = calculatePrice({ productMaterials: 'PVC', pvcSize: 2, productLength: 1 });
    const long = calculatePrice({ productMaterials: 'PVC', pvcSize: 2, productLength: 3 });

    // Length contributes +20 per step, so long should be at least as high as short.
    expect(long).toBeGreaterThanOrEqual(short);
  });
});
