import fs from 'fs';
import path from 'path';

interface LintIssue {
  type: 'ERROR' | 'WARNING';
  category: string;
  location: string;
  description: string;
}

const FORBIDDEN_STRINGS = [
  '[YOUR CITY]',
  '[YOUR STATE]',
  '[PINCODE]',
  'lorem ipsum',
  'UNESCO',
];

const SCAN_DIRS = ['src', 'SRS'];
const IGNORE_PATTERNS = ['node_modules', '.next', '.git', 'dist', 'build', 'content_lint.ts'];

function scanFileContent(filePath: string, issues: LintIssue[]) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const token of FORBIDDEN_STRINGS) {
      if (line.includes(token)) {
        issues.push({
          type: 'ERROR',
          category: 'Forbidden Content Token',
          location: `${filePath}:${i + 1}`,
          description: `Contains forbidden token "${token}"`,
        });
      }
    }

    if (line.includes('TODO') && !filePath.includes('PROGRESS.md') && !filePath.includes('stage1-reverification.md')) {
      issues.push({
        type: 'ERROR',
        category: 'Unfinished Code Marker',
        location: `${filePath}:${i + 1}`,
        description: `Contains unfinished marker "TODO"`,
      });
    }
  }
}

function walkDir(dir: string, issues: LintIssue[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (IGNORE_PATTERNS.some((p) => fullPath.includes(p))) continue;

    if (entry.isDirectory()) {
      walkDir(fullPath, issues);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js|md|json)$/.test(entry.name)) {
      if (entry.name !== 'madhubaniProducts.json' && entry.name !== 'CHANGELOG.md') {
        scanFileContent(fullPath, issues);
      }
    }
  }
}

function auditCatalog(issues: LintIssue[]) {
  const catalogPath = path.resolve(process.cwd(), 'scripts/products.seed.json');
  if (!fs.existsSync(catalogPath)) {
    issues.push({
      type: 'ERROR',
      category: 'Catalog Missing',
      location: catalogPath,
      description: 'scripts/products.seed.json not found',
    });
    return;
  }

  const products = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  const seenSlugs = new Set<string>();

  for (const p of products) {
    const ref = p.ref || 'UNKNOWN';

    // Duplicate slugs
    if (seenSlugs.has(p.slug)) {
      issues.push({
        type: 'ERROR',
        category: 'Duplicate Slug',
        location: `Product Ref: ${ref}`,
        description: `Slug "${p.slug}" is duplicated in catalog.`,
      });
    }
    seenSlugs.add(p.slug);

    // Required fields
    if (!p.name || p.name.trim().length === 0) {
      issues.push({ type: 'ERROR', category: 'Missing Name', location: `Product Ref: ${ref}`, description: 'Empty artwork name' });
    }
    if (!p.price || p.price <= 0) {
      issues.push({ type: 'ERROR', category: 'Invalid Price', location: `Product Ref: ${ref}`, description: `Price ${p.price} must be > 0 paise` });
    }
    if (!p.technique) {
      issues.push({ type: 'ERROR', category: 'Missing Technique', location: `Product Ref: ${ref}`, description: 'Technique is missing' });
    }
    if (!p.dimensions?.displayString && !p.dimensions) {
      issues.push({ type: 'ERROR', category: 'Missing Dimensions', location: `Product Ref: ${ref}`, description: 'Dimensions missing' });
    }
    if (p.leadTimeDays === undefined) {
      issues.push({ type: 'ERROR', category: 'Missing Lead Time', location: `Product Ref: ${ref}`, description: 'Lead time unset' });
    }

    // Images audit
    if (!p.images || p.images.length === 0) {
      issues.push({ type: 'ERROR', category: 'Missing Images', location: `Product Ref: ${ref}`, description: 'No images assigned to product' });
    } else {
      for (const img of p.images) {
        if (!img.alt || img.alt.trim().length === 0) {
          issues.push({ type: 'ERROR', category: 'Empty Alt Text', location: `Product Ref: ${ref}`, description: `Empty alt text on image ${img.filename}` });
        }
      }
    }
  }
}

function main() {
  const issues: LintIssue[] = [];
  const logLines: string[] = [];

  function log(msg: string) {
    console.log(msg);
    logLines.push(msg);
  }

  log('========================================================================');
  log('             VERNIKA ENTERPRISES — CONTENT & CATALOG LINT               ');
  log('========================================================================\n');

  // 1. Scan codebase for forbidden tokens
  for (const d of SCAN_DIRS) {
    if (fs.existsSync(d)) walkDir(d, issues);
  }

  // 2. Audit catalog data integrity
  auditCatalog(issues);

  // Output results
  if (issues.length === 0) {
    log('✓ ALL CHECKS PASSED: 0 forbidden tokens, 0 duplicate slugs, 0 missing product attributes.');
  } else {
    log(`Found ${issues.length} content lint issue(s):`);
    for (const issue of issues) {
      log(`[${issue.type}] ${issue.category} at ${issue.location}: ${issue.description}`);
    }
  }

  log('\n========================================================================');

  // Save evidence
  const evidenceDir = path.resolve(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'content-lint.txt'), logLines.join('\n'));
  log('Evidence saved to docs/audit/evidence/content-lint.txt');

  if (issues.some((i) => i.type === 'ERROR')) {
    process.exit(1);
  }
}

main();
