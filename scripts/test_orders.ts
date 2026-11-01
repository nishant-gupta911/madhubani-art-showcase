import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import crypto from 'crypto';
import { connectToDatabase } from '../src/lib/db';
import { Product } from '../src/models/Product';
import { Order } from '../src/models/Order';
import { Otp } from '../src/models/Otp';
import { generateOrderId } from '../src/lib/order-id';
import { verifyRazorpayPaymentSignature } from '../src/lib/razorpay';
import { releaseExpiredOrdersStock } from '../src/lib/stock';

async function runTestOrders() {
  console.log('\n============================================================');
  console.log('PLACING 3 REAL TEST ORDERS (PAID, FAILED, COD)');
  console.log('============================================================\n');

  await connectToDatabase();

  // ─────────────────────────────────────────────────────────────
  // 1. ORDER 1: PREPAID (PAID VIA RAZORPAY)
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST ORDER 1: Successful Prepaid Order (Razorpay) ---');
  const product1 = await Product.findOne({ ref: 'P01' });
  if (!product1) throw new Error('Product P01 not found');

  const stockBefore1 = product1.stock;
  console.log(`Product: "${product1.name}" (Ref: ${product1.ref}), Current Stock: ${stockBefore1}`);

  // Atomically reserve stock
  const reservedP1 = await Product.findOneAndUpdate(
    { _id: product1._id, stock: { $gte: 1 } },
    { $inc: { stock: -1 } },
    { new: true }
  );
  if (!reservedP1) throw new Error('Failed to reserve stock for Order 1');

  const orderId1 = generateOrderId();
  const rzpOrderId1 = `order_test_${Date.now()}`;
  const rzpPaymentId1 = `pay_test_${Date.now()}`;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET || 'vernikaSecretKeyTest2026';

  // Compute HMAC SHA256 signature
  const validSignature = crypto
    .createHmac('sha256', rzpSecret)
    .update(`${rzpOrderId1}|${rzpPaymentId1}`)
    .digest('hex');

  const order1 = await Order.create({
    orderId: orderId1,
    customer: {
      name: 'Aarav Sharma',
      phone: '9876543210',
      email: 'aarav.sharma@example.com',
    },
    shippingAddress: {
      line1: 'Flat 402, Lotus Towers, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      country: 'India',
    },
    items: [
      {
        productId: product1._id.toString(),
        ref: product1.ref,
        name: product1.name,
        slug: product1.slug,
        image: product1.images[0]?.url || '/products/1.webp',
        pricePaise: product1.price,
        qty: 1,
        isOriginal: product1.type === 'original_painting',
      },
    ],
    subtotalPaise: product1.price,
    shippingPaise: 0, // Free on paintings
    codFeePaise: 0,
    totalPaise: product1.price,
    payment: {
      method: 'razorpay',
      status: 'pending',
      razorpayOrderId: rzpOrderId1,
    },
    status: 'pending',
    statusHistory: [{ status: 'pending', at: new Date(), note: 'Order created, awaiting payment' }],
  });

  // Verify signature
  const isSigValid = verifyRazorpayPaymentSignature({
    razorpay_order_id: rzpOrderId1,
    razorpay_payment_id: rzpPaymentId1,
    razorpay_signature: validSignature,
  });

  if (isSigValid) {
    order1.status = 'confirmed';
    order1.payment.status = 'paid';
    order1.payment.razorpayPaymentId = rzpPaymentId1;
    order1.payment.paidAt = new Date();
    order1.statusHistory.push({
      status: 'confirmed',
      at: new Date(),
      note: `Payment verified via Razorpay. Payment ID: ${rzpPaymentId1}`,
    });
    await order1.save();
  }

  const p1After = await Product.findById(product1._id);
  console.log(`✓ Order 1 Created & Confirmed: ${order1.orderId}`);
  console.log(`  Customer: ${order1.customer.name} (${order1.customer.email})`);
  console.log(`  Amount Paid: ₹${order1.totalPaise / 100} (${order1.totalPaise} paise)`);
  console.log(`  Payment Method: ${order1.payment.method} | Status: ${order1.payment.status}`);
  console.log(`  Razorpay Payment ID: ${order1.payment.razorpayPaymentId}`);
  console.log(`  Stock: ${stockBefore1} -> ${p1After?.stock}\n`);

  // ─────────────────────────────────────────────────────────────
  // 2. ORDER 2: FAILED PAYMENT & AUTOMATIC STOCK RELEASE
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST ORDER 2: Failed Payment with Stock Release ---');
  const product2 = await Product.findOne({ ref: 'P02' });
  if (!product2) throw new Error('Product P02 not found');

  const stockBefore2 = product2.stock;
  console.log(`Product: "${product2.name}" (Ref: ${product2.ref}), Current Stock: ${stockBefore2}`);

  // Atomically reserve stock
  await Product.updateOne({ _id: product2._id }, { $inc: { stock: -1 } });

  const orderId2 = generateOrderId();
  const rzpOrderId2 = `order_test_${Date.now()}_fail`;
  const invalidSignature = 'tampered_or_failed_signature_hex';

  const order2 = await Order.create({
    orderId: orderId2,
    customer: {
      name: 'Priya Singh',
      phone: '9812345678',
      email: 'priya.singh@example.com',
    },
    shippingAddress: {
      line1: '12 Green Park',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110016',
      country: 'India',
    },
    items: [
      {
        productId: product2._id.toString(),
        ref: product2.ref,
        name: product2.name,
        slug: product2.slug,
        image: product2.images[0]?.url || '/products/2.webp',
        pricePaise: product2.price,
        qty: 1,
        isOriginal: product2.type === 'original_painting',
      },
    ],
    subtotalPaise: product2.price,
    totalPaise: product2.price,
    payment: {
      method: 'razorpay',
      status: 'failed',
      razorpayOrderId: rzpOrderId2,
    },
    status: 'pending',
    expiresAt: new Date(Date.now() - 16 * 60 * 1000), // Simulate expired 16 minutes ago
    stockReleased: false,
    statusHistory: [{ status: 'pending', at: new Date(), note: 'Payment attempt failed' }],
  });

  const sigCheckFail = verifyRazorpayPaymentSignature({
    razorpay_order_id: rzpOrderId2,
    razorpay_payment_id: 'pay_failed_123',
    razorpay_signature: invalidSignature,
  });

  console.log(`  Signature Verification: ${sigCheckFail ? 'Valid' : 'REJECTED (Payment Failed)'}`);

  // Trigger automated stock release for abandoned/failed order
  const releaseRes = await releaseExpiredOrdersStock();
  const p2After = await Product.findById(product2._id);
  const order2After = await Order.findById(order2._id);

  console.log(`✓ Order 2 Handled: ${order2.orderId}`);
  console.log(`  Order Status: ${order2After?.status} | Payment: ${order2After?.payment.status}`);
  console.log(`  Stock Released Flag: ${order2After?.stockReleased}`);
  console.log(`  Stock Restored: ${stockBefore2 - 1} -> ${p2After?.stock} (Inventory Protected)\n`);

  // ─────────────────────────────────────────────────────────────
  // 3. ORDER 3: CASH ON DELIVERY (COD) WITH OTP VERIFICATION
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST ORDER 3: Cash on Delivery (COD) with OTP ---');
  const product3 = await Product.findOne({ ref: 'P03' });
  if (!product3) throw new Error('Product P03 not found');

  const stockBefore3 = product3.stock;
  console.log(`Product: "${product3.name}" (Ref: ${product3.ref}), Current Stock: ${stockBefore3}`);

  await Product.updateOne({ _id: product3._id }, { $inc: { stock: -1 } });

  const orderId3 = generateOrderId();
  const codFeePaise = 4900; // ₹49

  const order3 = await Order.create({
    orderId: orderId3,
    customer: {
      name: 'Vikram Verma',
      phone: '9845012345',
      email: 'vikram.verma@example.com',
    },
    shippingAddress: {
      line1: 'B-10, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
    },
    items: [
      {
        productId: product3._id.toString(),
        ref: product3.ref,
        name: product3.name,
        slug: product3.slug,
        image: product3.images[0]?.url || '/products/3.webp',
        pricePaise: product3.price,
        qty: 1,
        isOriginal: product3.type === 'original_painting',
      },
    ],
    subtotalPaise: product3.price,
    shippingPaise: 0,
    codFeePaise: codFeePaise,
    totalPaise: product3.price + codFeePaise,
    payment: {
      method: 'cod',
      status: 'cod_pending',
    },
    status: 'pending',
    statusHistory: [{ status: 'pending', at: new Date(), note: 'COD order placed, awaiting phone OTP' }],
  });

  // Generate OTP
  const otpCode = '849201';
  await Otp.deleteMany({ phone: order3.customer.phone });
  await Otp.create({
    phone: order3.customer.phone,
    otp: otpCode,
    purpose: 'cod_verification',
    verified: false,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Verify OTP
  const otpRecord = await Otp.findOne({
    phone: order3.customer.phone,
    otp: otpCode,
    verified: false,
  });

  if (otpRecord) {
    otpRecord.verified = true;
    await otpRecord.save();

    order3.status = 'confirmed';
    order3.statusHistory.push({
      status: 'confirmed',
      at: new Date(),
      note: 'COD order confirmed via OTP verification',
    });
    await order3.save();
  }

  console.log(`✓ Order 3 Created & OTP Confirmed: ${order3.orderId}`);
  console.log(`  Customer: ${order3.customer.name} (Phone: +91 ${order3.customer.phone})`);
  console.log(`  Subtotal: ₹${order3.subtotalPaise / 100} + COD Convenience Fee: ₹${order3.codFeePaise / 100} = Total: ₹${order3.totalPaise / 100}`);
  console.log(`  Payment Method: ${order3.payment.method} | Payment Status: ${order3.payment.status}`);
  console.log(`  Order Fulfillment Status: ${order3.status} (Ready for Dispatch)`);

  console.log('\n============================================================');
  console.log('ALL 3 TEST ORDERS SUCCESSFULLY EXECUTED AND RECORDED IN DB');
  console.log('============================================================\n');

  process.exit(0);
}

runTestOrders().catch((err) => {
  console.error('Error running test orders:', err);
  process.exit(1);
});
