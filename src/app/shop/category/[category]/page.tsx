import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';
import { ShopGalleryScreen } from '@/components/screens/ShopGalleryScreen';
import { HeaderBar } from '@/components/HeaderBar';
import { CATALOG_CATEGORIES, CATALOG_STYLES } from '@/config/catalog';
import { siteConfig } from '@/config/site';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return CATALOG_CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catDef = CATALOG_CATEGORIES.find((c) => c.id === category);
  if (!catDef) return { title: 'Category Not Found' };

  return {
    title: `${catDef.name} — Handpainted Collection | ${siteConfig.name}`,
    description: `Explore Natasha Gupta’s authentic collection of ${catDef.name.toLowerCase()}. Handcrafted with heritage Mithila motifs, insured shipping across India.`,
    openGraph: {
      title: `${catDef.name} — ${siteConfig.name}`,
      description: `Authentic handpainted ${catDef.name.toLowerCase()} by Natasha Gupta.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catDef = CATALOG_CATEGORIES.find((c) => c.id === category);
  if (!catDef) {
    notFound();
  }

  const allDbProducts = await getCachedProducts();
  const categoryProducts = allDbProducts
    .filter((p) => p.category === category)
    .map(mapCleanProductToMadhubani);

  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <HeaderBar cartCount={0} wishlistCount={0} currentScreen="shop" />
      <main className="pt-2">
        <ShopGalleryScreen
          products={categoryProducts}
          categories={CATALOG_CATEGORIES}
          styles={CATALOG_STYLES as any}
          initialCategory={category}
        />
      </main>
    </div>
  );
}
