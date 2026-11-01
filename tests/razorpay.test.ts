import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { verifyRazorpayPaymentSignature, verifyRazorpayWebhookSignature } from '@/lib/razorpay';

describe('Razorpay Signature Verification', () => {
  const secret = 'test_secret_key_12345';
  const originalSecret = process.env.RAZORPAY_KEY_SECRET;
  const originalWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = secret;
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
  });

  afterEach(() => {
    process.env.RAZORPAY_KEY_SECRET = originalSecret;
    process.env.RAZORPAY_WEBHOOK_SECRET = originalWebhookSecret;
  });

  it('should successfully verify valid HMAC SHA256 payment signature', () => {
    const razorpay_order_id = 'order_DA28F30K981';
    const razorpay_payment_id = 'pay_DA28G93901';

    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: validSignature,
    });

    expect(isValid).toBe(true);
  });

  it('should reject tampered payment signature', () => {
    const razorpay_order_id = 'order_DA28F30K981';
    const razorpay_payment_id = 'pay_DA28G93901';

    const tamperedSignature = 'a'.repeat(64);

    const isValid = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: tamperedSignature,
    });

    expect(isValid).toBe(false);
  });

  it('should successfully verify valid webhook signature', () => {
    const payload = JSON.stringify({ event: 'order.paid', id: 'evt_123' });
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isValid = verifyRazorpayWebhookSignature(payload, validSignature, secret);
    expect(isValid).toBe(true);
  });

  it('should reject webhook payload with mismatched signature', () => {
    const payload = JSON.stringify({ event: 'order.paid', id: 'evt_123' });
    const invalidSignature = 'bad_signature_value';

    const isValid = verifyRazorpayWebhookSignature(payload, invalidSignature, secret);
    expect(isValid).toBe(false);
  });

  it('should strictly reject unverified or simulated orders in production', () => {
    const oldNodeEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.RAZORPAY_KEY_SECRET;

      // In production with missing secret, signature verification must fail
      const isValid = verifyRazorpayPaymentSignature({
        razorpay_order_id: 'order_sim_12345678',
        razorpay_payment_id: 'pay_sim_12345678',
        razorpay_signature: 'fake_signature',
      });
      expect(isValid).toBe(false);
    } finally {
      (process.env as any).NODE_ENV = oldNodeEnv;
      process.env.RAZORPAY_KEY_SECRET = secret;
    }
  });
});
