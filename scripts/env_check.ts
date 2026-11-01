import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

interface CheckResult {
  variable: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  tag: 'REAL' | 'SIMULATED' | 'MISSING';
  details: string;
}

async function checkEnv() {
  const results: CheckResult[] = [];
  const logLines: string[] = [];

  function log(str: string) {
    console.log(str);
    logLines.push(str);
  }

  log('========================================================================');
  log('           VERNIKA ENTERPRISES — ENVIRONMENT CONNECTIVITY AUDIT         ');
  log('========================================================================\n');

  // 1. MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    results.push({ variable: 'MONGODB_URI', status: 'FAIL', tag: 'MISSING', details: 'Unset in .env.local' });
  } else {
    const isAtlas = mongoUri.includes('.mongodb.net');
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      const ping = await mongoose.connection.db?.admin().ping();
      results.push({
        variable: 'MONGODB_URI',
        status: isAtlas ? 'PASS' : 'WARN',
        tag: isAtlas ? 'REAL' : 'SIMULATED',
        details: isAtlas
          ? `Connected to MongoDB Atlas (ping ok: ${JSON.stringify(ping)})`
          : `Connected to Localhost MongoDB (${mongoUri}) — NOT Atlas. Valid for local dev, Atlas required for production audits.`,
      });
      await mongoose.disconnect();
    } catch (err: any) {
      results.push({
        variable: 'MONGODB_URI',
        status: 'FAIL',
        tag: 'MISSING',
        details: `Connection error: ${err.message}`,
      });
    }
  }

  // 2. NEXT_PUBLIC_SITE_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && (siteUrl.startsWith('http://') || siteUrl.startsWith('https://'))) {
    results.push({ variable: 'NEXT_PUBLIC_SITE_URL', status: 'PASS', tag: 'REAL', details: siteUrl });
  } else {
    results.push({ variable: 'NEXT_PUBLIC_SITE_URL', status: 'FAIL', tag: 'MISSING', details: 'Must be a valid URL' });
  }

  // 3. NEXT_PUBLIC_SELLER_CITY
  const sellerCity = process.env.NEXT_PUBLIC_SELLER_CITY;
  if (!sellerCity || sellerCity.includes('[YOUR CITY]')) {
    results.push({
      variable: 'NEXT_PUBLIC_SELLER_CITY',
      status: 'FAIL',
      tag: 'MISSING',
      details: 'Unset or contains placeholder "[YOUR CITY]"',
    });
  } else {
    results.push({ variable: 'NEXT_PUBLIC_SELLER_CITY', status: 'PASS', tag: 'REAL', details: sellerCity });
  }

  // 4. NEXT_PUBLIC_SELLER_STATE
  const sellerState = process.env.NEXT_PUBLIC_SELLER_STATE;
  if (sellerState) {
    results.push({ variable: 'NEXT_PUBLIC_SELLER_STATE', status: 'PASS', tag: 'REAL', details: sellerState });
  } else {
    results.push({ variable: 'NEXT_PUBLIC_SELLER_STATE', status: 'WARN', tag: 'SIMULATED', details: 'Defaults to Bihar' });
  }

  // 5. ADMIN_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && adminEmail.includes('@')) {
    results.push({ variable: 'ADMIN_EMAIL', status: 'PASS', tag: 'REAL', details: adminEmail });
  } else {
    results.push({ variable: 'ADMIN_EMAIL', status: 'FAIL', tag: 'MISSING', details: 'Invalid or missing admin email' });
  }

  // 6. ADMIN_PASSWORD_HASH
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (adminHash && (adminHash.startsWith('$2a$') || adminHash.startsWith('$2b$') || adminHash.startsWith('$argon2'))) {
    results.push({ variable: 'ADMIN_PASSWORD_HASH', status: 'PASS', tag: 'REAL', details: 'Valid bcrypt/argon2 hash present' });
  } else {
    results.push({
      variable: 'ADMIN_PASSWORD_HASH',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Missing bcrypt hash. Run `npm run admin:create` to generate one. Dev fallback active.',
    });
  }

  // 7. SESSION_SECRET
  const sessionSecret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (sessionSecret && sessionSecret.length >= 32) {
    results.push({ variable: 'SESSION_SECRET', status: 'PASS', tag: 'REAL', details: 'Secret length >= 32 chars' });
  } else {
    results.push({
      variable: 'SESSION_SECRET',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset or <32 characters. Generated runtime fallback active in development.',
    });
  }

  // 8. RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET
  const rzpKeyId = process.env.RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  if (rzpKeyId && rzpSecret) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/payments?count=1', {
        headers: { Authorization: authHeader },
      });
      if (rzpRes.ok || rzpRes.status === 200) {
        results.push({
          variable: 'RAZORPAY_KEYS',
          status: 'PASS',
          tag: 'REAL',
          details: `Authenticated with Razorpay Test API (${rzpKeyId.startsWith('rzp_test') ? 'TEST MODE' : 'LIVE MODE'})`,
        });
      } else {
        const errorData = await rzpRes.json().catch(() => ({}));
        results.push({
          variable: 'RAZORPAY_KEYS',
          status: 'FAIL',
          tag: 'MISSING',
          details: `Razorpay rejected credentials: ${JSON.stringify(errorData)}`,
        });
      }
    } catch (err: any) {
      results.push({
        variable: 'RAZORPAY_KEYS',
        status: 'WARN',
        tag: 'SIMULATED',
        details: `Network error reaching Razorpay: ${err.message}`,
      });
    }
  } else {
    results.push({
      variable: 'RAZORPAY_KEYS',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Keys missing. Dev simulated payment adapter active.',
    });
  }

  // 9. RAZORPAY_WEBHOOK_SECRET
  const rzpWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (rzpWebhookSecret) {
    results.push({ variable: 'RAZORPAY_WEBHOOK_SECRET', status: 'PASS', tag: 'REAL', details: 'Present' });
  } else {
    results.push({
      variable: 'RAZORPAY_WEBHOOK_SECRET',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset. Set in Razorpay Dashboard for live webhook signature verification.',
    });
  }

  // 10. CLOUDINARY
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudKey = process.env.CLOUDINARY_API_KEY;
  const cloudSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && cloudKey && cloudSecret) {
    results.push({ variable: 'CLOUDINARY', status: 'PASS', tag: 'REAL', details: `Configured for cloud: ${cloudName}` });
  } else {
    results.push({
      variable: 'CLOUDINARY',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset. Mock direct upload adapter active in development.',
    });
  }

  // 11. RESEND
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    results.push({ variable: 'RESEND_API_KEY', status: 'PASS', tag: 'REAL', details: 'Present' });
  } else {
    results.push({
      variable: 'RESEND',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset. Console logger mock email adapter active.',
    });
  }

  // 12. UPSTASH
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    results.push({ variable: 'UPSTASH_REDIS', status: 'PASS', tag: 'REAL', details: `Configured: ${upstashUrl}` });
  } else {
    results.push({
      variable: 'UPSTASH_REDIS',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset. In-memory sliding-window rate limiter active.',
    });
  }

  // 13. CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    results.push({ variable: 'CRON_SECRET', status: 'PASS', tag: 'REAL', details: 'Present' });
  } else {
    results.push({
      variable: 'CRON_SECRET',
      status: 'WARN',
      tag: 'SIMULATED',
      details: 'Unset. Development cron fallback open.',
    });
  }

  // PRINT SUMMARY TABLE
  log(
    `${'VARIABLE'.padEnd(25)} | ${'STATUS'.padEnd(6)} | ${'TAG'.padEnd(9)} | DETAILS`
  );
  log('-'.repeat(80));
  for (const r of results) {
    log(
      `${r.variable.padEnd(25)} | ${r.status.padEnd(6)} | ${r.tag.padEnd(9)} | ${r.details}`
    );
  }
  log('========================================================================\n');

  // Save evidence
  const evidenceDir = path.resolve(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'env-check.txt'), logLines.join('\n'));
  log(`Evidence saved to docs/audit/evidence/env-check.txt`);

  return results;
}

checkEnv().catch((e) => {
  console.error(e);
  process.exit(1);
});
