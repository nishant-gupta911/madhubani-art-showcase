import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Otp } from '@/models/Otp';
import { checkRateLimit } from '@/lib/ratelimit';
import { sendOtpEmail } from '@/lib/mail';

const SendOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian phone number required'),
  email: z.string().email().optional(),
  purpose: z.enum(['cod_verification', 'login']).default('cod_verification'),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const body = await req.json();

    const validation = SendOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid phone number', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { phone, email, purpose } = validation.data;

    // Rate limit: max 3 OTP requests per phone per 5 minutes
    const rateCheck = await checkRateLimit(`otp_${phone}`, 3, 300);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 5 minutes before trying again.' },
        { status: 429 }
      );
    }

    await connectToDatabase();

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing unused OTPs for this phone
    await Otp.deleteMany({ phone, purpose });

    await Otp.create({
      phone,
      otp: otpCode,
      purpose,
      verified: false,
      expiresAt,
    });

    // If customer email provided, dispatch OTP directly via Resend email
    if (email) {
      await sendOtpEmail({ toEmail: email, otpCode });
    }

    // In production, devOtp is NEVER returned
    const isProduction = process.env.NODE_ENV === 'production';

    return NextResponse.json({
      success: true,
      message: email
        ? `Verification code dispatched to your email (${email}) and phone.`
        : `Verification code dispatched to +91 ${phone.slice(0, 2)}****${phone.slice(-4)}`,
      ...(isProduction ? {} : { devOtp: otpCode }),
    });
  } catch (err: any) {
    console.error('OTP Send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send OTP' }, { status: 500 });
  }
}
