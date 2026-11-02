import { Metadata } from 'next';
import { getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/config/site';

export const revalidate = 60; // 60s ISR baseline

export const metadata: Metadata = {
  title: `${siteConfig.name} — Handpainted Madhubani Art by Natasha Gupta`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — Handpainted Madhubani Art by Natasha Gupta`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: '/products/1.webp', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function HomePage() {
  const dbProducts = await getCachedProducts();
  const initialProducts = dbProducts.map(mapCleanProductToMadhubani);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ivory)' }}>
      {/* Preload Hero LCP image */}
      <link rel="preload" as="image" href="/products/hero-49.webp" fetchPriority="high" />
      <HeaderBar currentScreen="home" />
      <main className="flex-1">
        <HomeScreen products={initialProducts} />
      </main>
      <Footer />
    </div>
  );
}
