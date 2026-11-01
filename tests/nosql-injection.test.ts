import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

import { POST as postLogin } from '@/app/api/admin/auth/route';
import { GET as getTrack } from '@/app/api/orders/track/route';
import { POST as postCheckout } from '@/app/api/checkout/route';
import { POST as postContact } from '@/app/api/contact/route';
import { GET as getAvailability } from '@/app/api/availability/route';

describe('NoSQL Injection Resilience & Input Sanitization', () => {
  it('1. Rejects NoSQL injection object in admin login {"$ne": null}', async () => {
    const maliciousPayload = {
      email: { $ne: null },
      password: { $gt: '' },
    };
    const req = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });
    const res = await postLogin(req);
    // Zod schema must reject non-string inputs with 400
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('2. Rejects malicious query params in order tracking', async () => {
    // NextRequest URL params are parsed as strings, preventing object injection
    const req = new NextRequest('http://localhost:3000/api/orders/track?orderId[$ne]=null&phone[$gt]=0');
    const res = await getTrack(req);
    // Since orderId and phone will be null/undefined or string literal "undefined", it must fail safely
    expect([400, 404]).toContain(res.status);
  });

  it('3. Rejects NoSQL injection object in checkout {"$ne": null}', async () => {
    const maliciousPayload = {
      customer: {
        name: { $ne: null },
        phone: '9876543210',
        email: 'attacker@example.com',
      },
      shippingAddress: {
        line1: '123 Fake St',
        city: 'Patna',
        state: 'Bihar',
        pincode: '800001',
      },
      items: [{ productId: { $ne: null }, qty: 1 }],
      paymentMethod: 'cod',
    };
    const req = new NextRequest('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });
    const res = await postCheckout(req);
    expect(res.status).toBe(400);
  });

  it('4. Rejects NoSQL injection in contact / commission form', async () => {
    const maliciousPayload = {
      name: { $gt: '' },
      email: { $ne: null },
      message: { $where: 'sleep(5000)' },
    };
    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(maliciousPayload),
    });
    const res = await postContact(req);
    expect(res.status).toBe(400);
  });

  it('5. Handles malformed or injection strings in availability check safely', async () => {
    const req = new NextRequest('http://localhost:3000/api/availability?id[$ne]=null');
    const res = await getAvailability(req);
    expect([400, 404]).toContain(res.status);
  });
});
