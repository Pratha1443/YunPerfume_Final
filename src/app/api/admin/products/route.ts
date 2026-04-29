/**
 * POST /api/admin/products
 * Creates a new product in D1.
 * Required: Admin session
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { nanoid } from 'nanoid';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = getSessionFromCookies(cookieHeader);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return NextResponse.json({ error: 'Config error' }, { status: 500 });

    const payload = await verifyJWT(token, jwtSecret);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);
    const body = await req.json() as any;

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!body.price || isNaN(Number(body.price))) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    const id = `prod_${nanoid(10)}`;

    // Generate slug — append short id suffix to avoid collisions
    const baseSlug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || nanoid(6);

    // Check if slug already exists — append suffix if so
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, baseSlug))
      .get();
    const slug = existing ? `${baseSlug}-${nanoid(4)}` : baseSlug;

    await db.insert(products).values({
      id,
      slug,
      name: body.name.trim(),
      tagline: body.tagline?.trim() || null,
      description: body.description?.trim() || '',
      price: Math.round(Number(body.price) * 100), // INR → paise
      stock: Number(body.stock) || 0,
      active: body.active !== undefined ? Boolean(body.active) : true,
      imageUrl: body.imageUrl || null,
      size: body.size?.trim() || '50ml',
      index: body.index?.trim() || null,
      isDiscoverySet: Boolean(body.isDiscoverySet) || false,
      scentNotes: body.scentNotes || null,
    });

    return NextResponse.json({ success: true, id, slug });
  } catch (err: any) {
    console.error('[api/admin/products POST]', err);
    // Return the actual error message to help debug
    return NextResponse.json(
      { error: err?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
