import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Otp } from '@/models/Otp';
import { Order } from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/mail';

const VerifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  orderId: z.string().optional(),
  purpose: z.enum(['cod_verification', 'login']).default('cod_verification'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = VerifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid phone or OTP code format' }, { status: 400 });
    }

    const { phone, otp, orderId, purpose } = validation.data;

    await connectToDatabase();

    const otpRecord = await Otp.findOne({
      phone,
      otp,
      purpose,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new code.' }, { status: 400 });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // If this OTP is confirming a COD order:
    if (orderId) {
      const order = await Order.findOne({ orderId, 'customer.phone': phone });
      if (!order) {
        return NextResponse.json({ error: 'Associated COD order not found' }, { status: 404 });
      }

      order.status = 'confirmed';
      order.payment.status = 'cod_pending';
      order.expiresAt = null;

      order.statusHistory.push({
        status: 'confirmed',
        at: new Date(),
        note: 'Phone OTP verified by customer for Cash on Delivery',
      });

      await order.save();

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

      return NextResponse.json({
        success: true,
        message: 'Phone verified and COD order confirmed successfully',
        orderId: order.orderId,
      });
    }

    return NextResponse.json({ success: true, message: 'Phone number verified successfully' });
  } catch (err: any) {
    console.error('OTP Verify error:', err);
    return NextResponse.json({ error: err.message || 'OTP verification failed' }, { status: 500 });
  }
}
