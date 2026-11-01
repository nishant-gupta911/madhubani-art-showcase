import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy [DRAFT] — Vernika Enterprises',
  description: 'Transit damage replacement, inspection procedures, and return guidelines for original artworks.',
};

export default function ReturnsPage() {
  return (
    <LegalPageLayout title="Returns & Refunds Policy">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">1. Nature of Original Artworks</h2>
        <p>
          Because original Madhubani paintings and handpainted dupattas are one-of-a-kind bespoke creations handpainted by Natasha Gupta, we do not accept returns for "buyer's remorse" or minor natural variations inherent in handcrafted folk art.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">2. Damage in Transit Guarantee</h2>
        <p>
          Your piece is fully insured during transit. In the rare event that an artwork arrives with damaged frame glass, torn canvas, or severe water ingress:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>Notify our studio within <strong>48 hours</strong> of package receipt via WhatsApp at <a href={siteConfig.contact.whatsappLink} className="text-vermilion underline">{siteConfig.contact.displayPhone}</a> or email at <a href={`mailto:${siteConfig.contact.email}`} className="text-vermilion underline">{siteConfig.contact.email}</a>.</li>
          <li>Share clear photos or an unboxing video showing the outer package label and the specific damage.</li>
          <li>Upon quick verification, we will arrange a complimentary return pickup and provide a full refund or create a replacement piece of equal value at zero additional charge.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">3. Refund Processing Timelines</h2>
        <p>
          Approved refunds are credited back to the original payment source (UPI account or Card) within <strong>5–7 business days</strong> through our payment gateway Razorpay.
        </p>
      </section>
    </LegalPageLayout>
  );
}
