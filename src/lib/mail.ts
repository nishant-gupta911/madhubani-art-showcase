import { Resend } from 'resend';
import { siteConfig } from '../config/site';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface OrderEmailProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalPaise: number;
  items: Array<{ name: string; qty: number; pricePaise: number }>;
  paymentMethod: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  courier?: string;
}

export async function sendOrderConfirmationEmail(order: OrderEmailProps): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || 'orders@vernikaenterprises.com';
  const totalRupees = (order.totalPaise / 100).toLocaleString('en-IN');

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #E4D3B5;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #E4D3B5; text-align: center;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #E4D3B5; text-align: right;">₹${(item.pricePaise / 100).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2A1A14; background: #FBF5E9; padding: 24px; border-radius: 8px;">
      <h1 style="color: #B8321F; margin-bottom: 4px;">Vernika Enterprises</h1>
      <p style="font-size: 13px; color: #6B5547; margin-top: 0;">Madhubani art, handpainted by Natasha Gupta</p>
      <hr style="border: none; border-top: 1px solid #E4D3B5; margin: 16px 0;" />
      
      <h2>Thank you for your order, ${order.customerName}!</h2>
      <p>We have received your order <strong>${order.orderId}</strong>. Each item is handpainted and packed with archival care.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #ffffff; border-radius: 4px;">
        <thead>
          <tr style="background: #F3E7D1; color: #2A1A14;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 12px; font-weight: bold; text-align: right;">Total (Incl. Taxes & Shipping):</td>
            <td style="padding: 12px; font-weight: bold; text-align: right; color: #B8321F;">₹${totalRupees}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #ffffff; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase;">Shipping To:</h3>
        <p style="margin: 0; font-size: 14px; color: #6B5547;">
          ${order.customerName}<br />
          ${order.shippingAddress.line1}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
        </p>
      </div>

      <p style="font-size: 13px; color: #6B5547;">
        Payment Method: <strong>${order.paymentMethod.toUpperCase()}</strong>
      </p>

      <hr style="border: none; border-top: 1px solid #E4D3B5; margin: 20px 0;" />
      <p style="font-size: 12px; color: #6B5547; text-align: center;">
        Questions? Contact Natasha Gupta directly at <a href="mailto:${siteConfig.contact.email}">${siteConfig.contact.email}</a> or WhatsApp <a href="${siteConfig.contact.whatsappLink}">+91 ${siteConfig.contact.phone}</a>.
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[EMAIL SIMULATED - RESEND_API_KEY not configured] To: ${order.customerEmail}, Order: ${order.orderId}, Total: ₹${totalRupees}`);
    return true;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: order.customerEmail,
      subject: `Order Confirmed: ${order.orderId} - Vernika Enterprises`,
      html,
    });

    // Also notify admin
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || siteConfig.contact.email;
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[NEW ORDER ALERT] ${order.orderId} - ₹${totalRupees}`,
      html: `<p>New order received from ${order.customerName} (${order.customerEmail}) for ₹${totalRupees}.</p>${html}`,
    });

    return true;
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
    return false;
  }
}

export async function sendOrderShippedEmail(order: OrderEmailProps): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || 'orders@vernikaenterprises.com';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2A1A14; background: #FBF5E9; padding: 24px; border-radius: 8px;">
      <h1 style="color: #B8321F;">Your Artwork Has Shipped!</h1>
      <p>Dear ${order.customerName},</p>
      <p>Great news! Your order <strong>${order.orderId}</strong> has been hand-packed and dispatched.</p>
      
      <div style="background: #ffffff; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
          Courier: <strong>${order.courier || 'Standard Express'}</strong><br />
          Tracking Number: <strong>${order.trackingNumber || 'Available on request'}</strong>
        </p>
      </div>

      <p style="font-size: 13px; color: #6B5547;">
        You can also track your order anytime on our website using your order ID and phone number.
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[EMAIL SIMULATED] Shipped Order ${order.orderId} to ${order.customerEmail}`);
    return true;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: order.customerEmail,
      subject: `Your Vernika Enterprises Order Has Shipped: ${order.orderId}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('Failed to send shipped email:', err);
    return false;
  }
}
export async function sendOtpEmail({
  toEmail,
  otpCode,
  customerName = 'Collector',
}: {
  toEmail: string;
  otpCode: string;
  customerName?: string;
}): Promise<boolean> {
  const fromEmail = process.env.FROM_EMAIL || 'security@vernikaenterprises.com';

  const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #2A1A14; background: #FAF6EF; padding: 24px; border-radius: 8px; border: 1px solid #E5D9C8;">
      <h2 style="color: #B03020; margin-bottom: 4px;">Vernika Enterprises</h2>
      <p style="font-size: 13px; color: #6B5A44; margin-top: 0;">Natasha Gupta Madhubani Art Studio</p>
      <hr style="border: none; border-top: 1px solid #E5D9C8; margin: 16px 0;" />
      
      <p>Hello ${customerName},</p>
      <p>Your one-time verification code to confirm your Cash on Delivery (COD) order is:</p>
      
      <div style="background: #ffffff; border: 1px dashed #B03020; padding: 18px; text-align: center; border-radius: 6px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #B03020; font-family: monospace;">${otpCode}</span>
      </div>

      <p style="font-size: 12px; color: #6B5A44;">
        This code is valid for 10 minutes. If you did not place an order on Vernika Enterprises, you can safely ignore this email.
      </p>
    </div>
  `;

  if (!resend) {
    console.log(`[EMAIL OTP SIMULATED] OTP for ${toEmail}: ${otpCode}`);
    return true;
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Your Vernika Enterprises Verification Code: ${otpCode}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return false;
  }
}
