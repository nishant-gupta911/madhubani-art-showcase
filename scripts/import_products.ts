import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '../src/lib/db';
import { Product } from '../src/models/Product';

interface CsvRow {
  ref: string;
  name: string;
  category: string;
  subCategory: string;
  type: string;
  priceInr: number;
  stock: number;
  leadTimeDays: number;
  material: string;
  dimensions: string;
  heroImage: string;
  isHeroCatalogPage: string;
  needsRealPhoto: string;
  claimsConfirmed: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Regex matching CSV items handling commas inside quotes
    const values: string[] = [];
    let insideQuote = false;
    let entry = '';
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        if (insideQuote && line[c + 1] === '"') {
          entry += '"';
          c++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        values.push(entry);
        entry = '';
      } else {
        entry += char;
      }
    }
    values.push(entry);

    const record: any = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx]?.trim() || '';
    });

    rows.push({
      ref: record.ref,
      name: record.name,
      category: record.category,
      subCategory: record.subCategory,
      type: record.type,
      priceInr: parseInt(record.priceInr, 10) || 0,
      stock: parseInt(record.stock, 10) || 0,
      leadTimeDays: parseInt(record.leadTimeDays, 10) || 0,
      material: record.material,
      dimensions: record.dimensions,
      heroImage: record.heroImage,
      isHeroCatalogPage: record.isHeroCatalogPage,
      needsRealPhoto: record.needsRealPhoto,
      claimsConfirmed: record.claimsConfirmed
    });
  }

  return rows;
}

const VALID_CATEGORIES = [
  'paintings',
  'dupattas',
  'bags_and_files'
];

async function importProducts() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\nStarting product import ${isDryRun ? '(DRY RUN)' : '(LIVE UPDATE)'}...`);

  const csvPath = path.join(process.cwd(), 'scripts', 'products-review.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    console.error('Run `npm run export:products` first to generate it.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(csvContent);
  console.log(`Parsed ${rows.length} rows from CSV.\n`);

  // Validation
  const errors: string[] = [];
  rows.forEach((r, idx) => {
    const lineNum = idx + 2;
    if (!r.ref) errors.push(`Line ${lineNum}: Missing ref`);
    if (!r.name) errors.push(`Line ${lineNum}: Missing name for ref ${r.ref}`);
    if (r.priceInr <= 0) errors.push(`Line ${lineNum}: Invalid price ${r.priceInr} for ref ${r.ref}`);
    if (r.stock < 0) errors.push(`Line ${lineNum}: Negative stock for ref ${r.ref}`);
    if (!VALID_CATEGORIES.includes(r.category)) {
      errors.push(`Line ${lineNum}: Invalid category "${r.category}" for ref ${r.ref}`);
    }
  });

  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} errors:`);
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log('✅ CSV data validated successfully.');

  await connectToDatabase();
  let updatedCount = 0;
  const changes: string[] = [];

  for (const r of rows) {
    const existing = await Product.findOne({ ref: r.ref });
    if (!existing) {
      console.warn(`Product ref ${r.ref} not found in DB. Skipping.`);
      continue;
    }

    const pricePaise = r.priceInr * 100;
    const diffs: string[] = [];

    const existingPrice = existing.price ?? (existing as any).pricePaise ?? 0;
    if (existingPrice !== pricePaise) {
      diffs.push(`price: ₹${existingPrice / 100} -> ₹${r.priceInr}`);
    }
    if (existing.stock !== r.stock) {
      diffs.push(`stock: ${existing.stock} -> ${r.stock}`);
    }
    if (existing.leadTimeDays !== r.leadTimeDays) {
      diffs.push(`leadTimeDays: ${existing.leadTimeDays} -> ${r.leadTimeDays}`);
    }
    if (existing.material !== r.material) {
      diffs.push(`material updated`);
    }

    if (diffs.length > 0) {
      changes.push(`[${r.ref}] ${r.name}: ${diffs.join(', ')}`);
      if (!isDryRun) {
        existing.price = pricePaise;
        existing.stock = r.stock;
        existing.leadTimeDays = r.leadTimeDays;
        existing.material = r.material;
        await existing.save();
      }
      updatedCount++;
    }
  }

  console.log('-------------------------------------------------------');
  if (changes.length === 0) {
    console.log('No differences found between CSV and database.');
  } else {
    console.log(`Detected changes for ${updatedCount} products:`);
    changes.forEach(c => console.log(`  * ${c}`));
  }
  console.log('-------------------------------------------------------');

  if (isDryRun) {
    console.log('\nDry run completed. No database changes were made.');
  } else {
    console.log(`\nSuccessfully updated ${updatedCount} products in MongoDB.`);
  }
  process.exit(0);
}

importProducts().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
