import { unstable_cache } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';

export interface CleanProduct {
  id: string;
  ref: string;
  name: string;
  slug: string;
  category: string;
  subCategory: string;
  type: string;
  stock: number;
  leadTimeDays: number;
  price: number; // in paise
  dimensions: {
    displayString: string;
    widthCm?: number;
    heightCm?: number;
    widthIn?: number;
    heightIn?: number;
  };
  technique: string;
  paintMedium?: string | null;
  material: string;
  isFramed?: boolean;
  description: string;
  story: string;
  tags?: string[];
  featured?: boolean;
  images: {
    url: string;
    cardUrl?: string;
    filename: string;
    alt: string;
    isHero: boolean;
    shotType?: string;
    blurDataUrl?: string;
  }[];
}

/**
 * Cached MongoDB query with Next.js ISR tags.
 * Revalidated via revalidateTag('products') whenever Natasha updates the catalog.
 */
export const getCachedProducts = unstable_cache(
  async (): Promise<CleanProduct[]> => {
    try {
      await connectToDatabase();
      const docs = await Product.find({
        status: { $in: ['published', 'sold'] },
        deletedAt: null,
      })
        .sort({ featured: -1, createdAt: -1 })
        .lean();

      if (docs && docs.length > 0) {
        return docs.map((doc: any) => ({
          id: doc._id.toString(),
          ref: doc.ref,
          name: doc.name,
          slug: doc.slug,
          category: doc.category,
          subCategory: doc.subCategory,
          type: doc.type,
          stock: doc.stock,
          leadTimeDays: doc.leadTimeDays || 0,
          price: doc.price,
          dimensions: doc.dimensions || { displayString: 'Standard' },
          technique: doc.technique || 'Handpainted',
          paintMedium: doc.paintMedium,
          material: doc.material || 'Handmade paper / cotton',
          isFramed: doc.isFramed,
          description: doc.description || '',
          story: doc.story || '',
          tags: doc.tags || [],
          featured: doc.featured || false,
          images: doc.images || [],
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to query products from MongoDB:', err);
      return [];
    }
  },
  ['storefront-products-cache'],
  {
    tags: ['products'],
    revalidate: 60, // 60-second ISR baseline
  }
);

export const getCachedProductBySlug = unstable_cache(
  async (slug: string): Promise<CleanProduct | null> => {
    const products = await getCachedProducts();
    return products.find((p) => p.slug === slug || p.ref === slug || p.id === slug) || null;
  },
  ['storefront-product-by-slug'],
  {
    tags: ['products'],
    revalidate: 60,
  }
);
import { MadhubaniProduct } from '@/types';

export function mapCleanProductToMadhubani(p: CleanProduct): MadhubaniProduct {
  const isPainting = p.category === 'paintings';
  const isDupatta = p.category === 'dupattas';

  return {
    id: p.id || p.ref,
    ref: p.ref,
    name: p.name,
    title: p.name,
    slug: p.slug,
    filename: p.images?.[0]?.filename || 'product.webp',
    image: p.images?.[0]?.url || '/products/1.webp',
    cardImage: p.images?.[0]?.cardUrl || p.images?.[0]?.url || '/products/1.webp',
    galleryImages: p.images?.map((im) => im.url) || ['/products/1.webp'],
    category: p.category,
    subCategory: p.subCategory,
    categoryName: isPainting ? 'Madhubani Paintings' : isDupatta ? 'Dupattas & Angvastras' : 'Bags & Files',
    categoryShort: isPainting ? 'Painting' : isDupatta ? 'Dupatta' : 'Bag',
    style: (p.technique?.includes('Kachni') ? 'Kachni' : p.technique?.includes('Bharni') ? 'Bharni' : p.technique?.includes('Kohbar') ? 'Kohbar' : 'Bharni') as any,
    price: Math.round(p.price / 100),
    pricePaise: p.price,
    dimensions: p.dimensions?.displayString || 'Standard',
    medium: p.paintMedium || 'Traditional natural soot/pigments',
    material: p.material || 'Handmade bamboo paper',
    technique: p.technique || 'Handpainted',
    type: p.type,
    stock: p.stock,
    leadTimeDays: p.leadTimeDays || 0,
    shortDescription: p.description?.slice(0, 140) || '',
    longDescription: p.description || '',
    story: p.story || '',
    tags: p.tags || [],
    isFeatured: p.featured || false,
    isNew: true,
    isFramed: p.isFramed || false,
  };
}
