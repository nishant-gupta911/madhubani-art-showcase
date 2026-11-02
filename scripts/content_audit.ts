import fs from 'fs';
import path from 'path';

interface AuditViolation {
  ref: string;
  field: string;
  type: 'FORBIDDEN_CLAIM' | 'INVALID_DATA' | 'MISSING_IMAGE' | 'EMPTY_ALT';
  detail: string;
}

const FORBIDDEN_PHRASES = [
  { phrase: 'natural colours', reason: 'Unverified: Natasha uses acrylics/artist inks' },
  { phrase: 'natural vegetable dyes', reason: 'Unverified: Natasha uses acrylics/artist inks' },
  { phrase: 'eco-friendly', reason: 'Unsubstantiated green claim without certificate' },
  { phrase: 'artisans of mithila', reason: 'Misleading: Natasha works alone, not a collective' },
  { phrase: 'our craftspeople', reason: 'Misleading: Natasha works alone, not a collective' },
  { phrase: '100% handpainted', reason: 'Overbroad blanket claim on printed base items' },
  { phrase: 'unesco', reason: 'UNESCO cannot be claimed on individual commercial items' },
  { phrase: 'certified authentic', reason: 'No third-party certification board exists' },
  { phrase: 'award-winning artist', reason: 'Unverified marketing claim' },
];

function checkText(text: string, ref: string, field: string, violations: AuditViolation[]) {
  if (!text) return;
  const lower = text.toLowerCase();
  for (const { phrase, reason } of FORBIDDEN_PHRASES) {
    if (lower.includes(phrase)) {
      violations.push({
        ref,
        field,
        type: 'FORBIDDEN_CLAIM',
        detail: `Contains "${phrase}" — ${reason}`
      });
    }
  }
}

async function runContentAudit() {
  console.log('\n======================================================');
  console.log('       VERNIKA ENTERPRISES - CATALOG CONTENT AUDIT     ');
  console.log('======================================================\n');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const seedPath = path.resolve(process.cwd(), 'scripts/products.seed.json');
  if (!fs.existsSync(seedPath)) {
    console.error(`Catalog seed not found at ${seedPath}`);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  console.log(`Auditing all ${products.length} products...\n`);

  const violations: AuditViolation[] = [];
  const seenSlugs = new Set<string>();

  for (const p of products) {
    const ref = p.ref || 'UNKNOWN';

    // 1. Slug check
    if (!p.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) {
      violations.push({
        ref,
        field: 'slug',
        type: 'INVALID_DATA',
        detail: `Invalid or non-URL-safe slug: "${p.slug}"`
      });
    }
    if (seenSlugs.has(p.slug)) {
      violations.push({
        ref,
        field: 'slug',
        type: 'INVALID_DATA',
        detail: `Duplicate slug detected: "${p.slug}"`
      });
    }
    seenSlugs.add(p.slug);

    // 2. Pricing & Stock
    const price = p.price ?? p.pricePaise;
    if (typeof price !== 'number' || price <= 0 || !Number.isInteger(price)) {
      violations.push({
        ref,
        field: 'price',
        type: 'INVALID_DATA',
        detail: `Invalid price ${price} paise (must be positive integer)`
      });
    }

    if (typeof p.stock !== 'number' || p.stock < 0 || !Number.isInteger(p.stock)) {
      violations.push({
        ref,
        field: 'stock',
        type: 'INVALID_DATA',
        detail: `Invalid stock ${p.stock} (must be non-negative integer)`
      });
    }

    // 3. Dimensions
    if (!p.dimensions?.displayString || p.dimensions.displayString.trim().length === 0) {
      violations.push({
        ref,
        field: 'dimensions',
        type: 'INVALID_DATA',
        detail: 'Missing dimensions displayString'
      });
    }

    // 4. Forbidden claims scan
    checkText(p.name, ref, 'name', violations);
    checkText(p.description, ref, 'description', violations);
    checkText(p.story, ref, 'story', violations);
    checkText(p.material, ref, 'material', violations);
    checkText(p.technique, ref, 'technique', violations);
    if (Array.isArray(p.tags)) {
      p.tags.forEach((tag: string) => checkText(tag, ref, 'tags', violations));
    }

    // 5. Images check
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
      violations.push({
        ref,
        field: 'images',
        type: 'INVALID_DATA',
        detail: 'Product has no images defined'
      });
    } else {
      for (const img of p.images) {
        if (!img.alt || img.alt.trim().length < 5) {
          violations.push({
            ref,
            field: 'images.alt',
            type: 'EMPTY_ALT',
            detail: `Missing or insufficient alt text for image ${img.url}`
          });
        }

        if (img.url && img.url.startsWith('/')) {
          const localPath = path.join(process.cwd(), 'public', img.url.replace(/^\//, ''));
          if (!fs.existsSync(localPath)) {
            violations.push({
              ref,
              field: 'images.url',
              type: 'MISSING_IMAGE',
              detail: `Image file does not exist on disk: public${img.url}`
            });
          }
        }
      }
    }
  }

  console.log('-------------------------------------------------------------------------------------------------------');
  console.log(
    'REF'.padEnd(8) +
    'TYPE'.padEnd(20) +
    'FIELD'.padEnd(16) +
    'VIOLATION DETAIL'
  );
  console.log('-------------------------------------------------------------------------------------------------------');

  if (violations.length === 0) {
    console.log('\x1b[32mALL 66 PRODUCTS PASSED CONTENT INTEGRITY AUDIT (0 VIOLATIONS)\x1b[0m');
    console.log('-------------------------------------------------------------------------------------------------------\n');
    process.exit(0);
  } else {
    for (const v of violations) {
      console.log(
        v.ref.padEnd(8) +
        v.type.padEnd(20) +
        v.field.padEnd(16) +
        v.detail
      );
    }
    console.log('-------------------------------------------------------------------------------------------------------\n');
    console.error(`❌ Content audit failed with ${violations.length} violations.`);
    process.exit(1);
  }
}

runContentAudit().catch(err => {
  console.error('Fatal content audit error:', err);
  process.exit(1);
});
