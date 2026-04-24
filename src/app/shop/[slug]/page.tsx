"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { findFragrance, fragrances } from "@/lib/fragrances";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";
import { gsap } from "gsap";

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
  const fragrance = findFragrance(slug);

  if (!fragrance) {
    notFound();
  }

  const { add } = useCart();
  const [size, setSize] = useState(SIZES[1]);
  const price = Math.round(fragrance.price * size.multiplier);

  const others = fragrances.filter((f) => f.id !== fragrance.id).slice(0, 3);

  useEffect(() => {
    gsap.from(".product-fade", {
      opacity: 0,
      y: 20,
      duration: 1.2,
      stagger: 0.08,
      ease: "power3.out"
    });
  }, [slug]);

  return (
    <div className="relative min-h-screen bg-background pt-24 md:pt-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 -z-10 w-[50vw] h-[50vw] bg-accent/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40vw] h-[40vw] bg-accent/5 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Link 
          href="/shop" 
          className="eyebrow inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors product-fade"
        >
          <span className="text-lg">←</span> All fragrances
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative product-fade">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 rounded-sm ring-1 ring-foreground/10">
                <Image
                  src={fragrance.image}
                  alt={fragrance.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute left-6 top-6 font-mono text-[10px] tracking-widest text-foreground/40 uppercase">
                  Edition N°{fragrance.index}
                </div>
              </div>
            </div>
          </div>

          <div className="md:py-8">
            <div className="product-fade">
              <div className="eyebrow text-accent">{fragrance.family}</div>
              <h1 className="h-display mt-3 text-6xl font-light md:text-7xl lg:text-8xl">{fragrance.name}</h1>
              <p className="mt-6 font-display text-2xl italic font-light text-foreground/90 md:text-3xl">
                {fragrance.tagline}
              </p>
            </div>

            <div className="mt-10 product-fade">
              <p className="leading-relaxed text-foreground/70 text-lg max-w-lg">{fragrance.story}</p>
            </div>

            <div className="mt-12 hairline product-fade" />

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

            <div className="mt-10 flex items-center justify-between product-fade">
              <div className="font-mono text-3xl font-light">{formatINR(price)}</div>
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
                className="group relative bg-foreground px-12 py-5 text-[11px] font-medium tracking-[0.3em] text-background transition-all hover:bg-accent hover:text-accent-foreground"
              >
                ADD TO BAG
              </button>
            </div>

            <div className="mt-16 hairline product-fade" />

            <div className="mt-10 space-y-8 product-fade">
              <NoteRow label="Top" notes={fragrance.notes.top} />
              <NoteRow label="Heart" notes={fragrance.notes.heart} />
              <NoteRow label="Base" notes={fragrance.notes.base} />
            </div>

            <div className="mt-16 hairline product-fade" />
            <div className="mt-10 grid grid-cols-2 gap-8 text-[11px] text-foreground/50 product-fade">
              <div>
                <div className="eyebrow mb-3 text-foreground/70">Shipping</div>
                <div className="leading-relaxed">Complimentary courier service across India. Delivery within 2–5 business days.</div>
              </div>
              <div>
                <div className="eyebrow mb-3 text-foreground/70">Atelier</div>
                <div className="leading-relaxed">Individually poured and numbered in our small-batch Pune studio.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Discovery CTA / More from House */}
        <section className="mt-40 border-t border-foreground/10 pt-20 pb-32">
          <div className="mb-12">
            <div className="eyebrow text-accent">Deepen the ritual</div>
            <h2 className="h-display mt-4 text-5xl font-light md:text-6xl">Further Explorations</h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/shop/${o.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 rounded-sm">
                  <Image
                    src={o.image}
                    alt={o.name}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="font-display text-3xl font-light">{o.name}</div>
                    <div className="eyebrow mt-2 text-foreground/40">{o.family}</div>
                  </div>
                  <div className="font-mono text-[11px] text-foreground/60">{formatINR(o.price)}</div>
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
    <div className="grid grid-cols-[100px_1fr] gap-8">
      <div className="eyebrow text-foreground/30 text-[10px]">{label}</div>
      <div className="font-display text-2xl font-light tracking-wide text-foreground/90">{notes.join(" · ")}</div>
    </div>
  );
}

