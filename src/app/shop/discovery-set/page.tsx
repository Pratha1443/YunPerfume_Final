export const runtime = "edge";

import Image from "next/image";
import Link from "next/link";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb, products } from "@/db";
import { eq, and } from "drizzle-orm";
import { formatINR } from "@/lib/utils";
import { notFound } from "next/navigation";
import DiscoverySetClient from "./discovery-set-client";

export default async function DiscoverySetPage() {
  const { env } = getRequestContext();
  const db = getDb(env.DB);

  const discoverySet = await db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.isDiscoverySet, true)))
    .get();

  if (!discoverySet) return notFound();

  // Also fetch the regular fragrances to list "what's inside"
  const fragrances = await db
    .select({ id: products.id, name: products.name, index: products.index })
    .from(products)
    .where(and(eq(products.active, true), eq(products.isDiscoverySet, false)))
    .orderBy(products.index)
    .all();

  return (
    <div className="bg-transparent">
      {/* Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black">
        {discoverySet.imageUrl && (
          <Image
            src={discoverySet.imageUrl}
            alt={discoverySet.name}
            fill
            className="object-contain opacity-60 p-8"
            priority
            sizes="100vw"
          />
        )}
        <div className="relative z-10 text-center px-5 max-w-3xl">
          <div className="eyebrow text-foreground/70 mb-6">Begin here</div>
          <h1 className="h-display text-[14vw] leading-[0.9] md:text-[8vw] lg:text-[120px]">
            {discoverySet.name}
          </h1>
          <p className="mt-8 text-xl font-display italic text-foreground/80 md:text-2xl">
            {discoverySet.tagline}
          </p>
        </div>
      </section>

      {/* Detail Section */}
      <section className="mx-auto max-w-[1400px] px-5 py-[18vh] md:px-10">
        <div className="grid gap-16 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            <div className="eyebrow text-muted-foreground">The Experience</div>
            <h2 className="h-display text-5xl md:text-6xl font-light">
              Patience in <br />
              <em className="italic text-accent">small vials.</em>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>{discoverySet.description}</p>
            </div>

            <div className="pt-8 flex items-center gap-6">
              <span className="font-mono text-3xl">
                {formatINR(discoverySet.price / 100)}
              </span>
              {/* Client component handles add-to-cart */}
              <DiscoverySetClient product={discoverySet} />
            </div>
          </div>

          <div className="relative aspect-[4/5] bg-black/60 overflow-hidden rounded-sm">
            {discoverySet.imageUrl ? (
              <Image
                src={discoverySet.imageUrl}
                alt={discoverySet.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>
        </div>
      </section>

      {/* Inside the Kit */}
      {fragrances.length > 0 && (
        <section className="bg-transparent py-24 border-t border-border/60">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <div className="eyebrow mb-12">Inside the kit</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {fragrances.map((f) => (
                <Link
                  key={f.id}
                  href={`/shop/${f.id.replace("prod_", "").replace(/_/g, "-")}`}
                  className="py-8 border border-border/40 bg-card/50 hover:border-accent/50 transition-colors"
                >
                  <div className="font-mono text-xs text-accent mb-2">2ML SPRAY</div>
                  <div className="font-display text-xl">
                    {f.index ? `0${f.index} ` : ""}{f.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
