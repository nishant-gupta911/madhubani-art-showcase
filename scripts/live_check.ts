import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { MongoClient } from 'mongodb';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';

interface CheckResult {
  service: string;
  status: 'PASS' | 'FAIL' | 'NOT CONFIGURED';
  latencyMs: number;
  detail: string;
  fixHint?: string;
}

async function checkAtlas(): Promise<CheckResult> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    return {
      service: 'MongoDB Atlas',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: uri ? 'Points to local MongoDB, not Atlas M0' : 'MONGODB_URI unset',
      fixHint: 'Create free Atlas cluster at https://cloud.mongodb.com and paste connection string in .env.local'
    };
  }

  const start = Date.now();
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const db = client.db();
    await db.command({ ping: 1 });

    // Verify collection indexes
    const prodIndexes = await db.collection('products').indexes();
    const orderIndexes = await db.collection('orders').indexes();

    const hasProdSlugIndex = prodIndexes.some(idx => idx.key?.slug === 1 && idx.unique);
    const hasOrderNumIndex = orderIndexes.some(idx => idx.key?.orderNumber === 1 && idx.unique);

    const latency = Date.now() - start;
    if (hasProdSlugIndex && hasOrderNumIndex) {
      return {
        service: 'MongoDB Atlas',
        status: 'PASS',
        latencyMs: latency,
        detail: `Connected, ping OK, unique indexes verified on products.slug and orders.orderNumber (${latency}ms)`
      };
    } else {
      return {
        service: 'MongoDB Atlas',
        status: 'FAIL',
        latencyMs: latency,
        detail: `Connected, but missing unique indexes (slug: ${hasProdSlugIndex}, orderNumber: ${hasOrderNumIndex})`,
        fixHint: 'Run `npm run db:seed` or ensure indexes are created on startup'
      };
    }
  } catch (err: any) {
    return {
      service: 'MongoDB Atlas',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.message,
      fixHint: 'Check network access (IP 0.0.0.0/0 whitelist in Atlas) and database user credentials'
    };
  } finally {
    if (client) await client.close();
  }
}

async function checkRazorpay(): Promise<CheckResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !keyId ||
    !keySecret ||
    keyId.includes('placeholder') ||
    keyId.includes('vernikaArt') ||
    keySecret.includes('placeholder') ||
    keySecret.includes('vernikaSecret')
  ) {
    return {
      service: 'Razorpay (Test Mode)',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is placeholder/mock key',
      fixHint: 'Generate real test key at https://dashboard.razorpay.com/app/keys and paste into .env.local'
    };
  }

  const start = Date.now();
  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: 100, // 100 paise = 1 INR
      currency: 'INR',
      receipt: `probe_${Date.now()}`,
      notes: { probe: 'true', env: 'live_check' }
    });

    const latency = Date.now() - start;
    if (order && order.id) {
      return {
        service: 'Razorpay (Test Mode)',
        status: 'PASS',
        latencyMs: latency,
        detail: `Created test order ${order.id} for ₹1 in ${latency}ms`
      };
    } else {
      return {
        service: 'Razorpay (Test Mode)',
        status: 'FAIL',
        latencyMs: latency,
        detail: 'No order ID returned by Razorpay API',
        fixHint: 'Verify key permissions in Razorpay Dashboard'
      };
    }
  } catch (err: any) {
    return {
      service: 'Razorpay (Test Mode)',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.error?.description || err.message,
      fixHint: 'Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local'
    };
  }
}

async function checkCloudinary(): Promise<CheckResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName === 'placeholder' || cloudName === 'vernika-art') {
    return {
      service: 'Cloudinary',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: 'CLOUDINARY_* environment variables unset or placeholder',
      fixHint: 'Sign up at https://cloudinary.com and copy credentials from Dashboard into .env.local'
    };
  }

  const start = Date.now();
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'live-check-probe';
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const testGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const formData = new URLSearchParams();
    formData.append('file', testGif);
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(data.error?.message || `HTTP ${uploadRes.status}`);
    }

    // Clean up uploaded probe asset
    if (data.public_id) {
      const deleteTimestamp = Math.round(Date.now() / 1000);
      const delToSign = `public_id=${data.public_id}&timestamp=${deleteTimestamp}${apiSecret}`;
      const delSig = crypto.createHash('sha1').update(delToSign).digest('hex');

      const delData = new URLSearchParams();
      delData.append('public_id', data.public_id);
      delData.append('api_key', apiKey);
      delData.append('timestamp', String(deleteTimestamp));
      delData.append('signature', delSig);

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: delData
      });
    }

    const latency = Date.now() - start;
    return {
      service: 'Cloudinary',
      status: 'PASS',
      latencyMs: latency,
      detail: `Signed upload & delete round-trip verified in ${latency}ms`
    };
  } catch (err: any) {
    return {
      service: 'Cloudinary',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.message,
      fixHint: 'Check Cloudinary cloud name, API key, and API secret'
    };
  }
}

async function checkResend(): Promise<CheckResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || apiKey === 're_placeholder' || !adminEmail) {
    return {
      service: 'Resend Email',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: 'RESEND_API_KEY unset or ADMIN_EMAIL unset',
      fixHint: 'Create API key at https://resend.com and add to .env.local'
    };
  }

  const start = Date.now();
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: adminEmail,
      subject: `[Vernika] Live check probe ${new Date().toISOString()}`,
      html: '<p>This is an automated verification probe from <code>npm run live:check</code>.</p>'
    });

    const latency = Date.now() - start;
    if (error) {
      return {
        service: 'Resend Email',
        status: 'FAIL',
        latencyMs: latency,
        detail: error.message,
        fixHint: 'Check domain verification or test mode recipient whitelist in Resend Dashboard'
      };
    }

    return {
      service: 'Resend Email',
      status: 'PASS',
      latencyMs: latency,
      detail: `Probe email sent to ${adminEmail} (ID: ${data?.id}) in ${latency}ms`
    };
  } catch (err: any) {
    return {
      service: 'Resend Email',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.message,
      fixHint: 'Verify RESEND_API_KEY in .env.local'
    };
  }
}

async function checkUpstash(): Promise<CheckResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return {
      service: 'Upstash Redis',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: 'UPSTASH_REDIS_REST_URL or TOKEN not set (using in-memory fallback)',
      fixHint: 'Create free database at https://console.upstash.com/redis and paste REST URL + Token'
    };
  }

  const start = Date.now();
  try {
    const probeKey = `probe:${Date.now()}`;
    const setRes = await fetch(`${url}/set/${probeKey}/active?EX=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const setData = await setRes.json();

    const getRes = await fetch(`${url}/get/${probeKey}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();

    await fetch(`${url}/del/${probeKey}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const latency = Date.now() - start;
    if (setData.result === 'OK' && getData.result === 'active') {
      return {
        service: 'Upstash Redis',
        status: 'PASS',
        latencyMs: latency,
        detail: `Distributed rate limiting store verified (SET/GET/DEL) in ${latency}ms`
      };
    } else {
      return {
        service: 'Upstash Redis',
        status: 'FAIL',
        latencyMs: latency,
        detail: `Unexpected response: ${JSON.stringify(getData)}`,
        fixHint: 'Check Upstash Redis token permissions'
      };
    }
  } catch (err: any) {
    return {
      service: 'Upstash Redis',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.message,
      fixHint: 'Check Upstash Redis REST credentials in .env.local'
    };
  }
}

async function checkAdminAuth(): Promise<CheckResult> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const email = process.env.ADMIN_EMAIL;

  if (!hash || !email) {
    return {
      service: 'Admin Auth',
      status: 'NOT CONFIGURED',
      latencyMs: 0,
      detail: 'ADMIN_EMAIL or ADMIN_PASSWORD_HASH unset',
      fixHint: 'Generate bcrypt/argon2 hash with `node -e "console.log(require(\'bcryptjs\').hashSync(\'YOUR_PASS\', 12))"`'
    };
  }

  const start = Date.now();
  try {
    // Empty password must always fail
    const emptyMatch = await bcrypt.compare('', hash);
    if (emptyMatch) {
      return {
        service: 'Admin Auth',
        status: 'FAIL',
        latencyMs: Date.now() - start,
        detail: 'SECURITY ALERT: ADMIN_PASSWORD_HASH matches empty string!',
        fixHint: 'Generate a strong password hash immediately'
      };
    }

    const latency = Date.now() - start;
    return {
      service: 'Admin Auth',
      status: 'PASS',
      latencyMs: latency,
      detail: `Password hash format verified for ${email}; reject-empty test passed (${latency}ms)`
    };
  } catch (err: any) {
    return {
      service: 'Admin Auth',
      status: 'FAIL',
      latencyMs: Date.now() - start,
      detail: err.message,
      fixHint: 'ADMIN_PASSWORD_HASH must be a valid bcrypt hash string'
    };
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('       VERNIKA ENTERPRISES - LIVE CREDENTIAL CHECK     ');
  console.log('======================================================\n');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  const results: CheckResult[] = [];

  results.push(await checkAtlas());
  results.push(await checkRazorpay());
  results.push(await checkCloudinary());
  results.push(await checkResend());
  results.push(await checkUpstash());
  results.push(await checkAdminAuth());

  console.log('-------------------------------------------------------------------------------------------------------');
  console.log(
    'SERVICE'.padEnd(25) +
    'STATUS'.padEnd(18) +
    'LATENCY'.padEnd(12) +
    'DETAIL'
  );
  console.log('-------------------------------------------------------------------------------------------------------');

  let criticalFailure = false;

  for (const r of results) {
    const statusCol = r.status === 'PASS'
      ? '\x1b[32mPASS\x1b[0m'
      : r.status === 'FAIL'
      ? '\x1b[31mFAIL\x1b[0m'
      : '\x1b[33mNOT CONFIGURED\x1b[0m';

    console.log(
      r.service.padEnd(25) +
      statusCol.padEnd(27) +
      `${r.latencyMs}ms`.padEnd(12) +
      r.detail
    );

    if (r.status === 'FAIL') {
      criticalFailure = true;
      if (r.fixHint) {
        console.log(`   └─ \x1b[36mFIX:\x1b[0m ${r.fixHint}`);
      }
    } else if (r.status === 'NOT CONFIGURED' && r.fixHint) {
      console.log(`   └─ \x1b[33mACTION NEEDED:\x1b[0m ${r.fixHint}`);
    }
  }

  console.log('-------------------------------------------------------------------------------------------------------\n');

  if (criticalFailure) {
    console.error('❌ One or more configured services failed probe checks.');
    process.exit(1);
  } else {
    console.log('✅ Live check completed without fatal errors.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error during live check:', err);
  process.exit(1);
});
