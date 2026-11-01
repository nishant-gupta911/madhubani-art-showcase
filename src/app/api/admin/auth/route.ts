import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSessionToken, verifyAdminRequest } from '@/lib/auth';
import { checkRateLimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    // Login Rate Limiting: Max 5 attempts per 15 minutes per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`admin_login_${ip}`, 5, 900);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const isValid = await authenticateAdmin(email, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = createAdminSessionToken(email);

    const res = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: { email, name: 'Natasha Gupta', role: 'admin' },
    });

    // Set secure cookie
    res.cookies.set('ve_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, role: 'admin' });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  res.cookies.delete('ve_admin_session');
  return res;
}
