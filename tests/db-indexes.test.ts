import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import { Order } from '../src/models/Order';

describe('MongoDB Query Index Performance (IXSCAN Validation)', () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vernika_store';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
    // Ensure indexes are synced
    await Product.syncIndexes();
    await Order.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('1. Product find by slug uses IXSCAN (Index Scan)', async () => {
    const explainResult: any = await Product.find({ slug: 'surya-deepavali-maiden-3-panel-wall-hanging-organizer' })
      .explain('executionStats');

    const winningPlan = explainResult.queryPlanner?.winningPlan;
    const stage = winningPlan?.inputStage?.stage || winningPlan?.stage;

    expect(stage).toMatch(/IXSCAN/);
    expect(stage).not.toBe('COLLSCAN');
  });

  it('2. Product find by category and active status uses index', async () => {
    const explainResult: any = await Product.find({ category: 'paintings', active: true })
      .explain('executionStats');

    const winningPlan = explainResult.queryPlanner?.winningPlan;
    const stage = winningPlan?.inputStage?.stage || winningPlan?.stage;

    expect(stage).toMatch(/IXSCAN/);
    expect(stage).not.toBe('COLLSCAN');
  });

  it('3. Order lookup by orderId uses IXSCAN', async () => {
    const explainResult: any = await Order.find({ orderId: 'VE-261101-0001' })
      .explain('executionStats');

    const winningPlan = explainResult.queryPlanner?.winningPlan;
    const stage = winningPlan?.inputStage?.stage || winningPlan?.stage;

    expect(stage).toMatch(/IXSCAN/);
    expect(stage).not.toBe('COLLSCAN');
  });
});
