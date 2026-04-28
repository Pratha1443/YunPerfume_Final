import { MetadataRoute } from 'next';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yunperfume.com';

  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Fetch active products
  const activeProducts = await db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.active, true))
    .all();

  const productUrls = activeProducts.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/atelier`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/discovery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ];
}
