/**
 * PATCH /api/admin/products/[id]
 * Updates an existing product in D1.
 * Required: Admin session
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { eq } from 'drizzle-orm';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updateData: any = { ...body };
    
    if (updateData.price !== undefined) {
      updateData.price = Math.round(Number(updateData.price) * 100);
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning()
      .get();

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error('[api/admin/products PATCH]', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
