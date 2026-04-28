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

    const id = `prod_${nanoid(10)}`;
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await db.insert(products).values({
      id,
      slug,
      name: body.name,
      tagline: body.tagline || null,
      description: body.description || '',
      price: Math.round(Number(body.price) * 100), // convert INR to paise
      stock: Number(body.stock) || 0,
      active: body.active !== undefined ? body.active : true,
      imageUrl: body.imageUrl || null,
      scentFamily: body.scentFamily || null,
      concentration: body.concentration || null,
      size: body.size || '50ml',
      hue: body.hue || null,
      index: body.index || null,
      story: body.story || null,
      isDiscoverySet: body.isDiscoverySet || false,
      scentNotes: body.scentNotes || null, // expects stringified JSON
    });

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('[api/admin/products POST]', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
