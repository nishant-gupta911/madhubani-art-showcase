import { describe, it, expect } from 'vitest';
import { generateOrderId, isValidOrderId } from '@/lib/order-id';

describe('Order ID Generator', () => {
  it('should generate order ID matching VE-YYMMDD-#### pattern', () => {
    const orderId = generateOrderId();
    expect(orderId).toMatch(/^VE-\d{6}-\d{4}$/);
  });

  it('should include correct current date in YYMMDD format', () => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const expectedPrefix = `VE-${yy}${mm}${dd}-`;

    const orderId = generateOrderId();
    expect(orderId.startsWith(expectedPrefix)).toBe(true);
  });

  it('should generate distinct IDs with sequence or unique randoms', () => {
    const ids = new Set();
    for (let i = 1; i <= 50; i++) {
      const id = generateOrderId(i);
      expect(isValidOrderId(id)).toBe(true);
      ids.add(id);
    }
    expect(ids.size).toBe(50);
  });
});
