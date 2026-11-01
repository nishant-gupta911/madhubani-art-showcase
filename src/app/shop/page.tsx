import { Metadata } from 'next';
import { getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';
import { ShopGalleryScreen } from '@/components/screens/ShopGalleryScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { CATALOG_CATEGORIES, CATALOG_STYLES } from '@/config/catalog';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop All Artworks — Vernika Enterprises by Natasha Gupta',
  description:
    'Browse original framed Madhubani paintings, handpainted cotton dupattas, angvastras, and handcrafted lifestyle bags directly from Natasha Gupta.',
  openGraph: {
    title: 'Shop Handpainted Madhubani Art — Vernika Enterprises',
    description: 'Original Mithila artworks directly from artist Natasha Gupta. Insured shipping across India.',
    images: [{ url: '/products/1.webp', width: 1200, height: 630 }],
  },
};

export default async function ShopPage() {
  const dbProducts = await getCachedProducts();
  const products = dbProducts.map(mapCleanProductToMadhubani);

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="shop"
      />
      <main className="pt-2">
        <ShopGalleryScreen
          products={products}
          categories={CATALOG_CATEGORIES}
          styles={CATALOG_STYLES as any}
        />
      </main>
    </div>
  );
}
