import { describe, it, expect } from 'vitest';
import { sendOrderConfirmationEmail, sendOrderShippedEmail } from '../src/lib/mail';

describe('Transactional Email Template Rendering', () => {
  const sampleOrder = {
    orderId: 'VE-261101-0099',
    customerName: 'Pooja Verma',
    customerEmail: 'pooja.verma@example.com',
    totalPaise: 450000, // ₹4,500
    items: [
      { name: 'Sacred Kohbar Lotus Mandalas', qty: 1, pricePaise: 450000 }
    ],
    paymentMethod: 'razorpay',
    shippingAddress: {
      line1: 'B-402, Sunrise Towers, Boring Road',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800001',
    },
    trackingNumber: 'DTDC-992144',
    courier: 'DTDC Express',
  };

  it('1. Order confirmation template executes and handles dev fallback cleanly', async () => {
    const success = await sendOrderConfirmationEmail(sampleOrder);
    expect(success).toBe(true);
  });

  it('2. Order shipped template executes with courier details and returns true', async () => {
    const success = await sendOrderShippedEmail(sampleOrder);
    expect(success).toBe(true);
  });
});
