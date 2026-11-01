import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { verifyAdminRequest } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const query: any = { deletedAt: null };
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * Mobile Quick-Add Product (Photo -> Name/Price -> Publish)
 */
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      category,
      subCategory,
      priceRupees,
      dimensions,
      imageUrl,
      type = 'stock_item',
      stock = 1,
      leadTimeDays = 0,
      description,
      story,
      tags = [],
    } = body;

    if (!name || !category || !priceRupees) {
      return NextResponse.json(
        { error: 'Name, Category, and Price in Rupees are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const pricePaise = Math.round(Number(priceRupees) * 100);
    const count = await Product.countDocuments();
    const refPrefix = category === 'paintings' ? 'P' : (category === 'dupattas' ? 'D' : 'B');
    const ref = `${refPrefix}${String(count + 1).padStart(2, '0')}`;

    let slug = slugify(name);
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const defaultImgUrl = imageUrl || '/products/1.webp';

    const newProduct = await Product.create({
      ref,
      name,
      slug,
      category,
      subCategory: subCategory || (category === 'paintings' ? 'fish' : (category === 'dupattas' ? 'womens_dupattas' : 'tote_bags')),
      type,
      stock: Number(stock),
      leadTimeDays: Number(leadTimeDays),
      price: pricePaise,
      dimensions: {
        displayString: dimensions || (category === 'paintings' ? '12 x 16 in (Framed)' : 'Standard'),
      },
      technique: 'handpainted',
      paintMedium: null,
      material: category === 'paintings' ? 'Handmade paper, framed' : 'Handloom cotton',
      isFramed: category === 'paintings',
      description: description || `Original Madhubani artwork "${name}" handpainted by Natasha Gupta.`,
      story: story || 'In Mithila tradition, this motif represents auspicious blessings and harmony.',
      tags: tags.length ? tags : ['Handmade', 'Madhubani', 'Vernika Art'],
      featured: false,
      status: 'published',
      images: [
        {
          url: defaultImgUrl,
          cardUrl: defaultImgUrl,
          filename: defaultImgUrl.split('/').pop() || 'product.webp',
          alt: name,
          isHero: true,
        },
      ],
    });

    // Invalidate ISR cache across all public storefront pages
    try { (revalidateTag as any)('products', 'max'); } catch {}

    return NextResponse.json({
      success: true,
      message: `Product "${newProduct.name}" published successfully!`,
      product: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, priceRupees, stock, status, featured } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const updateFields: any = {};
    if (priceRupees !== undefined) updateFields.price = Math.round(Number(priceRupees) * 100);
    if (stock !== undefined) updateFields.stock = Number(stock);
    if (status) updateFields.status = status;
    if (featured !== undefined) updateFields.featured = Boolean(featured);

    const updated = await Product.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    try { (revalidateTag as any)('products', 'max'); } catch {}

    return NextResponse.json({
      success: true,
      message: `Product "${updated.name}" updated`,
      product: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Product.findByIdAndUpdate(id, { $set: { deletedAt: new Date(), status: 'archived' } });
    try { (revalidateTag as any)('products', 'max'); } catch {}

    return NextResponse.json({ success: true, message: 'Product archived successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
