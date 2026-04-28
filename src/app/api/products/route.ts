/**
 * GET /api/products
 * Returns all active products from D1.
 * Query params:
 *   ?collection=slug  — filter by collection slug
 *   ?discovery=true   — only discovery set products
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products, collections } from '@/db';
import { eq, and } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { env } = getRequestContext();
    const { searchParams } = new URL(req.url);
    const discoveryOnly = searchParams.get('discovery') === 'true';
    const collectionSlug = searchParams.get('collection');

    const db = getDb(env.DB);

    let rows;

    if (discoveryOnly) {
      rows = await db
        .select()
        .from(products)
        .where(and(eq(products.active, true), eq(products.isDiscoverySet, true)))
        .orderBy(products.index)
        .all();
    } else if (collectionSlug) {
      const collection = await db
        .select()
        .from(collections)
        .where(eq(collections.slug, collectionSlug))
        .get();

      if (!collection) {
        return NextResponse.json({ products: [] });
      }

      rows = await db
        .select()
        .from(products)
        .where(and(eq(products.active, true), eq(products.collectionId, collection.id)))
        .orderBy(products.index)
        .all();
    } else {
      rows = await db
        .select()
        .from(products)
        .where(and(eq(products.active, true), eq(products.isDiscoverySet, false)))
        .orderBy(products.index)
        .all();
    }

    return NextResponse.json({ products: rows });
  } catch (err) {
    console.error('[api/products]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
