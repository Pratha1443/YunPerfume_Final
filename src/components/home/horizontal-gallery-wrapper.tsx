/**
 * Server component wrapper for HorizontalGallery.
 * Fetches live products from D1 and passes them as props to the client component.
 */

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { eq, and } from 'drizzle-orm';
import { HorizontalGallery } from './horizontal-gallery';
import type { GalleryProduct } from './horizontal-gallery';

export async function HorizontalGalleryWrapper() {
  try {
    const { env } = getRequestContext();
    if (!env?.DB) return <HorizontalGallery products={[]} />;

    const db = getDb(env.DB);
    const fragrances = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        imageUrl: products.imageUrl,
        scentFamily: products.scentFamily,
        price: products.price,
        index: products.index,
        hue: products.hue,
      })
      .from(products)
      .where(and(eq(products.active, true), eq(products.isDiscoverySet, false)))
      .orderBy(products.index)
      .all();

    return <HorizontalGallery products={fragrances as GalleryProduct[]} />;
  } catch {
    // Fallback to empty on error — gallery handles it gracefully
    return <HorizontalGallery products={[]} />;
  }
}
