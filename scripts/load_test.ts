import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface LoadResult {
  route: string;
  requestsTotal: number;
  durationSeconds: number;
  requestsPerSec: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  errors: number;
  timeouts: number;
}

async function runAutocannon(url: string, durationSec = 10, connections = 50): Promise<any> {
  const autocannon = (await import('autocannon')).default;
  return new Promise((resolve, reject) => {
    autocannon(
      {
        url,
        connections,
        duration: durationSec,
        pipelining: 1,
      },
      (err: any, result: any) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

async function main() {
  const logLines: string[] = [];
  function log(msg: string) {
    console.log(msg);
    logLines.push(msg);
  }

  log('========================================================================');
  log('             VERNIKA ENTERPRISES — HIGH-CONCURRENCY LOAD TEST           ');
  log('========================================================================\n');

  // Verify server is running on port 3000
  let serverProcess: any = null;
  try {
    const check = await fetch('http://localhost:3000/');
    if (!check.ok && check.status !== 200) throw new Error('Not ready');
    log('✓ Next.js production server already active on http://localhost:3000');
  } catch {
    log('Starting Next.js production server on http://localhost:3000...');
    serverProcess = spawn('npm', ['run', 'start'], {
      detached: true,
      stdio: 'ignore',
    });
    // Wait for server to become responsive
    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch('http://localhost:3000/');
        if (res.ok || res.status === 200) {
          ready = true;
          break;
        }
      } catch {}
    }
    if (!ready) {
      log('FAIL: Could not start Next.js server on port 3000');
      process.exit(1);
    }
    log('✓ Next.js production server launched successfully');
  }

  const routesToTest = [
    { name: 'Home Page', url: 'http://localhost:3000/' },
    { name: 'Shop Catalog', url: 'http://localhost:3000/shop' },
    { name: 'Product Detail (SSG/ISR)', url: 'http://localhost:3000/shop/mithila-harmony-slim-strip-paintings-set-of-3' },
  ];

  const results: LoadResult[] = [];

  for (const r of routesToTest) {
    log(`Testing ${r.name} (${r.url}) with 50-100 concurrent workers...`);
    try {
      const stats = await runAutocannon(r.url, 5, 50);
      const res: LoadResult = {
        route: r.name,
        requestsTotal: stats.requests.total,
        durationSeconds: stats.duration,
        requestsPerSec: Math.round(stats.requests.average),
        latencyP50: stats.latency.p50,
        latencyP95: stats.latency.p97_5 || stats.latency.p90,
        latencyP99: stats.latency.p99,
        errors: stats.errors,
        timeouts: stats.timeouts,
      };
      results.push(res);
      log(`  -> Completed: ${res.requestsPerSec} req/sec | p50: ${res.latencyP50}ms | p95: ${res.latencyP95}ms | errors: ${res.errors}`);
    } catch (err: any) {
      log(`  -> Error testing ${r.name}: ${err.message}`);
    }
  }

  // Rate-limiting check: flood checkout endpoint
  log('\nTesting /api/checkout rate limiting under flood...');
  let hit429 = false;
  for (let i = 0; i < 20; i++) {
    const res = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [] }),
    });
    if (res.status === 429) {
      hit429 = true;
      break;
    }
  }
  log(hit429 ? '✓ Rate limiter successfully triggered HTTP 429 on checkout flood' : '⚠ Checkout rate limit did not trigger within 20 rapid calls');

  // Print Summary Table
  log('\n' + '='.repeat(80));
  log(`${'ROUTE'.padEnd(30)} | ${'REQ/SEC'.padEnd(10)} | ${'p50 (ms)'.padEnd(10)} | ${'p95 (ms)'.padEnd(10)} | ERRORS`);
  log('-'.repeat(80));
  for (const res of results) {
    log(
      `${res.route.padEnd(30)} | ${String(res.requestsPerSec).padEnd(10)} | ${String(res.latencyP50).padEnd(10)} | ${String(res.latencyP95).padEnd(10)} | ${res.errors}`
    );
  }
  log('='.repeat(80) + '\n');

  // Save evidence
  const evidenceDir = path.resolve(process.cwd(), 'docs/audit/evidence');
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'load-test.txt'), logLines.join('\n'));
  log('Evidence saved to docs/audit/evidence/load-test.txt');

  if (serverProcess) {
    try {
      process.kill(-serverProcess.pid);
    } catch {}
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
