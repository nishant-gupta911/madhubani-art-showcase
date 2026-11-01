import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { checkRateLimit } from '@/lib/ratelimit';
import { siteConfig } from '@/config/site';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20).optional(),
  subject: z.string().default('commission'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  artworkRef: z.string().max(50).optional(),
  dimensions: z.string().max(50).optional(),
  budget: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`contact_${ip}`, 5, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const inquiry = await Inquiry.create({
      ...validation.data,
      status: 'new',
    });

    console.log(`[INQUIRY] New commission request from ${inquiry.name} (${inquiry.email}) for "${inquiry.subject}"`);

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been received. Natasha Gupta will review your commission and reply within 24 hours.',
        inquiryId: inquiry._id.toString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Contact inquiry error:', err);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please try again or WhatsApp directly.' },
      { status: 500 }
    );
  }
}
