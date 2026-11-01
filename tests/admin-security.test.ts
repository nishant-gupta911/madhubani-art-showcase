import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Import route handlers
import { GET as getProducts, POST as postProduct, PUT as putProduct, DELETE as deleteProduct } from '@/app/api/admin/products/route';
import { GET as getOrders, PUT as putOrder } from '@/app/api/admin/orders/route';
import { GET as getExport } from '@/app/api/admin/export/route';
import { POST as postCloudinarySign } from '@/app/api/admin/cloudinary-sign/route';
import { GET as getSettings, PUT as putSettings } from '@/app/api/admin/settings/route';

describe('Admin Server-Side Route Security', () => {
  it('rejects unauthenticated GET /api/admin/products with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products');
    const res = await getProducts(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('rejects unauthenticated POST /api/admin/products with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Malicious Product' }),
    });
    const res = await postProduct(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated PUT /api/admin/products with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'PUT',
      body: JSON.stringify({ id: '123' }),
    });
    const res = await putProduct(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated DELETE /api/admin/products with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products?id=123', {
      method: 'DELETE',
    });
    const res = await deleteProduct(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated GET /api/admin/orders with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/orders');
    const res = await getOrders(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated PUT /api/admin/orders with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/orders', {
      method: 'PUT',
      body: JSON.stringify({ orderId: 'VE-000000-0000' }),
    });
    const res = await putOrder(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated GET /api/admin/export with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/export?type=orders');
    const res = await getExport(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated POST /api/admin/cloudinary-sign with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/cloudinary-sign', {
      method: 'POST',
    });
    const res = await postCloudinarySign(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated GET /api/admin/settings with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/settings');
    const res = await getSettings(req);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated PUT /api/admin/settings with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ announcement: { text: 'Hacked' } }),
    });
    const res = await putSettings(req);
    expect(res.status).toBe(401);
  });
});
