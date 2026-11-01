import { Metadata } from 'next';
import { AboutTraditionScreen } from '@/components/screens/AboutTraditionScreen';
import { HeaderBar } from '@/components/HeaderBar';

export const metadata: Metadata = {
  title: 'About the Art & Heritage — Madhubani Tradition | Vernika Enterprises',
  description:
    'Learn about the centuries-old GI-tagged Madhubani (Mithila) art tradition from Bihar, natural dye techniques, and the story of artist Natasha Gupta.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="about"
      />
      <main className="pt-2">
        <AboutTraditionScreen />
      </main>
    </div>
  );
}
