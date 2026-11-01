import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectToDatabase } from './db';
import { User } from '@/models/User';

const ADMIN_SECRET = process.env.NEXTAUTH_SECRET || 'vernika-secret-key-production-change-this';
const ADMIN_COOKIE_NAME = 've_admin_session';

/**
 * Creates a signed admin session token
 */
export function createAdminSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    role: 'admin',
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const b64Payload = Buffer.from(payload).toString('base64');
  const signature = crypto.createHmac('sha256', ADMIN_SECRET).update(b64Payload).digest('hex');

  return `${b64Payload}.${signature}`;
}

/**
 * Verifies admin session token timing-safely
 */
export function verifyAdminSessionToken(token: string): { email: string; role: string } | null {
  try {
    const [b64Payload, signature] = token.split('.');
    if (!b64Payload || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', ADMIN_SECRET).update(b64Payload).digest('hex');

    const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    if (!isValid) return null;

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64').toString('utf-8'));
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side check for Next.js App Router API routes
 */
export async function verifyAdminRequest(req?: Request): Promise<boolean> {
  // 1. Check Authorization header
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const session = verifyAdminSessionToken(token);
      if (session && session.role === 'admin') return true;
    }
  }

  // 2. Check HttpOnly cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      const session = verifyAdminSessionToken(token);
      if (session && session.role === 'admin') return true;
    }
  } catch {
    // In standalone route handlers where cookies() might not be available
  }

  return false;
}

/**
 * Validates admin credentials against DB or fallback .env
 */
export async function authenticateAdmin(email: string, passwordPlain: string): Promise<boolean> {
  const adminEmailEnv = (process.env.ADMIN_EMAIL || 'vernikaenterprises14@gmail.com').toLowerCase();

  // 1. Check against User model in MongoDB
  try {
    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (user && user.passwordHash) {
      const match = await bcrypt.compare(passwordPlain, user.passwordHash);
      if (match) return true;
    }
  } catch (err) {
    console.warn('DB check for admin failed, checking env fallback:', err);
  }

  // 2. Fallback check: default initial password for initial bootstrap
  const aEmail = Buffer.from(email.toLowerCase());
  const bEmail = Buffer.from(adminEmailEnv);
  const emailMatches = aEmail.length === bEmail.length && crypto.timingSafeEqual(aEmail, bEmail);

  if (emailMatches) {
    const envPassword = process.env.ADMIN_INITIAL_PASSWORD || 'VernikaArt@2026';
    const aPass = Buffer.from(passwordPlain);
    const bPass = Buffer.from(envPassword);
    if (aPass.length === bPass.length && crypto.timingSafeEqual(aPass, bPass)) {
      return true;
    }
  }

  return false;
}
