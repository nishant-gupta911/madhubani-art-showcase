import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { verifyAdminRequest } from '@/lib/auth';
import { sendOrderShippedEmail } from '@/lib/mail';

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status, courier, trackingNumber, note } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = order.status;

    if (status) {
      order.status = status;
    }

    if (courier || trackingNumber) {
      order.tracking = {
        courier: courier || order.tracking?.courier,
        number: trackingNumber || order.tracking?.number,
        url: trackingNumber
          ? `https://www.shiprocket.in/shipment-tracking/${trackingNumber}`
          : order.tracking?.url,
      };
    }

    order.statusHistory.push({
      status: status || order.status,
      at: new Date(),
      note: note || (status === 'shipped' ? `Dispatched via ${courier || 'Courier'}. AWB: ${trackingNumber}` : `Status updated to ${status}`),
    });

    await order.save();

    // Trigger Shipped Email notification if status transitioned to shipped
    if (status === 'shipped' && previousStatus !== 'shipped') {
      await sendOrderShippedEmail({
        orderId: order.orderId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        totalPaise: order.totalPaise,
        items: order.items.map(it => ({ name: it.name, qty: it.qty, pricePaise: it.pricePaise })),
        paymentMethod: order.payment.method,
        shippingAddress: order.shippingAddress,
        courier: order.tracking?.courier,
        trackingNumber: order.tracking?.number,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${order.orderId} updated to ${order.status}`,
      order,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
