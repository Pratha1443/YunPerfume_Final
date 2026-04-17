import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { fragrances } from "@/lib/fragrances";
import { formatINR } from "@/lib/cart-store";

export function HorizontalGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getDistance = () => track.scrollWidth - window.innerWidth;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
        }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ink text-ivory"
      aria-label="Fragrance collection"
    >
      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 pt-24 md:px-10 md:pt-28">
        <div className="flex items-center gap-4">
          <span className="block h-px w-12 bg-ivory/40" />
          <span className="eyebrow text-ivory/60">The collection</span>
        </div>
        <div className="eyebrow font-mono text-ivory/50">04 fragrances</div>
      </div>

      <div
        ref={trackRef}
        className="horizontal-track flex h-full items-center gap-6 pl-[8vw] pr-[8vw] md:gap-12"
      >
        {fragrances.map((f) => (
          <Link
            key={f.id}
            to="/shop/$slug"
            params={{ slug: f.slug }}
            className="group relative block h-[68vh] w-[70vw] flex-none md:w-[42vw] lg:w-[34vw]"
          >
            <div className="relative h-full w-full overflow-hidden bg-ivory/5">
              <img
                src={f.image}
                alt={f.name}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                loading="lazy"
                width={1024}
                height={1280}
              />
              <div className="absolute left-5 top-5 font-mono text-xs text-ivory/70">N°{f.index}</div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl font-light leading-tight md:text-4xl">{f.name}</div>
                  <div className="eyebrow mt-2 text-ivory/60">{f.family}</div>
                </div>
                <div className="font-mono text-sm">{formatINR(f.price)}</div>
              </div>
            </div>
          </Link>
        ))}
        <div className="flex h-[68vh] w-[60vw] flex-none items-center md:w-[34vw]">
          <div className="max-w-sm">
            <div className="eyebrow text-ivory/60">End of collection</div>
            <h3 className="h-display mt-4 text-5xl font-light md:text-6xl">
              Begin with a discovery set.
            </h3>
            <p className="mt-4 text-sm text-ivory/70">
              All four fragrances in 2ml vials. A patient introduction to the house of YUN.
            </p>
            <Link
              to="/shop"
              className="eyebrow mt-8 inline-block border-b border-ivory pb-1 hover:text-accent"
            >
              Visit the shop →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
