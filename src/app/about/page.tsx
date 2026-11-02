import { Metadata } from 'next';
import { AboutTraditionScreen } from '@/components/screens/AboutTraditionScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About the Art & Heritage — Madhubani Tradition | Vernika Enterprises',
  description:
    'Learn about the centuries-old GI-tagged Madhubani (Mithila) art tradition from Bihar, natural dye techniques, and the story of artist Natasha Gupta.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="about"
      />
      <main className="flex-1 pt-2">
        <AboutTraditionScreen />
      </main>
      <Footer variant="poster" />
    </div>
  );
}
