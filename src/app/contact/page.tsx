import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';
import { siteConfig } from '@/config/site';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Natasha Gupta Studio — Vernika Enterprises',
  description: 'Reach Natasha Gupta directly for custom Madhubani commissions, corporate gifting, and order inquiries.',
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Studio Contact & Inquiries">
      <p>
        Whether you are commissioning a large Kohbar statement painting, curating handpainted dupattas for wedding trousseaus, or have questions about an existing shipment, Natasha Gupta and the Vernika Enterprises studio team are directly accessible.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
        <div className="p-5 rounded-lg border border-gray-200 bg-gray-50 flex items-start gap-3">
          <Phone className="text-vermilion shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-sm text-ink">Phone & WhatsApp</h3>
            <p className="text-xs text-ink-muted mt-0.5">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
            <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-vermilion hover:underline mt-1 inline-block">
              {siteConfig.contact.displayPhone}
            </a>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-gray-200 bg-gray-50 flex items-start gap-3">
          <Mail className="text-vermilion shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-sm text-ink">Official Email</h3>
            <p className="text-xs text-ink-muted mt-0.5">Inquiries, commissions & invoices</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-sm font-medium text-vermilion hover:underline mt-1 inline-block">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-gray-200 bg-gray-50 flex items-start gap-3 sm:col-span-2">
          <MapPin className="text-vermilion shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-sm text-ink">Artist Studio & Registered Address</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Vernika Enterprises by Natasha Gupta<br />
              {siteConfig.origin}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex items-center justify-between">
        <span>Prefer direct WhatsApp conversation?</span>
        <a
          href={siteConfig.contact.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    </LegalPageLayout>
  );
}
