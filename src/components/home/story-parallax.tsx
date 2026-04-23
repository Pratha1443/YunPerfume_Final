"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import botanicals from "@/assets/story-botanicals.jpg";
import craft from "@/assets/story-craft.jpg";

export function StoryParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.2;
        gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade-up]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-transparent py-[18vh]">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:grid-cols-12 md:gap-12 md:px-10">
        <div className="md:col-span-5 md:pt-[20vh]">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <div data-parallax="0.4" className="absolute -top-[20%] left-0 h-[140%] w-full">
              <Image
                src={botanicals}
                alt="Marigold and jasmine on silk"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="flex items-center gap-4" data-fade-up>
            <span className="block h-px w-12 bg-foreground/40" />
            <span className="eyebrow text-foreground/60">From the source</span>
          </div>
          <h2 data-fade-up className="h-display mt-6 text-[12vw] leading-[0.95] md:text-[6vw] lg:text-[88px]">
            Materials, &nbsp;
            <em className="font-display italic font-light">unhurried.</em>
          </h2>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <p data-fade-up className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Mogra harvested before sunrise in Tamil Nadu. Sandalwood, slow-distilled from Mysore.
              Oud aged for years in clay jars in Assam. Each fragrance starts with a single grower,
              a single field, a single season.
            </p>
            <p data-fade-up className="text-base leading-relaxed text-muted-foreground md:text-lg">
              We do not chase trends. We make four fragrances. Each one takes between four and
              eighteen months to compose. None of them will ever be reformulated.
            </p>
          </div>

          <div className="mt-16 overflow-hidden md:mt-24">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <div data-parallax="0.3" className="absolute -top-[15%] left-0 h-[130%] w-full">
                <Image
                  src={craft}
                  alt="Hands of a perfumer pouring oil"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
