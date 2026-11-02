import { Metadata } from 'next';
import { getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';
import { PortfolioScreen } from '@/components/screens/PortfolioScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Art Portfolio & Complete Works — Natasha Gupta | Vernika Enterprises',
  description:
    'Explore Natasha Gupta’s complete portfolio of handpainted Madhubani art. High-resolution catalog viewer featuring framed paintings, dupattas, and handcrafted accessories.',
};

export default async function GalleryPage() {
  const dbProducts = await getCachedProducts();
  const products = dbProducts.map(mapCleanProductToMadhubani);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="portfolio"
      />
      <main className="flex-1 pt-2">
        <PortfolioScreen products={products} />
      </main>
      <Footer variant="poster" />
    </div>
  );
}
