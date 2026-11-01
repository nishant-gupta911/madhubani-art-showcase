import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { generateOrderId } from '@/lib/order-id';
import { getRazorpayClient } from '@/lib/razorpay';
import { checkRateLimit } from '@/lib/ratelimit';
import { siteConfig } from '@/config/site';
import { releaseExpiredOrdersStock } from '@/lib/stock';

const CheckoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number is required'),
    email: z.string().email('Valid email address is required'),
  }),
  shippingAddress: z.object({
    line1: z.string().min(3, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN code is required'),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().int().min(1),
      framing: z.string().optional(),
    })
  ).min(1, 'Cart cannot be empty'),
  paymentMethod: z.enum(['razorpay', 'cod']),
  giftWrap: z.boolean().optional(),
  giftNote: z.string().max(250).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`checkout_${ip}`, 10, 60);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = CheckoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid checkout data', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items: clientItems, paymentMethod, giftWrap, giftNote } = validation.data;

    await connectToDatabase();

    // Lazy cleanup: Release stock for any abandoned checkout orders older than 15 minutes
    await releaseExpiredOrdersStock().catch(err => console.error('Lazy stock release error:', err));

    // 2. Recompute Prices and Verify Stock on Server
    let subtotalPaise = 0;
    let hasPainting = false;
    const verifiedItems = [];

    for (const item of clientItems) {
      // Find by ID, ref, or slug
      const product = await Product.findOne({
        $or: [{ _id: item.productId.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null }, { ref: item.productId }, { slug: item.productId }],
        deletedAt: null,
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (product.status === 'sold' || (product.type === 'original_painting' && product.stock <= 0)) {
        return NextResponse.json(
          { error: `"${product.name}" has just been sold! Please remove it from your cart.` },
          { status: 409 }
        );
      }

      if (product.type !== 'made_to_order' && product.stock < item.qty) {
        return NextResponse.json(
          { error: `Only ${product.stock} left in stock for "${product.name}".` },
          { status: 409 }
        );
      }

      if (product.category === 'paintings') {
        hasPainting = true;
      }

      // Framing price adjustment for paintings (rolled saves ₹300)
      let unitPricePaise = product.price;
      if (product.category === 'paintings' && item.framing === 'rolled') {
        unitPricePaise = Math.max(10000, product.price - 30000);
      }

      subtotalPaise += unitPricePaise * item.qty;

      const heroImg = product.images.find(img => img.isHero) || product.images[0];
      verifiedItems.push({
        productId: product._id.toString(),
        ref: product.ref,
        name: product.name,
        slug: product.slug,
        image: heroImg?.url || '/products/1.webp',
        pricePaise: unitPricePaise,
        qty: item.qty,
        framing: item.framing,
        isOriginal: product.type === 'original_painting',
      });
    }

    // 3. Compute Shipping, COD, Gift Wrap
    const freeShippingThreshold = siteConfig.shipping.freeShippingThresholdPaise; // ₹1,499
    let shippingPaise = 0;
    if (!hasPainting && subtotalPaise < freeShippingThreshold) {
      shippingPaise = siteConfig.shipping.standardShippingFeePaise; // ₹79
    }

    let codFeePaise = 0;
    if (paymentMethod === 'cod') {
      if (subtotalPaise > siteConfig.shipping.codMaxThresholdPaise) {
        return NextResponse.json(
          { error: 'Cash on Delivery is only available for orders up to ₹3,000. Please choose UPI / Online payment.' },
          { status: 400 }
        );
      }
      codFeePaise = siteConfig.shipping.codConvenienceFeePaise; // ₹49
    }

    const giftWrapPaise = giftWrap ? siteConfig.shipping.giftWrappingFeePaise : 0; // ₹99
    const totalPaise = subtotalPaise + shippingPaise + codFeePaise + giftWrapPaise;

    // 4. Atomic Stock Reservation
    // For original paintings, reserve immediately
    for (const item of verifiedItems) {
      if (item.isOriginal) {
        const updateRes = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.qty } },
          { $inc: { stock: -item.qty } },
          { new: true }
        );

        if (!updateRes) {
          return NextResponse.json(
            { error: `"${item.name}" was just claimed by another collector. Stock exhausted.` },
            { status: 409 }
          );
        }
      }
    }

    // 5. Generate Order ID (VE-YYMMDD-####)
    const orderId = generateOrderId();

    // 6. Handle Payment Gateway or COD
    let razorpayOrderId: string | undefined;

    if (paymentMethod === 'razorpay') {
      const razorpay = getRazorpayClient();
      if (razorpay) {
        const rzpOrder = await razorpay.orders.create({
          amount: totalPaise, // in paise
          currency: 'INR',
          receipt: orderId,
          notes: {
            customerName: customer.name,
            customerPhone: customer.phone,
          },
        });
        razorpayOrderId = rzpOrder.id;
      } else {
        if (process.env.NODE_ENV === 'production') {
          // In production, fallback is strictly forbidden
          return NextResponse.json(
            { error: 'Payment gateway configuration missing. Online payments are unavailable.' },
            { status: 500 }
          );
        }
        // Test mode fallback only in non-production environments
        razorpayOrderId = `order_sim_${Date.now()}`;
      }
    }

    // 7. Save Order in Database
    const order = await Order.create({
      orderId,
      customer,
      shippingAddress,
      items: verifiedItems,
      subtotalPaise,
      shippingPaise,
      codFeePaise,
      giftWrapPaise,
      giftNote: giftWrap ? giftNote : undefined,
      totalPaise,
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
        razorpayOrderId,
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          at: new Date(),
          note: paymentMethod === 'cod' ? 'Order placed with Cash on Delivery (OTP verification required)' : 'Awaiting payment via Razorpay',
        },
      ],
      // 15-minute TTL for unpaid orders to release reserved stock
      expiresAt: paymentMethod === 'razorpay' ? new Date(Date.now() + 15 * 60 * 1000) : null,
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      totalPaise,
      paymentMethod,
      razorpayOrderId,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_simulated',
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during checkout. Please try again.' },
      { status: 500 }
    );
  }
}
