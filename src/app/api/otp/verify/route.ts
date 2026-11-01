import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Otp } from '@/models/Otp';
import { Order } from '@/models/Order';
import { sendOrderConfirmationEmail } from '@/lib/mail';
import { checkRateLimit } from '@/lib/ratelimit';

const VerifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  orderId: z.string().optional(),
  purpose: z.enum(['cod_verification', 'login']).default('cod_verification'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`otp_verify_${ip}`, 10, 60);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many verification attempts. Please wait.' }, { status: 429 });
    }

    const body = await req.json();
    const validation = VerifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid phone or OTP code format' }, { status: 400 });
    }

    const { phone, otp, orderId, purpose } = validation.data;

    await connectToDatabase();

    const activeOtp = await Otp.findOne({
      phone,
      purpose,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!activeOtp) {
      return NextResponse.json({ error: 'No active OTP found or code expired. Please request a new code.' }, { status: 400 });
    }

    // Check attempt lockout
    if (activeOtp.attempts >= 5) {
      await Otp.deleteOne({ _id: activeOtp._id });
      return NextResponse.json({
        error: 'Too many incorrect attempts (5/5). This OTP has been invalidated for security. Please request a new code.'
      }, { status: 429 });
    }

    if (activeOtp.otp !== otp) {
      activeOtp.attempts += 1;
      await activeOtp.save();
      const remaining = 5 - activeOtp.attempts;
      if (remaining <= 0) {
        await Otp.deleteOne({ _id: activeOtp._id });
        return NextResponse.json({
          error: 'Maximum attempts exceeded. This OTP has been invalidated. Please request a new code.'
        }, { status: 429 });
      }
      return NextResponse.json({
        error: `Incorrect OTP code. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
      }, { status: 400 });
    }

    // Mark OTP as verified
    activeOtp.verified = true;
    await activeOtp.save();

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
