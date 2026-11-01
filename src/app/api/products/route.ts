import { NextResponse } from 'next/server';
import { getCachedProducts } from '@/lib/products';

export const revalidate = 60; // 60s ISR

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}
