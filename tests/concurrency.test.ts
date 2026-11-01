import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { releaseExpiredOrdersStock } from '@/lib/stock';

const TEST_MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vernika_concurrency_test';
process.env.MONGODB_URI = TEST_MONGO_URI;

describe('Concurrency & Stock Reservation / Release', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_MONGO_URI);
    }
  });

  afterAll(async () => {
    await Product.deleteMany({ ref: 'TEST-CONCURRENCY-P01' });
    await Order.deleteMany({ orderId: { $regex: /^VE-TEST-/ } });
    await mongoose.disconnect();
  });

  it('concurrency test: two buyers, stock=1, exactly one succeeds', async () => {
    // 1. Create a unique test product with stock = 1
    await Product.deleteMany({ ref: 'TEST-CONCURRENCY-P01' });
    const product = await Product.create({
      ref: 'TEST-CONCURRENCY-P01',
      name: 'Concurrent Peacock Original',
      slug: 'concurrent-peacock-original',
      category: 'paintings',
      subCategory: 'peacock_and_birds',
      type: 'original_painting',
      stock: 1,
      price: 249900,
      dimensions: { displayString: '12 x 16 in' },
      technique: 'Kachni line work',
      material: 'Handmade bamboo paper',
      description: 'Original handpainted piece',
      story: 'Traditional peacocks in harmony',
      status: 'published',
    });

    // 2. Simulate two buyers attempting to atomically decrement stock simultaneously
    const buyer1Attempt = Product.findOneAndUpdate(
      { _id: product._id, stock: { $gte: 1 } },
      { $inc: { stock: -1 }, $set: { status: 'sold' } },
      { returnDocument: 'after' }
    );

    const buyer2Attempt = Product.findOneAndUpdate(
      { _id: product._id, stock: { $gte: 1 } },
      { $inc: { stock: -1 }, $set: { status: 'sold' } },
      { returnDocument: 'after' }
    );

    const [buyer1Res, buyer2Res] = await Promise.all([buyer1Attempt, buyer2Attempt]);

    // Exactly one must succeed (non-null), the other must fail (null)
    const successCount = [buyer1Res, buyer2Res].filter(Boolean).length;
    const failureCount = [buyer1Res, buyer2Res].filter(res => res === null).length;

    expect(successCount).toBe(1);
    expect(failureCount).toBe(1);

    // Final product stock in DB must be exactly 0
    const finalProduct = await Product.findById(product._id);
    expect(finalProduct?.stock).toBe(0);
    expect(finalProduct?.status).toBe('sold');
  });

  it('concurrency test: 20 parallel buyers for stock=1; exactly 1 succeeds, 19 fail, stock never negative', async () => {
    await Product.deleteMany({ ref: 'TEST-CONCURRENCY-20' });
    const product = await Product.create({
      ref: 'TEST-CONCURRENCY-20',
      name: 'High Contention Statement Piece',
      slug: 'high-contention-statement-piece',
      category: 'paintings',
      subCategory: 'large_statement_pieces',
      type: 'original_painting',
      stock: 1,
      price: 849900,
      dimensions: { displayString: '24 x 36 in' },
      technique: 'Bharni full color',
      material: 'Handmade paper',
      description: 'Grand statement original',
      story: 'Traditional festival harmony',
      status: 'published',
    });

    // Launch 20 concurrent atomic reservations
    const attempts = Array.from({ length: 20 }, () =>
      Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: 1 } },
        { $inc: { stock: -1 }, $set: { status: 'sold' } },
        { returnDocument: 'after' }
      )
    );

    const results = await Promise.all(attempts);

    const successes = results.filter(Boolean);
    const failures = results.filter((res) => res === null);

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(19);

    const finalProduct = await Product.findById(product._id);
    expect(finalProduct?.stock).toBe(0);
    expect(finalProduct?.status).toBe('sold');

    await Product.deleteMany({ ref: 'TEST-CONCURRENCY-20' });
  });

  it('stock release test: releases stock for abandoned unpaid orders after 15 minutes', async () => {
    // 1. Create product with stock = 0 (as if claimed by a buyer)
    await Product.deleteMany({ ref: 'TEST-CONCURRENCY-P02' });
    const product = await Product.create({
      ref: 'TEST-CONCURRENCY-P02',
      name: 'Abandoned Lotus Painting',
      slug: 'abandoned-lotus-painting',
      category: 'paintings',
      subCategory: 'fish',
      type: 'original_painting',
      stock: 0,
      price: 199900,
      dimensions: { displayString: '10 x 14 in' },
      technique: 'Bharni solid pigment fill',
      material: 'Handmade cotton rag paper',
      description: 'Handpainted fish mandala',
      story: 'Sacred aquatic life in Mithila folk tradition',
      status: 'sold',
    });

    // 2. Create an abandoned pending order expired 16 minutes ago
    const expiredOrder = await Order.create({
      orderId: 'VE-TEST-EXPIRED-001',
      customer: {
        name: 'Abandoned Buyer',
        phone: '9876543210',
        email: 'buyer@example.com',
      },
      shippingAddress: {
        line1: '123 Test St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
      },
      items: [
        {
          productId: product._id.toString(),
          ref: product.ref,
          name: product.name,
          slug: product.slug,
          image: '/products/1.webp',
          pricePaise: product.price,
          qty: 1,
          isOriginal: true,
        },
      ],
      subtotalPaise: 199900,
      totalPaise: 199900,
      payment: {
        method: 'razorpay',
        status: 'pending',
      },
      status: 'pending',
      expiresAt: new Date(Date.now() - 16 * 60 * 1000), // 16 minutes in the past
      stockReleased: false,
    });

    // 3. Trigger stock release
    const result = await releaseExpiredOrdersStock();
    expect(result.releasedOrdersCount).toBeGreaterThanOrEqual(1);

    // 4. Verify product stock is restored back to 1 and active
    const restoredProduct = await Product.findById(product._id);
    expect(restoredProduct?.stock).toBe(1);
    expect(restoredProduct?.status).toBe('published');

    // 5. Verify order is marked cancelled and stockReleased: true
    const updatedOrder = await Order.findById(expiredOrder._id);
    expect(updatedOrder?.status).toBe('cancelled');
    expect(updatedOrder?.stockReleased).toBe(true);

    // Cleanup
    await Product.findByIdAndDelete(product._id);
    await Order.findByIdAndDelete(expiredOrder._id);
  });
});
