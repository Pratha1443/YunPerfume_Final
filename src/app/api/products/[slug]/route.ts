/**
 * GET /api/products/[slug]
 * Returns a single product by slug from D1.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .get();

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Fetch other products for "You may also like" section
    const others = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        imageUrl: products.imageUrl,
        price: products.price,
        index: products.index,
      })
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.index)
      .all();

    const related = others.filter((p) => p.slug !== slug).slice(0, 3);

    return NextResponse.json({ product, related });
  } catch (err) {
    console.error('[api/products/[slug]]', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
