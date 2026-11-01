import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminRequest } from '@/lib/auth';

/**
 * Signed Cloudinary upload endpoint.
 * Protects Cloudinary API credentials while allowing Natasha's phone
 * to upload high-resolution artwork photos directly to Cloudinary CDN.
 */
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'vernika-art';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret || !apiKey) {
      return NextResponse.json({
        configured: false,
        message: 'Cloudinary credentials not configured in .env.local. Direct local asset paths can be used.',
        cloudName,
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'vernika_art/products';

    // Cloudinary signature calculation: sorted parameters string hashed with apiSecret
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return NextResponse.json({
      configured: true,
      timestamp,
      signature,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signature generation failed' }, { status: 500 });
  }
}
