import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy [DRAFT] — Vernika Enterprises',
  description: 'Shipping timelines, free shipping thresholds, and courier packaging standards.',
};

export default function ShippingPage() {
  return (
    <LegalPageLayout title="Shipping & Delivery Policy">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">1. Packaging Standards</h2>
        <p>
          Original Madhubani paintings on handmade paper are packed with museum-grade care: framed paintings include protective acrylic fronts, shock-absorbent corner guards, bubble cushioning, and rigid corrugated shipping boxes. Dupattas and stoles are shipped in breathable eco-friendly protective cloth sleeves.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">2. Shipping Charges & Free Delivery Threshold</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Framed Madhubani Paintings:</strong> Free shipping across India on all framed paintings.</li>
          <li><strong>General Orders ≥ ₹1,499:</strong> Free express delivery across India.</li>
          <li><strong>Orders Below ₹1,499:</strong> Flat shipping charge of ₹79 per order.</li>
          <li><strong>Cash on Delivery (COD):</strong> Convenience fee of ₹49 per order. COD is available for orders up to ₹3,000.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">3. Delivery Timelines</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Ready-to-Ship Originals:</strong> Dispatched within 24–48 hours of order confirmation. Transit takes 3–5 business days depending on delivery PIN code.</li>
          <li><strong>Made-to-Order / Custom Commissions:</strong> Require 5–10 business days for Natasha to handpaint, dry, and frame before dispatch.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">4. Order Tracking</h2>
        <p>
          As soon as your parcel is handed over to our courier partner, you will receive an SMS and email with your Air Waybill (AWB) number. You can track your parcel live anytime on our website at{' '}
          <a href="/track" className="text-vermilion underline">
            vernikaenterprises.com/track
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
