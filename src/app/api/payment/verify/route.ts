import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import { sendOrderConfirmationEmail } from '@/lib/mail';

const VerifyPaymentSchema = z.object({
  orderId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = VerifyPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid verification payload' }, { status: 400 });
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = validation.data;

    await connectToDatabase();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'confirmed' || order.payment.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Order is already confirmed', orderId });
    }

    // Verify HMAC signature
    const isSignatureValid = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // In production, fallback is strictly forbidden
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
          { error: 'Payment gateway credentials missing in production environment' },
          { status: 500 }
        );
      }
      if (razorpay_order_id.startsWith('order_sim_') || !isSignatureValid) {
        return NextResponse.json(
          { error: 'Payment signature verification failed. Order cannot be marked as paid.' },
          { status: 400 }
        );
      }
    } else {
      const isSimulated = razorpay_order_id.startsWith('order_sim_');
      if (!isSignatureValid && !isSimulated) {
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
      }
    }

    // Update Order to Confirmed and Paid
    order.status = 'confirmed';
    order.payment.status = 'paid';
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.paidAt = new Date();
    order.expiresAt = null; // Clear TTL

    order.statusHistory.push({
      status: 'confirmed',
      at: new Date(),
      note: `Payment verified successfully (ID: ${razorpay_payment_id})`,
    });

    await order.save();

    // Mark original paintings as sold
    for (const item of order.items) {
      if (item.isOriginal) {
        await Product.updateOne({ _id: item.productId }, { $set: { status: 'sold' } });
      }
    }

    // Send confirmation emails
    await sendOrderConfirmationEmail({
      orderId: order.orderId,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      totalPaise: order.totalPaise,
      items: order.items.map(it => ({ name: it.name, qty: it.qty, pricePaise: it.pricePaise })),
      paymentMethod: order.payment.method,
      shippingAddress: order.shippingAddress,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: 'Payment verified and order confirmed successfully',
    });
  } catch (err: any) {
    console.error('Payment verify error:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
