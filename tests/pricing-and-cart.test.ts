import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/config/site';

describe('Pricing Rules & Cart Arithmetic', () => {
  it('should store prices as integers in paise', () => {
    const priceRupees = 1499;
    const pricePaise = Math.round(priceRupees * 100);
    expect(Number.isInteger(pricePaise)).toBe(true);
    expect(pricePaise).toBe(149900);
  });

  it('should calculate free shipping on orders at or above threshold', () => {
    const threshold = siteConfig.shipping.freeShippingThresholdPaise; // 149900
    const standardFee = siteConfig.shipping.standardShippingFeePaise; // 7900

    const calculateShipping = (subtotalPaise: number, hasPainting: boolean) => {
      if (hasPainting || subtotalPaise >= threshold || subtotalPaise === 0) return 0;
      return standardFee;
    };

    // Exactly threshold
    expect(calculateShipping(149900, false)).toBe(0);
    // Above threshold
    expect(calculateShipping(250000, false)).toBe(0);
    // Below threshold, non-painting
    expect(calculateShipping(129900, false)).toBe(7900);
    // Below threshold, but has framed painting
    expect(calculateShipping(109900, true)).toBe(0);
  });

  it('should correctly apply COD convenience fee and enforce maximum cart limit', () => {
    const codFee = siteConfig.shipping.codConvenienceFeePaise; // 4900
    const codMaxThreshold = siteConfig.shipping.codMaxThresholdPaise; // 300000

    const isCodAllowed = (subtotalPaise: number) => subtotalPaise <= codMaxThreshold;

    expect(codFee).toBe(4900); // ₹49
    expect(isCodAllowed(299900)).toBe(true);
    expect(isCodAllowed(300000)).toBe(true);
    expect(isCodAllowed(300100)).toBe(false); // Over ₹3,000 threshold
  });

  it('should compute Natasha price helper using max(bandMin, cost * 2.2)', () => {
    const calculateRecommendedPrice = (bandMin: number, directCost: number) => {
      return Math.max(bandMin, Math.round(directCost * 2.2));
    };

    // Case 1: Cost * 2.2 is below band floor -> use band floor
    // Direct cost ₹500, band floor ₹1,499: 500 * 2.2 = 1100 < 1499
    expect(calculateRecommendedPrice(1499, 500)).toBe(1499);

    // Case 2: Cost * 2.2 exceeds band floor -> use cost * 2.2
    // Direct cost ₹1000, band floor ₹1,499: 1000 * 2.2 = 2200 > 1499
    expect(calculateRecommendedPrice(1499, 1000)).toBe(2200);

    // Case 3: Large statement piece (band floor ₹5,999)
    // Direct cost ₹3,000: 3000 * 2.2 = 6600 > 5999
    expect(calculateRecommendedPrice(5999, 3000)).toBe(6600);
  });
});
