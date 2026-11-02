import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCachedProductBySlug, getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';
import { HeaderBar } from '@/components/HeaderBar';
import { Footer } from '@/components/Footer';
import { ProductDetailScreen } from '@/components/screens/ProductDetailScreen';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getCachedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (['paintings', 'dupattas', 'bags_and_files'].includes(slug)) {
    redirect(`/shop/category/${slug}`);
  }
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    return { title: 'Artwork Not Found — Vernika Enterprises' };
  }

  const priceRupees = Math.round(product.price / 100);
  const heroImage = product.images?.[0]?.url || '/products/1.webp';

  return {
    title: `${product.name} — Handpainted by Natasha Gupta | Vernika Enterprises`,
    description: `${product.name}. ${product.description.slice(0, 160)}. Handpainted ${product.technique} on ${product.material}. ₹${priceRupees.toLocaleString('en-IN')}.`,
    openGraph: {
      title: `${product.name} | Vernika Enterprises`,
      description: product.description.slice(0, 200),
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vernikaenterprises.com'}/shop/${product.slug}`,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 900,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (['paintings', 'dupattas', 'bags_and_files'].includes(slug)) {
    redirect(`/shop/category/${slug}`);
  }
  const product = await getCachedProductBySlug(slug);
  const allDbProducts = await getCachedProducts();

  if (!product) {
    notFound();
  }

  const mappedCurrent = mapCleanProductToMadhubani(product);
  const relatedProducts = allDbProducts
    .filter((x) => x.category === product.category && x.slug !== product.slug)
    .slice(0, 4)
    .map(mapCleanProductToMadhubani);

  // JSON-LD Structured Data Schema for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((im) => im.url) || ['/products/1.webp'],
    description: product.description,
    sku: product.ref,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vernikaenterprises.com'}/shop/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Preload Product Hero Image for sub-2s LCP */}
      <link rel="preload" as="image" href={mappedCurrent.image} fetchPriority="high" />
      {/* Inject Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderBar
        cartCount={0}
        wishlistCount={0}
        currentScreen="shop"
      />
      <main className="flex-1 pt-2">
        <ProductDetailScreen
          product={mappedCurrent}
          products={relatedProducts}
        />
      </main>
      <Footer variant="poster" />
    </div>
  );
}
