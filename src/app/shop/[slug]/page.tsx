"use client";

export const runtime = "edge";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";
import { gsap } from "gsap";
import type { InferSelectModel } from "drizzle-orm";
import type { products } from "@/db/schema";

type Product = InferSelectModel<typeof products>;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SIZES = [
  { label: "10 ml", multiplier: 0.35 },
  { label: "50 ml", multiplier: 1 },
  { label: "100 ml", multiplier: 1.75 },
];

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const { add } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Partial<Product>[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState(SIZES[1]);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data: { product?: Product; related?: Partial<Product>[]; error?: string }) => {
        if (!data.product) { setLoading(false); return; }
        setProduct(data.product);
        setRelated(data.related ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.set(".product-fade", { opacity: 0, y: 20 });
      gsap.to(".product-fade", {
        opacity: 1, y: 0, duration: 1.2, stagger: 0.08,
        ease: "power3.out", clearProps: "all",
      });
    });
    return () => ctx.revert();
  }, [product]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-mono text-xs tracking-widest text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!product) return notFound();

  // Price stored in paise, display in rupees
  const basePrice = product.price / 100;
  const price = Math.round(basePrice * size.multiplier);

  // Parse scent notes from JSON string
  let notes: { top: string[]; heart: string[]; base: string[] } = {
    top: [], heart: [], base: [],
  };
  try {
    if (product.scentNotes) notes = JSON.parse(product.scentNotes);
  } catch { /* use empty */ }

  return (
    <div className="relative min-h-screen bg-transparent pt-24 md:pt-32 overflow-hidden noise">
      {/* Atmospheric glows */}
      <div className="absolute top-0 right-0 -z-10 w-[70vw] h-[70vw] bg-accent/15 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] -z-10 w-[50vw] h-[50vw] bg-accent/10 blur-[130px] rounded-full" />
      <div className="absolute top-[20%] left-[10%] -z-10 w-[30vw] h-[30vw] bg-accent/5 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Link
          href="/shop"
          className="eyebrow inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors product-fade"
        >
          <span className="text-lg">←</span> All fragrances
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-20">
          {/* Product image */}
          <div className="relative product-fade">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 rounded-sm ring-1 ring-foreground/10">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                <div className="absolute left-6 top-6 font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
                  Edition N°{String(product.index ?? 1).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="md:py-8">
            <div className="product-fade">
              <div className="eyebrow text-accent">{product.scentFamily}</div>
              <h1 className="h-display mt-3 text-6xl font-light md:text-7xl lg:text-8xl">
                {product.name}
              </h1>
              <p className="mt-6 font-display text-2xl italic font-light text-foreground/90 md:text-3xl">
                {product.tagline}
              </p>
            </div>

            <div className="mt-10 product-fade">
              <p className="leading-relaxed text-foreground/70 text-lg max-w-lg">{product.story}</p>
            </div>

            <div className="mt-12 hairline product-fade" />

            {/* Size selector */}
            <div className="mt-10 product-fade">
              <div className="eyebrow mb-4 text-foreground/40 text-[10px]">Select Size</div>
              <div className="flex gap-3">
                {SIZES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSize(s)}
                    className={`flex-1 border py-4 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                      size.label === s.label
                        ? "border-accent bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent),0.2)]"
                        : "border-foreground/10 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + Add to bag */}
            <div className="mt-10 flex items-center justify-between product-fade">
              <div className="font-mono text-3xl font-light">{formatINR(price)}</div>
              <button
                onClick={() =>
                  add({
                    id: `${product.id}-${size.label}`,
                    name: product.name,
                    price,
                    size: size.label,
                    image: product.imageUrl ?? "",
                  })
                }
                className="group relative bg-foreground px-12 py-5 text-[11px] font-medium tracking-[0.3em] text-background transition-all hover:bg-accent hover:text-accent-foreground"
              >
                ADD TO BAG
              </button>
            </div>

            <div className="mt-16 hairline product-fade" />

            {/* Scent notes */}
            {(notes.top.length > 0 || notes.heart.length > 0 || notes.base.length > 0) && (
              <div className="mt-10 space-y-8 product-fade">
                {notes.top.length > 0 && <NoteRow label="Top" notes={notes.top} />}
                {notes.heart.length > 0 && <NoteRow label="Heart" notes={notes.heart} />}
                {notes.base.length > 0 && <NoteRow label="Base" notes={notes.base} />}
              </div>
            )}

            <div className="mt-16 hairline product-fade" />
            <div className="mt-10 grid grid-cols-2 gap-8 text-[11px] text-foreground/50 product-fade">
              <div>
                <div className="eyebrow mb-3 text-foreground/70">Shipping</div>
                <div className="leading-relaxed">
                  Complimentary courier service across India. Delivery within 2–5 business days.
                </div>
              </div>
              <div>
                <div className="eyebrow mb-3 text-foreground/70">Atelier</div>
                <div className="leading-relaxed">
                  Individually poured and numbered in our small-batch Pune studio.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-40 border-t border-foreground/10 pt-20 pb-32">
            <div className="mb-12">
              <div className="eyebrow text-accent">Deepen the ritual</div>
              <h2 className="h-display mt-4 text-5xl font-light md:text-6xl">Further Explorations</h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              {related.map((o) => (
                <Link key={o.id} href={`/shop/${o.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 rounded-sm">
                    {o.imageUrl ? (
                      <Image
                        src={o.imageUrl}
                        alt={o.name ?? ""}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <div className="font-display text-3xl font-light">{o.name}</div>
                      <div className="eyebrow mt-2 text-foreground/40">{o.scentFamily}</div>
                    </div>
                    <div className="font-mono text-[11px] text-foreground/60">
                      {o.price ? formatINR(o.price / 100) : ""}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function NoteRow({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-8">
      <div className="eyebrow text-foreground/30 text-[10px]">{label}</div>
      <div className="font-display text-2xl font-light tracking-wide text-foreground/90">
        {notes.join(" · ")}
      </div>
    </div>
  );
}
