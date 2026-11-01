import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 });

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Items',
      'Total Items',
      'Subtotal (INR)',
      'Shipping (INR)',
      'COD Fee (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Courier',
      'Tracking Number',
      'Delivery Address',
      'City',
      'State',
      'Pincode',
    ];

    const escapeCsv = (str: any) => {
      const s = String(str ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = orders.map(o => {
      const itemsSummary = o.items.map(it => `${it.name} (x${it.qty})`).join('; ');
      const totalQty = o.items.reduce((sum, it) => sum + it.qty, 0);

      return [
        escapeCsv(o.orderId),
        escapeCsv(o.createdAt.toISOString().split('T')[0]),
        escapeCsv(o.customer.name),
        escapeCsv(o.customer.phone),
        escapeCsv(o.customer.email),
        escapeCsv(itemsSummary),
        totalQty,
        (o.subtotalPaise / 100).toFixed(2),
        (o.shippingPaise / 100).toFixed(2),
        (o.codFeePaise / 100).toFixed(2),
        (o.totalPaise / 100).toFixed(2),
        escapeCsv(o.payment.method.toUpperCase()),
        escapeCsv(o.payment.status),
        escapeCsv(o.status),
        escapeCsv(o.tracking?.courier || ''),
        escapeCsv(o.tracking?.number || ''),
        escapeCsv(o.shippingAddress.line1),
        escapeCsv(o.shippingAddress.city),
        escapeCsv(o.shippingAddress.state),
        escapeCsv(o.shippingAddress.pincode),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const filename = `vernika-orders-${new Date().toISOString().split('T')[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
