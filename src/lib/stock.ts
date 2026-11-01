import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

/**
 * Scans for expired unpaid orders (older than 15 minutes) and restores
 * their atomically reserved inventory back to the catalog.
 */
export async function releaseExpiredOrdersStock(): Promise<{
  releasedOrdersCount: number;
  restoredItemsCount: number;
}> {
  await connectToDatabase();

  const now = new Date();
  // Find pending unpaid orders past their expiration date whose stock has not been released yet
  const expiredOrders = await Order.find({
    status: 'pending',
    'payment.status': { $in: ['pending', 'failed'] },
    expiresAt: { $lte: now },
    stockReleased: { $ne: true },
  });

  let releasedOrdersCount = 0;
  let restoredItemsCount = 0;

  for (const order of expiredOrders) {
    for (const item of order.items) {
      if (item.productId) {
        // Increment stock back up atomically
        const updateQuery: any = { $inc: { stock: item.qty } };
        // If it was an original painting marked sold, reactivate it
        if (item.isOriginal) {
          updateQuery.$set = { status: 'published' };
        }

        await Product.updateOne(
          {
            $or: [
              { _id: item.productId.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null },
              { ref: item.ref || item.productId },
              { slug: item.slug || item.productId },
            ],
          },
          updateQuery
        );
        restoredItemsCount += item.qty;
      }
    }

    order.status = 'cancelled';
    order.stockReleased = true;
    order.statusHistory.push({
      status: 'cancelled',
      at: now,
      note: 'Payment window expired (15m). Reserved stock automatically released back to catalog.',
    });

    await order.save();
    releasedOrdersCount++;
  }

  return { releasedOrdersCount, restoredItemsCount };
}
