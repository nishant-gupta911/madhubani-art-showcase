import { NextRequest, NextResponse } from 'next/server';
import { releaseExpiredOrdersStock } from '@/lib/stock';

export async function GET(req: NextRequest) {
  return handleStockRelease(req);
}

export async function POST(req: NextRequest) {
  return handleStockRelease(req);
}

async function handleStockRelease(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, enforce security
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const apiKey = req.nextUrl.searchParams.get('key');
      if (apiKey !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
      }
    }

    const result = await releaseExpiredOrdersStock();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Stock release failed' }, { status: 500 });
  }
}
