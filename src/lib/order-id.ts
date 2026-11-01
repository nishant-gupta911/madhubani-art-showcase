/**
 * Generates an order ID adhering to format VE-YYMMDD-####
 * e.g. VE-261031-1042
 */
export function generateOrderId(sequenceNumber?: number): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const randomSeq = sequenceNumber
    ? String(sequenceNumber).padStart(4, '0')
    : String(Math.floor(1000 + Math.random() * 9000));

  return `VE-${yy}${mm}${dd}-${randomSeq}`;
}

export function isValidOrderId(orderId: string): boolean {
  return /^VE-\d{6}-\d{4}$/.test(orderId);
}
