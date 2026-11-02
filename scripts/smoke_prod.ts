import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface SmokeCheck {
  name: string;
  url: string;
  validate: (res: Response, text: string) => Promise<boolean> | boolean;
  expected: string;
}

const checks: SmokeCheck[] = [
  {
    name: 'Home Route (/)',
    url: '/',
    validate: (res, text) => res.status === 200 && text.includes('<h1') && text.includes('Vernika'),
    expected: 'Status 200, contains <h1> and Vernika'
  },
  {
    name: 'Shop Route (/shop)',
    url: '/shop',
    validate: (res, text) => res.status === 200 && text.includes('Madhubani Art'),
    expected: 'Status 200, contains catalog title'
  },
  {
    name: 'Category Route (/shop/category/paintings)',
    url: '/shop/category/paintings',
    validate: (res, text) => res.status === 200 && text.includes('Paintings'),
    expected: 'Status 200, contains Paintings category'
  },
  {
    name: 'Gallery Route (/gallery)',
    url: '/gallery',
    validate: (res, text) => res.status === 200 && (text.includes('Gallery') || text.includes('GALLERY') || text.includes('Portfolio')),
    expected: 'Status 200, contains gallery content'
  },
  {
    name: 'About Route (/about)',
    url: '/about',
    validate: (res, text) => res.status === 200 && text.includes('About the Art'),
    expected: 'Status 200, contains About the Art'
  },
  {
    name: 'Order Track Route (/track)',
    url: '/track',
    validate: (res, text) => res.status === 200 && (text.includes('Track') || text.includes('Order')),
    expected: 'Status 200, contains order tracking'
  },
  {
    name: 'Cart Route (/cart)',
    url: '/cart',
    validate: (res, text) => res.status === 200 && text.includes('Cart'),
    expected: 'Status 200, contains cart heading'
  },
  {
    name: 'Privacy Policy (/privacy)',
    url: '/privacy',
    validate: (res, text) => res.status === 200 && text.includes('Privacy Policy'),
    expected: 'Status 200, contains Privacy Policy'
  },
  {
    name: 'Sitemap (/sitemap.xml)',
    url: '/sitemap.xml',
    validate: (res, text) => res.status === 200 && text.includes('<urlset') && text.includes('<loc>'),
    expected: 'Status 200, valid XML sitemap'
  },
  {
    name: 'Robots.txt (/robots.txt)',
    url: '/robots.txt',
    validate: (res, text) => res.status === 200 && /user-agent/i.test(text),
    expected: 'Status 200, valid robots.txt'
  },
  {
    name: 'Public Products API (/api/products)',
    url: '/api/products',
    validate: (res, text) => {
      try {
        const json = JSON.parse(text);
        return res.status === 200 && json.success === true && Array.isArray(json.products) && json.products.length > 0;
      } catch {
        return false;
      }
    },
    expected: 'Status 200, returns non-empty JSON product array'
  },
  {
    name: 'Health API (/api/health)',
    url: '/api/health',
    validate: (res, text) => {
      try {
        const json = JSON.parse(text);
        return res.status === 200 && json.status === 'ok';
      } catch {
        return false;
      }
    },
    expected: 'Status 200, json { status: "ok" }'
  },
  {
    name: 'Admin API Security Gate (/api/admin/products)',
    url: '/api/admin/products',
    validate: (res) => res.status === 401,
    expected: 'Status 401 Unauthorized without session cookie'
  },
  {
    name: 'Security Headers & CSP',
    url: '/',
    validate: (res) => {
      const csp = res.headers.get('content-security-policy') || '';
      return (
        csp.includes("default-src 'self'") ||
        csp.includes('razorpay.com') ||
        csp.includes('cloudinary.com')
      );
    },
    expected: 'Includes CSP directive with razorpay/cloudinary allowances'
  }
];

async function runSmokeTests() {
  console.log('\n======================================================');
  console.log('         VERNIKA PRODUCTION SMOKE TEST SUITE          ');
  console.log('======================================================\n');
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  let allPassed = true;

  console.log('-------------------------------------------------------------------------------------------------------');
  console.log(
    'ENDPOINT / CHECK'.padEnd(45) +
    'STATUS'.padEnd(12) +
    'LATENCY'.padEnd(12) +
    'DETAILS'
  );
  console.log('-------------------------------------------------------------------------------------------------------');

  for (const check of checks) {
    const fullUrl = new URL(check.url, BASE_URL).toString();
    const start = Date.now();
    try {
      const res = await fetch(fullUrl, {
        headers: { 'User-Agent': 'VernikaSmokeTest/1.0' },
        redirect: 'follow'
      });
      const text = await res.text();
      const latency = Date.now() - start;

      const passed = await check.validate(res, text);
      const statusLabel = passed ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';

      console.log(
        check.name.padEnd(45) +
        statusLabel.padEnd(21) +
        `${latency}ms`.padEnd(12) +
        (passed ? check.expected : `Validation failed: expected ${check.expected}`)
      );

      if (!passed) allPassed = false;
    } catch (err: any) {
      const latency = Date.now() - start;
      console.log(
        check.name.padEnd(45) +
        '\x1b[31mERROR\x1b[0m'.padEnd(21) +
        `${latency}ms`.padEnd(12) +
        `Network error: ${err.message}`
      );
      allPassed = false;
    }
  }

  console.log('-------------------------------------------------------------------------------------------------------\n');

  if (allPassed) {
    console.log('✅ ALL PRODUCTION SMOKE CHECKS PASSED.');
    process.exit(0);
  } else {
    console.error('❌ ONE OR MORE PRODUCTION SMOKE CHECKS FAILED.');
    process.exit(1);
  }
}

runSmokeTests().catch(err => {
  console.error('Fatal smoke test runner error:', err);
  process.exit(1);
});
