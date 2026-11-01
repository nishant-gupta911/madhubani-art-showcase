import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy [DRAFT] — Vernika Enterprises',
  description: 'How Vernika Enterprises collects, handles, and protects customer information.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">1. Information We Collect</h2>
        <p>
          When you place an order or contact us for a custom commission, we collect the necessary personal information to fulfill and deliver your handpainted artwork:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Customer Name and Contact Details (Email address, Phone number).</li>
          <li>Physical Delivery Address and PIN code.</li>
          <li>Personalized gift messages (when requested).</li>
          <li>Order history and communication transcripts with our studio.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">2. Payment Security</h2>
        <p>
          We do <strong>not</strong> collect or store credit card, debit card, or UPI PIN numbers on our servers. All digital payments are processed through RBI-authorized payment aggregator Razorpay via 256-bit encrypted SSL connections.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">3. Data Sharing with Third Parties</h2>
        <p>
          We never sell, rent, or trade your personal data. We share your delivery details solely with verified logistics partners (e.g. Blue Dart, Delhivery, India Post) to ensure safe physical transit of your artwork.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">4. Customer Rights & Data Deletion</h2>
        <p>
          You may request an export or permanent deletion of your personal contact records by emailing our team at{' '}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-vermilion underline">
            {siteConfig.contact.email}
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
