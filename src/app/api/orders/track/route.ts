import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { checkRateLimit } from '@/lib/ratelimit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId')?.trim().toUpperCase();
    const phone = searchParams.get('phone')?.trim();

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: 'Both Order ID (e.g. VE-YYMMDD-####) and Phone Number are required' },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`track_${ip}`, 15, 60);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many lookup requests. Please try again later.' }, { status: 429 });
    }

    await connectToDatabase();

    const order = await Order.findOne({
      orderId,
      'customer.phone': phone,
    }).select('-__v');

    if (!order) {
      return NextResponse.json(
        { error: 'No order found matching this Order ID and phone number combination. Please double check.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        date: order.createdAt,
        status: order.status,
        customerName: order.customer.name,
        items: order.items.map(it => ({
          name: it.name,
          qty: it.qty,
          image: it.image,
          pricePaise: it.pricePaise,
        })),
        totalPaise: order.totalPaise,
        paymentMethod: order.payment.method,
        paymentStatus: order.payment.status,
        shippingAddress: {
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode,
        },
        tracking: order.tracking,
        statusHistory: order.statusHistory,
      },
    });
  } catch (err: any) {
    console.error('Order tracking error:', err);
    return NextResponse.json({ error: err.message || 'Tracking lookup failed' }, { status: 500 });
  }
}
