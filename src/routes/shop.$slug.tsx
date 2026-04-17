import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findFragrance, fragrances } from "@/lib/fragrances";
import { formatINR, useCart } from "@/lib/cart-store";
import { useState } from "react";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const fragrance = findFragrance(params.slug);
    if (!fragrance) throw notFound();
    return { fragrance };
  },
  head: ({ loaderData }) => {
    const f = loaderData?.fragrance;
    return {
      meta: [
        { title: f ? `${f.name} — YUN` : "Fragrance — YUN" },
        { name: "description", content: f?.tagline ?? "A YUN fragrance." },
        { property: "og:title", content: f ? `${f.name} — YUN` : "Fragrance" },
        { property: "og:description", content: f?.tagline ?? "" },
        ...(f?.image ? [{ property: "og:image", content: f.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="text-center">
        <div className="font-display text-6xl font-light">Not in stock</div>
        <p className="mt-3 text-muted-foreground">This fragrance is no longer in our atelier.</p>
        <Link to="/shop" className="eyebrow mt-6 inline-block border-b border-foreground pb-1">
          See the collection →
        </Link>
      </div>
    </div>
  ),
  component: Product,
});

const SIZES = [
  { label: "10 ml", multiplier: 0.35 },
  { label: "50 ml", multiplier: 1 },
  { label: "100 ml", multiplier: 1.75 },
];

function Product() {
  const { fragrance } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState(SIZES[1]);
  const price = Math.round(fragrance.price * size.multiplier);

  const others = fragrances.filter((f) => f.id !== fragrance.id).slice(0, 3);

  return (
    <div className="bg-background pt-24 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Link to="/shop" className="eyebrow text-muted-foreground hover:text-foreground">
          ← All fragrances
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img src={fragrance.image} alt={fragrance.name} className="h-full w-full object-cover" />
                <div className="absolute left-5 top-5 font-mono text-xs text-foreground/60">
                  N°{fragrance.index}
                </div>
              </div>
            </div>
          </div>

          <div className="md:py-8">
            <div className="eyebrow text-muted-foreground">{fragrance.family}</div>
            <h1 className="h-display mt-3 text-6xl font-light md:text-7xl">{fragrance.name}</h1>
            <p className="mt-4 font-display text-2xl italic font-light text-foreground/80">
              {fragrance.tagline}
            </p>

            <p className="mt-8 leading-relaxed text-muted-foreground">{fragrance.story}</p>

            <div className="mt-10 hairline" />

            <div className="mt-8">
              <div className="eyebrow mb-3 text-muted-foreground">Size</div>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSize(s)}
                    className={`flex-1 border py-3 text-sm transition-colors ${
                      size.label === s.label
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="font-mono text-2xl">{formatINR(price)}</div>
              <button
                onClick={() =>
                  add({
                    id: `${fragrance.id}-${size.label}`,
                    name: fragrance.name,
                    price,
                    size: size.label,
                    image: fragrance.image,
                  })
                }
                className="bg-foreground px-10 py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent"
              >
                ADD TO BAG
              </button>
            </div>

            <div className="mt-12 hairline" />

            <div className="mt-8 space-y-6">
              <NoteRow label="Top" notes={fragrance.notes.top} />
              <NoteRow label="Heart" notes={fragrance.notes.heart} />
              <NoteRow label="Base" notes={fragrance.notes.base} />
            </div>

            <div className="mt-12 hairline" />
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <div className="eyebrow mb-2 text-foreground/70">Shipping</div>
                <div>2–4 working days across India. Free over ₹3,000.</div>
              </div>
              <div>
                <div className="eyebrow mb-2 text-foreground/70">Atelier</div>
                <div>Hand-blended in small batches in Bengaluru.</div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-32 border-t border-border/60 pt-16 pb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="eyebrow text-muted-foreground">Continue exploring</div>
              <h2 className="h-display mt-3 text-4xl font-light md:text-5xl">More from the house</h2>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                to="/shop/$slug"
                params={{ slug: o.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={o.image}
                    alt={o.name}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="font-display text-2xl font-light">{o.name}</div>
                    <div className="eyebrow mt-1 text-muted-foreground">{o.family}</div>
                  </div>
                  <div className="font-mono text-sm">{formatINR(o.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-6">
      <div className="eyebrow text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-light">{notes.join(" · ")}</div>
    </div>
  );
}
