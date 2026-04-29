export const runtime = 'edge';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, products } from '@/db';
import { eq, and } from 'drizzle-orm';
import { formatINR } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Shop — YUN Atelier',
  description:
    'Explore the four signature fragrances of YUN. Mogra, oud, sandalwood and chai. Crafted in small batches in India.',
  openGraph: {
    title: 'Shop — YUN Atelier',
    description: 'Four signature fragrances from the YUN atelier.',
  },
};

export default async function ShopPage() {
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  // Regular fragrances — exclude discovery sets
  const fragrances = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.isDiscoverySet, false)))
    .orderBy(products.index)
    .all();

  // Discovery set — shown separately at the bottom
  const discoverySet = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.isDiscoverySet, true)))
    .get();

  return (
    <div className="bg-transparent pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="block h-px w-12 bg-foreground/40" />
              <span className="eyebrow text-foreground/60">Édition N°01</span>
            </div>
            <h1 className="h-display mt-6 text-[14vw] leading-[0.9] md:text-[8vw] lg:text-[120px]">
              The collection
            </h1>
          </div>
          <div className="hidden font-mono text-sm text-muted-foreground md:block">
            {String(fragrances.length).padStart(2, '0')} /{' '}
            {String(fragrances.length).padStart(2, '0')}
          </div>
        </div>

        {/* Regular Fragrances Grid */}
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {fragrances.map((f, i) => (
            <Link
              key={f.id}
              href={`/shop/${f.slug}`}
              className={`group block ${i % 2 === 1 ? 'md:mt-32' : ''}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {f.imageUrl ? (
                  <Image
                    src={f.imageUrl}
                    alt={f.name}
                    fill
                    className="object-contain transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05] p-4 bg-black/60"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <div className="absolute left-5 top-5 font-mono text-xs mix-blend-difference text-white">
                  N°{String(f.index ?? i + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-3xl font-light md:text-4xl">{f.name}</h2>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{formatINR(f.price / 100)}</div>
                  <div className="eyebrow mt-1 text-muted-foreground">{f.size ?? '50 ml'}</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {f.tagline}
              </p>
            </Link>
          ))}
        </div>

        {/* Discovery Set — separate dedicated section */}
        {discoverySet && (
          <section className="mt-40 border-t border-foreground/10 pt-20">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-black/60 rounded-sm">
                {discoverySet.imageUrl ? (
                  <Image
                    src={discoverySet.imageUrl}
                    alt={discoverySet.name}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="font-mono text-xs text-foreground/20 tracking-widest">NO IMAGE</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="space-y-8">
                <div>
                  <div className="eyebrow text-accent mb-4">Begin here</div>
                  <h2 className="h-display text-5xl font-light md:text-6xl lg:text-7xl">
                    {discoverySet.name}
                  </h2>
                  <p className="mt-6 font-display text-xl italic font-light text-foreground/70 md:text-2xl">
                    {discoverySet.tagline}
                  </p>
                </div>
                <p className="text-foreground/60 leading-relaxed max-w-md">
                  {discoverySet.description}
                </p>
                <div className="flex items-center gap-8 pt-4">
                  <span className="font-mono text-3xl">{formatINR(discoverySet.price / 100)}</span>
                  <Link
                    href="/shop/discovery-set"
                    className="bg-foreground px-10 py-4 text-sm tracking-wider text-background hover:bg-accent transition-all"
                  >
                    EXPLORE SET
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
