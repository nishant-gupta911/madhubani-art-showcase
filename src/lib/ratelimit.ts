import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory fallback map for environments without Upstash Redis configured
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

function memoryRateLimit(identifier: string, limit: number, windowSeconds: number): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.expiresAt < now) {
    memoryStore.set(identifier, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: false,
    });
  } catch (err) {
    console.warn('Failed to initialize Upstash Redis, falling back to in-memory rate limiting:', err);
  }
}

/**
 * Universal rate limit checker
 * @param identifier IP or user identifier
 * @param limit max requests allowed in window
 * @param windowSeconds window in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit = 15,
  windowSeconds = 60
): Promise<{ success: boolean; remaining: number }> {
  if (upstashRatelimit) {
    try {
      const res = await upstashRatelimit.limit(identifier);
      return { success: res.success, remaining: res.remaining };
    } catch (err) {
      console.error('[SECURITY] Upstash rate limit call failed, falling back to local instance limiter:', err);
      return memoryRateLimit(identifier, limit, windowSeconds);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[CRITICAL SECURITY WARNING] Upstash Redis is UNSET in production mode! Distributed rate-limiting is inactive across multi-region serverless instances.'
    );
  }

  return memoryRateLimit(identifier, limit, windowSeconds);
}
