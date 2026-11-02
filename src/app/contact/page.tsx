import { Metadata } from 'next';
import { ContactCommissionScreen } from '@/components/screens/ContactCommissionScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Contact & Custom Commissions — ${siteConfig.name} by ${siteConfig.artist}`,
  description:
    'Commission an authentic custom Madhubani painting, request bridal trousseau dupattas, or contact Natasha Gupta directly for corporate and festival gifting.',
  openGraph: {
    title: `Contact Studio — ${siteConfig.name}`,
    description: `Direct studio access to artist Natasha Gupta for bespoke Mithila artworks and commissions.`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar currentScreen="contact" cartCount={0} wishlistCount={0} />
      <main className="flex-1">
        <ContactCommissionScreen />
      </main>
      <Footer variant="compact" />
    </div>
  );
}
