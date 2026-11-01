import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Cancellation Policy [DRAFT] — Vernika Enterprises',
  description: 'Order cancellation rules for in-stock artworks and made-to-order commissions.',
};

export default function CancellationPage() {
  return (
    <LegalPageLayout title="Cancellation Policy">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">1. In-Stock Artworks</h2>
        <p>
          Orders for in-stock framed paintings, dupattas, and bags can be cancelled without penalty at any time <strong>prior to courier dispatch</strong> (usually within 12–24 hours of placing the order).
        </p>
        <p>
          To cancel, contact our studio immediately via WhatsApp at <a href={siteConfig.contact.whatsappLink} className="text-vermilion underline">{siteConfig.contact.displayPhone}</a> with your Order Reference (VE-YYMMDD-####).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">2. Custom Commissions & Made-to-Order Pieces</h2>
        <p>
          For customized size orders or made-to-order pieces where Natasha has already commenced sketching or painting, cancellations will incur a 25% material and labor fee to cover natural pigments and dedicated artist hours.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">3. Cancellations by Vernika Enterprises</h2>
        <p>
          We reserve the right to cancel an order if:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A one-of-a-kind original painting was concurrently claimed and paid for by another customer.</li>
          <li>Delivery address falls outside serviceable courier coverage areas.</li>
          <li>A Cash on Delivery (COD) order fails phone or email OTP verification within 48 hours.</li>
        </ul>
        <p>In all such cases, any prepaid funds are refunded immediately in full.</p>
      </section>
    </LegalPageLayout>
  );
}
