import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { releaseExpiredOrdersStock } from '@/lib/stock';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('productId');
    const ref = searchParams.get('ref');
    const slug = searchParams.get('slug');

    if (!id && !ref && !slug) {
      return NextResponse.json(
        { error: 'Provide at least one identifier: id, ref, or slug' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. Lazy cleanup: release any expired orders (>15m old)
    try {
      await releaseExpiredOrdersStock();
    } catch (cleanErr) {
      console.warn('Lazy stock release failed during availability check:', cleanErr);
    }

    // 2. Query product directly from database (bypassing any cache)
    const query: any = { deletedAt: null };
    if (id) {
      query.$or = [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id: id }].filter(Boolean);
    } else if (ref) {
      query.ref = ref;
    } else if (slug) {
      query.slug = slug;
    }

    const product = await Product.findOne(query).select('ref slug stock status price type leadTimeDays').lean();

    if (!product) {
      return NextResponse.json(
        { isAvailable: false, error: 'Product not found' },
        {
          status: 404,
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        }
      );
    }

    const isAvailable = (product.stock > 0 || product.type === 'made_to_order') && product.status === 'published';

    return NextResponse.json(
      {
        id: (product as any)._id.toString(),
        ref: product.ref,
        slug: product.slug,
        isAvailable,
        stock: product.stock,
        status: product.status,
        pricePaise: product.price,
        type: product.type,
        leadTimeDays: product.leadTimeDays || 0,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err: any) {
    console.error('Availability check failed:', err);
    return NextResponse.json(
      { error: 'Internal availability check error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Lazy cleanup
    try {
      await releaseExpiredOrdersStock();
    } catch (cleanErr) {
      console.warn('Lazy stock release failed in bulk availability check:', cleanErr);
    }

    const productIds = items.map((it: any) => it.productId || it.id || it.ref).filter(Boolean);
    const products = await Product.find({
      $or: [
        { _id: { $in: productIds.filter((p: string) => /^[0-9a-fA-F]{24}$/.test(p)) } },
        { id: { $in: productIds } },
        { ref: { $in: productIds } },
      ],
      deletedAt: null,
    })
      .select('ref slug stock status price type')
      .lean();

    const productMap = new Map();
    for (const p of products) {
      productMap.set((p as any)._id.toString(), p);
      productMap.set(p.ref, p);
    }

    const itemResults = items.map((it: any) => {
      const p = productMap.get(it.productId) || productMap.get(it.id) || productMap.get(it.ref);
      if (!p) {
        return {
          productId: it.productId || it.id,
          isAvailable: false,
          error: 'Not found',
        };
      }
      const requestedQty = it.quantity || 1;
      const canFulfill = (p.stock >= requestedQty || p.type === 'made_to_order') && p.status === 'published';
      return {
        productId: (p as any)._id.toString(),
        ref: p.ref,
        slug: p.slug,
        isAvailable: canFulfill,
        availableStock: p.stock,
        requestedQty,
        status: p.status,
        pricePaise: p.price,
      };
    });

    const allAvailable = itemResults.every((r: any) => r.isAvailable);

    return NextResponse.json(
      {
        allAvailable,
        items: itemResults,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err: any) {
    console.error('Bulk availability check failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
