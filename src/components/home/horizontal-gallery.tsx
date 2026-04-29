"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

export interface GalleryProduct {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  scentFamily: string | null;
  price: number;
  index: string | null;
  hue: string | null;
}

interface HorizontalGalleryProps {
  products: GalleryProduct[];
}

export function HorizontalGallery({ products }: HorizontalGalleryProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current || !pinRef.current || !trackRef.current) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current!;
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const mainTl = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            pin: pinRef.current,
            start: "top top",
            end: () => `+=${getDistance() * 0.75}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>(".gallery-image").forEach((img) => {
          gsap.to(img, {
            x: 60,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: mainTl,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        });
      }, triggerRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={triggerRef}
      className="relative w-full bg-background overflow-hidden"
      aria-label="Fragrance collection"
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full flex flex-col justify-center overflow-hidden"
      >
        {/* Header Info */}
        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-24 md:px-10 md:pt-28 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="block h-px w-12 bg-foreground/20" />
            <span className="eyebrow text-foreground/60">The collection</span>
          </div>
          <div className="eyebrow font-mono text-foreground/40">
            {String(products.length).padStart(2, "0")} fragrances
          </div>
        </div>

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="horizontal-track flex items-center gap-8 pl-[10vw] pr-[25vw] md:gap-16 lg:gap-20"
        >
          {products.map((f, i) => (
            <Link
              key={f.id}
              href={`/shop/${f.slug}`}
              className="group relative block h-[65vh] w-[80vw] flex-none md:w-[45vw] lg:w-[35vw]"
            >
              <div className="relative h-full w-full overflow-hidden bg-black/60 rounded-sm">
                {/* Image */}
                <div className="gallery-image absolute inset-0">
                  {f.imageUrl ? (
                    <Image
                      src={f.imageUrl}
                      alt={f.name}
                      fill
                      className="object-contain transition-transform duration-1000 group-hover:scale-105 p-4"
                      sizes="(max-width: 768px) 80vw, 35vw"
                      priority={i === 0}
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: f.hue
                          ? `linear-gradient(135deg, ${f.hue}30, ${f.hue}10)`
                          : "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
                      }}
                    />
                  )}
                </div>

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                {/* Metadata */}
                <div className="absolute left-6 top-6 font-mono text-[9px] tracking-widest text-foreground/40 uppercase">
                  N°{f.index ?? String(i + 1).padStart(2, "0")} —{" "}
                  {f.scentFamily}
                </div>

                <div className="absolute inset-x-6 bottom-8 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-4xl font-light tracking-tight md:text-5xl">
                      {f.name}
                    </h3>
                  </div>
                  <div className="font-mono text-[10px] tracking-tighter text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
                    {formatINR(f.price / 100)}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Discovery Set CTA Card */}
          <div className="flex h-[65vh] w-[60vw] flex-none items-center md:w-[35vw]">
            <div className="max-w-xs pl-10 border-l border-foreground/10 py-4">
              <div className="eyebrow text-accent text-[10px]">
                Atelier Experience
              </div>
              <h3 className="h-display mt-6 text-5xl font-light leading-[1] md:text-6xl">
                The Full <br /> Discovery.
              </h3>
              <p className="mt-8 text-sm leading-relaxed text-foreground/50 text-pretty">
                Experience all four scents in 2ml vials. The perfect
                introduction to the world of YUN.
              </p>
              <Link
                href="/shop"
                className="eyebrow mt-12 group relative inline-flex items-center gap-4 py-2 hover:text-accent transition-colors"
              >
                <span className="relative z-10">Visit Shop</span>
                <span className="block h-px w-8 bg-accent/40 transition-all group-hover:w-16 group-hover:bg-accent" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
