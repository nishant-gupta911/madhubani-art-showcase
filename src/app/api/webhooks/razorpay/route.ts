import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 });
    }

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    await connectToDatabase();

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
      if (!order) {
        console.warn(`Webhook: Order with razorpayOrderId ${razorpayOrderId} not found.`);
        return NextResponse.json({ status: 'ignored' }, { status: 200 });
      }

      // Idempotency check: if already confirmed, do not repeat
      if (order.status === 'confirmed' || order.payment.status === 'paid') {
        return NextResponse.json({ status: 'already_processed' }, { status: 200 });
      }

      order.status = 'confirmed';
      order.payment.status = 'paid';
      order.payment.razorpayPaymentId = razorpayPaymentId;
      order.payment.paidAt = new Date();
      order.expiresAt = null;

      order.statusHistory.push({
        status: 'confirmed',
        at: new Date(),
        note: `Confirmed via Razorpay Webhook (${eventType})`,
      });

      await order.save();

      // Mark original paintings as sold
      for (const item of order.items) {
        if (item.isOriginal) {
          await Product.updateOne({ _id: item.productId }, { $set: { status: 'sold' } });
        }
      }

      // Trigger confirmation email
      await sendOrderConfirmationEmail({
        orderId: order.orderId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        totalPaise: order.totalPaise,
        items: order.items.map(it => ({ name: it.name, qty: it.qty, pricePaise: it.pricePaise })),
        paymentMethod: order.payment.method,
        shippingAddress: order.shippingAddress,
      });

      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      if (razorpayOrderId) {
        const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
        if (order && order.status === 'pending' && !order.stockReleased) {
          order.status = 'cancelled';
          order.payment.status = 'failed';
          order.stockReleased = true;
          order.statusHistory.push({
            status: 'cancelled',
            at: new Date(),
            note: `Payment failed via webhook: ${payment.error_description || 'Declined'}`,
          });
          await order.save();

          // Restore stock
          for (const item of order.items) {
            if (item.isOriginal) {
              await Product.updateOne(
                { _id: item.productId },
                { $inc: { stock: item.qty }, $set: { status: 'published' } }
              );
            }
          }
        }
      }
      return NextResponse.json({ status: 'failure_recorded' }, { status: 200 });
    }

    return NextResponse.json({ status: 'unhandled_event' }, { status: 200 });
  } catch (err: any) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
