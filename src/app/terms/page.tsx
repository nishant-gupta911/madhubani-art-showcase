import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service [DRAFT] — Vernika Enterprises',
  description: 'Terms and Conditions governing purchase of handpainted Madhubani art pieces from Vernika Enterprises.',
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">1. Nature of Handcrafted Art</h2>
        <p>
          All artworks, dupattas, stoles, and accessories offered on {siteConfig.name} are personally handpainted by artisan Natasha Gupta and her studio in India. Because each piece is created by hand using traditional nibs, brushes, and pigments on natural materials, subtle variations in line weight, pigment density, and natural fabric texture are natural hallmarks of authentic Mithila craftsmanship.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">2. Orders, Pricing and Taxes</h2>
        <p>
          All product prices are quoted in Indian Rupees (INR) and are inclusive of all applicable taxes (GST). We reserve the right to revise prices or cancel orders in cases of demonstrable typographical errors or exhausted inventory.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">3. Intellectual Property Rights</h2>
        <p>
          All painting designs, photographic assets, catalog layouts, and editorial text published on this website are the intellectual property of Natasha Gupta and {siteConfig.name}. Unauthorized commercial reproduction, unauthorized AI model training, or reselling under another trademark is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink">4. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to website transactions shall be subject to the exclusive jurisdiction of the competent courts in {siteConfig.sellerCity}, India.
        </p>
      </section>
    </LegalPageLayout>
  );
}
