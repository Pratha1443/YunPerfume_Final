import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fragrances } from "@/lib/fragrances";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop — YUN Atelier",
  description: "Explore the four signature fragrances of YUN. Mogra, oud, sandalwood and chai. Crafted in small batches in India.",
  openGraph: {
    title: "Shop — YUN Atelier",
    description: "Four signature fragrances from the YUN atelier.",
  },
};

export default function Shop() {
  return (
    <div className="bg-background pt-32 pb-32 md:pt-40">
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
            04 / 04
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {fragrances.map((f, i) => (
            <Link
              key={f.id}
              href={`/shop/${f.slug}`}
              className={`group block ${i % 2 === 1 ? "md:mt-32" : ""}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute left-5 top-5 font-mono text-xs mix-blend-difference text-white">
                  N°{f.index}
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-3xl font-light md:text-4xl">{f.name}</h2>
                  <div className="eyebrow mt-2 text-muted-foreground">{f.family}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{formatINR(f.price)}</div>
                  <div className="eyebrow mt-1 text-muted-foreground">50 ml</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {f.tagline}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
