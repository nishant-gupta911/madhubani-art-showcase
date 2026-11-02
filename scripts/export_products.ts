import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '../src/lib/db';
import { Product } from '../src/models/Product';

interface ProductData {
  ref: string;
  name: string;
  category: string;
  subCategory?: string;
  type: string;
  pricePaise: number;
  stock: number;
  leadTimeDays: number;
  material: string;
  dimensions?: {
    displayString?: string;
  };
  images: Array<{
    url: string;
    isHero?: boolean;
    shotType?: string;
  }>;
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

async function exportProducts() {
  console.log('Exporting products to review CSV...');
  let products: ProductData[] = [];

  try {
    await connectToDatabase();
    const dbProds = await Product.find({}).sort({ ref: 1 }).lean();
    if (dbProds && dbProds.length > 0) {
      products = dbProds as any;
      console.log(`Loaded ${products.length} products from MongoDB.`);
    }
  } catch (err: any) {
    console.warn(`Database connection failed (${err.message}). Falling back to products.seed.json.`);
  }

  if (products.length === 0) {
    const seedPath = path.join(process.cwd(), 'scripts', 'products.seed.json');
    if (fs.existsSync(seedPath)) {
      products = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      console.log(`Loaded ${products.length} products from seed JSON.`);
    } else {
      console.error('No products found to export.');
      process.exit(1);
    }
  }

  const headers = [
    'ref',
    'name',
    'category',
    'subCategory',
    'type',
    'priceInr',
    'stock',
    'leadTimeDays',
    'material',
    'dimensions',
    'heroImage',
    'isHeroCatalogPage',
    'needsRealPhoto',
    'claimsConfirmed'
  ];

  const rows = products.map((p) => {
    const heroImg = p.images?.find((img) => img.isHero) || p.images?.[0];
    const heroUrl = heroImg?.url || '';
    const isCatalogPage = heroUrl.includes('portfolio-pages') || heroImg?.shotType === 'infographic' || heroUrl.includes('hero-');
    const needsRealPhoto = isCatalogPage ? 'yes' : 'no';
    const claimsConfirmed = 'no';
    const pricePaise = (p as any).price ?? p.pricePaise ?? 0;
    const priceInr = Math.round(pricePaise / 100);

    return [
      escapeCsv(p.ref),
      escapeCsv(p.name),
      escapeCsv(p.category),
      escapeCsv(p.subCategory || ''),
      escapeCsv(p.type),
      priceInr,
      p.stock,
      p.leadTimeDays,
      escapeCsv(p.material),
      escapeCsv(p.dimensions?.displayString || ''),
      escapeCsv(heroUrl),
      isCatalogPage ? 'yes' : 'no',
      needsRealPhoto,
      claimsConfirmed
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const targetPath = path.join(process.cwd(), 'scripts', 'products-review.csv');
  fs.writeFileSync(targetPath, csvContent, 'utf8');

  console.log(`✅ Successfully exported ${products.length} products to:`);
  console.log(`   ${targetPath}`);
  process.exit(0);
}

exportProducts().catch((err) => {
  console.error('Export error:', err);
  process.exit(1);
});
